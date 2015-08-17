/*jslint node: true*/
/*global describe: true, it: true*/
"use strict";

var chai = require("chai"),
    chaiAsPromised = require("chai-as-promised"),
    expect = require("chai").expect;
chai.use(chaiAsPromised);

var nconf = require('nconf');
nconf.argv().env().file({ file: 'config.json' });

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
    		return cloudFoundry.login(token_endpoint,nconf.get('username'),nconf.get('password'));
    	}).then(function (result) {
            return cloudFoundryApps.getApps(result.token_type,result.access_token);
        }).then(function (result) { 
            expect(result.total_results).to.be.a('number');
		});
    });    

});

/**
 *     return cloudFoundry.login(token_endpoint,config.username,config.password).then(function (result) {
        return cloudFoundryApps.getApps(result.token_type,result.access_token).then(function (result) {
            return new Promise(function (resolve, reject) {
                console.log(result.resources.length);
                for(var i = 0; i < result.resources.length; i++){
                    if(result.resources[i].entity.name == "NodeJSHelloWorld"){
                        console.log(result.resources[i].entity.name);
                        console.log(result.resources[i].metadata);
                        app_guid = result.resources[i].metadata.guid;
                        return resolve();
                    }
                }
                return reject("Not found App.");
            });
        });
    });
}).then(function (result) {
    return cloudFoundry.login(token_endpoint,config.username,config.password).then(function (result) {
        return cloudFoundryApps.getSummary(result.token_type,result.access_token,app_guid);
    });
 */

/*
//Associate Route
//TODO: Move example to apps
function acceptRoute(){

    console.log("# Accept a route");
    return new Promise(function (resolve, reject) {

        cloudFoundry.getInfo().then(function (result) {
            token_endpoint = result.token_endpoint;
            return cloudFoundry.login(token_endpoint,config.username,config.password).then(function (result) {   
                return cloudFoundryDomains.getDomains(result.token_type,result.access_token).then(function (result) {
                    return new Promise(function (resolve, reject) {
                        domain_guid = result.resources[0].metadata.guid;
                        return resolve();
                    });
                });
            });
        }).then(function (result) {
            return cloudFoundry.login(token_endpoint,config.username,config.password).then(function (result) {
                return cloudFoundrySpaces.getSpaces(result.token_type,result.access_token).then(function (result) {
                    return new Promise(function (resolve, reject) {
                        space_guid = result.resources[0].metadata.guid;
                        return resolve();
                    });
                });
            });
        }).then(function (result) {
            //TODO: Refactor this part. Maybe it is possible to use a CF method to get info from a specific App.
            appName = "HelloWorldJSP";
            return cloudFoundry.login(token_endpoint,config.username,config.password).then(function (result) {
                return cloudFoundryApps.getApps(result.token_type,result.access_token).then(function (result) {
                    return new Promise(function (resolve, reject) {
                        //console.log(result.resources.length);
                        for(var i = 0; i < result.resources.length; i++){
                            if(result.resources[i].entity.name == appName){
                                //console.log(result.resources[i].entity.name);
                                //console.log(result.resources[i].metadata);
                                app_guid = result.resources[i].metadata.guid;
                                return resolve(result.resources[i].metadata.guid);
                            }
                        }
                        return reject("Not found App.");
                    });
                });
            });            
        }).then(function (result) {
            return cloudFoundry.login(token_endpoint,config.username,config.password).then(function (result) {   
                return cloudFoundryRoutes.acceptRoute(result.token_type,result.access_token,appName,app_guid,domain_guid,space_guid,route_guid);
            });           
        }).then(function (result) {
            //console.log(result);
            return resolve("OK, Test 5");
        }).catch(function (reason) {   
            console.error("Error: " + reason);
            return resolve("KO, Test 5");
        });

    });

}
*/