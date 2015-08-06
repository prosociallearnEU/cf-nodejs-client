/*jslint node: true*/
/*globals Promise:true*/
"use strict";

var config = require('./config.json');
//var config = require('./configPivotal.json');
var cloudFoundry = require("../lib/model/CloudFoundry");
var cloudFoundryDomains = require("../lib/model/Domains");
cloudFoundry = new cloudFoundry(config.CF_API_URL);
cloudFoundryDomains = new cloudFoundryDomains(config.CF_API_URL);

//TODO: How to improve this idea
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

var token_endpoint = null;

cloudFoundry.getInfo().then(function (result) {
	token_endpoint = result.token_endpoint;
    return cloudFoundry.login(token_endpoint,config.username,config.password).then(function (result) {
        return cloudFoundryDomains.getDomains(result.token_type,result.access_token);
    });
}).then(function (result) {
    console.log(result.resources);
    return cloudFoundry.login(token_endpoint,config.username,config.password).then(function (result) {
    	return cloudFoundryDomains.getSharedDomains(result.token_type,result.access_token);
    });
}).then(function (result) {
    console.log(result.resources);    
}).catch(function (reason) {
    console.error("Error: " + reason);
});