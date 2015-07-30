/*jslint node: true*/
/*globals Promise:true*/
"use strict";

var config = require('./config.json');
var cloudFoundry = require("../lib/model/CloudFoundry");
var cloudFoundryApps = require("../lib/model/Apps");
var cloudFoundrySpaces = require("../lib/model/Spaces");
cloudFoundry = new cloudFoundry(config.CF_API_URL);
cloudFoundryApps = new cloudFoundryApps(config.CF_API_URL);
cloudFoundrySpaces = new cloudFoundrySpaces(config.CF_API_URL);

//TODO: How to improve this idea
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

var token_endpoint = null;
var appName = "demo2";
var space_guid = null;

/*
//Get Apps
cloudFoundry.getInfo().then(function (result) {
	token_endpoint = result.token_endpoint;	
    return cloudFoundry.login(token_endpoint,config.username,config.password);
}).then(function (result) {
    return cloudFoundryApps.getApps(result.token_type,result.access_token);
}).then(function (result) {
    console.log(result.resources);   
}).catch(function (reason) {
    console.error("Error: " + reason);
});

//Add a new App
cloudFoundry.getInfo().then(function (result) {
	token_endpoint = result.token_endpoint;	
    return cloudFoundry.login(token_endpoint,config.username,config.password);
}).then(function (result) {    
    return cloudFoundrySpaces.getSpaces(result.token_type,result.access_token); 
}).then(function (result) {
	space_guid = result.resources[0].metadata.guid;	
    return cloudFoundry.login(token_endpoint,config.username,config.password);
}).then(function (result) { 	
    return cloudFoundryApps.addApp(result.token_type,result.access_token,appName, space_guid);
}).then(function (result) {
    console.log(result);   
}).catch(function (reason) {
    console.error("Error: " + reason);
});
*/

appName = "HelloWorldJSP";

//Get AppInfo by name
cloudFoundry.getInfo().then(function (result) {
    token_endpoint = result.token_endpoint; 
    return cloudFoundry.login(token_endpoint,config.username,config.password);
}).then(function (result) {
    return cloudFoundryApps.getAppByName(result.token_type,result.access_token,appName);
}).then(function (result) {
    console.log(result.resources);   
}).catch(function (reason) {
    console.error("Error: " + reason);
});
