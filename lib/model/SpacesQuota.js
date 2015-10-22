/*jslint node: true*/
/*globals Promise:true*/
"use strict";

var HttpUtils = require('../utils/HttpUtils');

function SpacesQuota(_API_URL) {
    this.API_URL = _API_URL;
    this.REST = new HttpUtils();
}

/**
 * [setEndpoint description]
 * 
 * @param {[type]} _API_URL [description]
 */
SpacesQuota.prototype.setEndPoint = function (_API_URL) {
    this.API_URL = _API_URL;
};

SpacesQuota.prototype.quotaDefinitions = function (token_type, access_token) {

    var url = this.API_URL + "/v2/space_quota_definitions";
    var options = {
        method: 'GET',
        url: url,
        headers: {
            'Authorization': token_type + ' ' + access_token
        }
    };
    return this.REST.request(options, "200", true);
};

module.exports = SpacesQuota;
