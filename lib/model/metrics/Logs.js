"use strict";

const Promise = require("bluebird");
const HttpUtils = require("../../utils/HttpUtils");

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
    }

    /**
     * Method used to return data from CF log services.
     * {@link http://docs.run.pivotal.io/devguide/deploy-apps/streaming-logs.html}
     *
     * @param  {String} endPoint [logging_enpoint]
     * @param  {String} tokenType   [Authentication type]
     * @param  {String} accessToken [Authentication token]
     * @param  {String} appGuid     [app guid]
     * @return {JSon}          [UAA Response]
     */
    getRecent (endPoint, tokenType, accessToken, appGuid) {

        var url = endPoint + "/recent?app=" + appGuid;
        var options = {
            url: url,
            headers: {
                Authorization: tokenType + " " + accessToken
            }
        };
        var self = this;

        return this.REST.request(options, "200", false).then(function (result) {
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