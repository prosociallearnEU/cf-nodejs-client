/*jslint node: true*/

var HttpUtils = require('../../utils/HttpUtils');

/**
 * Manage Users on Cloud Foundry UAA
 * @param {String} endPoint [UAA endpoint]
 * @constructor
 */
function UsersUAA(endPoint) {
    "use strict";
    this.UAA_API_URL = endPoint;
    this.REST = new HttpUtils();
}

/**
 * Set endpoint
 * @param {String} endPoint [UAA endpoint]
 */
UsersUAA.prototype.setEndPoint = function (endPoint) {
    "use strict";
    this.UAA_API_URL = endPoint;
};

/**
 * Add an User on UAA
 * {@link https://github.com/cloudfoundry/uaa/blob/master/docs/UAA-APIs.rst#create-a-user-post-users}
 * {@link http://www.simplecloud.info/specs/draft-scim-api-01.html#create-resource}
 *
 * @param  {String} token_type   [Authentication type]
 * @param  {String} access_token [Authentication token]
 * @param  {JSON} uaa_options     [user options]
 * @return {JSON}              [return a JSON response]
 */
UsersUAA.prototype.add = function (token_type, access_token, uaa_options) {
    "use strict";
    var url = this.UAA_API_URL + "/Users";
    var options = {
        method: 'POST',
        url: url,
        headers: {
            Accept: 'application/json',
            Authorization: token_type + ' ' + access_token
        },
        json: uaa_options
    };

    return this.REST.request(options, "201", false);
};

/**
 * Update Password [PENDING]
 * {@link https://github.com/cloudfoundry/uaa/blob/master/docs/UAA-APIs.rst#create-a-user-post-users}
 * {@link http://www.simplecloud.info/specs/draft-scim-api-01.html#create-resource}
 *
 * @param  {String} token_type   [Authentication type]
 * @param  {String} access_token [Authentication token]
 * @param  {JSON} uaa_options     [user options]
 * @return {JSON}              [return a JSON response]
 */
UsersUAA.prototype.updatePassword = function (token_type, access_token, uaa_guid, uaa_options) {
    "use strict";
    var url = this.UAA_API_URL + "/Users/" + uaa_guid + "/password";
    var options = {
        method: 'PUT',
        url: url,
        headers: {
            Accept: 'application/json',
            Authorization: token_type + ' ' + access_token
        },
        json: uaa_options
    };

    return this.REST.request(options, "200", false);
};

/**
 * Remove an User
 * {@link http://www.simplecloud.info/specs/draft-scim-api-01.html#delete-resource}
 *
 * @param  {String} token_type   [Authentication type]
 * @param  {String} access_token [Authentication token]
 * @param  {String} uaa_guid     [uaa guid]
 * @return {JSON}              [return a JSON response]
 */
UsersUAA.prototype.remove = function (token_type, access_token, uaa_guid) {
    "use strict";

    var url = this.UAA_API_URL + "/Users/" + uaa_guid;
    var options = {
        method: 'DELETE',
        url: url,
        headers: {
            Accept: 'application/json',
            Authorization: token_type + ' ' + access_token
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
 * @param  {String} token_type   [Authentication type]
 * @param  {String} access_token [Authentication token]
 * @param  {JSON} searchOptions     [searchOptions]
 * @return {JSON}              [return a JSON response]
 */
UsersUAA.prototype.getUsers = function (token_type, access_token, searchOptions) {
    "use strict";
    var url = this.UAA_API_URL + "/Users";
    if (searchOptions) {
        url += searchOptions;
    }
    var options = {
        method: 'GET',
        url: url,
        headers: {
            Accept: 'application/json',
            Authorization: token_type + ' ' + access_token
        }
    };

    return this.REST.request(options, "200", true);
};

module.exports = UsersUAA;
