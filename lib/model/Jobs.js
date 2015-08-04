/*
Copyright 2015 Juan Antonio Breña Moral.

Licensed under the MIT License;
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

     http://choosealicense.com/licenses/mit/

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

/*jslint node: true*/
/*globals Promise:true*/
"use strict";

var httpUtils = require('../utils/HttpUtils');

function Jobs(_API_URL){
    this.API_URL = _API_URL;
    this.REST = new httpUtils();
}

/**
 * [getJob description]
 * http://apidocs.cloudfoundry.org/214/jobs/retrieve_job_that_is_queued.html
 * 
 * @param  {[type]} token_type   [description]
 * @param  {[type]} access_token [description]
 * @param  {[type]} job_guid     [description]
 * @return {[type]}              [description]
 */
Jobs.prototype.getJob = function(token_type,access_token, job_guid){

    var url = this.API_URL + "/v2/jobs/" + job_guid;
    var headers = {
        'Authorization': token_type + " " + access_token,
    };
    var body = { };    

    return this.REST.get(url, headers, body);
}

module.exports = Jobs;