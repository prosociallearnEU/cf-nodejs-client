"use strict";

var HttpUtils = require("../../utils/HttpUtils");

/**
 * Manages Service Instances on Cloud Foundry
 * @param {String} endPoint [CC endpoint]
 * @constructor
 */
function ServiceInstances(endPoint) {

    this.API_URL = endPoint;
    this.REST = new HttpUtils();
}

/**
 * Set endpoint
 * @param {String} endPoint [CC endpoint]
 * @returns {void}
 */
ServiceInstances.prototype.setEndPoint = function (endPoint) {

    this.API_URL = endPoint;
};

/**
 * Get Service Instances
 * {@link https://apidocs.cloudfoundry.org/226/service_instances/list_all_service_instances.html}
 * @param  {String} token_type   [Authentication type]
 * @param  {String} access_token [Authentication token]
 * @param  {String} filter [query string]
 * @return {JSON}              [return a JSON response]
 */
ServiceInstances.prototype.getInstances = function (token_type, access_token, filter) {

    var url = this.API_URL + "/v2/service_instances";
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

/**
 * Get a Service Instance
 * {@link https://apidocs.cloudfoundry.org/226/service_instances/retrieve_a_particular_service_instance.html}
 * @param  {String} token_type   [Authentication type]
 * @param  {String} access_token [Authentication token]
 * @param  {String} service_instance_guid         [servicePlan guid]
 * @return {JSON}              [return a JSON response]
 */
ServiceInstances.prototype.getInstance = function (token_type, access_token, service_instance_guid) {

    var url = this.API_URL + "/v2/service_instances/" + service_instance_guid;
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
 * Get a Service Instance Permissions
 * {@link https://apidocs.cloudfoundry.org/226/service_instances/retrieving_permissions_on_a_service_instance.html}
 * @param  {String} token_type   [Authentication type]
 * @param  {String} access_token [Authentication token]
 * @param  {String} service_instance_guid         [servicePlan guid]
 * @return {JSON}              [return a JSON response]
 */
ServiceInstances.prototype.getInstancePermissions = function (token_type, access_token, service_instance_guid) {

    var url = this.API_URL + "/v2/service_instances/" + service_instance_guid + "/permissions";
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
 * Get a Service Instance Bindings
 * {@link https://apidocs.cloudfoundry.org/226/service_instances/list_all_service_bindings_for_the_service_instance.html}
 * @param  {String} token_type   [Authentication type]
 * @param  {String} access_token [Authentication token]
 * @param  {String} service_instance_guid         [servicePlan guid]
 * @return {JSON}              [return a JSON response]
 */
ServiceInstances.prototype.getInstanceBindings = function (token_type, access_token, service_instance_guid) {

    var url = this.API_URL + "/v2/service_instances/" + service_instance_guid + "/service_bindings";
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
 * Get a Service Instance Routes
 * {@link https://apidocs.cloudfoundry.org/226/service_instances/list_all_routes_for_the_service_instance.html}
 * @param  {String} token_type   [Authentication type]
 * @param  {String} access_token [Authentication token]
 * @param  {String} service_instance_guid         [servicePlan guid]
 * @return {JSON}              [return a JSON response]
 */
ServiceInstances.prototype.getInstanceRoutes = function (token_type, access_token, service_instance_guid) {

    var url = this.API_URL + "/v2/service_instances/" + service_instance_guid + "/routes";
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
 * Create a Service Instance
 * {@link https://apidocs.cloudfoundry.org/226/service_instances/delete_a_service_instance.html}
 * @param  {String} token_type   [Authentication type]
 * @param  {String} access_token [Authentication token]
 * @param  {json} appOptions   [options to create the application]
 * @return {JSON}              [return a JSON response]
 */
ServiceInstances.prototype.create = function (token_type, access_token, appOptions) {

    var url = this.API_URL + "/v2/service_instances";
    var options = {
        method: "POST",
        url: url,
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Authorization: token_type + " " + access_token
        },
        form: JSON.stringify(appOptions)
    };

    return this.REST.request(options, "201 ", true);
};

/**
 * Remove a Service Instance
 * {@link https://apidocs.cloudfoundry.org/226/service_instances/delete_a_service_instance.html}
 * @param  {String} token_type   [Authentication type]
 * @param  {String} access_token [Authentication token]
 * @param  {String} service_instance_guid [service_instance_guid]
 * @return {JSON}              [return a JSON response]
 */
ServiceInstances.prototype.remove = function (token_type, access_token, service_instance_guid) {

    var url = this.API_URL + "/v2/service_instances/" + service_instance_guid;
    var options = {
        method: "DELETE",
        url: url,
        headers: {
            Authorization: token_type + " " + access_token
        }
    };

    return this.REST.request(options, "204 ", false);
};

module.exports = ServiceInstances;
