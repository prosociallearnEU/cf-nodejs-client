/*jslint node: true*/
/*global Promise:true*/
/*global describe: true, before:true, it: true*/
"use strict";

var chai = require("chai"),
    expect = require("chai").expect;
var randomWords = require('random-words');

var nconf = require('nconf');
nconf.argv().env().file({ file: 'config.json' });

var cf_api_url = nconf.get('CF_API_URL'),
    username = nconf.get('username'),
    password = nconf.get('password');

var CloudFoundry = require("../../../lib/model/CloudFoundry");
var CloudFoundryApps = require("../../../lib/model/Apps");
var CloudFoundrySpaces = require("../../../lib/model/Spaces");
var CloudFoundryDomains = require("../../../lib/model/Domains");
var CloudFoundryRoutes = require("../../../lib/model/Routes");
var CloudFoundryJobs = require("../../../lib/model/Jobs");
var BuildPacks = require("../../../lib/model/BuildPacks");
CloudFoundry = new CloudFoundry(cf_api_url);
CloudFoundryApps = new CloudFoundryApps(cf_api_url);
CloudFoundrySpaces = new CloudFoundrySpaces(cf_api_url);
CloudFoundryDomains = new CloudFoundryDomains(cf_api_url);
CloudFoundryRoutes = new CloudFoundryRoutes(cf_api_url);
CloudFoundryJobs = new CloudFoundryJobs(cf_api_url);
BuildPacks = new BuildPacks();
var HttpUtils = require('../../../lib/utils/HttpUtils');
HttpUtils = new HttpUtils();

var fs = require('fs');
var ZipGenerator = require('../../utils/ZipGenerator');
ZipGenerator = new ZipGenerator();

describe("Cloud Foundry Upload App process", function () {

    var token_endpoint = null;
    var token_type = null;
    var access_token = null;
    var domain_guid = null;
    var space_guid = null;

    before(function () {
        this.timeout(5000);

        return CloudFoundry.getInfo().then(function (result) {
            token_endpoint = result.token_endpoint;
            return CloudFoundry.login(token_endpoint, username, password);
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

    function createApp(token_type, access_token, domain_guid, appOptions) {

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

            return CloudFoundrySpaces.getSpaceApps(token_type, access_token, space_guid, filter).then(function (result) {

                //If exist the application, Reject
                if (result.total_results === 1) {
                    return reject("Exist the app:" + appName);
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
                //TODO: Review if reject in case of existing route
                return CloudFoundryRoutes.checkRoute(token_type, access_token, appName, domain_guid).then(function (result) {
                    return new Promise(function (resolve) {
                        if (result.total_results === 1) {
                            console.log("Exist a Route");
                            //console.log(result.resources);
                            route_guid = result.resources[0].metadata.guid;
                            console.log("Route guid: ", route_guid);
                            return resolve(result);
                        }

                        //Add Route
                        route_create_flag = true; //Workaround
                        return resolve();

                    });
                });
            }).then(function () {
                //TODO: Refactor syntax to code in the right place
                if (route_create_flag) {
                    routeName = appName;
                    return CloudFoundryRoutes.addRoute(token_type, access_token, domain_guid, space_guid, routeName).then(function (result) {
                        return new Promise(function (resolve) {
                            route_guid = result.metadata.guid;
                            return resolve(result);
                        });
                    });
                }

                return new Promise(function (resolve) {
                    return resolve();
                });
            }).then(function () {
                return CloudFoundryApps.associateRoute(token_type, access_token, appName, app_guid, domain_guid, space_guid, route_guid);
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
            "buildpack" : staticBuildPack
        };

        return createApp(token_type, access_token, domain_guid, appOptions).then(function (result) {
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

    it("Create a Static App, Upload 1MB zip, Start the App & Remove", function () {
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
            "buildpack" : staticBuildPack
        };        

        return createApp(token_type, access_token, domain_guid, appOptions).then(function (result) {
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
            "buildpack" : staticBuildPack
        };         

        return createApp(token_type, access_token, domain_guid, appOptions).then(function (result) {
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
            "buildpack" : staticBuildPack
        };           

        return createApp(token_type, access_token, domain_guid, appOptions).then(function (result) {
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
            "buildpack" : staticBuildPack
        };           

        return createApp(token_type, access_token, domain_guid, appOptions).then(function (result) {
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
            "buildpack" : staticBuildPack
        };           

        return createApp(token_type, access_token, domain_guid, appOptions).then(function (result) {
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
        this.timeout(80000);

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
            "buildpack" : staticBuildPack
        };           

        return createApp(token_type, access_token, domain_guid, appOptions).then(function (result) {
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
            "buildpack" : staticBuildPack
        };           

        return createApp(token_type, access_token, domain_guid, appOptions).then(function (result) {
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


