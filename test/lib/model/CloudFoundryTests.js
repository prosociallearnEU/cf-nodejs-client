/*jslint node: true*/
/*global describe: true, it: true*/
"use strict";

var chai = require("chai"),
    chaiAsPromised = require("chai-as-promised"),
    expect = require("chai").expect;
chai.use(chaiAsPromised);

var nconf = require('nconf');
nconf.argv().env().file({ file: 'config.json' });

var endPoint = nconf.get('CF_API_URL'),
    username = nconf.get('username'),
    password = nconf.get('password');

var CloudFoundry = require("../../../lib/model/CloudFoundry");
var CloudFoundryApps = require("../../../lib/model/Apps");
CloudFoundry = new CloudFoundry();
CloudFoundryApps = new CloudFoundryApps(endPoint);

describe("Cloud Foundry", function () {

    it("The connection with the PaaS is OK", function () {

        CloudFoundry.setEndPoint(endPoint);

        return expect(CloudFoundry.getInfo()).eventually.property("name", "vcap");
    });

    it("The authentication with the PaaS is OK", function () {
        this.timeout(2500);

        CloudFoundry.setEndPoint(endPoint);

        var token_endpoint = null;
        return CloudFoundry.getInfo().then(function (result) {
            token_endpoint = result.token_endpoint;
            return CloudFoundry.login(token_endpoint, username, password);
        }).then(function (result) {
            expect(result.token_type).to.equal("bearer");
        });
    });

    it.only("Using Login with refresh", function () {
        this.timeout(2500);

        CloudFoundry.setEndPoint(endPoint);

        var token_endpoint = null;
        var refresh_token = null;
        return CloudFoundry.getInfo().then(function (result) {
            token_endpoint = result.token_endpoint;
            return CloudFoundry.login(token_endpoint, username, password);
        }).then(function (result) {
            refresh_token = result.refresh_token;
            return CloudFoundry.loginRefresh(token_endpoint, refresh_token);
        }).then(function (result) {
            expect(result.token_type).to.equal("bearer");
            return CloudFoundry.loginRefresh(token_endpoint, refresh_token);
        }).then(function (result) {
            return CloudFoundryApps.getApps(result.token_type, result.access_token);
        }).then(function (result) {
            console.log(result);
            expect(true).to.equal(true);
        });
    });

    it("Use the constructor without the EndPoint", function () {
        this.timeout(2500);

        CloudFoundry.setEndPoint(endPoint);

        var token_endpoint = null;
        return CloudFoundry.getInfo().then(function (result) {
            token_endpoint = result.token_endpoint;
            return CloudFoundry.login(token_endpoint, username, password);
        }).then(function (result) {
            expect(result.token_type).to.equal("bearer");
        });
    });

});