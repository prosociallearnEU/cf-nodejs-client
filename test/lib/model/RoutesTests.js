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

function randomInt (low, high) {
    return Math.floor(Math.random() * (high - low) + low);
}

//Get routes
function getRoutes(){

    var token_endpoint = null;
    var page = 1;//Pagination parameters

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

    var token_endpoint = null;
    var page = 1;//Pagination parameters
    var route_guid = null;

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

    var token_endpoint = null;
    var page = 1;//Pagination parameters
    var domain_guid = null;
    var space_guid = null;
    var routeName = randomWords() + randomInt(1,10); 
    var route_guid = null;

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

//Remove Route
//This idea is buggy. It is necessary to paginate. (Loop with promises)
function removeRoute(){

    console.log("# Remove a route");
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
            //console.log(result)
            var total = result.total_results;
            console.log(total);
            if(total > 0){
                if(total > 50){
                    for(var i = 0; i< result.resources.length; i++){
                        //console.log(i, " " ,result.resources[i].entity.host, "  ", result.resources[i].metadata.guid);
                        
                        routesList.push({
                            'route': result.resources[i].entity.host,
                            'guid': result.resources[i].metadata.guid
                        });
                    }

                    //TODO: How to do a Loop with promises to paginate?
                    //Manual pagination for second page
                    page = 2;
                    return cloudFoundry.login(token_endpoint,config.username,config.password).then(function (result) {
                        return cloudFoundryRoutes.getRoutes(result.token_type,result.access_token,page).then(function (result) {
                            return new Promise(function (resolve, reject) {
                                if(result.total_results == 0){
                                    return reject("No routes");
                                }
                                //List
                                for(var i = 0; i< result.resources.length; i++){
                                    //console.log(i, " " ,result.resources[i].entity.host, "  ", result.resources[i].metadata.guid);
                                    routesList.push({
                                        'route': result.resources[i].entity.host,
                                        'guid': result.resources[i].metadata.guid
                                    });
                                }

                                //Show
                                for(var i = 0; i< routesList.length; i++){
                                    if(routesList[i].route === routeName){
                                        console.log(i + " " + routesList[i].route + " " + routesList[i].guid);
                                        console.log("FOUND");
                                        break;
                                    }
                                }

                                return resolve(result);
                            });
                        });             
                    }); 
                }else{
                    for(var i = 0; i< result.resources.length; i++){
                        //console.log(i, " " ,result.resources[i].entity.host, "  ", result.resources[i].metadata.guid);
                        routesList.push({
                            'route': result.resources[i].entity.host,
                            'guid': result.resources[i].metadata.guid
                        });
                    }
                }

                return reject("KO, Test 1");
            }else{
                return reject("KO, Test 1");  
            }
        }).then(function (result) {
            return cloudFoundry.login(token_endpoint,config.username,config.password).then(function (result) {   
                return cloudFoundryRoutes.deleteRoute(result.token_type,result.access_token,route_guid);  
            });
        }).then(function (result) {
            return cloudFoundry.login(token_endpoint,config.username,config.password).then(function (result) {
                return cloudFoundryRoutes.getRoutes(result.token_type,result.access_token,page).then(function (result) {
                    return new Promise(function (resolve, reject) {
                        if(result.total_results == 0){
                            return reject("No routes");
                        }
                        var total = result.total_results;
                        console.log(total);
                        return resolve(result);
                    });
                });             
            });
        }).then(function (result) {
            return resolve("OK, Test Remove");   
        }).catch(function (reason) {
            console.error("Error: " + reason);
            return reject("KO, Test Remove");
        });

    });
}

//Check a route
function checkRoute(routeName){

    var token_endpoint = null;
    var domain_guid = null;

    return new Promise(function (resolve, reject) {

        cloudFoundry.getInfo().then(function (result) {
            token_endpoint = result.token_endpoint;
            return cloudFoundry.login(token_endpoint,config.username,config.password).then(function (result) {   
                return cloudFoundryDomains.getDomains(result.token_type,result.access_token).then(function (result) {
                    return new Promise(function (resolve, reject) {
                        domain_guid = result.resources[0].metadata.guid;
                        return resolve(result);
                    });
                });
            });
        }).then(function (result) {
            return cloudFoundry.login(token_endpoint,config.username,config.password).then(function (result) {   
                return cloudFoundryRoutes.checkRoute(result.token_type,result.access_token,routeName,domain_guid);  
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

        return getRoutes().then(function (result) {
            expect(result.total_results).to.not.be.undefined;
        }).catch(function (reason) {
            expect(impossible).to.not.be.undefined;
        });

    });

    it("The platform returns an unique Route", function () {

        return getRoute().then(function (result) {
            expect(result.metadata.guid).to.not.be.undefined;
        }).catch(function (reason) {
            expect(impossible).to.not.be.undefined;
        });

    }); 

    it.skip("Add a Route", function () {
        this.timeout(3500);

        return addRoute().then(function (result) {
            expect(result.metadata.guid).to.not.be.undefined;
        }).catch(function (reason) {
            expect(impossible).to.not.be.undefined;
        });

    });

    it("Remove a Route", function () {
        this.timeout(6500);

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
            expect(result.total_results).to.equal(initial_route_count+1);          
            return cloudFoundry.getInfo().then(function (result) {
                token_endpoint = result.token_endpoint;
                return cloudFoundry.login(token_endpoint,config.username,config.password).then(function (result) {   
                    return cloudFoundryRoutes.deleteRoute(result.token_type,result.access_token,route_guid).then(function (result) {
                        return new Promise(function (resolve, reject) {
                            return resolve(result);
                        });
                    }); 
                });
            });
        }).then(function (result) {
            return getRoutes();         
        }).then(function (result) {
            expect(result.total_results).to.equal(initial_route_count);
        }).catch(function (reason) {
            console.log(reason);
            expect(impossible).to.not.be.undefined;
        });

    });

    it("Check a impossible route", function () {
        var routeName = "noroute";

        return checkRoute(routeName).then(function (result) {
            expect(result.total_results).to.equal(0);
        })

    });        

});