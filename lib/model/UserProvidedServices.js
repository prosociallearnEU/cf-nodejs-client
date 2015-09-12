/*jslint node: true*/
/*globals Promise:true*/
"use strict";

var HttpUtils = require('../utils/HttpUtils');

function UserProvidedServices(_API_URL) {
    this.API_URL = _API_URL;
    this.REST = new HttpUtils();
}

/**
 * http://apidocs.cloudfoundry.org/217/user_provided_service_instances/list_all_user_provided_service_instances.html
 * 
 * @param  {[type]} token_type   [description]
 * @param  {[type]} access_token [description]
 * @return {[type]}              [description]
 */
UserProvidedServices.prototype.getServices = function (token_type, access_token) {

    var url = this.API_URL + "/v2/user_provided_service_instances";
    var options = {
        method: 'GET',
        url: url,
        headers: {
            'Authorization': token_type + ' ' + access_token
        }
    };

    return this.REST.request(options, "200", true);
};

UserProvidedServices.prototype.getService = function (token_type, access_token, service_guid) {

    var url = this.API_URL + "/v2/user_provided_service_instances/" + service_guid;
    var options = {
        method: 'GET',
        url: url,
        headers: {
            'Authorization': token_type + ' ' + access_token
        }
    };

    return this.REST.request(options, "200", true);
};

UserProvidedServices.prototype.create = function (token_type, access_token, name, space_guid, credentials) {

    var url = this.API_URL + "/v2/user_provided_service_instances";
    var options = {
        method: 'POST',
        url: url,
        headers: {
            'Authorization': token_type + ' ' + access_token
        },
        form : JSON.stringify({
            "space_guid" : space_guid,
            "name" : name,
            "credentials" : credentials
        })
    };

    return this.REST.request(options, "201", true);
};

module.exports = UserProvidedServices;
