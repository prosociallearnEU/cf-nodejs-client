/*jslint node: true*/
/*global describe: true, before: true, it: true*/
"use strict";

var Promise = require('bluebird');
var chai = require("chai"),
    chaiAsPromised = require("chai-as-promised"),
    expect = require("chai").expect;
chai.use(chaiAsPromised);

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
CloudController = new CloudController();
CloudFoundryUsersUAA = new CloudFoundryUsersUAA();
CloudFoundryApps = new CloudFoundryApps();

describe("Cloud Foundry Authentication", function () {

    var authorization_endpoint = null;
    var token_endpoint = null;
    var token_type = null;
    var access_token = null;

    before(function () {
        this.timeout(15000);

        CloudController.setEndPoint(cf_api_url);
        CloudFoundryApps.setEndPoint(cf_api_url);

        return CloudController.getInfo().then(function (result) {
            authorization_endpoint = result.authorization_endpoint;
            token_endpoint = result.token_endpoint;
            CloudFoundryUsersUAA.setEndPoint(authorization_endpoint);
            return CloudFoundryUsersUAA.login(username, password);
        }).then(function (result) {
            CloudFoundryUsersUAA.setToken(result);
            CloudFoundryApps.setToken(result);
        });
    });

    it("The connection show API Version", function () {
        return CloudController.getInfo().then(function (result) {
            console.log(result.api_version);
            return expect(result.api_version).to.be.a('string');
        });
    });

    it("The connection with the PaaS is OK", function () {
        return expect(CloudController.getInfo()).eventually.property("version", 2);
    });

    it.skip("The authentication with the PaaS is OK", function () {
        expect(token_type).to.equal("bearer");
    });

    it("Using an unique Login, it is possible to execute several REST operations", function () {
        this.timeout(5000);

        return CloudFoundryApps.getApps().then(function () {
            return CloudFoundryApps.getApps();
        }).then(function () {
            return CloudFoundryApps.getApps();
        }).then(function () {
            return CloudFoundryApps.getApps();
        }).then(function () {
            expect(true).to.equal(true);
        });
    });

});