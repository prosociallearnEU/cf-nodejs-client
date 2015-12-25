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
     * @param  {String} token_type   [Authentication type]
     * @param  {String} access_token [Authentication token]
     * @param  {JSON} filter [Query String Parameters]
     * @return {JSON}              [return a JSON response]
     */
    getEvents (token_type, access_token, filter) {

        const url = this.API_URL + "/v2/events";
        let qs = {};

        if (filter) {
            qs = filter;
        }
        const options = {
            method: "GET",
            url: url,
            headers: {
                Authorization: token_type + " " + access_token
            },
            qs: qs,
            useQuerystring: true
        };

        return this.REST.request(options, "200", true);
    }

}

module.exports = Events;
