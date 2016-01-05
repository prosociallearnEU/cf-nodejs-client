"use strict";

const CloudControllerBase = require("./CloudControllerBase");

/**
 * This class manages the entry point with the Cloud Foundry Controller.
 * {@link https://github.com/cloudfoundry/cloud_controller_ng}
 */
class CloudController extends CloudControllerBase {

    /**
     * @param {String} endPoint [CC endpoint]
     * @constructor
     * @returns {void}
     */
    constructor(endPoint) {
        super(endPoint);
    }

    /**
     * Get information from Cloud Controller
     * {@link http://apidocs.cloudfoundry.org/214/info/get_info.html}
     * @return {Json} [description]
     */
    getInfo () {

        const url = `${this.API_URL}/v2/info`;
        const options = {
            method: "GET",
            url: url
        };

        return this.REST.request(options, this.HttpCodes.OK, true);
    }

}

module.exports = CloudController;
