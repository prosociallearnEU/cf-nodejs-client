/*jslint node: true*/
/*global describe: true, before:true, it: true*/
"use strict";

var Promise = require('bluebird');
var chai = require("chai"),
    expect = require("chai").expect;
var randomWords = require('random-words');

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
var CloudFoundrySpaces = require("../../../../lib/model/cloudcontroller/Spaces");
var CloudFoundryUserProvidedServices = require("../../../../lib/model/cloudcontroller/UserProvidedServices");
var CloudFoundryServiceBindings = require("../../../../lib/model/cloudcontroller/ServiceBindings");
var BuildPacks = require("../../../../lib/model/cloudcontroller/BuildPacks");
CloudController = new CloudController();
CloudFoundryUsersUAA = new CloudFoundryUsersUAA();
CloudFoundryApps = new CloudFoundryApps();
CloudFoundrySpaces = new CloudFoundrySpaces();
CloudFoundryServiceBindings = new CloudFoundryServiceBindings();
CloudFoundryUserProvidedServices = new CloudFoundryUserProvidedServices();
BuildPacks = new BuildPacks();

describe("Cloud foundry Service Bindings", function () {

    var authorization_endpoint = null;
    var token_endpoint = null;
    var token_type = null;
    var access_token = null;
    var space_guid = null;

    before(function () {
        this.timeout(25000);

        CloudController.setEndPoint(cf_api_url);
        CloudFoundryApps.setEndPoint(cf_api_url);
        CloudFoundrySpaces.setEndPoint(cf_api_url);
        CloudFoundryServiceBindings.setEndPoint(cf_api_url);
        CloudFoundryUserProvidedServices.setEndPoint(cf_api_url);

        return CloudController.getInfo().then(function (result) {
            authorization_endpoint = result.authorization_endpoint;
            token_endpoint = result.token_endpoint;
            CloudFoundryUsersUAA.setEndPoint(authorization_endpoint);
            return CloudFoundryUsersUAA.login(username, password);
        }).then(function (result) {
            CloudFoundryApps.setToken(result);
            CloudFoundrySpaces.setToken(result);
            CloudFoundryServiceBindings.setToken(result);
            CloudFoundryUserProvidedServices.setToken(result);
            return CloudFoundrySpaces.getSpaces();
        }).then(function (result) {
            space_guid = result.resources[0].metadata.guid;
        });

    });

    function randomInt(low, high) {
        return Math.floor(Math.random() * (high - low) + low);
    }

    it("The platform returns a list of Service Bindings used", function () {
        this.timeout(30000);

        return CloudFoundryServiceBindings.getServiceBindings().then(function (result) {
            //console.log(result.resources[0].metadata.guid);
            //console.log(result.resources[0].entity.credentials);
            expect(result.total_results).is.a("number");
        });
    });

    it("The platform returns the first Service Bindings", function () {
        this.timeout(30000);

        var serviceBinding_guid = null;
        return CloudFoundryServiceBindings.getServiceBindings().then(function (result) {
            //console.log(result.total_results)
            if(result.total_results === 0){
                return new Promise(function (resolve, reject) {
                    return reject("No Service Binding");
                });
            }
            serviceBinding_guid = result.resources[0].metadata.guid;
            return CloudFoundryServiceBindings.getServiceBinding(serviceBinding_guid);
        }).then(function (result) {
            //console.log(result);
            expect(result.metadata.guid).is.a("string");
        }).catch(function (reason) {
            //console.error("Error: " + reason);
            expect(reason).to.equal("No Service Binding");
        });
    });

    it("The platform returns a list of Service Bindings filtering by app_guid", function () {
        this.timeout(30000);

        var app_guid = null;
        var ERROR_MESSAGE_NO_APPS = "No App";

        return CloudFoundryApps.getApps().then(function (result) {
            return new Promise(function (resolve, reject) {
                expect(result.total_results).to.be.a('number');
                if (result.total_results === 0) {
                    reject(ERROR_MESSAGE_NO_APPS);
                }
                app_guid = result.resources[0].metadata.guid;
                return resolve();
            });
        }).then(function (result) {
            //app_guid
            var filter = {
                'q': 'app_guid:' + app_guid
            };
            return CloudFoundryServiceBindings.getServiceBindings(filter);
        }).then(function (result) {
            //console.log(result.resources);
            //console.log(result.resources[0].metadata.guid);
            //console.log(result.resources[0].entity.credentials);
            expect(result.total_results).is.a("number");
        }).catch(function (reason) {
            console.log(reason);
            expect(reason).to.equal(ERROR_MESSAGE_NO_APPS);
        });
    });

    it("The platform returns a list of Service Bindings filtering by service_instance", function () {
        this.timeout(30000);

        var service_guid = null;

        return CloudFoundryUserProvidedServices.getServices().then(function (result) {
            return new Promise(function (resolve, reject) {
                expect(result.total_results).to.be.a('number');
                if (result.total_results > 0) {
                    service_guid = result.resources[0].metadata.guid;
                    return resolve();
                } else {
                    return reject("Not found App.");
                }
            });
        }).then(function (result) {
            //service_instance_guid
            var filter = {
                'q': 'service_instance_guid:' + service_guid
            };
            return CloudFoundryServiceBindings.getServiceBindings(filter);
        }).then(function (result) {
            //console.log(result.resources[0].metadata.guid);
            //console.log(result.resources[0].entity.credentials);
            expect(result.total_results).is.a("number");
        }).catch(function (reason) {
            //console.error("Error: " + reason);
            expect(reason).to.equal("Not found App.");
        });
    });

    it.skip("The platform associates a Service with an App", function () {
        this.timeout(30000);

        var serviceBinding_guid = null;
        var service_guid = null;
        var app_guid = null;
        return CloudFoundryServiceBindings.getServiceBindings().then(function (result) {
            serviceBinding_guid = result.resources[0].metadata.guid;
            return CloudFoundryServiceBindings.getServiceBinding(serviceBinding_guid);
        }).then(function (result) {
            //console.log(result.entity.credentials);
            expect(result.metadata.guid).is.a("string");
            return CloudFoundryUserProvidedServices.getServices();
        }).then(function (result) {
            service_guid = result.resources[0].metadata.guid;
            return CloudFoundryApps.apps();
        }).then(function (result) {
            //console.log(result.resources[0]);
            app_guid = result.resources[0].metadata.guid;
            //console.log(app_guid);
            return CloudFoundryServiceBindings.associateServiceWithApp(service_guid, app_guid);
        }).then(function (result) {
            //console.log(result);
            expect(true).to.equal(true);
        });
    });

    it.skip("The platform removes a Service Binding", function () {
        this.timeout(30000);

        var serviceBinding_guid = null;
        return CloudFoundryServiceBindings.getServiceBindings().then(function (result) {
            serviceBinding_guid = result.resources[1].metadata.guid;
            return CloudFoundryServiceBindings.remove(serviceBinding_guid);
        }).then(function (result) {
            expect(true).to.equal(true);
        });
    });

    it("The platform creates an App, User Provided Service & Service Binding. Later, the test removes all stuff", function () {
        this.timeout(15000);

        //App
        var appName = "app2" + randomWords() + randomInt(1, 100);
        var filter = {
            'q': 'name:' + appName,
            'inline-relations-depth': 1
        };
        var staticBuildPack = BuildPacks.get("static");
        var app_guid = null;
        var appOptions = {
            "name": appName,
            "space_guid": space_guid,
            "buildpack" : staticBuildPack
        };
        //Service
        var serviceName = "s" + randomWords() + randomInt(1, 100);
        var service_guid = null;
        var credentials = {
            dbname : "demo",
            host : "8.8.8.8",
            port : "3306",
            username : "root",
            password : "123456"
        };
        var user_provided_service_options ={
            "space_guid" : space_guid,
            "name" : serviceName,
            "credentials" : credentials
        };
        //Service binding
        var serviceBinding_guid = null;

        //Creating App, Service & Service Binding
        return CloudFoundrySpaces.getSpaceApps(space_guid, filter).then(function (result) {
            //console.log(result);

            //If exist the application, Reject
            if (result.total_results === 1) {
                throw new Error("Exist the app: " + appName);
            }

            return CloudFoundryApps.add(appOptions).then(function (result) {
                return new Promise(function (resolve) {
                    //console.log(result);
                    app_guid = result.metadata.guid;
                    return resolve(app_guid);
                });
            });
        }).then(function (result) {
            return CloudFoundryUserProvidedServices.add(user_provided_service_options).then(function (result) {
                return new Promise(function (resolve) {
                    //console.log(result);
                    service_guid = result.metadata.guid;
                    return resolve(service_guid);
                });
            });
        }).then(function (result) {
            //console.log(result);
            return CloudFoundryServiceBindings.associateServiceWithApp(service_guid, app_guid).then(function (result) {
                return new Promise(function (resolve) {
                    //console.log(result);
                    serviceBinding_guid = result.metadata.guid;
                    return resolve(serviceBinding_guid);
                });
            });

        //Search
        }).then(function (result) {
            var filter = {
                'q': 'service_instance_guid:' + service_guid
            };
            return CloudFoundryApps.getServiceBindings(app_guid, filter);
        }).then(function (result) {
            expect(result.total_results).to.equal(1);
            var filter = {
                'q': 'app_guid:' + app_guid
            };
            return CloudFoundryServiceBindings.getServiceBindings(filter);
        }).then(function (result) {
            expect(result.total_results).to.equal(1);
            return new Promise(function (resolve) {
                return resolve();
            });
        //Removing the Service Binding, Service & App (Cleaning process)
        }).then(function (result) {
            return CloudFoundryServiceBindings.remove(serviceBinding_guid);
        }).then(function (result) {
            return CloudFoundryUserProvidedServices.remove(service_guid);
        }).then(function (result) {
            return CloudFoundryApps.remove(app_guid);
        }).then(function (result) {
            expect(true).to.equal(true);
        });
    });

    //The method  CloudFoundryApps.removeServiceBindings(app_guid, serviceBinding_guid);
    //only run in CC Version >= 2.42
    if(environment === "PIVOTAL") {

        it("The platform creates an App, User Provided Service & Service Binding. Later, the test removes all stuff 2 (Alternative to remove service binding)", function () {
            this.timeout(5000);

            //App
            var appName = "app2" + randomWords() + randomInt(1, 100);
            var filter = {
                'q': 'name:' + appName,
                'inline-relations-depth': 1
            };
            var staticBuildPack = BuildPacks.get("static");
            var app_guid = null;
            var appOptions = {
                "name": appName,
                "space_guid": space_guid,
                "buildpack" : staticBuildPack
            };
            //Service
            var serviceName = "s" + randomWords() + randomInt(1, 100);
            var service_guid = null;
            var credentials = {
                dbname : "demo",
                host : "8.8.8.8",
                port : "3306",
                username : "root",
                password : "123456"
            };
            var user_provided_service_options ={
                "space_guid" : space_guid,
                "name" : serviceName,
                "credentials" : credentials
            };
            //Service binding
            var serviceBinding_guid = null;

            //Creating App, Service & Service Binding
            return CloudFoundrySpaces.getSpaceApps(space_guid, filter).then(function (result) {
                //console.log(result);

                //If exist the application, Reject
                if (result.total_results === 1) {
                    throw new Error("Exist the app: " + appName);
                }

                return CloudFoundryApps.add(appOptions).then(function (result) {
                    return new Promise(function (resolve) {
                        //console.log(result);
                        app_guid = result.metadata.guid;
                        return resolve(app_guid);
                    });
                });
            }).then(function (result) {
                return CloudFoundryUserProvidedServices.add(user_provided_service_options).then(function (result) {
                    return new Promise(function (resolve) {
                        //console.log(result);
                        service_guid = result.metadata.guid;
                        return resolve(service_guid);
                    });
                });
            }).then(function (result) {
                //console.log(result);
                return CloudFoundryServiceBindings.associateServiceWithApp(service_guid, app_guid).then(function (result) {
                    return new Promise(function (resolve) {
                        //console.log(result);
                        serviceBinding_guid = result.metadata.guid;
                        return resolve(serviceBinding_guid);
                    });
                });

            //Search
            }).then(function (result) {
                var filter = {
                    'q': 'service_instance_guid:' + service_guid
                };
                return CloudFoundryApps.getServiceBindings(app_guid, filter);
            }).then(function (result) {
                expect(result.total_results).to.equal(1);
                var filter = {
                    'q': 'app_guid:' + app_guid
                };
                return CloudFoundryServiceBindings.getServiceBindings(filter);
            }).then(function (result) {
                expect(result.total_results).to.equal(1);
                return new Promise(function (resolve) {
                    return resolve();
                });
            //Removing the Service Binding, Service & App (Cleaning process)
            }).then(function (result) {
                return CloudFoundryApps.removeServiceBindings(app_guid, serviceBinding_guid);
            }).then(function (result) {
                var filter = {
                    'q': 'app_guid:' + app_guid
                };
                return CloudFoundryServiceBindings.getServiceBindings(filter);
            }).then(function (result) {
                expect(result.total_results).to.equal(0);
                return new Promise(function (resolve) {
                    return resolve();
                });
                return CloudFoundryUserProvidedServices.remove(service_guid);
            }).then(function (result) {
                return CloudFoundryApps.remove(app_guid);
            }).then(function (result) {
                expect(true).to.equal(true);
            });
        });

    }

    //Note: it is necessary to stop->start to apply the change with the service.
    it.skip("[TOOL] Given an app, bind a service.", function () {
        this.timeout(30000);

        var serviceBinding_guid = null;
        var app_guid = null;
        var app_name = "nodehwmysql";
        var filter = {
            'q': 'name:' + app_name,
            'inline-relations-depth': 1
        };
        var ups_name = 'mySQLService';
        var service_guid = null
        return CloudFoundrySpaces.getSpaceApps(space_guid, filter).then(function (result) {
            app_guid = result.resources[0].metadata.guid;
            console.log(app_guid);
            return CloudFoundryUserProvidedServices.getServices();
        }).then(function (result) {
            //console.log(result.resources);
            return new Promise(function (resolve, reject) {
                expect(result.total_results).to.be.a('number');
                var i = 0;
                for (i = 0; i < result.resources.length; i++) {
                    if (result.resources[i].entity.name === ups_name) {
                        service_guid = result.resources[i].metadata.guid;
                        return resolve(service_guid);
                    }
                }
                return reject("Not found User Provided Service.");
            });
        }).then(function (result) {
            console.log(result);
            return CloudFoundryServiceBindings.associateServiceWithApp(service_guid, app_guid).then(function (result) {
                return new Promise(function (resolve) {
                    //console.log(result);
                    serviceBinding_guid = result.metadata.guid;
                    return resolve(serviceBinding_guid);
                });
            });
        }).then(function (result) {
            console.log(result);
            expect(true).to.equal(true);
        });
    });

});
