/*jslint node: true*/

var HttpUtils = require('../../utils/HttpUtils');

/**
 * Manages Quotas for Spaces
 * @param {String} endPoint [CC endpoint]
 * @constructor
 */
function SpacesQuota(endPoint) {
    "use strict";
    this.API_URL = endPoint;
    this.REST = new HttpUtils();
}

/**
 * Set endpoint
 * @param {String} endPoint [CC endpoint]
 */
SpacesQuota.prototype.setEndPoint = function (endPoint) {
    "use strict";
    this.API_URL = endPoint;
};

/**
 * Get Quota Definitions
 * {@link http://apidocs.cloudfoundry.org/214/space_quota_definitions/list_all_space_quota_definitions.html}
 *
 * @param  {String} token_type   [Authentication type]
 * @param  {String} access_token [Authentication token]
 * @return {JSON}              [return a JSON response]
 */
SpacesQuota.prototype.getQuotaDefinitions = function (token_type, access_token) {
    "use strict";
    var url = this.API_URL + "/v2/space_quota_definitions";
    var options = {
        method: 'GET',
        url: url,
        headers: {
            Authorization: token_type + ' ' + access_token
        }
    };

    return this.REST.request(options, "200", true);
};

module.exports = SpacesQuota;
