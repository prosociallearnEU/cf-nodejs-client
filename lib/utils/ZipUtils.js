/*jslint node: true*/
/*globals Promise:true*/
"use strict";

var request = require('request');
var JSZip = require('jszip'),
    crypto = require('crypto'),
    yaml = require('js-yaml');
var httpUtils = require('./HttpUtils');

function ZipUtils(){
    this.REST = new httpUtils();
}

ZipUtils.prototype.getResources = function (url) {

    var headers = { };
    var qs = { };    
    var body = {};

    return this.REST.request2("GET",url, headers, qs, body,"200");
};

ZipUtils.prototype.getData = function (url) {

    var headers = { };
    var qs = { };    
    var body = {};

    return this.REST.request2("GET",url, headers, qs, body,"200");
};

ZipUtils.prototype.getResources = function (url) {
    /*
    if (!params) {
        return callback('Not enough parameters');
    }
    */
    return new Promise(function (resolve, reject) {

        request.get({ url: url, encoding: null }, function (error, response, body) {

            if (error || response.statusCode !== 200) {
                //return callback('Can not get file');
                return reject(body);                
            }
            this.dataRemoteFile = body;
            var zip = new JSZip(body),
                resources = [];
            for (var i in zip.files) {
                if (zip.files.hasOwnProperty(i) && zip.files[i].dir === false) {
                    var file = zip.files[i],
                        name = file.name,
                        buffer = zip.file(name).asText(),
                        sha1 = crypto.createHash('sha1');
                    if (name.substr(name.lastIndexOf('/') + 1) === 'manifest.yml') {
                        this.manifest = yaml.safeLoad(buffer);
                    }
                    resources.push({
                        'fn': name,
                        'size': file._data.uncompressedSize,
                        'sha1': sha1.update(buffer).digest('hex')

                    });
                }
            }

            //console.log(this.manifest);

            //callback(null, resources);
            return resolve(resources);
        });
    });
};

ZipUtils.prototype.getManifest = function (url) {
    /*
    if (!params) {
        return callback('Not enough parameters');
    }
    */
   
    var manifest = null;

    return new Promise(function (resolve, reject) {

        request.get({ url: url, encoding: null }, function (error, response, body) {

            if (error || response.statusCode !== 200) {
                //return callback('Can not get file');
                return reject(body);                
            }
            this.dataRemoteFile = body;
            var zip = new JSZip(body),
                resources = [];
            for (var i in zip.files) {
                if (zip.files.hasOwnProperty(i) && zip.files[i].dir === false) {
                    var file = zip.files[i],
                        name = file.name,
                        buffer = zip.file(name).asText(),
                        sha1 = crypto.createHash('sha1');
                    if (name.substr(name.lastIndexOf('/') + 1) === 'manifest.yml') {
                        manifest = yaml.safeLoad(buffer);
                    }
                    resources.push({
                        'fn': name,
                        'size': file._data.uncompressedSize,
                        'sha1': sha1.update(buffer).digest('hex'),
                        //'manifest' : this.manifest
                    });
                }
            }

            //console.log(this.manifest);

            //callback(null, resources);
            return resolve(manifest);
        });
    });
};

module.exports = ZipUtils;
