/*jslint node: true */
/*globals Promise:true */
"use strict";

var HttpUtils = require('../utils/HttpUtils');

function Events(_API_URL) {
    this.API_URL = _API_URL;
    this.REST = new HttpUtils();
}

/**
 * http://apidocs.cloudfoundry.org/214/events/list_all_events.html
 * 
 * @param  {[type]} token_type   [description]
 * @param  {[type]} access_token [description]
 * @return {[type]}              [description]
 */
Events.prototype.getEvents = function (token_type, access_token) {

    var url = this.API_URL + "/v2/events";
    var options = {
        method: 'GET',
        url: url,
        headers: {
            'Authorization': token_type + ' ' + access_token
        },
        qs: {
            'results-per-page': 10
        }
    };

    return this.REST.request(options, "200", true);
};

module.exports = Events;
