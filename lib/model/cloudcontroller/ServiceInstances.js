"use strict";

const CloudControllerBase = require("./CloudControllerBase");

/**
 * Manages Service Instances on Cloud Foundry
 */
class ServiceInstances extends CloudControllerBase {

    /**
     * @param {String} endPoint [CC endpoint]
     * @constructor
     * @returns {void}
     */
    constructor(endPoint) {
        super(endPoint);
    }

    /**
     * Get Service Instances
     * {@link https://apidocs.cloudfoundry.org/226/service_instances/list_all_service_instances.html}
     *
     * @param  {String} filter [query string]
     * @return {JSON}              [return a JSON response]
     */
    getInstances (filter) {

        const url = `${this.API_URL}/v2/service_instances`;
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
     * Get a Service Instance
     * {@link https://apidocs.cloudfoundry.org/226/service_instances/retrieve_a_particular_service_instance.html}
     *
     * @param  {String} guid         [servicePlan guid]
     * @return {JSON}              [return a JSON response]
     */
    getInstance (guid) {

        const url = `${this.API_URL}/v2/service_instances/${guid}`;
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
     * Get a Service Instance Permissions
     * {@link https://apidocs.cloudfoundry.org/226/service_instances/retrieving_permissions_on_a_service_instance.html}
     *
     * @param  {String} guid         [servicePlan guid]
     * @return {JSON}              [return a JSON response]
     */
    getInstancePermissions (guid) {

        const url = `${this.API_URL}/v2/service_instances/${guid}/permissions`;
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
     * Get a Service Instance Bindings
     * {@link https://apidocs.cloudfoundry.org/226/service_instances/list_all_service_bindings_for_the_service_instance.html}
     *
     * @param  {String} guid         [servicePlan guid]
     * @return {JSON}              [return a JSON response]
     */
    getInstanceBindings (guid) {

        const url = `${this.API_URL}/v2/service_instances/${guid}/service_bindings`;
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
     * Get a Service Instance Routes
     * {@link https://apidocs.cloudfoundry.org/226/service_instances/list_all_routes_for_the_service_instance.html}
     *
     * @param  {String} guid         [servicePlan guid]
     * @return {JSON}              [return a JSON response]
     */
    getInstanceRoutes (guid) {

        const url = `${this.API_URL}/v2/service_instances/${guid}/routes`;
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
     * Create a Service Instance
     * {@link https://apidocs.cloudfoundry.org/226/service_instances/delete_a_service_instance.html}
     *
     * @param  {JSON} appOptions   [options to create the application]
     * @return {JSON}              [return a JSON response]
     */
    create (appOptions) {

        const url = `${this.API_URL}/v2/service_instances`;
        const options = {
            method: "POST",
            url: url,
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                Authorization: `${this.UAA_TOKEN.token_type} ${this.UAA_TOKEN.access_token}`
            },
            form: JSON.stringify(appOptions)
        };

        return this.REST.request(options, this.HttpStatus.CREATED, true);
    }

    /**
     * Remove a Service Instance
     * {@link https://apidocs.cloudfoundry.org/226/service_instances/delete_a_service_instance.html}
     *
     * @param  {String} guid [Service Instance guid]
     * @return {JSON}              [return a JSON response]
     */
    remove (guid) {

        const url = `${this.API_URL}/v2/service_instances/${guid}`;
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

module.exports = ServiceInstances;
