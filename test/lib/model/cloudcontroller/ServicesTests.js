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

var CloudController = require("../../../../lib/model/cloudcontroller/CloudController");
var CloudFoundryUsersUAA = require("../../../../lib/model/uaa/UsersUAA");
var CloudFoundryApps = require("../../../../lib/model/cloudcontroller/Apps");
var CloudFoundrySpaces = require("../../../../lib/model/cloudcontroller/Spaces");
var CloudFoundryUserProvidedServices = require("../../../../lib/model/cloudcontroller/UserProvidedServices");
var CloudFoundryServices = require("../../../../lib/model/cloudcontroller/Services");
var BuildPacks = require("../../../../lib/model/cloudcontroller/BuildPacks");
CloudController = new CloudController();
CloudFoundryUsersUAA = new CloudFoundryUsersUAA();
CloudFoundryApps = new CloudFoundryApps();
CloudFoundrySpaces = new CloudFoundrySpaces();
CloudFoundryServices = new CloudFoundryServices();
CloudFoundryUserProvidedServices = new CloudFoundryUserProvidedServices();
BuildPacks = new BuildPacks();

describe("Cloud foundry Services", function () {
    "use strict";
    var authorization_endpoint = null;
    var token_endpoint = null;
    var token_type = null;
    var access_token = null;
    var space_guid = null;

    before(function () {
        this.timeout(25000);

        CloudController.setEndPoint(cf_api_url);
        CloudFoundryServices.setEndPoint(cf_api_url);

        return CloudController.getInfo().then(function (result) {
            authorization_endpoint = result.authorization_endpoint;
            token_endpoint = result.token_endpoint;
            CloudFoundryUsersUAA.setEndPoint(authorization_endpoint);
            return CloudFoundryUsersUAA.login(username, password);
        }).then(function (result) {
            CloudFoundryServices.setToken(result);
        });

    });

    function randomInt(low, high) {
        return Math.floor(Math.random() * (high - low) + low);
    }

    it.skip("Show a list of Services available", function () {
        this.timeout(5000);

        return CloudFoundryServices.getServices().then(function (result) {
            for(var i = 0; i < result.resources.length; i++){
                console.log(i + " | " + result.resources[i].entity.label + " | " + result.resources[i].entity.description);
            }
            expect(result.total_results).is.a("number");
        });
    });

    it("The platform returns a list of Services available", function () {
        this.timeout(5000);

        return CloudFoundryServices.getServices().then(function (result) {
            expect(result.total_results).is.a("number");
        });
    });

    it("The platform returns the first Service", function () {
        this.timeout(5000);

        var service_guid = null;
        return CloudFoundryServices.getServices().then(function (result) {
            if(result.total_results === 0){
                return new Promise(function (resolve, reject) {
                    return reject("No Service");
                });
            }
            service_guid = result.resources[0].metadata.guid;
            return CloudFoundryServices.getService(service_guid);
        }).then(function (result) {
            expect(result.metadata.guid).is.a("string");
        }).catch(function (reason) {
            expect(reason).to.equal("No Service");
        });
    });

    it("The platform returns a list of active Services available", function () {
        this.timeout(5000);

        var filter = {
          q: 'active:' + true
        };
        return CloudFoundryServices.getServices(filter).then(function (result) {
            expect(result.total_results).is.a("number");
        });
    });

    //cf_nise_installer doesn't provide Services by default.
    if(environment !== "LOCAL_INSTANCE_1") {

        it("The platform returns a list of Service Plans for the first Service", function () {
            this.timeout(5000);

            var service_guid = null;
            return CloudFoundryServices.getServices().then(function (result) {
                service_guid = result.resources[0].metadata.guid;
                return CloudFoundryServices.getServicePlans(service_guid);
            }).then(function (result) {
                expect(result.total_results).is.a("number");
            })
        });

    }

    it.skip("The platform removes a Service", function () {
        this.timeout(5000);

        var service_guid = null;
        return CloudFoundryServices.getServices().then(function (result) {
            service_guid = result.resources[1].metadata.guid;
            return CloudFoundryServices.remove(service_guid);
        }).then(function (result) {
            expect(true).to.equal(true);
        });
    });
});
