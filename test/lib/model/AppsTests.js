/*jslint node: true*/
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

var cloudFoundry = require("../../../lib/model/CloudFoundry");
var cloudFoundryApps = require("../../../lib/model/Apps");
cloudFoundry = new cloudFoundry(nconf.get('CF_API_URL'));
cloudFoundryApps = new cloudFoundryApps(nconf.get('CF_API_URL'));

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

describe.only("Cloud Foundry Apps", function () {

    it("The platform returns Apps", function () {
        this.timeout(2500);

    	var token_endpoint = null;
		return cloudFoundry.getInfo().then(function (result) {
			token_endpoint = result.token_endpoint;	
    		return cloudFoundry.login(token_endpoint,username,password);
    	}).then(function (result) {
            return cloudFoundryApps.getApps(result.token_type,result.access_token);
        }).then(function (result) { 
            expect(result.total_results).to.be.a('number');
		});
    });    

    it("The platform can't find an unknown app", function () {
        this.timeout(3500);

        var token_endpoint = null;
        var app_guid = null;
        var appToFind = "unknownApp";
        return cloudFoundry.getInfo().then(function (result) {
            token_endpoint = result.token_endpoint; 
            return cloudFoundry.login(token_endpoint,username,password).then(function (result) {
                return cloudFoundryApps.getApps(result.token_type,result.access_token).then(function (result) {
                    return new Promise(function (resolve, reject) {
                        expect(result.total_results).to.be.a('number');
                        for(var i = 0; i < result.resources.length; i++){
                            if(result.resources[i].entity.name === appToFind){
                                app_guid = result.resources[i].metadata.guid;
                                return resolve();
                            }
                        }
                        return reject("Not found App.");
                    });
                });
            });
        }).then(function (result) { 
            console.log(result);
            expect('everthing').to.be.ok;
        }).catch(function (reason) {
            expect(reason).to.equal("Not found App.");
        });
    }); 

    it("The platform returns a Summary from an App", function () {
        this.timeout(3500);

        var token_endpoint = null;
        var app_guid = null;
        return cloudFoundry.getInfo().then(function (result) {
            token_endpoint = result.token_endpoint; 
            return cloudFoundry.login(token_endpoint,username,password).then(function (result) {
                return cloudFoundryApps.getApps(result.token_type,result.access_token).then(function (result) {
                    return new Promise(function (resolve, reject) {
                        expect(result.total_results).to.be.a('number');
                        if(result.total_results > 0){
                            app_guid = result.resources[0].metadata.guid;
                            return resolve();
                        }else{
                            return reject("Not found App.");
                        }
                    });
                });
            });
        }).then(function (result) {
            return cloudFoundry.login(token_endpoint,username,password).then(function (result) {
                return cloudFoundryApps.getSummary(result.token_type,result.access_token,app_guid);
            });
        }).then(function (result) { 
            expect('everthing').to.be.ok;
        }).catch(function (reason) {
            expect(reason).to.equal("Not found App.");
        });
    }); 

    it("The platform returns Stats from an App", function () {
        this.timeout(3500);

        var token_endpoint = null;
        var app_guid = null;
        return cloudFoundry.getInfo().then(function (result) {
            token_endpoint = result.token_endpoint; 
            return cloudFoundry.login(token_endpoint,username,password).then(function (result) {
                return cloudFoundryApps.getApps(result.token_type,result.access_token).then(function (result) {
                    return new Promise(function (resolve, reject) {
                        expect(result.total_results).to.be.a('number');
                        if(result.total_results > 0){
                            app_guid = result.resources[0].metadata.guid;
                            return resolve();
                        }else{
                            return reject("Not found App.");
                        }
                    });
                });
            });
        }).then(function (result) {
            return cloudFoundry.login(token_endpoint,username,password).then(function (result) {
                return cloudFoundryApps.getStats(result.token_type,result.access_token,app_guid);
            });
        }).then(function (result) { 
            console.log(result);
            expect('everthing').to.be.ok;
        }).catch(function (reason) {
            expect(reason).to.equal("Not found App.");
        });
    }); 

    it("The platform returns instances from an App", function () {
        this.timeout(3500);

        var token_endpoint = null;
        var app_guid = null;
        return cloudFoundry.getInfo().then(function (result) {
            token_endpoint = result.token_endpoint; 
            return cloudFoundry.login(token_endpoint,username,password).then(function (result) {
                return cloudFoundryApps.getApps(result.token_type,result.access_token).then(function (result) {
                    return new Promise(function (resolve, reject) {
                        expect(result.total_results).to.be.a('number');
                        if(result.total_results > 0){
                            app_guid = result.resources[0].metadata.guid;
                            return resolve();
                        }else{
                            return reject("Not found App.");
                        }
                    });
                });
            });
        }).then(function (result) {
            return cloudFoundry.login(token_endpoint,username,password).then(function (result) {
                return cloudFoundryApps.getInstances(result.token_type,result.access_token,app_guid);
            });
        }).then(function (result) { 
            expect('everthing').to.be.ok;
        }).catch(function (reason) {
            expect(reason).to.equal("Not found App.");
        });
    });

});
