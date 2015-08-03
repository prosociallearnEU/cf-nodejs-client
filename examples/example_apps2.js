/*jslint node: true*/
/*globals Promise:true*/
"use strict";

var config = require('./config.json');
var cloudFoundry = require("../lib/model/CloudFoundry");
var cloudFoundryApps = require("../lib/model/Apps");
var cloudFoundrySpaces = require("../lib/model/Spaces");
var cloudFoundryDomains = require("../lib/model/Domains");
var cloudFoundryRoutes = require("../lib/model/Routes");

cloudFoundry = new cloudFoundry(config.CF_API_URL);
cloudFoundryApps = new cloudFoundryApps(config.CF_API_URL);
cloudFoundrySpaces = new cloudFoundrySpaces(config.CF_API_URL);
cloudFoundryDomains = new cloudFoundryDomains(config.CF_API_URL);
cloudFoundryRoutes = new cloudFoundryRoutes(config.CF_API_URL);

//TODO: How to improve this idea
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

var URL = "https://github.com/jabrena/CloudFoundryLab/raw/master/StaticWebsite_HelloWorld/dist/StaticWebsite_HelloWorld.zip";
var token_endpoint = null;
var appName = null;
var app_guid = null;
var space_guid = null;
var dataRemoteFile = null;
var dataRemoteFileDetails = null;
var manifest = null;
var domain_guid = null;
var route_guid = null;

//Publish an application in a Cloud Foundry Instance
//cf login -a CF_URL_API -u USER -p PASSWORD --skip-ssl-validation
//cf d StaticWebsiteHelloWorld
//cf push  -p ../dist/StaticWebsite_HelloWorld.zip
cloudFoundry.getInfo().then(function (result) {
    console.log("1");
    token_endpoint = result.token_endpoint; 
    return cloudFoundry.login(token_endpoint,config.username,config.password).then(function (result) {
        return cloudFoundryApps.getApps(result.token_type,result.access_token);
    });
}).then(function (result) {
    console.log("2");

    //TODO: Refactor code
    return cloudFoundryApps.getResources(URL).then(function (result) {
        dataRemoteFile = result;
        return cloudFoundryApps.getResources2(URL).then(function (result) {
            dataRemoteFileDetails = result;
            console.log(dataRemoteFileDetails);
            return cloudFoundryApps.getResources3(URL).then(function (result) {
                return new Promise(function (resolve, reject) {
                    //TODO: Iterate in the list of files. Possible bug.
                    manifest = result[1].manifest;
                    appName = manifest.applications[0].name;    
                    console.log(appName); 
                    return resolve();
                });
            });
        });
    });
}).then(function (result) {
    console.log("3");   
    return cloudFoundry.login(token_endpoint,config.username,config.password).then(function (result) {
        return cloudFoundrySpaces.getSpaces(result.token_type,result.access_token).then(function (result) {
            return new Promise(function (resolve, reject) {
                space_guid = result.resources[0].metadata.guid;
                console.log("Space GUID: ", space_guid);
                return resolve();
            });
        });         
    });    
}).then(function (result) {
    console.log("4");
    var filter = {
        'q': 'name:' + appName,
        'inline-relations-depth': 1
    }       
    return cloudFoundry.login(token_endpoint,config.username,config.password).then(function (result) {
        return cloudFoundrySpaces.getSpaceApps(result.token_type,result.access_token,space_guid,filter);
    });
}).then(function (result) {
    console.log("10");
    //If exist the application
    if(result.total_results === 1){
        console.log("10.1");        
        console.log("Stop App");
        console.log(result);
        console.log(result.resources);
        app_guid = result.resources[0].metadata.guid;
        console.log(app_guid);
        console.log(result.resources[0].entity.name);

        return cloudFoundry.login(token_endpoint,config.username,config.password).then(function (result) {
            return cloudFoundryApps.stopApp(result.token_type,result.access_token,app_guid);
        });
    }else{
        console.log("10.2");        
        console.log("Create App");
        return cloudFoundry.login(token_endpoint,config.username,config.password).then(function (result) {
            //Thinking to remove app: cf d StaticWebsiteHelloWorld
            return cloudFoundryApps.createApp(result.token_type,result.access_token,appName, space_guid).then(function (result) {
                return new Promise(function (resolve, reject) {
                    app_guid = result.metadata.guid;
                    return resolve();
                });
            });
        });
    }
}).then(function (result) {
    return cloudFoundry.login(token_endpoint,config.username,config.password).then(function (result) {
        return cloudFoundryDomains.getDomains(result.token_type,result.access_token);
    });    
}).then(function (result) {
    console.log("13");      
    console.log(result.resources);
    return cloudFoundry.login(token_endpoint,config.username,config.password).then(function (result) {
        return cloudFoundryDomains.getSharedDomains(result.token_type,result.access_token);
    });  
}).then(function (result) {
    console.log("15");      
    console.log(result.resources);
    return cloudFoundry.login(token_endpoint,config.username,config.password).then(function (result) {
        return cloudFoundryDomains.getDomains(result.token_type,result.access_token).then(function (result) {
            return new Promise(function (resolve, reject) {
                domain_guid = result.resources[0].metadata.guid;
                console.log(domain_guid);
                return resolve();
            });
        });
    }); 
}).then(function (result) {
    console.log("17");      
    return cloudFoundry.login(token_endpoint,config.username,config.password).then(function (result) {
        return cloudFoundryRoutes.checkRoute(result.token_type,result.access_token,appName,domain_guid).then(function (result) {
            return new Promise(function (resolve, reject) {
                route_guid = result.resources[0].metadata.guid;
                console.log(result.resources);
                console.log(route_guid);
                return resolve();
            });
        }); 
    });
}).then(function (result) {
    console.log("19");
    return cloudFoundry.login(token_endpoint,config.username,config.password).then(function (result) {
        return cloudFoundryRoutes.acceptRoute(result.token_type,result.access_token,appName,app_guid,domain_guid,space_guid,route_guid);
    });
}).then(function (result) {
    console.log(result);
    console.log("21");      
    return cloudFoundry.login(token_endpoint,config.username,config.password).then(function (result) {
        return cloudFoundryApps.checkResources(result.token_type,result.access_token,dataRemoteFileDetails);
    });
}).then(function (result) {
    return cloudFoundry.login(token_endpoint,config.username,config.password).then(function (result) {
        var appZip = appName + ".zip";
        console.log(dataRemoteFileDetails);
        return cloudFoundryApps.uploadApp(result.token_type,result.access_token,app_guid,dataRemoteFile, dataRemoteFileDetails);
    });
}).then(function (result) {    
    console.log(result);
}).catch(function (reason) {
    console.error("Error: " + reason);
});

    /*
    return new Promise(function (resolve, reject) {
        return reject("DEMO");
    });
*/

    //console.log("Upload");

    //return new Promise(function (resolve, reject) {
    /*
        cloudFoundryApps.uploadApp(result.token_type,result.access_token,appGuid,dataRemoteFile,appName + ".zip", dataRemoteFileDetails, function (error, data) {
            if (error) {
                //return callback(arguments);
                return reject(error);
            }
            var maxLoopCount = 10;
            params.uploadJobGuid = data;
            var sameCallback = function (error, data) {
                if (data) {
                    return callback(null, true);
                   //return resolve(true);
                } else {
                    --maxLoopCount;
                    if (maxLoopCount) {
                        setTimeout(function () {
                           cloudFoundryApps.checkJob(params, sameCallback);
                        }, 2000);
                    } else {
                        return callback('Infinity loop check job');
                        //reject('Infinity loop check job');
                    }
                }
            };
            cloudFoundryApps.checkJob(params, sameCallback);
        });

    //});
*/