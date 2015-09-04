/*jslint node: true*/
/*globals Promise:true*/
"use strict";

var request = require('request');
var rest = require('restler');
var fs = require('fs');

/**
 * Constructor
 */
function HttpUtils() {
    return undefined;
}

/**
 * Request
 * 
 * @param  {json}
 * @param  {string}
 * @param  {boolean}
 * @return {promise}
 */
HttpUtils.prototype.request = function (options, httpStatusAssert, jsonOutput) {

    var result = null;

    //process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
    var requestWithDefaults = request.defaults({
        rejectUnauthorized: false
    });

    return new Promise(function (resolve, reject) {

        try {

            requestWithDefaults(options, function (error, response, body) {
                if (error) {
                    return reject(error);
                }

                if (jsonOutput) {
                    result = JSON.parse(body);
                } else {
                    result = body;
                }

                //console.log(response.statusCode);
                if (!error && response.statusCode == httpStatusAssert) {
                    return resolve(result);
                } else {
                    return reject(body);
                }
            });

        } catch (error) {
            return reject(error);
        }

    });

};

/**
 * @param  {string}
 * @param  {json}
 * @param  {string}
 * @param  {boolean}
 * @return {Promise}
 */
HttpUtils.prototype.upload = function (url, options, httpStatusAssert, jsonOutput) {

    return new Promise(function (resolve, reject) {

        rest.put(url, options).on('complete', function (result, response) {
            if (result instanceof Error) {
                reject(result);
            }

            if (response.statusCode == httpStatusAssert) {

                if (jsonOutput) {
                    return resolve(JSON.parse(result));
                }else {
                    return resolve(result);
                }

            }
        });

    });
};

module.exports = HttpUtils;
