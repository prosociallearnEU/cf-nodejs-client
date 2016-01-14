"use strict";

const HttpUtils = require("../../utils/HttpUtils");
const HttpStatus = require("../../utils/HttpStatus");

/**
 * Manage Users on Cloud Foundry UAA
 */
class UsersUAA {

    /**
     * Constructor
     * @param {String} endPoint [UAA endpoint]
     * @constructor
     * @returns {void}
     */
    constructor(endPoint) {
        this.UAA_API_URL = endPoint;
        this.REST = new HttpUtils();
        this.HttpStatus = HttpStatus;
    }

    /**
     * Set endpoint
     * @param {String} endPoint [UAA endpoint]
     * @returns {void}
     */
    setEndPoint (endPoint) {

        this.UAA_API_URL = endPoint;
    }

    /**
     * Set token
     * @param {JSON} token [Oauth token from UAA]
     * @returns {void}
     */
    setToken (token) {

        this.UAA_TOKEN = token;
    }

    /**
     * Add an User on UAA
     * {@link https://github.com/cloudfoundry/uaa/blob/master/docs/UAA-APIs.rst#create-a-user-post-users}
     * {@link http://www.simplecloud.info/specs/draft-scim-api-01.html#create-resource}
     *
     * @param  {JSON} uaaOptions     [user options]
     * @return {JSON}              [return a JSON response]
     */
    add (uaaOptions) {

        const url = `${this.UAA_API_URL}/Users`;
        const options = {
            method: "POST",
            url: url,
            headers: {
                Accept: "application/json",
                Authorization: `${this.UAA_TOKEN.token_type} ${this.UAA_TOKEN.access_token}`
            },
            json: uaaOptions
        };

        return this.REST.request(options, this.HttpStatus.CREATED, false);
    }

    /**
     * Update Password [PENDING]
     * {@link https://github.com/cloudfoundry/uaa/blob/master/docs/UAA-APIs.rst#create-a-user-post-users}
     * {@link http://www.simplecloud.info/specs/draft-scim-api-01.html#create-resource}
     *
     * @param  {JSON} uaaGuid     [uaa guid]
     * @param  {JSON} uaaOptions     [user options]
     * @return {JSON}              [return a JSON response]
     */
    updatePassword (uaaGuid, uaaOptions) {

        const url = `${this.UAA_API_URL}/Users/${uaaGuid}/password`;
        const options = {
            method: "PUT",
            url: url,
            headers: {
                Accept: "application/json",
                Authorization: `${this.UAA_TOKEN.token_type} ${this.UAA_TOKEN.access_token}`
            },
            json: uaaOptions
        };

        return this.REST.request(options, this.HttpStatus.OK, false);
    }

    /**
     * Remove an User
     * {@link http://www.simplecloud.info/specs/draft-scim-api-01.html#delete-resource}
     *
     * @param  {String} uaaGuid     [uaa guid]
     * @return {JSON}              [return a JSON response]
     */
    remove (uaaGuid) {

        const url = `${this.UAA_API_URL}/Users/${uaaGuid}`;
        const options = {
            method: "DELETE",
            url: url,
            headers: {
                Accept: "application/json",
                Authorization: `${this.UAA_TOKEN.token_type} ${this.UAA_TOKEN.access_token}`
            }
        };

        return this.REST.request(options, this.HttpStatus.OK, false);
    }

    /**
     * Get users
     * {@link http://www.simplecloud.info/specs/draft-scim-api-01.html#get-resources-ops}
     *
     * @example
     * ?filter=userName eq 'demo4'"
     *
     * @param  {JSON} searchOptions     [searchOptions]
     * @return {JSON}              [return a JSON response]
     */
    getUsers (searchOptions) {

        let url = `${this.UAA_API_URL}/Users`;

        if (searchOptions) {
            url += searchOptions;
        }
        const options = {
            method: "GET",
            url: url,
            headers: {
                Accept: "application/json",
                Authorization: `${this.UAA_TOKEN.token_type} ${this.UAA_TOKEN.access_token}`
            }
        };

        return this.REST.request(options, this.HttpStatus.OK, true);
    }

    /**
     * Method to authenticate with Cloud Foundry UAA
     * @param  {String} username     [username]
     * @param  {String} password [password]
     * @return {JSon}          [UAA Response]
     */
    login (username, password) {

        const url = `${this.UAA_API_URL}/oauth/token`;
        const options = {
            method: "POST",
            url: url,
            headers: {
                Authorization: "Basic Y2Y6",
                "Content-Type": "application/x-www-form-urlencoded"
            },
            form: {
                grant_type: "password",
                client_id: "cf",
                username: username,
                password: password
            }
        };

        return this.REST.request(options, this.HttpStatus.OK, true);
    }

    /**
     * Method to refresh a Token
     * https://github.com/cloudfoundry/uaa/blob/master/docs/UAA-Tokens.md
     *
     * @param  {String} refreshToken [Oauth refresh token]
     * @return {JSON}               [Response]
     */
    refreshToken () {

        const url = `${this.UAA_API_URL}/oauth/token`;
        const options = {
            method: "POST",
            url: url,
            headers: {
                Accept: "application/json",
                Authorization: "Basic Y2Y6",
                "Content-Type": "application/x-www-form-urlencoded"
            },
            form: {
                grant_type: "refresh_token",
                refresh_token: this.UAA_TOKEN.refresh_token
            }
        };

        return this.REST.request(options, this.HttpStatus.OK, true);
    }

}

module.exports = UsersUAA;
