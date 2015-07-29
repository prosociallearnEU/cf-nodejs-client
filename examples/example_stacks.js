/*jslint node: true*/
/*globals Promise:true*/
"use strict";

var config = require('./config.json');
var cloudFoundry = require("../lib/model/CloudFoundry");
var cloudFoundryStacks = require("../lib/model/Stacks");
cloudFoundry = new cloudFoundry(config.CF_API_URL);
cloudFoundryStacks = new cloudFoundryStacks(config.CF_API_URL);

//TODO: How to improve this idea
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

cloudFoundry.getInfo().then(function (result) {
    return cloudFoundry.login(result.token_endpoint,config.username,config.password);
}).then(function (result) {
    return cloudFoundryStacks.getStacks(result.token_type,result.access_token);
}).then(function (result) {
    console.log(result.resources);    
}).catch(function (reason) {
    console.error("Error: " + reason);
});