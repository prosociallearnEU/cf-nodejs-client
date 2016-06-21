"use strict";

const HttpUtils = require("../../utils/HttpUtils");
const HttpStatus = require("../../utils/HttpStatus");

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
        this.HttpStatus = HttpStatus;
    }

    /**
     * Set endpoint
     * @param {String} endPoint [CC endpoint]
     * @returns {void}
     */
    setEndPoint (endPoint) {

        this.API_URL = endPoint;
    }

    /**
     * Set token
     * @param {JSON} token [Oauth token from UAA]
     * @returns {void}
     */
    setToken (token) {

        this.UAA_TOKEN = token;
    }
}

module.exports = CloudControllerBase;
