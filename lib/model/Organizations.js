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
    var headers = {
        'Authorization': token_type + " " + access_token,
    };
    var body = { };    

    return this.REST.get(url, headers, body);    
}

Organizations.prototype.getPrivateDomains = function(token_type,access_token,org_guid){

    var url = this.API_URL + "/v2/organizations/" + org_guid + "/private_domains";    
    var headers = {
        'Authorization': token_type + " " + access_token,
    };
    var body = { };    

    return this.REST.get(url, headers, body);    
}



module.exports = Organizations;