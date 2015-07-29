/*jslint node: true*/
/*globals Promise:true*/
"use strict";

var httpUtils = require('./HttpUtils');

/**
 * [CloudFoundry description]
 * @param {[type]} _API_URL [description]
 */
function CloudFoundry(_API_URL){
	this.API_URL = _API_URL;
	this.REST = new httpUtils();
}

/**
 * [getInfo description]
 * @return {[type]} [description]
 */
CloudFoundry.prototype.getInfo = function(){

    var url = this.API_URL + "/v2/info";
    var headers = { };
    var body = { }; 

    return this.REST.get(url, headers, body); 
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

    var body = {
        grant_type: "password",
        client_id: "cf",    
        username: username,    
        password: password
    };

	return this.REST.post(url, headers, body);
}

module.exports = CloudFoundry;