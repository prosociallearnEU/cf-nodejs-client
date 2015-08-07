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

function Organizations(_API_URL){
    this.API_URL = _API_URL;
    this.REST = new httpUtils();
}

/**
 * http://apidocs.cloudfoundry.org/213/organizations/list_all_organizations.html
 * 
 * @param  {[type]} token_type   [description]
 * @param  {[type]} access_token [description]
 * @return {[type]}              [description]
 */
Organizations.prototype.getOrganizations = function(token_type,access_token){

    var url = this.API_URL + "/v2/organizations";
    var options = {
        method: 'GET',
        url: url,
        headers: {
            'Authorization': token_type + ' ' + access_token
        }
    }    

    return this.REST.request(options,"200",true);   
}

/**
 * http://apidocs.cloudfoundry.org/214/organizations/list_all_private_domains_for_the_organization.html
 * 
 * @param  {[type]} token_type   [description]
 * @param  {[type]} access_token [description]
 * @param  {[type]} org_guid     [description]
 * @return {[type]}              [description]
 */
Organizations.prototype.getPrivateDomains = function(token_type,access_token,org_guid){

    var url = this.API_URL + "/v2/organizations/" + org_guid + "/private_domains";
    var options = {
        method: 'GET',
        url: url,
        headers: {
            'Authorization': token_type + ' ' + access_token
        }
    }    

    return this.REST.request(options,"200",true);   
}

module.exports = Organizations;
