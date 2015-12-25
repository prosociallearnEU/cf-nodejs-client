"use strict";

const CloudControllerBase = require("./CloudControllerBase");

/**
 * Manages Routes on Cloud Foundry
 */
class Routes extends CloudControllerBase {

    /**
     * @param {String} endPoint [CC endpoint]
     * @constructor
     * @returns {void}
     */
    constructor(endPoint) {
        super(endPoint);
    }

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
     *
     * @param  {String} token_type   [Authentication type]
     * @param  {String} access_token [Authentication token]
     * @param  {JSON} filter [Search options]
     * @return {JSON}              [return a JSON response]
     */
    getRoutes (token_type, access_token, filter) {

        const url = this.API_URL + "/v2/routes";
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
            qs: qs
        };

        return this.REST.request(options, "200", true);
    }

    /**
     * Get a Route
     * {@link http://apidocs.cloudfoundry.org/214/routes/retrieve_a_particular_route.html}
     * @param  {String} token_type   [Authentication type]
     * @param  {String} access_token [Authentication token]
     * @param  {String} guid         [route guid]
     * @return {JSON}              [return a JSON response]
     */
    getRoute (token_type, access_token, guid) {

        const url = this.API_URL + "/v2/routes/" + guid;
        const options = {
            method: "GET",
            url: url,
            headers: {
                Authorization: token_type + " " + access_token
            }
        };

        return this.REST.request(options, "200", true);
    }

    /**
     * Add a Route
     * {@link http://apidocs.cloudfoundry.org/213/routes/creating_a_route.html}
     * @param  {String} token_type   [Authentication type]
     * @param  {String} access_token [Authentication token]
     * @param  {JSON} routeOptions         [route options]
     * @return {JSON}              [return a JSON response]
     */
    add (token_type, access_token, routeOptions) {

        const url = this.API_URL + "/v2/routes";
        const options = {
            method: "POST",
            url: url,
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                Authorization: token_type + " " + access_token
            },
            form: JSON.stringify(routeOptions)
        };

        return this.REST.request(options, "201", true);
    }

    /**
     * Remove a Route
     * {@link http://apidocs.cloudfoundry.org/214/routes/delete_a_particular_route.html}
     * @param  {String} token_type   [Authentication type]
     * @param  {String} access_token [Authentication token]
     * @param  {String} route_guid   [route guid]
     * @return {String}              [output]
     */
    remove (token_type, access_token, route_guid) {

        const url = this.API_URL + "/v2/routes/" + route_guid;
        const options = {
            method: "DELETE",
            url: url,
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                Authorization: token_type + " " + access_token
            }
        };

        return this.REST.request(options, "204", false);
    }

}

module.exports = Routes;
