"use strict";

var HttpUtils = require("../../utils/HttpUtils");

/**
 * Manage Events in Cloud Foundry
 * @param {String} endPoint [CC endpoint]
 * @constructor
 */
function Events(endPoint) {

    this.API_URL = endPoint;
    this.REST = new HttpUtils();
}

/**
 * Set endpoint
 * @param {String} endPoint [CC endpoint]
 * @returns {void}
 */
Events.prototype.setEndPoint = function (endPoint) {

    this.API_URL = endPoint;
};

/**
 * Get events from CC
 * {@link http://apidocs.cloudfoundry.org/214/events/list_all_events.html}
 * @param  {String} token_type   [Authentication type]
 * @param  {String} access_token [Authentication token]
 * @param  {JSON} filter [Query String Parameters]
 * @return {JSON}              [return a JSON response]
 */
Events.prototype.getEvents = function (token_type, access_token, filter) {

    var qs = {};

    if (filter) {
        qs = filter;
    }
    var url = this.API_URL + "/v2/events";
    var options = {
        method: "GET",
        url: url,
        headers: {
            Authorization: token_type + " " + access_token
        },
        qs: qs,
        useQuerystring: true
    };

    return this.REST.request(options, "200", true);
};

module.exports = Events;
