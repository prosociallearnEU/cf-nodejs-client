/*jslint node: true*/
/*globals Promise:true*/
"use strict";

var HttpUtils = require('../utils/HttpUtils');

function CloudFoundry(endPoint) {
    if (typeof endPoint === 'string') {
        this.API_URL = endPoint;
    }
    this.REST = new HttpUtils();
}

/**
 * [setEndpoint description]
 * 
 * @param {[type]} _API_URL [description]
 */
CloudFoundry.prototype.setEndPoint = function (_API_URL) {
    this.API_URL = _API_URL;
};

/**
 * http://apidocs.cloudfoundry.org/214/info/get_info.html
 * 
 * @return {[type]} [description]
 */
CloudFoundry.prototype.getInfo = function () {

    var url = this.API_URL + "/v2/info";
    var options = {
        method: 'GET',
        url: url
    };

    return this.REST.request(options, "200", true);
};

/**
 * 
 * @param  {[type]} endPoint [description]
 * @param  {[type]} user     [description]
 * @param  {[type]} password [description]
 * @return {[type]}          [description]
 */
CloudFoundry.prototype.login = function (endPoint, username, password) {

    var url = endPoint + "/oauth/token";

    var options = {
        method: 'POST',
        url: url,
        headers: {
            'Authorization': 'Basic Y2Y6',
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        form : {
            grant_type: "password",
            client_id: "cf",
            username: username,
            password: password
        }
    };

    return this.REST.request(options, "200", true);
};

CloudFoundry.prototype.loginRefresh = function (endPoint, refreshToken) {

    var url = endPoint + "/oauth/token";

    var options = {
        method: 'POST',
        url: url,
        headers: {
            'Authorization': 'Basic Y2Y6',
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        form : {
            grant_type: "refresh_token",
            refresh_token: refreshToken
        }
    };

    return this.REST.request(options, "200", true);
};

module.exports = CloudFoundry;
