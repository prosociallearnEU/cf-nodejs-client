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

module.exports = ServiceBindings;
