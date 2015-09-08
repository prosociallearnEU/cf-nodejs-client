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
var CloudFoundryEvents = require("../../../lib/model/Events");
CloudFoundry = new CloudFoundry(nconf.get('CF_API_URL'));
CloudFoundryEvents = new CloudFoundryEvents(nconf.get('CF_API_URL'));

describe("Cloud foundry Events", function () {

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
        return CloudFoundryEvents.getEvents(token_type, access_token).then(function (result) {
            expect(result.total_results).is.a("number");
        });
    });

});