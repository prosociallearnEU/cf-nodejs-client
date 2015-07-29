/*jslint node: true*/
/*globals Promise:true*/
"use strict";

var config = require('./config.json');
var cloudFoundry = require("../lib/model/CloudFoundry");
var cloudFoundryRoutes = require("../lib/model/Routes");
var cloudFoundryDomains = require("../lib/model/Domains");
var cloudFoundrySpaces = require("../lib/model/Spaces");
cloudFoundry = new cloudFoundry(config.CF_API_URL);
cloudFoundryRoutes = new cloudFoundryRoutes(config.CF_API_URL);
cloudFoundryDomains = new cloudFoundryDomains(config.CF_API_URL);
cloudFoundrySpaces = new cloudFoundrySpaces(config.CF_API_URL);

//TODO: How to improve this idea
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

var token_endpoint = null;
var route_guid = null;


//Get Routes
cloudFoundry.getInfo().then(function (result) {
	token_endpoint = result.token_endpoint;
    return cloudFoundry.login(result.token_endpoint,config.username,config.password);
}).then(function (result) {
    return cloudFoundryRoutes.getRoutes(result.token_type,result.access_token);
}).then(function (result) {
    console.log(result.resources);
}).catch(function (reason) {
    console.error("Error: " + reason);
});

/*
//Get a route
cloudFoundry.getInfo().then(function (result) {
	token_endpoint = result.token_endpoint;
    return cloudFoundry.login(token_endpoint,config.username,config.password);
}).then(function (result) {
    return cloudFoundryRoutes.getRoutes(result.token_type,result.access_token);
}).then(function (result) {
	route_guid = result.resources[0].metadata.guid;
	//console.log(route_guid);
    return cloudFoundry.login(token_endpoint,config.username,config.password);
}).then(function (result) { 	
	return cloudFoundryRoutes.getRoute(result.token_type,result.access_token,route_guid);
}).then(function (result) {
    console.log(result);
}).catch(function (reason) {
    console.error("Error: " + reason);
});
*/

/*
var domain_guid = null;
var space_guid = null;

//Add a route
cloudFoundry.getInfo().then(function (result) {
	token_endpoint = result.token_endpoint;
    return cloudFoundry.login(token_endpoint,config.username,config.password);
}).then(function (result) {
    return cloudFoundryDomains.getDomains(result.token_type,result.access_token);
}).then(function (result) {
	domain_guid = result.resources[0].metadata.guid;
    return cloudFoundry.login(token_endpoint,config.username,config.password);
}).then(function (result) { 	
	return cloudFoundrySpaces.getSpaces(result.token_type,result.access_token);
}).then(function (result) {
	space_guid = result.resources[0].metadata.guid;
    return cloudFoundry.login(token_endpoint,config.username,config.password);
}).then(function (result) { 	
    return cloudFoundryRoutes.addRoute(result.token_type,result.access_token,domain_guid,space_guid,"routedemo1");
}).then(function (result) { 
	console.log(result);    
}).catch(function (reason) {
    console.error("Error: " + reason);
});
*/
