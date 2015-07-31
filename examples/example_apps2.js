/*jslint node: true*/
/*globals Promise:true*/
"use strict";

var config = require('./config.json');
var cloudFoundry = require("../lib/model/CloudFoundry");
var cloudFoundryApps = require("../lib/model/Apps");
var cloudFoundrySpaces = require("../lib/model/Spaces");
var zipUtils = require("../lib/utils/ZipUtils");

cloudFoundry = new cloudFoundry(config.CF_API_URL);
cloudFoundryApps = new cloudFoundryApps(config.CF_API_URL);
cloudFoundrySpaces = new cloudFoundrySpaces(config.CF_API_URL);

//TODO: How to improve this idea
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

var URL = "https://github.com/jabrena/CloudFoundryLab/raw/master/StaticWebsite_HelloWorld.zip"
var token_endpoint = null;
var appName = null;
var app_guid = null;
var space_guid = null;
var dataRemoteFile = null;
var dataRemoteFileDetails = null;
var manifest = null;

//Publish an application in a Cloud Foundry Instance
cloudFoundry.getInfo().then(function (result) {
	token_endpoint = result.token_endpoint;	
    return cloudFoundry.login(token_endpoint,config.username,config.password);
}).then(function (result) {
    return cloudFoundryApps.getApps(result.token_type,result.access_token);
}).then(function (result) {
	//TODO: Refactor code
    return cloudFoundryApps.getResources(URL);
}).then(function (result) {
	dataRemoteFile = result;
	//TODO: Refactor code	
    return cloudFoundryApps.getResources2(URL);
}).then(function (result) {
	dataRemoteFileDetails = result;
	//TODO: Iterate in the list of files. Possible bug.
	manifest = result[1].manifest;
	appName = manifest.applications[0].name;	
	console.log(appName); 
    return cloudFoundry.login(token_endpoint,config.username,config.password);
}).then(function (result) {
    return cloudFoundrySpaces.getSpaces(result.token_type,result.access_token);
}).then(function (result) {
	space_guid = result.resources[0].metadata.guid;
    console.log("Space GUID: " + space_guid);
    return cloudFoundry.login(token_endpoint,config.username,config.password);
}).then(function (result) {    	
    var filter = {
        'q': 'name:' + appName,
        'inline-relations-depth': 1
    } 	
    return cloudFoundrySpaces.getSpaceApps(result.token_type,result.access_token,space_guid,filter);
}).then(function (result) {
	//If exist the application
	if(result.total_results === 1){
		console.log(result);
		console.log(result.resources);
		app_guid = result.resources[0].metadata.guid;
		console.log(app_guid);
		console.log(result.resources[0].entity.name);

		//TODO: Bug to capture the promise after stopping application
		cloudFoundry.login(token_endpoint,config.username,config.password).then(function (result) {
			return cloudFoundryApps.stopApp(result.token_type,result.access_token,app_guid);
		});
	}else{
		console.log("Create App");
		cloudFoundry.login(token_endpoint,config.username,config.password).then(function (result) {
			//Thinking to remove app: cf d StaticWebsiteHelloWorld
			return cloudFoundryApps.addApp(result.token_type,result.access_token,appName, space_guid);
		});
	}
}).then(function (result) {
	console.log(result);
}).catch(function (reason) {
    console.error("Error: " + reason);
});


