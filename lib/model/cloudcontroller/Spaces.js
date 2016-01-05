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
     * @return {JSON}              [return a JSON response]
     */
    getSpaces () {

        const url = `${this.API_URL}/v2/spaces`;
        const options = {
            method: "GET",
            url: url,
            headers: {
                Authorization: `${this.UAA_TOKEN.token_type} ${this.UAA_TOKEN.access_token}`
            }
        };

        return this.REST.request(options, this.HttpCodes.OK, true);
    }

    /**
     * Get a Space
     * {@link http://apidocs.cloudfoundry.org/214/spaces/retrieve_a_particular_space.html}
     *
     * @param  {String} guid         [Space guid]
     * @return {JSON}              [return a JSON response]
     */
    getSpace (guid) {

        const url = `${this.API_URL}/v2/spaces/${guid}`;
        const options = {
            method: "GET",
            url: url,
            headers: {
                Authorization: `${this.UAA_TOKEN.token_type} ${this.UAA_TOKEN.access_token}`
            }
        };

        return this.REST.request(options, this.HttpCodes.OK, true);
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
     * @param  {String} guid         [Space guid]
     * @param  {JSON} filter       [Filter]
     * @return {JSON}              [return a JSON response]
     */
    getSpaceApps (guid, filter) {

        const url = `${this.API_URL}/v2/spaces/${guid}/apps`;
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

        return this.REST.request(options, this.HttpCodes.OK, true);
    }

    /**
     * Get Space summary
     * {@link http://apidocs.cloudfoundry.org/222/spaces/get_space_summary.html}
     *
     * @param  {String} guid         [Space guid]
     * @return {JSON}              [return a JSON response]
     */
    getSummary (guid) {

        const url = `${this.API_URL}/v2/spaces/${guid}/summary`;
        const options = {
            method: "GET",
            url: url,
            headers: {
                Authorization: `${this.UAA_TOKEN.token_type} ${this.UAA_TOKEN.access_token}`
            }
        };

        return this.REST.request(options, this.HttpCodes.OK, true);
    }

    /**
     * Get User Roles
     * {@link http://apidocs.cloudfoundry.org/222/spaces/retrieving_the_roles_of_all_users_in_the_space.html}
     *
     * @param  {String} guid         [Space guid]
     * @return {JSON}              [return a JSON response]
     */
    getUserRoles (guid) {

        const url = `${this.API_URL}/v2/spaces/${guid}/user_roles`;
        const options = {
            method: "GET",
            url: url,
            headers: {
                Authorization: `${this.UAA_TOKEN.token_type} ${this.UAA_TOKEN.access_token}`
            }
        };

        return this.REST.request(options, this.HttpCodes.OK, true);
    }

    /**
     * Create a Space
     * {@link http://apidocs.cloudfoundry.org/222/spaces/creating_a_space.html}
     *
     * @param {JSON} spaceOptions [Space options]
     * @return {JSON}              [return a JSON response]
     */
    add (spaceOptions) {

        const url = `${this.API_URL}/v2/spaces`;
        const options = {
            method: "POST",
            url: url,
            headers: {
                Authorization: `${this.UAA_TOKEN.token_type} ${this.UAA_TOKEN.access_token}`
            },
            form: JSON.stringify(spaceOptions)
        };

        return this.REST.request(options, this.HttpCodes.CREATED, true);
    }

    /**
     * Delete a Space
     * {@link http://apidocs.cloudfoundry.org/222/spaces/delete_a_particular_space.html}
     *
     * @param  {String} guid   [Space uid]
     * @param  {JSON} spaceOptions [Space options]
     * @return {JSON}              [return a JSON response]
     */
    remove (guid, spaceOptions) {

        const url = `${this.API_URL}/v2/spaces/${guid}`;
        let qs = {};

        if (spaceOptions) {
            qs = spaceOptions;
        }
        const options = {
            method: "DELETE",
            url: url,
            headers: {
                Authorization: `${this.UAA_TOKEN.token_type} ${this.UAA_TOKEN.access_token}`
            },
            qs: qs
        };

        return this.REST.request(options, this.HttpCodes.NO_CONTENT, false);
    }

}

module.exports = Spaces;
