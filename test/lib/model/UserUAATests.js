/*jslint node: true*/
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

var CloudFoundry = require("../../../lib/model/CloudFoundry");
var CloudFoundryUsersUAA = require("../../../lib/model/UsersUAA");
CloudFoundry = new CloudFoundry();
CloudFoundryUsersUAA = new CloudFoundryUsersUAA();

describe("Cloud Foundry Users UAA", function () {
    "use strict";
    var authorization_endpoint = null;
    var token_endpoint = null;
    var token_type = null;
    var access_token = null;

    before(function () {
        this.timeout(15000);

        CloudFoundry.setEndPoint(cf_api_url);

        return CloudFoundry.getInfo().then(function (result) {
            authorization_endpoint = result.authorization_endpoint;
            token_endpoint = result.token_endpoint;
            CloudFoundryUsersUAA.setEndPoint(authorization_endpoint);
            return CloudFoundry.login(authorization_endpoint, username, password);
        }).then(function (result) {
            token_type = result.token_type;
            access_token = result.access_token;
        });

    });

    function randomInt(low, high) {
        return Math.floor(Math.random() * (high - low) + low);
    }

    //Testing users doesn't have permissions
    if(environment === "LOCAL_INSTANCE_1") {

        it.skip("The platform creates an User", function () {
            this.timeout(5000);

            var accountName = "user" + randomInt(1, 1000);
            var accountPassword = "123456";
            var uaa_options = {
                schemas:["urn:scim:schemas:core:1.0"],
                userName:accountName,
                emails:[
                    {
                      value:"demo@example.com",
                      type:"work"
                    }
                  ],
                password: accountPassword,
            }

            return CloudFoundryUsersUAA.add(token_type, access_token, uaa_options).then(function (result) {
                //console.log(result)
                expect(true).to.be.a('boolean');
            });
        });

        it("The platform retrieves Users from UAA", function () {
            this.timeout(5000);

            return CloudFoundryUsersUAA.getUsers(token_type, access_token).then(function (result) {
                expect(result.resources).to.be.a('array');
            });
        });

        it.skip("The platform retrieves Users from UAA with a filter", function () {
            this.timeout(5000);

            var uaa_guid = null;
            var searchOptions = "?filter=userName eq 'demo4'";

            return CloudFoundryUsersUAA.getUsers(token_type, access_token, searchOptions).then(function (result) {
                //console.log(result.resources[0].groups)
                //console.log(result.resources[0])
                uaa_guid = result.resources[0].id;
                console.log(uaa_guid)
                expect(result.resources).to.be.a('array');
            });
        });

        it("The platform creates & remove an User", function () {
            this.timeout(5000);

            var accountName = "user" + randomInt(1, 1000);
            var accountPassword = "123456";
            var uaa_guid = null;
            var uaa_options = {
                "schemas":["urn:scim:schemas:core:1.0"],
                "userName":accountName,
                "emails":[
                    {
                      "value":"demo@example.com",
                      "type":"work"
                    }
                  ],
                "password": accountPassword,
            };
            var searchOptions = "?filter=userName eq '" + accountName + "'";

            return CloudFoundryUsersUAA.add(token_type, access_token, uaa_options).then(function (result) {
                return CloudFoundryUsersUAA.getUsers(token_type, access_token, searchOptions);
            }).then(function (result) {
                if(result.resources.length !== 1){
                    return new Promise(function (resolve, reject) {
                        return reject("No Users");
                    });
                }
                uaa_guid = result.resources[0].id;
                return CloudFoundryUsersUAA.remove(token_type, access_token, uaa_guid);
            }).then(function (result) {
                return CloudFoundryUsersUAA.getUsers(token_type, access_token, searchOptions);
            }).then(function (result) {
                if(result.resources.length !== 0){
                    return new Promise(function (resolve, reject) {
                        return reject("Rare output");
                    });
                }
                expect(true).to.be.a('boolean');
            });
        });

        it.skip("[DEBUGGING] The platform creates, update Password & remove an User", function () {
            this.timeout(5000);

            var accountName = "user" + randomInt(1, 1000);
            var accountPassword = "123456";
            var uaa_guid = null;
            var uaa_options = {
                "schemas":["urn:scim:schemas:core:1.0"],
                "userName":accountName,
                "emails":[
                    {
                      "value":"user@example.com",
                      "type":"work"
                    }
                  ],
                "password": accountPassword,
            };
            var searchOptions = "?filter=userName eq '" + accountName + "'";

            return CloudFoundryUsersUAA.add(token_type, access_token, uaa_options).then(function (result) {
                return CloudFoundryUsersUAA.getUsers(token_type, access_token, searchOptions);
            }).then(function (result) {
                if(result.resources.length !== 1){
                    return new Promise(function (resolve, reject) {
                        return reject("No Users");
                    });
                }
                uaa_guid = result.resources[0].id;
            }).then(function (result) {

                uaa_options = {
                    "schemas":["urn:scim:schemas:core:1.0"],
                    "password": accountPassword
                };

                return CloudFoundryUsersUAA.updatePassword(token_type, access_token, uaa_guid, uaa_options);
            }).then(function (result) {
                return CloudFoundryUsersUAA.remove(token_type, access_token, uaa_guid);
            }).then(function (result) {
                return CloudFoundryUsersUAA.getUsers(token_type, access_token, searchOptions);
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
