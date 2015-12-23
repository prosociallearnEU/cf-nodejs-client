/*jslint node: true*/
/*eslint no-param-reassign: 1*/

var Promise = require("bluebird");
var HttpUtils = require("../../utils/HttpUtils");

/**
 * Manage Logs in Cloud Foundry
 * {@link https://docs.pivotal.io/pivotalcf/devguide/deploy-apps/streaming-logs.html}
 * @constructor
 */
function Logs() {
    "use strict";
    this.REST = new HttpUtils();
}

/**
 * Method used to return data from CF log services.
 * {@link http://docs.run.pivotal.io/devguide/deploy-apps/streaming-logs.html}
 * @param  {String} endPoint [logging_enpoint]
 * @param  {String} tokenType   [Authentication type]
 * @param  {String} accessToken [Authentication token]
 * @param  {String} appGuid     [app guid]
 * @return {JSon}          [UAA Response]
 */
Logs.prototype.getRecent = function (endPoint, tokenType, accessToken, appGuid) {
    "use strict";
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
};

/**
 * Private method to improve the output from recent method.
 * @param  {String} data [description]
 * @return {String}      [description]
 */
Logs.prototype.cleanResult = function (data) {
    "use strict";
    var i = 0;
    var value = null;
    var end = null;

    //TODO: Refactor this method to avoid the problem: no-param-reassign
    data = data.split("\n\n");
    if (data.length > 1) {
        data.splice(0, 1);
    }

    for (i = 0; i < data.length; i += 1) {
        value = data[i];
        value = value.substr(2, value.length - 1);
        end = value.indexOf(String.fromCharCode(16));
        data[i] = value.substr(0, end);
    }
    return data.join("\n\n");
};

module.exports = Logs;