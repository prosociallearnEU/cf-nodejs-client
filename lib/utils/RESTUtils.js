/*jslint node: true*/
/*globals Promise:true*/
"use strict";

var rest = require('restler');
var fs = require('fs');


function RESTUtils(){

}

RESTUtils.prototype.request = function(_url,access_token,app_guid){

	var url = _url;
	console.log(url);
/*
	var headers = {
        //'Accept': 'application/json',
        'Authorization': token_type + " " + access_token
        //'Content-Type': 'multipart/form-data'
    };

    var qs =  {
        'guid': app_guid,
        'async': 'true'
    };

    var formData = {
        'async': 'true',
        'resources': JSON.stringify(zipResources),
        'application': dataRemoteFile
    }
            */

    var path = "./StaticWebsite_HelloWorld.zip";
    //var obj = fs.createReadStream(path);
    var stats = fs.statSync(path);
 	var fileSizeInBytes = stats["size"]
    console.log(fileSizeInBytes);

    var zipResources = [];

    var options = {
            multipart: true,
            accessToken : access_token,
            query: {
                guid: app_guid,
                async: 'true'
            },
			data: {
			    'resources': JSON.stringify(zipResources),
			    //function File(path, filename, fileSize, encoding, contentType)
			    'application': rest.file(path, null, fileSizeInBytes, null, 'application/zip')
			}

    };

    return new Promise(function (resolve, reject) {

		rest.put(url, options).on('complete', function(result) {
		  console.log("DATA");
		  console.log(result);
		  return resolve(JSON.parse(result));
		});

    });


}

module.exports = RESTUtils;