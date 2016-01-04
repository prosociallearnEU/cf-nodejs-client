/*jslint node: true*/
/*global describe: true, before:true, it: true*/

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
var CloudFoundryServiceInstances = require("../../../../lib/model/cloudcontroller/ServiceInstances");
var CloudFoundryServicePlans = require("../../../../lib/model/cloudcontroller/ServicePlans");
var BuildPacks = require("../../../../lib/model/cloudcontroller/BuildPacks");
CloudFoundry = new CloudFoundry();
CloudFoundryUsersUAA = new CloudFoundryUsersUAA();
CloudFoundryApps = new CloudFoundryApps();
CloudFoundrySpaces = new CloudFoundrySpaces();
CloudFoundryServiceInstances = new CloudFoundryServiceInstances();
CloudFoundryServicePlans = new CloudFoundryServicePlans();
CloudFoundryUserProvidedServices = new CloudFoundryUserProvidedServices();
BuildPacks = new BuildPacks();

describe.skip("Cloud foundry Service Instances", function () {
    "use strict";
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
        CloudFoundryServiceInstances.setEndPoint(cf_api_url);
        CloudFoundryServicePlans.setEndPoint(cf_api_url);
        CloudFoundryUserProvidedServices.setEndPoint(cf_api_url);

        return CloudFoundry.getInfo().then(function (result) {
            authorization_endpoint = result.authorization_endpoint;
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

    it("The platform returns a list of Service Instances available", function () {
        this.timeout(5000);

        return CloudFoundryServiceInstances.getInstances(token_type, access_token).then(function (result) {
            expect(result.total_results).is.a("number");
        });
    });

    it("The platform returns the first Service", function () {
        this.timeout(5000);

        var messageNoService = "No service";
        var service_instance_guid = null;
        return CloudFoundryServiceInstances.getInstances(token_type, access_token).then(function (result) {
            if(result.total_results === 0){
                return Promise.reject(messageNoService);
            }
            service_instance_guid = result.resources[0].metadata.guid;
            return CloudFoundryServiceInstances.getInstance(token_type, access_token, service_instance_guid);
        }).then(function (result) {
            expect(result.metadata.guid).is.a("string");
        }).catch(function (reason) {
            expect(reason).to.equal(messageNoService);
        });
    });

    it("The platform returns a list of Service Instance in a Space available", function () {
        this.timeout(5000);

        var filter = {
            q: 'space_guid:' + space_guid
        };
        return CloudFoundryServiceInstances.getInstances(token_type, access_token, filter).then(function (result) {
            expect(result.total_results).is.a("number");
        });
    });

    it("The platform returns Service Instance permissions", function () {
        this.timeout(5000);

        var service_instance_guid = null;
        return CloudFoundryServiceInstances.getInstances(token_type, access_token).then(function (result) {
            if(result.total_results === 0){
                return Promise.reject("No results")
            }
            service_instance_guid = result.resources[0].metadata.guid;
            return CloudFoundryServiceInstances.getInstancePermissions(token_type, access_token, service_instance_guid);
        }).then(function (result) {
            expect(result.manage).is.a("boolean");
        }).catch(function (reason) {
            expect(reason).to.equal("No results");
        });
    });

    it("The platform returns Service Instance Bindings", function () {
        this.timeout(5000);

        var service_instance_guid = null;
        return CloudFoundryServiceInstances.getInstances(token_type, access_token).then(function (result) {
            if(result.total_results === 0){
                return Promise.reject("No results")
            }
            service_instance_guid = result.resources[0].metadata.guid;
            return CloudFoundryServiceInstances.getInstanceBindings(token_type, access_token, service_instance_guid);
        }).then(function (result) {
            expect(result.total_results).is.a("number");
        }).catch(function (reason) {
            expect(reason).to.equal("No results");
        });
    });

    it("The platform returns Service Instance Routes", function () {
        this.timeout(5000);

        var service_instance_guid = null;
        return CloudFoundryServiceInstances.getInstances(token_type, access_token).then(function (result) {
            if(result.total_results === 0){
                return Promise.reject("No results")
            }
            service_instance_guid = result.resources[0].metadata.guid;
            return CloudFoundryServiceInstances.getInstanceRoutes(token_type, access_token, service_instance_guid);
        }).then(function (result) {
            expect(result.total_results).is.a("number");
        }).catch(function (reason) {
            expect(reason).to.equal("No results");
        });
    });

    it.skip("The platform creates a new Service Instance and then removes it.", function () {
        this.timeout(5000);

        return CloudFoundryServicePlans.getServicePlans(token_type, access_token).then(function (result) {
            var options = {
                name: 'sample-test-service-instance',
                service_plan_guid: result.resources[0].metadata.guid,
                space_guid: space_guid
            }
            return CloudFoundryServiceInstances.create(token_type, access_token, options);
        }).then(function (result) {
          expect(true).to.equal(true);
          return CloudFoundryServiceInstances.remove(token_type, access_token, result.metadata.guid);
        }).then(function (result) {
            expect(true).to.equal(true);
        });
    });
});
