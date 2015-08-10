/*jslint node: true*/
/*globals Promise:true*/
"use strict";

var config = require('./config.json');
//var config = require('./configPivotal.json');
var cloudFoundry = require("../lib/model/CloudFoundry");
var cloudFoundryApps = require("../lib/model/Apps");
var cloudFoundrySpaces = require("../lib/model/Spaces");
var cloudFoundryDomains = require("../lib/model/Domains");
var cloudFoundryRoutes = require("../lib/model/Routes");
var cloudFoundryJobs = require("../lib/model/Jobs");
var zipUtils = require("../lib/utils/ZipUtils");

cloudFoundry = new cloudFoundry(config.CF_API_URL);
cloudFoundryApps = new cloudFoundryApps(config.CF_API_URL);
cloudFoundrySpaces = new cloudFoundrySpaces(config.CF_API_URL);
cloudFoundryDomains = new cloudFoundryDomains(config.CF_API_URL);
cloudFoundryRoutes = new cloudFoundryRoutes(config.CF_API_URL);
cloudFoundryJobs = new cloudFoundryJobs(config.CF_API_URL);
zipUtils = new zipUtils();

//TODO: How to improve this idea
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

//TODO: Check routes (Create routes)

var URL = "https://github.com/jabrena/CloudFoundryLab/raw/master/zips/StaticWebsite_HelloWorld.zip";
var token_endpoint = null;
var appName = null;
var app_guid = null;
var space_guid = null;
var dataRemoteFile = null;
var zipResources = null;
var manifest = null;
var domain_guid = null;
var route_guid = null;
var job_guid = null;
var job_status = null;

function createApp(){

    console.log("# Create an App");
    return new Promise(function (resolve, reject) {

        //Publish an application in a Cloud Foundry Instance
        //cf login -a CF_URL_API -u USER -p PASSWORD --skip-ssl-validation
        //cf d StaticWebsiteHelloWorld
        //cf push  -p ../dist/StaticWebsite_HelloWorld.zip
        cloudFoundry.getInfo().then(function (result) {
            token_endpoint = result.token_endpoint;

            return zipUtils.getManifest(URL).then(function (result) {
                return new Promise(function (resolve, reject) {
                    //TODO: Iterate in the list of files. Possible bug.
                    manifest = result;
                    console.log(manifest);
                    appName = manifest.applications[0].name;    
                    return resolve();
                });                
            });
        }).then(function (result) {    
            return cloudFoundry.login(token_endpoint,config.username,config.password).then(function (result) {
                return cloudFoundrySpaces.getSpaces(result.token_type,result.access_token).then(function (result) {
                    return new Promise(function (resolve, reject) {
                        //console.log(result.resources);
                        space_guid = result.resources[0].metadata.guid;
                        console.log("Space guid: ", space_guid);
                        return resolve();
                    });
                });         
            });    
        }).then(function (result) {
            var filter = {
                'q': 'name:' + appName,
                'inline-relations-depth': 1
            }       
            return cloudFoundry.login(token_endpoint,config.username,config.password).then(function (result) {
                return cloudFoundrySpaces.getSpaceApps(result.token_type,result.access_token,space_guid,filter);
            });
        }).then(function (result) {
            //If exist the application
            if(result.total_results === 1){        
                console.log("Stop App");
                app_guid = result.resources[0].metadata.guid;
                console.log("App guid: " , app_guid);
                console.log(result.resources[0].entity.name);

                return cloudFoundry.login(token_endpoint,config.username,config.password).then(function (result) {
                    return cloudFoundryApps.stopApp(result.token_type,result.access_token,app_guid);
                });
            }else{       
                console.log("Create App");
                return cloudFoundry.login(token_endpoint,config.username,config.password).then(function (result) {
                    return cloudFoundryApps.createApp(result.token_type,result.access_token,appName, space_guid, manifest).then(function (result) {
                        return new Promise(function (resolve, reject) {
                            app_guid = result.metadata.guid;
                            return resolve();
                        });
                    });
                });
            }
        }).then(function (result) {
            //TODO: How to make the inference?
            return cloudFoundry.login(token_endpoint,config.username,config.password).then(function (result) {
                return cloudFoundryDomains.getSharedDomains(result.token_type,result.access_token);
            });  
        }).then(function (result) {    
            return cloudFoundry.login(token_endpoint,config.username,config.password).then(function (result) {
                return cloudFoundryDomains.getDomains(result.token_type,result.access_token).then(function (result) {
                    return new Promise(function (resolve, reject) {
                        //console.log(result.resources);
                        domain_guid = result.resources[0].metadata.guid;
                        console.log("Domain guid: " , domain_guid);
                        return resolve();
                    });
                });
            }); 
        //TODO: Check if exist route    
        }).then(function (result) {     
            return cloudFoundry.login(token_endpoint,config.username,config.password).then(function (result) {
                return cloudFoundryRoutes.checkRoute(result.token_type,result.access_token,appName,domain_guid).then(function (result) {
                    return new Promise(function (resolve, reject) {
                        if(result.total_results == 1){
                            console.log("Exist a Route");
                            console.log(result.resources);
                            route_guid = result.resources[0].metadata.guid;
                            console.log("Route guid: " , route_guid);
                            return resolve(result);
                        }else{
                            //Add Route
                            console.log("Create a Route")
                            return reject(result);
                        }

                    });
                }); 
            });
        }).then(function (result) {
            return cloudFoundry.login(token_endpoint,config.username,config.password).then(function (result) {
                return cloudFoundryApps.associateRoute(result.token_type,result.access_token,appName,app_guid,domain_guid,space_guid,route_guid);
            });
        }).then(function (result) {

            //console.log(result);

            return resolve("OK, Create app");

        }).catch(function (reason) {
            console.error("Error: " + reason);
            return reject("KO, Test 1");
        });            

    }); 

}


//Examples about Routes executed in an Order.
createApp().then(function (result) {   
    console.log(result);
}).catch(function (reason) { 
    console.error("Error: " + reason);
});


/*
}).then(function (result) {
    //console.log(result);
    console.log("21");
    console.log(zipResources);

    //zipResources = [{"fn":"index.html","sha1":"6d94e23263b6e29c5ad1db4d11cca92889d8cd77","size":250},{"fn":"output.txt","sha1":"2e95bd69b6a879131c50d3c13a5998b9d4aae849","size":18963},{"fn":"subFolder","sha1":"0","size":0},{"fn":"subFolder/index2.html","sha1":"24f55c0b24f5b8356d2f83e4d61dddeb4d63964a","size":204}]; 
    return cloudFoundry.login(token_endpoint,config.username,config.password).then(function (result) {
        return cloudFoundryApps.checkResources(result.token_type,result.access_token,zipResources);
    });
*/
/*
}).then(function (result) {
    return cloudFoundry.login(token_endpoint,config.username,config.password).then(function (result) {
        var appZip = appName + ".zip";
        return cloudFoundryApps.uploadApp(result.token_type,result.access_token,appName,app_guid,dataRemoteFile, zipResources);
    });
}).then(function (result) {    
    console.log(result);
}).catch(function (reason) {
    console.error("Error: " + reason);
});
*/


/**** EXAMPLE UTILS ****/

function sleep(time, callback) {
    var stop = new Date().getTime();
    while(new Date().getTime() < stop + time) {
        ;
    }
    callback();
}
