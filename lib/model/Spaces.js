/*jslint node: true*/
/*globals Promise:true*/
"use strict";

var HttpUtils = require('../utils/HttpUtils');

function Spaces(_API_URL) {
    this.API_URL = _API_URL;
    this.REST = new HttpUtils();
}

/**
 * [setEndpoint description]
 * 
 * @param {[type]} _API_URL [description]
 */
Spaces.prototype.setEndPoint = function (_API_URL) {
    this.API_URL = _API_URL;
};

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

/**
 * http://apidocs.cloudfoundry.org/222/spaces/get_space_summary.html
 * @param  {[type]} token_type   [description]
 * @param  {[type]} access_token [description]
 * @param  {[type]} space_guid   [description]
 * @param  {[type]} filter       [description]
 * @return {[type]}              [description]
 */
Spaces.prototype.summary = function (token_type, access_token, space_guid) {

    var url = this.API_URL + "/v2/spaces/" + space_guid + "/summary";
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
 * http://apidocs.cloudfoundry.org/222/spaces/retrieving_the_roles_of_all_users_in_the_space.html
 * @param  {[type]} token_type   [description]
 * @param  {[type]} access_token [description]
 * @param  {[type]} space_guid   [description]
 * @return {[type]}              [description]
 */
Spaces.prototype.userRoles = function (token_type, access_token, space_guid) {

    var url = this.API_URL + "/v2/spaces/" + space_guid + "/user_roles";
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
 * http://apidocs.cloudfoundry.org/222/spaces/creating_a_space.html
 *
 *  var spaceOptions = {
 *  
 *  }
 * 
 * @param {[type]} token_type   [description]
 * @param {[type]} access_token [description]
 * @param {[type]} spaceOptions [description]
 */
Spaces.prototype.add = function (token_type, access_token, spaceOptions) {

    var url = this.API_URL + "/v2/spaces";
    var options = {
        method: 'POST',
        url: url,
        headers: {
            'Authorization': token_type + ' ' + access_token
        },
        form : JSON.stringify(spaceOptions)
    };
    return this.REST.request(options, "201", true);
};

/**
 * http://apidocs.cloudfoundry.org/222/spaces/delete_a_particular_space.html
 * 
 * @param  {[type]} token_type   [description]
 * @param  {[type]} access_token [description]
 * @param  {[type]} org_guid     [description]
 * @param  {[type]} spaceOptions [description]
 * @return {[type]}              [description]
 */
Spaces.prototype.remove = function (token_type, access_token, org_guid, spaceOptions) {

    var url = this.API_URL + "/v2/spaces/" + org_guid;
    var qs = { };
    if (spaceOptions) {
        qs = spaceOptions;
    }     
    var options = {
        method: 'DELETE',
        url: url,
        headers: {
            Authorization: token_type + ' ' + access_token
        },
        qs:qs
    };

    return this.REST.request(options, "204", false);
};

module.exports = Spaces;
