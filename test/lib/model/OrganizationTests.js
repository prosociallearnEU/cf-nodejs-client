/*jslint node: true*/
/*global describe: true, it: true*/
/*globals Promise:true*/
"use strict";

var chai = require("chai"),
    expect = require("chai").expect;

var nconf = require('nconf');
nconf.argv().env().file({ file: 'config.json' });

var cf_api_url = nconf.get('CF_API_URL'),
    username = nconf.get('username'),
    password = nconf.get('password');

var CloudFoundry = require("../../../lib/model/CloudFoundry");
var CloudFoundryOrg = require("../../../lib/model/Organizations");
CloudFoundry = new CloudFoundry(nconf.get('CF_API_URL'));
CloudFoundryOrg = new CloudFoundryOrg(nconf.get('CF_API_URL'));

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

describe("Cloud foundry Organizations", function () {

    it("The platform returns the Organizations defined", function () {
        this.timeout(3000);

        var token_endpoint = null;
        //var org_guid = null;
        return CloudFoundry.getInfo().then(function (result) {
            token_endpoint = result.token_endpoint;
            return CloudFoundry.login(token_endpoint, username, password).then(function (result) {
                return CloudFoundryOrg.getOrganizations(result.token_type, result.access_token).then(function (result) {
                    return new Promise(function (resolve) {
                        //org_guid = result.resources[0].metadata.guid;
                        //console.log(org_guid);
                        //console.log(result.resources[0].entity.name);
                        return resolve(result);
                    });
                });
            });
        }).then(function (result) {
            expect(result.total_results).is.a("number");
        });
    });

    it("The platform returns the private domains from a Organization", function () {
        this.timeout(5000);

        var token_endpoint = null;
        var org_guid = null;
        return CloudFoundry.getInfo().then(function (result) {
            token_endpoint = result.token_endpoint;
            return CloudFoundry.login(token_endpoint, username, password).then(function (result) {
                return CloudFoundryOrg.getOrganizations(result.token_type, result.access_token).then(function (result) {
                    return new Promise(function (resolve) {
                        org_guid = result.resources[0].metadata.guid;
                        //console.log(org_guid);
                        //console.log(result.resources[0].entity.name);
                        return resolve(org_guid);
                    });
                });
            });
        }).then(function () {
            return CloudFoundry.login(token_endpoint, username, password).then(function (result) {
                return CloudFoundryOrg.getPrivateDomains(result.token_type, result.access_token, org_guid);
            });
        }).then(function (result) {
            expect(result.total_results).is.a("number");
        });
    });

});