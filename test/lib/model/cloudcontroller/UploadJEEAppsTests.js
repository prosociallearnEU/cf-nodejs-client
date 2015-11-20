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

var CloudFoundry = require("../../../../lib/model/cloudcontroller/CloudFoundry");
var CloudFoundryUsersUAA = require("../../../../lib/model/uaa/UsersUAA");
var CloudFoundryApps = require("../../../../lib/model/cloudcontroller/Apps");
var CloudFoundrySpaces = require("../../../../lib/model/cloudcontroller/Spaces");
var CloudFoundryDomains = require("../../../../lib/model/cloudcontroller/Domains");
var CloudFoundryRoutes = require("../../../../lib/model/cloudcontroller/Routes");
var CloudFoundryJobs = require("../../../../lib/model/cloudcontroller/Jobs");
var BuildPacks = require("../../../../lib/model/cloudcontroller/BuildPacks");
CloudFoundry = new CloudFoundry();
CloudFoundryUsersUAA = new CloudFoundryUsersUAA();
CloudFoundryApps = new CloudFoundryApps();
CloudFoundrySpaces = new CloudFoundrySpaces();
CloudFoundryDomains = new CloudFoundryDomains();
CloudFoundryRoutes = new CloudFoundryRoutes();
CloudFoundryJobs = new CloudFoundryJobs();
BuildPacks = new BuildPacks();
var HttpUtils = require('../../../../lib/utils/HttpUtils');
HttpUtils = new HttpUtils();

var fs = require('fs');
var ZipGenerator = require('../../../utils/ZipGenerator');
ZipGenerator = new ZipGenerator();

describe("Cloud Foundry Upload JEE Apps", function () {

    var authorization_endpoint = null;
    var token_endpoint = null;
    var token_type = null;
    var access_token = null;
    var domain_guid = null;
    var space_guid = null;

    before(function () {
        this.timeout(15000);

        CloudFoundry.setEndPoint(cf_api_url);
        CloudFoundryApps.setEndPoint(cf_api_url);
        CloudFoundrySpaces.setEndPoint(cf_api_url);
        CloudFoundryDomains.setEndPoint(cf_api_url);
        CloudFoundryRoutes.setEndPoint(cf_api_url);
        CloudFoundryJobs.setEndPoint(cf_api_url);

        return CloudFoundry.getInfo().then(function (result) {
            authorization_endpoint = result.authorization_endpoint;            
            token_endpoint = result.token_endpoint;
            CloudFoundryUsersUAA.setEndPoint(authorization_endpoint);
            return CloudFoundryUsersUAA.login(username, password);
        }).then(function (result) {
            token_type = result.token_type;
            access_token = result.access_token;
            return CloudFoundryDomains.getDomains(token_type, access_token);
        }).then(function (result) {
            domain_guid = result.resources[0].metadata.guid;
            return CloudFoundrySpaces.getSpaces(token_type, access_token);
        }).then(function (result) {
            space_guid = result.resources[0].metadata.guid;
        });

    });

    function randomInt(low, high) {
        return Math.floor(Math.random() * (high - low) + low);
    }

    function createApp(token_type, access_token, appOptions) {

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
            return CloudFoundrySpaces.getSpaceApps(token_type, access_token, space_guid, filter).then(function (result) {

                //If exist the application, REJECT
                if (result.total_results === 1) {
                    return reject("Exist the app: " + appName);
                }

                var filter = {
                    'q': 'host:' + appName + ';domain_guid:' + domain_guid,
                    'inline-relations-depth': 1
                };
                return CloudFoundryRoutes.getRoutes(token_type, access_token, filter);
            //2. Duplicated route
            }).then(function (result) {

                if (result.total_results === 1) {
                    return reject("Exist the route:" + appName);
                }

                return CloudFoundryApps.add(token_type, access_token, appOptions).then(function (result) {
                    return new Promise(function (resolve) {
                        //console.log(result);
                        app_guid = result.metadata.guid;
                        return resolve();
                    });
                });
            }).then(function () {
                //TODO: How to make the inference?
                return CloudFoundryDomains.getSharedDomains(token_type, access_token);
            }).then(function () {
                var routeOptions = {
                    'domain_guid' : domain_guid,
                    'space_guid' : space_guid,
                    'host' : appName
                };
                return CloudFoundryRoutes.add(token_type, access_token, routeOptions).then(function (result) {
                    return new Promise(function (resolve) {
                        route_guid = result.metadata.guid;
                        return resolve(result);
                    });
                });
            }).then(function () {
                return CloudFoundryApps.associateRoute(token_type, access_token, app_guid, route_guid);
            }).then(function (result) {
                return resolve(result);
            }).catch(function (reason) {
                console.error("Error: " + reason);
                return reject(reason);
            });

        });

    }

    it("Create a Spring MVC 4 App, Upload the App & Remove app", function () {
        this.timeout(40000);

        var app_guid = null;
        var appName = "app2" + randomWords() + randomInt(1, 100);
        var zipPath = "./test_resources/SpringMVC_v4_AppExample.war";
        var javaBuildPack = BuildPacks.get("java");
        var route_guid = null;
        var appOptions = {
            "name": appName,
            "space_guid": space_guid,
            "instances" : 1,
            "memory" : 256,
            "disk_quota" : 256,
            "buildpack" : javaBuildPack
        };

        return createApp(token_type, access_token, appOptions).then(function (result) {
            app_guid = result.metadata.guid;
            expect(app_guid).is.a("string");
            expect(result.entity.buildpack).to.equal(javaBuildPack);

            return CloudFoundryApps.upload(token_type, access_token, app_guid, zipPath, false);
        }).then(function (result) {
            return CloudFoundryApps.getAppRoutes(token_type, access_token, app_guid);
        }).then(function (result) {
            route_guid = result.resources[0].metadata.guid;
            return CloudFoundryApps.remove(token_type, access_token, app_guid);
        }).then(function () {
            return CloudFoundryRoutes.remove(token_type, access_token, route_guid);
        }).then(function () {
            expect(true).to.equal(true);
        });
    });

    it("Create a Spring MVC 3 App, Upload the App & Remove app", function () {
        this.timeout(40000);

        var app_guid = null;
        var appName = "app2" + randomWords() + randomInt(1, 100);
        var zipPath = "./test_resources/SpringMVC_v3_AppExample.war";
        var javaBuildPack = BuildPacks.get("java");
        var route_guid = null;
        var appOptions = {
            "name": appName,
            "space_guid": space_guid,
            "instances" : 1,
            "memory" : 256,
            "disk_quota" : 256,
            "buildpack" : javaBuildPack
        };

        return createApp(token_type, access_token, appOptions).then(function (result) {
            app_guid = result.metadata.guid;
            expect(app_guid).is.a("string");
            expect(result.entity.buildpack).to.equal(javaBuildPack);

            return CloudFoundryApps.upload(token_type, access_token, app_guid, zipPath, false);
        }).then(function (result) {
            return CloudFoundryApps.getAppRoutes(token_type, access_token, app_guid);
        }).then(function (result) {
            route_guid = result.resources[0].metadata.guid;
            return CloudFoundryApps.remove(token_type, access_token, app_guid);
        }).then(function () {
            return CloudFoundryRoutes.remove(token_type, access_token, route_guid);
        }).then(function () {
            expect(true).to.equal(true);
        });
    });

    it.skip("[Tool] Create & deploy a JEE App", function () {
        this.timeout(40000);

        var app_guid = null;
        var appName = "apptest" + randomWords() + randomInt(1, 100);
        var zipPath = "./test_resources/helloController.war";
        var javaBuildPack = BuildPacks.get("java");
        var route_guid = null;
        var appOptions = {
            "name": appName,
            "space_guid": space_guid,
            "instances" : 1,
            "memory" : 512,
            "disk_quota" : 512,
            "buildpack" : javaBuildPack
        };

        return createApp(token_type, access_token, appOptions).then(function (result) {
            app_guid = result.metadata.guid;
            expect(app_guid).is.a("string");
            expect(result.entity.buildpack).to.equal(javaBuildPack);

            return CloudFoundryApps.upload(token_type, access_token, app_guid, zipPath, false);
        }).then(function (result) {
            return CloudFoundryApps.getAppRoutes(token_type, access_token, app_guid);
        }).then(function (result) {
            route_guid = result.resources[0].metadata.guid;
            expect(true).to.equal(true);
        });
    });

});


