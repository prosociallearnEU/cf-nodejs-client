/*jslint node: true*/
/*globals Promise:true*/
"use strict";

var request = require('request');

function HttpUtils(){

}

HttpUtils.prototype.get = function(url,headers,body){

    return new Promise(function (resolve, reject) {
        request.get({ url: url, headers: headers, form: body }, function (error, response, body) {
            var result = JSON.parse(body);
            if (!error && response.statusCode == 200) {
                return resolve(result);
            } else {
                return reject(body);
            }
        });
    }); 

}

HttpUtils.prototype.post = function(url,headers,body){

    return new Promise(function (resolve, reject) {
        request.post({ url: url, headers: headers, form: body  }, function (error, response, body) {
            var result = JSON.parse(body);
            if (!error && response.statusCode == 200) {
                return resolve(result);
            } else {
                return reject(body);
            }
        });
    });

}

HttpUtils.prototype.put = function(url,headers,body){

    return new Promise(function (resolve, reject) {
        request.put({ url: url, headers: headers, form: body  }, function (error, response, body) {
            var result = JSON.parse(body);
            console.log(response.statusCode);
            if (!error && response.statusCode == 200) {
                return resolve(result);
            } else {
                return reject(body);
            }
        });
    });

}

HttpUtils.prototype.del = function(url,headers,body){

    return new Promise(function (resolve, reject) {
        request.del({ url: url, headers: headers, form: body  }, function (error, response, body) {
            var result = body;//JSON.parse(body);
            //console.log(response.statusCode);
            if (!error && response.statusCode == 204) {
                return resolve(result);
            } else {
                return reject(body);
            }
        });
    });
}

HttpUtils.prototype.request = function(method,url,headers,qs,body,httpStatusAssert){

    return new Promise(function (resolve, reject) {
        request({ method: method, url: url, headers: headers, qs: qs, form: body  }, function (error, response, body) {
            var result = JSON.parse(body);
            console.log(response.statusCode);
            if (!error && response.statusCode == httpStatusAssert) {
                return resolve(result);
            } else {
                return reject(body);
            }
        });
    });

}

module.exports = HttpUtils;