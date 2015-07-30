/*jslint node: true*/
/*globals Promise:true*/
"use strict";

var config = require('./config.json');
var cloudFoundry = require("../lib/model/CloudFoundry");
var cloudFoundryOrg = require("../lib/model/Organizations");
cloudFoundry = new cloudFoundry(config.CF_API_URL);
cloudFoundryOrg = new cloudFoundryOrg(config.CF_API_URL);

//TODO: How to improve this idea
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

cloudFoundry.getInfo().then(function (result) {
    return cloudFoundry.login(result.token_endpoint,config.username,config.password);
}).then(function (result) {
    return cloudFoundryOrg.getOrganizations(result.token_type,result.access_token);
}).then(function (result) {
	console.log(result.resources[0].metadata.guid);
	console.log(result.resources[0].entity.name);
    //console.log(result.resources);   
}).catch(function (reason) {
    console.error("Error: " + reason);
});