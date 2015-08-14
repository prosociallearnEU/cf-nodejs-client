/*jslint node: true*/
/*global describe: true, it: true*/
"use strict";

var chai = require("chai"),
    expect = require("chai").expect;
var fs = require('fs');

var zipGenerator = require('./ZipGenerator');
zipGenerator = new zipGenerator();

describe("Zip Generator", function () {

    it("Class generate a zip", function () {

        var zipName = "staticApp.zip";

        return zipGenerator.generate(zipName).then(function (result) {
            //Does exist the zip?   
            fs.exists(zipName, function(result){
                expect(result).to.be.true;
            });
            return zipGenerator.remove(zipName);
        }).then(function (result) {
            fs.exists(zipName, function(result){
                expect(result).to.be.false;
            });            
        }); 

    }); 
});