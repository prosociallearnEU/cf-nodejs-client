/*jslint node: true*/
/*global describe: true, before: true, it: true*/
/*globals Promise:true*/
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

var CloudFoundry = require("../../../../lib/model/cloudcontroller/CloudFoundry");
var CloudFoundryUsersUAA = require("../../../../lib/model/uaa/UsersUAA");
var CloudFoundryDomains = require("../../../../lib/model/cloudcontroller/Domains");
CloudFoundry = new CloudFoundry();
CloudFoundryUsersUAA = new CloudFoundryUsersUAA();
CloudFoundryDomains = new CloudFoundryDomains();

describe("Cloud foundry Domains", function () {

    var authorization_endpoint = null;
    var token_endpoint = null;
    var token_type = null;
    var access_token = null;

    before(function () {
        this.timeout(15000);

        CloudFoundry.setEndPoint(cf_api_url);
        CloudFoundryDomains.setEndPoint(cf_api_url);

        return CloudFoundry.getInfo().then(function (result) {
            authorization_endpoint = result.authorization_endpoint;
            token_endpoint = result.token_endpoint;
            CloudFoundryUsersUAA.setEndPoint(authorization_endpoint);
            return CloudFoundryUsersUAA.login(username, password);
        }).then(function (result) {
            CloudFoundryDomains.setToken(result);
        });
    });

    it("The platform returns Domains defined", function () {
        this.timeout(3000);

        var domain = null;
        return CloudFoundryDomains.getDomains().then(function (result) {
            domain = result.resources[0].entity.name;
            expect(domain).is.a("string");
            expect(result.resources.length).to.be.above(0);
            expect(result.total_results).is.a("number");
        });
    });

    it("The platform returns Shared domains defined", function () {
        this.timeout(5000);

        var domain = null;
        return CloudFoundryDomains.getSharedDomains().then(function (result) {
            domain = result.resources[0].entity.name;
            expect(domain).is.a("string");
            expect(result.resources.length).to.be.above(0);
            expect(result.total_results).is.a("number");
        });
    });

});