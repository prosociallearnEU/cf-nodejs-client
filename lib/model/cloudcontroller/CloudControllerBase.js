"use strict";

const HttpUtils = require("../../utils/HttpUtils");

/**
 *
 */
class CloudControllerBase {

    /**
     * @param {String} endPoint [CC endpoint]
     * @constructor
     * @returns {void}
     */
    constructor(endPoint) {
        this.API_URL = endPoint;
        this.REST = new HttpUtils();
    }

    /**
     * Set endpoint
     * @param {String} endPoint [CC endpoint]
     * @returns {void}
     */
    setEndPoint (endPoint) {

        this.API_URL = endPoint;
    }
}

module.exports = CloudControllerBase;