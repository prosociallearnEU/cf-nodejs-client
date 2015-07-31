/*jslint node: true*/
/*globals Promise:true*/
"use strict";

//TODO: Check if exist another way.
var request = require('request');

/**
 * [HttpUtils description]
 */
function HttpUtils(){

}

/**
 * [get description]
 * @param  {[type]} url     [description]
 * @param  {[type]} headers [description]
 * @param  {[type]} body    [description]
 * @return {[type]}         [description]
 */
HttpUtils.prototype.get = function(url,headers,body){

    return new Promise(function (resolve, reject) {
        request.get({ url: url, headers: headers, form: body }, function (error, response, body) {
            var result = JSON.parse(body);
            if (!error && response.statusCode == 200) {
                return resolve(result);
            } else {
                return reject(body);
            }
        });
    }); 

}

//TODO: Refactor
HttpUtils.prototype.get2 = function(url,headers,qs){

    return new Promise(function (resolve, reject) {
        request.get({ url: url, headers: headers, qs: qs }, function (error, response, body) {
            var result = JSON.parse(body);
            if (!error && response.statusCode == 200) {
                return resolve(result);
            } else {
                return reject(body);
            }
        });
    }); 

}

/**
 * [post description]
 * @param  {[type]} url     [description]
 * @param  {[type]} headers [description]
 * @param  {[type]} body    [description]
 * @return {[type]}         [description]
 */
HttpUtils.prototype.post = function(url,headers,body){

    return new Promise(function (resolve, reject) {
        request.post({ url: url, headers: headers, form: body  }, function (error, response, body) {
            var result = JSON.parse(body);
            if (!error && response.statusCode == 200) {
                return resolve(result);
            } else {
                return reject(body);
            }
        });
    });

}

HttpUtils.prototype.post2 = function(url,headers,body){

    return new Promise(function (resolve, reject) {
        request.post({ url: url, headers: headers, form: body  }, function (error, response, body) {
            var result = JSON.parse(body);
            /*
            if (!error && response.statusCode == 200) {
                return resolve(result);
            } else {
                return reject(body);
            }
            */
            return resolve(result);
        });
    });

}

HttpUtils.prototype.put = function(url,headers,body){

    return new Promise(function (resolve, reject) {
        request.put({ url: url, headers: headers, form: body  }, function (error, response, body) {
            var result = JSON.parse(body);
            console.log(response.statusCode);
            if (!error && response.statusCode == 200) {
                return resolve(result);
            } else {
                return reject(body);
            }
        });
    });

}

HttpUtils.prototype.put2 = function(url,headers,body){

    return new Promise(function (resolve, reject) {
        request.put({ url: url, headers: headers, form: body  }, function (error, response, body) {
            var result = JSON.parse(body);
            console.log(response.statusCode);
            if (!error && response.statusCode == 201) {
                return resolve(result);
            } else {
                return reject(body);
            }
        });
    });

}

/**
 * [del description]
 * http://apidocs.cloudfoundry.org/213/apps/delete_a_particular_app.html
 *
 * The response is not homogeneus in CF REST API. 
 * Every method in the API should return the same structure.
 * 
 * @param  {[type]} url     [description]
 * @param  {[type]} headers [description]
 * @param  {[type]} body    [description]
 * @return {[type]}         [description]
 */
HttpUtils.prototype.del = function(url,headers,body){

    return new Promise(function (resolve, reject) {
        request.del({ url: url, headers: headers, form: body  }, function (error, response, body) {
            var result = body;//JSON.parse(body);
            console.log(response.statusCode);
            if (!error && response.statusCode == 204) {
                return resolve(result);
            } else {
                return reject(body);
            }
        });
    });
}

module.exports = HttpUtils;