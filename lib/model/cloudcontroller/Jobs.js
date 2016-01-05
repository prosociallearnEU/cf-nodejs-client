"use strict";

const CloudControllerBase = require("./CloudControllerBase");

/**
 * Manage Jobs on Cloud Foundry
 */
class Jobs extends CloudControllerBase {

    /**
     * @param {String} endPoint [CC endpoint]
     * @constructor
     * @returns {void}
     */
    constructor(endPoint) {
        super(endPoint);
    }

    /**
     * Get a determinated Job
     * {@link http://apidocs.cloudfoundry.org/214/jobs/retrieve_job_that_is_queued.html}
     *
     * @param  {String} guid     [job guid]
     * @return {JSON}              [return a JSON response]
     */
    getJob (guid) {

        const url = `${this.API_URL}/v2/jobs/${guid}`;
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

module.exports = Jobs;
