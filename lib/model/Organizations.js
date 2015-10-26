/*jslint node: true*/
/*globals Promise:true*/
"use strict";

var HttpUtils = require('../utils/HttpUtils');

function Organizations(_API_URL) {
    this.API_URL = _API_URL;
    this.REST = new HttpUtils();
}

/**
 * [setEndpoint description]
 * 
 * @param {[type]} _API_URL [description]
 */
Organizations.prototype.setEndPoint = function (_API_URL) {
    this.API_URL = _API_URL;
};

/**
 * http://apidocs.cloudfoundry.org/213/organizations/list_all_organizations.html
 * 
 * @param  {[type]} token_type   [description]
 * @param  {[type]} access_token [description]
 * @return {[type]}              [description]
 */
Organizations.prototype.getOrganizations = function (token_type, access_token) {

    var url = this.API_URL + "/v2/organizations";
    var options = {
        method: 'GET',
        url: url,
        headers: {
            'Authorization': token_type + ' ' + access_token
        }
    };

    return this.REST.request(options, "200", true);
};

/**
 * http://apidocs.cloudfoundry.org/222/organizations/retrieving_organization_memory_usage.html
 * @param  {[type]} token_type   [description]
 * @param  {[type]} access_token [description]
 * @param  {[type]} org_guid     [description]
 * @return {[type]}              [description]
 */
Organizations.prototype.memoryUsage = function (token_type, access_token, org_guid) {

    var url = this.API_URL + "/v2/organizations/" + org_guid +  "/memory_usage";
    var options = {
        method: 'GET',
        url: url,
        headers: {
            'Authorization': token_type + ' ' + access_token
        }
    };

    return this.REST.request(options, "200", true);
};

/**
 * http://apidocs.cloudfoundry.org/222/organizations/get_organization_summary.html
 * @param  {[type]} token_type   [description]
 * @param  {[type]} access_token [description]
 * @param  {[type]} org_guid     [description]
 * @return {[type]}              [description]
 */
Organizations.prototype.summary = function (token_type, access_token, org_guid) {

    var url = this.API_URL + "/v2/organizations/" + org_guid +  "/summary";
    var options = {
        method: 'GET',
        url: url,
        headers: {
            'Authorization': token_type + ' ' + access_token
        }
    };

    return this.REST.request(options, "200", true);
};

/**
 * http://apidocs.cloudfoundry.org/214/organizations/list_all_private_domains_for_the_organization.html
 * 
 * @param  {[type]} token_type   [description]
 * @param  {[type]} access_token [description]
 * @param  {[type]} org_guid     [description]
 * @return {[type]}              [description]
 */
Organizations.prototype.getPrivateDomains = function (token_type, access_token, org_guid) {

    var url = this.API_URL + "/v2/organizations/" + org_guid + "/private_domains";
    var options = {
        method: 'GET',
        url: url,
        headers: {
            'Authorization': token_type + ' ' + access_token
        }
    };

    return this.REST.request(options, "200", true);
};

/**
 * http://apidocs.cloudfoundry.org/222/organizations/creating_an_organization.html
 * @param {[type]} token_type   [description]
 * @param {[type]} access_token [description]
 * @param {[type]} orgOptions   [description]
 */
Organizations.prototype.add = function (token_type, access_token, orgOptions) {

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
 * http://apidocs.cloudfoundry.org/222/organizations/delete_a_particular_organization.html
 * @param  {[type]} token_type   [description]
 * @param  {[type]} access_token [description]
 * @param  {[type]} org_guid     [description]
 * @param  {[type]} orgOptions   [description]
 * @return {[type]}              [description]
 */
Organizations.prototype.remove = function (token_type, access_token, org_guid, orgOptions) {

    var url = this.API_URL + "/v2/organizations/" + org_guid;
    var qs = { };
    if (orgOptions) {
        qs = orgOptions;
    }     
    var options = {
        method: 'DELETE',
        url: url,
        headers: {
            Authorization: token_type + ' ' + access_token
        },
        qs:qs
    };

    return this.REST.request(options, "204", false);
};

module.exports = Organizations;
