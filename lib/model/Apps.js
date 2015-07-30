/*jslint node: true*/
/*globals Promise:true*/
"use strict";

var request = require('request'),
    JSZip = require('jszip'),
    crypto = require('crypto'),
    yaml = require('js-yaml');    
var httpUtils = require('../utils/HttpUtils');

function Apps(_API_URL){
    this.API_URL = _API_URL;
    this.REST = new httpUtils();
    this.dataRemoteFile = null;
    this.manifeset = null;
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
        'Content-Type': 'application/x-www-form-urlencoded'
    };
    var body = JSON.stringify({
        "name": name,
        "space_guid": space_guid
    })    

    return this.REST.post(url, headers, body);    

}

Apps.prototype.stopApp = function(token_type,access_token,appGuid){

    var url = this.API_URL + '/v2/apps/' + appGuid;
    var headers = {
        'Authorization': token_type + " " + access_token,
        'Content-Type': 'application/x-www-form-urlencoded'
    };
    var body = JSON.stringify({
            'state': 'STOPPED'
    })
    return this.REST.put(url, headers, body);    

}

Apps.prototype.startApp = function(token_type,access_token,appGuid){

    var url = this.API_URL + '/v2/apps/' + appGuid;
    var headers = {
        'Authorization': token_type + " " + access_token,
        'Content-Type': 'application/x-www-form-urlencoded'
    };
    var body = JSON.stringify({
            'state': 'STARTED'
    })
    return this.REST.put(url, headers, body);    

}

module.exports = Apps;