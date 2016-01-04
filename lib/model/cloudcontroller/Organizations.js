"use strict";

const CloudControllerBase = require("./CloudControllerBase");

/**
 * Manage Organizations in Cloud Foundry
 */
class Organizations extends CloudControllerBase {

    /**
     * @param {String} endPoint [CC endpoint]
     * @constructor
     * @returns {void}
     */
    constructor(endPoint) {
        super(endPoint);
    }

    /**
     * Get Organizations
     * {@link http://apidocs.cloudfoundry.org/213/organizations/list_all_organizations.html}
     *
     * @param  {String} token_type   [Authentication type]
     * @param  {String} access_token [Authentication token]
     * @return {JSON}              [return a JSON response]
     */
    getOrganizations () {

        const url = `${this.API_URL}/v2/organizations`;
        const options = {
            method: "GET",
            url: url,
            headers: {
                Authorization: `${this.UAA_TOKEN.token_type} ${this.UAA_TOKEN.access_token}`
            }
        };

        return this.REST.request(options, 200, true);
    }

    /**
     * Get memory usage from an Organization
     * {@link http://apidocs.cloudfoundry.org/222/organizations/retrieving_organization_memory_usage.html}
     *
     * @param  {String} guid     [org guid]
     * @return {JSON}              [return a JSON response]
     */
    getMemoryUsage (guid) {

        const url = `${this.API_URL}/v2/organizations/${guid}/memory_usage`;        
        const options = {
            method: "GET",
            url: url,
            headers: {
                Authorization: `${this.UAA_TOKEN.token_type} ${this.UAA_TOKEN.access_token}`
            }
        };

        return this.REST.request(options, 200, true);
    }

    /**
     * Get summary from an Organization
     * {@link http://apidocs.cloudfoundry.org/222/organizations/get_organization_summary.html}
     *
     * @param  {String} guid     [org guid]
     * @return {JSON}              [return a JSON response]
     */
    getSummary (guid) {

        const url = `${this.API_URL}/v2/organizations/${guid}/summary`;        
        const options = {
            method: "GET",
            url: url,
            headers: {
                Authorization: `${this.UAA_TOKEN.token_type} ${this.UAA_TOKEN.access_token}`
            }
        };

        return this.REST.request(options, 200, true);
    }

    /**
     * Get private domains from an Organizations
     * {@link http://apidocs.cloudfoundry.org/214/organizations/list_all_private_domains_for_the_organization.html}
     *
     * @param  {String} guid     [org guid]
     * @return {JSON}              [return a JSON response]
     */
    getPrivateDomains (guid) {

        const url = `${this.API_URL}/v2/organizations/${guid}/private_domains`;         
        const options = {
            method: "GET",
            url: url,
            headers: {
                Authorization: `${this.UAA_TOKEN.token_type} ${this.UAA_TOKEN.access_token}`
            }
        };

        return this.REST.request(options, 200, true);
    }

    /**
     * Add a new organization
     * {@link http://apidocs.cloudfoundry.org/222/organizations/creating_an_organization.html}
     *
     * @param {JSon} orgOptions   [org options]
     * @return {JSON}              [return a JSON response]
     */
    add (orgOptions) {

        const url = `${this.API_URL}/v2/organizations`; 
        const options = {
            method: "POST",
            url: url,
            headers: {
                Authorization: `${this.UAA_TOKEN.token_type} ${this.UAA_TOKEN.access_token}`
            },
            form: JSON.stringify(orgOptions)
        };

        return this.REST.request(options, 201, true);
    }

    /**
     * Remove an Organization
     * {@link http://apidocs.cloudfoundry.org/222/organizations/delete_a_particular_organization.html}
     *
     * @param  {String} guid     [org guid]
     * @param  {JSon} orgOptions   [org options]
     * @return {String}              [output]
     */
    remove (guid, orgOptions) {

        const url = `${this.API_URL}/v2/organizations/${guid}`;  
        let qs = {};

        if (orgOptions) {
            qs = orgOptions;
        }
        const options = {
            method: "DELETE",
            url: url,
            headers: {
                Authorization: `${this.UAA_TOKEN.token_type} ${this.UAA_TOKEN.access_token}`
            },
            qs: qs
        };

        return this.REST.request(options, 204, false);
    }

    /**
     * Get users from an Organization
     * {@link http://apidocs.cloudfoundry.org/222/organizations/list_all_users_for_the_organization.html}
     *
     * @param  {String} guid     [org guid]
     * @param  {Json} filter       [filter to search]
     * @return {Json}              [output]
     */
    getUsers (guid, filter) {

        const url = `${this.API_URL}/v2/organizations/${guid}/users`;         
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

        return this.REST.request(options, 200, true);
    }

}

module.exports = Organizations;
