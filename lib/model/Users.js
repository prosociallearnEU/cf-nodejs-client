/*jslint node: true*/

var HttpUtils = require('../utils/HttpUtils');

function Users() {
    "use strict";
    this.API_URL = null;
    this.UAA_API_URL = null;
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
 * [setUAAEndPoint description]
 * @param {[type]} _API_URL [description]
 */
Users.prototype.setUAAEndPoint = function (_API_URL) {
    "use strict";
    this.UAA_API_URL = _API_URL;
};

/**
 * http://www.simplecloud.info/specs/draft-scim-api-01.html#create-resource
 * @param {[type]} token_type   [description]
 * @param {[type]} access_token [description]
 * @param {[type]} username     [description]
 */
Users.prototype.add = function (token_type, access_token, uaa_options) {
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
 * http://www.simplecloud.info/specs/draft-scim-api-01.html#get-resources-ops
 * @param  {[type]} token_type   [description]
 * @param  {[type]} access_token [description]
 * @param  {[type]} username     [description]
 * @return {[type]}              [description]
 */
Users.prototype.getUsers = function (token_type, access_token) {
    "use strict";

    var url = this.UAA_API_URL + "/Users";
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
