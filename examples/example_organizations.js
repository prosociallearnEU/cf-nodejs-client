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

var token_endpoint = null;
var org_guid = null;

cloudFoundry.getInfo().then(function (result) {
	token_endpoint = result.token_endpoint;
    return cloudFoundry.login(token_endpoint,config.username,config.password).then(function (result) {
        return cloudFoundryOrg.getOrganizations(result.token_type,result.access_token).then(function (result) {
            return new Promise(function (resolve, reject) {
                org_guid = result.resources[0].metadata.guid;
                console.log(org_guid);
                console.log(result.resources[0].entity.name);
                return resolve();
            });
        });
    });
}).then(function (result) {
    return cloudFoundry.login(token_endpoint,config.username,config.password).then(function (result) {
        return cloudFoundryOrg.getPrivateDomains(result.token_type,result.access_token,org_guid);
    });  
}).then(function (result) {
    console.log(result);
}).catch(function (reason) {
    console.error("Error: " + reason);
});