/*jslint node: true*/
/*globals Promise:true*/
"use strict";

var HttpUtils = require('../utils/HttpUtils');

function OrganizationsQuota(_API_URL) {
    this.API_URL = _API_URL;
    this.REST = new HttpUtils();
}

/**
 * [setEndpoint description]
 * 
 * @param {[type]} _API_URL [description]
 */
OrganizationsQuota.prototype.setEndPoint = function (_API_URL) {
    this.API_URL = _API_URL;
};

/**
 * [quotaDefinitions description]
 * @param  {[type]} token_type   [description]
 * @param  {[type]} access_token [description]
 * @return {[type]}              [description]
 */
OrganizationsQuota.prototype.quotaDefinitions = function (token_type, access_token) {

    var url = this.API_URL + "/v2/quota_definitions";
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
 * [quotaDefinition description]
 * @param  {[type]} token_type   [description]
 * @param  {[type]} access_token [description]
 * @param  {[type]} org_guid     [description]
 * @return {[type]}              [description]
 */
OrganizationsQuota.prototype.quotaDefinition = function (token_type, access_token, org_guid) {

    var url = this.API_URL + "/v2/quota_definitions/" + org_guid;
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
 * http://apidocs.cloudfoundry.org/222/organization_quota_definitions/creating_a_organization_quota_definition.html
 * @param {[type]} token_type   [description]
 * @param {[type]} access_token [description]
 * @param {[type]} quotaOptions   [description]
 */
OrganizationsQuota.prototype.add = function (token_type, access_token, quotaOptions) {

    var url = this.API_URL + "/v2/quota_definitions";
    var options = {
        method: 'POST',
        url: url,
        headers: {
            Authorization: token_type + ' ' + access_token
        },
        form: JSON.stringify(quotaOptions)
    };
    return this.REST.request(options, "201", true);
};

/**
 * http://apidocs.cloudfoundry.org/222/organization_quota_definitions/delete_a_particular_organization_quota_definition.html
 * @param  {[type]} token_type   [description]
 * @param  {[type]} access_token [description]
 * @param  {[type]} quota_guid   [description]
 * @param  {[type]} async        [description]
 * @return {[type]}              [description]
 */
OrganizationsQuota.prototype.remove = function (token_type, access_token, quota_guid, async) {

    var url = this.API_URL + "/v2/quota_definitions/" + quota_guid;
    var qs = { };
    if (async) {
        qs = async;
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

module.exports = OrganizationsQuota;