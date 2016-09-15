"use strict";

const CloudControllerBase = require("./CloudControllerBase");

/**
 * Manages Service Binding on Cloud Foundry
 */
class ServiceKeys extends CloudControllerBase {

    /**
     * @param {String} endPoint [CC endpoint]
     * @constructor
     * @returns {void}
     */
    constructor(endPoint) {
        super(endPoint);
    }

    /**
     * Get Service Keys
     *
     * @param  {String} filter [Search option]
     * @return {JSON}          [return a JSON response]
     */
    getServiceKeys (filter) {
        const url = `${this.API_URL}/v2/service_keys`;
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
     * Get a Service Key
     *
     * @param  {String} guid [serviceBinding guid]
     * @return {JSON}        [return a JSON response]
     */
    getServiceKey (guid) {
        const url = `${this.API_URL}/v2/service_keys/${guid}`;
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
     * Create a Service Key
     *
     * @param  {String} serviceGuid [service_guid]
     * @param  {String} name        [name]
     * @return {JSON}               [return a JSON response]
     */
    create (serviceGuid, name) {
        const url = `${this.API_URL}/v2/service_keys`;
        const options = {
            method: "POST",
            url: url,
            headers: {
                Authorization: `${this.UAA_TOKEN.token_type} ${this.UAA_TOKEN.access_token}`
            },
            form: JSON.stringify({
                service_instance_guid: serviceGuid,
                name: name
            })
        };

        return this.REST.request(options, this.HttpStatus.CREATED, true);
    }

    /**
     * Remove a Service Key
     * {@link http://apidocs.cloudfoundry.org/240/service_keys/delete_a_particular_service_key.html}
     *
     * @param  {String} guid [service_guid]
     * @return {JSON}        [return a JSON response]
     */
    remove (guid) {
        const url = `${this.API_URL}/v2/service_keys/${guid}`;
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

module.exports = ServiceKeys;
