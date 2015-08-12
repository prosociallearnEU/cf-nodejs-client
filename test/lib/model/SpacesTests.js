/*jslint node: true*/
/*global describe: true, it: true*/
/*globals Promise:true*/
"use strict";

var chai = require("chai"),
    expect = require("chai").expect;


var config = require('../../../config.json');
var cloudFoundry = require("../../../lib/model/CloudFoundry");
var cloudFoundrySpaces = require("../../../lib/model/Spaces");
var cloudFoundryApps = require("../../../lib/model/Apps");
cloudFoundry = new cloudFoundry(config.CF_API_URL);
cloudFoundrySpaces = new cloudFoundrySpaces(config.CF_API_URL);
cloudFoundryApps = new cloudFoundryApps(config.CF_API_URL);

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

describe("Cloud foundry Spaces", function () {

    it("The platform allways has defined a Space to operate.", function () {
        var token_endpoint = null;
        var space_guid = null;
        return cloudFoundry.getInfo().then(function (result) {
            token_endpoint = result.token_endpoint; 
            return cloudFoundry.login(token_endpoint,config.username,config.password).then(function (result) {
                return cloudFoundrySpaces.getSpaces(result.token_type,result.access_token).then(function (result) {
                    return new Promise(function (resolve, reject) {
                        space_guid = result.resources[0].metadata.guid;
                        //console.log("Space GUID: " + space_guid);                
                        return resolve(result);
                    });
                });
            });
        }).then(function (result) {
            expect(result.total_results).to.be.above(0);
        });
    }); 

});