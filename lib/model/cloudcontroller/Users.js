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
     * @param  {String} token_type   [Authentication type]
     * @param  {String} access_token [Authentication token]
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

        return this.REST.request(options, 201, true);
    }

    /**
     * Delete an User
     * {@link http://apidocs.cloudfoundry.org/222/users/delete_a_particular_user.html}
     *
     * @param  {String} token_type   [Authentication type]
     * @param  {String} access_token [Authentication token]
     * @param  {String} user_guid     [user guid]
     * @return {JSON}              [return a JSON response]
     */
    remove (user_guid) {

        const url = `${this.API_URL}/v2/users/${user_guid}`; 
        const options = {
            method: "DELETE",
            url: url,
            headers: {
                Accept: "application/json",
                Authorization: `${this.UAA_TOKEN.token_type} ${this.UAA_TOKEN.access_token}`
            }
        };

        return this.REST.request(options, 204, false);
    }

    /**
     * Get Users
     * {@link http://apidocs.cloudfoundry.org/222/users/list_all_users.html}
     *
     * @param  {String} token_type   [Authentication type]
     * @param  {String} access_token [Authentication token]
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

        return this.REST.request(options, 200, true);
    }

    /**
     * Associate User with a Space
     * {@link http://apidocs.cloudfoundry.org/222/users/associate_space_with_the_user.html}
     *
     * @param  {String} token_type   [Authentication type]
     * @param  {String} access_token [Authentication token]
     * @param  {String} user_guid    [user guid]
     * @param  {String} space_guid   [space guid]
     * @return {JSON}                [return a JSON response]
     */
    associateSpace (user_guid, space_guid) {

        const url = `${this.API_URL}/v2/users/${user_guid}/spaces/${space_guid}`; 
        const options = {
            method: "PUT",
            url: url,
            headers: {
                Accept: "application/json",
                Authorization: `${this.UAA_TOKEN.token_type} ${this.UAA_TOKEN.access_token}`
            }
        };

        return this.REST.request(options, 201, true);
    }

    /**
     * Associate User with an Organization
     * {@link http://apidocs.cloudfoundry.org/222/users/associate_organization_with_the_user.html}
     *
     * @param  {String} token_type   [Authentication type]
     * @param  {String} access_token [Authentication token]
     * @param  {String} user_guid    [user guid]
     * @param  {String} org_guid   [space guid]
     * @return {JSON}                [return a JSON response]
     */
    associateOrganization (user_guid, org_guid) {

        const url = `${this.API_URL}/v2/users/${user_guid}/organizations/${org_guid}`;         
        const options = {
            method: "PUT",
            url: url,
            headers: {
                Accept: "application/json",
                Authorization: `${this.UAA_TOKEN.token_type} ${this.UAA_TOKEN.access_token}`
            }
        };

        return this.REST.request(options, 201, true);
    }

}

module.exports = Users;
