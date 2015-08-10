/*jslint node: true*/
/*global describe: true, it: true*/
"use strict";

var chai = require("chai"),
    expect = require("chai").expect;



describe("Meta test", function () {

    it("Number with 17 digits doesn't distinguish a minor change", function () {
        var number = 1e17;
        expect(number + 1.1).equal(number);
    });

    it("Number with 16 digits distinguish a minor change", function () {
        var number = 1e16;
        expect(number + 1.1).to.not.equal(number);
    });
});