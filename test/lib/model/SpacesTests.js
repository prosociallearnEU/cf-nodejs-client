/*jslint node: true*/
/*global describe: true, before:true, it: true*/
"use strict";

var chai = require("chai"),
    expect = require("chai").expect;

var nconf = require('nconf');
nconf.argv().env().file({ file: 'config.json' });

var cf_api_url = nconf.get('CF_API_URL'),
    username = nconf.get('username'),
    password = nconf.get('password');

var CloudFoundry = require("../../../lib/model/CloudFoundry");
var CloudFoundrySpaces = require("../../../lib/model/Spaces");
var CloudFoundryApps = require("../../../lib/model/Apps");
CloudFoundry = new CloudFoundry(nconf.get('CF_API_URL'));
CloudFoundrySpaces = new CloudFoundrySpaces(nconf.get('CF_API_URL'));
CloudFoundryApps = new CloudFoundryApps(nconf.get('CF_API_URL'));

describe("Cloud foundry Spaces", function () {

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

    it("The platform always has defined a Space to operate.", function () {
        this.timeout(3000);

        return CloudFoundrySpaces.getSpaces(token_type, access_token).then(function (result) {
            expect(result.total_results).to.be.above(0);
        });
    });

    it("The platform returns a unique Space.", function () {
        this.timeout(4500);

        var space_guid = null;

        return CloudFoundrySpaces.getSpaces(token_type, access_token).then(function (result) {
            space_guid = result.resources[0].metadata.guid;
        }).then(function () {
            return CloudFoundrySpaces.getSpace(token_type, access_token, space_guid);
        }).then(function (result) {
            expect(result.metadata.guid).is.a("string");
        });
    });

    it("The platform returns Apps deployed in a Space.", function () {
        this.timeout(4000);

        var space_guid = null;

        return CloudFoundrySpaces.getSpaces(token_type, access_token).then(function (result) {
            space_guid = result.resources[0].metadata.guid;
        }).then(function () {
            var filter = {
                'guid' : space_guid
            };
            return CloudFoundrySpaces.getSpaceApps(token_type, access_token, space_guid, filter);
        }).then(function (result) {
            expect(result.total_results).to.be.a('number');
        });
    });

});