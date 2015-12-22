/*jslint node: true*/
/*global describe: true, before: true, it: true */
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
var CloudFoundryApps = require("../../../../lib/model/cloudcontroller/Apps");
var CloudFoundryLogs = require("../../../../lib/model/metrics/Logs");
CloudFoundry = new CloudFoundry();
CloudFoundryUsersUAA = new CloudFoundryUsersUAA();
CloudFoundryApps = new CloudFoundryApps();
CloudFoundryLogs = new CloudFoundryLogs();

describe("Cloud foundry Logs", function () {

    var authorization_endpoint = null;
    var token_endpoint = null;
    var logging_endpoint = null;
    var token_type = null;
    var access_token = null;

    before(function () {
        this.timeout(20000);

        CloudFoundry.setEndPoint(cf_api_url);
        CloudFoundryApps.setEndPoint(cf_api_url);

        return CloudFoundry.getInfo().then(function (result) {
            authorization_endpoint = result.authorization_endpoint;
            token_endpoint = result.token_endpoint;
            logging_endpoint = result.logging_endpoint;
            CloudFoundryUsersUAA.setEndPoint(authorization_endpoint);
            return CloudFoundryUsersUAA.login(username, password);
        }).then(function (result) {
            token_type = result.token_type;
            access_token = result.access_token;
        });
    });

    it("The platform returns Logs", function () {
        this.timeout(6000);

        var app_guid = null;
        var ERROR_MESSAGE_NO_APPS = "No App";

        return CloudFoundryApps.getApps(token_type, access_token).then(function (result) {

            if (result.total_results === 0) {
                return new Promise(function check(resolve, reject) {
                    reject(ERROR_MESSAGE_NO_APPS);
                });
            }
            
            app_guid = result.resources[0].metadata.guid;
            //Process URL
            //console.log(logging_endpoint);
            logging_endpoint = logging_endpoint.replace("wss", "https");
            logging_endpoint = logging_endpoint.replace(":4443", "");
            logging_endpoint = logging_endpoint.replace(":443", "");//Bluemix support
            //console.log(logging_endpoint);
            return CloudFoundryLogs.getRecent(logging_endpoint,token_type, access_token, app_guid);
        }).then(function () {
            //console.log(result);
            expect(true).is.equal(true);
        }).catch(function (reason) {
            console.log(reason);
            expect(reason).to.equal(ERROR_MESSAGE_NO_APPS);
        });
    });

});