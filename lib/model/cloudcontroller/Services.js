"use strict";

const CloudControllerBase = require("./CloudControllerBase");

/**
 * Manages Services on Cloud Foundry
 */
class Services extends CloudControllerBase {

    /**
     * @param {String} endPoint [CC endpoint]
     * @constructor
     * @returns {void}
     */
    constructor(endPoint) {
        super(endPoint);
    }

    /**
     * Get Services
     * {@link https://apidocs.cloudfoundry.org/226/services/list_all_services.html}
     *
     * @param  {String} filter [query string]
     * @return {JSON}              [return a JSON response]
     */
    getServices (filter) {

        const url = `${this.API_URL}/v2/services`;
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
     * Get a Service
     * {@link https://apidocs.cloudfoundry.org/226/services/retrieve_a_particular_service.html}
     *
     * @param  {String} guid         [servicePlan guid]
     * @return {JSON}              [return a JSON response]
     */
    getService (guid) {

        const url = `${this.API_URL}/v2/services/${guid}`;
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
     * List all Service Plans for a Service
     * {@link https://apidocs.cloudfoundry.org/226/services/list_all_service_plans_for_the_service.html}
     *
     * @param  {String} guid         [service guid]
     * @return {JSON}              [return a JSON response]
     */
    getServicePlans (guid) {

        const url = `${this.API_URL}/v2/services/${guid}/service_plans`;
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
     * Remove a Service
     * {@link https://apidocs.cloudfoundry.org/226/services/delete_a_particular_service.html}
     *
     * @param  {String} guid [service_guid]
     * @return {String}              [return REST response]
     */
    remove (guid) {

        const url = `${this.API_URL}/v2/services/${guid}`;
        const options = {
            method: "DELETE",
            url: url,
            headers: {
                Authorization: `${this.UAA_TOKEN.token_type} ${this.UAA_TOKEN.access_token}`
            }
        };

        return this.REST.request(options, this.HttpStatus.NO_CONTENT, false);
    }

}

module.exports = Services;
