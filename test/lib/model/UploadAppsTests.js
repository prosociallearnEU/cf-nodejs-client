/*jslint node: true*/
/*global describe: true, it: true*/
"use strict";

var chai = require("chai"),
    expect = require("chai").expect;
var randomWords = require('random-words');

var nconf = require('nconf');
nconf.argv().env().file({ file: 'config.json' });

var cf_api_url = nconf.get('CF_API_URL'),
    username = nconf.get('username'),
    password = nconf.get('password');

var CloudFoundry = require("../../../lib/model/CloudFoundry");
var CloudFoundryApps = require("../../../lib/model/Apps");
var BuildPacks = require("../../../lib/model/BuildPacks");
CloudFoundry = new CloudFoundry(nconf.get('CF_API_URL'));
CloudFoundryApps = new CloudFoundryApps(nconf.get('CF_API_URL'));
BuildPacks = new BuildPacks();

var AppMacros = require("../../../examples/macros/AppMacros");
AppMacros = new AppMacros(cf_api_url, username, password);

var fs = require('fs');
var ZipGenerator = require('../../utils/ZipGenerator');
ZipGenerator = new ZipGenerator();

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

function randomInt(low, high) {
    return Math.floor(Math.random() * (high - low) + low);
}

describe("Cloud Foundry Upload App process", function () {

    it("Create a Static App, Upload 1MB zip & Remove app", function () {
        this.timeout(40000);

        var token_endpoint = null;
        var app_guid = null;
        var appName = "app" + randomWords() + randomInt(1, 100);
        var staticBuildPack = BuildPacks.get("static");
        var zipPath = "./staticApp.zip";
        var weight = 1;//MB
        var compressionRate = 0;//No compression    

        return AppMacros.createApp(appName, staticBuildPack).then(function (result) {
            app_guid = result.metadata.guid;
            expect(app_guid).is.a("string");
            expect(result.entity.buildpack).to.equal(staticBuildPack);
            return ZipGenerator.generate(zipPath, weight, compressionRate);
        }).then(function () {
            //Does exist the zip?   
            fs.exists(zipPath, function (result) {
                expect(result).to.equal(true);
            });
            return AppMacros.uploadApp(appName, app_guid, zipPath);
        }).then(function (result) {
            expect(JSON.stringify(result)).to.equal("{}");
            return CloudFoundry.getInfo();
        }).then(function (result) {
            token_endpoint = result.token_endpoint;
            return CloudFoundry.login(token_endpoint, username, password).then(function (result) {
                return CloudFoundryApps.deleteApp(result.token_type, result.access_token, app_guid);
            });
        }).then(function () {
            //console.log(result);
            expect(true).to.equal(true);
        });
    });

    it.skip("Create a Static App, Upload 5MB zip & Remove app", function () {
        this.timeout(40000);

        var token_endpoint = null;
        var app_guid = null;
        var appName = "app" + randomWords() + randomInt(1, 100);
        var staticBuildPack = BuildPacks.get("static");
        var zipPath = "./staticApp.zip";
        var weight = 5;//MB
        var compressionRate = 0;//No compression

        return AppMacros.createApp(appName, staticBuildPack).then(function (result) {
            app_guid = result.metadata.guid;
            expect(app_guid).is.a("string");
            expect(result.entity.buildpack).to.equal(staticBuildPack);
            return ZipGenerator.generate(zipPath, weight, compressionRate);
        }).then(function () {
            //Does exist the zip?   
            fs.exists(zipPath, function (result) {
                expect(result).to.equal(true);
            });
            return AppMacros.uploadApp(appName, app_guid, zipPath);
        }).then(function (result) {
            expect(JSON.stringify(result)).to.equal("{}");
            return CloudFoundry.getInfo();
        }).then(function (result) {
            token_endpoint = result.token_endpoint;
            return CloudFoundry.login(token_endpoint, username, password).then(function (result) {
                return CloudFoundryApps.deleteApp(result.token_type, result.access_token, app_guid);
            });
        }).then(function () {
            //console.log(result);
            expect(true).to.equal(true);
        });
    });

    it("Create a Static App, Upload 10MB zip & Remove app", function () {
        this.timeout(50000);

        var token_endpoint = null;
        var app_guid = null;
        var appName = "app" + randomWords() + randomInt(1, 100);
        var staticBuildPack = BuildPacks.get("static");
        var zipPath = "./staticApp.zip";
        var weight = 10;//MB
        var compressionRate = 0;//No compression

        return AppMacros.createApp(appName, staticBuildPack).then(function (result) {
            app_guid = result.metadata.guid;
            expect(app_guid).is.a("string");
            expect(result.entity.buildpack).to.equal(staticBuildPack);
            return ZipGenerator.generate(zipPath, weight, compressionRate);
        }).then(function () {
            //Does exist the zip?   
            fs.exists(zipPath, function (result) {
                expect(result).to.equal(true);
            });
            return AppMacros.uploadApp(appName, app_guid, zipPath);
        }).then(function (result) {
            expect(JSON.stringify(result)).to.equal("{}");
            return CloudFoundry.getInfo();
        }).then(function (result) {
            token_endpoint = result.token_endpoint;
            return CloudFoundry.login(token_endpoint, username, password).then(function (result) {
                return CloudFoundryApps.deleteApp(result.token_type, result.access_token, app_guid);
            });
        }).then(function () {
            //console.log(result);
            expect(true).to.equal(true);
        });
    });

    it("Create a Static App, Upload 20MB zip & Remove app", function () {
        this.timeout(60000);

        var token_endpoint = null;
        var app_guid = null;
        var appName = "app" + randomWords() + randomInt(1, 100);
        var staticBuildPack = BuildPacks.get("static");
        var zipPath = "./staticApp.zip";
        var weight = 20;//MB
        var compressionRate = 0;//No compression

        return AppMacros.createApp(appName, staticBuildPack).then(function (result) {
            app_guid = result.metadata.guid;
            expect(app_guid).is.a("string");
            expect(result.entity.buildpack).to.equal(staticBuildPack);
            return ZipGenerator.generate(zipPath, weight, compressionRate);
        }).then(function () {
            //Does exist the zip?   
            fs.exists(zipPath, function (result) {
                expect(result).to.equal(true);
            });
            return AppMacros.uploadApp(appName, app_guid, zipPath);
        }).then(function (result) {
            expect(JSON.stringify(result)).to.equal("{}");
            return CloudFoundry.getInfo();
        }).then(function (result) {
            token_endpoint = result.token_endpoint;
            return CloudFoundry.login(token_endpoint, username, password).then(function (result) {
                return CloudFoundryApps.deleteApp(result.token_type, result.access_token, app_guid);
            });
        }).then(function () {
            //console.log(result);
            expect(true).to.equal(true);
        });
    });

    it("Create a Static App, Upload 50MB zip & Remove app", function () {
        this.timeout(80000);

        var token_endpoint = null;
        var app_guid = null;
        var appName = "app" + randomWords() + randomInt(1, 100);
        var staticBuildPack = BuildPacks.get("static");
        var zipPath = "./staticApp.zip";
        var weight = 50;//MB
        var compressionRate = 0;//No compression

        return AppMacros.createApp(appName, staticBuildPack).then(function (result) {
            app_guid = result.metadata.guid;
            expect(app_guid).is.a("string");
            expect(result.entity.buildpack).to.equal(staticBuildPack);
            return ZipGenerator.generate(zipPath, weight, compressionRate);
        }).then(function () {
            //Does exist the zip?   
            fs.exists(zipPath, function (result) {
                expect(result).to.equal(true);
            });
            return AppMacros.uploadApp(appName, app_guid, zipPath);
        }).then(function (result) {
            expect(JSON.stringify(result)).to.equal("{}");
            return CloudFoundry.getInfo();
        }).then(function (result) {
            token_endpoint = result.token_endpoint;
            return CloudFoundry.login(token_endpoint, username, password).then(function (result) {
                return CloudFoundryApps.deleteApp(result.token_type, result.access_token, app_guid);
            });
        }).then(function () {
            //console.log(result);
            expect(true).to.equal(true);
        });
    });

    it.skip("Create a Static App, Upload 100MB zip & Remove app", function () {
        this.timeout(150000);

        var token_endpoint = null;
        var app_guid = null;
        var appName = "app" + randomWords() + randomInt(1, 100);
        var staticBuildPack = BuildPacks.get("static");
        var zipPath = "./staticApp.zip";
        var weight = 100;//MB
        var compressionRate = 0;//No compression

        return AppMacros.createApp(appName, staticBuildPack).then(function (result) {
            app_guid = result.metadata.guid;
            expect(app_guid).is.a("string");
            expect(result.entity.buildpack).to.equal(staticBuildPack);
            return ZipGenerator.generate(zipPath, weight, compressionRate);
        }).then(function () {
            //Does exist the zip?   
            fs.exists(zipPath, function (result) {
                expect(result).to.equal(true);
            });
            return AppMacros.uploadApp(appName, app_guid, zipPath);
        }).then(function (result) {
            expect(JSON.stringify(result)).to.equal("{}");
            return CloudFoundry.getInfo();
        }).then(function (result) {
            token_endpoint = result.token_endpoint;
            return CloudFoundry.login(token_endpoint, username, password).then(function (result) {
                return CloudFoundryApps.deleteApp(result.token_type, result.access_token, app_guid);
            });
        }).then(function () {
            //console.log(result);
            expect(true).to.equal(true);
        });
    });

});

