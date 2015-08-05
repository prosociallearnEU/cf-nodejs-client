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

var token_endpoint = null;

//Get stacks
function getStacks(){

    console.log("# Get Stacks");
    return new Promise(function (resolve, reject) {

		cloudFoundry.getInfo().then(function (result) {
			token_endpoint = result.token_endpoint;
            return cloudFoundry.login(token_endpoint,config.username,config.password).then(function (result) {
                return cloudFoundryStacks.getStacks(result.token_type,result.access_token);
            });
		}).then(function (result) {
		    return resolve(result);   
		}).catch(function (reason) {
		    console.error("Error: " + reason);
		    return reject(reason);
		});

    });

}


//Examples about Stacks executed in an Order.
getStacks().then(function (result) {    
    console.log(result);
}).catch(function (reason) { 
    console.error("Error: " + reason);
});