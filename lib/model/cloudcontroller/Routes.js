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
     * @param  {JSON} filter [Search options]
     * @return {JSON}              [return a JSON response]
     */
    getRoutes (filter) {

        const url = `${this.API_URL}/v2/routes`;
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
            qs: qs
        };

        return this.REST.request(options, this.HttpStatus.OK, true);
    }

    /**
     * Get a Route
     * {@link http://apidocs.cloudfoundry.org/214/routes/retrieve_a_particular_route.html}
     *
     * @param  {String} guid         [route guid]
     * @return {JSON}              [return a JSON response]
     */
    getRoute (guid) {

        const url = `${this.API_URL}/v2/routes/${guid}`;
        const options = {
            method: "GET",
            url: url,
            headers: {
                Authorization: `${this.UAA_TOKEN.token_type} ${this.UAA_TOKEN.access_token}`
            }
        };

        return this.REST.request(options, this.HttpStatus.OK, true);
    }

    /**
     * Add a Route
     * {@link http://apidocs.cloudfoundry.org/213/routes/creating_a_route.html}
     *
     * @param  {JSON} routeOptions         [route options]
     * @return {JSON}              [return a JSON response]
     */
    add (routeOptions) {

        const url = `${this.API_URL}/v2/routes`;
        const options = {
            method: "POST",
            url: url,
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                Authorization: `${this.UAA_TOKEN.token_type} ${this.UAA_TOKEN.access_token}`
            },
            form: JSON.stringify(routeOptions)
        };

        return this.REST.request(options, this.HttpStatus.CREATED, true);
    }

    /**
     * Remove a Route
     * {@link http://apidocs.cloudfoundry.org/214/routes/delete_a_particular_route.html}
     *
     * @param  {String} guid   [route guid]
     * @return {String}              [output]
     */
    remove (guid) {

        const url = `${this.API_URL}/v2/routes/${guid}`;
        const options = {
            method: "DELETE",
            url: url,
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                Authorization: `${this.UAA_TOKEN.token_type} ${this.UAA_TOKEN.access_token}`
            }
        };

        return this.REST.request(options, this.HttpStatus.NO_CONTENT, false);
    }

    /**
     * Check to see if a route exists
     * {@link http://apidocs.cloudfoundry.org/214/routes/check_a_route_exists.html}
     *
     * @param  {String} domainGuid      [domain guid]
     * @param  {String} hostname        [hostname]
     * @return {String}                 [output]
     */
    exists (domainGuid, hostname) {
        const url = `${this.API_URL}/routes/reserved/domain/${domainGuid}/host/${hostname}?path=/apps/v1/path`;
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

module.exports = Routes;
