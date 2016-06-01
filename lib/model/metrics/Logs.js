"use strict";

const HttpUtils = require("../../utils/HttpUtils");
const HttpStatus = require("../../utils/HttpStatus");

const builder = require("protobufjs").loadProtoFile("log_message.proto");

//Build the logmessage package from the log_message.proto file
const LOG_MESSAGE = builder.build("logmessage");

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

        const url = `${this.LOG_API_URL}/recent?app=${appGuid}`;
        const options = {
            url: url,
            headers: {
                Authorization: `${this.UAA_TOKEN.token_type} ${this.UAA_TOKEN.access_token}`
            },
            encoding: null
        };

        return this.REST.request(options, this.HttpStatus.OK, false).then((response) => {
            //The response is an array of protocol buffer encoded messages
            return response.map((message) => {
                //For each message, decode it and also convert the binary text to a string
                const $message = LOG_MESSAGE.LogMessage.decode(message);

                //message is a buffer, convert to a string for simplicity
                $message.message = $message.message.toString("utf8");
                //Came across the division by 1e6 on Bluemix.
                $message.timestamp = Math.round($message.timestamp.toNumber() / 1e6);
                return $message;
            }).sort((l, r) => l.timestamp - r.timestamp);
        });
    }

}

module.exports = Logs;