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

describe("Cloud Foundry Upload App process", function () {

    it("Create a Static App, Upload 1MB zip & Remove app", function () {
        this.timeout(40000);

        var token_endpoint = null;
        var app_guid = null;
        var appName = "app" + randomWords() + randomInt(1,10);
        var staticBuildPack = buildPacks.get("static");
        var zipPath = "./staticApp.zip";
        var weight = 1;//MB
        var compressionRate = 0;//No compression    

		return appMacros.createApp(appName,staticBuildPack).then(function (result) {
            app_guid = result.metadata.guid;
            expect(app_guid).to.not.be.undefined;
            expect(result.entity.buildpack).to.equal(staticBuildPack);
            return zipGenerator.generate(zipPath,weight,compressionRate);
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
        });
    });    

    it("Create a Static App, Upload 5MB zip & Remove app", function () {
        this.timeout(40000);

        var token_endpoint = null;
        var app_guid = null;
        var appName = "app" + randomWords() + randomInt(1,10);
        var staticBuildPack = buildPacks.get("static");
        var zipPath = "./staticApp.zip";
        var weight = 5;//MB
        var compressionRate = 0;//No compression
    

        return appMacros.createApp(appName,staticBuildPack).then(function (result) {
            app_guid = result.metadata.guid;
            expect(app_guid).to.not.be.undefined;
            expect(result.entity.buildpack).to.equal(staticBuildPack);
            return zipGenerator.generate(zipPath,weight,compressionRate);
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
        });
    });

    it("Create a Static App, Upload 10MB zip & Remove app", function () {
        this.timeout(50000);

        var token_endpoint = null;
        var app_guid = null;
        var appName = "app" + randomWords() + randomInt(1,10);
        var staticBuildPack = buildPacks.get("static");
        var zipPath = "./staticApp.zip";
        var weight = 10;//MB
        var compressionRate = 0;//No compression
    

        return appMacros.createApp(appName,staticBuildPack).then(function (result) {
            app_guid = result.metadata.guid;
            expect(app_guid).to.not.be.undefined;
            expect(result.entity.buildpack).to.equal(staticBuildPack);
            return zipGenerator.generate(zipPath,weight,compressionRate);
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
        });
    });

    it("Create a Static App, Upload 20MB zip & Remove app", function () {
        this.timeout(60000);

        var token_endpoint = null;
        var app_guid = null;
        var appName = "app" + randomWords() + randomInt(1,10);
        var staticBuildPack = buildPacks.get("static");
        var zipPath = "./staticApp.zip";
        var weight = 20;//MB
        var compressionRate = 0;//No compression
    

        return appMacros.createApp(appName,staticBuildPack).then(function (result) {
            app_guid = result.metadata.guid;
            expect(app_guid).to.not.be.undefined;
            expect(result.entity.buildpack).to.equal(staticBuildPack);
            return zipGenerator.generate(zipPath,weight,compressionRate);
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
        });
    });

    it("Create a Static App, Upload 50MB zip & Remove app", function () {
        this.timeout(80000);

        var token_endpoint = null;
        var app_guid = null;
        var appName = "app" + randomWords() + randomInt(1,10);
        var staticBuildPack = buildPacks.get("static");
        var zipPath = "./staticApp.zip";
        var weight = 50;//MB
        var compressionRate = 0;//No compression
    

        return appMacros.createApp(appName,staticBuildPack).then(function (result) {
            app_guid = result.metadata.guid;
            expect(app_guid).to.not.be.undefined;
            expect(result.entity.buildpack).to.equal(staticBuildPack);
            return zipGenerator.generate(zipPath,weight,compressionRate);
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
        });
    });

    it("Create a Static App, Upload 100MB zip & Remove app", function () {
        this.timeout(150000);

        var token_endpoint = null;
        var app_guid = null;
        var appName = "app" + randomWords() + randomInt(1,10);
        var staticBuildPack = buildPacks.get("static");
        var zipPath = "./staticApp.zip";
        var weight = 100;//MB
        var compressionRate = 0;//No compression
    

        return appMacros.createApp(appName,staticBuildPack).then(function (result) {
            app_guid = result.metadata.guid;
            expect(app_guid).to.not.be.undefined;
            expect(result.entity.buildpack).to.equal(staticBuildPack);
            return zipGenerator.generate(zipPath,weight,compressionRate);
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
        });
    });

});

