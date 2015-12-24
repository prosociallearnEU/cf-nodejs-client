var HttpUtils = require("../../utils/HttpUtils");

/**
 * Manage Stacks
 * @param {String} endPoint [CC endpoint]
 * @constructor
 */
function Stacks(endPoint) {
    "use strict";
    this.API_URL = endPoint;
    this.REST = new HttpUtils();
}

/**
 * Set endpoint
 * @param {String} endPoint [CC endpoint]
 * @returns {void}
 */
Stacks.prototype.setEndPoint = function (endPoint) {
    "use strict";
    this.API_URL = endPoint;
};

/**
 * Get Stacks
 * {@link http://apidocs.cloudfoundry.org/214/stacks/list_all_stacks.html}
 *
 * @param  {String} token_type   [Authentication type]
 * @param  {String} access_token [Authentication token]
 * @return {JSON}              [return a JSON response]
 */
Stacks.prototype.getStacks = function (token_type, access_token) {
    "use strict";
    var url = this.API_URL + "/v2/stacks";
    var options = {
        method: "GET",
        url: url,
        headers: {
            Authorization: token_type + " " + access_token
        }
    };

    return this.REST.request(options, "200", true);
};

module.exports = Stacks;