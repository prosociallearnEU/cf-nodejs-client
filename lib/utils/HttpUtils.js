/*jslint node: true*/

var Promise = require('bluebird');
var request = require('request');
var rest = require('restler');

/**
 * HttpUtils is a private class designed manage REST operations with
 * Cloud Foundry components (Cloud controller, UAA, Metrics).
 * It is used by all classes of project.
 * @constructor
 */
function HttpUtils() {
    "use strict";
    return undefined;
}

/**
 * Stablish a http communications using REST Verbs: GET/POST/PUT/DELETE
 *
 * @param  {json} options          [define options to make the request with the CF component]
 * @param  {number} httpStatusAssert [set expected http status code (200,201,204, etc...)]
 * @param  {boolan} jsonOutput       [if the REST method retuns a String or a JSON representation]
 * @return {string}                  [JSON/String]
 *
 * @example
 * var url = "https://api.run.pivotal.io/v2/info";
 *       var options = {
 *           method: 'GET',
 *           url: url
 *       };
 * HttpUtils.request(options, "200", true);
 */
HttpUtils.prototype.request = function (options, httpStatusAssert, jsonOutput) {
    "use strict";
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
                    try {
                        result = JSON.parse(body);
                    } catch (error) {
                        return reject(body);
                    }
                } else {
                    result = body;
                }

                if (!error && response.statusCode == httpStatusAssert) {
                    return resolve(result);
                } else {
                    if (body.length === 0) {
                        return reject("EMPTY_BODY");
                    }
                    return reject(body);
                }
            });

        } catch (error) {
            return reject(error);
        }

    });

};

/**
 * Method designed to upload zip file to Cloud Controller.
 * It is the unique usage of Restler dependency.
 *
 * @param  {string} url              [url]
 * @param  {json} options          [options]
 * @param  {number} httpStatusAssert [set expected http status code (200,201,204, etc...)]
 * @param  {boolan} jsonOutput       [if the REST method retuns a String or a JSON representation]
 * @return {string}                  [JSON/String]
 */
HttpUtils.prototype.upload = function (url, options, httpStatusAssert, jsonOutput) {
    "use strict";

    return new Promise(function (resolve, reject) {

        try {

            rest.put(url, options).on('complete', function (result, response) {
                if (result instanceof Error) {
                    reject(result);
                }

                if (response.statusCode == httpStatusAssert) {

                    if (jsonOutput) {
                        return resolve(JSON.parse(result));
                    } else {
                        return resolve(result);
                    }

                }
            });

        } catch (error) {
            return reject(error);
        }

    });
};

module.exports = HttpUtils;
