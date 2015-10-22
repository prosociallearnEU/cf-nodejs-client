/*jslint node: true*/
/*global describe: true, before:true, it: true*/
"use strict";

var chai = require("chai"),
    expect = require("chai").expect;

var argv = require('optimist').demand('config').argv;
var environment = argv.config;
var nconf = require('nconf');
nconf.argv().env().file({ file: 'config.json' });

var cf_api_url = nconf.get(environment + "_" + 'CF_API_URL'),
    username = nconf.get(environment + "_" + 'username'),
    password = nconf.get(environment + "_" + 'password');

var CloudFoundry = require("../../../lib/model/CloudFoundry");
var CloudFoundrySpaces = require("../../../lib/model/Spaces");
var CloudFoundryApps = require("../../../lib/model/Apps");
CloudFoundry = new CloudFoundry();
CloudFoundrySpaces = new CloudFoundrySpaces();
CloudFoundryApps = new CloudFoundryApps();

describe("Cloud foundry Spaces", function () {

    var authorization_endpoint = null;
    var token_endpoint = null;
    var token_type = null;
    var access_token = null;

    before(function () {
        this.timeout(10000);

        CloudFoundry.setEndPoint(cf_api_url);
        CloudFoundryApps.setEndPoint(cf_api_url);
        CloudFoundrySpaces.setEndPoint(cf_api_url);

        return CloudFoundry.getInfo().then(function (result) {
            authorization_endpoint = result.authorization_endpoint;             
            token_endpoint = result.token_endpoint;
            return CloudFoundry.login(authorization_endpoint, username, password);
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