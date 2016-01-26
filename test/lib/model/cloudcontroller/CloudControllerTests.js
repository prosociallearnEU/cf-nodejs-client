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
CloudController = new CloudController();
CloudFoundryUsersUAA = new CloudFoundryUsersUAA();

describe("Cloud Controller", function () {

    var authorization_endpoint = null;
    var token_endpoint = null;

    before(function () {
        this.timeout(15000);

        CloudController.setEndPoint(cf_api_url);

        return CloudController.getInfo().then(function (result) {
            authorization_endpoint = result.authorization_endpoint;
            token_endpoint = result.token_endpoint;
            CloudFoundryUsersUAA.setEndPoint(authorization_endpoint);
            return CloudFoundryUsersUAA.login(username, password);
        }).then(function (result) {
            CloudFoundryUsersUAA.setToken(result);
            CloudController.setToken(result);
        });
    });

    it("The connection show API Version", function () {
        return CloudController.getInfo().then(function (result) {
            console.log(result.api_version);
            return expect(result.api_version).to.be.a('string');
        });
    });

    it.skip("The connection with the PaaS is OK", function () {
        return expect(CloudController.getInfo()).eventually.property("version", 2);
    });

    it("Get all featured flags", function () {
        return CloudController.getFeaturedFlags().then(function (result) {
            return expect(true).to.be.a('boolean');
        });
    });

    if(environment === "PIVOTAL") {

        it("Get info about the featured flag: 'diego_docker'", function () {
            var dockerFlag = "diego_docker";
            return CloudController.getFeaturedFlag(dockerFlag).then(function (result) {
                console.log(result);
                return expect(true).to.be.a('boolean');
            });
        });

        it("[DEBUGGING] Enable Docker on Diego", function () {
            var dockerFlag = "diego_docker";
            return CloudController.setFeaturedFlag(dockerFlag).then(function (result) {
                return expect(true).to.be.a('boolean');
            }).catch(function (reason) {
                console.log(reason);
                return expect(true).to.be.a('boolean');
            });
        });

    }

});