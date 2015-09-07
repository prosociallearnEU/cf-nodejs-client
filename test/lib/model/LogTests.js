/*jslint node: true*/
/*global describe: true, before: true, it: true */
"use strict";

var chai = require("chai"),
    expect = require("chai").expect;

var nconf = require('nconf');
nconf.argv().env().file({ file: 'config.json' });

var cf_api_url = nconf.get('CF_API_URL'),
    username = nconf.get('username'),
    password = nconf.get('password');

var CloudFoundry = require("../../../lib/model/CloudFoundry");
var CloudFoundryApps = require("../../../lib/model/Apps");
var CloudFoundryLogs = require("../../../lib/model/Logs");
CloudFoundry = new CloudFoundry(cf_api_url);
CloudFoundryApps = new CloudFoundryApps(cf_api_url);
CloudFoundryLogs = new CloudFoundryLogs();

describe("Cloud foundry Logs", function () {

    var token_endpoint = null;
    var logging_endpoint = null;

    before(function () {
        return CloudFoundry.getInfo().then(function (result) {
            token_endpoint = result.token_endpoint;
            logging_endpoint = result.logging_endpoint;
        });
    });

    it("The platform returns Logs", function () {
        this.timeout(6000);

        var app_guid = null;

        return CloudFoundry.login(token_endpoint, username, password).then(function (result) {
            return CloudFoundryApps.getApps(result.token_type, result.access_token);
        }).then(function (result) {
            app_guid = result.resources[0].metadata.guid;
            return CloudFoundry.login(token_endpoint, username, password);
        }).then(function (result) {
            //Process URL to use with Recent Method.
            logging_endpoint = logging_endpoint.replace("wss", "https");
            logging_endpoint = logging_endpoint.replace(":4443", "");
            //console.log(logging_endpoint);

            CloudFoundryLogs.setEndpoint(logging_endpoint);
            return CloudFoundryLogs.getRecent(result.token_type, result.access_token, app_guid);
        }).then(function () {
            //console.log(result);
            expect(true).is.equal(true);
        });
    });

});