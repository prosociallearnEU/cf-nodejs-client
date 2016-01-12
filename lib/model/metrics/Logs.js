"use strict";

const HttpUtils = require("../../utils/HttpUtils");
const HttpCodes = require("../../utils/HttpCodes");

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
        this.HttpCodes = HttpCodes;
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

        const url = `${this.LOG_API_URL}/recent?app=${appGuid}`;
        const options = {
            url: url,
            headers: {
                Authorization: `${this.UAA_TOKEN.token_type} ${this.UAA_TOKEN.access_token}`
            }
        };

        return this.REST.request(options, this.HttpCodes.OK, false);
    }

}

module.exports = Logs;