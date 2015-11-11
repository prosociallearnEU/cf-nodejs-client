/*jslint node: true*/

var HttpUtils = require('../../utils/HttpUtils');

/**
 * Manage Users
 * @param {String} endPoint [CC endpoint]
 * @constructor
 */
function Users(endPoint) {
    "use strict";
    this.API_URL = endPoint;
    this.REST = new HttpUtils();
}

/**
 * Set endpoint
 * @param {String} endPoint [CC endpoint]
 */
Users.prototype.setEndPoint = function (endPoint) {
    "use strict";
    this.API_URL = endPoint;
};

/**
 * Add a User
 * {@link http://apidocs.cloudfoundry.org/222/users/creating_a_user.html}
 *
 * @param  {String} token_type   [Authentication type]
 * @param  {String} access_token [Authentication token]
 * @param  {JSON} userOptions     [user options]
 * @return {JSON}              [return a JSON response]
 */
Users.prototype.add = function (token_type, access_token, userOptions) {
    "use strict";
    var url = this.API_URL + "/v2/users";
    var options = {
        method: 'POST',
        url: url,
        headers: {
            Accept: 'application/json',          
            Authorization: token_type + ' ' + access_token
        },
        form : JSON.stringify(userOptions)
    };

    return this.REST.request(options, "201", true);
};

/**
 * Remove an User
 * {@link http://apidocs.cloudfoundry.org/222/users/delete_a_particular_user.html}
 * 
 * @param  {String} token_type   [Authentication type]
 * @param  {String} access_token [Authentication token]
 * @param  {String} user_guid     [user guid]
 * @return {JSON}              [return a JSON response]
 */
Users.prototype.remove = function (token_type, access_token, user_guid) {
    "use strict";
    var url = this.API_URL + "/v2/users/" + user_guid;
    var options = {
        method: 'DELETE',
        url: url,
        headers: {
            Accept: 'application/json',          
            Authorization: token_type + ' ' + access_token
        }
    };

    return this.REST.request(options, "204", false);
};

/**
 * Get Users
 * {@link http://apidocs.cloudfoundry.org/222/users/list_all_users.html}
 * 
 * @param  {String} token_type   [Authentication type]
 * @param  {String} access_token [Authentication token]
 * @param  {String} user_guid    [user guid]
 * @return {JSON}                [return a JSON response]
 */
Users.prototype.getUsers = function (token_type, access_token, user_guid) {
    "use strict";
    var url = this.API_URL + "/v2/users";
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
Users.prototype.associateSpace = function (token_type, access_token, user_guid, space_guid) {
    "use strict";
    var url = this.API_URL + "/v2/users/" + user_guid + "/spaces/" + space_guid;
    var options = {
        method: 'PUT',
        url: url,
        headers: {
            Accept: 'application/json',          
            Authorization: token_type + ' ' + access_token
        }
    };

    return this.REST.request(options, "201", true);
};

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
Users.prototype.associateOrganization = function (token_type, access_token, user_guid, org_guid) {
    "use strict";
    var url = this.API_URL + "/v2/users/" + user_guid + "/organizations/" + org_guid;
    var options = {
        method: 'PUT',
        url: url,
        headers: {
            Accept: 'application/json',          
            Authorization: token_type + ' ' + access_token
        }
    };

    return this.REST.request(options, "201", true);
};

module.exports = Users;
