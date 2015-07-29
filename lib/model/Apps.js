/*jslint node: true*/
/*globals Promise:true*/
"use strict";

var request = require('request');
var httpUtils = require('../utils/HttpUtils');

function Apps(_API_URL){
    this.API_URL = _API_URL;
    this.REST = new httpUtils();
}

Apps.prototype.getApps = function(token_type,access_token){

    var url = this.API_URL + "/v2/apps";
    var headers = {
        'Authorization': token_type + " " + access_token,
    };
    var body = { }; 

    return this.REST.get(url, headers, body);    
}

Apps.prototype.addApp = function(token_type,access_token,name,space_guid){

    var url = this.API_URL + "/v2/apps";
    var headers = {
        'Authorization': token_type + " " + access_token,
        'Content-Type': 'application/x-www-form-urlencoded',
        'Cookie' : '',
        'Host' : 'VALID_ROUTE' //??
    };
    var body = {
        "name": name,
        "space_guid": space_guid
    };

    //return this.REST.post(url, headers, body);    

    return new Promise(function (resolve, reject) {
        request.get({ url: url, headers: headers, form: body }, function (error, response, body) {
            var result = JSON.parse(body);
            if (!error && response.statusCode == 200) {
                return resolve(body);
            } else {
                return reject(body);
            }
        });
    }); 
}

module.exports = Apps;