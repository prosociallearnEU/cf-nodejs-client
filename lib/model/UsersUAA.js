/*jslint node: true*/

var HttpUtils = require('../utils/HttpUtils');

function UsersUAA() {
    "use strict";

    this.UAA_API_URL = null;
    this.REST = new HttpUtils();
}

/**
 * [setEndpoint description]
 * @param {[type]} _API_URL [description]
 */
UsersUAA.prototype.setEndPoint = function (_API_URL) {
    "use strict";
    this.UAA_API_URL = _API_URL;
};

/**
 * http://www.simplecloud.info/specs/draft-scim-api-01.html#create-resource
 * http://apidocs.cloudfoundry.org/222/users/creating_a_user.html
 * @param {[type]} token_type   [description]
 * @param {[type]} access_token [description]
 * @param {[type]} username     [description]
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
 * https://github.com/cloudfoundry/uaa/blob/master/docs/UAA-APIs.rst#create-a-user-post-users
 * http://www.simplecloud.info/specs/draft-scim-api-01.html#change-password
 * @param  {[type]} token_type   [description]
 * @param  {[type]} access_token [description]
 * @param  {[type]} uaa_options  [description]
 * @return {[type]}              [description]
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
 * http://www.simplecloud.info/specs/draft-scim-api-01.html#delete-resource
 * @param  {[type]} token_type   [description]
 * @param  {[type]} access_token [description]
 * @param  {[type]} uaa_guid     [description]
 * @return {[type]}              [description]
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
 * http://www.simplecloud.info/specs/draft-scim-api-01.html#get-resources-ops
 *
 * ?filter=userName eq 'demo4'"
 * 
 * @param  {[type]} token_type   [description]
 * @param  {[type]} access_token [description]
 * @param  {[type]} username     [description]
 * @return {[type]}              [description]
 */
UsersUAA.prototype.getUsers = function (token_type, access_token, searchOptions) {
    "use strict";

    var url = this.UAA_API_URL + "/Users";
    if(searchOptions){
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
