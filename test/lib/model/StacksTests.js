/*jslint node: true*/
/*global describe: true, it: true*/
"use strict";

var chai = require("chai"),
    expect = require("chai").expect;


var config = require('../../../config.json');
var cloudFoundry = require("../../../lib/model/CloudFoundry");
var cloudFoundryStacks = require("../../../lib/model/Stacks");
cloudFoundry = new cloudFoundry(config.CF_API_URL);
cloudFoundryStacks = new cloudFoundryStacks(config.CF_API_URL);

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

describe("Cloud foundry Stacks", function () {

    it("The platform returns Stacks installed", function () {
        this.timeout(3000);

    	var token_endpoint = null;
		return cloudFoundry.getInfo().then(function (result) {
			token_endpoint = result.token_endpoint;	
            return cloudFoundry.login(token_endpoint,config.username,config.password).then(function (result) {
                return cloudFoundryStacks.getStacks(result.token_type,result.access_token);
            });
        }).then(function (result) { 
            expect(result.total_results).to.not.be.undefined;
		});
    });    

});