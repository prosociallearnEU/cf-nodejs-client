/*jslint node: true*/
/*global Promise:true, describe: true, before:true, it: true*/
"use strict";

var Promise = require('bluebird');
var chai = require("chai"),
    chaiAsPromised = require("chai-as-promised"),
    expect = require("chai").expect;
chai.use(chaiAsPromised);

var argv = require('optimist').demand('config').argv;
var environment = argv.config;
console.log("Environment: " + environment);
var nconf = require('nconf');
nconf.argv().env().file({ file: 'config.json' });

var cf_api_url = nconf.get(environment + "_" + 'CF_API_URL'),
    username = nconf.get(environment + "_" + 'username'),
    password = nconf.get(environment + "_" + 'password');

var CloudFoundry = require("../../../lib/model/CloudFoundry");
var CloudFoundryUsers = require("../../../lib/model/Users");
CloudFoundry = new CloudFoundry();
CloudFoundryUsers = new CloudFoundryUsers();

describe.only("Cloud Foundry Users", function () {

    var authorization_endpoint = null;
    var token_endpoint = null;
    var token_type = null;
    var access_token = null;

    before(function () {
        this.timeout(15000);

        CloudFoundry.setEndPoint(cf_api_url);
        CloudFoundryUsers.setEndPoint(cf_api_url);

        return CloudFoundry.getInfo().then(function (result) {
            authorization_endpoint = result.authorization_endpoint;
            token_endpoint = result.token_endpoint;
            CloudFoundryUsers.setUAAEndPoint(authorization_endpoint);
            return CloudFoundry.login(authorization_endpoint, username, password);
        }).then(function (result) {
            token_type = result.token_type;
            access_token = result.access_token;
        });

    });

    it.skip("The platform creates an User", function () {
        this.timeout(5000);

        return CloudFoundryUsers.add(token_type, access_token).then(function (result) {
            console.log(result)
            expect(true).to.be.a('boolean');
        });
    });

    it("The platform retrieves Users from UAA", function () {
        this.timeout(5000);

        return CloudFoundryUsers.getUsers(token_type, access_token).then(function (result) {
            console.log(result)
            expect(true).to.be.a('boolean');
        });
    });

});
