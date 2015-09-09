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

function randomInt(low, high) {
    return Math.floor(Math.random() * (high - low) + low);
}

function block2(token_endpoint, appName, space_guid) {

    return new Promise(function (resolve, reject) {

        CloudFoundry.login(token_endpoint, username, password).then(function (result) {
            var filter = {
                'q': 'name:' + appName,
                'inline-relations-depth': 1
            };
            return CloudFoundrySpaces.getSpaceApps(result.token_type, result.access_token, space_guid, filter);
        }).then(function (result) {
            //console.log(result);
            return resolve(result);
        }).catch(function (reason) {
            console.error("Error: " + reason);
            return reject(reason);
        });


    });
}

function recursiveExample2(token_endpoint, appName, space_guid) {
    var counter = 0;

    return new Promise(function check(resolve, reject) {

        block2(token_endpoint, appName, space_guid).then(function (result) {
            console.log(result.resources[0].entity.package_state);
            //console.log(counter);
            if (result.resources[0].entity.package_state === "STAGED") {
                resolve(result);
            } else if (counter === 10) {
                reject(new Error("Timeout"));
            } else {
                //console.log("next try");
                counter += 1;
                setTimeout(check, 1000, resolve, reject);
            }
        });

    });

}

function block(token_endpoint, app_guid) {

    return new Promise(function (resolve, reject) {

        CloudFoundry.login(token_endpoint, username, password).then(function (result) {
            return CloudFoundryApps.getStats(result.token_type, result.access_token, app_guid);
        }).then(function (result) {
            return resolve(result);
        }).catch(function (reason) {
            console.error("Error: " + reason);
            return reject(reason);
        });


    });
}

function recursiveExample(token_endpoint, app_guid) {
    var counter = 0;

    return new Promise(function check(resolve, reject) {

        block(token_endpoint, app_guid).then(function (result) {
            console.log(result["0"].state);
            //console.log(counter);
            if (result["0"].state === "RUNNING") {
                resolve(result);
            } else if (counter === 5) {
                reject(new Error("Timeout"));
            } else {
                //console.log("next try");
                counter += 1;
                setTimeout(check, 1000, resolve, reject);
            }
        });

    });

}

function createApp(appName, buildPack) {

    var token_endpoint = null;
    var app_guid = null;
    var space_guid = null;
    var domain_guid = null;
    var routeName = null;
    var route_guid = null;
    var route_create_flag = false;

    return new Promise(function (resolve, reject) {

        CloudFoundry.getInfo().then(function (result) {
            token_endpoint = result.token_endpoint;

            return CloudFoundry.login(token_endpoint, username, password).then(function (result) {
                return CloudFoundrySpaces.getSpaces(result.token_type, result.access_token).then(function (result) {
                    return new Promise(function (resolve) {
                        space_guid = result.resources[0].metadata.guid;
                        //console.log("Space guid: ", space_guid);
                        return resolve();
                    });
                });
            });
        //Does exist the application?   
        }).then(function () {
            var filter = {
                'q': 'name:' + appName,
                'inline-relations-depth': 1
            };
            return CloudFoundry.login(token_endpoint, username, password).then(function (result) {
                return CloudFoundrySpaces.getSpaceApps(result.token_type, result.access_token, space_guid, filter);
            });
        }).then(function (result) {

            //If exist the application, Stop
            if (result.total_results === 1) {
                console.log("Stop App: " + appName);
                app_guid = result.resources[0].metadata.guid;
                console.log("App guid: ", app_guid);
                console.log(result.resources[0].entity.name);

                return CloudFoundry.login(token_endpoint, username, password).then(function (result) {
                    return CloudFoundryApps.stopApp(result.token_type, result.access_token, app_guid);
                });
            }else {
                //console.log("Create App");
                return CloudFoundry.login(token_endpoint, username, password).then(function (result) {
                    return CloudFoundryApps.createApp(result.token_type, result.access_token, appName, space_guid, buildPack).then(function (result) {
                        return new Promise(function (resolve) {
                            //console.log(result);
                            app_guid = result.metadata.guid;
                            return resolve();
                        });
                    });
                });
            }
        }).then(function () {
            //TODO: How to make the inference?
            return CloudFoundry.login(token_endpoint, username, password).then(function (result) {
                return CloudFoundryDomains.getSharedDomains(result.token_type, result.access_token);
            });
        }).then(function () {
            return CloudFoundry.login(token_endpoint, username, password).then(function (result) {
                return CloudFoundryDomains.getDomains(result.token_type, result.access_token).then(function (result) {
                    return new Promise(function (resolve) {
                        domain_guid = result.resources[0].metadata.guid;
                        //console.log("Domain guid: " , domain_guid);
                        return resolve();
                    });
                });
            });
        }).then(function () {
            return CloudFoundry.login(token_endpoint, username, password).then(function (result) {
                return CloudFoundryRoutes.checkRoute(result.token_type, result.access_token, appName, domain_guid).then(function (result) {
                    return new Promise(function (resolve) {
                        if (result.total_results === 1) {
                            console.log("Exist a Route");
                            //console.log(result.resources);
                            route_guid = result.resources[0].metadata.guid;
                            console.log("Route guid: ", route_guid);
                            return resolve(result);
                        }else {
                            //Add Route
                            route_create_flag = true; //Workaround
                            return resolve();
                        }

                    });
                });
            });
        }).then(function () {
            //TODO: Refactor syntax to code in the right place
            if (route_create_flag) {
                //Add Route
                //console.log("Create a Route");
                routeName = appName;
                return CloudFoundry.login(token_endpoint, username, password).then(function (result) {
                    return CloudFoundryRoutes.addRoute(result.token_type, result.access_token, domain_guid, space_guid, routeName).then(function (result) {
                        return new Promise(function (resolve) {
                            //console.log(result);
                            route_guid = result.metadata.guid;
                            return resolve(result);
                        });
                    });
                });
            }else {
                return new Promise(function (resolve) {
                    return resolve();
                });
            }
        }).then(function () {
            return CloudFoundry.login(token_endpoint, username, password).then(function (result) {
                return CloudFoundryApps.associateRoute(result.token_type, result.access_token, appName, app_guid, domain_guid, space_guid, route_guid);
            });
        }).then(function (result) {
            //console.log(result);
            return resolve(result);
        }).catch(function (reason) {
            console.error("Error: " + reason);
            return reject(reason);
        });

    });

}

function sleep(time, callback) {
    var stop = new Date().getTime();
    while (new Date().getTime() < stop + time) {
        ;
    }
    callback();
}

describe("Cloud Foundry Upload App process", function () {

    var token_endpoint = null;
    var token_type = null;
    var access_token = null;

    before(function () {
        this.timeout(5000);

        return CloudFoundry.getInfo().then(function (result) {
            token_endpoint = result.token_endpoint;
            return CloudFoundry.login(token_endpoint, username, password);
        }).then(function (result) {
            token_type = result.token_type;
            access_token = result.access_token;
        });

    });

    it("Create a Static App, Upload 1MB zip & Remove app", function () {
        this.timeout(40000);

        var app_guid = null;
        var appName = "app2" + randomWords() + randomInt(1, 100);
        var staticBuildPack = BuildPacks.get("static");
        var zipPath = "./staticApp.zip";
        var weight = 1;//MB
        var compressionRate = 0;//No compression    

        return createApp(appName, staticBuildPack).then(function (result) {
            app_guid = result.metadata.guid;
            expect(app_guid).is.a("string");
            expect(result.entity.buildpack).to.equal(staticBuildPack);
            return ZipGenerator.generate(zipPath, weight, compressionRate);
        }).then(function () {
            //Does exist the zip?   
            fs.exists(zipPath, function (result) {
                expect(result).to.equal(true);
            });

            return CloudFoundry.login(token_endpoint, username, password).then(function (result) {
                return CloudFoundryApps.uploadApp(result.token_type, result.access_token, app_guid, zipPath, false);
            });
        }).then(function (result) {
            expect(JSON.stringify(result)).to.equal("{}");
            return CloudFoundry.login(token_endpoint, username, password).then(function (result) {
                return CloudFoundryApps.deleteApp(result.token_type, result.access_token, app_guid);
            });
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

        return createApp(appName, staticBuildPack).then(function (result) {
            app_guid = result.metadata.guid;
            expect(app_guid).is.a("string");
            expect(result.entity.buildpack).to.equal(staticBuildPack);
            return ZipGenerator.generate(zipPath, weight, compressionRate);
        }).then(function () {
            //Does exist the zip?   
            fs.exists(zipPath, function (result) {
                expect(result).to.equal(true);
            });

            return CloudFoundry.login(token_endpoint, username, password).then(function (result) {
                return CloudFoundryApps.uploadApp(result.token_type, result.access_token, app_guid, zipPath, true);
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

                return CloudFoundry.login(token_endpoint, username, password).then(function (result) {
                    return CloudFoundryJobs.getJob(result.token_type, result.access_token, job_guid).then(function (result) {
                        return new Promise(function (resolve) {
                            var status = result.entity.status;
                            console.log(status);
                            resolve(result);
                        });
                    });
                });
            } else {
                return new Promise(function (resolve) {
                    resolve(result);
                });
            }
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

                return CloudFoundry.login(token_endpoint, username, password).then(function (result) {
                    return CloudFoundryJobs.getJob(result.token_type, result.access_token, job_guid).then(function (result) {
                        return new Promise(function (resolve) {
                            var status = result.entity.status;
                            console.log(status);
                            resolve(result);
                        });
                    });
                });
            } else {
                return new Promise(function (resolve) {
                    resolve(result);
                });
            }
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

                return CloudFoundry.login(token_endpoint, username, password).then(function (result) {
                    return CloudFoundryJobs.getJob(result.token_type, result.access_token, job_guid).then(function (result) {
                        return new Promise(function (resolve) {
                            var status = result.entity.status;
                            console.log(status);
                            resolve(result);
                        });
                    });
                });
            } else {
                return new Promise(function (resolve) {
                    resolve(result);
                });
            }
        }).then(function () {
            return CloudFoundry.login(token_endpoint, username, password).then(function (result) {
                return CloudFoundryApps.deleteApp(result.token_type, result.access_token, app_guid);
            });
        }).then(function () {
            //console.log(result);
            expect(true).to.equal(true);
        });
    });

    it("Create a Static App, Upload 5MB zip & Remove app", function () {
        this.timeout(40000);

        var app_guid = null;
        var appName = "app2" + randomWords() + randomInt(1, 100);
        var staticBuildPack = BuildPacks.get("static");
        var zipPath = "./staticApp.zip";
        var weight = 5;//MB
        var compressionRate = 0;//No compression

        return createApp(appName, staticBuildPack).then(function (result) {
            app_guid = result.metadata.guid;
            expect(app_guid).is.a("string");
            expect(result.entity.buildpack).to.equal(staticBuildPack);
            return ZipGenerator.generate(zipPath, weight, compressionRate);
        }).then(function () {
            //Does exist the zip?   
            fs.exists(zipPath, function (result) {
                expect(result).to.equal(true);
            });

            return CloudFoundry.login(token_endpoint, username, password).then(function (result) {
                return CloudFoundryApps.uploadApp(result.token_type, result.access_token, app_guid, zipPath, false);
            });
        }).then(function (result) {
            expect(JSON.stringify(result)).to.equal("{}");
            return CloudFoundry.login(token_endpoint, username, password).then(function (result) {
                return CloudFoundryApps.deleteApp(result.token_type, result.access_token, app_guid);
            });
        }).then(function () {
            //console.log(result);
            expect(true).to.equal(true);
        });
    });

    it("Create a Static App, Upload 10MB zip & Remove app", function () {
        this.timeout(50000);

        var app_guid = null;
        var appName = "app2" + randomWords() + randomInt(1, 100);
        var staticBuildPack = BuildPacks.get("static");
        var zipPath = "./staticApp.zip";
        var weight = 10;//MB
        var compressionRate = 0;//No compression

        return createApp(appName, staticBuildPack).then(function (result) {
            app_guid = result.metadata.guid;
            expect(app_guid).is.a("string");
            expect(result.entity.buildpack).to.equal(staticBuildPack);
            return ZipGenerator.generate(zipPath, weight, compressionRate);
        }).then(function () {
            //Does exist the zip?   
            fs.exists(zipPath, function (result) {
                expect(result).to.equal(true);
            });

            return CloudFoundry.login(token_endpoint, username, password).then(function (result) {
                return CloudFoundryApps.uploadApp(result.token_type, result.access_token, app_guid, zipPath, false);
            });
        }).then(function (result) {
            expect(JSON.stringify(result)).to.equal("{}");
            return CloudFoundry.login(token_endpoint, username, password).then(function (result) {
                return CloudFoundryApps.deleteApp(result.token_type, result.access_token, app_guid);
            });
        }).then(function () {
            //console.log(result);
            expect(true).to.equal(true);
        });
    });

    it("Create a Static App, Upload 20MB zip & Remove app", function () {
        this.timeout(60000);

        var app_guid = null;
        var appName = "app2" + randomWords() + randomInt(1, 100);
        var staticBuildPack = BuildPacks.get("static");
        var zipPath = "./staticApp.zip";
        var weight = 20;//MB
        var compressionRate = 0;//No compression

        return createApp(appName, staticBuildPack).then(function (result) {
            app_guid = result.metadata.guid;
            expect(app_guid).is.a("string");
            expect(result.entity.buildpack).to.equal(staticBuildPack);
            return ZipGenerator.generate(zipPath, weight, compressionRate);
        }).then(function () {
            //Does exist the zip?   
            fs.exists(zipPath, function (result) {
                expect(result).to.equal(true);
            });
            return CloudFoundry.login(token_endpoint, username, password).then(function (result) {
                return CloudFoundryApps.uploadApp(result.token_type, result.access_token, app_guid, zipPath, false);
            });
        }).then(function (result) {
            expect(JSON.stringify(result)).to.equal("{}");
            return CloudFoundry.login(token_endpoint, username, password).then(function (result) {
                return CloudFoundryApps.deleteApp(result.token_type, result.access_token, app_guid);
            });
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

        return createApp(appName, staticBuildPack).then(function (result) {
            app_guid = result.metadata.guid;
            expect(app_guid).is.a("string");
            expect(result.entity.buildpack).to.equal(staticBuildPack);
            return ZipGenerator.generate(zipPath, weight, compressionRate);
        }).then(function () {
            //Does exist the zip?   
            fs.exists(zipPath, function (result) {
                expect(result).to.equal(true);
            });

            return CloudFoundry.login(token_endpoint, username, password).then(function (result) {
                return CloudFoundryApps.uploadApp(result.token_type, result.access_token, app_guid, zipPath, false);
            });
        }).then(function (result) {
            expect(JSON.stringify(result)).to.equal("{}");
            return CloudFoundry.login(token_endpoint, username, password).then(function (result) {
                return CloudFoundryApps.deleteApp(result.token_type, result.access_token, app_guid);
            });
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

        return createApp(appName, staticBuildPack).then(function (result) {
            app_guid = result.metadata.guid;
            expect(app_guid).is.a("string");
            expect(result.entity.buildpack).to.equal(staticBuildPack);
            return ZipGenerator.generate(zipPath, weight, compressionRate);
        }).then(function () {
            //Does exist the zip?   
            fs.exists(zipPath, function (result) {
                expect(result).to.equal(true);
            });

            return CloudFoundry.login(token_endpoint, username, password).then(function (result) {
                return CloudFoundryApps.uploadApp(result.token_type, result.access_token, app_guid, zipPath, false);
            });
        }).then(function (result) {
            expect(JSON.stringify(result)).to.equal("{}");

            return CloudFoundry.login(token_endpoint, username, password).then(function (result) {
                return CloudFoundryApps.deleteApp(result.token_type, result.access_token, app_guid);
            });
        }).then(function () {
            //console.log(result);
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
        var space_guid = null;

        return createApp(appName, staticBuildPack).then(function (result) {
            app_guid = result.metadata.guid;
            expect(app_guid).is.a("string");
            expect(result.entity.buildpack).to.equal(staticBuildPack);
            return ZipGenerator.generate(zipPath, weight, compressionRate);
        }).then(function () {
            //Does exist the zip?   
            fs.exists(zipPath, function (result) {
                expect(result).to.equal(true);
            });

            return CloudFoundry.login(token_endpoint, username, password).then(function (result) {
                return CloudFoundryApps.uploadApp(result.token_type, result.access_token, app_guid, zipPath, false);
            });
        //Start
        }).then(function (result) {
            expect(JSON.stringify(result)).to.equal("{}");
            return CloudFoundry.login(token_endpoint, username, password).then(function (result) {
                return CloudFoundryApps.startApp(result.token_type, result.access_token, app_guid);
            });
        }).then(function () {
            return CloudFoundry.login(token_endpoint, username, password).then(function (result) {
                return CloudFoundrySpaces.getSpaces(result.token_type, result.access_token).then(function (result) {
                    return new Promise(function (resolve) {
                        space_guid = result.resources[0].metadata.guid;
                        return resolve(result);
                    });
                });
            });
        //STAGING
        }).then(function () {
            console.log(appName);
            return recursiveExample2(token_endpoint, appName, space_guid);
        //RUNNING
        }).then(function () {
            return recursiveExample(token_endpoint, app_guid);
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
        //DELETING
        }).then(function () {
            return CloudFoundry.login(token_endpoint, username, password).then(function (result) {
                return CloudFoundryApps.deleteApp(result.token_type, result.access_token, app_guid);
            });
        }).then(function () {
            expect(true).to.equal(true);
        });
    });

});


