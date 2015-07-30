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

var token_endpoint = null;
var appName = "demo";
var space_guid = null;

//Get Apps

cloudFoundry.getInfo().then(function (result) {
	token_endpoint = result.token_endpoint;	
    return cloudFoundry.login(token_endpoint,config.username,config.password);
}).then(function (result) {
    return cloudFoundryApps.getApps(result.token_type,result.access_token);
}).then(function (result) {
    return cloudFoundryApps.getResources("https://github.com/jabrena/CloudFoundryLab/raw/master/StaticWebsite_HelloWorld.zip");
}).then(function (result) {
	var dataRemoteFile = result;
	zipUtils = new zipUtils(dataRemoteFile);
	console.log(zipUtils.getData());
    //console.log(result[1].manifest);     
}).catch(function (reason) {
    console.error("Error: " + reason);
});


