/*jslint node: true*/
/*globals Promise:true*/
"use strict";

var config = require('./config.json');
//var config = require('./configPivotal.json');
var cloudFoundry = require("../lib/model/CloudFoundry");
var cloudFoundrySpaces = require("../lib/model/Spaces");
var cloudFoundryApps = require("../lib/model/Apps");
cloudFoundry = new cloudFoundry(config.CF_API_URL);
cloudFoundrySpaces = new cloudFoundrySpaces(config.CF_API_URL);
cloudFoundryApps = new cloudFoundryApps(config.CF_API_URL);

//TODO: How to improve this idea
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

var token_endpoint = null;
var space_guid = null;
var app_guid = null;

cloudFoundry.getInfo().then(function (result) {
	token_endpoint = result.token_endpoint;
    return cloudFoundry.login(token_endpoint,config.username,config.password).then(function (result) {
        return cloudFoundrySpaces.getSpaces(result.token_type,result.access_token).then(function (result) {
            return new Promise(function (resolve, reject) {
                space_guid = result.resources[0].metadata.guid;
                console.log("Space GUID: " + space_guid);                
                return resolve();
            });
        });
    });
}).then(function (result) {
    return cloudFoundry.login(token_endpoint,config.username,config.password).then(function (result) {   
        return cloudFoundrySpaces.getSpace(result.token_type,result.access_token,space_guid);
    });
}).then(function (result) {
    return cloudFoundry.login(token_endpoint,config.username,config.password).then(function (result) {
        var filter = {
            'q': 'name:' + "HelloWorldJSP",
            'inline-relations-depth': 1
        }  
        return cloudFoundrySpaces.getSpaceApps(result.token_type,result.access_token,space_guid,filter).then(function (result) {
            return new Promise(function (resolve, reject) {
                if(result.total_results === 0){
                    return reject("No app.");
                }
                app_guid = result.resources[0].metadata.guid;
                console.log("App GUID: " + app_guid);              
                return resolve();
            });
        });
    });
}).then(function (result) {
    return cloudFoundry.login(token_endpoint,config.username,config.password).then(function (result) {   
        return cloudFoundryApps.stopApp(result.token_type,result.access_token,app_guid);
    });
}).then(function (result) {
    console.log(result);    
}).catch(function (reason) {
    console.error("Error: " + reason);
});