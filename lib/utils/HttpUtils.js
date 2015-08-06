/*jslint node: true*/
/*globals Promise:true*/
"use strict";

var request = require('request');

function HttpUtils(){

}

HttpUtils.prototype.request = function(method,url,headers,qs,body,httpStatusAssert){

    var result = null;

    return new Promise(function (resolve, reject) {

        request({ method: method, url: url, headers: headers, qs: qs, form: body  }, function (error, response, body) {
            if(error){
                return reject(error);
            }
            result = JSON.parse(body);
            //console.log(response.statusCode);
            if (!error && response.statusCode == httpStatusAssert) {
                return resolve(result);
            } else {
                return reject(body);
            }
        });

    });

}

//TODO: Refactor the name. The unique difference in compare with method request is the way to return the value.
//This method return data in text plain, not in JSON format.
HttpUtils.prototype.request2 = function(method,url,headers,qs,body,httpStatusAssert){

    return new Promise(function (resolve, reject) {
        request({ method: method, url: url, headers: headers, qs: qs, form: body  }, function (error, response, body) {
            if(error){
                return reject(error);
            }
            //console.log(response.statusCode);
            if (!error && response.statusCode == httpStatusAssert) {
                return resolve(body);
            } else {
                return reject(body);
            }
        });
    });

}

HttpUtils.prototype.DEBUG = function(method,url,headers,qs,body2,httpStatusAssert){
    /*
    var resources = [

        {
            //"fn":"path/to/content.txt",
            "size":123,
            "sha1":"b907173290db6a155949ab4dc9b2d019dea0c901"
        },{
            //"fn":"path/to/code.jar",
            "size":123,
            "sha1":"ff84f89760317996b9dd180ab996b079f418396f"
        }];
        */

var resources = [
        {
    "sha1": "3722059cc37f7a56db064c1911f063da826cb211",
    "size": 36
  },
  {
    "sha1": "a9993e364706816aba3e25717850c26c9cd0d89d",
    "size": 1
  }
];

    //GOOD Idea to improve this class.
    var options = {
      method: 'PUT',
      url: url,
      headers: headers,
      body:JSON.stringify(resources)
    };

    return new Promise(function (resolve, reject) {
        request(options, function (error, response, body) {
            if(error){
                return reject(error);
            }
            console.log(response.statusCode);
            console.log(body);
            return resolve(body);
        });
    });
}

module.exports = HttpUtils;
