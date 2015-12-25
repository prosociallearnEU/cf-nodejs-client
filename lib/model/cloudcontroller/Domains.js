"use strict";

const CloudControllerBase = require("./CloudControllerBase");

/**
 * Manage Domains on Cloud Foundry
 */
class Domains extends CloudControllerBase {

    /**
     * @param {String} endPoint [CC endpoint]
     * @constructor
     * @returns {void}
     */
    constructor(endPoint) {
        super(endPoint);
    }

    /**
     * Get Domains
     * {@link http://apidocs.cloudfoundry.org/214/domains_(deprecated)/list_all_domains_(deprecated).html}
     * @param  {String} token_type   [Authentication type]
     * @param  {String} access_token [Authentication token]
     * @return {JSON}              [return a JSON response]
     */
    getDomains (token_type, access_token) {

        const url = this.API_URL + "/v2/domains";
        const options = {
            method: "GET",
            url: url,
            headers: {
                Authorization: token_type + " " + access_token
            }
        };

        return this.REST.request(options, "200", true);
    }

    /**
     * Get shared domains
     * {@link http://apidocs.cloudfoundry.org/214/shared_domains/list_all_shared_domains.html}
     * @param  {String} token_type   [Authentication type]
     * @param  {String} access_token [Authentication token]
     * @return {JSON}              [return a JSON response]
     */
    getSharedDomains (token_type, access_token) {

        const url = this.API_URL + "/v2/shared_domains";
        const options = {
            method: "GET",
            url: url,
            headers: {
                Authorization: token_type + " " + access_token
            }
        };

        return this.REST.request(options, "200", true);
    }

}

module.exports = Domains;