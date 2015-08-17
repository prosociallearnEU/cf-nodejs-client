/*jslint node: true*/
/*global describe: true, it: true*/
"use strict";

var chai = require("chai"),
    expect = require("chai").expect;
var randomWords = require('random-words');

var nconf = require('nconf');
nconf.argv().env().file({ file: 'config.json' });

var cloudFoundry = require("../../../lib/model/CloudFoundry");
var cloudFoundryApps = require("../../../lib/model/Apps");
var buildPacks = require("../../../lib/model/BuildPacks");
cloudFoundry = new cloudFoundry(nconf.get('CF_API_URL'));
cloudFoundryApps = new cloudFoundryApps(nconf.get('CF_API_URL'));
buildPacks = new buildPacks();

var appMacros = require("../../../examples/macros/AppMacros");
appMacros = new appMacros(nconf.get('CF_API_URL'),nconf.get('username'),nconf.get('password'));

var fs = require('fs');
var zipGenerator = require('../../utils/ZipGenerator');
zipGenerator = new zipGenerator();

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

function randomInt (low, high) {
    return Math.floor(Math.random() * (high - low) + low);
}

describe.only("Cloud Foundry Upload App process", function () {

    it("Create & Upload a simple Static app", function () {
        this.timeout(40000);

    	var token_endpoint = null;
        var appName = "app" + randomWords() + randomInt(1,10);
        var app_guid = null;
        var zipPath = "./staticApp.zip";
        var buildPack = buildPacks.get("static");      

		return appMacros.createApp(appName,buildPack).then(function (result) {
            app_guid = result.metadata.guid;
            expect(app_guid).to.not.be.undefined;
            return zipGenerator.generate(zipPath,1,0);
        }).then(function (result) {
            //Does exist the zip?   
            fs.exists(zipPath, function(result){
                expect(result).to.be.true;
            });
            return appMacros.uploadApp(appName,app_guid,zipPath);
        }).then(function (result) {
            expect(JSON.stringify(result)).to.equal("{}");
            return cloudFoundry.getInfo();
        }).then(function (result) {
            token_endpoint = result.token_endpoint;
            return cloudFoundry.login(token_endpoint,nconf.get('username'),nconf.get('password')).then(function (result) {
                return cloudFoundryApps.deleteApp(result.token_type,result.access_token,app_guid);
            });             
        }).then(function (result) {
            console.log(result);
            expect('everthing').to.be.ok;

            //TODO: 20150811
            //It is necessary to start the app manually.
            //console.log("cf start", appName);
            //console.log("cf d", appName);                
        });
    });    

});

