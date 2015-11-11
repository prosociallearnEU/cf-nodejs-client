/*jslint node: true*/

var Promise = require('bluebird');
var HttpUtils = require('../../utils/HttpUtils');

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
 * @param  {String} username     [username]
 * @param  {String} password [password]
 * @param  {String} app_guid     [app guid]
 * @return {JSon}          [UAA Response]
 */
Logs.prototype.getRecent = function (endpoint, token_type, access_token, app_guid) {
    "use strict";
    var url = endpoint + '/recent?app=' + app_guid;
    var options = {
        url: url,
        headers: {
            Authorization: token_type + ' ' + access_token
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
 * Improve the output from recent method.
 * @param  {String} data [description]
 * @return {String}      [description]
 */
Logs.prototype.cleanResult = function (data) {
    "use strict";
    data = data.split('\n\n');
    if (data.length > 1) {
        data.splice(0, 1);
    }
    var i = 0;
    var value = null;
    var end = null;
    for (i = 0; i < data.length; i++) {
        value = data[i];
        value = value.substr(2, value.length - 1);
        end = value.indexOf(String.fromCharCode(16));
        data[i] = value.substr(0, end);
    }
    return data.join('\n\n');
};

module.exports = Logs;