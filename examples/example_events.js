/*jslint node: true*/
/*globals Promise:true*/
"use strict";

var config = require('./config.json');
//var config = require('./configPivotal.json'); //Slower. Test with time
var cloudFoundry = require("../lib/model/CloudFoundry");
var cloudFoundryEvents = require("../lib/model/Events");
cloudFoundry = new cloudFoundry(config.CF_API_URL);
cloudFoundryEvents = new cloudFoundryEvents(config.CF_API_URL);

//TODO: How to improve this idea
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

var token_endpoint = null;

cloudFoundry.getInfo().then(function (result) {
	console.log(result);
	token_endpoint = result.token_endpoint;	
    return cloudFoundry.login(token_endpoint,config.username,config.password).then(function (result) {
        return cloudFoundryEvents.getEvents(result.token_type,result.access_token);
    });
}).then(function (result) {
    console.log(result.resources);    
}).catch(function (reason) {
    console.error("Error: " + reason);
});