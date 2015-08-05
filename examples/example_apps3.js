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
    token_endpoint = result.token_endpoint; 
    return cloudFoundry.login(token_endpoint,config.username,config.password).then(function (result) {
        return cloudFoundryApps.getApps(result.token_type,result.access_token).then(function (result) {
            return new Promise(function (resolve, reject) {
                console.log(result.resources.length);
                for(var i = 0; i < result.resources.length; i++){
                    if(result.resources[i].entity.name == "StaticWebsiteHelloWorld"){
                        console.log(result.resources[i].entity.name);
                        console.log(result.resources[i].metadata);
                        app_guid = result.resources[i].metadata.guid;
                        return resolve();
                    }
                }
                return reject("Not found App.");
            });
        });
    });
}).then(function (result) {
    return cloudFoundry.login(token_endpoint,config.username,config.password).then(function (result) {
        return cloudFoundryApps.startApp(result.token_type,result.access_token,app_guid);
    });
}).then(function (result) {
    return cloudFoundry.login(token_endpoint,config.username,config.password).then(function (result) {
        return cloudFoundryApps.stopApp(result.token_type,result.access_token,app_guid);
    });    
}).then(function (result) {
    console.log(result);
    return cloudFoundry.login(token_endpoint,config.username,config.password).then(function (result) {
        return cloudFoundryApps.deleteApp(result.token_type,result.access_token,app_guid);
    });   
}).then(function (result) {   
    console.log(result);
}).catch(function (reason) {
    console.error("Error: " + reason);
});

