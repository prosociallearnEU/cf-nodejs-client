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
var nconf = require('nconf');
nconf.argv().env().file({ file: 'config.json' });

var cf_api_url = nconf.get(environment + "_" + 'CF_API_URL'),
    username = nconf.get(environment + "_" + 'username'),
    password = nconf.get(environment + "_" + 'password');

var CloudController = require("../../../../lib/model/cloudcontroller/CloudController");
var CloudFoundryUsersUAA = require("../../../../lib/model/uaa/UsersUAA");
var CloudFoundryUsers = require("../../../../lib/model/cloudcontroller/Users");
CloudController = new CloudController();
CloudFoundryUsersUAA = new CloudFoundryUsersUAA();
CloudFoundryUsers = new CloudFoundryUsers();


describe("Cloud Foundry Users", function () {

    var authorization_endpoint = null;
    var token_endpoint = null;
    var token_type = null;
    var access_token = null;

    before(function () {
        this.timeout(15000);

        CloudController.setEndPoint(cf_api_url);
        CloudFoundryUsers.setEndPoint(cf_api_url);

        return CloudController.getInfo().then(function (result) {
            authorization_endpoint = result.authorization_endpoint;
            token_endpoint = result.token_endpoint;
            CloudFoundryUsersUAA.setEndPoint(authorization_endpoint);
            return CloudFoundryUsersUAA.login(username, password);
        }).then(function (result) {
            CloudFoundryUsersUAA.setToken(result);
            CloudFoundryUsers.setToken(result);
        });

    });

    function randomInt(low, high) {
        return Math.floor(Math.random() * (high - low) + low);
    }

    //Testing users doesn't have permissions
    if(environment === "LOCAL_INSTANCE_1") {

        it("The platform retrieves Users from CC", function () {
            this.timeout(5000);

            return CloudFoundryUsers.getUsers().then(function (result) {
                expect(result.resources).to.be.a('array');
            });
        });

        it("The platform creates, search & remove an User from UAA", function () {
            this.timeout(5000);

            var uaa_guid = null;
            var username = "user" + randomInt(1, 10000);
            var uaa_options = {
                "schemas":["urn:scim:schemas:core:1.0"],
                "userName":username,
                "emails":[
                    {
                      "value":"demo@example.com",
                      "type":"work"
                    }
                  ]
            };
            var searchOptions = "?filter=userName eq '" + username + "'";
            var user_guid = null;

            return CloudFoundryUsersUAA.add(uaa_options).then(function (result) {
                return CloudFoundryUsersUAA.getUsers(searchOptions);
            }).then(function (result) {
                if(result.resources.length !== 1){
                    return new Promise(function (resolve, reject) {
                        return reject("No Users");
                    });
                }
                uaa_guid = result.resources[0].id;
                //console.log(uaa_guid)
                var userOptions = {
                    "guid": uaa_guid
                }
                return CloudFoundryUsers.add(userOptions);
            }).then(function (result) {
                //console.log(result);
                user_guid = result.metadata.guid;
                return CloudFoundryUsers.remove(user_guid);
            }).then(function (result) {
                return CloudFoundryUsersUAA.remove(uaa_guid);
            }).then(function (result) {
                return CloudFoundryUsersUAA.getUsers(searchOptions);
            }).then(function (result) {
                if(result.resources.length !== 0){
                    return new Promise(function (resolve, reject) {
                        return reject("Rare output");
                    });
                }
                expect(true).to.be.a('boolean');
            });
        });

    }

});
