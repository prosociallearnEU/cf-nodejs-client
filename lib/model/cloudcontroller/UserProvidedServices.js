"use strict";

const CloudControllerBase = require("./CloudControllerBase");

/**
 * Manage User Provided Services
 * {@link https://docs.cloudfoundry.org/devguide/services/user-provided.html}
 */
class UserProvidedServices extends CloudControllerBase {

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
     * {@link http://apidocs.cloudfoundry.org/217/user_provided_service_instances/list_all_user_provided_service_instances.html}
     *
     * @return {JSON}              [return a JSON response]
     */
    getServices () {

        const url = `${this.API_URL}/v2/user_provided_service_instances`;
        const options = {
            method: "GET",
            url: url,
            headers: {
                Authorization: `${this.UAA_TOKEN.token_type} ${this.UAA_TOKEN.access_token}`
            }
        };

        return this.REST.request(options, this.HttpCodes.OK, true);
    }

    /**
     * Get a Service
     * {@link http://apidocs.cloudfoundry.org/217/user_provided_service_instances/retrieve_a_particular_user_provided_service_instance.html}
     *
     * @param  {String} guid [Service guid]
     * @return {JSON}              [return a JSON response]
     */
    getService (guid) {

        const url = `${this.API_URL}/v2/user_provided_service_instances/${guid}`;
        const options = {
            method: "GET",
            url: url,
            headers: {
                Authorization: `${this.UAA_TOKEN.token_type} ${this.UAA_TOKEN.access_token}`
            }
        };

        return this.REST.request(options, this.HttpCodes.OK, true);
    }

    /**
     * Create an user Provided Service
     * {@link http://apidocs.cloudfoundry.org/217/user_provided_service_instances/creating_a_user_provided_service_instance.html}
     *
     * @param  {JSON} upsOptions [user_provided_service_options]
     * @return {JSON}              [return a JSON response]
     */
    add (upsOptions) {

        const url = `${this.API_URL}/v2/user_provided_service_instances`;
        const options = {
            method: "POST",
            url: url,
            headers: {
                Authorization: `${this.UAA_TOKEN.token_type} ${this.UAA_TOKEN.access_token}`
            },
            form: JSON.stringify(upsOptions)
        };

        return this.REST.request(options, this.HttpCodes.CREATED, true);
    }

    /**
     * Remove an User provided service
     * {@link http://apidocs.cloudfoundry.org/217/user_provided_service_instances/delete_a_particular_user_provided_service_instance.html}
     *
     * @param  {String} guid [service_guid]
     * @return {String}              [output]
     */
    remove (guid) {

        const url = `${this.API_URL}/v2/user_provided_service_instances/${guid}`;
        const options = {
            method: "DELETE",
            url: url,
            headers: {
                Authorization: `${this.UAA_TOKEN.token_type} ${this.UAA_TOKEN.access_token}`
            }
        };

        return this.REST.request(options, this.HttpCodes.NO_CONTENT, false);
    }

    /**
     * Get service bindings from user provided services
     * {@link http://apidocs.cloudfoundry.org/221/user_provided_service_instances/list_all_service_bindings_for_the_user_provided_service_instance.html}
     *
     * @example
     * var filter = {
     *     q': 'app_guid:' + "65be2a2d-a643-4e01-b33d-8755d5934ae6"
     * };
     *
     * @param  {String} guid [service_guid]
     * @param  {JSON} filter       [search options]
     * @return {JSON}              [Output]
     */
    getServiceBindings (guid, filter) {

        const url = `${this.API_URL}/v2/user_provided_service_instances/${guid}/service_bindings`;
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

        return this.REST.request(options, this.HttpCodes.OK, true);
    }

}

module.exports = UserProvidedServices;
