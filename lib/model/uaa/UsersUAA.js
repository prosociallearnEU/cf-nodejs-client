"use strict";

var HttpUtils = require("../../utils/HttpUtils");

/**
 * Manage Users on Cloud Foundry UAA
 * @param {String} endPoint [UAA endpoint]
 * @constructor
 */
function UsersUAA(endPoint) {

    this.UAA_API_URL = endPoint;
    this.REST = new HttpUtils();
}

/**
 * Set endpoint
 * @param {String} endPoint [UAA endpoint]
 * @returns {void}
 */
UsersUAA.prototype.setEndPoint = function (endPoint) {

    this.UAA_API_URL = endPoint;
};

/**
 * Add an User on UAA
 * {@link https://github.com/cloudfoundry/uaa/blob/master/docs/UAA-APIs.rst#create-a-user-post-users}
 * {@link http://www.simplecloud.info/specs/draft-scim-api-01.html#create-resource}
 *
 * @param  {String} tokenType   [Authentication type]
 * @param  {String} accessToken [Authentication token]
 * @param  {JSON} uaaOptions     [user options]
 * @return {JSON}              [return a JSON response]
 */
UsersUAA.prototype.add = function (tokenType, accessToken, uaaOptions) {

    var url = this.UAA_API_URL + "/Users";
    var options = {
        method: "POST",
        url: url,
        headers: {
            Accept: "application/json",
            Authorization: tokenType + " " + accessToken
        },
        json: uaaOptions
    };

    return this.REST.request(options, "201", false);
};

/**
 * Update Password [PENDING]
 * {@link https://github.com/cloudfoundry/uaa/blob/master/docs/UAA-APIs.rst#create-a-user-post-users}
 * {@link http://www.simplecloud.info/specs/draft-scim-api-01.html#create-resource}
 *
 * @param  {String} tokenType   [Authentication type]
 * @param  {String} accessToken [Authentication token]
 * @param  {JSON} uaaGuid     [uaa guid]
 * @param  {JSON} uaaOptions     [user options]
 * @return {JSON}              [return a JSON response]
 */
UsersUAA.prototype.updatePassword = function (tokenType, accessToken, uaaGuid, uaaOptions) {

    var url = this.UAA_API_URL + "/Users/" + uaaGuid + "/password";
    var options = {
        method: "PUT",
        url: url,
        headers: {
            Accept: "application/json",
            Authorization: tokenType + " " + accessToken
        },
        json: uaaOptions
    };

    return this.REST.request(options, "200", false);
};

/**
 * Remove an User
 * {@link http://www.simplecloud.info/specs/draft-scim-api-01.html#delete-resource}
 *
 * @param  {String} tokenType   [Authentication type]
 * @param  {String} accessToken [Authentication token]
 * @param  {String} uaaGuid     [uaa guid]
 * @return {JSON}              [return a JSON response]
 */
UsersUAA.prototype.remove = function (tokenType, accessToken, uaaGuid) {

    var url = this.UAA_API_URL + "/Users/" + uaaGuid;
    var options = {
        method: "DELETE",
        url: url,
        headers: {
            Accept: "application/json",
            Authorization: tokenType + " " + accessToken
        }
    };

    return this.REST.request(options, "200", false);
};

/**
 * Get users
 * {@link http://www.simplecloud.info/specs/draft-scim-api-01.html#get-resources-ops}
 *
 * @example
 * ?filter=userName eq 'demo4'"
 *
 * @param  {String} tokenType   [Authentication type]
 * @param  {String} accessToken [Authentication token]
 * @param  {JSON} searchOptions     [searchOptions]
 * @return {JSON}              [return a JSON response]
 */
UsersUAA.prototype.getUsers = function (tokenType, accessToken, searchOptions) {

    var url = this.UAA_API_URL + "/Users";

    if (searchOptions) {
        url += searchOptions;
    }
    var options = {
        method: "GET",
        url: url,
        headers: {
            Accept: "application/json",
            Authorization: tokenType + " " + accessToken
        }
    };

    return this.REST.request(options, "200", true);
};

/**
 * Method to authenticate with Cloud Foundry UAA
 * @param  {String} username     [username]
 * @param  {String} password [password]
 * @return {JSon}          [UAA Response]
 */
UsersUAA.prototype.login = function (username, password) {

    var url = this.UAA_API_URL + "/oauth/token";
    var options = {
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

    return this.REST.request(options, "200", true);
};

/**
 * Method to refresh a Token
 * https://github.com/cloudfoundry/uaa/blob/master/docs/UAA-Tokens.md
 * @param  {String} refreshToken [Oauth refresh token]
 * @return {JSON}               [Response]
 */
UsersUAA.prototype.refreshToken = function (refreshToken) {

    var url = this.UAA_API_URL + "/oauth/token";
    var options = {
        method: "POST",
        url: url,
        headers: {
            Accept: "application/json",
            Authorization: "Basic Y2Y6",
            "Content-Type": "application/x-www-form-urlencoded"
        },
        form: {
            grant_type: "refresh_token",
            refresh_token: refreshToken
        }
    };

    return this.REST.request(options, "200", true);
};

module.exports = UsersUAA;
