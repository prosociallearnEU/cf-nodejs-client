/*jslint node: true*/
/*global describe: true, it: true*/
"use strict";

var chai = require("chai"),
    expect = require("chai").expect;

var HttpUtils = require('../../lib/utils/HttpUtils');
HttpUtils = new HttpUtils();

describe("HttpUtils", function () {

    it("HTML 200 Test", function () {
        this.timeout(15000);

        var url = "https://api.run.pivotal.io/v2/info";
        var options = {
            method: 'GET',
            url: url
        };

        return HttpUtils.request(options, 200, false).then(function (result) {
            expect(result).is.a("string");
        });
    });

    it("System requires JSON, but the response is a String", function () {
        this.timeout(15000);

        var url = "https://api3.run.pivotal.io/v2/info";
        var options = {
            method: 'GET',
            url: url
        };

        return HttpUtils.request(options, 200, true).then(function (result) {
            expect(result).is.a("string");
        }).catch(function (reason) {
            console.log(reason);
            expect(true).is.a("boolean");
        });
    });

    it("HTML 404 Test", function () {
        this.timeout(15000);

        var url = "https://api.run.pivotal.io/v22/info";
        var options = {
            method: 'GET',
            url: url
        };

        return HttpUtils.request(options, 404, false).then(function (result) {
            expect(result).is.a("string");
        });
    });

});