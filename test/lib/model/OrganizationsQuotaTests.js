/*jslint node: true*/
/*global describe: true, before: true, it: true*/
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
var CloudFoundryOrg = require("../../../lib/model/cloudcontroller/Organizations");
var CloudFoundryOrgQuota = require("../../../lib/model/cloudcontroller/OrganizationsQuota");
CloudFoundry = new CloudFoundry();
CloudFoundryOrg = new CloudFoundryOrg();
CloudFoundryOrgQuota = new CloudFoundryOrgQuota();

describe("Cloud foundry Organizations Quota", function () {

    var authorization_endpoint = null;
    var token_endpoint = null;
    var token_type = null;
    var access_token = null;

    before(function () {
        this.timeout(15000);

        CloudFoundry.setEndPoint(cf_api_url);
        CloudFoundryOrg.setEndPoint(cf_api_url);
        CloudFoundryOrgQuota.setEndPoint(cf_api_url);

        return CloudFoundry.getInfo().then(function (result) {
            authorization_endpoint = result.authorization_endpoint;
            token_endpoint = result.token_endpoint;
            return CloudFoundry.login(authorization_endpoint, username, password);
        }).then(function (result) {
            token_type = result.token_type;
            access_token = result.access_token;
        });
    });

    it("The platform returns Quota Definitions from Organizations", function () {
        this.timeout(5000);

        var org_guid = null;

        return CloudFoundryOrgQuota.quotaDefinitions(token_type, access_token).then(function (result) {
            //console.log(result.resources);
            expect(true).is.a("boolean");
        });
    });    

    it.skip("The platform returns Quota Definitions from the first Organization", function () {
        this.timeout(3000);

        var org_guid = null;

        return CloudFoundryOrg.getOrganizations(token_type, access_token).then(function (result) {
            console.log(result);
            org_guid = result.resources[0].metadata.guid;
            return CloudFoundryOrg.quotaDefinition(token_type, access_token, org_guid);
        }).then(function (result) {
            console.log(result.resources);
            expect(true).is.a("boolean");
        });
    });  

    it.skip("Create a Quota Definitions", function () {
        this.timeout(3000);

        var quotaOptions = {
            'name': "demo",
            'non_basic_services_allowed': true,
            'total_services': 100,
            'total_routes': 1000,
            'total_private_domains': 1,     
            'memory_limit': 2048,     
            'instance_memory_limit': 1024                
        };

        return CloudFoundryOrgQuota.add(token_type, access_token, quotaOptions).then(function (result) {
            console.log(result);
            expect(true).is.a("boolean");
        });
    });

    it.skip("Remove a Quota Definitions", function () {
        this.timeout(3000);

        var quota_guid = "d87d903f-e7ee-4ae8-8840-413c6afc3616";
        var async = {
            'async': false
        };

        return CloudFoundryOrgQuota.remove(token_type, access_token, quota_guid, async).then(function (result) {
            console.log(result);
            expect(true).is.a("boolean");
        });
    });

    //Testing users doesn't have permissions
    if(environment === "LOCAL_INSTANCE_1") {

        it("Add & Remove a Quota Definitions", function () {
            this.timeout(3000);

            var quota_guid = null;
            var quotaOptions = {
                'name': "demo",
                'non_basic_services_allowed': true,
                'total_services': 100,
                'total_routes': 1000,
                'total_private_domains': 1,     
                'memory_limit': 2048,     
                'instance_memory_limit': 1024                
            };
            var async = {
                'async': false
            };
            return CloudFoundryOrgQuota.add(token_type, access_token, quotaOptions).then(function (result) {
                quota_guid = result.metadata.guid;
                return CloudFoundryOrgQuota.remove(token_type, access_token, quota_guid, async);
            }).then(function (result) {
                expect(true).is.a("boolean");
            });
        });

    }

});