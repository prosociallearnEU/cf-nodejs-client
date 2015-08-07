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

var request = require('request');
var httpUtils = require('../utils/HttpUtils');

function Routes(_API_URL){
    this.API_URL = _API_URL;
    this.REST = new httpUtils();
}

/**
 * http://apidocs.cloudfoundry.org/214/routes/list_all_routes.html
 *
 * Pagination: /v2/routes?order-direction=asc&page=2&results-per-page=50
 * 
 * @param  {[type]} token_type   [description]
 * @param  {[type]} access_token [description]
 * @return {[type]}              [description]
 */
Routes.prototype.getRoutes = function(token_type,access_token,page){

    var url = this.API_URL + "/v2/routes";
    var options = {
        method: 'GET',
        url: url,
        headers: {
            'Authorization': token_type + ' ' + access_token
        },
        qs: {
            'page': page,
            'results-per-page': 50
        }
    }    

    return this.REST.request(options,"200",true);   
}

/**
 * http://apidocs.cloudfoundry.org/214/routes/retrieve_a_particular_route.html
 * 
 * @param  {[type]} token_type   [description]
 * @param  {[type]} access_token [description]
 * @param  {[type]} guid         [description]
 * @return {[type]}              [description]
 */
Routes.prototype.getRoute = function(token_type,access_token,guid){

    var url = this.API_URL + "/v2/routes/" + guid;
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
 * http://apidocs.cloudfoundry.org/213/routes/creating_a_route.html
 * 
 * @param {[type]} token_type   [description]
 * @param {[type]} access_token [description]
 * @param {[type]}              [description]
 */
Routes.prototype.addRoute = function(token_type,access_token,domain_guid,space_guid,host){

    var url = this.API_URL + "/v2/routes";
    var options = {
        method: 'POST',
        url: url,
        headers: {
            'Authorization': token_type + ' ' + access_token,
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        form : JSON.stringify({
            'domain_guid' : domain_guid,
            'space_guid' : space_guid,
            'host' : host
        })
    }    

    return this.REST.request(options,"201",true);  
}

/**
 * http://apidocs.cloudfoundry.org/214/routes/delete_a_particular_route.html
 * 
 * @param  {[type]} token_type   [description]
 * @param  {[type]} access_token [description]
 * @param  {[type]} appName      [description]
 * @param  {[type]} route_guid   [description]
 * @return {[type]}              [description]
 */
Routes.prototype.deleteRoute = function(token_type,access_token,route_guid) {
    var url = this.API_URL + "/v2/routes/" + route_guid;
    var options = {
        method: 'DELETE',
        url: url,
        headers: {
            'Authorization': token_type + ' ' + access_token,
            'Content-Type': 'application/x-www-form-urlencoded',
        }
    }    

    return this.REST.request(options,"204",false);
}

/**
 * //Research more
 * http://apidocs.cloudfoundry.org/214/routes/list_all_routes.html
 * (With a parameter)
 * 
 * @param  {[type]} token_type   [description]
 * @param  {[type]} access_token [description]
 * @param  {[type]} appName      [description]
 * @param  {[type]} domain_guid  [description]
 * @return {[type]}              [description]
 */
Routes.prototype.checkRoute = function(token_type,access_token,appName,domain_guid) {
    var url = this.API_URL + "/v2/routes";
    var options = {
        method: 'GET',
        url: url,
        headers: {
            'Authorization': token_type + ' ' + access_token
        },
        qs : {
            'q': 'host:' + appName + ';domain_guid:' + domain_guid,
            'inline-relations-depth': 1            
        }
    }      
   
    return this.REST.request(options,"200",true);
}

module.exports = Routes;
