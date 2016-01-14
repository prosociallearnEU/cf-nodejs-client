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
     *
     * @param  {String} filter         [Search option]
     * @return {JSON}              [return a JSON response]
     */
    getServiceBindings (filter) {

        const url = `${this.API_URL}/v2/service_bindings`;
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
     * Get a Service Binding
     * {@link http://apidocs.cloudfoundry.org/217/service_bindings/retrieve_a_particular_service_binding.html}
     *
     * @param  {String} guid         [serviceBinding guid]
     * @return {JSON}              [return a JSON response]
     */
    getServiceBinding (guid) {

        const url = `${this.API_URL}/v2/service_bindings/${guid}`;
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
     * Associate Service with an App
     * {@link http://apidocs.cloudfoundry.org/217/service_bindings/create_a_service_binding.html}
     *
     * @param  {String} serviceGuid [service_guid]
     * @param  {String} appGuid     [app_guid]
     * @return {JSON}              [return a JSON response]
     */
    associateServiceWithApp (serviceGuid, appGuid) {

        const url = `${this.API_URL}/v2/service_bindings`;
        const options = {
            method: "POST",
            url: url,
            headers: {
                Authorization: `${this.UAA_TOKEN.token_type} ${this.UAA_TOKEN.access_token}`
            },
            form: JSON.stringify({
                service_instance_guid: serviceGuid,
                app_guid: appGuid
            })
        };

        return this.REST.request(options, this.HttpStatus.CREATED, true);
    }

    /**
     * Remove  a Service Binding
     * {@link http://apidocs.cloudfoundry.org/217/service_bindings/delete_a_particular_service_binding.html}
     *
     * @param  {String} guid [service_guid]
     * @return {JSON}              [return a JSON response]
     */
    remove (guid) {

        const url = `${this.API_URL}/v2/service_bindings/${guid}`;
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

module.exports = ServiceBindings;
