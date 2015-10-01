/*jslint node: true*/
/*globals Promise:true*/
"use strict";

var HttpUtils = require('../utils/HttpUtils');

function Stacks(_API_URL) {
    this.API_URL = _API_URL;
    this.REST = new HttpUtils();
}

/**
 * [setEndpoint description]
 * 
 * @param {[type]} _API_URL [description]
 */
Stacks.prototype.setEndPoint = function (_API_URL) {
    this.API_URL = _API_URL;
};

/**
 * http://apidocs.cloudfoundry.org/214/stacks/list_all_stacks.html
 * 
 * @param  {[type]} token_type   [description]
 * @param  {[type]} access_token [description]
 * @return {[type]}              [description]
 */
Stacks.prototype.getStacks = function (token_type, access_token) {

    var url = this.API_URL + "/v2/stacks";
    var options = {
        method: 'GET',
        url: url,
        headers: {
            'Authorization': token_type + ' ' + access_token
        }
    };

    return this.REST.request(options, "200", true);
};

module.exports = Stacks;