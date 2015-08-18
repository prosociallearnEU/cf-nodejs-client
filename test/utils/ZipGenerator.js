/*jslint node: true*/
/*globals Promise:true*/
"use strict";

var fs = require('fs');
var archiver = require('archiver');

function ZipGenerator() {
    return undefined;
}

ZipGenerator.prototype.generateDummyFile = function (weight) {

    //console.log("Creating a dummy " + weight + "MB file");

    var seed = "1234567890123456789\n";
    var content = "";
    var oneK = 52;
    var oneMB = 1024;
    var iterations = oneK * oneMB * weight;
    var i = 0;
    for (i = 0; i < iterations; i++) {
        content += seed;
    }

    return content;
};

/**
 * https://github.com/archiverjs/node-archiver
 * 
 * @param  {[type]} zipName [description]
 * @return {[type]}         [description]
 */
ZipGenerator.prototype.generate = function (zipName, weight, compressionRate) {

    var HTMLContent = "<!DOCTYPE html><html><header><title>This is title</title></header><body><h1>Hello world</h1></body></html>";

    var self = this;

    return new Promise(function (resolve) {

        var output = fs.createWriteStream(zipName);
        var archive = archiver('zip', { zlib: { level: compressionRate } });
        archive.append(HTMLContent, { name : 'index.html' });

        if (weight > 0) {
            archive.append(self.generateDummyFile(weight), { name : 'dummy.txt' });
        }

        archive.pipe(output);
        archive.finalize();

        output.on('close', function () {
            //console.log(zipName + " : " + ((archive.pointer()/1024)/1024).toFixed(2) + 'MB');
            return resolve();
        });

    });

};

ZipGenerator.prototype.remove = function (zipName) {

    return new Promise(function (resolve, reject) {
        fs.unlink(zipName, function (error) {
            if (error) {
                return reject(error);
            }
            return resolve();
        });
    });
};


module.exports = ZipGenerator;
