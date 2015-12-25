"use strict";

const CloudControllerBase = require("./CloudControllerBase");

/**
 * Manage Spaces on Cloud Foundry
 */
class Spaces extends CloudControllerBase {

    /**
     * @param {String} endPoint [CC endpoint]
     * @constructor
     * @returns {void}
     */
    constructor(endPoint) {
        super(endPoint);
    }

    /**
     * Get Spaces
     * {@link http://apidocs.cloudfoundry.org/214/spaces/list_all_spaces.html}
     *
     * @param  {String} token_type   [Authentication type]
     * @param  {String} access_token [Authentication token]
     * @return {JSON}              [return a JSON response]
     */
    getSpaces (token_type, access_token) {

        const url = this.API_URL + "/v2/spaces";
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
     * Get a Space
     * {@link http://apidocs.cloudfoundry.org/214/spaces/retrieve_a_particular_space.html}
     *
     * @param  {String} token_type   [Authentication type]
     * @param  {String} access_token [Authentication token]
     * @param  {String} space_guid         [Space guid]
     * @return {JSON}              [return a JSON response]
     */
    getSpace (token_type, access_token, space_guid) {

        const url = this.API_URL + "/v2/spaces/" + space_guid;
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
    getSpaceApps (token_type, access_token, space_guid, filter) {

        const url = this.API_URL + "/v2/spaces/" + space_guid + "/apps";
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
     * Get Space summary
     * {@link http://apidocs.cloudfoundry.org/222/spaces/get_space_summary.html}
     *
     * @param  {String} token_type   [Authentication type]
     * @param  {String} access_token [Authentication token]
     * @param  {String} space_guid         [Space guid]
     * @return {JSON}              [return a JSON response]
     */
    getSummary (token_type, access_token, space_guid) {

        const url = this.API_URL + "/v2/spaces/" + space_guid + "/summary";
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
     * Get User Roles
     * {@link http://apidocs.cloudfoundry.org/222/spaces/retrieving_the_roles_of_all_users_in_the_space.html}
     *
     * @param  {String} token_type   [Authentication type]
     * @param  {String} access_token [Authentication token]
     * @param  {String} space_guid         [Space guid]
     * @return {JSON}              [return a JSON response]
     */
    getUserRoles (token_type, access_token, space_guid) {

        const url = this.API_URL + "/v2/spaces/" + space_guid + "/user_roles";
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
     * Create a Space
     * {@link http://apidocs.cloudfoundry.org/222/spaces/creating_a_space.html}
     *
     * @param  {String} token_type   [Authentication type]
     * @param  {String} access_token [Authentication token]
     * @param {JSON} spaceOptions [Space options]
     * @return {JSON}              [return a JSON response]
     */
    add (token_type, access_token, spaceOptions) {

        const url = this.API_URL + "/v2/spaces";
        const options = {
            method: "POST",
            url: url,
            headers: {
                Authorization: token_type + " " + access_token
            },
            form: JSON.stringify(spaceOptions)
        };

        return this.REST.request(options, "201", true);
    }

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
    remove (token_type, access_token, space_guid, spaceOptions) {

        const url = this.API_URL + "/v2/spaces/" + space_guid;
        let qs = {};

        if (spaceOptions) {
            qs = spaceOptions;
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

module.exports = Spaces;
