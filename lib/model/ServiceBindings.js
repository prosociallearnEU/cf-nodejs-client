/*jslint node: true*/
/*globals Promise:true*/
"use strict";

var HttpUtils = require('../utils/HttpUtils');

function ServiceBindings(_API_URL) {
    this.API_URL = _API_URL;
    this.REST = new HttpUtils();
}

/**
 * http://apidocs.cloudfoundry.org/217/service_bindings/list_all_service_bindings.html
 * 
 * @param  {[type]} token_type   [description]
 * @param  {[type]} access_token [description]
 * @return {[type]}              [description]
 */
ServiceBindings.prototype.getServiceBindings = function (token_type, access_token) {

    var url = this.API_URL + "/v2/service_bindings";
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
 * http://apidocs.cloudfoundry.org/217/service_bindings/retrieve_a_particular_service_binding.html
 * 
 * @param  {[type]} token_type          [description]
 * @param  {[type]} access_token        [description]
 * @param  {[type]} serviceBinding_guid [description]
 * @return {[type]}                     [description]
 */
ServiceBindings.prototype.getServiceBinding = function (token_type, access_token, serviceBinding_guid) {

    var url = this.API_URL + "/v2/service_bindings/" + serviceBinding_guid;
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
 * http://apidocs.cloudfoundry.org/217/service_bindings/create_a_service_binding.html
 * 
 * @param  {[type]} token_type   [description]
 * @param  {[type]} access_token [description]
 * @param  {[type]} service_guid [description]
 * @param  {[type]} app_guid     [description]
 * @return {[type]}              [description]
 */
ServiceBindings.prototype.associateServiceWithApp = function (token_type, access_token, service_guid, app_guid) {

    var url = this.API_URL + "/v2/service_bindings";
    var options = {
        method: 'POST',
        url: url,
        headers: {
            'Authorization': token_type + ' ' + access_token
        },
        form : JSON.stringify({
            "service_instance_guid": service_guid,
            "app_guid": app_guid
        })
    };

    return this.REST.request(options, "201", true);
};

/**
 * http://apidocs.cloudfoundry.org/217/service_bindings/delete_a_particular_service_binding.html
 * 
 * @param {[type]} token_type   [description]
 * @param {[type]} access_token [description]
 * @param {[type]} service_guid [description]
 */
ServiceBindings.prototype.removeServiceBinding = function (token_type, access_token, service_guid) {

    var url = this.API_URL + "/v2/service_bindings/" + service_guid;
    var options = {
        method: 'DELETE',
        url: url,
        headers: {
            'Authorization': token_type + ' ' + access_token
        }
    };

    return this.REST.request(options, "204 ", false);
};

module.exports = ServiceBindings;
