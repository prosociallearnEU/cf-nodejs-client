/*jslint node: true*/

var HttpUtils = require('../utils/HttpUtils');

/**
 * Manages Routes for Cloud Foundry
 * @param {String} endPoint [CC endpoint]
 * @constructor
 */
function Routes(endPoint) {
    "use strict";
    this.API_URL = endPoint;
    this.REST = new HttpUtils();
}

/**
 * Set endpoint
 * @param {String} endPoint [CC endpoint]
 */
Routes.prototype.setEndPoint = function (endPoint) {
    "use strict";
    this.API_URL = endPoint;
};

/**
 * Get Routes
 * {@link http://apidocs.cloudfoundry.org/214/routes/list_all_routes.html}
 *
 * @example
 * Paging: /v2/routes?order-direction=asc&page=2&results-per-page=50
 *
 * qs: {
 *     'page': page,
 *     'results-per-page': 50
 * }
 * @param  {String} token_type   [Authentication type]
 * @param  {String} access_token [Authentication token]
 * @param  {JSON} filter [Search options]
 * @return {JSON}              [return a JSON response]
 */
Routes.prototype.getRoutes = function (token_type, access_token, filter) {
    "use strict";
    var url = this.API_URL + "/v2/routes";
    var qs = {};
    if (filter) {
        qs = filter;
    }
    var options = {
        method: 'GET',
        url: url,
        headers: {
            Authorization: token_type + ' ' + access_token
        },
        qs: qs
    };

    return this.REST.request(options, "200", true);
};

/**
 * Get a Route
 * {@link http://apidocs.cloudfoundry.org/214/routes/retrieve_a_particular_route.html}
 * @param  {String} token_type   [Authentication type]
 * @param  {String} access_token [Authentication token]
 * @param  {String} guid         [route guid]
 * @return {JSON}              [return a JSON response]
 */
Routes.prototype.getRoute = function (token_type, access_token, guid) {
    "use strict";
    var url = this.API_URL + "/v2/routes/" + guid;
    var options = {
        method: 'GET',
        url: url,
        headers: {
            Authorization: token_type + ' ' + access_token
        }
    };

    return this.REST.request(options, "200", true);
};

/**
 * Add a Route
 * {@link http://apidocs.cloudfoundry.org/213/routes/creating_a_route.html}
 * @param  {String} token_type   [Authentication type]
 * @param  {String} access_token [Authentication token]
 * @param  {JSON} routeOptions         [route options]
 * @return {JSON}              [return a JSON response]
 */
Routes.prototype.addRoute = function (token_type, access_token, routeOptions) {
    "use strict";
    var url = this.API_URL + "/v2/routes";
    var options = {
        method: 'POST',
        url: url,
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            Authorization: token_type + ' ' + access_token
        },
        form: JSON.stringify(routeOptions)
    };

    return this.REST.request(options, "201", true);
};

/**
 * Remove a Route
 * {@link http://apidocs.cloudfoundry.org/214/routes/delete_a_particular_route.html}
 * @param  {String} token_type   [Authentication type]
 * @param  {String} access_token [Authentication token]
 * @param  {String} route_guid   [route guid]
 * @return {String}              [output]
 */
Routes.prototype.deleteRoute = function (token_type, access_token, route_guid) {
    "use strict";
    var url = this.API_URL + "/v2/routes/" + route_guid;
    var options = {
        method: 'DELETE',
        url: url,
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            Authorization: token_type + ' ' + access_token
        }
    };

    return this.REST.request(options, "204", false);
};

module.exports = Routes;
