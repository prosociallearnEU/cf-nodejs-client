/*jslint node: true*/
/*global Promise:true*/
/*global describe: true, it: true*/
"use strict";

var chai = require("chai"),
    chaiAsPromised = require("chai-as-promised"),
    expect = require("chai").expect;
chai.use(chaiAsPromised);

var nconf = require('nconf');
nconf.argv().env().file({ file: 'config.json' });

var cf_api_url = nconf.get('CF_API_URL'),
    username = nconf.get('username'),
    password = nconf.get('password');

var CloudFoundry = require("../../../lib/model/CloudFoundry");
var CloudFoundryApps = require("../../../lib/model/Apps");
var CloudFoundrySpaces = require("../../../lib/model/Spaces");
CloudFoundry = new CloudFoundry(nconf.get('CF_API_URL'));
CloudFoundryApps = new CloudFoundryApps(nconf.get('CF_API_URL'));
CloudFoundrySpaces = new CloudFoundrySpaces(nconf.get('CF_API_URL'));

function block(token_endpoint, app_guid) {

    return new Promise(function (resolve, reject) {

        CloudFoundry.login(token_endpoint, username, password).then(function (result) {
            return CloudFoundryApps.getInstances(result.token_type, result.access_token, app_guid);
        }).then(function () {
            //console.log(result);
            return CloudFoundry.login(token_endpoint, username, password).then(function (result) {
                return CloudFoundryApps.getStats(result.token_type, result.access_token, app_guid);
            });
        }).then(function (result) {
            //console.log(result);
            return resolve(result);
        }).catch(function (reason) {
            console.error("Error: " + reason);
            return reject(reason);
        });


    });
}

function recursiveExample(token_endpoint, app_guid) {
    var iterationLimit = 10;
    var counter = 0;

    return new Promise(function check(resolve, reject) {

        block(token_endpoint, app_guid).then(function (result) {
            console.log(result["0"].state);
            //console.log(counter);
            if (result["0"].state === "RUNNING") {
                resolve(result);
            } else if (counter === iterationLimit) {
                reject(new Error("Timeout"));
            } else {
                //console.log("next try");
                counter += 1;
                setTimeout(check, 1000, resolve, reject);
            }
        });

    });

}

describe("Cloud Foundry Apps", function () {

    it("The platform returns Apps", function () {
        this.timeout(2500);

        var token_endpoint = null;
        return CloudFoundry.getInfo().then(function (result) {
            token_endpoint = result.token_endpoint;
            return CloudFoundry.login(token_endpoint, username, password);
        }).then(function (result) {
            return CloudFoundryApps.getApps(result.token_type, result.access_token);
        }).then(function (result) {
            expect(result.total_results).to.be.a('number');
        });
    });

    it("The platform can't find an unknown app", function () {
        this.timeout(3500);

        var token_endpoint = null;
        var app_guid = null;
        var appToFind = "unknownApp";
        return CloudFoundry.getInfo().then(function (result) {
            token_endpoint = result.token_endpoint;
            return CloudFoundry.login(token_endpoint, username, password).then(function (result) {
                return CloudFoundryApps.getApps(result.token_type, result.access_token).then(function (result) {
                    return new Promise(function (resolve, reject) {
                        expect(result.total_results).to.be.a('number');
                        var i = 0;
                        for (i = 0; i < result.resources.length; i++) {
                            if (result.resources[i].entity.name === appToFind) {
                                app_guid = result.resources[i].metadata.guid;
                                return resolve(app_guid);
                            }
                        }
                        return reject("Not found App.");
                    });
                });
            });
        }).then(function (result) {
            //console.log(result);
            expect(true).to.equal(true);
        }).catch(function (reason) {
            expect(reason).to.equal("Not found App.");
        });
    });

    it("The platform returns a Summary from an App", function () {
        this.timeout(4500);

        var token_endpoint = null;
        var app_guid = null;
        return CloudFoundry.getInfo().then(function (result) {
            token_endpoint = result.token_endpoint;
            return CloudFoundry.login(token_endpoint, username, password).then(function (result) {
                return CloudFoundryApps.getApps(result.token_type, result.access_token).then(function (result) {
                    return new Promise(function (resolve, reject) {
                        expect(result.total_results).to.be.a('number');
                        if (result.total_results > 0) {
                            app_guid = result.resources[0].metadata.guid;
                            return resolve();
                        }else {
                            return reject("Not found App.");
                        }
                    });
                });
            });
        }).then(function () {
            return CloudFoundry.login(token_endpoint, username, password).then(function (result) {
                return CloudFoundryApps.getSummary(result.token_type, result.access_token, app_guid);
            });
        }).then(function (result) {
            //console.log(result);
            expect(true).to.equal(true);
        }).catch(function (reason) {
            expect(reason).to.equal("Not found App.");
        });
    });

    it("The platform returns Stats from an App", function () {
        this.timeout(3500);

        var token_endpoint = null;
        var app_guid = null;
        return CloudFoundry.getInfo().then(function (result) {
            token_endpoint = result.token_endpoint;
            return CloudFoundry.login(token_endpoint, username, password).then(function (result) {
                return CloudFoundryApps.getApps(result.token_type, result.access_token).then(function (result) {
                    return new Promise(function (resolve, reject) {
                        expect(result.total_results).to.be.a('number');
                        if (result.total_results > 0) {
                            app_guid = result.resources[0].metadata.guid;
                            return resolve();
                        }else {
                            return reject("Not found App.");
                        }
                    });
                });
            });
        }).then(function () {
            return CloudFoundry.login(token_endpoint, username, password).then(function (result) {
                return CloudFoundryApps.getStats(result.token_type, result.access_token, app_guid);
            });
        }).then(function () {
            expect(true).to.equal(true);
        }).catch(function (reason) {
            expect(reason).to.equal("Not found App.");
        });
    });

    it("The platform returns instances from an App", function () {
        this.timeout(3500);

        var token_endpoint = null;
        var app_guid = null;
        return CloudFoundry.getInfo().then(function (result) {
            token_endpoint = result.token_endpoint;
            return CloudFoundry.login(token_endpoint, username, password).then(function (result) {
                return CloudFoundryApps.getApps(result.token_type, result.access_token).then(function (result) {
                    return new Promise(function (resolve, reject) {
                        expect(result.total_results).to.be.a('number');
                        if (result.total_results > 0) {
                            app_guid = result.resources[0].metadata.guid;
                            return resolve();
                        }else {
                            return reject("Not found App.");
                        }
                    });
                });
            });
        }).then(function () {
            return CloudFoundry.login(token_endpoint, username, password).then(function (result) {
                return CloudFoundryApps.getInstances(result.token_type, result.access_token, app_guid);
            });
        }).then(function () {
            expect(true).to.equal(true);
        }).catch(function (reason) {
            expect(reason).to.equal("Not found App.");
        });
    });

    it("Start an App", function () {
        this.timeout(60000);

        var token_endpoint = null;
        var space_guid = null;
        var app_guid = null;

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
                var filter = {
                    'q': 'name:' + "apptrade",
                    'inline-relations-depth': 1
                };
                //var filter = {
                //    'guid' : space_guid
                //}                  
                return CloudFoundrySpaces.getSpaceApps(result.token_type, result.access_token, space_guid, filter);
            });
        }).then(function (result) {
            app_guid = result.resources[0].metadata.guid;
            //console.log(app_guid);
            console.log(result.resources[0].entity.state);
            return CloudFoundry.login(token_endpoint, username, password).then(function (result) {
                return CloudFoundryApps.startApp(result.token_type, result.access_token, app_guid);
            });
        }).then(function () {
            return recursiveExample(token_endpoint, app_guid);
        //RESET STATE
        }).then(function () {
            //console.log(result["0"].stats.uris[0]);
            return CloudFoundry.login(token_endpoint, username, password).then(function (result) {
                return CloudFoundryApps.stopApp(result.token_type, result.access_token, app_guid);
            });
        }).then(function (result) {
            console.log(result.entity.state);
            expect(true).to.equal(true);
        }).catch(function (reason) {
            expect(reason).to.equal("Not found App.");
        });
    });

});
