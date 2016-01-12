"use strict";

const CloudControllerBase = require("./CloudControllerBase");

/**
 * This class manages the entry point with the Cloud Foundry Controller.
 * {@link https://github.com/cloudfoundry/cloud_controller_ng}
 */
class CloudController extends CloudControllerBase {

    /**
     * @param {String} endPoint [CC endpoint]
     * @returns {void}
     * @constructor
     */
    constructor(endPoint) {
        super(endPoint);
    }

    /**
     * Get information from Cloud Controller
     * {@link http://apidocs.cloudfoundry.org/214/info/get_info.html}
     *
     * @return {JSON} [Return all enabled services to use]
     */
    getInfo () {

        const url = `${this.API_URL}/v2/info`;
        const options = {
            method: "GET",
            url: url
        };

        return this.REST.request(options, this.HttpCodes.OK, true);
    }

    /**
     * Get information about all featured flags.
     * {@link http://apidocs.cloudfoundry.org/214/feature_flags/get_all_feature_flags.html}
     *
     * @return {JSON} [Response]
     */
    getFeaturedFlags() {

        const url = `${this.API_URL}/v2/config/feature_flags`;
        const options = {
            method: "GET",
            url: url,
            headers: {
                Authorization: `${this.UAA_TOKEN.token_type} ${this.UAA_TOKEN.access_token}`
            }
        };

        return this.REST.request(options, this.HttpCodes.OK, true);
    }

    /**
     * Get information about a determinated featured flag.
     * {@link http://apidocs.cloudfoundry.org/214/feature_flags/get_the_diego_docker_feature_flag.html}
     *
     * @param  {String} flag [flag]
     * @return {JSON}      [Response]
     */
    getFeaturedFlag(flag) {

        const url = `${this.API_URL}/v2/config/feature_flags/${flag}`;
        const options = {
            method: "GET",
            url: url,
            headers: {
                Authorization: `${this.UAA_TOKEN.token_type} ${this.UAA_TOKEN.access_token}`
            }
        };

        return this.REST.request(options, this.HttpCodes.OK, true);
    }

    /**
     * Enable a feature flag
     * {@link http://apidocs.cloudfoundry.org/214/feature_flags/set_a_feature_flag.html }
     *
     * @param {String} flag [flag to make the request]
     * @return {JSON}      [Response]
     */
    setFeaturedFlag(flag) {

        const url = `${this.API_URL}/v2/config/feature_flags/${flag}`;
        const options = {
            method: "PUT",
            url: url,
            headers: {
                Authorization: `${this.UAA_TOKEN.token_type} ${this.UAA_TOKEN.access_token}`
            }
        };

        return this.REST.request(options, this.HttpCodes.OK, true);
    }

}

module.exports = CloudController;
