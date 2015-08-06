/*jslint node: true*/
/*globals Promise:true*/
"use strict";

var randomWords = require('random-words');
//var config = require('./configPivotal.json');
var config = require('./config.json');
var cloudFoundry = require("../lib/model/CloudFoundry");
var cloudFoundryRoutes = require("../lib/model/Routes");
var cloudFoundryDomains = require("../lib/model/Domains");
var cloudFoundrySpaces = require("../lib/model/Spaces");
var cloudFoundryApps = require("../lib/model/Apps");
cloudFoundry = new cloudFoundry(config.CF_API_URL);
cloudFoundryRoutes = new cloudFoundryRoutes(config.CF_API_URL);
cloudFoundryDomains = new cloudFoundryDomains(config.CF_API_URL);
cloudFoundrySpaces = new cloudFoundrySpaces(config.CF_API_URL);
cloudFoundryApps = new cloudFoundryApps(config.CF_API_URL);

//TODO: How to improve this idea
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

//Get Routes
function getRoutes(){

    console.log("# Get routes");
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
            if(result.total_results) {
                return resolve("OK, Test getRoutes");
            }else{
                return reject("KO, Test getRoutes");     
            }
        }).catch(function (reason) {
            console.error("Error: " + reason);
            return reject("KO, Test 1");
        });

    }); 
}

//Get a route
function getRoute(){

    console.log("# Get a route");
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
            //console.log(result);
            return resolve("OK, Test 2");
        }).catch(function (reason) {
            console.error("Error: " + reason);
            return reject("KO, Test 2");
        });

    });

}

//Add a route
function addRoute(){

    console.log("# Add a route"); 
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
            console.log("New route: ", result.entity.host , " ", result.metadata.guid);
            route_guid = result.metadata.guid;
            return resolve("OK, Test Add");
        }).catch(function (reason) {
            console.error("Error: " + reason);
            return reject("KO, Test Add");
        });

    }); 

}

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
function checkRoute(){

    console.log("# Check a route");
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
                return cloudFoundryRoutes.checkRoute(result.token_type,result.access_token,"routedemo1",domain_guid);  
            });
        }).then(function (result) {
            //TODO: No inference ??
            console.log(result);
            return resolve("OK, Test 4");  
        }).catch(function (reason) { 
            console.error("Error: " + reason);
            return reject("KO, Test 4");   
        });

    });

}

/*
//Associate Route
//TODO: Move example to apps
function acceptRoute(){

    console.log("# Accept a route");
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
            //TODO: Refactor this part. Maybe it is possible to use a CF method to get info from a specific App.
            appName = "HelloWorldJSP";
            return cloudFoundry.login(token_endpoint,config.username,config.password).then(function (result) {
                return cloudFoundryApps.getApps(result.token_type,result.access_token).then(function (result) {
                    return new Promise(function (resolve, reject) {
                        //console.log(result.resources.length);
                        for(var i = 0; i < result.resources.length; i++){
                            if(result.resources[i].entity.name == appName){
                                //console.log(result.resources[i].entity.name);
                                //console.log(result.resources[i].metadata);
                                app_guid = result.resources[i].metadata.guid;
                                return resolve(result.resources[i].metadata.guid);
                            }
                        }
                        return reject("Not found App.");
                    });
                });
            });            
        }).then(function (result) {
            return cloudFoundry.login(token_endpoint,config.username,config.password).then(function (result) {   
                return cloudFoundryRoutes.acceptRoute(result.token_type,result.access_token,appName,app_guid,domain_guid,space_guid,route_guid);
            });           
        }).then(function (result) {
            //console.log(result);
            return resolve("OK, Test 5");
        }).catch(function (reason) {   
            console.error("Error: " + reason);
            return resolve("KO, Test 5");
        });

    });

}
*/

//Examples about Routes executed in an Order.
addRoute().then(function (result) {
    return removeRoute();
}).then(function (result) {    
    return getRoutes();
}).then(function (result) {
    return getRoute();
}).then(function (result) { 
    return checkRoute();
}).then(function (result) {     
    console.log(result);
}).catch(function (reason) { 
    console.error("Error: " + reason);
});