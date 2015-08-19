/*jslint node: true*/
/*globals Promise:true*/
"use strict";

var HttpUtils = require('../utils/HttpUtils');

function Spaces(_API_URL) {
    this.API_URL = _API_URL;
    this.REST = new HttpUtils();
}

/**
 * http://apidocs.cloudfoundry.org/214/spaces/list_all_spaces.html
 * 
 * @param  {[type]} token_type   [description]
 * @param  {[type]} access_token [description]
 * @return {[type]}              [description]
 */
Spaces.prototype.getSpaces = function (token_type, access_token) {

    var url = this.API_URL + "/v2/spaces";
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
 * http://apidocs.cloudfoundry.org/214/spaces/retrieve_a_particular_space.html
 * 
 * @param  {[type]} token_type   [description]
 * @param  {[type]} access_token [description]
 * @param  {[type]} guid         [description]
 * @return {[type]}              [description]
 */
Spaces.prototype.getSpace = function (token_type, access_token, guid) {

    var url = this.API_URL + "/v2/spaces/" + guid;
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
 * http://apidocs.cloudfoundry.org/214/spaces/list_all_apps_for_the_space.html
 *
 *      qs: {
            'q': 'name:' + params.appName,
            'inline-relations-depth': 1
        }
 * 
 * @param  {[type]} token_type   [description]
 * @param  {[type]} access_token [description]
 * @param  {[type]} guid         [description]
 * @param  {[type]} filter       [description]
 * @return {[type]}              [description]
 */
Spaces.prototype.getSpaceApps = function (token_type, access_token, space_guid, filter) {

    var url = this.API_URL + "/v2/spaces/" + space_guid + "/apps";
    var qs = { };
    if (filter) {
        qs = filter;
    }
    var options = {
        method: 'GET',
        url: url,
        headers: {
            'Authorization': token_type + ' ' + access_token
        },
        qs: qs
    };
    return this.REST.request(options, "200", true);
};

module.exports = Spaces;
