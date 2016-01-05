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

var CloudController = require("../../../../lib/model/cloudcontroller/CloudController");
var CloudFoundryUsersUAA = require("../../../../lib/model/uaa/UsersUAA");
var CloudFoundryApps = require("../../../../lib/model/cloudcontroller/Apps");
var CloudFoundrySpaces = require("../../../../lib/model/cloudcontroller/Spaces");
var CloudFoundryUserProvidedServices = require("../../../../lib/model/cloudcontroller/UserProvidedServices");
var CloudFoundryServicePlans = require("../../../../lib/model/cloudcontroller/ServicePlans");
var BuildPacks = require("../../../../lib/model/cloudcontroller/BuildPacks");
CloudController = new CloudController();
CloudFoundryUsersUAA = new CloudFoundryUsersUAA();
CloudFoundryApps = new CloudFoundryApps();
CloudFoundrySpaces = new CloudFoundrySpaces();
CloudFoundryServicePlans = new CloudFoundryServicePlans();
CloudFoundryUserProvidedServices = new CloudFoundryUserProvidedServices();
BuildPacks = new BuildPacks();

describe.skip("Cloud foundry Service Plans", function () {

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

    it.skip("Show a list of Service Plans available", function () {
        this.timeout(3000);

        var errorMessage = "No Service Plan";
        return CloudFoundryServicePlans.getServicePlans(token_type, access_token).then(function (result) {
            if(result.total_results === 0){
                return new Promise(function (resolve, reject) {
                    return reject(errorMessage);
                });                
            }
            for(var i = 0; i < result.resources.length; i++){
                console.log(i + " | " + result.resources[i].entity.name + " | " + result.resources[i].entity.description);
            }
            expect(result.total_results).is.a("number");
        }).catch(function (reason) {
            expect(reason).to.equal(errorMessage);
        });
    });

    it("The platform returns a list of Service Plans available", function () {
        this.timeout(3000);

        var errorMessage = "No Service Plan";
        return CloudFoundryServicePlans.getServicePlans(token_type, access_token).then(function (result) {
            if(result.total_results === 0){
                return new Promise(function (resolve, reject) {
                    return reject(errorMessage);
                });                
            }            
            expect(result.total_results).is.a("number");
        }).catch(function (reason) {
            expect(reason).to.equal(errorMessage);
        });
    });

    it("The platform returns the first Service Plan", function () {
        this.timeout(3000);

        var errorMessage = "No Service Plan";
        var servicePlan_guid = null;
        return CloudFoundryServicePlans.getServicePlans(token_type, access_token).then(function (result) {
            if(result.total_results === 0){
                return new Promise(function (resolve, reject) {
                    return reject(errorMessage);
                });                
            }
            servicePlan_guid = result.resources[0].metadata.guid;
            return CloudFoundryServicePlans.getServicePlan(token_type, access_token, servicePlan_guid);
        }).then(function (result) {
            expect(result.metadata.guid).is.a("string");
        }).catch(function (reason) {
            expect(reason).to.equal(errorMessage);
        });
    });

    it("The platform returns a list of active Service Plans available", function () {
        this.timeout(3000);

        var errorMessage = "No Service Plan";
        var filter = {
          q: 'active:' + true
        };            
        return CloudFoundryServicePlans.getServicePlans(token_type, access_token, filter).then(function (result) {
            if(result.total_results === 0){
                return new Promise(function (resolve, reject) {
                    return reject(errorMessage);
                });                
            }
            expect(result.total_results).is.a("number");
        }).catch(function (reason) {
            expect(reason).to.equal(errorMessage);
        });
    });

    it("The platform returns a list of Service Instances for the first Service Plan", function () {
        this.timeout(3000);

        var errorMessage = "No Service Plan";
        var servicePlan_guid = null;
        return CloudFoundryServicePlans.getServicePlans(token_type, access_token).then(function (result) {
            if(result.total_results === 0){
                return new Promise(function (resolve, reject) {
                    return reject(errorMessage);
                });                
            }
            servicePlan_guid = result.resources[0].metadata.guid;
            return CloudFoundryServicePlans.getServicePlanInstances(token_type, access_token, servicePlan_guid);
        }).then(function (result) {
            expect(result.total_results).is.a("number");
        }).catch(function (reason) {
            expect(reason).to.equal(errorMessage);
        });
    });

    it.skip("The platform removes a Service Plan", function () {
        this.timeout(3000);

        var errorMessage = "No Service Plan";
        var servicePlan_guid = null;
        return CloudFoundryServicePlans.getServicePlans(token_type, access_token).then(function (result) {
            if(result.total_results === 0){
                return new Promise(function (resolve, reject) {
                    return reject(errorMessage);
                });                
            }
            servicePlan_guid = result.resources[1].metadata.guid;
            return CloudFoundryServicePlans.remove(token_type, access_token, servicePlan_guid);
        }).then(function (result) {
            expect(true).to.equal(true);
        }).catch(function (reason) {
            expect(reason).to.equal(errorMessage);
        });
    });
});
