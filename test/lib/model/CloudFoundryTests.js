/*jslint node: true*/
/*global describe: true, it: true*/
"use strict";

var chai = require("chai"),
    chaiAsPromised = require("chai-as-promised"),
    expect = require("chai").expect;
chai.use(chaiAsPromised);


var config = require('../../../config.json');
var cloudFoundry = require("../../../lib/model/CloudFoundry");
cloudFoundry = new cloudFoundry(config.CF_API_URL);

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

describe("Cloud Foundry", function () {

    it("The connection with the PaaS is OK", function () {
        return expect(cloudFoundry.getInfo()).eventually.property("name", "vcap");
    });

    it("The authentication with the PaaS is OK", function () {
    	var token_endpoint = null;
		return cloudFoundry.getInfo().then(function (result) {
			token_endpoint = result.token_endpoint;	
    		return cloudFoundry.login(token_endpoint,config.username,config.password);
    	}).then(function (result) {
			expect(result.token_type).to.equal("bearer");
		});
    });    

});