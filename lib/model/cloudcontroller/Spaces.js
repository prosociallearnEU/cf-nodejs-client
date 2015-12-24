"use strict";

var HttpUtils = require("../../utils/HttpUtils");

/**
 * Manage Spaces on Cloud Foundry
 * @param {String} endPoint [CC endpoint]
 * @constructor
 */
function Spaces(endPoint) {

    this.API_URL = endPoint;
    this.REST = new HttpUtils();
}

/**
 * Set endpoint
 * @param {String} endPoint [CC endpoint]
 * @returns {void}
 */
Spaces.prototype.setEndPoint = function (endPoint) {

    this.API_URL = endPoint;
};

/**
 * Get Spaces
 * {@link http://apidocs.cloudfoundry.org/214/spaces/list_all_spaces.html}
 *
 * @param  {String} token_type   [Authentication type]
 * @param  {String} access_token [Authentication token]
 * @return {JSON}              [return a JSON response]
 */
Spaces.prototype.getSpaces = function (token_type, access_token) {

    var url = this.API_URL + "/v2/spaces";
    var options = {
        method: "GET",
        url: url,
        headers: {
            Authorization: token_type + " " + access_token
        }
    };

    return this.REST.request(options, "200", true);
};

/**
 * Get a Space
 * {@link http://apidocs.cloudfoundry.org/214/spaces/retrieve_a_particular_space.html}
 *
 * @param  {String} token_type   [Authentication type]
 * @param  {String} access_token [Authentication token]
 * @param  {String} space_guid         [Space guid]
 * @return {JSON}              [return a JSON response]
 */
Spaces.prototype.getSpace = function (token_type, access_token, space_guid) {

    var url = this.API_URL + "/v2/spaces/" + space_guid;
    var options = {
        method: "GET",
        url: url,
        headers: {
            Authorization: token_type + " " + access_token
        }
    };

    return this.REST.request(options, "200", true);
};

/**
 * Get Apps in a Space
 * {@link http://apidocs.cloudfoundry.org/214/spaces/list_all_apps_for_the_space.html}
 *
 * @example
 *      qs: {
            'q': 'name:' + params.appName,
            'inline-relations-depth': 1
        }
 *
 * @param  {String} token_type   [Authentication type]
 * @param  {String} access_token [Authentication token]
 * @param  {String} space_guid         [Space guid]
 * @param  {JSON} filter       [Filter]
 * @return {JSON}              [return a JSON response]
 */
Spaces.prototype.getSpaceApps = function (token_type, access_token, space_guid, filter) {

    var url = this.API_URL + "/v2/spaces/" + space_guid + "/apps";
    var qs = {};

    if (filter) {
        qs = filter;
    }
    var options = {
        method: "GET",
        url: url,
        headers: {
            Authorization: token_type + " " + access_token
        },
        qs: qs
    };

    return this.REST.request(options, "200", true);
};

/**
 * Get Space summary
 * {@link http://apidocs.cloudfoundry.org/222/spaces/get_space_summary.html}
 *
 * @param  {String} token_type   [Authentication type]
 * @param  {String} access_token [Authentication token]
 * @param  {String} space_guid         [Space guid]
 * @return {JSON}              [return a JSON response]
 */
Spaces.prototype.getSummary = function (token_type, access_token, space_guid) {

    var url = this.API_URL + "/v2/spaces/" + space_guid + "/summary";
    var options = {
        method: "GET",
        url: url,
        headers: {
            Authorization: token_type + " " + access_token
        }
    };

    return this.REST.request(options, "200", true);
};

/**
 * Get User Roles
 * {@link http://apidocs.cloudfoundry.org/222/spaces/retrieving_the_roles_of_all_users_in_the_space.html}
 *
 * @param  {String} token_type   [Authentication type]
 * @param  {String} access_token [Authentication token]
 * @param  {String} space_guid         [Space guid]
 * @return {JSON}              [return a JSON response]
 */
Spaces.prototype.getUserRoles = function (token_type, access_token, space_guid) {

    var url = this.API_URL + "/v2/spaces/" + space_guid + "/user_roles";
    var options = {
        method: "GET",
        url: url,
        headers: {
            Authorization: token_type + " " + access_token
        }
    };

    return this.REST.request(options, "200", true);
};

/**
 * Create a Space
 * {@link http://apidocs.cloudfoundry.org/222/spaces/creating_a_space.html}
 *
 * @param  {String} token_type   [Authentication type]
 * @param  {String} access_token [Authentication token]
 * @param {JSON} spaceOptions [Space options]
 * @return {JSON}              [return a JSON response]
 */
Spaces.prototype.add = function (token_type, access_token, spaceOptions) {

    var url = this.API_URL + "/v2/spaces";
    var options = {
        method: "POST",
        url: url,
        headers: {
            Authorization: token_type + " " + access_token
        },
        form: JSON.stringify(spaceOptions)
    };

    return this.REST.request(options, "201", true);
};

/**
 * Delete a Space
 * {@link http://apidocs.cloudfoundry.org/222/spaces/delete_a_particular_space.html}
 *
 * @param  {String} token_type   [Authentication type]
 * @param  {String} access_token [Authentication token]
 * @param  {String} space_guid   [Space uid]
 * @param  {JSON} spaceOptions [Space options]
 * @return {JSON}              [return a JSON response]
 */
Spaces.prototype.remove = function (token_type, access_token, space_guid, spaceOptions) {

    var url = this.API_URL + "/v2/spaces/" + space_guid;
    var qs = {};

    if (spaceOptions) {
        qs = spaceOptions;
    }
    var options = {
        method: "DELETE",
        url: url,
        headers: {
            Authorization: token_type + " " + access_token
        },
        qs: qs
    };

    return this.REST.request(options, "204", false);
};

module.exports = Spaces;
