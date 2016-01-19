"use strict";

const CloudControllerBase = require("./CloudControllerBase");

/**
 * Manages Service Plan on Cloud Foundry
 */
class ServicePlans extends CloudControllerBase {

    /**
     * @param {String} endPoint [CC endpoint]
     * @constructor
     * @returns {void}
     */
    constructor(endPoint) {
        super(endPoint);
    }

    /**
     * Get Service Plans
     * {@link https://apidocs.cloudfoundry.org/226/service_plans/list_all_service_plans.html}
     *
     * @param  {String} filter         [Search options]
     * @return {JSON}              [return a JSON response]
     */
    getServicePlans (filter) {

        const url = `${this.API_URL}/v2/service_plans`;
        let qs = {};

        if (filter) {
            qs = filter;
        }
        const options = {
            method: "GET",
            url: url,
            headers: {
                Authorization: `${this.UAA_TOKEN.token_type} ${this.UAA_TOKEN.access_token}`
            },
            qs: qs
        };

        return this.REST.request(options, this.HttpStatus.OK, true);
    }

    /**
     * Get a Service Plan
     * {@link https://apidocs.cloudfoundry.org/226/service_plans/retrieve_a_particular_service_plan.html}
     *
     * @param  {String} guid         [servicePlan guid]
     * @return {JSON}              [return a JSON response]
     */
    getServicePlan (guid) {

        const url = `${this.API_URL}/v2/service_plans/${guid}`;
        const options = {
            method: "GET",
            url: url,
            headers: {
                Authorization: `${this.UAA_TOKEN.token_type} ${this.UAA_TOKEN.access_token}`
            }
        };

        return this.REST.request(options, this.HttpStatus.OK, true);
    }

    /**
     * List all Service Instances for a Service Plan
     * {@link https://apidocs.cloudfoundry.org/226/service_plans/list_all_service_instances_for_the_service_plan.html}
     *
     * @param  {String} guid         [servicePlan guid]
     * @return {JSON}              [return a JSON response]
     */
    getServicePlanInstances (guid) {

        const url = `${this.API_URL}/v2/service_plans/${guid}/service_instances`;
        const options = {
            method: "GET",
            url: url,
            headers: {
                Authorization: `${this.UAA_TOKEN.token_type} ${this.UAA_TOKEN.access_token}`
            }
        };

        return this.REST.request(options, this.HttpStatus.OK, true);
    }

    /**
     * Remove a Service Plan
     * {@link https://apidocs.cloudfoundry.org/226/service_plans/delete_a_particular_service_plans.html}
     *
     * @param  {String} guid [servicePlan_guid]
     * @return {JSON}              [return a JSON response]
     */
    remove (guid) {

        const url = `${this.API_URL}/v2/service_plans/${guid}`;
        const options = {
            method: "DELETE",
            url: url,
            headers: {
                Authorization: `${this.UAA_TOKEN.token_type} ${this.UAA_TOKEN.access_token}`
            }
        };

        return this.REST.request(options, this.HttpStatus.NO_CONTENT, false);
    }

}

module.exports = ServicePlans;
