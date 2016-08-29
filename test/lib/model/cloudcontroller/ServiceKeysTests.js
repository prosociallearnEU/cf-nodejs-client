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
var CloudFoundryServiceInstances = require("../../../../lib/model/cloudcontroller/ServiceInstances");
var CloudFoundryServiceKeys = require("../../../../lib/model/cloudcontroller/ServiceKeys");
var BuildPacks = require("../../../../lib/model/cloudcontroller/BuildPacks");
CloudController = new CloudController();
CloudFoundryUsersUAA = new CloudFoundryUsersUAA();
CloudFoundryApps = new CloudFoundryApps();
CloudFoundrySpaces = new CloudFoundrySpaces();
CloudFoundryServiceInstances = new CloudFoundryServiceInstances();
CloudFoundryServiceKeys = new CloudFoundryServiceKeys();
BuildPacks = new BuildPacks();

describe("Cloud foundry Service Keys", function () {
    "use strict";
    var authorization_endpoint = null;
    var token_endpoint = null;
    var token_type = null;
    var access_token = null;
    var space_guid = null;

    before(function () {
        this.timeout(25000);

        CloudController.setEndPoint(cf_api_url);
        CloudFoundryApps.setEndPoint(cf_api_url);
        CloudFoundrySpaces.setEndPoint(cf_api_url);
        CloudFoundryServiceInstances.setEndPoint(cf_api_url);
        CloudFoundryServiceKeys.setEndPoint(cf_api_url);

        return CloudController.getInfo().then(function (result) {
            authorization_endpoint = result.authorization_endpoint;
            token_endpoint = result.token_endpoint;
            CloudFoundryUsersUAA.setEndPoint(authorization_endpoint);
            return CloudFoundryUsersUAA.login(username, password);
        }).then(function (result) {
            token_type = result.token_type;
            access_token = result.access_token;
            CloudFoundrySpaces.setToken(result);
            CloudFoundryServiceInstances.setToken(result);
            CloudFoundryServiceKeys.setToken(result);
            return CloudFoundrySpaces.getSpaces();
        }).then(function (result) {
            space_guid = result.resources[0].metadata.guid;
        });

    });

    function randomInt(low, high) {
        return Math.floor(Math.random() * (high - low) + low);
    }

    it("The platform returns a list of Service Keys available", function () {
        this.timeout(5000);

        return CloudFoundryServiceKeys.getServiceKeys().then(function (result) {
            expect(result.total_results).is.a("number");
        });
    });

    it("The platform returns the first Key", function () {
        this.timeout(5000);

        var messageNoServiceKey = "No key";
        var service_key_guid = null;
        return CloudFoundryServiceKeys.getServiceKeys().then(function (result) {
            if(result.total_results === 0){
                return Promise.reject(messageNoServiceKey);
            }
            service_key_guid = result.resources[0].metadata.guid;
            return CloudFoundryServiceKeys.getServiceKey(service_key_guid);
        }).then(function (result) {
            expect(result.metadata.guid).is.a("string");
        }).catch(function (reason) {
            expect(reason).to.equal(messageNoServiceKey);
        });
    });

    it("The platform returns a Key by name", function () {
        this.timeout(5000);

        var messageNoServiceKey = "No key";
        var service_key_guid = null;
        return CloudFoundryServiceKeys.getServiceKeys().then(function (result) {
            if(result.total_results === 0){
                return Promise.reject(messageNoServiceKey);
            }
            service_key_guid = result.resources[0].metadata.guid;
            var filter = {
                q: 'name:' + result.resources[0].entity.name
            };
            return CloudFoundryServiceKeys.getServiceKeys(filter);
        }).then(function (result) {
            expect(result.resources[0].metadata.guid).to.equal(service_key_guid);
        }).catch(function (reason) {
            expect(reason).to.equal(messageNoServiceKey);
        });
    });

    it("The platform creates a Service Key", function () {
        this.timeout(5000);

        var messageNoService = "No services";
        return CloudFoundryServiceInstances.getInstances().then(function (result) {
            if(result.total_results === 0){
                return Promise.reject(messageNoService)
            }
            return result.resources[0].metadata.guid;
        }).then(function (service_instance_guid) {
            var service_key_guid = null;
            var service_key_name = 'key' + randomWords() + randomInt(1, 100);
            return CloudFoundryServiceKeys.create(service_instance_guid, service_key_name).then(function (result) {
                service_key_guid = result.metadata.guid;
                return CloudFoundryServiceKeys.getServiceKey(service_key_guid);
            }).then(function (service_key) {
                expect(service_key.metadata.guid).is.a("string");
                return CloudFoundryServiceKeys.remove(service_key_guid);
            })
        }).catch(function (reason) {
            expect(reason).to.equal(messageNoService);
        });
    });
});
