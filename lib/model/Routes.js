/*jslint node: true*/
/*globals Promise:true*/
"use strict";

var httpUtils = require('../utils/HttpUtils');

function Routes(_API_URL){
    this.API_URL = _API_URL;
    this.REST = new httpUtils();
}

Routes.prototype.getRoutes = function(token_type,access_token){

    var url = this.API_URL + "/v2/routes";    
    var headers = {
        'Authorization': token_type + " " + access_token,
    };
    var body = { };    

    return this.REST.get(url, headers, body);    
}

Routes.prototype.getRoute = function(token_type,access_token,guid){

    var url = this.API_URL + "/v2/routes/" + guid;    
    var headers = {
        'Authorization': token_type + " " + access_token,
    };
    var body = { };    

    return this.REST.get(url, headers, body);    
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
    var headers = {
        'Authorization': token_type + " " + access_token,
        'Content-Type': 'application/x-www-form-urlencoded',
    };
    var body = { 
   		'domain_guid' : domain_guid,
   		'space_guid' : space_guid,
   		'host' : host
    };    

    return this.REST.post(url, headers, body);    
}


module.exports = Routes;

