/*jslint node: true*/
/*global describe: true, it: true*/
"use strict";

var chai = require("chai"),
    expect = require("chai").expect;

var nconf = require('nconf');
nconf.argv().env().file({ file: 'config.json' });

var cf_api_url = nconf.get('CF_API_URL'),
    username = nconf.get('username'),
    password = nconf.get('password');

var CloudFoundry = require("../../../lib/model/CloudFoundry");
var CloudFoundryLogs = require("../../../lib/model/Logs");
CloudFoundry = new CloudFoundry(nconf.get('CF_API_URL'));
CloudFoundryLogs = new CloudFoundryLogs();

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

describe.skip("Cloud foundry Logs", function () {

    it("The platform returns Logs", function () {
        this.timeout(6000);

        var token_endpoint = null;
        var logging_endpoint = null;
        return CloudFoundry.getInfo().then(function (result) {
            token_endpoint = result.token_endpoint;
            logging_endpoint = result.logging_endpoint;
            CloudFoundryLogs.setEndpoint(logging_endpoint);
            return CloudFoundry.login(token_endpoint, username, password).then(function (result) {
                return CloudFoundryLogs.getTail(result.token_type, result.access_token, "788a28be-2aea-40e4-baf3-3d2347e94415");
            });
        }).then(function (result) {

            expect(true).is.equal(true);
        });
    });

});

function sleep(time, callback) {
    var stop = new Date().getTime();
    while(new Date().getTime() < stop + time) {
        ;
    }
    callback();
}