"use strict";

const CloudControllerBase = require("./CloudControllerBase");

/**
 * Manage Events on Cloud Foundry
 */
class Events extends CloudControllerBase {

    /**
     * @param {String} endPoint [CC endpoint]
     * @constructor
     * @returns {void}
     */
    constructor(endPoint) {
        super(endPoint);
    }

    /**
     * Get events from CC
     * {@link http://apidocs.cloudfoundry.org/214/events/list_all_events.html}
     *
     * @param  {JSON} filter [Query String Parameters]
     * @return {JSON}              [return a JSON response]
     */
    getEvents (filter) {

        const url = `${this.API_URL}/v2/events`;
        let qs = {};

        if (filter) {
            qs = filter;
        }
        const options = {
            method: "GET",
            url: url,
            headers: {
                Authorization: `${this.UAA_TOKEN.token_type} ${this.UAA_TOKEN.access_token}`
            },
            qs: qs,
            useQuerystring: true
        };

        return this.REST.request(options, this.HttpCodes.OK, true);
    }

}

module.exports = Events;
