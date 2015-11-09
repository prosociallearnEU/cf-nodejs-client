/*jslint node: true */

var HttpUtils = require('../utils/HttpUtils');

/**
 * Manage Events in Cloud Foundry
 * @param {String} endPoint [CC endpoint]
 * @constructor
 */
function Events(endPoint) {
    "use strict";
    this.API_URL = endPoint;
    this.REST = new HttpUtils();
}

/**
 * Set endpoint
 * @param {String} endPoint [CC endpoint]
 */
Events.prototype.setEndPoint = function (endPoint) {
    "use strict";
    this.API_URL = endPoint;
};

/**
 * Get events from CC
 * {@link http://apidocs.cloudfoundry.org/214/events/list_all_events.html}
 * @param  {String} token_type   [Authentication type]
 * @param  {String} access_token [Authentication token]
 * @param  {Object} events_options [Query String Parameters]
 * @return {JSON}              [return a JSON response]
 */
Events.prototype.getEvents = function (token_type, access_token, event_options) {
    "use strict";

    var qs = {
      'results-per-page': 10
    };

    if (event_options) {
      qs = event_options;
    }

    var url = this.API_URL + "/v2/events";
    var options = {
        method: 'GET',
        url: url,
        headers: {
            Authorization: token_type + ' ' + access_token
        },
        qs: qs,
        useQuerystring: true
    };

    return this.REST.request(options, "200", true);
};

module.exports = Events;
