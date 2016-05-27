"use strict";

const HttpUtils = require("../../utils/HttpUtils");
const HttpStatus = require("../../utils/HttpStatus");
const ws = require('ws');

/**
 * Manage Logs in Cloud Foundry
 * {@link https://docs.pivotal.io/pivotalcf/devguide/deploy-apps/streaming-logs.html}
 * @constructor
 */
class Logs {

    /**
     * Constructor
     * @constructor
     * @returns {void}
     */
    constructor() {
        this.REST = new HttpUtils();
        this.HttpStatus = HttpStatus;
    }

    /**
     * Set endpoint
     * @param {String} endPoint [Logging endpoint]
     * @returns {void}
     */
    setEndPoint (endPoint) {

        this.LOG_API_URL = endPoint;
    }

    /**
     * Set token
     * @param {JSON} token [Oauth token from UAA]
     * @returns {void}
     */
    setToken (token) {

        this.UAA_TOKEN = token;
    }

    /**
     * Method used to return data from CF log services.
     * {@link http://docs.run.pivotal.io/devguide/deploy-apps/streaming-logs.html}
     *
     * @param  {String} appGuid     [app guid]
     * @return {JSon}          [UAA Response]
     */
    getRecent (appGuid) {

        var http_url = this.LOG_API_URL.replace('wss://', 'https://');
        var options = {
            url: http_url + '/recent?app=' + appGuid,
            headers: {
                'transfer-encoding': '',
                'Authorization': `${this.UAA_TOKEN.token_type} ${this.UAA_TOKEN.access_token}`,
                'Content-Type': 'text'
            }
        };

        return this.REST.request(options, this.HttpStatus.OK, false);
    }

}

module.exports = Logs;