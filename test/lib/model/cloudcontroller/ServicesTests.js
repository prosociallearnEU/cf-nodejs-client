/*jslint node: true*/
/*global describe: true, before:true, it: true*/
"use strict";

var Promise = require('bluebird');
var chai = require("chai"),
    expect = require("chai").expect;
var randomWords = require('random-words');

var argv = require('optimist').demand('config').argv;
var environment = argv.config;
var nconf = require('nconf');
nconf.argv().env().file({ file: 'config.json' });

var cf_api_url = nconf.get(environment + "_" + 'CF_API_URL'),
    username = nconf.get(environment + "_" + 'username'),
    password = nconf.get(environment + "_" + 'password');

var CloudFoundry = require("../../../../lib/model/cloudcontroller/CloudFoundry");
var CloudFoundryUsersUAA = require("../../../../lib/model/uaa/UsersUAA");
var CloudFoundryApps = require("../../../../lib/model/cloudcontroller/Apps");
var CloudFoundrySpaces = require("../../../../lib/model/cloudcontroller/Spaces");
var CloudFoundryUserProvidedServices = require("../../../../lib/model/cloudcontroller/UserProvidedServices");
var CloudFoundryServices = require("../../../../lib/model/cloudcontroller/Services");
var BuildPacks = require("../../../../lib/model/cloudcontroller/BuildPacks");
CloudFoundry = new CloudFoundry();
CloudFoundryUsersUAA = new CloudFoundryUsersUAA();
CloudFoundryApps = new CloudFoundryApps();
CloudFoundrySpaces = new CloudFoundrySpaces();
CloudFoundryServices = new CloudFoundryServices();
CloudFoundryUserProvidedServices = new CloudFoundryUserProvidedServices();
BuildPacks = new BuildPacks();

describe("Cloud foundry Services", function () {

    var authorization_endpoint = null;
    var token_endpoint = null;
    var token_type = null;
    var access_token = null;
    var space_guid = null;

    before(function () {
        this.timeout(25000);

        CloudFoundry.setEndPoint(cf_api_url);
        CloudFoundryApps.setEndPoint(cf_api_url);
        CloudFoundrySpaces.setEndPoint(cf_api_url);
        CloudFoundryServices.setEndPoint(cf_api_url);
        CloudFoundryUserProvidedServices.setEndPoint(cf_api_url);

        return CloudFoundry.getInfo().then(function (result) {
            authorization_endpoint = result.authorization_endpoint;            
            token_endpoint = result.token_endpoint;
            token_endpoint = result.token_endpoint;
            CloudFoundryUsersUAA.setEndPoint(authorization_endpoint);
            return CloudFoundryUsersUAA.login(username, password);
        }).then(function (result) {
            token_type = result.token_type;
            access_token = result.access_token;
            return CloudFoundrySpaces.getSpaces(token_type, access_token);
        }).then(function (result) {
            space_guid = result.resources[0].metadata.guid;
        });

    });

    function randomInt(low, high) {
        return Math.floor(Math.random() * (high - low) + low);
    }

    it("The platform returns a list of Services available", function () {
        this.timeout(3000);

        return CloudFoundryServices.getServices(token_type, access_token).then(function (result) {
            expect(result.total_results).is.a("number");
        });
    });

    it("The platform returns the first Service", function () {
        this.timeout(3000);

        var service_guid = null;
        return CloudFoundryServices.getServices(token_type, access_token).then(function (result) {
            if(result.total_results === 0){
                return new Promise(function (resolve, reject) {
                    return reject("No Service");
                });                
            }
            service_guid = result.resources[0].metadata.guid;
            return CloudFoundryServices.getService(token_type, access_token, service_guid);
        }).then(function (result) {
            expect(result.metadata.guid).is.a("string");
        }).catch(function (reason) {
            expect(reason).to.equal("No Service");
        });
    });

    it("The platform returns a list of active Services available", function () {
        this.timeout(3000);

        var filter = {
          'q': 'active:' + true
        };            
        return CloudFoundryServices.getServices(token_type, access_token, filter).then(function (result) {
            expect(result.total_results).is.a("number");
        });
    });

    it("The platform returns a list of Service Plans for the first Service", function () {
        this.timeout(3000);

        var service_guid = null;
        return CloudFoundryServices.getServices(token_type, access_token).then(function (result) {
            service_guid = result.resources[0].metadata.guid;
            return CloudFoundryServices.getServicePlans(token_type, access_token, service_guid);
        }).then(function (result) {
            //console.log(result.entity.credentials);
            expect(result.total_results).is.a("number");
        })
    });

    it.skip("The platform removes a Service", function () {
        this.timeout(3000);

        var service_guid = null;
        return CloudFoundryServices.getServices(token_type, access_token).then(function (result) {
            service_guid = result.resources[1].metadata.guid;
            return CloudFoundryServices.remove(token_type, access_token, service_guid);
        }).then(function (result) {
            expect(true).to.equal(true);
        });
    });
});
