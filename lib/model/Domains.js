/*jslint node: true*/
/*globals Promise:true*/
"use strict";

var HttpUtils = require('../utils/HttpUtils');

function Domains(_API_URL) {
    this.API_URL = _API_URL;
    this.REST = new HttpUtils();
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
Domains.prototype.getDomains = function (token_type, access_token) {

    var url = this.API_URL + "/v2/domains";
    var options = {
        method: 'GET',
        url: url,
        headers: {
            'Authorization': token_type + ' ' + access_token
        }
    };

    return this.REST.request(options, "200", true);
};

/**
 * http://apidocs.cloudfoundry.org/214/shared_domains/list_all_shared_domains.html
 * 
 * @param  {[type]} token_type   [description]
 * @param  {[type]} access_token [description]
 * @return {[type]}              [description]
 */
Domains.prototype.getSharedDomains = function (token_type, access_token) {

    var url = this.API_URL + "/v2/shared_domains";
    var options = {
        method: 'GET',
        url: url,
        headers: {
            'Authorization': token_type + ' ' + access_token
        }
    };

    return this.REST.request(options, "200", true);
};

module.exports = Domains;