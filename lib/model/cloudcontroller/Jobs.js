/*jslint node: true*/

var HttpUtils = require('../../utils/HttpUtils');

/**
 * Manage Jobs in Cloud Foundry
 * @param {String} endPoint [CC endpoint]
 * @constructor
 */
function Jobs(endPoint) {
    "use strict";
    this.API_URL = endPoint;
    this.REST = new HttpUtils();
}

/**
 * Set endpoint
 * @param {String} endPoint [CC endpoint]
 */
Jobs.prototype.setEndPoint = function (endPoint) {
    "use strict";
    this.API_URL = endPoint;
};

/**
 * Get a determinated Job
 * {@link http://apidocs.cloudfoundry.org/214/jobs/retrieve_job_that_is_queued.html}
 * @param  {String} token_type   [Authentication type]
 * @param  {String} access_token [Authentication token]
 * @param  {String} job_guid     [job guid]
 * @return {JSON}              [return a JSON response]
 */
Jobs.prototype.getJob = function (token_type, access_token, job_guid) {
    "use strict";
    var url = this.API_URL + "/v2/jobs/" + job_guid;
    var options = {
        method: 'GET',
        url: url,
        headers: {
            Authorization: token_type + ' ' + access_token
        }
    };

    return this.REST.request(options, "200", true);
};

module.exports = Jobs;
