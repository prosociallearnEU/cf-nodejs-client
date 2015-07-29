
/*jslint node: true*/
/*globals Promise:true*/
"use strict";

var httpUtils = require('../utils/HttpUtils');

function Events(_API_URL){
    this.API_URL = _API_URL;
    this.REST = new httpUtils();
}

/**
 * [getEvents description]
 * @param  {[type]} token_type   [description]
 * @param  {[type]} access_token [description]
 * @return {[type]}              [description]
 */
Events.prototype.getEvents = function(token_type,access_token){

    var url = this.API_URL + "/v2/events";
    var headers = {
        'Authorization': token_type + " " + access_token,
    };
    var body = {};    

    return this.REST.get(url, headers, body);   
}

module.exports = Events;