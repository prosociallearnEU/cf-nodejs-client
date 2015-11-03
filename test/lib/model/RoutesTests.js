/*jslint node: true*/
/*global Promise:true, describe: true, before: true, it: true*/
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

var CloudFoundry = require("../../../lib/model/CloudFoundry");
var CloudFoundryApps = require("../../../lib/model/Apps");
var CloudFoundryRoutes = require("../../../lib/model/Routes");
var CloudFoundryDomains = require("../../../lib/model/Domains");
var CloudFoundrySpaces = require("../../../lib/model/Spaces");
CloudFoundry = new CloudFoundry();
CloudFoundryApps = new CloudFoundryApps();
CloudFoundryRoutes = new CloudFoundryRoutes();
CloudFoundryDomains = new CloudFoundryDomains();
CloudFoundrySpaces = new CloudFoundrySpaces();

function randomInt(low, high) {
    return Math.floor(Math.random() * (high - low) + low);
}

describe.only("Cloud Foundry Routes", function () {

    var authorization_endpoint = null;
    var token_endpoint = null;
    var token_type = null;
    var access_token = null;
    var domain_guid = null;
    var space_guid = null;

    before(function () {
        this.timeout(25000);

        CloudFoundry.setEndPoint(cf_api_url);
        CloudFoundryApps.setEndPoint(cf_api_url);
        CloudFoundryRoutes.setEndPoint(cf_api_url);
        CloudFoundryDomains.setEndPoint(cf_api_url);
        CloudFoundrySpaces.setEndPoint(cf_api_url);
      
        return CloudFoundry.getInfo().then(function (result) {
            authorization_endpoint = result.authorization_endpoint;            
            token_endpoint = result.token_endpoint;
            return CloudFoundry.login(authorization_endpoint, username, password);
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
                //console.log(result.resources[0])
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
        var routeOptions = {
            'domain_guid' : domain_guid,
            'space_guid' : space_guid,
            'host' : routeName
        };

        return CloudFoundryRoutes.addRoute(token_type, access_token, routeOptions).then(function (result) {
            expect(result.metadata.guid).is.a("string");
        });

    });


    it("Remove a Route (Create & Remove)", function () {
        this.timeout(25000);

        var route_guid = null;
        var initial_route_count = 0;
        var page = 1;
        var routeName = "RouteToRemove";
        var routeOptions = {
            'domain_guid' : domain_guid,
            'space_guid' : space_guid,
            'host' : routeName
        };        

        return CloudFoundryRoutes.getRoutes(token_type, access_token, page).then(function (result) {
            initial_route_count = result.total_results;
            return CloudFoundryRoutes.addRoute(token_type, access_token, routeOptions);
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

    it("Search a impossible route", function () {
        this.timeout(5000);

        var routeName = "noroute";
        var filter = {
            'q': 'host:' + routeName + ';domain_guid:' + domain_guid
        };

        return CloudFoundryRoutes.checkRoute(token_type, access_token, filter).then(function (result) {
            expect(result.total_results).to.equal(0);
        });

    });

    it("Search and get several routes", function () {
        this.timeout(5000);

        var routeName = "noroute";
        var filter = {
            'q': 'domain_guid:' + domain_guid,
            'results-per-page': 100
        };

        return CloudFoundryRoutes.checkRoute(token_type, access_token, filter).then(function (result) {

/*
            for(var i = 0; i < result.resources.length; i++) {
                console.log(i, result.resources[i].entity.host);
            }
*/
            expect(result.total_results).to.be.below(1001)
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
