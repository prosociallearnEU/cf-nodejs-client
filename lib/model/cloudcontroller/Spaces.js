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
     * @param  {JSON} filter [Search options]
     * @return {JSON}              [return a JSON response]
     */
    getSpaces(filter) {

        const url = `${this.API_URL}/v2/spaces`;
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
     * Get a Space
     * {@link http://apidocs.cloudfoundry.org/214/spaces/retrieve_a_particular_space.html}
     *
     * @param  {String} guid         [Space guid]
     * @return {JSON}              [return a JSON response]
     */
    getSpace(guid) {

        const url = `${this.API_URL}/v2/spaces/${guid}`;
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
     * Get Routes in a Space
     * {@link http://apidocs.cloudfoundry.org/214/spaces/list_all_routes_for_the_space.html}
     *
     * @example
     *      qs: {
                'q': 'name:' + params.appName,
                'inline-relations-depth': 1
            }
     *
     * @param  {String} guid       [Space guid]
     * @param  {JSON} filter       [Filter]
     * @return {JSON}              [return a JSON response]
     */
    getSpaceRoutes(guid, filter) {

        const url = `${this.API_URL}/v2/spaces/${guid}/routes`;
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
    getSpaceApps(guid, filter) {

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

        return this.REST.request(options, this.HttpStatus.OK, true);
    }

    /**
     * Get Services in a Space
     * {@link http://apidocs.cloudfoundry.org/214/spaces/list_all_services_for_the_space.html}
     *
     * @example
     *      qs: {
                'q': 'name:' + params.appName,
                'inline-relations-depth': 1
            }
     *
     * @param  {String} guid       [Space guid]
     * @param  {JSON} filter       [Filter]
     * @return {JSON}              [return a JSON response]
     */
    getSpaceServices(guid, filter) {

        const url = `${this.API_URL}/v2/spaces/${guid}/services`;
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
     * Get Service Instances in a Space
     * {@link http://apidocs.cloudfoundry.org/214/spaces/list_all_service_instances_for_the_space.html}
     *
     * @example
     *      qs: {
                'q': 'name:' + params.appName,
                'inline-relations-depth': 1
            }
     *
     * @param  {String} guid       [Space guid]
     * @param  {JSON} filter       [Filter]
     * @return {JSON}              [return a JSON response]
     */
    getSpaceServiceInstances(guid, filter) {

        const url = `${this.API_URL}/v2/spaces/${guid}/service_instances`;
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
     * Get Space summary
     * {@link http://apidocs.cloudfoundry.org/222/spaces/get_space_summary.html}
     *
     * @param  {String} guid         [Space guid]
     * @return {JSON}              [return a JSON response]
     */
    getSummary(guid) {

        const url = `${this.API_URL}/v2/spaces/${guid}/summary`;
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
     * Get User Roles
     * {@link http://apidocs.cloudfoundry.org/222/spaces/retrieving_the_roles_of_all_users_in_the_space.html}
     *
     * @param  {String} guid         [Space guid]
     * @return {JSON}              [return a JSON response]
     */
    getUserRoles(guid) {

        const url = `${this.API_URL}/v2/spaces/${guid}/user_roles`;
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
     * Create a Space
     * {@link http://apidocs.cloudfoundry.org/222/spaces/creating_a_space.html}
     *
     * @param {JSON} spaceOptions [Space options]
     * @return {JSON}              [return a JSON response]
     */
    add(spaceOptions) {

        const url = `${this.API_URL}/v2/spaces`;
        const options = {
            method: "POST",
            url: url,
            headers: {
                Authorization: `${this.UAA_TOKEN.token_type} ${this.UAA_TOKEN.access_token}`
            },
            form: JSON.stringify(spaceOptions)
        };

        return this.REST.request(options, this.HttpStatus.CREATED, true);
    }

    /**
     * Update a Space
     * {@link http://apidocs.cloudfoundry.org/222/spaces/update_a_space.html}
     *
		 * @param {String} guid [guid]
     * @param {JSON} spaceOptions [Space options]
     * @return {JSON}              [return a JSON response]
     */
    update(guid, spaceOptions) {

        const url = `${this.API_URL}/v2/spaces/${guid}`;
        const options = {
            method: "PUT",
            url: url,
            headers: {
                Authorization: `${this.UAA_TOKEN.token_type} ${this.UAA_TOKEN.access_token}`
            },
            form: JSON.stringify(spaceOptions)
        };

        return this.REST.request(options, this.HttpStatus.CREATED, true);
    }

    /**
     * Delete a Space
     * {@link http://apidocs.cloudfoundry.org/222/spaces/delete_a_particular_space.html}
     *
     * @param  {String} guid   [Space uid]
     * @param  {JSON} spaceOptions [Space options]
     * @return {JSON}              [return a JSON response]
     */
    remove(guid, spaceOptions) {
        let httpStatus = "";
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

        //done by @aeweidne
        /*eslint-disable no-negated-condition, no-implicit-coercion, no-extra-boolean-cast*/

        if (!!spaceOptions.async) {
            httpStatus = this.HttpStatus.ACCEPTED;
        } else {
            httpStatus = this.HttpStatus.NO_CONTENT;
        }

        /*eslint-enable no-negated-condition, no-implicit-coercion, no-extra-boolean-cast*/

        return this.REST.request(options, httpStatus, false);
    }


    /**
     * Get managers from an Organization
     * {@link http://apidocs.cloudfoundry.org/222/organizations/list_all_managers_for_the_organization.html}
     *
     * @param  {String} guid     [org guid]
     * @param  {Json} filter       [filter to search]
     * @return {Json}              [output]
     */
    getManagers(guid, filter) {

        const url = `${this.API_URL}/v2/organizations/${guid}/managers`;
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
     * Associate a manager with a space
     * {@link http://apidocs.cloudfoundry.org/222/spaces/associate_manager_with_the_space.html}
     *
     * @param  {String} guid   [Space uid]
     * @param  {String} managerGuid [Manager uid]
     * @return {JSON}              [return a JSON response]
     */
    addManager(guid, managerGuid) {
        const url = `${this.API_URL}/v2/spaces/${guid}/managers/${managerGuid}`;

        const options = {
            method: "PUT",
            url: url,
            headers: {
                Authorization: `${this.UAA_TOKEN.token_type} ${this.UAA_TOKEN.access_token}`
            }
        };

        return this.REST.request(options, this.HttpStatus.CREATED, true);
    }

    /**
     * Dissociate a manager with a space
     * {@link http://apidocs.cloudfoundry.org/222/spaces/remove_manager_from_the_space.html}
     *
     * @param  {String} guid   [Space uid]
     * @param  {String} managerGuid [Manager uid]
     * @return {JSON}              [return a JSON response]
     */
    removeManager(guid, managerGuid) {
        const url = `${this.API_URL}/v2/spaces/${guid}/managers/${managerGuid}`;

        const options = {
            method: "DELETE",
            url: url,
            headers: {
                Authorization: `${this.UAA_TOKEN.token_type} ${this.UAA_TOKEN.access_token}`
            }
        };

        return this.REST.request(options, this.HttpStatus.CREATED, true);
    }

    /**
     * Get developers from an Organization
     * {@link http://apidocs.cloudfoundry.org/222/organizations/list_all_developers_for_the_organization.html}
     *
     * @param  {String} guid     [org guid]
     * @param  {Json} filter       [filter to search]
     * @return {Json}              [output]
     */
    getDevelopers(guid, filter) {

        const url = `${this.API_URL}/v2/organizations/${guid}/developers`;
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
     * Associate a developer with a space
     * {@link http://apidocs.cloudfoundry.org/222/spaces/associate_developer_with_the_space.html}
     *
     * @param  {String} guid   [Space uid]
     * @param  {String} developerGuid [Developer uid]
     * @return {JSON}              [return a JSON response]
     */
    addDeveloper(guid, developerGuid) {
        const url = `${this.API_URL}/v2/spaces/${guid}/developers/${developerGuid}`;

        const options = {
            method: "PUT",
            url: url,
            headers: {
                Authorization: `${this.UAA_TOKEN.token_type} ${this.UAA_TOKEN.access_token}`
            }
        };

        return this.REST.request(options, this.HttpStatus.CREATED, true);
    }

    /**
     * Dissociate a developer with a space
     * {@link http://apidocs.cloudfoundry.org/222/spaces/remove_developer_from_the_space.html}
     *
     * @param  {String} guid   [Space uid]
     * @param  {String} developerGuid [Developer uid]
     * @return {JSON}              [return a JSON response]
     */
    removeDeveloper(guid, developerGuid) {
        const url = `${this.API_URL}/v2/spaces/${guid}/developers/${developerGuid}`;

        const options = {
            method: "DELETE",
            url: url,
            headers: {
                Authorization: `${this.UAA_TOKEN.token_type} ${this.UAA_TOKEN.access_token}`
            }
        };

        return this.REST.request(options, this.HttpStatus.CREATED, true);
    }


}

module.exports = Spaces;
