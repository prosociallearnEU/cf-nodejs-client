/*jslint node: true*/
/*globals Promise:true*/
"use strict";

var request = require('request');

function HttpUtils(){

}

HttpUtils.prototype.request = function(method,url,headers,qs,body,httpStatusAssert){

    var result = null;

    return new Promise(function (resolve, reject) {

        try {
            request({ method: method, url: url, headers: headers, qs: qs, form: body  }, function (error, response, body) {
                result = JSON.parse(body);
                //console.log(response.statusCode);
                if (!error && response.statusCode == httpStatusAssert) {
                    return resolve(result);
                } else {
                    return reject(body);
                }
            });
        } catch (ex) {
            result = JSON.parse("Network error");
            return reject(result);            
        }
    });

}

//TODO: Refactor the name. The unique difference in compare with method request is the way to return the value.
//This method return data in text plain, not in JSON format.
HttpUtils.prototype.request2 = function(method,url,headers,qs,body,httpStatusAssert){

    return new Promise(function (resolve, reject) {
        request({ method: method, url: url, headers: headers, qs: qs, form: body  }, function (error, response, body) {
            var result = body;
            //console.log(response.statusCode);
            if (!error && response.statusCode == httpStatusAssert) {
                return resolve(result);
            } else {
                return reject(body);
            }
        });
    });

}

HttpUtils.prototype.DEBUG = function(method,url,headers,qs,body,httpStatusAssert){

    return new Promise(function (resolve, reject) {
        request({ method: method, url: url, headers: headers, qs: qs, form: body  }, function (error, response, body) {
            var result = body;
            console.log(response.statusCode);
            //console.log(response);
            console.log(body);
            return resolve(body);
/*
            if (!error && response.statusCode == "200") {
                return resolve(body);
            } else {
                return reject(body);
            }
            */
        });
    });

}

module.exports = HttpUtils;
