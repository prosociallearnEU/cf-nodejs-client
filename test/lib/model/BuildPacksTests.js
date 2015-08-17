/*jslint node: true*/
/*global describe: true, it: true*/
"use strict";

var chai = require("chai"),
    expect = require("chai").expect;

var buildpacks = require("../../../lib/model/BuildPacks");
buildpacks = new buildpacks();

describe("Cloud Foundry Buildpacks", function () {

    it("Exist a support for a Node.js project", function () {
        expect(buildpacks.get("nodejs")).to.equal("https://github.com/cloudfoundry/nodejs-buildpack");
    });   

    it("Exist a support for a Static project", function () {
        expect(buildpacks.get("static")).to.equal("https://github.com/cloudfoundry/staticfile-buildpack");
    }); 

    it("Unknown Buildpacks handling", function () {
        expect(function(){
            buildpacks.get("Unknown")
        }).to.throw('This Buildpack is not supported');
    });

});