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

function CloudFoundry(_API_URL){
    this.API_URL = _API_URL;
    this.REST = new httpUtils();
}

/**
 * http://apidocs.cloudfoundry.org/214/info/get_info.html
 * 
 * @return {[type]} [description]
 */
CloudFoundry.prototype.getInfo = function(){

    var url = this.API_URL + "/v2/info";
    var headers = { };
    var qs = { };    
    var body = { };    

    return this.REST.request("GET",url, headers, qs, body,"200");
}

/**
 * 
 * @param  {[type]} endPoint [description]
 * @param  {[type]} user     [description]
 * @param  {[type]} password [description]
 * @return {[type]}          [description]
 */
CloudFoundry.prototype.login = function (endPoint, username, password) {

    var url = endPoint + "/oauth/token";
    var headers = {
        'Authorization': 'Basic Y2Y6',
        'Content-Type': 'application/x-www-form-urlencoded'
    };
    var qs = { };     
    var body = {
        grant_type: "password",
        client_id: "cf",    
        username: username,    
        password: password
    };

    return this.REST.request("POST",url, headers, qs, body,"200");    
}

module.exports = CloudFoundry;
