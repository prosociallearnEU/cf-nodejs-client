"use strict";

const CloudControllerBase = require("./CloudControllerBase");

/**
 * Manages Service Binding on Cloud Foundry
 */
class ServiceBindings extends CloudControllerBase {

    /**
     * @param {String} endPoint [CC endpoint]
     * @constructor
     * @returns {void}
     */
    constructor(endPoint) {
        super(endPoint);
    }

    /**
     * Get Service Bindings
     * {@link http://apidocs.cloudfoundry.org/217/service_bindings/list_all_service_bindings.html}
     * @param  {String} token_type   [Authentication type]
     * @param  {String} access_token [Authentication token]
     * @param  {String} filter         [Search option]
     * @return {JSON}              [return a JSON response]
     */
    getServiceBindings (token_type, access_token, filter) {

        const url = this.API_URL + "/v2/service_bindings";
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
     * Get a Service Binding
     * {@link http://apidocs.cloudfoundry.org/217/service_bindings/retrieve_a_particular_service_binding.html}
     * @param  {String} token_type   [Authentication type]
     * @param  {String} access_token [Authentication token]
     * @param  {String} serviceBinding_guid         [serviceBinding guid]
     * @return {JSON}              [return a JSON response]
     */
    getServiceBinding (token_type, access_token, serviceBinding_guid) {

        const url = this.API_URL + "/v2/service_bindings/" + serviceBinding_guid;
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
     * Associate Service with an App
     * {@link http://apidocs.cloudfoundry.org/217/service_bindings/create_a_service_binding.html}
     * @param  {String} token_type   [Authentication type]
     * @param  {String} access_token [Authentication token]
     * @param  {String} service_guid [service_guid]
     * @param  {String} app_guid     [app_guid]
     * @return {JSON}              [return a JSON response]
     */
    associateServiceWithApp (token_type, access_token, service_guid, app_guid) {

        const url = this.API_URL + "/v2/service_bindings";
        const options = {
            method: "POST",
            url: url,
            headers: {
                Authorization: token_type + " " + access_token
            },
            form: JSON.stringify({
                service_instance_guid: service_guid,
                app_guid: app_guid
            })
        };

        return this.REST.request(options, "201", true);
    }

    /**
     * Remove  a Service Binding
     * {@link http://apidocs.cloudfoundry.org/217/service_bindings/delete_a_particular_service_binding.html}
     * @param  {String} token_type   [Authentication type]
     * @param  {String} access_token [Authentication token]
     * @param  {String} service_guid [service_guid]
     * @return {JSON}              [return a JSON response]
     */
    remove (token_type, access_token, service_guid) {

        const url = this.API_URL + "/v2/service_bindings/" + service_guid;
        const options = {
            method: "DELETE",
            url: url,
            headers: {
                Authorization: token_type + " " + access_token
            }
        };

        return this.REST.request(options, "204 ", false);
    }

}

module.exports = ServiceBindings;
