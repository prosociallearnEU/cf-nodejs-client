/*jslint node: true*/
/*global describe: true, it: true*/
"use strict";

var chai = require("chai"),
    expect = require("chai").expect;
var randomWords = require('random-words');


var config = require('../../../config.json');
var cloudFoundry = require("../../../lib/model/CloudFoundry");
var cloudFoundryApps = require("../../../lib/model/Apps");
var cloudFoundryRoutes = require("../../../lib/model/Routes");
var cloudFoundryDomains = require("../../../lib/model/Domains");
var cloudFoundrySpaces = require("../../../lib/model/Spaces");
cloudFoundry = new cloudFoundry(config.CF_API_URL);
cloudFoundryApps = new cloudFoundryApps(config.CF_API_URL);
cloudFoundryRoutes = new cloudFoundryRoutes(config.CF_API_URL);
cloudFoundryDomains = new cloudFoundryDomains(config.CF_API_URL);
cloudFoundrySpaces = new cloudFoundrySpaces(config.CF_API_URL);

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

var page = 1;//Pagination parameters
var routesList = [];
var token_endpoint = null;
var route_guid = null;
var domain_guid = null;
var space_guid = null;
var routeName = randomWords();
var appName = null;
var app_guid = null;

function getRoutes(){

    return new Promise(function (resolve, reject) {

        cloudFoundry.getInfo().then(function (result) {
            token_endpoint = result.token_endpoint;
            return cloudFoundry.login(token_endpoint,config.username,config.password).then(function (result) {
                return cloudFoundryRoutes.getRoutes(result.token_type,result.access_token,page).then(function (result) {
                    return new Promise(function (resolve, reject) {
                        if(result.total_results == 0){
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
function getRoute(){

    return new Promise(function (resolve, reject) {

        cloudFoundry.getInfo().then(function (result) {
            token_endpoint = result.token_endpoint;
            return cloudFoundry.login(token_endpoint,config.username,config.password).then(function (result) {
                return cloudFoundryRoutes.getRoutes(result.token_type,result.access_token,page).then(function (result) {
                    return new Promise(function (resolve, reject) {
                        if(result.resources.length == 0){
                            return reject();
                        }
                        route_guid = result.resources[0].metadata.guid;
                        //console.log(route_guid);
                        return resolve();
                    });
                });
            });
        }).then(function (result) {
            return cloudFoundry.login(token_endpoint,config.username,config.password).then(function (result) {
                return cloudFoundryRoutes.getRoute(result.token_type,result.access_token,route_guid);
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
function addRoute(){

    return new Promise(function (resolve, reject) {

        cloudFoundry.getInfo().then(function (result) {
            token_endpoint = result.token_endpoint;
            return cloudFoundry.login(token_endpoint,config.username,config.password).then(function (result) {   
                return cloudFoundryDomains.getDomains(result.token_type,result.access_token).then(function (result) {
                    return new Promise(function (resolve, reject) {
                        domain_guid = result.resources[0].metadata.guid;
                        return resolve();
                    });
                });
            });
        }).then(function (result) {
            return cloudFoundry.login(token_endpoint,config.username,config.password).then(function (result) {
                return cloudFoundrySpaces.getSpaces(result.token_type,result.access_token).then(function (result) {
                    return new Promise(function (resolve, reject) {
                        space_guid = result.resources[0].metadata.guid;
                        return resolve();
                    });
                });
            });
        }).then(function (result) {
            return cloudFoundry.login(token_endpoint,config.username,config.password).then(function (result) {   
                return cloudFoundryRoutes.addRoute(result.token_type,result.access_token,domain_guid,space_guid,routeName);
            });
        }).then(function (result) {
            //console.log("New route: ", result.entity.host , " ", result.metadata.guid);
            route_guid = result.metadata.guid;
            return resolve(result);
        }).catch(function (reason) {
            console.error("Error: " + reason);
            return reject(reason);
        });

    }); 

}

describe("Cloud Foundry Routes", function () {

    it("The platform returns Routes", function () {

        getRoutes().then(function (result) {
            expect(result.total_results).to.not.be.undefined;
        }).catch(function (reason) {
            expect(impossible).to.not.be.undefined;
        });

    });    

    it("The platform returns a unique Route", function () {

        getRoute().then(function (result) {
            expect(result.metadata.guid).to.not.be.undefined;
        }).catch(function (reason) {
            expect(impossible).to.not.be.undefined;
        });

    }); 

    it("Add a Route", function () {

        addRoute().then(function (result) {
            expect(result.metadata.guid).to.not.be.undefined;
        }).catch(function (reason) {
            expect(impossible).to.not.be.undefined;
        });

    }); 

});