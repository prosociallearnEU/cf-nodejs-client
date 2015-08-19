/*jslint node: true*/
/*global Promise:true*/
/*global describe: true, it: true*/
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

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

function randomInt(low, high) {
    return Math.floor(Math.random() * (high - low) + low);
}

//Get routes
function getRoutes() {

    var token_endpoint = null;
    var page = 1;//Pagination parameters

    return new Promise(function (resolve, reject) {

        CloudFoundry.getInfo().then(function (result) {
            token_endpoint = result.token_endpoint;
            return CloudFoundry.login(token_endpoint, username, password).then(function (result) {
                return CloudFoundryRoutes.getRoutes(result.token_type, result.access_token, page).then(function (result) {
                    return new Promise(function (resolve, reject) {
                        if (result.total_results === 0) {
                            return reject("No routes");
                        }
                        return resolve(result);
                    });
                });
            });
        }).then(function (result) {
            return resolve(result);
        }).catch(function (reason) {
            console.error("Error: " + reason);
            return reject(reason);
        });

    });
}

//Get a route
function getRoute() {

    var token_endpoint = null;
    var page = 1;//Pagination parameters
    var route_guid = null;

    return new Promise(function (resolve, reject) {

        CloudFoundry.getInfo().then(function (result) {
            token_endpoint = result.token_endpoint;
            return CloudFoundry.login(token_endpoint, username, password).then(function (result) {
                return CloudFoundryRoutes.getRoutes(result.token_type, result.access_token, page).then(function (result) {
                    return new Promise(function (resolve, reject) {
                        if (result.resources.length === 0) {
                            return reject();
                        }
                        route_guid = result.resources[0].metadata.guid;
                        //console.log(route_guid);
                        return resolve();
                    });
                });
            });
        }).then(function () {
            return CloudFoundry.login(token_endpoint, username, password).then(function (result) {
                return CloudFoundryRoutes.getRoute(result.token_type, result.access_token, route_guid);
            });
        }).then(function (result) {
            return resolve(result);
        }).catch(function (reason) {
            console.error("Error: " + reason);
            return reject(reason);
        });

    });
}

//Add a route
function addRoute() {

    var token_endpoint = null;
    //var page = 1;//Pagination parameters
    var domain_guid = null;
    var space_guid = null;
    var routeName = randomWords() + randomInt(1, 10);

    return new Promise(function (resolve, reject) {

        CloudFoundry.getInfo().then(function (result) {
            token_endpoint = result.token_endpoint;
            return CloudFoundry.login(token_endpoint, username, password).then(function (result) {
                return CloudFoundryDomains.getDomains(result.token_type, result.access_token).then(function (result) {
                    return new Promise(function (resolve) {
                        domain_guid = result.resources[0].metadata.guid;
                        return resolve();
                    });
                });
            });
        }).then(function () {
            return CloudFoundry.login(token_endpoint, username, password).then(function (result) {
                return CloudFoundrySpaces.getSpaces(result.token_type, result.access_token).then(function (result) {
                    return new Promise(function (resolve) {
                        space_guid = result.resources[0].metadata.guid;
                        return resolve();
                    });
                });
            });
        }).then(function () {
            return CloudFoundry.login(token_endpoint, nconf.get('username'), nconf.get('password')).then(function (result) {
                return CloudFoundryRoutes.addRoute(result.token_type, result.access_token, domain_guid, space_guid, routeName);
            });
        }).then(function (result) {
            //console.log("New route: ", result.entity.host , " ", result.metadata.guid);
            //route_guid = result.metadata.guid;
            return resolve(result);
        }).catch(function (reason) {
            console.error("Error: " + reason);
            return reject(reason);
        });

    });

}

//Remove Route
//This idea is buggy. It is necessary to paginate. (Loop with promises)
function removeRoute() {

    var token_endpoint = null;
    var routesList = [];
    var page = 1;
    var routeName = null;
    var i = 0;
    var route_guid = null;

    console.log("# Remove a route");
    return new Promise(function (resolve, reject) {

        CloudFoundry.getInfo().then(function (result) {
            token_endpoint = result.token_endpoint;
            return CloudFoundry.login(token_endpoint, username, password).then(function (result) {
                return CloudFoundryRoutes.getRoutes(result.token_type, result.access_token, page).then(function (result) {
                    return new Promise(function (resolve, reject) {
                        if (result.total_results === 0) {
                            return reject("No routes");
                        }
                        return resolve(result);
                    });
                });
            });
        }).then(function (result) {
            //console.log(result)
            var total = result.total_results;
            console.log(total);
            if (total > 0) {
                if (total > 50) {
                    for (i = 0; i < result.resources.length; i++) {
                        //console.log(i, " " ,result.resources[i].entity.host, "  ", result.resources[i].metadata.guid);

                        routesList.push({
                            'route': result.resources[i].entity.host,
                            'guid': result.resources[i].metadata.guid
                        });
                    }

                    //TODO: How to do a Loop with promises to paginate?
                    //Manual pagination for second page
                    page = 2;
                    return CloudFoundry.login(token_endpoint, username, password).then(function (result) {
                        return CloudFoundryRoutes.getRoutes(result.token_type, result.access_token, page).then(function (result) {
                            return new Promise(function (resolve, reject) {
                                if (result.total_results === 0) {
                                    return reject("No routes");
                                }
                                //List

                                for (i = 0; i < result.resources.length; i++) {
                                    //console.log(i, " " ,result.resources[i].entity.host, "  ", result.resources[i].metadata.guid);
                                    routesList.push({
                                        'route': result.resources[i].entity.host,
                                        'guid': result.resources[i].metadata.guid
                                    });
                                }

                                //Show
                                for (i = 0; i < routesList.length; i++) {
                                    if (routesList[i].route === routeName) {
                                        console.log(i + " " + routesList[i].route + " " + routesList[i].guid);
                                        console.log("FOUND");
                                        break;
                                    }
                                }

                                return resolve(result);
                            });
                        });
                    });
                }else {
                    for (i = 0; i < result.resources.length; i++) {
                        //console.log(i, " " ,result.resources[i].entity.host, "  ", result.resources[i].metadata.guid);
                        routesList.push({
                            'route': result.resources[i].entity.host,
                            'guid': result.resources[i].metadata.guid
                        });
                    }
                }

                return reject("KO, Test 1");
            }else {
                return reject("KO, Test 1");
            }
        }).then(function () {
            return CloudFoundry.login(token_endpoint, username, password).then(function (result) {
                return CloudFoundryRoutes.deleteRoute(result.token_type, result.access_token, route_guid);
            });
        }).then(function () {
            return CloudFoundry.login(token_endpoint, username, password).then(function (result) {
                return CloudFoundryRoutes.getRoutes(result.token_type, result.access_token, page).then(function (result) {
                    return new Promise(function (resolve, reject) {
                        if (result.total_results === 0) {
                            return reject("No routes");
                        }
                        var total = result.total_results;
                        console.log(total);
                        return resolve(result);
                    });
                });
            });
        }).then(function (result) {
            return resolve(result);
        }).catch(function (reason) {
            console.error("Error: " + reason);
            return reject(reason);
        });

    });
}

//Check a route
function checkRoute(routeName) {

    var token_endpoint = null;
    var domain_guid = null;

    return new Promise(function (resolve, reject) {

        CloudFoundry.getInfo().then(function (result) {
            token_endpoint = result.token_endpoint;
            return CloudFoundry.login(token_endpoint, username, password).then(function (result) {
                return CloudFoundryDomains.getDomains(result.token_type, result.access_token).then(function (result) {
                    return new Promise(function (resolve) {
                        domain_guid = result.resources[0].metadata.guid;
                        return resolve(result);
                    });
                });
            });
        }).then(function () {
            return CloudFoundry.login(token_endpoint, username, password).then(function (result) {
                return CloudFoundryRoutes.checkRoute(result.token_type, result.access_token, routeName, domain_guid);
            });
        }).then(function (result) {
            return resolve(result);
        }).catch(function (reason) {
            console.error("Error: " + reason);
            return reject(reason);
        });

    });
}

describe("Cloud Foundry Routes", function () {

    it("The platform returns Routes", function () {
        this.timeout(3500);

        return getRoutes().then(function (result) {
            expect(result.total_results).is.a("number");
        });

    });

    it("The platform returns an unique Route", function () {
        this.timeout(5000);

        return getRoute().then(function (result) {
            expect(result.metadata.guid).is.a("string");
        });

    });

    it.skip("Add a Route", function () {
        this.timeout(3500);

        return addRoute().then(function (result) {
            expect(result.metadata.guid).is.a("string");
        });

    });

    it("Remove a Route", function () {
        this.timeout(25000);

        var token_endpoint = null;
        var route_guid = null;
        var initial_route_count = 0;

        return getRoutes().then(function (result) {
            initial_route_count = result.total_results;
            return addRoute();
        }).then(function (result) {
            route_guid = result.metadata.guid;
            return getRoutes();
        }).then(function (result) {
            expect(result.total_results).to.equal(initial_route_count + 1);
            return CloudFoundry.getInfo().then(function (result) {
                token_endpoint = result.token_endpoint;
                return CloudFoundry.login(token_endpoint, username, password).then(function (result) {
                    return CloudFoundryRoutes.deleteRoute(result.token_type, result.access_token, route_guid).then(function (result) {
                        return new Promise(function (resolve) {
                            return resolve(result);
                        });
                    });
                });
            });
        }).then(function () {
            return getRoutes();
        }).then(function (result) {
            expect(result.total_results).to.equal(initial_route_count);
        });

    });

    it("Check a impossible route", function () {
        this.timeout(5000);

        var routeName = "noroute";

        return checkRoute(routeName).then(function (result) {
            expect(result.total_results).to.equal(0);
        });

    });

});