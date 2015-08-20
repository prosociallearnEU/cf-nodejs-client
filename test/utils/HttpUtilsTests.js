/*jslint node: true*/
/*global describe: true, it: true*/
"use strict";

var chai = require("chai"),
    expect = require("chai").expect;

var HttpUtils = require('../../lib/utils/HttpUtils');
HttpUtils = new HttpUtils();

describe("HttpUtils", function () {

    it("HTML 200 Test", function () {

        var url = "http://www.google.com/";
        var options = {
            method: 'GET',
            url: url
        };

        return HttpUtils.request(options, "200", false).then(function (result) {
            expect(result).is.a("string");
        });
    });

    it("HTML 404 Test", function () {

        var url = "https://github.com/jabrena/cf-nodejs-client" + "xxx";
        var options = {
            method: 'GET',
            url: url
        };

        return HttpUtils.request(options, "404", false).then(function (result) {
            expect(result).is.a("string");
        });
    });

});