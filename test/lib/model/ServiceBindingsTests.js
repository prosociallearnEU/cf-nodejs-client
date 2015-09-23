/*jslint node: true*/
/*global describe: true, before:true, it: true*/
"use strict";

var chai = require("chai"),
    expect = require("chai").expect;
var randomWords = require('random-words');

var nconf = require('nconf');
nconf.argv().env().file({ file: 'config.json' });

var cf_api_url = nconf.get('CF_API_URL'),
    username = nconf.get('username'),
    password = nconf.get('password');

var CloudFoundry = require("../../../lib/model/CloudFoundry");
var CloudFoundryApps = require("../../../lib/model/Apps");
var CloudFoundrySpaces = require("../../../lib/model/Spaces");
var CloudFoundryUserProvidedServices = require("../../../lib/model/UserProvidedServices");
var CloudFoundryServiceBindings = require("../../../lib/model/ServiceBindings");
CloudFoundry = new CloudFoundry(cf_api_url);
CloudFoundryApps = new CloudFoundryApps(cf_api_url);
CloudFoundrySpaces = new CloudFoundrySpaces(cf_api_url);
CloudFoundryServiceBindings = new CloudFoundryServiceBindings(cf_api_url);
CloudFoundryUserProvidedServices = new CloudFoundryUserProvidedServices(cf_api_url);

describe.only("Cloud foundry Service Bindings", function () {

    var token_endpoint = null;
    var token_type = null;
    var access_token = null;
    var space_guid = null;

    before(function () {
        this.timeout(10000);

        return CloudFoundry.getInfo().then(function (result) {
            token_endpoint = result.token_endpoint;
            return CloudFoundry.login(token_endpoint, username, password);
        }).then(function (result) {
            token_type = result.token_type;
            access_token = result.access_token;
            return CloudFoundrySpaces.getSpaces(token_type, access_token);
        }).then(function (result) {
            space_guid = result.resources[0].metadata.guid;
        });

    });

    it("The platform returns a list of Service Bindings used", function () {
        this.timeout(3000);

        return CloudFoundryServiceBindings.getServiceBindings(token_type, access_token).then(function (result) {
            console.log(result.resources[1]);
            //console.log(result.resources[0].metadata.guid);
            //console.log(result.resources[0].entity.credentials);
            expect(result.total_results).is.a("number");
        });
    });

    it("The platform returns the first Service Bindings", function () {
        this.timeout(3000);

        var serviceBinding_guid = null;
        return CloudFoundryServiceBindings.getServiceBindings(token_type, access_token).then(function (result) {
            serviceBinding_guid = result.resources[0].metadata.guid;
            return CloudFoundryServiceBindings.getServiceBinding(token_type, access_token, serviceBinding_guid);
        }).then(function (result) {
            //console.log(result);
            expect(result.metadata.guid).is.a("string");
        });
    });

    it.skip("The platform associate a Service with an App", function () {
        this.timeout(3000);

        var serviceBinding_guid = null;
        var service_guid = null;
        var app_guid = null;
        return CloudFoundryServiceBindings.getServiceBindings(token_type, access_token).then(function (result) {
            serviceBinding_guid = result.resources[0].metadata.guid;
            return CloudFoundryServiceBindings.getServiceBinding(token_type, access_token, serviceBinding_guid);
        }).then(function (result) {
            //console.log(result.entity.credentials);
            expect(result.metadata.guid).is.a("string");
            return CloudFoundryUserProvidedServices.getServices(token_type, access_token);
        }).then(function (result) {
            service_guid = result.resources[0].metadata.guid;
            return CloudFoundryApps.getApps(token_type, access_token);
        }).then(function (result) {
            //console.log(result.resources[0]);
            app_guid = result.resources[0].metadata.guid;
            //console.log(app_guid);
            return CloudFoundryServiceBindings.associateServiceWithApp(token_type, access_token, service_guid, app_guid);
        }).then(function (result) {
            //console.log(result);
            expect(true).to.equal(true);
        });
    });

    it.skip("The platform Remove a Service Binding", function () {
        this.timeout(3000);

        var serviceBinding_guid = null;
        return CloudFoundryServiceBindings.getServiceBindings(token_type, access_token).then(function (result) {
            serviceBinding_guid = result.resources[1].metadata.guid;
            return CloudFoundryServiceBindings.removeServiceBinding(token_type, access_token, serviceBinding_guid);
        }).then(function (result) {
            expect(true).to.equal(true);
        });
    });

});