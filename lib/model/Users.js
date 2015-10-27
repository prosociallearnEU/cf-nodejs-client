/*jslint node: true*/

var HttpUtils = require('../utils/HttpUtils');

function Users() {
    "use strict";
    this.API_URL = null;
    this.REST = new HttpUtils();
}

/**
 * [setEndpoint description]
 * @param {[type]} _API_URL [description]
 */
Users.prototype.setEndPoint = function (_API_URL) {
    "use strict";
    this.API_URL = _API_URL;
};

/**
 * http://apidocs.cloudfoundry.org/222/users/creating_a_user.html
 * @param {[type]} token_type   [description]
 * @param {[type]} access_token [description]
 * @param {[type]} username     [description]
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
 * http://apidocs.cloudfoundry.org/222/users/list_all_users.html
 * @param  {[type]} token_type   [description]
 * @param  {[type]} access_token [description]
 * @param  {[type]} user_guid    [description]
 * @return {[type]}              [description]
 */
Users.prototype.getUsers = function (token_type, access_token, user_guid) {
    "use strict";

    var url = this.API_URL + "v2/users";
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

module.exports = Users;
