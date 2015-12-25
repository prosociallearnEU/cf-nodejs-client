"use strict";

const CloudControllerBase = require("./CloudControllerBase");

/**
 * Manage Quotas for an Organization
 */
class OrganizationsQuota extends CloudControllerBase {

    /**
     * @param {String} endPoint [CC endpoint]
     * @constructor
     * @returns {void}
     */
    constructor(endPoint) {
        super(endPoint);
    }

    /**
     * Get Quotas for Organizations
     * {@link http://apidocs.cloudfoundry.org/213/organization_quota_definitions/list_all_organization_quota_definitions.html}
     * @param  {String} token_type   [Authentication type]
     * @param  {String} access_token [Authentication token]
     * @return {JSON}              [return a JSON response]
     */
    getQuotaDefinitions (token_type, access_token) {

        const url = this.API_URL + "/v2/quota_definitions";
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
     * Get a quota from an Organization
     * {@link http://apidocs.cloudfoundry.org/213/organization_quota_definitions/retrieve_a_particular_organization_quota_definition.html}
     * @param  {String} token_type   [Authentication type]
     * @param  {String} access_token [Authentication token]
     * @param  {String} org_guid     [org guid]
     * @return {JSON}              [return a JSON response]
     */
    getQuotaDefinition (token_type, access_token, org_guid) {

        const url = this.API_URL + "/v2/quota_definitions/" + org_guid;
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
     * Add a Quota
     * {@link http://apidocs.cloudfoundry.org/222/organization_quota_definitions/creating_a_organization_quota_definition.html}
     * @param  {String} token_type   [Authentication type]
     * @param  {String} access_token [Authentication token]
     * @param  {JSON} quotaOptions     [org options]
     * @return {JSON}              [return a JSON response]
     */
    add (token_type, access_token, quotaOptions) {

        const url = this.API_URL + "/v2/quota_definitions";
        const options = {
            method: "POST",
            url: url,
            headers: {
                Authorization: token_type + " " + access_token
            },
            form: JSON.stringify(quotaOptions)
        };

        return this.REST.request(options, "201", true);
    }

    /**
     * Remove a Quota for an Organization
     * {@link http://apidocs.cloudfoundry.org/222/organization_quota_definitions/delete_a_particular_organization_quota_definition.html}
     * @param  {String} token_type   [Authentication type]
     * @param  {String} access_token [Authentication token]
     * @param  {String} quota_guid     [quota guid]
     * @param  {Boolean} async        [description]
     * @return {JSON}              [return a JSON response]
     */
    remove (token_type, access_token, quota_guid, async) {

        const url = this.API_URL + "/v2/quota_definitions/" + quota_guid;
        let qs = {};

        if (async) {
            qs = async;
        }
        const options = {
            method: "DELETE",
            url: url,
            headers: {
                Authorization: token_type + " " + access_token
            },
            qs: qs
        };

        return this.REST.request(options, "204", false);
    }

}

module.exports = OrganizationsQuota;