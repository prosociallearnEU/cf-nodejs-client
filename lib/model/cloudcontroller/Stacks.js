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
     * @return {JSON}              [return a JSON response]
     */
    getStacks () {

        const url = `${this.API_URL}/v2/stacks`;
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

module.exports = Stacks;