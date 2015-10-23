/*jslint node: true*/
/*global describe: true, before: true, it: true */
"use strict";

var chai = require("chai"),
    expect = require("chai").expect;

var argv = require('optimist').demand('config').argv;
var environment = argv.config;
var nconf = require('nconf');
nconf.argv().env().file({ file: 'config.json' });

var cf_api_url = nconf.get(environment + "_" + 'CF_API_URL'),
    username = nconf.get(environment + "_" + 'username'),
    password = nconf.get(environment + "_" + 'password');

var CloudFoundry = require("../../../lib/model/CloudFoundry");
var CloudFoundryApps = require("../../../lib/model/Apps");
var CloudFoundryLogs = require("../../../lib/model/Logs");
CloudFoundry = new CloudFoundry();
CloudFoundryApps = new CloudFoundryApps();
CloudFoundryLogs = new CloudFoundryLogs();

describe("Cloud foundry Logs", function () {

    var authorization_endpoint = null;
    var token_endpoint = null;
    var logging_endpoint = null;
    var token_type = null;
    var access_token = null;

    before(function () {
        this.timeout(15000);

        CloudFoundry.setEndPoint(cf_api_url);
        CloudFoundryApps.setEndPoint(cf_api_url);
        CloudFoundryLogs.setEndPoint(cf_api_url);

        return CloudFoundry.getInfo().then(function (result) {
            authorization_endpoint = result.authorization_endpoint;
            token_endpoint = result.token_endpoint;
            logging_endpoint = result.logging_endpoint;
            return CloudFoundry.login(authorization_endpoint, username, password);
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
            //console.log(logging_endpoint);
            logging_endpoint = logging_endpoint.replace("wss", "https");
            logging_endpoint = logging_endpoint.replace(":4443", "");
            logging_endpoint = logging_endpoint.replace(":443", "");//Bluemix support
            //console.log(logging_endpoint);
            CloudFoundryLogs.setEndpoint(logging_endpoint);
            return CloudFoundryLogs.getRecent(token_type, access_token, app_guid);
        }).then(function () {
            //console.log(result);
            expect(true).is.equal(true);
        });
    });

});