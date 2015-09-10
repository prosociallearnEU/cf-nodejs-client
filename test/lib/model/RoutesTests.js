/*jslint node: true*/
/*global Promise:true, describe: true, before: true, it: true*/
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
var CloudFoundryRoutes = require("../../../lib/model/Routes");
var CloudFoundryDomains = require("../../../lib/model/Domains");
var CloudFoundrySpaces = require("../../../lib/model/Spaces");
CloudFoundry = new CloudFoundry(nconf.get('CF_API_URL'));
CloudFoundryApps = new CloudFoundryApps(nconf.get('CF_API_URL'));
CloudFoundryRoutes = new CloudFoundryRoutes(nconf.get('CF_API_URL'));
CloudFoundryDomains = new CloudFoundryDomains(nconf.get('CF_API_URL'));
CloudFoundrySpaces = new CloudFoundrySpaces(nconf.get('CF_API_URL'));

function randomInt(low, high) {
    return Math.floor(Math.random() * (high - low) + low);
}

describe("Cloud Foundry Routes", function () {

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

    it("The platform returns Routes", function () {
        this.timeout(3500);

        var page = 1;
        return CloudFoundryRoutes.getRoutes(token_type, access_token, page).then(function (result) {
            expect(result.total_results).is.a("number");
        });

    });

    it("The platform returns an unique Route", function () {
        this.timeout(5000);

        var page = 1;
        var route_guid = null;
        return CloudFoundryRoutes.getRoutes(token_type, access_token, page).then(function (result) {
            return new Promise(function (resolve, reject) {
                if (result.resources.length === 0) {
                    return reject();
                }
                route_guid = result.resources[0].metadata.guid;
                return resolve();
            });
        }).then(function () {
            return CloudFoundryRoutes.getRoute(token_type, access_token, route_guid);
        }).then(function (result) {
            expect(result.metadata.guid).is.a("string");
        });

    });


    it.skip("Add a Route", function () {
        this.timeout(3500);

        var routeName = randomWords() + randomInt(1, 10);

        return CloudFoundryRoutes.addRoute(token_type, access_token, domain_guid, space_guid, routeName).then(function (result) {
            expect(result.metadata.guid).is.a("string");
        });

    });


    it("Remove a Route (Create & Remove)", function () {
        this.timeout(25000);

        var route_guid = null;
        var initial_route_count = 0;
        var page = 1;
        var routeName = "RouteToRemove";

        return CloudFoundryRoutes.getRoutes(token_type, access_token, page).then(function (result) {
            initial_route_count = result.total_results;
            return CloudFoundryRoutes.addRoute(token_type, access_token, domain_guid, space_guid, routeName);
        }).then(function (result) {
            route_guid = result.metadata.guid;
            return CloudFoundryRoutes.getRoutes(token_type, access_token, page);
        }).then(function (result) {
            expect(result.total_results).to.equal(initial_route_count + 1);
            return CloudFoundryRoutes.deleteRoute(token_type, access_token, route_guid);
        }).then(function () {
            return CloudFoundryRoutes.getRoutes(token_type, access_token, page);
        }).then(function (result) {
            expect(result.total_results).to.equal(initial_route_count);
        });

    });

    it("Check a impossible route", function () {
        this.timeout(5000);

        var routeName = "noroute";

        return CloudFoundryRoutes.checkRoute(token_type, access_token, routeName, domain_guid).then(function (result) {
            expect(result.total_results).to.equal(0);
        });

    });

    //Inner function used to check when an application run in the system.
    function recursiveGetRoutes(token_type, access_token) {

        console.log("Get a array of routes from CF instances");

        var iterationLimit = 50;
        var counter = 1;
        var arrayRouteList = [];

        return new Promise(function check(resolve, reject) {

            CloudFoundryRoutes.getRoutes(token_type, access_token, counter).then(function (result) {
                console.log(counter);

                //Fill Array
                var i = 0;
                for (i = 0; i < result.resources.length; i++) {
                    arrayRouteList.push(result.resources[i].metadata.guid);
                }

                //Criteria to exit
                if (result.total_pages === counter) {
                    resolve(arrayRouteList);
                } else if (counter === iterationLimit) {
                    reject(new Error("Timeout"));
                } else {
                    counter += 1;
                    setTimeout(check, 1000, resolve, reject);
                }
            }, reject); //Catch any check exceptions;

        });

    }

    it("Paginate routes", function () {
        this.timeout(50000);

        return recursiveGetRoutes(token_type, access_token).then(function (result) {
            expect(true).to.equal(true);
        }).catch(function (reason) {
            expect(reason).to.equal("Timeout");
        });

    });

    it.skip("[TOOL] Paginate and remove bad routes", function () {
        this.timeout(200000);

        function recursiveGetAppRoutes(token_type, access_token, appRouteGuidList) {

            console.log("Get routes from current Apps");

            var iterationLimit = 10;
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

        function inferenceBlock(appRouteGuidMap, route_guid) {
            return new Promise(function check(resolve, reject) {
                if (appRouteGuidMap[route_guid] !== undefined) {
                    return resolve(true);
                }
                return resolve(false);
            });
        }

        function recursiveRemoveRoutes(token_type, access_token, appRouteGuidMap, routeArray) {

            console.log("Remove routes using a route array");

            var iterationLimit = 1500;
            var counter = 0;
            var route_guid = null;
            var isApp = false;

            return new Promise(function check(resolve, reject) {

                route_guid = routeArray[counter];
                inferenceBlock(appRouteGuidMap, route_guid).then(function (result) {
                    isApp = result;
                    if (isApp === false) {
                        return CloudFoundryRoutes.deleteRoute(token_type, access_token, route_guid);
                    }

                    return new Promise(function check(resolve, reject) {
                        return resolve();
                    });
                }).then(function () {
                    console.log(counter, route_guid, isApp);

                    //Criteria to exit
                    if (counter === routeArray.length) {
                        resolve("OK");
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
        var appRouteGuidMap = {};

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
            appRouteGuidMap = result;
            //console.log(appRouteGuidMap);
            return recursiveGetRoutes(token_type, access_token);
        }).then(function (result) {
            console.log(result.length);

            console.log("Routes to not remove");
            var i = 0;
            for (i = 0; i < result.length; i++) {

                if (appRouteGuidMap[result[i]] !== undefined) {
                    console.log(i + " " + result[i]);
                }

            }

            return recursiveRemoveRoutes(token_type, access_token, appRouteGuidMap, result);
        }).then(function () {
            expect(true).to.equal(true);
        }).catch(function (reason) {
            expect(reason).to.equal("Timeout");
        });


    });

    it("Get total of routes", function () {
        this.timeout(5000);

        var page = 1;

        return CloudFoundryRoutes.getRoutes(token_type, access_token, page).then(function (result) {
            console.log(result.total_results);
            expect(result.total_results).to.be.below(1001);
        });

    });

});
