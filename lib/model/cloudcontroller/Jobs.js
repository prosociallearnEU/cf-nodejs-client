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
     * @param  {String} token_type   [Authentication type]
     * @param  {String} access_token [Authentication token]
     * @param  {String} job_guid     [job guid]
     * @return {JSON}              [return a JSON response]
     */
    getJob (token_type, access_token, job_guid) {

        const url = this.API_URL + "/v2/jobs/" + job_guid;
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

module.exports = Jobs;
