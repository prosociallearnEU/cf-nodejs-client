/*jslint node: true*/
/*global describe: true, before: true, it: true*/
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

describe("Cloud foundry Organizations", function () {

    var token_endpoint = null;
    var token_type = null;
    var access_token = null;

    before(function () {
        this.timeout(5000);

        return CloudFoundry.getInfo().then(function (result) {
            token_endpoint = result.token_endpoint;
            return CloudFoundry.login(token_endpoint, username, password);
        }).then(function (result) {
            token_type = result.token_type;
            access_token = result.access_token;
        });
    });

    it("The platform returns the Organizations defined", function () {
        this.timeout(3000);

        return CloudFoundryOrg.getOrganizations(token_type, access_token).then(function (result) {
            expect(result.total_results).is.a("number");
        });
    });

    it("The platform returns the private domains from a Organization", function () {
        this.timeout(5000);

        var org_guid = null;
        return CloudFoundryOrg.getOrganizations(token_type, access_token).then(function (result) {
            org_guid = result.resources[0].metadata.guid;
            return CloudFoundryOrg.getPrivateDomains(token_type, access_token, org_guid);
        }).then(function (result) {
            expect(result.total_results).is.a("number");
        });
    });

});