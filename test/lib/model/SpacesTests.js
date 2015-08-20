/*jslint node: true*/
/*global describe: true, it: true*/
/*globals Promise:true*/
"use strict";

var chai = require("chai"),
    expect = require("chai").expect;

var nconf = require('nconf');
nconf.argv().env().file({ file: 'config.json' });

var cf_api_url = nconf.get('CF_API_URL'),
    username = nconf.get('username'),
    password = nconf.get('password');

var CloudFoundry = require("../../../lib/model/CloudFoundry");
var CloudFoundrySpaces = require("../../../lib/model/Spaces");
var CloudFoundryApps = require("../../../lib/model/Apps");
CloudFoundry = new CloudFoundry(nconf.get('CF_API_URL'));
CloudFoundrySpaces = new CloudFoundrySpaces(nconf.get('CF_API_URL'));
CloudFoundryApps = new CloudFoundryApps(nconf.get('CF_API_URL'));

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

describe("Cloud foundry Spaces", function () {

    it("The platform always has defined a Space to operate.", function () {
        this.timeout(3000);

        var token_endpoint = null;
        //var space_guid = null;
        return CloudFoundry.getInfo().then(function (result) {
            token_endpoint = result.token_endpoint;
            return CloudFoundry.login(token_endpoint, username, password).then(function (result) {
                return CloudFoundrySpaces.getSpaces(result.token_type, result.access_token).then(function (result) {
                    return new Promise(function (resolve) {
                        //space_guid = result.resources[0].metadata.guid;
                        //console.log("Space GUID: " + space_guid);                
                        return resolve(result);
                    });
                });
            });
        }).then(function (result) {
            expect(result.total_results).to.be.above(0);
        });
    });

    it("The platform returns a unique Space.", function () {
        this.timeout(4500);

        var token_endpoint = null;
        var space_guid = null;
        return CloudFoundry.getInfo().then(function (result) {
            token_endpoint = result.token_endpoint;
            return CloudFoundry.login(token_endpoint, username, password).then(function (result) {
                return CloudFoundrySpaces.getSpaces(result.token_type, result.access_token).then(function (result) {
                    return new Promise(function (resolve) {
                        space_guid = result.resources[0].metadata.guid;
                        //console.log("Space GUID: " + space_guid);                
                        return resolve(result);
                    });
                });
            });
        }).then(function () {
            return CloudFoundry.login(token_endpoint, username, password).then(function (result) {
                return CloudFoundrySpaces.getSpace(result.token_type, result.access_token, space_guid);
            });
        }).then(function (result) {
            expect(result.metadata.guid).is.a("string");
        });
    });

    it("The platform returns Apps deployed in a Space.", function () {
        this.timeout(4000);

        var token_endpoint = null;
        var space_guid = null;
        //var app_guid = null;

        return CloudFoundry.getInfo().then(function (result) {
            token_endpoint = result.token_endpoint;
            return CloudFoundry.login(token_endpoint, username, password).then(function (result) {
                return CloudFoundrySpaces.getSpaces(result.token_type, result.access_token).then(function (result) {
                    return new Promise(function (resolve) {
                        space_guid = result.resources[0].metadata.guid;
                        return resolve(result);
                    });
                });
            });
        }).then(function () {
            return CloudFoundry.login(token_endpoint, username, password).then(function (result) {
                //var filter = {
                //    'q': 'name:' + "APPX",
                //    'inline-relations-depth': 1
                //}
                var filter = {
                    'guid' : space_guid
                };
                return CloudFoundrySpaces.getSpaceApps(result.token_type, result.access_token, space_guid, filter);
            });
        }).then(function (result) {
            expect(result.total_results).to.be.a('number');
        });
    });

});