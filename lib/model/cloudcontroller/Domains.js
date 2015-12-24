"use strict";

var HttpUtils = require("../../utils/HttpUtils");

/**
 * Manage Domains in Cloud Foundry
 * @param {String} endPoint [CC endpoint]
 * @constructor
 */
function Domains(endPoint) {

    this.API_URL = endPoint;
    this.REST = new HttpUtils();
}

/**
 * Set endpoint
 * @param {String} endPoint [CC endpoint]
 * @returns {void}
 */
Domains.prototype.setEndPoint = function (endPoint) {

    this.API_URL = endPoint;
};

/**
 * Get Domains
 * {@link http://apidocs.cloudfoundry.org/214/domains_(deprecated)/list_all_domains_(deprecated).html}
 * @param  {String} token_type   [Authentication type]
 * @param  {String} access_token [Authentication token]
 * @return {JSON}              [return a JSON response]
 */
Domains.prototype.getDomains = function (token_type, access_token) {

    var url = this.API_URL + "/v2/domains";
    var options = {
        method: "GET",
        url: url,
        headers: {
            Authorization: token_type + " " + access_token
        }
    };

    return this.REST.request(options, "200", true);
};

/**
 * Get shared domains
 * {@link http://apidocs.cloudfoundry.org/214/shared_domains/list_all_shared_domains.html}
 * @param  {String} token_type   [Authentication type]
 * @param  {String} access_token [Authentication token]
 * @return {JSON}              [return a JSON response]
 */
Domains.prototype.getSharedDomains = function (token_type, access_token) {

    var url = this.API_URL + "/v2/shared_domains";
    var options = {
        method: "GET",
        url: url,
        headers: {
            Authorization: token_type + " " + access_token
        }
    };

    return this.REST.request(options, "200", true);
};

module.exports = Domains;