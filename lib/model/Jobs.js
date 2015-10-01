/*jslint node: true*/
/*globals Promise:true*/
"use strict";

var HttpUtils = require('../utils/HttpUtils');

function Jobs(_API_URL) {
    this.API_URL = _API_URL;
    this.REST = new HttpUtils();
}

/**
 * [setEndpoint description]
 * 
 * @param {[type]} _API_URL [description]
 */
Jobs.prototype.setEndPoint = function (_API_URL) {
    this.API_URL = _API_URL;
};

/**
 * 
 * http://apidocs.cloudfoundry.org/214/jobs/retrieve_job_that_is_queued.html
 * 
 * @param  {[type]} token_type   [description]
 * @param  {[type]} access_token [description]
 * @param  {[type]} job_guid     [description]
 * @return {[type]}              [description]
 */
Jobs.prototype.getJob = function (token_type, access_token, job_guid) {

    var url = this.API_URL + "/v2/jobs/" + job_guid;
    var options = {
        method: 'GET',
        url: url,
        headers: {
            'Authorization': token_type + ' ' + access_token
        }
    };

    return this.REST.request(options, "200", true);
};

module.exports = Jobs;
