/*jslint node: true*/

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

describe("Cloud Foundry Jobs", function () {
    "use strict";
    var authorization_endpoint = null;
    var token_endpoint = null;
    var token_type = null;
    var access_token = null;
    var domain_guid = null;
    var space_guid = null;

    before(function () {
        this.timeout(10000);

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
            CloudFoundryApps.setToken(result);
            CloudFoundrySpaces.setToken(result);
            CloudFoundryDomains.setToken(result);
            CloudFoundryRoutes.setToken(result);
            CloudFoundryJobs.setToken(result);            
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

    function sleep(time, callback) {
        var stop = new Date().getTime();
        while (new Date().getTime() < stop + time) {
            ;
        }
        callback();
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

    function recursiveCheckJobState(job_guid) {
        var counter = 0;
        var maximumLoops = 15;

        return new Promise(function check(resolve, reject) {

            CloudFoundryJobs.getJob(job_guid).then(function (result) {
                console.log(result.entity.status);
                //console.log(counter);
                if (result.entity.status === "finished") {
                    resolve(result);
                } else if (counter === maximumLoops) {
                    reject(new Error("Timeout Job"));
                } else {
                    //console.log("next try");
                    counter += 1;
                    setTimeout(check, 1000, resolve, reject);
                }
            });

        });

    }

    it("Create a Static App, Upload 1MB (async = false) zip & Remove app", function () {
        this.timeout(40000);

        var app_guid = null;
        var appName = "app2" + randomWords() + randomInt(1, 100);
        var staticBuildPack = BuildPacks.get("static");
        var zipPath = "./staticApp.zip";
        var weight = 1;//MB
        var compressionRate = 0;//No compression
        var job_guid = null;
        var job_status = null;
        var route_guid = null;
        var appOptions = {
            "name": appName,
            "space_guid": space_guid,
            "instances" : 1,
            "memory" : 32,
            "disk_quota" : 32,
            "buildpack" : staticBuildPack
        };       

        return createApp(appOptions).then(function (result) {
            app_guid = result.metadata.guid;
            expect(app_guid).is.a("string");
            expect(result.entity.buildpack).to.equal(staticBuildPack);
            return ZipGenerator.generate(zipPath, weight, compressionRate);
        }).then(function () {
            //Does exist the zip?   
            fs.exists(zipPath, function (result) {
                expect(result).to.equal(true);
            });
            return CloudFoundryApps.upload(app_guid, zipPath, true);
        }).then(function (result) {
            expect(result.metadata.guid).to.be.a('string');

            job_guid = result.metadata.guid;
            job_status = result.entity.status;

            return ZipGenerator.remove(zipPath);
        }).then(function (result) {
            fs.exists(zipPath, function (result) {
                expect(result).be.equal(false);
            });

            return recursiveCheckJobState(job_guid);
        }).then(function (result) {
            expect(result.metadata.guid).to.be.a('string');

            return CloudFoundryApps.getAppRoutes(app_guid);
        }).then(function (result) {
            route_guid = result.resources[0].metadata.guid;
            return CloudFoundryApps.remove(app_guid);
        }).then(function () {
            return CloudFoundryRoutes.remove(route_guid);
        }).then(function () {
            //console.log(result);
            expect(true).to.equal(true);
        });

    });

    it.skip("[OLD] Create a Static App, Upload 1MB (async = false) zip & Remove app", function () {
        this.timeout(40000);

        var app_guid = null;
        var appName = "app2" + randomWords() + randomInt(1, 100);
        var staticBuildPack = BuildPacks.get("static");
        var zipPath = "./staticApp.zip";
        var weight = 1;//MB
        var compressionRate = 0;//No compression
        var job_guid = null;
        var job_status = null;
        var route_guid = null;
        var appOptions = {
            "name": appName,
            "space_guid": space_guid,
            "instances" : 1,
            "memory" : 32,
            "disk_quota" : 32,
            "buildpack" : staticBuildPack
        };       

        return createApp(appOptions).then(function (result) {
            app_guid = result.metadata.guid;
            expect(app_guid).is.a("string");
            expect(result.entity.buildpack).to.equal(staticBuildPack);
            return ZipGenerator.generate(zipPath, weight, compressionRate);
        }).then(function () {
            //Does exist the zip?   
            fs.exists(zipPath, function (result) {
                expect(result).to.equal(true);
            });
            return CloudFoundryApps.upload(app_guid, zipPath, true);
        }).then(function (result) {
            expect(result.metadata.guid).to.be.a('string');

            job_guid = result.metadata.guid;
            job_status = result.entity.status;

            return ZipGenerator.remove(zipPath);
        }).then(function (result) {
            fs.exists(zipPath, function (result) {
                expect(result).be.equal(false);
            });

            if (job_status === "queued") {

                sleep(5000, function () {
                    console.log("5 second");
                });

                return CloudFoundryJobs.getJob(job_guid).then(function (result) {
                    return new Promise(function (resolve) {
                        var status = result.entity.status;
                        console.log(status);
                        resolve(result);
                    });
                });

            }

            return new Promise(function (resolve) {
                resolve(result);
            });

        }).then(function (result) {
            expect(result.metadata.guid).to.be.a('string');

            //console.log(result);
            job_guid = result.metadata.guid;
            job_status = result.entity.status;
            //console.log(result.metadata.guid);
            //console.log(result.entity.status);

            if (job_status === "queued") {

                sleep(5000, function () {
                    console.log("5 second");
                });

                return CloudFoundryJobs.getJob(job_guid).then(function (result) {
                    return new Promise(function (resolve) {
                        var status = result.entity.status;
                        console.log(status);
                        resolve(result);
                    });
                });
            }

            return new Promise(function (resolve) {
                resolve(result);
            });

        }).then(function (result) {
            expect(result.metadata.guid).to.be.a('string');

            job_guid = result.metadata.guid;
            job_status = result.entity.status;
            //console.log(result.metadata.guid);
            //console.log(result.entity.status);

            if (job_status === "queued") {

                sleep(5000, function () {
                    console.log("5 second");
                });

                return CloudFoundryJobs.getJob(job_guid).then(function (result) {
                    return new Promise(function (resolve) {
                        var status = result.entity.status;
                        console.log(status);
                        resolve(result);
                    });
                });

            }

            return new Promise(function (resolve) {
                resolve(result);
            });

        }).then(function () {
            return CloudFoundryApps.getAppRoutes(app_guid);
        }).then(function (result) {
            route_guid = result.resources[0].metadata.guid;
            return CloudFoundryApps.remove(app_guid);
        }).then(function () {
            return CloudFoundryRoutes.remove(route_guid);
        }).then(function () {
            //console.log(result);
            expect(true).to.equal(true);
        });

    });

});


