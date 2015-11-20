/*jslint node: true*/

var HttpUtils = require('../../utils/HttpUtils');

/**
 * Manages Service Binding on Cloud Foundry
 * @param {String} endPoint [CC endpoint]
 * @constructor
 */
function ServiceBindings(endPoint) {
    "use strict";    
    this.API_URL = endPoint;
    this.REST = new HttpUtils();
}

/**
 * Set endpoint
 * @param {String} endPoint [CC endpoint]
 */
ServiceBindings.prototype.setEndPoint = function (endPoint) {
    "use strict";
    this.API_URL = endPoint;
};

/**
 * Get Service Bindings
 * {@link http://apidocs.cloudfoundry.org/217/service_bindings/list_all_service_bindings.html}
 * @param  {String} token_type   [Authentication type]
 * @param  {String} access_token [Authentication token]
 * @param  {String} guid         [route guid]
 * @return {JSON}              [return a JSON response]
 */
ServiceBindings.prototype.getServiceBindings = function (token_type, access_token, filter) {
    "use strict";
    var url = this.API_URL + "/v2/service_bindings";
    var qs = {};
    if (filter) {
        qs = filter;
    }
    var options = {
        method: 'GET',
        url: url,
        headers: {
            Authorization: token_type + ' ' + access_token
        },
        qs: qs
    };

    return this.REST.request(options, "200", true);
};

/**
 * Get a Service Binding
 * {@link http://apidocs.cloudfoundry.org/217/service_bindings/retrieve_a_particular_service_binding.html}
 * @param  {String} token_type   [Authentication type]
 * @param  {String} access_token [Authentication token]
 * @param  {String} serviceBinding_guid         [serviceBinding guid]
 * @return {JSON}              [return a JSON response]
 */
ServiceBindings.prototype.getServiceBinding = function (token_type, access_token, serviceBinding_guid) {
    "use strict";
    var url = this.API_URL + "/v2/service_bindings/" + serviceBinding_guid;
    var options = {
        method: 'GET',
        url: url,
        headers: {
            Authorization: token_type + ' ' + access_token
        }
    };

    return this.REST.request(options, "200", true);
};

/**
 * Associate Service with an App
 * {@link http://apidocs.cloudfoundry.org/217/service_bindings/create_a_service_binding.html}
 * @param  {String} token_type   [Authentication type]
 * @param  {String} access_token [Authentication token]
 * @param  {String} service_guid [service_guid]
 * @param  {String} app_guid     [app_guid]
 * @return {JSON}              [return a JSON response]
 */
ServiceBindings.prototype.associateServiceWithApp = function (token_type, access_token, service_guid, app_guid) {
    "use strict";
    var url = this.API_URL + "/v2/service_bindings";
    var options = {
        method: 'POST',
        url: url,
        headers: {
            Authorization: token_type + ' ' + access_token
        },
        form: JSON.stringify({
            service_instance_guid: service_guid,
            app_guid: app_guid
        })
    };

    return this.REST.request(options, "201", true);
};

/**
 * Remove  a Service Binding
 * {@link http://apidocs.cloudfoundry.org/217/service_bindings/delete_a_particular_service_binding.html}
 * @param  {String} token_type   [Authentication type]
 * @param  {String} access_token [Authentication token]
 * @param  {String} service_guid [service_guid]
 */
ServiceBindings.prototype.remove = function (token_type, access_token, service_guid) {
    "use strict";
    var url = this.API_URL + "/v2/service_bindings/" + service_guid;
    var options = {
        method: 'DELETE',
        url: url,
        headers: {
            Authorization: token_type + ' ' + access_token
        }
    };

    return this.REST.request(options, "204 ", false);
};

module.exports = ServiceBindings;
