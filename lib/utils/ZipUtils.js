/*jslint node: true*/
/*globals Promise:true*/
"use strict";

var JSZip = require('jszip'),
    crypto = require('crypto'),
    yaml = require('js-yaml');  

function ZipUtils(_body){
	this.body = _body;
}

ZipUtils.prototype.getData = function(){

	//console.log(this.body);

	return new Promise(function (resolve, reject) {
		console.log("asdf" + this.body);
		var zip = new JSZip(this.body),
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
	                'manifest' : manifest
	            });
	        }
	    }

	    return resolve(resources);

	});

    //return resources;
}

module.exports = ZipUtils;