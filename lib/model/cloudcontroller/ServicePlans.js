var HttpUtils = require("../../utils/HttpUtils");

/**
 * Manages Service Plan on Cloud Foundry
 * @param {String} endPoint [CC endpoint]
 * @constructor
 */
function ServicePlans(endPoint) {
    "use strict";
    this.API_URL = endPoint;
    this.REST = new HttpUtils();
}

/**
 * Set endpoint
 * @param {String} endPoint [CC endpoint]
 * @returns {void}
 */
ServicePlans.prototype.setEndPoint = function (endPoint) {
    "use strict";
    this.API_URL = endPoint;
};

/**
 * Get Service Plans
 * {@link https://apidocs.cloudfoundry.org/226/service_plans/list_all_service_plans.html}
 * @param  {String} token_type   [Authentication type]
 * @param  {String} access_token [Authentication token]
 * @param  {String} filter         [Search options]
 * @return {JSON}              [return a JSON response]
 */
ServicePlans.prototype.getServicePlans = function (token_type, access_token, filter) {
    "use strict";
    var url = this.API_URL + "/v2/service_plans";
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
 * Get a Service Plan
 * {@link https://apidocs.cloudfoundry.org/226/service_plans/retrieve_a_particular_service_plan.html}
 * @param  {String} token_type   [Authentication type]
 * @param  {String} access_token [Authentication token]
 * @param  {String} servicePlan_guid         [servicePlan guid]
 * @return {JSON}              [return a JSON response]
 */
ServicePlans.prototype.getServicePlan = function (token_type, access_token, servicePlan_guid) {
    "use strict";
    var url = this.API_URL + "/v2/service_plans/" + servicePlan_guid;
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
 * List all Service Instances for a Service Plan
 * {@link https://apidocs.cloudfoundry.org/226/service_plans/list_all_service_instances_for_the_service_plan.html}
 * @param  {String} token_type   [Authentication type]
 * @param  {String} access_token [Authentication token]
 * @param  {String} servicePlan_guid         [servicePlan guid]
 * @return {JSON}              [return a JSON response]
 */
ServicePlans.prototype.getServicePlanInstances = function (token_type, access_token, servicePlan_guid) {
    "use strict";
    var url = this.API_URL + "/v2/service_plans/" + servicePlan_guid + "/service_instances";
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
 * Remove a Service Plan
 * {@link https://apidocs.cloudfoundry.org/226/service_plans/delete_a_particular_service_plans.html}
 * @param  {String} token_type   [Authentication type]
 * @param  {String} access_token [Authentication token]
 * @param  {String} servicePlan_guid [servicePlan_guid]
 * @return {JSON}              [return a JSON response]
 */
ServicePlans.prototype.remove = function (token_type, access_token, servicePlan_guid) {
    "use strict";
    var url = this.API_URL + "/v2/service_plans/" + servicePlan_guid;
    var options = {
        method: "DELETE",
        url: url,
        headers: {
            Authorization: token_type + " " + access_token
        }
    };

    return this.REST.request(options, "204", false);
};

module.exports = ServicePlans;
