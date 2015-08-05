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

function Domains(_API_URL){
    this.API_URL = _API_URL;
    this.REST = new httpUtils();
}

/**
 * 
 * DEPRECATED Method
 * http://apidocs.cloudfoundry.org/214/domains_(deprecated)/list_all_domains_(deprecated).html
 * 
 * @param  {[type]} token_type   [description]
 * @param  {[type]} access_token [description]
 * @return {[type]}              [description]
 */
Domains.prototype.getDomains = function(token_type,access_token){

    var url = this.API_URL + "/v2/domains";    
    var headers = {
        'Authorization': token_type + " " + access_token,
    };
    var qs = { };     
    var body = { };    

    //return this.REST.get(url, headers, body);
    return this.REST.request("GET",url, headers, qs, body,"200");      
}

/**
 * http://apidocs.cloudfoundry.org/214/shared_domains/list_all_shared_domains.html
 * 
 * @param  {[type]} token_type   [description]
 * @param  {[type]} access_token [description]
 * @return {[type]}              [description]
 */
Domains.prototype.getSharedDomains = function(token_type,access_token){

    var url = this.API_URL + "/v2/shared_domains";    
    var headers = {
        'Authorization': token_type + " " + access_token,
    };
    var qs = { };     
    var body = { };    

    //return this.REST.get(url, headers, body);  
    return this.REST.request("GET",url, headers, qs, body,"200");
}

module.exports = Domains;