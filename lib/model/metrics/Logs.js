"use strict";

const Promise = require("bluebird");
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
        const self = this;

        return this.REST.request(options, this.HttpCodes.OK, false).then(function (result) {
            return new Promise(function (resolve) {
                return resolve(self.cleanResult(result));
            });
        });
    }

    /**
     * Private method to improve the output from recent method.
     *
     * @param  {String} data [data]
     * @return {String}      [description]
     */
    cleanResult (data) {

        let i = 0;
        let value = null;
        let end = null;
        const data2 = data.split("\n\n");

        if (data2.length > 1) {
            data2.splice(0, 1);
        }

        for (i = 0; i < data2.length; i += 1) {
            value = data2[i];
            value = value.substr(2, value.length - 1);
            end = value.indexOf(String.fromCharCode(16));
            data2[i] = value.substr(0, end);
        }

        return data2.join("\n\n");
    }

}

module.exports = Logs;