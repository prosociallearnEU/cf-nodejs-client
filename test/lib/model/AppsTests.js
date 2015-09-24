/*jslint node: true*/
/*global Promise:true, describe: true, before:true, it: true*/
"use strict";

var chai = require("chai"),
    chaiAsPromised = require("chai-as-promised"),
    expect = require("chai").expect;
chai.use(chaiAsPromised);

var nconf = require('nconf');
nconf.argv().env().file({ file: 'config.json' });

var cf_api_url = nconf.get('CF_API_URL'),
    username = nconf.get('username'),
    password = nconf.get('password');

var CloudFoundry = require("../../../lib/model/CloudFoundry");
var CloudFoundryApps = require("../../../lib/model/Apps");
var CloudFoundrySpaces = require("../../../lib/model/Spaces");
CloudFoundry = new CloudFoundry(cf_api_url);
CloudFoundryApps = new CloudFoundryApps(cf_api_url);
CloudFoundrySpaces = new CloudFoundrySpaces(cf_api_url);

describe("Cloud Foundry Apps", function () {

    var token_endpoint = null;
    var token_type = null;
    var access_token = null;
    var space_guid = null;

    before(function () {
        this.timeout(5000);

        return CloudFoundry.getInfo().then(function (result) {
            token_endpoint = result.token_endpoint;
            return CloudFoundry.login(token_endpoint, username, password);
        }).then(function (result) {
            token_type = result.token_type;
            access_token = result.access_token;
            return CloudFoundrySpaces.getSpaces(token_type, access_token);
        }).then(function (result) {
            space_guid = result.resources[0].metadata.guid;
        });

    });

    it("The platform returns Apps", function () {
        this.timeout(2500);

        return CloudFoundryApps.getApps(token_type, access_token).then(function (result) {
            expect(result.total_results).to.be.a('number');
        });
    });

    it("The platform can't find an unknown app", function () {
        this.timeout(3500);

        var app_guid = null;
        var appToFind = "unknownApp";

        return CloudFoundryApps.getApps(token_type, access_token).then(function (result) {
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

        return CloudFoundryApps.getApps(token_type, access_token).then(function (result) {
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
            return CloudFoundryApps.getSummary(token_type, access_token, app_guid);
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

        return CloudFoundryApps.getApps(token_type, access_token).then(function (result) {
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
            return CloudFoundryApps.getStats(token_type, access_token, app_guid);
        }).then(function () {
            expect(true).to.equal(true);
        }).catch(function (reason) {
            expect(reason).to.equal("Not found App.");
        });
    });

    it.skip("The platform returns instances from an App", function () {
        this.timeout(3500);

        var app_guid = null;

        return CloudFoundryApps.getApps(token_type, access_token).then(function (result) {
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
            return CloudFoundryApps.getInstances(token_type, access_token, app_guid);
        }).then(function () {
            expect(true).to.equal(true);
        }).catch(function (reason) {
            expect(reason).to.equal("Not found App.");
        });
    });

    it.skip("Start an App", function () {
        this.timeout(60000);

        //Inner function used to check when an application run in the system.
        function recursiveCheckApp(token_type, access_token, app_guid) {

            var iterationLimit = 10;
            var counter = 0;

            return new Promise(function check(resolve, reject) {

                CloudFoundryApps.getInstances(token_type, access_token, app_guid).then(function () {
                    return CloudFoundryApps.getStats(token_type, access_token, app_guid);
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
        return CloudFoundrySpaces.getSpaceApps(token_type, access_token, space_guid, filter).then(function (result) {
            app_guid = result.resources[0].metadata.guid;
            //console.log(app_guid);
            console.log(result.resources[0].entity.state);
            return CloudFoundryApps.startApp(token_type, access_token, app_guid);
        }).then(function () {
            return recursiveCheckApp(token_type, access_token, app_guid);
        //RESET STATE
        }).then(function () {
            return CloudFoundryApps.stopApp(token_type, access_token, app_guid);
        }).then(function (result) {
            console.log(result.entity.state);
            expect(true).to.equal(true);
        }).catch(function (reason) {
            expect(reason).to.equal("Not found App.");
        });
    });

    it("The platform returns Routes from an App", function () {
        this.timeout(15000);

        function recursiveGetAppRoutes(token_type, access_token, appRouteGuidList) {

            //console.log("Get routes from current Apps");

            //Check maybe the limit is short
            var iterationLimit = 20;
            var counter = 0;
            var app_guid = null;
            var appRouteGuidMap = {};

            return new Promise(function check(resolve, reject) {

                app_guid = appRouteGuidList[counter];
                CloudFoundryApps.getAppRoutes(token_type, access_token, app_guid).then(function (result) {

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

        return CloudFoundryApps.getApps(token_type, access_token).then(function (result) {

            if (result.total_results === 0) {
                return new Promise(function check(resolve, reject) {
                    reject(new Error("No App"));
                });
            }

            var i = 0;
            for (i = 0; i < result.resources.length; i++) {
                appRouteGuidList.push(result.resources[i].metadata.guid);
            }

            return recursiveGetAppRoutes(token_type, access_token, appRouteGuidList);
        }).then(function (result) {
            expect(true).to.equal(true);
            //expect(result).to.be.a('Array');
        }).catch(function (reason) {
            console.log(reason);
            expect(reason).to.equal("Not found App.");
        });
    });

});
