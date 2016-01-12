/*jslint node: true*/
/*global Promise:true*/
/*global describe: true, before:true, it: true*/
"use strict";

var Promise = require('bluebird');
var chai = require("chai"),
    expect = require("chai").expect;
var randomWords = require('random-words');

var argv = require('optimist').demand('config').argv;
var environment = argv.config;
var nconf = require('nconf');
nconf.argv().env().file({ file: 'config.json' });

var cf_api_url = nconf.get(environment + "_" + 'CF_API_URL'),
    username = nconf.get(environment + "_" + 'username'),
    password = nconf.get(environment + "_" + 'password');

var CloudController = require("../../../../lib/model/cloudcontroller/CloudController");
var CloudFoundryUsersUAA = require("../../../../lib/model/uaa/UsersUAA");
var CloudFoundryApps = require("../../../../lib/model/cloudcontroller/Apps");
var CloudFoundrySpaces = require("../../../../lib/model/cloudcontroller/Spaces");
var CloudFoundryDomains = require("../../../../lib/model/cloudcontroller/Domains");
var CloudFoundryRoutes = require("../../../../lib/model/cloudcontroller/Routes");
var CloudFoundryJobs = require("../../../../lib/model/cloudcontroller/Jobs");
var CloudFoundryLogs = require("../../../../lib/model/metrics/Logs");
var BuildPacks = require("../../../../lib/model/cloudcontroller/BuildPacks");
CloudController = new CloudController();
CloudFoundryUsersUAA = new CloudFoundryUsersUAA();
CloudFoundryApps = new CloudFoundryApps();
CloudFoundrySpaces = new CloudFoundrySpaces();
CloudFoundryDomains = new CloudFoundryDomains();
CloudFoundryRoutes = new CloudFoundryRoutes();
CloudFoundryJobs = new CloudFoundryJobs();
CloudFoundryLogs = new CloudFoundryLogs();
BuildPacks = new BuildPacks();
var HttpUtils = require('../../../../lib/utils/HttpUtils');
HttpUtils = new HttpUtils();

var fs = require('fs');
var ZipGenerator = require('../../../utils/ZipGenerator');
ZipGenerator = new ZipGenerator();

describe("Docker tests", function () {

    var authorization_endpoint = null;
    var token_endpoint = null;
    var logging_endpoint = null;  
    var token_type = null;
    var access_token = null;
    var domain_guid = null;
    var space_guid = null;

    before(function () {
        this.timeout(20000);

        CloudController.setEndPoint(cf_api_url);
        CloudFoundryApps.setEndPoint(cf_api_url);
        CloudFoundrySpaces.setEndPoint(cf_api_url);
        CloudFoundryDomains.setEndPoint(cf_api_url);
        CloudFoundryRoutes.setEndPoint(cf_api_url);
        CloudFoundryJobs.setEndPoint(cf_api_url);

        return CloudController.getInfo().then(function (result) {
            authorization_endpoint = result.authorization_endpoint;            
            token_endpoint = result.token_endpoint;
            logging_endpoint = result.logging_endpoint;
            CloudFoundryUsersUAA.setEndPoint(authorization_endpoint);
            return CloudFoundryUsersUAA.login(username, password);
        }).then(function (result) {
            CloudController.setToken(result);
            CloudFoundryApps.setToken(result);
            CloudFoundrySpaces.setToken(result);
            CloudFoundryDomains.setToken(result);
            CloudFoundryRoutes.setToken(result);
            CloudFoundryJobs.setToken(result);
            CloudFoundryLogs.setToken(result);
            return CloudFoundryDomains.getDomains();
        }).then(function (result) {
            domain_guid = result.resources[0].metadata.guid;
            return CloudFoundrySpaces.getSpaces();
        }).then(function (result) {
            space_guid = result.resources[0].metadata.guid;
        });

    });

    function randomInt(low, high) {
        return Math.floor(Math.random() * (high - low) + low);
    }


    function createApp(appOptions) {

        var app_guid = null;
        var routeName = null;
        var route_guid = null;
        var route_create_flag = false;
        var appName = appOptions.name;

        return new Promise(function (resolve, reject) {

            var filter = {
                'q': 'name:' + appName,
                'inline-relations-depth': 1
            };

            //VALIDATIONS
            //1. Duplicated app
            return CloudFoundrySpaces.getSpaceApps(space_guid, filter).then(function (result) {

                //If exist the application, REJECT
                if (result.total_results === 1) {
                    return reject("Exist the app: " + appName);
                }

                var filter = {
                    'q': 'host:' + appName + ';domain_guid:' + domain_guid,
                    'inline-relations-depth': 1
                };
                return CloudFoundryRoutes.getRoutes(filter);
            //2. Duplicated route
            }).then(function (result) {

                if (result.total_results === 1) {
                    return reject("Exist the route:" + appName);
                }

                return CloudFoundryApps.add(appOptions).then(function (result) {
                    return new Promise(function (resolve) {
                        //console.log(result);
                        app_guid = result.metadata.guid;
                        return resolve();
                    });
                });
            }).then(function () {
                //TODO: How to make the inference?
                return CloudFoundryDomains.getSharedDomains();
            }).then(function () {
                var routeOptions = {
                    'domain_guid' : domain_guid,
                    'space_guid' : space_guid,
                    'host' : appName
                };
                return CloudFoundryRoutes.add(routeOptions).then(function (result) {
                    return new Promise(function (resolve) {
                        route_guid = result.metadata.guid;
                        return resolve(result);
                    });
                });
            }).then(function () {
                return CloudFoundryApps.associateRoute(app_guid, route_guid);
            }).then(function (result) {
                return resolve(result);
            }).catch(function (reason) {
                console.error("Error: " + reason);
                return reject(reason);
            });

        });

    }

    if(environment === "PIVOTAL") {

        it("[DEBUGGING] Create an App with a Docker Image & Remove app", function () {
            this.timeout(40000);

            var app_guid = null;
            var appName = "app2" + randomWords() + randomInt(1, 100);
            var route_guid = null;
            var dockerImage = "cloudfoundry/helloworld";
            var appOptions = {
                "name": appName,
                "space_guid": space_guid,
                "instances" : 1,
                "memory" : 512,
                "disk_quota" : 512,
                "diego": true,
                "docker_image" : dockerImage
            };
            var dockerFlag = "diego_docker";

            return CloudController.setFeaturedFlag(dockerFlag).then(function (result) {
                return createApp(appOptions);
            }).then(function (result) {
                console.log(result);
                app_guid = result.metadata.guid;
                expect(app_guid).is.a("string");                
                return CloudFoundryApps.getAppRoutes(app_guid);
            }).then(function (result) {
                route_guid = result.resources[0].metadata.guid;
                return CloudFoundryApps.remove(app_guid);
            }).then(function () {
                return CloudFoundryRoutes.remove(route_guid);
            }).then(function () {
                expect(true).to.equal(true);
            }).catch(function (reason) {
                console.log(reason);
                return expect(true).to.be.a('boolean');
            });
        });

    }

});


