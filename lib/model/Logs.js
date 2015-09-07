/*jslint node: true*/
/*globals Promise:true*/
"use strict";

var HttpUtils = require('../utils/HttpUtils');

function Logs() {
    this.REST = new HttpUtils();
    this.logging_endpoint = null;
}

/**
 * @param {url}
 */
Logs.prototype.setEndpoint = function (logging_endpoint) {
    this.logging_endpoint = logging_endpoint;
};

/**
 * Method used to return data from CF log services.
 * http://docs.run.pivotal.io/devguide/deploy-apps/streaming-logs.html
 * 
 * @param  {[type]}
 * @param  {[type]}
 * @param  {[type]}
 * @return {[type]}
 */
Logs.prototype.getRecent = function (token_type, access_token, app_guid) {

    var url = this.logging_endpoint + '/recent?app=' + app_guid;
    var options = {
        url: url,
        headers: {
            'Authorization': token_type + ' ' + access_token
        }
    };
    var self = this;

    return this.REST.request(options, "200", false).then(function (result) {
        return new Promise(function (resolve) {
            return resolve(self.cleanResult(result));
        });
    });
};

/**
 * Improve the output from recent method.
 * 
 * @param  {[type]}
 * @return {[type]}
 */
Logs.prototype.cleanResult = function (data) {
    data = data.split('\n\n');
    if (data.length > 1) {
        data.splice(0, 1);
    }
    var i = 0;
    var value = null;
    var end = null;
    for (i = 0; i < data.length; i++) {
        value = data[i];
        value = value.substr(2, value.length - 1);
        end = value.indexOf(String.fromCharCode(16));
        data[i] = value.substr(0, end);
    }
    return data.join('\n\n');
};

module.exports = Logs;