/*jslint node: true*/
/*global describe: true, it: true*/
/*globals Promise:true*/
"use strict";

var chai = require("chai"),
    expect = require("chai").expect;


var config = require('../../../config.json');
var cloudFoundry = require("../../../lib/model/CloudFoundry");
var cloudFoundryDomains = require("../../../lib/model/Domains");
cloudFoundry = new cloudFoundry(config.CF_API_URL);
cloudFoundryDomains = new cloudFoundryDomains(config.CF_API_URL);

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

describe("Cloud foundry Domains", function () {

    it("The platform returns Domains defined", function () {
        var token_endpoint = null;
        var domain = null;
        return cloudFoundry.getInfo().then(function (result) {
            token_endpoint = result.token_endpoint; 
            return cloudFoundry.login(token_endpoint,config.username,config.password).then(function (result) {
                return cloudFoundryDomains.getDomains(result.token_type,result.access_token);
            });
        }).then(function (result) {
            domain = result.resources[0].entity.name;
            expect(result.resources.length).to.be.above(0);
            expect(config.CF_API_URL).to.contain(domain);
            expect(result.total_results).to.not.be.undefined;
        });
    });     

    it("The platform returns Shared domains defined", function () {
        var token_endpoint = null;
        var domain = null;
        return cloudFoundry.getInfo().then(function (result) {
            token_endpoint = result.token_endpoint; 
            return cloudFoundry.login(token_endpoint,config.username,config.password).then(function (result) {
                return cloudFoundryDomains.getSharedDomains(result.token_type,result.access_token);
            });
        }).then(function (result) {
            domain = result.resources[0].entity.name;
            expect(result.resources.length).to.be.above(0);
            expect(config.CF_API_URL).to.contain(domain);
            expect(result.total_results).to.not.be.undefined;
        });
    }); 

});