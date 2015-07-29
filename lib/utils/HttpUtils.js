/*jslint node: true*/
/*globals Promise:true*/
"use strict";

//TODO: Check if exist another way.
var request = require('request');

/**
 * [HttpUtils description]
 */
function HttpUtils(){

}

/**
 * [get description]
 * @param  {[type]} url     [description]
 * @param  {[type]} headers [description]
 * @param  {[type]} body    [description]
 * @return {[type]}         [description]
 */
HttpUtils.prototype.get = function(url,headers,body){

    return new Promise(function (resolve, reject) {
        request.get({ url: url, headers: headers, form: body }, function (error, response, body) {
            var result = JSON.parse(body);
            if (!error && response.statusCode == 200) {
                return resolve(result);
            } else {
                return reject(result);
            }
        });
    }); 

}

/**
 * [post description]
 * @param  {[type]} url     [description]
 * @param  {[type]} headers [description]
 * @param  {[type]} body    [description]
 * @return {[type]}         [description]
 */
HttpUtils.prototype.post = function(url,headers,body){

    return new Promise(function (resolve, reject) {
        request.post({ url: url, headers: headers, form: body  }, function (error, response, body) {
            var result = JSON.parse(body);
            if (!error && response.statusCode == 200) {
                return resolve(result);
            } else {
                return reject(result);
            }
        });
    });

}

module.exports = HttpUtils;