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
     *
     * @return {JSON}              [return a JSON response]
     */
    getDomains () {

        const url = `${this.API_URL}/v2/domains`;
        const options = {
            method: "GET",
            url: url,
            headers: {
                Authorization: `${this.UAA_TOKEN.token_type} ${this.UAA_TOKEN.access_token}`
            }
        };

        return this.REST.request(options, this.HttpStatus.OK, true);
    }

    /**
     * Get shared domains
     * {@link http://apidocs.cloudfoundry.org/214/shared_domains/list_all_shared_domains.html}
     *
     * @return {JSON}              [return a JSON response]
     */
    getSharedDomains () {

        const url = `${this.API_URL}/v2/shared_domains`;
        const options = {
            method: "GET",
            url: url,
            headers: {
                Authorization: `${this.UAA_TOKEN.token_type} ${this.UAA_TOKEN.access_token}`
            }
        };

        return this.REST.request(options, this.HttpStatus.OK, true);
    }

}

module.exports = Domains;