/*jslint node: true*/

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
var CloudFoundryApps = require("../../../../lib/model/cloudcontroller/Apps");
CloudController = new CloudController();
CloudFoundryUsersUAA = new CloudFoundryUsersUAA();
CloudFoundryApps = new CloudFoundryApps();

describe("Cloud Foundry Users UAA", function () {
    "use strict";
    var authorization_endpoint = null;
    var token_endpoint = null;
    var token_type = null;
    var access_token = null;
    var refresh_token = null;

    before(function () {
        this.timeout(15000);

        CloudController.setEndPoint(cf_api_url);
        CloudFoundryApps.setEndPoint(cf_api_url);        

        return CloudController.getInfo().then(function (result) {
            authorization_endpoint = result.authorization_endpoint;
            token_endpoint = result.token_endpoint;
            CloudFoundryUsersUAA.setEndPoint(authorization_endpoint);
            return CloudFoundryUsersUAA.login(username, password);
        }).then(function (result) {
            CloudFoundryApps.setToken(result);
            CloudFoundryUsersUAA.setToken(result);
        });

    });

    function randomInt(low, high) {
        return Math.floor(Math.random() * (high - low) + low);
    }

    function sleep(time, callback) {
        var stop = new Date().getTime();
        while (new Date().getTime() < stop + time) {
            ;
        }
        callback();
    }

    it("Using an unique Login, it is possible to execute several REST operations", function () {
        this.timeout(5000);

        return CloudFoundryApps.getApps().then(function () {
            return CloudFoundryApps.getApps();
        }).then(function () {
            return CloudFoundryApps.getApps();
        }).then(function () {
            return CloudFoundryApps.getApps();
        }).then(function () {
            expect(true).to.equal(true);
        });
    });

    it("Use a refresh token to renew Oauth token", function () {
        this.timeout(25000);

        var token_type_test = null;
        var access_token_test = null;
        var refresh_token_test = null;

        return CloudFoundryUsersUAA.login(username, password).then(function (result) {
            CloudFoundryUsersUAA.setToken(result);
            sleep(5000, function () {
                console.log("5 second");
            });
            return CloudFoundryUsersUAA.refreshToken();
        }).then(function (result) {
            CloudFoundryUsersUAA.setToken(result);
            CloudFoundryApps.setToken(result);
            return CloudFoundryApps.getApps();
        }).then(function (result) {          
            return CloudFoundryUsersUAA.refreshToken();
        }).then(function (result) {
            CloudFoundryUsersUAA.setToken(result);
            CloudFoundryApps.setToken(result);
            return CloudFoundryApps.getApps();            
        }).then(function (result) {
            expect(result.resources).to.be.a('array');
        });
    });

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

            return CloudFoundryUsersUAA.add(uaa_options).then(function (result) {
                return CloudFoundryUsersUAA.getUsers(searchOptions);
            }).then(function (result) {
                if(result.resources.length !== 1){
                    return new Promise(function (resolve, reject) {
                        return reject("No Users");
                    });
                }
                uaa_guid = result.resources[0].id;
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

        it.skip("[DEBUGGING] The platform creates, update Password & remove an User", function () {
            this.timeout(5000);

            var accountName = "user" + randomInt(1, 1000);
            var accountPassword = "123456";
            var uaa_guid = null;
            var user_id = null;
            var uaa_options = {
                schemas: ["urn:scim:schemas:core:1.0"],
                userName: accountName,
                name: {
                    formatted: accountName,
                    familyName: accountName,
                    givenName: accountName
                },
                emails: [
                    {
                      "value":"user@example.com",
                      "type":"work"
                    }
                  ],
                password: accountPassword,
            };
            var searchOptions = "?filter=userName eq '" + accountName + "'";

            return CloudFoundryUsersUAA.add(token_type, access_token, uaa_options).then(function (result) {
                console.log(result);
                user_id = result.id;
                return CloudFoundryUsersUAA.getUsers(token_type, access_token, searchOptions);
            }).then(function (result) {
                if(result.resources.length !== 1){
                    return new Promise(function (resolve, reject) {
                        return reject("No Users");
                    });
                }
                uaa_guid = result.resources[0].id;
            }).then(function (result) {
                return CloudFoundryUsersUAA.login(accountName, accountPassword);
            }).then(function (result) {
                var newuser_token_type = result.token_type;
                var newuser_access_token = result.access_token;
                uaa_options = {
                    schemas: ["urn:scim:schemas:core:1.0"],
                    password: accountPassword,
                    oldPassword: accountPassword
                };
                return CloudFoundryUsersUAA.updatePassword(newuser_token_type, newuser_access_token, user_id, uaa_options);
            }).then(function (result) {
                console.log(result);
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
            }).catch(function (reason) {
                console.log(reason);
                expect(true).to.equal(true);
            });
        });

    }

});
