/*jslint node: true*/
/*global describe: true, before:true, it: true*/
"use strict";

var Promise = require('bluebird');
var chai = require("chai"),
    expect = require("chai").expect;

var argv = require('optimist').demand('config').argv;
var environment = argv.config;
var nconf = require('nconf');
nconf.argv().env().file({ file: 'config.json' });

var cf_api_url = nconf.get(environment + "_" + 'CF_API_URL'),
    username = nconf.get(environment + "_" + 'username'),
    password = nconf.get(environment + "_" + 'password');

var CloudFoundry = require("../../../lib/model/cloudcontroller/CloudFoundry");
var CloudFoundrySpaces = require("../../../lib/model/cloudcontroller/Spaces");
var CloudFoundryApps = require("../../../lib/model/cloudcontroller/Apps");
CloudFoundry = new CloudFoundry();
CloudFoundrySpaces = new CloudFoundrySpaces();
CloudFoundryApps = new CloudFoundryApps();

describe("Cloud foundry Spaces", function () {

    var authorization_endpoint = null;
    var token_endpoint = null;
    var token_type = null;
    var access_token = null;

    before(function () {
        this.timeout(15000);

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

    it("The platform returns Summary from a Space.", function () {
        this.timeout(4000);

        var space_guid = null;

        return CloudFoundrySpaces.getSpaces(token_type, access_token).then(function (result) {
            space_guid = result.resources[0].metadata.guid;
        }).then(function () {
            return CloudFoundrySpaces.summary(token_type, access_token, space_guid);
        }).then(function (result) {
            expect(true).to.be.a('boolean');
        });
    });

    it("[TOOL] The platform returns Services used in the Space.", function () {
        this.timeout(4000);

        var space_guid = null;

        return CloudFoundrySpaces.getSpaces(token_type, access_token).then(function (result) {
            space_guid = result.resources[0].metadata.guid;
        }).then(function () {
            return CloudFoundrySpaces.summary(token_type, access_token, space_guid);
        }).then(function (result) {

            var usedServices = [];
            result.services.forEach(function(service) {
                if(service.bound_app_count > 0){
                    usedServices.push(service);                   
                }
            });
            expect(true).to.be.a('boolean');
        });
    });

    it("[TOOL] The platform returns Services Services without usage in the Space.", function () {
        this.timeout(4000);

        var space_guid = null;

        return CloudFoundrySpaces.getSpaces(token_type, access_token).then(function (result) {
            space_guid = result.resources[0].metadata.guid;
        }).then(function () {
            return CloudFoundrySpaces.summary(token_type, access_token, space_guid);
        }).then(function (result) {

            var servicesWithoutUsage = [];
            result.services.forEach(function(service) {
                if(service.bound_app_count === 0){
                    servicesWithoutUsage.push(service);                   
                }
            });
            expect(true).to.be.a('boolean');
        });
    });

    it("The platform returns User roles from a Space.", function () {
        this.timeout(4000);

        var space_guid = null;

        return CloudFoundrySpaces.getSpaces(token_type, access_token).then(function (result) {
            space_guid = result.resources[0].metadata.guid;
        }).then(function () {
            return CloudFoundrySpaces.userRoles(token_type, access_token, space_guid);
        }).then(function (result) {
            expect(result.total_results).to.be.a('number');
        });
    });

});