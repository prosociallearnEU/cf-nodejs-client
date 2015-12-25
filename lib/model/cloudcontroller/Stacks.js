"use strict";

const CloudControllerBase = require("./CloudControllerBase");

/**
 * Manage Stacks
 */
class Stacks extends CloudControllerBase {

    /**
     * @param {String} endPoint [CC endpoint]
     * @constructor
     * @returns {void}
     */
    constructor(endPoint) {
        super(endPoint);
    }

    /**
     * Get Stacks
     * {@link http://apidocs.cloudfoundry.org/214/stacks/list_all_stacks.html}
     *
     * @param  {String} token_type   [Authentication type]
     * @param  {String} access_token [Authentication token]
     * @return {JSON}              [return a JSON response]
     */
    getStacks (token_type, access_token) {

        const url = this.API_URL + "/v2/stacks";
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

module.exports = Stacks;