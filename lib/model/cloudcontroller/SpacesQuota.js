"use strict";

const CloudControllerBase = require("./CloudControllerBase");

/**
 * Manage SpacesQuota
 */
class SpacesQuota extends CloudControllerBase {

    /**
     * @param {String} endPoint [CC endpoint]
     * @constructor
     * @returns {void}
     */
    constructor(endPoint) {
        super(endPoint);
    }

    /**
     * Get Quota Definitions
     * {@link http://apidocs.cloudfoundry.org/214/space_quota_definitions/list_all_space_quota_definitions.html}
     *
     * @return {JSON}              [return a JSON response]
     */
    getQuotaDefinitions () {

        const url = `${this.API_URL}/v2/space_quota_definitions`;
        const options = {
            method: "GET",
            url: url,
            headers: {
                Authorization: `${this.UAA_TOKEN.token_type} ${this.UAA_TOKEN.access_token}`
            }
        };

        return this.REST.request(options, this.HttpCodes.OK, true);
    }

}

module.exports = SpacesQuota;
