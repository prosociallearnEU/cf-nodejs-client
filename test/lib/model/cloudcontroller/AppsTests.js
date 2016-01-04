/*jslint node: true*/
/*global Promise:true, describe: true, before:true, it: true*/
"use strict";

var Promise = require('bluebird');
var chai = require("chai"),
    chaiAsPromised = require("chai-as-promised"),
    expect = require("chai").expect;
chai.use(chaiAsPromised);

var argv = require('optimist').demand('config').argv;
var environment = argv.config;
console.log("Environment: " + environment);
var nconf = require('nconf');
nconf.argv().env().file({ file: 'config.json' });

var cf_api_url = nconf.get(environment + "_" + 'CF_API_URL'),
    username = nconf.get(environment + "_" + 'username'),
    password = nconf.get(environment + "_" + 'password');

var CloudFoundry = require("../../../../lib/model/cloudcontroller/CloudFoundry");
var CloudFoundryUsersUAA = require("../../../../lib/model/uaa/UsersUAA");
var CloudFoundryApps = require("../../../../lib/model/cloudcontroller/Apps");
var CloudFoundrySpaces = require("../../../../lib/model/cloudcontroller/Spaces");
CloudFoundry = new CloudFoundry();
CloudFoundryUsersUAA = new CloudFoundryUsersUAA();
CloudFoundryApps = new CloudFoundryApps();
CloudFoundrySpaces = new CloudFoundrySpaces();

describe.only("Cloud Foundry Apps", function () {

    var authorization_endpoint = null;
    var token_endpoint = null;
    var token_type = null;
    var access_token = null;
    var space_guid = null;

    before(function () {
        this.timeout(15000);

        CloudFoundry.setEndPoint(cf_api_url);
        CloudFoundryApps.setEndPoint(cf_api_url);
        CloudFoundrySpaces.setEndPoint(cf_api_url);

        return CloudFoundry.getInfo().then(function (result) {
            authorization_endpoint = result.authorization_endpoint;
            token_endpoint = result.token_endpoint;
            CloudFoundryUsersUAA.setEndPoint(authorization_endpoint);
            return CloudFoundryUsersUAA.login(username, password);
        }).then(function (result) {
            CloudFoundryApps.setToken(result);
            CloudFoundrySpaces.setToken(result);
            return CloudFoundrySpaces.getSpaces();
        }).then(function (result) {
            space_guid = result.resources[0].metadata.guid;
        });

    });

    it("The platform returns Apps", function () {
        this.timeout(2500);

        return CloudFoundryApps.getApps().then(function (result) {
            expect(result.total_results).to.be.a('number');
        });
    });

    it("The platform returns Apps with Filter", function () {
        this.timeout(2500);

        var filter = {
            'q': 'name:' + "demo1",
            'page': 1
        };

        return CloudFoundryApps.getApps(filter).then(function (result) {
            //console.log(result.resources);
            expect(result.total_results).to.be.a('number');
        });
    });

    //TODO: Open
    it.skip("[DEBUGGING] The platform returns Apps with Filter in body", function () {
        this.timeout(2500);

        var filter = {};
        var bodyFilter = {
            "name": "demo1"
        };

        return CloudFoundryApps.getApps(filter, bodyFilter).then(function (result) {
            console.log(result.total_results);
            expect(result.total_results).to.be.a('number');
        });
    });

    it("The platform can't find an unknown app", function () {
        this.timeout(3500);

        var app_guid = null;
        var appToFind = "unknownApp";

        return CloudFoundryApps.getApps().then(function (result) {
            expect(result.total_results).to.be.a('number');
            return new Promise(function (resolve, reject) {
                expect(result.total_results).to.be.a('number');
                var i = 0;
                for (i = 0; i < result.resources.length; i++) {
                    if (result.resources[i].entity.name === appToFind) {
                        app_guid = result.resources[i].metadata.guid;
                        return resolve(app_guid);
                    }
                }
                return reject("Not found App.");
            });
        }).then(function () {
            //console.log(result);
            expect(true).to.equal(true);
        }).catch(function (reason) {
            expect(reason).to.equal("Not found App.");
        });
    });

    it.skip("The platform returns a Summary from an App", function () {
        this.timeout(4500);

        var app_guid = null;

        return CloudFoundryApps.getApps().then(function (result) {
            return new Promise(function (resolve, reject) {
                expect(result.total_results).to.be.a('number');
                if (result.total_results > 0) {
                    app_guid = result.resources[0].metadata.guid;
                    return resolve();
                } else {
                    return reject("Not found App.");
                }
            });
        }).then(function () {
            return CloudFoundryApps.getSummary(app_guid);
        }).then(function () {
            //console.log(result);
            expect(true).to.equal(true);
        }).catch(function (reason) {
            expect(reason).to.equal("Not found App.");
        });
    });

    it.skip("The platform returns Stats from an App", function () {
        this.timeout(3500);

        var app_guid = null;

        return CloudFoundryApps.getApps().then(function (result) {
            return new Promise(function (resolve, reject) {
                expect(result.total_results).to.be.a('number');
                if (result.total_results > 0) {
                    app_guid = result.resources[0].metadata.guid;
                    return resolve();
                }else {
                    return reject("Not found App.");
                }
            });
        }).then(function () {
            return CloudFoundryApps.getStats(app_guid);
        }).then(function () {
            expect(true).to.equal(true);
        }).catch(function (reason) {
            expect(reason).to.equal("Not found App.");
        });
    });

    it.skip("The platform returns instances from an App", function () {
        this.timeout(3500);

        var app_guid = null;

        return CloudFoundryApps.getApps().then(function (result) {
            return new Promise(function (resolve, reject) {
                expect(result.total_results).to.be.a('number');
                if (result.total_results > 0) {
                    app_guid = result.resources[0].metadata.guid;
                    return resolve();
                }else {
                    return reject("Not found App.");
                }
            });
        }).then(function () {
            return CloudFoundryApps.getInstances(app_guid);
        }).then(function () {
            expect(true).to.equal(true);
        }).catch(function (reason) {
            expect(reason).to.equal("Not found App.");
        });
    });

    it.skip("Start an App", function () {
        this.timeout(60000);

        //Inner function used to check when an application run in the system.
        function recursiveCheckApp(app_guid) {

            var iterationLimit = 10;
            var counter = 0;

            return new Promise(function check(resolve, reject) {

                CloudFoundryApps.getInstances(app_guid).then(function () {
                    return CloudFoundryApps.getStats(app_guid);
                }).then(function (result) {
                    console.log(result["0"].state);
                    //console.log(counter);
                    if (result["0"].state === "RUNNING") {
                        resolve(result);
                    } else if (counter === iterationLimit) {
                        reject(new Error("Timeout"));
                    } else {
                        //console.log("next try");
                        counter += 1;
                        setTimeout(check, 1000, resolve, reject);
                    }
                });

            });

        }

        //TODO: Improve Tests to get the first App
        var app_guid = null;
        var filter = {
            'q': 'name:' + "sso",
            'inline-relations-depth': 1
        };
        //var filter = {
        //    'guid' : space_guid
        //}                  
        return CloudFoundrySpaces.getSpaceApps(space_guid, filter).then(function (result) {
            app_guid = result.resources[0].metadata.guid;
            //console.log(app_guid);
            console.log(result.resources[0].entity.state);
            return CloudFoundryApps.start(app_guid);
        }).then(function () {
            return recursiveCheckApp(app_guid);
        //RESET STATE
        }).then(function () {
            return CloudFoundryApps.stop(app_guid);
        }).then(function (result) {
            console.log(result.entity.state);
            expect(true).to.equal(true);
        }).catch(function (reason) {
            expect(reason).to.equal("Not found App.");
        });
    });

    it("The platform returns Routes from an App", function () {
        this.timeout(50000);

        function recursiveGetAppRoutes(appRouteGuidList) {

            //Check maybe the limit is short
            var iterationLimit = 50;
            var counter = 0;
            var app_guid = null;
            var appRouteGuidMap = {};

            return new Promise(function check(resolve, reject) {

                app_guid = appRouteGuidList[counter];
                CloudFoundryApps.getAppRoutes(app_guid).then(function (result) {

                    if (result.resources.length > 0) {
                        if (result.resources.length > 1) {
                            reject(new Error("RARE CASE"));
                        }
                        appRouteGuidMap[result.resources[0].metadata.guid] = result.resources[0].metadata.guid;
                    }

                    //Criteria to exit
                    if (counter === (appRouteGuidList.length - 1)) {
                        resolve(appRouteGuidMap);
                    } else if (counter === iterationLimit) {
                        reject(new Error("Timeout"));
                    } else {
                        counter += 1;
                        setTimeout(check, 1000, resolve, reject);
                    }
                }, reject); //Catch any check exceptions;

            });

        }

        var appRouteGuidList = [];
        var ERROR_MESSAGE_NO_APPS = "No App";

        return CloudFoundryApps.getApps().then(function (result) {

            if (result.total_results === 0) {
                return new Promise(function check(resolve, reject) {
                    reject(ERROR_MESSAGE_NO_APPS);
                });
            }

            var i = 0;
            for (i = 0; i < result.resources.length; i++) {
                appRouteGuidList.push(result.resources[i].metadata.guid);
            }

            return recursiveGetAppRoutes(appRouteGuidList);
        }).then(function (result) {
            expect(true).to.equal(true);
            //expect(result).to.be.a('Array');
        }).catch(function (reason) {
            console.log(reason);
            expect(reason).to.equal(ERROR_MESSAGE_NO_APPS);
        });
    });

    it("The platform returns Service Bindings from an App", function () {
        this.timeout(25000);

        var app_guid = null;

        return CloudFoundryApps.getApps().then(function (result) {
            return new Promise(function (resolve, reject) {
                expect(result.total_results).to.be.a('number');
                if (result.total_results > 0) {
                    app_guid = result.resources[0].metadata.guid;
                    return resolve();
                }else {
                    return reject("Not found App.");
                }
            });
        }).then(function () {
            return CloudFoundryApps.getServiceBindings(app_guid);
        }).then(function (result) {
            expect(result.total_results).to.be.a('number');
        }).catch(function (reason) {
            expect(reason).to.equal("Not found App.");
        });
    });

    it("The platform returns Service Bindings from an App with a filter", function () {
        this.timeout(3500);

        var app_guid = null;

        var filter = {
            'q': 'service_instance_guid:' + "850c8006-d046-483f-b9a5-056d25e8ca0b"
        };

        return CloudFoundryApps.getApps().then(function (result) {
            return new Promise(function (resolve, reject) {
                expect(result.total_results).to.be.a('number');
                if (result.total_results > 0) {
                    app_guid = result.resources[0].metadata.guid;
                    return resolve();
                }else {
                    return reject("Not found App.");
                }
            });
        }).then(function () {
            return CloudFoundryApps.getServiceBindings(app_guid, filter);
        }).then(function (result) {
            //console.log(result);
            expect(result.total_results).to.be.a('number');
        }).catch(function (reason) {
            expect(reason).to.equal("Not found App.");
        });
    }); 

    it("The platform returns Environment Variables from an App", function () {
        this.timeout(3500);

        var app_guid = null;

        return CloudFoundryApps.getApps().then(function (result) {
            return new Promise(function (resolve, reject) {
                expect(result.total_results).to.be.a('number');
                if (result.total_results > 0) {
                    app_guid = result.resources[0].metadata.guid;
                    return resolve();
                }else {
                    return reject("Not found App.");
                }
            });
        }).then(function () {
            return CloudFoundryApps.getEnvironmentVariables(app_guid);
        }).then(function (result) {
            //console.log(result);
            expect(true).to.be.a('boolean');
        }).catch(function (reason) {
            expect(reason).to.equal("Not found App.");
        });
    });       

    it.skip("[TOOL] Remove app", function () {
        this.timeout(40000);

        var app_guid = "c3efd256-1225-4b2a-83ab-453e2f902944";

        return CloudFoundryApps.remove(app_guid).then(function (result) {
            //console.log(result);
            expect(true).to.equal(true);
        });
    });

});
