/*jslint node: true*/
/*globals Promise:true */
"use strict";

var HttpUtils = require('../utils/HttpUtils');

function UserProvidedServices(_API_URL) {
    this.API_URL = _API_URL;
    this.REST = new HttpUtils();
}

/**
 * [setEndpoint description]
 * 
 * @param {[type]} _API_URL [description]
 */
UserProvidedServices.prototype.setEndPoint = function (_API_URL) {
    this.API_URL = _API_URL;
};

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

/**
 * http://apidocs.cloudfoundry.org/217/user_provided_service_instances/retrieve_a_particular_user_provided_service_instance.html
 * 
 * @param  {[type]}
 * @param  {[type]}
 * @param  {[type]}
 * @return {[type]}
 */
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

/**
 * http://apidocs.cloudfoundry.org/217/user_provided_service_instances/creating_a_user_provided_service_instance.html
 * 
 * @param  {[type]}
 * @param  {[type]}
 * @param  {[type]}
 * @param  {[type]}
 * @param  {[type]}
 * @return {[type]}
 */
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

/**
 * http://apidocs.cloudfoundry.org/217/user_provided_service_instances/delete_a_particular_user_provided_service_instance.html
 * 
 * @param  {[type]}
 * @param  {[type]}
 * @param  {[type]}
 * @return {[type]}
 */
UserProvidedServices.prototype.delete = function (token_type, access_token, service_guid) {
    var url = this.API_URL + "/v2/user_provided_service_instances/" + service_guid;
    var options = {
        method: 'DELETE',
        url: url,
        headers: {
            'Authorization': token_type + ' ' + access_token
        }
    };

    return this.REST.request(options, "204", false);
};

/**
 * http://apidocs.cloudfoundry.org/221/user_provided_service_instances/list_all_service_bindings_for_the_user_provided_service_instance.html
 *
 * var filter = {
 *     q': 'app_guid:' + "65be2a2d-a643-4e01-b33d-8755d5934ae6"
 * };
 *
 * @param  {[type]} token_type   [description]
 * @param  {[type]} access_token [description]
 * @param  {[type]} service_guid [description]
 * @param  {[type]} filter       [description]
 * @return {[type]}              [description]
 */
UserProvidedServices.prototype.getServiceBindings = function (token_type, access_token, service_guid, filter) {
    var url = this.API_URL + "/v2/user_provided_service_instances/" + service_guid + "/service_bindings";
    var qs = {};
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

module.exports = UserProvidedServices;
