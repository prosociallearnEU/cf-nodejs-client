/*jslint node: true*/

var HttpUtils = require('../../utils/HttpUtils');

/**
 * This class manages the authentication with Cloud Foundry
 * {@link https://github.com/cloudfoundry/uaa}
 * @param {String} endPoint [token_enpoint/authorization_endpoint]
 * @constructor
 */
function CloudFoundry(endPoint) {
    "use strict";
    if (typeof endPoint === 'string') {
        this.API_URL = endPoint;
    }
    this.REST = new HttpUtils();
}

/**
 * Set endpoint
 * @param {String} endPoint [token_enpoint/authorization_endpoint]
 */
CloudFoundry.prototype.setEndPoint = function (endPoint) {
    "use strict";
    this.API_URL = endPoint;
};

/**
 * Get information from Cloud Controller
 * {@link http://apidocs.cloudfoundry.org/214/info/get_info.html}
 * @return {Json} [description]
 */
CloudFoundry.prototype.getInfo = function () {
    "use strict";
    var url = this.API_URL + "/v2/info";
    var options = {
        method: 'GET',
        url: url
    };

    return this.REST.request(options, "200", true);
};

/**
 * Method to authenticate with Cloud Foundry UAA
 * @param  {String} endPoint [token_enpoint/authorization_endpoint]
 * @param  {String} username     [username]
 * @param  {String} password [password]
 * @return {JSon}          [UAA Response]
 */
CloudFoundry.prototype.login = function (endPoint, username, password) {
    "use strict";
    var url = endPoint + "/oauth/token";
    var options = {
        method: 'POST',
        url: url,
        headers: {
            Authorization: 'Basic Y2Y6',
            'Content-Type': 'application/x-www-form-urlencoded'
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

module.exports = CloudFoundry;
