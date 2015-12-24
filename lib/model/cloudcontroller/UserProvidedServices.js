"use strict";

var HttpUtils = require("../../utils/HttpUtils");

/**
 * Manage User Provided Services
 * {@link https://docs.cloudfoundry.org/devguide/services/user-provided.html}
 *
 * @param {String} endPoint [CC endpoint]
 * @constructor
 */
function UserProvidedServices(endPoint) {

    this.API_URL = endPoint;
    this.REST = new HttpUtils();
}

/**
 * Set endpoint
 * @param {String} endPoint [CC endpoint]
 * @returns {void}
 */
UserProvidedServices.prototype.setEndPoint = function (endPoint) {

    this.API_URL = endPoint;
};

/**
 * Get Services
 * {@link http://apidocs.cloudfoundry.org/217/user_provided_service_instances/list_all_user_provided_service_instances.html}
 *
 * @param  {String} token_type   [Authentication type]
 * @param  {String} access_token [Authentication token]
 * @return {JSON}              [return a JSON response]
 */
UserProvidedServices.prototype.getServices = function (token_type, access_token) {

    var url = this.API_URL + "/v2/user_provided_service_instances";
    var options = {
        method: "GET",
        url: url,
        headers: {
            Authorization: token_type + " " + access_token
        }
    };

    return this.REST.request(options, "200", true);
};

/**
 * Get a Service
 * {@link http://apidocs.cloudfoundry.org/217/user_provided_service_instances/retrieve_a_particular_user_provided_service_instance.html}
 *
 * @param  {String} token_type   [Authentication type]
 * @param  {String} access_token [Authentication token]
 * @param  {String} service_guid [Service guid]
 * @return {JSON}              [return a JSON response]
 */
UserProvidedServices.prototype.getService = function (token_type, access_token, service_guid) {

    var url = this.API_URL + "/v2/user_provided_service_instances/" + service_guid;
    var options = {
        method: "GET",
        url: url,
        headers: {
            Authorization: token_type + " " + access_token
        }
    };

    return this.REST.request(options, "200", true);
};

/**
 * Create an user Provided Service
 * {@link http://apidocs.cloudfoundry.org/217/user_provided_service_instances/creating_a_user_provided_service_instance.html}
 *
 * @param  {String} token_type   [Authentication type]
 * @param  {String} access_token [Authentication token]
 * @param  {JSON} user_provided_service_options [user_provided_service_options]
 * @return {JSON}              [return a JSON response]
 */
UserProvidedServices.prototype.add = function (token_type, access_token, user_provided_service_options) {

    var url = this.API_URL + "/v2/user_provided_service_instances";
    var options = {
        method: "POST",
        url: url,
        headers: {
            Authorization: token_type + " " + access_token
        },
        form: JSON.stringify(user_provided_service_options)
    };

    return this.REST.request(options, "201", true);
};

/**
 * Remove an User provided service
 * {@link http://apidocs.cloudfoundry.org/217/user_provided_service_instances/delete_a_particular_user_provided_service_instance.html}
 *
 * @param  {String} token_type   [Authentication type]
 * @param  {String} access_token [Authentication token]
 * @param  {String} service_guid [service_guid]
 * @return {String}              [output]
 */
UserProvidedServices.prototype.remove = function (token_type, access_token, service_guid) {

    var url = this.API_URL + "/v2/user_provided_service_instances/" + service_guid;
    var options = {
        method: "DELETE",
        url: url,
        headers: {
            Authorization: token_type + " " + access_token
        }
    };

    return this.REST.request(options, "204", false);
};

/**
 * Get service bindings from user provided services
 * {@link http://apidocs.cloudfoundry.org/221/user_provided_service_instances/list_all_service_bindings_for_the_user_provided_service_instance.html}
 *
 * @example
 * var filter = {
 *     q': 'app_guid:' + "65be2a2d-a643-4e01-b33d-8755d5934ae6"
 * };
 *
 * @param  {String} token_type   [Authentication type]
 * @param  {String} access_token [Authentication token]
 * @param  {String} service_guid [service_guid]
 * @param  {JSON} filter       [search options]
 * @return {JSON}              [Output]
 */
UserProvidedServices.prototype.getServiceBindings = function (token_type, access_token, service_guid, filter) {

    var url = this.API_URL + "/v2/user_provided_service_instances/" + service_guid + "/service_bindings";
    var qs = {};

    if (filter) {
        qs = filter;
    }
    var options = {
        method: "GET",
        url: url,
        headers: {
            Authorization: token_type + " " + access_token
        },
        qs: qs
    };

    return this.REST.request(options, "200", true);
};

module.exports = UserProvidedServices;
