/*jslint node: true*/

var HttpUtils = require('../utils/HttpUtils');

/**
 * Manage Organizations in Cloud Foundry
 * @param {String} endPoint [CC endpoint]
 * @constructor
 */
function Organizations(endPoint) {
    "use strict";
    this.API_URL = endPoint;
    this.REST = new HttpUtils();
}

/**
 * Set endpoint
 * @param {String} endPoint [CC endpoint]
 */
Organizations.prototype.setEndPoint = function (endPoint) {
    "use strict";
    this.API_URL = endPoint;
};

/**
 * Get Organizations
 * {@link http://apidocs.cloudfoundry.org/213/organizations/list_all_organizations.html}
 * @param  {String} token_type   [Authentication type]
 * @param  {String} access_token [Authentication token]
 * @return {JSON}              [return a JSON response]
 */
Organizations.prototype.getOrganizations = function (token_type, access_token) {
    "use strict";
    var url = this.API_URL + "/v2/organizations";
    var options = {
        method: 'GET',
        url: url,
        headers: {
            Authorization: token_type + ' ' + access_token
        }
    };

    return this.REST.request(options, "200", true);
};

/**
 * Get memory usage from an Organization
 * {@link http://apidocs.cloudfoundry.org/222/organizations/retrieving_organization_memory_usage.html}
 * @param  {String} token_type   [Authentication type]
 * @param  {String} access_token [Authentication token]
 * @param  {String} org_guid     [org guid]
 * @return {JSON}              [return a JSON response]
 */
Organizations.prototype.memoryUsage = function (token_type, access_token, org_guid) {
    "use strict";
    var url = this.API_URL + "/v2/organizations/" + org_guid + "/memory_usage";
    var options = {
        method: 'GET',
        url: url,
        headers: {
            Authorization: token_type + ' ' + access_token
        }
    };

    return this.REST.request(options, "200", true);
};

/**
 * Get summary from an Organization
 * {@link http://apidocs.cloudfoundry.org/222/organizations/get_organization_summary.html}
 * @param  {String} token_type   [Authentication type]
 * @param  {String} access_token [Authentication token]
 * @param  {String} org_guid     [org guid]
 * @return {JSON}              [return a JSON response]
 */
Organizations.prototype.summary = function (token_type, access_token, org_guid) {
    "use strict";
    var url = this.API_URL + "/v2/organizations/" + org_guid + "/summary";
    var options = {
        method: 'GET',
        url: url,
        headers: {
            Authorization: token_type + ' ' + access_token
        }
    };

    return this.REST.request(options, "200", true);
};

/**
 * Get private domains from an Organizations
 * {@link http://apidocs.cloudfoundry.org/214/organizations/list_all_private_domains_for_the_organization.html}
 * @param  {String} token_type   [Authentication type]
 * @param  {String} access_token [Authentication token]
 * @param  {String} org_guid     [org guid]
 * @return {JSON}              [return a JSON response]
 */
Organizations.prototype.getPrivateDomains = function (token_type, access_token, org_guid) {
    "use strict";
    var url = this.API_URL + "/v2/organizations/" + org_guid + "/private_domains";
    var options = {
        method: 'GET',
        url: url,
        headers: {
            Authorization: token_type + ' ' + access_token
        }
    };

    return this.REST.request(options, "200", true);
};

/**
 * Add a new organization
 * {@link http://apidocs.cloudfoundry.org/222/organizations/creating_an_organization.html}
 * @param  {String} token_type   [Authentication type]
 * @param  {String} access_token [Authentication token]
 * @param {JSon} orgOptions   [org options]
 */
Organizations.prototype.add = function (token_type, access_token, orgOptions) {
    "use strict";
    var url = this.API_URL + "/v2/organizations";
    var options = {
        method: 'POST',
        url: url,
        headers: {
            Authorization: token_type + ' ' + access_token
        },
        form: JSON.stringify(orgOptions)
    };

    return this.REST.request(options, "201", true);
};

/**
 * Remove an Organization
 * {@link http://apidocs.cloudfoundry.org/222/organizations/delete_a_particular_organization.html}
 * @param  {String} token_type   [Authentication type]
 * @param  {String} access_token [Authentication token]
 * @param  {String} org_guid     [org guid]
 * @param  {JSon} orgOptions   [org options]
 * @return {String}              [output]
 */
Organizations.prototype.remove = function (token_type, access_token, org_guid, orgOptions) {
    "use strict";
    var url = this.API_URL + "/v2/organizations/" + org_guid;
    var qs = {};
    if (orgOptions) {
        qs = orgOptions;
    }
    var options = {
        method: 'DELETE',
        url: url,
        headers: {
            Authorization: token_type + ' ' + access_token
        },
        qs: qs
    };

    return this.REST.request(options, "204", false);
};

/**
 * Get users from an Organization
 * {@link http://apidocs.cloudfoundry.org/222/organizations/list_all_users_for_the_organization.html}
 * @param  {String} token_type   [Authentication type]
 * @param  {String} access_token [Authentication token]
 * @param  {String} org_guid     [org guid]
 * @param  {Json} filter       [filter to search]
 * @return {Json}              [output]
 */
Organizations.prototype.getUsers = function (token_type, access_token, org_guid, filter) {
    "use strict";
    var url = this.API_URL + "/v2/organizations/" + org_guid + "/users";
    var qs = {};
    if (filter) {
        qs = filter;
    }
    var options = {
        method: 'GET',
        url: url,
        headers: {
            Authorization: token_type + ' ' + access_token
        },
        qs: qs
    };

    return this.REST.request(options, "200", true);
};

module.exports = Organizations;
