var HttpUtils = require("../../utils/HttpUtils");

/**
 * Manages Services on Cloud Foundry
 * @param {String} endPoint [CC endpoint]
 * @constructor
 */
function Services(endPoint) {
    "use strict";
    this.API_URL = endPoint;
    this.REST = new HttpUtils();
}

/**
 * Set endpoint
 * @param {String} endPoint [CC endpoint]
 * @returns {void}
 */
Services.prototype.setEndPoint = function (endPoint) {
    "use strict";
    this.API_URL = endPoint;
};

/**
 * Get Services
 * {@link https://apidocs.cloudfoundry.org/226/services/list_all_services.html}
 * @param  {String} token_type   [Authentication type]
 * @param  {String} access_token [Authentication token]
 * @param  {String} filter [query string]
 * @return {JSON}              [return a JSON response]
 */
Services.prototype.getServices = function (token_type, access_token, filter) {
    "use strict";
    var url = this.API_URL + "/v2/services";
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
 * Get a Service
 * {@link https://apidocs.cloudfoundry.org/226/services/retrieve_a_particular_service.html}
 * @param  {String} token_type   [Authentication type]
 * @param  {String} access_token [Authentication token]
 * @param  {String} service_guid         [servicePlan guid]
 * @return {JSON}              [return a JSON response]
 */
Services.prototype.getService = function (token_type, access_token, service_guid) {
    "use strict";
    var url = this.API_URL + "/v2/services/" + service_guid;
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
 * List all Service Plans for a Service
 * {@link https://apidocs.cloudfoundry.org/226/services/list_all_service_plans_for_the_service.html}
 * @param  {String} token_type   [Authentication type]
 * @param  {String} access_token [Authentication token]
 * @param  {String} service_guid         [service guid]
 * @return {JSON}              [return a JSON response]
 */
Services.prototype.getServicePlans = function (token_type, access_token, service_guid) {
    "use strict";
    var url = this.API_URL + "/v2/services/" + service_guid + "/service_plans";
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
 * Remove a Service
 * {@link https://apidocs.cloudfoundry.org/226/services/delete_a_particular_service.html}
 * @param  {String} token_type   [Authentication type]
 * @param  {String} access_token [Authentication token]
 * @param  {String} service_guid [service_guid]
 * @return {String}              [return REST response]
 */
Services.prototype.remove = function (token_type, access_token, service_guid) {
    "use strict";
    var url = this.API_URL + "/v2/services/" + service_guid;
    var options = {
        method: "DELETE",
        url: url,
        headers: {
            Authorization: token_type + " " + access_token
        }
    };

    return this.REST.request(options, "204", false);
};

module.exports = Services;
