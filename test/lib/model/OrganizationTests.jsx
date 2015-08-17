/*jslint node: true*/
/*global describe: true, it: true*/
"use strict";

var chai = require("chai"),
    expect = require("chai").expect;


var config = require('../../../config.json');
var cloudFoundry = require("../../../lib/model/CloudFoundry");
var cloudFoundryOrg = require("../../../lib/model/Organizations");
cloudFoundry = new cloudFoundry(config.CF_API_URL);
cloudFoundryOrg = new cloudFoundryOrg(config.CF_API_URL);

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

describe("Cloud foundry Organizations", function () {

    it("The platform returns the Organizations defined", function () {
        this.timeout(3000);

        var token_endpoint = null;
        var org_guid = null;
        return cloudFoundry.getInfo().then(function (result) {
            token_endpoint = result.token_endpoint; 
            return cloudFoundry.login(token_endpoint,config.username,config.password).then(function (result) {
                return cloudFoundryOrg.getOrganizations(result.token_type,result.access_token).then(function (result) {
                    return new Promise(function (resolve, reject) {
                        org_guid = result.resources[0].metadata.guid;
                        //console.log(org_guid);
                        //console.log(result.resources[0].entity.name);
                        return resolve(org_guid);
                    });
                });
            });
        }).then(function (result) { 
            expect(result).to.not.be.undefined;
        });
    });

    it("The platform returns the private domains from a Organization", function () {
        this.timeout(5000);

        var token_endpoint = null;
        var org_guid = null;
        return cloudFoundry.getInfo().then(function (result) {
            token_endpoint = result.token_endpoint; 
            return cloudFoundry.login(token_endpoint,config.username,config.password).then(function (result) {
                return cloudFoundryOrg.getOrganizations(result.token_type,result.access_token).then(function (result) {
                    return new Promise(function (resolve, reject) {
                        org_guid = result.resources[0].metadata.guid;
                        //console.log(org_guid);
                        //console.log(result.resources[0].entity.name);
                        return resolve(org_guid);
                    });
                });
            });
        }).then(function (result) {
            return cloudFoundry.login(token_endpoint,config.username,config.password).then(function (result) {
                return cloudFoundryOrg.getPrivateDomains(result.token_type,result.access_token,org_guid);
            }); 
        }).then(function (result) {
            expect(result.total_results).to.not.be.undefined;
        });
    });      

});