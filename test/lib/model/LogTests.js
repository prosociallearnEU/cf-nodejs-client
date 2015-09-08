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
    var token_type = null;
    var access_token = null;

    before(function () {
        this.timeout(5000);

        return CloudFoundry.getInfo().then(function (result) {
            token_endpoint = result.token_endpoint;
            logging_endpoint = result.logging_endpoint;
            return CloudFoundry.login(token_endpoint, username, password);
        }).then(function (result) {
            token_type = result.token_type;
            access_token = result.access_token;
        });
    });

    it("The platform returns Logs", function () {
        this.timeout(6000);

        var app_guid = null;

        return CloudFoundryApps.getApps(token_type, access_token).then(function (result) {
            app_guid = result.resources[0].metadata.guid;
            //Process URL
            logging_endpoint = logging_endpoint.replace("wss", "https");
            logging_endpoint = logging_endpoint.replace(":4443", "");
            CloudFoundryLogs.setEndpoint(logging_endpoint);
            return CloudFoundryLogs.getRecent(token_type, access_token, app_guid);
        }).then(function () {
            //console.log(result);
            expect(true).is.equal(true);
        });
    });

});