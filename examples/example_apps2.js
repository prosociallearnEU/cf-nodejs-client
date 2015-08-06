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

//Publish an application in a Cloud Foundry Instance
//cf login -a CF_URL_API -u USER -p PASSWORD --skip-ssl-validation
//cf d StaticWebsiteHelloWorld
//cf push  -p ../dist/StaticWebsite_HelloWorld.zip
cloudFoundry.getInfo().then(function (result) {
    console.log(result);
    token_endpoint = result.token_endpoint;

    //TODO: Improve performance
    return zipUtils.getData(URL).then(function (result) {
        dataRemoteFile = result;
        return zipUtils.getResources(URL).then(function (result) {
            zipResources = result;
            return zipUtils.getManifest(URL).then(function (result) {
                return new Promise(function (resolve, reject) {
                    //TODO: Iterate in the list of files. Possible bug.
                    manifest = result;
                    appName = manifest.applications[0].name;    
                    //console.log(appName); 
                    //console.log(manifest);
                    return resolve();
                });                
            });
        });        
    });
}).then(function (result) {    
    return cloudFoundry.login(token_endpoint,config.username,config.password).then(function (result) {
        return cloudFoundrySpaces.getSpaces(result.token_type,result.access_token).then(function (result) {
            return new Promise(function (resolve, reject) {
                console.log(result.resources);
                space_guid = result.resources[0].metadata.guid;
                console.log("Space GUID: ", space_guid);
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
        console.log("App GUID: " , app_guid);
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
    console.log("13");
    return cloudFoundry.login(token_endpoint,config.username,config.password).then(function (result) {
        return cloudFoundryDomains.getSharedDomains(result.token_type,result.access_token);
    });  
}).then(function (result) {
    console.log("15");      
    return cloudFoundry.login(token_endpoint,config.username,config.password).then(function (result) {
        return cloudFoundryDomains.getDomains(result.token_type,result.access_token).then(function (result) {
            return new Promise(function (resolve, reject) {
                console.log(result.resources);
                domain_guid = result.resources[0].metadata.guid;
                console.log("Domain GUID: " , domain_guid);
                return resolve();
            });
        });
    }); 
//TODO: Check if exist route    
}).then(function (result) {
    console.log("17");      
    return cloudFoundry.login(token_endpoint,config.username,config.password).then(function (result) {
        return cloudFoundryRoutes.checkRoute(result.token_type,result.access_token,appName,domain_guid).then(function (result) {
            return new Promise(function (resolve, reject) {
                console.log(result);
                route_guid = result.resources[0].metadata.guid;
                //console.log(result.resources);
                console.log("Route GUID: " , route_guid);
                return resolve();
            });
        }); 
    });
}).then(function (result) {
    console.log("19");
    return cloudFoundry.login(token_endpoint,config.username,config.password).then(function (result) {
        return cloudFoundryApps.associateRoute(result.token_type,result.access_token,appName,app_guid,domain_guid,space_guid,route_guid);
    });
/*
}).then(function (result) {
    //console.log(result);
    console.log("21");
    console.log(zipResources);     
    return cloudFoundry.login(token_endpoint,config.username,config.password).then(function (result) {
        return cloudFoundryApps.checkResources(result.token_type,result.access_token,zipResources);
    });
*/
}).then(function (result) {
    var dataFile2 = result;
    console.log(dataFile2);
    console.log("22"); 
    return cloudFoundry.login(token_endpoint,config.username,config.password).then(function (result) {
        var appZip = appName + ".zip";
        console.log(zipResources);
        return cloudFoundryApps.uploadApp3(result.token_type,result.access_token,appName,app_guid,dataRemoteFile, dataFile2);
    });
//STOP
/*  
}).then(function (result) {
    console.log("RESULT: ", result);
    return new Promise(function (resolve, reject) {
        console.log("STOP HERE");
        return reject();
    });
//TODO: Refactor using a Loop of Promises
*/
}).then(function (result) {
    console.log("23");
    job_guid = result.metadata.guid;
    job_status = result.entity.status;
    console.log(result.metadata.guid);
    console.log(result.entity.status);

    if(job_status == "queued"){

        sleep(1000, function() {
            console.log("1 second");
        });

        return cloudFoundry.login(token_endpoint,config.username,config.password).then(function (result) {
            return cloudFoundryJobs.getJob(result.token_type,result.access_token,job_guid).then(function (result) {
                return new Promise(function (resolve, reject) {
                    var status = result.entity.status;
                    console.log(status);
                    resolve(result);
                });
             });   
        });
    }else{
        return new Promise(function (resolve, reject) {
            resolve(result);
        });
    }

}).then(function (result) {

    console.log("24")
    console.log(result);
    console.log(result.metadata.guid);
    console.log(result.entity.status);
    job_guid = result.metadata.guid;
    job_status = result.entity.status;    

    if(job_status == "queued"){

        sleep(1000, function() {
            console.log("1 second");
        });

        return cloudFoundry.login(token_endpoint,config.username,config.password).then(function (result) {
            return cloudFoundryJobs.getJob(result.token_type,result.access_token,job_guid).then(function (result) {
                return new Promise(function (resolve, reject) {
                    var status = result.entity.status;
                    console.log(status);
                    resolve(result);
                });
             });   
        });
    }else{
        return new Promise(function (resolve, reject) {
            resolve(result);
        });
    }

}).then(function (result) {

    console.log("25")
    console.log(result);
    console.log(result.metadata.guid);
    console.log(result.entity.status);
    job_guid = result.metadata.guid;
    job_status = result.entity.status;    

    if(job_status == "queued"){

        sleep(1000, function() {
            console.log("1 second");
        });

        return cloudFoundry.login(token_endpoint,config.username,config.password).then(function (result) {
            return cloudFoundryJobs.getJob(result.token_type,result.access_token,job_guid).then(function (result) {
                return new Promise(function (resolve, reject) {
                    var status = result.entity.status;
                    console.log(status);
                    resolve(result);
                });
             });   
        });
    }else{
        return new Promise(function (resolve, reject) {
            resolve(result);
        });
    }

}).then(function (result) {

    console.log("26")
    console.log(result);
    console.log(result.metadata.guid);
    console.log(result.entity.status);
    job_guid = result.metadata.guid;
    job_status = result.entity.status;    

    if(job_status == "queued"){

        sleep(1000, function() {
            console.log("1 second");
        });

        return cloudFoundry.login(token_endpoint,config.username,config.password).then(function (result) {
            return cloudFoundryJobs.getJob(result.token_type,result.access_token,job_guid).then(function (result) {
                return new Promise(function (resolve, reject) {
                    var status = result.entity.status;
                    console.log(status);
                    resolve(result);
                });
             });   
        });
    }else{
        return new Promise(function (resolve, reject) {
            resolve(result);
        });
    }

}).then(function (result) {
    console.log("27");    
    console.log(result);

    return cloudFoundry.login(token_endpoint,config.username,config.password).then(function (result) {
        return cloudFoundryApps.startApp(result.token_type,result.access_token,app_guid);
    });

}).then(function (result) {

    console.log("28");    
    console.log(result);

    return cloudFoundry.login(token_endpoint,config.username,config.password).then(function (result) {
        return cloudFoundryApps.checkStat(result.token_type,result.access_token,app_guid);
    });

}).then(function (result) {    
    console.log(result);

}).catch(function (reason) {
    console.error("Error: " + reason);
});

    function sleep(time, callback) {
        var stop = new Date().getTime();
        while(new Date().getTime() < stop + time) {
            ;
        }
        callback();
    }
