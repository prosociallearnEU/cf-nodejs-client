/*jslint node: true*/
/*global describe: true, before: true, it: true*/
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
CloudFoundry.setEndPoint(endPoint);
CloudFoundryApps = new CloudFoundryApps(endPoint);

describe("Cloud Foundry", function () {

    var token_endpoint = null;
    var token_type = null;
    var access_token = null;

    before(function () {
        this.timeout(5000);

        return CloudFoundry.getInfo().then(function (result) {
            token_endpoint = result.token_endpoint;
            return CloudFoundry.login(token_endpoint, username, password);
        }).then(function (result) {
            token_type = result.token_type;
            access_token = result.access_token;
        });
    });

    it("The connection with the PaaS is OK", function () {
        return expect(CloudFoundry.getInfo()).eventually.property("name", "vcap");
    });

    it("The authentication with the PaaS is OK", function () {
        expect(token_type).to.equal("bearer");
    });

    it("Using an unique Login, it is possible to execute several REST operations", function () {
        this.timeout(2500);

        return CloudFoundryApps.getApps(token_type, access_token).then(function () {
            return CloudFoundryApps.getApps(token_type, access_token);
        }).then(function () {
            return CloudFoundryApps.getApps(token_type, access_token);
        }).then(function () {
            return CloudFoundryApps.getApps(token_type, access_token);
        }).then(function () {
            expect(true).to.equal(true);
        });
    });

});