"use strict";

const CloudControllerBase = require("./CloudControllerBase");

/**
 * Manage Users
 */
class Users extends CloudControllerBase {

    /**
     * @param {String} endPoint [CC endpoint]
     * @constructor
     * @returns {void}
     */
    constructor(endPoint) {
        super(endPoint);
    }

    /**
     * Add a User
     * {@link http://apidocs.cloudfoundry.org/222/users/creating_a_user.html}
     *
     * @param  {JSON} userOptions     [user options]
     * @return {JSON}              [return a JSON response]
     */
    add (userOptions) {

        const url = `${this.API_URL}/v2/users`;
        const options = {
            method: "POST",
            url: url,
            headers: {
                Accept: "application/json",
                Authorization: `${this.UAA_TOKEN.token_type} ${this.UAA_TOKEN.access_token}`
            },
            form: JSON.stringify(userOptions)
        };

        return this.REST.request(options, this.HttpCodes.CREATED, true);
    }

    /**
     * Delete an User
     * {@link http://apidocs.cloudfoundry.org/222/users/delete_a_particular_user.html}
     *
     * @param  {String} guid     [user guid]
     * @return {JSON}              [return a JSON response]
     */
    remove (guid) {

        const url = `${this.API_URL}/v2/users/${guid}`;
        const options = {
            method: "DELETE",
            url: url,
            headers: {
                Accept: "application/json",
                Authorization: `${this.UAA_TOKEN.token_type} ${this.UAA_TOKEN.access_token}`
            }
        };

        return this.REST.request(options, this.HttpCodes.NO_CONTENT, false);
    }

    /**
     * Get Users
     * {@link http://apidocs.cloudfoundry.org/222/users/list_all_users.html}
     *
     * @return {JSON}                [return a JSON response]
     */
    getUsers () {

        const url = `${this.API_URL}/v2/users`;
        const options = {
            method: "GET",
            url: url,
            headers: {
                Accept: "application/json",
                Authorization: `${this.UAA_TOKEN.token_type} ${this.UAA_TOKEN.access_token}`
            }
        };

        return this.REST.request(options, this.HttpCodes.OK, true);
    }

    /**
     * Associate User with a Space
     * {@link http://apidocs.cloudfoundry.org/222/users/associate_space_with_the_user.html}
     *
     * @param  {String} userGuid    [user guid]
     * @param  {String} spaceGuid   [space guid]
     * @return {JSON}                [return a JSON response]
     */
    associateSpace (userGuid, spaceGuid) {

        const url = `${this.API_URL}/v2/users/${userGuid}/spaces/${spaceGuid}`;
        const options = {
            method: "PUT",
            url: url,
            headers: {
                Accept: "application/json",
                Authorization: `${this.UAA_TOKEN.token_type} ${this.UAA_TOKEN.access_token}`
            }
        };

        return this.REST.request(options, this.HttpCodes.CREATED, true);
    }

    /**
     * Associate User with an Organization
     * {@link http://apidocs.cloudfoundry.org/222/users/associate_organization_with_the_user.html}
     *
     * @param  {String} userGuid    [user guid]
     * @param  {String} orgGuid   [space guid]
     * @return {JSON}                [return a JSON response]
     */
    associateOrganization (userGuid, orgGuid) {

        const url = `${this.API_URL}/v2/users/${userGuid}/organizations/${orgGuid}`;
        const options = {
            method: "PUT",
            url: url,
            headers: {
                Accept: "application/json",
                Authorization: `${this.UAA_TOKEN.token_type} ${this.UAA_TOKEN.access_token}`
            }
        };

        return this.REST.request(options, this.HttpCodes.CREATED, true);
    }

}

module.exports = Users;
