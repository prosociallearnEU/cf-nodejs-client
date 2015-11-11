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

describe("Cloud Foundry Upload Static Apps", function () {

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

    function sleep(time, callback) {
        var stop = new Date().getTime();
        while (new Date().getTime() < stop + time) {
            ;
        }
        callback();
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

                return CloudFoundryApps.create(token_type, access_token, appOptions).then(function (result) {
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
                return CloudFoundryRoutes.addRoute(token_type, access_token, routeOptions).then(function (result) {
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

    function recursiveStageApp(token_type, access_token, appName, space_guid) {

        var counter = 0;
        var filter = {
            'q': 'name:' + appName,
            'inline-relations-depth': 1
        };

        return new Promise(function check(resolve, reject) {

            CloudFoundrySpaces.getSpaceApps(token_type, access_token, space_guid, filter).then(function (result) {
                console.log(result.resources[0].entity.package_state);
                //console.log(counter);
                if (result.resources[0].entity.package_state === "STAGED") {
                    resolve(result);
                } else if (counter === 15) {
                    reject(new Error("Timeout"));
                } else {
                    //console.log("next try");
                    counter += 1;
                    setTimeout(check, 1000, resolve, reject);
                }
            });

        });

    }

    function recursiveCheckRunningState(token_type, access_token, app_guid) {
        var counter = 0;

        return new Promise(function check(resolve, reject) {

            CloudFoundryApps.getStats(token_type, access_token, app_guid).then(function (result) {
                console.log(result["0"].state);
                //console.log(counter);
                if (result["0"].state === "RUNNING") {
                    resolve(result);
                } else if (counter === 15) {
                    reject(new Error("Timeout"));
                } else {
                    //console.log("next try");
                    counter += 1;
                    setTimeout(check, 1000, resolve, reject);
                }
            });

        });

    }

    it("Create a Static App, Upload 1MB zip & Remove app", function () {
        this.timeout(40000);

        var app_guid = null;
        var appName = "app2" + randomWords() + randomInt(1, 100);
        var staticBuildPack = BuildPacks.get("static");
        var zipPath = "./staticApp.zip";
        var weight = 1;//MB
        var compressionRate = 0;//No compression
        var route_guid = null;
        var appOptions = {
            "name": appName,
            "space_guid": space_guid,
            "instances" : 1,
            "memory" : 32,
            "disk_quota" : 32,
            "buildpack" : staticBuildPack
        };

        return createApp(token_type, access_token, appOptions).then(function (result) {
            app_guid = result.metadata.guid;
            expect(app_guid).is.a("string");
            expect(result.entity.buildpack).to.equal(staticBuildPack);
            return ZipGenerator.generate(zipPath, weight, compressionRate);
        }).then(function () {
            //Does exist the zip?   
            fs.exists(zipPath, function (result) {
                expect(result).to.equal(true);
            });
            return CloudFoundryApps.uploadApp(token_type, access_token, app_guid, zipPath, false);
        }).then(function (result) {
            expect(JSON.stringify(result)).to.equal("{}");
            return ZipGenerator.remove(zipPath);
        }).then(function () {
            fs.exists(zipPath, function (result) {
                expect(result).be.equal(false);
            });
            return CloudFoundryApps.getAppRoutes(token_type, access_token, app_guid);
        }).then(function (result) {
            route_guid = result.resources[0].metadata.guid;
            return CloudFoundryApps.deleteApp(token_type, access_token, app_guid);
        }).then(function () {
            return CloudFoundryRoutes.deleteRoute(token_type, access_token, route_guid);
        }).then(function () {
            expect(true).to.equal(true);
        });
    });

    it("Create a Static App, Update the App & Remove app", function () {
        this.timeout(40000);

        var app_guid = null;
        var appName = "app2" + randomWords() + randomInt(1, 100);
        var staticBuildPack = BuildPacks.get("static");
        var nodeBuildPack = BuildPacks.get("nodejs");
        var route_guid = null;
        var appOptions = {
            "name": appName,
            "space_guid": space_guid,
            "instances" : 1,
            "memory" : 32,
            "disk_quota" : 32,
            "buildpack" : staticBuildPack
        };

        return createApp(token_type, access_token, appOptions).then(function (result) {
            app_guid = result.metadata.guid;
            expect(app_guid).is.a("string");
            expect(result.entity.buildpack).to.equal(staticBuildPack);

            //Update an App
            appOptions = {
                "buildpack" : nodeBuildPack
            };
            return CloudFoundryApps.update(token_type, access_token, app_guid, appOptions);
        }).then(function (result) {
            expect(result.entity.buildpack).to.equal(nodeBuildPack);
            return CloudFoundryApps.getAppRoutes(token_type, access_token, app_guid);
        }).then(function (result) {
            route_guid = result.resources[0].metadata.guid;
            return CloudFoundryApps.deleteApp(token_type, access_token, app_guid);
        }).then(function () {
            return CloudFoundryRoutes.deleteRoute(token_type, access_token, route_guid);
        }).then(function () {
            expect(true).to.equal(true);
        });
    });

    it("Create a Static App, Upload 1MB zip, Start the App, Stop & Remove", function () {
        this.timeout(200000);

        var app_guid = null;
        var appName = "app2" + randomWords() + randomInt(1, 100);
        var staticBuildPack = BuildPacks.get("static");
        var zipPath = "./staticApp.zip";
        var weight = 1;//MB
        var compressionRate = 0;//No compression
        var route_guid = null;

        var appOptions = {
            "name": appName,
            "space_guid": space_guid,
            "instances" : 1,
            "memory" : 64,
            "disk_quota" : 64,
            "buildpack" : staticBuildPack
        };
        if(environment === "PIVOTAL") {
            appOptions = {
                "name": appName,
                "space_guid": space_guid,
                "instances" : 1,
                "memory" : 64,
                "disk_quota" : 64,
                "buildpack" : staticBuildPack,
                "diego": true
            };
        }   

        return createApp(token_type, access_token, appOptions).then(function (result) {
            app_guid = result.metadata.guid;
            expect(app_guid).is.a("string");
            expect(result.entity.buildpack).to.equal(staticBuildPack);
            return ZipGenerator.generate(zipPath, weight, compressionRate);
        }).then(function () {
            //Does exist the zip?   
            fs.exists(zipPath, function (result) {
                expect(result).to.equal(true);
            });

            return CloudFoundryApps.uploadApp(token_type, access_token, app_guid, zipPath, false);
        }).then(function (result) {
            expect(JSON.stringify(result)).to.equal("{}");
            return ZipGenerator.remove(zipPath);
        }).then(function () {
            fs.exists(zipPath, function (result) {
                expect(result).be.equal(false);
            });

            return CloudFoundryApps.startApp(token_type, access_token, app_guid);
        //STAGING
        }).then(function () {
            console.log(appName);
            return recursiveStageApp(token_type, access_token, appName, space_guid);
        //RUNNING
        }).then(function () {
            return recursiveCheckRunningState(token_type, access_token, app_guid);
        }).then(function (result) {
            expect(result["0"].state).to.equal("RUNNING");

            var url = "http://" + result["0"].stats.uris[0];
            var options = {
                method: 'GET',
                url: url
            };

            return HttpUtils.request(options, "200", false).then(function (result) {
                console.log(result);
                expect(result).is.a("string");
            });
        }).then(function () {
            return CloudFoundryApps.getAppRoutes(token_type, access_token, app_guid);
        }).then(function (result) {
            route_guid = result.resources[0].metadata.guid;
            return CloudFoundryApps.stopApp(token_type, access_token, app_guid);
        }).then(function (result) {            
            return CloudFoundryApps.deleteApp(token_type, access_token, app_guid);
        }).then(function () {
            return CloudFoundryRoutes.deleteRoute(token_type, access_token, route_guid);
        }).then(function () {
            //console.log(result);
            expect(true).to.equal(true);
        });

    });

    it("Create a Static App, Upload 1MB zip, Start the App, Stop, Restage & Remove", function () {
        this.timeout(200000);

        var app_guid = null;
        var appName = "app2" + randomWords() + randomInt(1, 100);
        var staticBuildPack = BuildPacks.get("static");
        var zipPath = "./staticApp.zip";
        var weight = 1;//MB
        var compressionRate = 0;//No compression
        var route_guid = null;

        var appOptions = {
            "name": appName,
            "space_guid": space_guid,
            "instances" : 1,
            "memory" : 64,
            "disk_quota" : 64,
            "buildpack" : staticBuildPack
        };
        if(environment === "PIVOTAL") {
            appOptions = {
                "name": appName,
                "space_guid": space_guid,
                "instances" : 1,
                "memory" : 64,
                "disk_quota" : 64,
                "buildpack" : staticBuildPack,
                "diego": true
            };
        }   

        return createApp(token_type, access_token, appOptions).then(function (result) {
            app_guid = result.metadata.guid;
            expect(app_guid).is.a("string");
            expect(result.entity.buildpack).to.equal(staticBuildPack);
            return ZipGenerator.generate(zipPath, weight, compressionRate);
        }).then(function () {
            //Does exist the zip?   
            fs.exists(zipPath, function (result) {
                expect(result).to.equal(true);
            });

            return CloudFoundryApps.uploadApp(token_type, access_token, app_guid, zipPath, false);
        }).then(function (result) {
            expect(JSON.stringify(result)).to.equal("{}");
            return ZipGenerator.remove(zipPath);
        }).then(function () {
            fs.exists(zipPath, function (result) {
                expect(result).be.equal(false);
            });

            return CloudFoundryApps.startApp(token_type, access_token, app_guid);
        //STAGING
        }).then(function () {
            console.log(appName);
            return recursiveStageApp(token_type, access_token, appName, space_guid);
        //RUNNING
        }).then(function () {
            return recursiveCheckRunningState(token_type, access_token, app_guid);
        }).then(function (result) {
            expect(result["0"].state).to.equal("RUNNING");

            var url = "http://" + result["0"].stats.uris[0];
            var options = {
                method: 'GET',
                url: url
            };

            return HttpUtils.request(options, "200", false).then(function (result) {
                console.log(result);
                expect(result).is.a("string");
            });
        }).then(function () {
            return CloudFoundryApps.getAppRoutes(token_type, access_token, app_guid);
        }).then(function (result) {
            route_guid = result.resources[0].metadata.guid;
            return CloudFoundryApps.stopApp(token_type, access_token, app_guid);
        }).then(function (result) {        
            return CloudFoundryApps.restage(token_type, access_token, app_guid);
        }).then(function (result) {               
            return CloudFoundryApps.deleteApp(token_type, access_token, app_guid);
        }).then(function () {
            return CloudFoundryRoutes.deleteRoute(token_type, access_token, route_guid);
        }).then(function () {
            //console.log(result);
            expect(true).to.equal(true);
        });

    });

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

        return createApp(token_type, access_token, appOptions).then(function (result) {
            app_guid = result.metadata.guid;
            expect(app_guid).is.a("string");
            expect(result.entity.buildpack).to.equal(staticBuildPack);
            return ZipGenerator.generate(zipPath, weight, compressionRate);
        }).then(function () {
            //Does exist the zip?   
            fs.exists(zipPath, function (result) {
                expect(result).to.equal(true);
            });
            return CloudFoundryApps.uploadApp(token_type, access_token, app_guid, zipPath, true);
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

                return CloudFoundryJobs.getJob(token_type, access_token, job_guid).then(function (result) {
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

                return CloudFoundryJobs.getJob(result.token_type, result.access_token, job_guid).then(function (result) {
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

                return CloudFoundryJobs.getJob(result.token_type, result.access_token, job_guid).then(function (result) {
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
            return CloudFoundryApps.getAppRoutes(token_type, access_token, app_guid);
        }).then(function (result) {
            route_guid = result.resources[0].metadata.guid;
            return CloudFoundryApps.deleteApp(token_type, access_token, app_guid);
        }).then(function () {
            return CloudFoundryRoutes.deleteRoute(token_type, access_token, route_guid);
        }).then(function () {
            //console.log(result);
            expect(true).to.equal(true);
        });

    });

    it.skip("Create a Static App, Upload 5MB zip & Remove app", function () {
        this.timeout(40000);

        var app_guid = null;
        var appName = "app2" + randomWords() + randomInt(1, 100);
        var staticBuildPack = BuildPacks.get("static");
        var zipPath = "./staticApp.zip";
        var weight = 5;//MB
        var compressionRate = 0;//No compression
        var route_guid = null;
        var appOptions = {
            "name": appName,
            "space_guid": space_guid,
            "instances" : 1,
            "memory" : 32,
            "disk_quota" : 32,
            "buildpack" : staticBuildPack
        };        

        return createApp(token_type, access_token, appOptions).then(function (result) {
            app_guid = result.metadata.guid;
            expect(app_guid).is.a("string");
            expect(result.entity.buildpack).to.equal(staticBuildPack);
            return ZipGenerator.generate(zipPath, weight, compressionRate);
        }).then(function () {
            //Does exist the zip?   
            fs.exists(zipPath, function (result) {
                expect(result).to.equal(true);
            });

            return CloudFoundryApps.uploadApp(token_type, access_token, app_guid, zipPath, false);
        }).then(function (result) {
            expect(JSON.stringify(result)).to.equal("{}");
            return ZipGenerator.remove(zipPath);
        }).then(function () {
            fs.exists(zipPath, function (result) {
                expect(result).be.equal(false);
            });
            return CloudFoundryApps.getAppRoutes(token_type, access_token, app_guid);
        }).then(function (result) {
            route_guid = result.resources[0].metadata.guid;
            return CloudFoundryApps.deleteApp(token_type, access_token, app_guid);
        }).then(function () {
            return CloudFoundryRoutes.deleteRoute(token_type, access_token, route_guid);
        }).then(function () {
            //console.log(result);
            expect(true).to.equal(true);
        });
    });

    it("Create a Static App, Upload 10MB zip & Remove app", function () {
        this.timeout(60000);

        var app_guid = null;
        var appName = "app2" + randomWords() + randomInt(1, 100);
        var staticBuildPack = BuildPacks.get("static");
        var zipPath = "./staticApp.zip";
        var weight = 10;//MB
        var compressionRate = 0;//No compression
        var route_guid = null;
        var appOptions = {
            "name": appName,
            "space_guid": space_guid,
            "instances" : 1,
            "memory" : 64,
            "disk_quota" : 64,
            "buildpack" : staticBuildPack
        };          

        return createApp(token_type, access_token, appOptions).then(function (result) {
            app_guid = result.metadata.guid;
            expect(app_guid).is.a("string");
            expect(result.entity.buildpack).to.equal(staticBuildPack);
            return ZipGenerator.generate(zipPath, weight, compressionRate);
        }).then(function () {
            //Does exist the zip?   
            fs.exists(zipPath, function (result) {
                expect(result).to.equal(true);
            });

            return CloudFoundryApps.uploadApp(token_type, access_token, app_guid, zipPath, false);
        }).then(function (result) {
            expect(JSON.stringify(result)).to.equal("{}");
            return ZipGenerator.remove(zipPath);
        }).then(function () {
            fs.exists(zipPath, function (result) {
                expect(result).be.equal(false);
            });
            return CloudFoundryApps.getAppRoutes(token_type, access_token, app_guid);
        }).then(function (result) {
            route_guid = result.resources[0].metadata.guid;
            return CloudFoundryApps.deleteApp(token_type, access_token, app_guid);
        }).then(function () {
            return CloudFoundryRoutes.deleteRoute(token_type, access_token, route_guid);
        }).then(function () {
            //console.log(result);
            expect(true).to.equal(true);
        });
    });

    it.skip("Create a Static App, Upload 20MB zip & Remove app", function () {
        this.timeout(60000);

        var app_guid = null;
        var appName = "app2" + randomWords() + randomInt(1, 100);
        var staticBuildPack = BuildPacks.get("static");
        var zipPath = "./staticApp.zip";
        var weight = 20;//MB
        var compressionRate = 0;//No compression
        var route_guid = null;
        var appOptions = {
            "name": appName,
            "space_guid": space_guid,
            "instances" : 1,
            "memory" : 64,
            "disk_quota" : 64,
            "buildpack" : staticBuildPack
        };          

        return createApp(token_type, access_token, appOptions).then(function (result) {
            app_guid = result.metadata.guid;
            expect(app_guid).is.a("string");
            expect(result.entity.buildpack).to.equal(staticBuildPack);
            return ZipGenerator.generate(zipPath, weight, compressionRate);
        }).then(function () {
            //Does exist the zip?   
            fs.exists(zipPath, function (result) {
                expect(result).to.equal(true);
            });

            return CloudFoundryApps.uploadApp(token_type, access_token, app_guid, zipPath, false);
        }).then(function (result) {
            expect(JSON.stringify(result)).to.equal("{}");
            return ZipGenerator.remove(zipPath);
        }).then(function () {
            fs.exists(zipPath, function (result) {
                expect(result).be.equal(false);
            });
            return CloudFoundryApps.getAppRoutes(token_type, access_token, app_guid);
        }).then(function (result) {
            route_guid = result.resources[0].metadata.guid;
            return CloudFoundryApps.deleteApp(token_type, access_token, app_guid);
        }).then(function () {
            return CloudFoundryRoutes.deleteRoute(token_type, access_token, route_guid);
        }).then(function () {
            //console.log(result);
            expect(true).to.equal(true);
        });
    });

    it("Create a Static App, Upload 50MB zip & Remove app", function () {
        this.timeout(100000);

        var app_guid = null;
        var appName = "app2" + randomWords() + randomInt(1, 100);
        var staticBuildPack = BuildPacks.get("static");
        var zipPath = "./staticApp.zip";
        var weight = 50;//MB
        var compressionRate = 0;//No compression
        var route_guid = null;
        var appOptions = {
            "name": appName,
            "space_guid": space_guid,
            "instances" : 1,
            "memory" : 128,
            "disk_quota" : 128,
            "buildpack" : staticBuildPack
        };          

        return createApp(token_type, access_token, appOptions).then(function (result) {
            app_guid = result.metadata.guid;
            expect(app_guid).is.a("string");
            expect(result.entity.buildpack).to.equal(staticBuildPack);
            return ZipGenerator.generate(zipPath, weight, compressionRate);
        }).then(function () {
            //Does exist the zip?   
            fs.exists(zipPath, function (result) {
                expect(result).to.equal(true);
            });

            return CloudFoundryApps.uploadApp(token_type, access_token, app_guid, zipPath, false);
        }).then(function (result) {
            expect(JSON.stringify(result)).to.equal("{}");
            return ZipGenerator.remove(zipPath);
        }).then(function () {
            fs.exists(zipPath, function (result) {
                expect(result).be.equal(false);
            });
            return CloudFoundryApps.getAppRoutes(token_type, access_token, app_guid);
        }).then(function (result) {
            route_guid = result.resources[0].metadata.guid;
            return CloudFoundryApps.deleteApp(token_type, access_token, app_guid);
        }).then(function () {
            return CloudFoundryRoutes.deleteRoute(token_type, access_token, route_guid);
        }).then(function () {
            //console.log(result);
            expect(true).to.equal(true);
        });
    });

    it.skip("Create a Static App, Upload 100MB zip & Remove app", function () {
        this.timeout(150000);

        var app_guid = null;
        var appName = "app2" + randomWords() + randomInt(1, 100);
        var staticBuildPack = BuildPacks.get("static");
        var zipPath = "./staticApp.zip";
        var weight = 100;//MB
        var compressionRate = 0;//No compression
        var route_guid = null;
        var appOptions = {
            "name": appName,
            "space_guid": space_guid,
            "instances" : 1,
            "memory" : 256,
            "disk_quota" : 256,
            "buildpack" : staticBuildPack
        };  

        return createApp(token_type, access_token, appOptions).then(function (result) {
            app_guid = result.metadata.guid;
            expect(app_guid).is.a("string");
            expect(result.entity.buildpack).to.equal(staticBuildPack);
            return ZipGenerator.generate(zipPath, weight, compressionRate);
        }).then(function () {
            //Does exist the zip?
            fs.exists(zipPath, function (result) {
                expect(result).to.equal(true);
            });

            return CloudFoundryApps.uploadApp(token_type, access_token, app_guid, zipPath, false);
        }).then(function (result) {
            expect(JSON.stringify(result)).to.equal("{}");
            return ZipGenerator.remove(zipPath);
        }).then(function () {
            fs.exists(zipPath, function (result) {
                expect(result).be.equal(false);
            });
            return CloudFoundryApps.getAppRoutes(token_type, access_token, app_guid);
        }).then(function (result) {
            route_guid = result.resources[0].metadata.guid;
            return CloudFoundryApps.deleteApp(token_type, access_token, app_guid);
        }).then(function () {
            return CloudFoundryRoutes.deleteRoute(token_type, access_token, route_guid);
        }).then(function () {
            //console.log(result);
            expect(true).to.equal(true);
        });
    });

});


