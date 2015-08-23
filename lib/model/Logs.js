/*jslint node: true*/
/*globals Promise:true*/
"use strict";

var WebSocket = require('ws');

function Logs() {
    this.logging_endpoint = null;
}

Logs.prototype.setEndpoint = function (logging_endpoint) {
    this.logging_endpoint = logging_endpoint;
};

Logs.prototype.getTail = function (token_type, access_token, app_guid) {

    var url = this.logging_endpoint + '/tail/?app=' + app_guid;
    //console.log(url);
    var options = {
        headers: {
            'Authorization': token_type + ' ' + access_token
        }
    };
    //console.log(options);

    return new Promise(function (resolve, reject) {

        try {
            var ws = new WebSocket(url, options);

            ws.on('connection', function connection(ws) {

                ws.on('message', function incoming(message) {
                    return resolve(message);
                    console.log('received: %s', message);
                });
             
                ws.close();
            });

        } catch (error) {
            return reject(error);
        }

    });
};

module.exports = Logs;