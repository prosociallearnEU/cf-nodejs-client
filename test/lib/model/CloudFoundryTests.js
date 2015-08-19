/*jslint node: true*/
/*global describe: true, it: true*/
"use strict";

var chai = require("chai"),
    chaiAsPromised = require("chai-as-promised"),
    expect = require("chai").expect;
chai.use(chaiAsPromised);

var nconf = require('nconf');
nconf.argv().env().file({ file: 'config.json' });

var cf_api_url = nconf.get('CF_API_URL'),
    username = nconf.get('username'),
    password = nconf.get('password');

var CloudFoundry = require("../../../lib/model/CloudFoundry");
CloudFoundry = new CloudFoundry(cf_api_url);

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

describe("Cloud Foundry", function () {

    it("The connection with the PaaS is OK", function () {
        return expect(CloudFoundry.getInfo()).eventually.property("name", "vcap");
    });

    it("The authentication with the PaaS is OK", function () {
        var token_endpoint = null;
        return CloudFoundry.getInfo().then(function (result) {
            token_endpoint = result.token_endpoint;
            return CloudFoundry.login(token_endpoint, username, password);
        }).then(function (result) {
            expect(result.token_type).to.equal("bearer");
        });
    });

});