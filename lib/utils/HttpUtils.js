/*jslint node: true*/
/*globals Promise:true*/
"use strict";

var request = require('request');

function HttpUtils(){

}

HttpUtils.prototype.request = function(options,httpStatusAssert,jsonOutput){

    var result = null;

    return new Promise(function (resolve, reject) {

        request(options, function (error, response, body) {
            if(error){
                return reject(error);
            }

            if(jsonOutput){
                result = JSON.parse(body);
            }else{
                result = body;
            }

            //console.log(response.statusCode);
            if (!error && response.statusCode == httpStatusAssert) {
                return resolve(result);
            } else {
                return reject(body);
            }
        });

    });

}

module.exports = HttpUtils;
