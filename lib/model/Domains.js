/*jslint node: true*/
/*globals Promise:true*/
"use strict";

var httpUtils = require('../utils/HttpUtils');

function Domains(_API_URL){
    this.API_URL = _API_URL;
    this.REST = new httpUtils();
}

Domains.prototype.getDomains = function(token_type,access_token){

    var url = this.API_URL + "/v2/domains";    
    var headers = {
        'Authorization': token_type + " " + access_token,
    };
    var body = { };    

    return this.REST.get(url, headers, body);    
}

module.exports = Domains;