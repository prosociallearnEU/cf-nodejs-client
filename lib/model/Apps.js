/*
Copyright 2015 Juan Antonio Breña Moral.

Licensed under the MIT License;
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

     http://choosealicense.com/licenses/mit/

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

/*jslint node: true*/
/*globals Promise:true*/
"use strict";

//TODO: Refactor dependencies
var request = require('request'),
    FormData = require('form-data');   
var httpUtils = require('../utils/HttpUtils');

function Apps(_API_URL){
    this.API_URL = _API_URL;
    this.REST = new httpUtils();
    this.dataRemoteFile = null;
    this.manifeset = null;
}

/**
 * http://apidocs.cloudfoundry.org/213/apps/list_all_apps.html
 * 
 * @param  {[type]} token_type   [description]
 * @param  {[type]} access_token [description]
 * @param  {[type]} appName      [description]
 * @return {[type]}              [description]
 */
Apps.prototype.getApps = function(token_type,access_token){

    var url = this.API_URL + "/v2/apps";
    var headers = {
        'Authorization': token_type + " " + access_token,
    };
    var qs = { };    
    var body = { }; 

    //return this.REST.get(url, headers, body);
    return this.REST.request("GET",url, headers, qs, body,"200");  
}

/**
 * http://apidocs.cloudfoundry.org/213/apps/list_all_apps.html
 * 
 * @param  {[type]} token_type   [description]
 * @param  {[type]} access_token [description]
 * @param  {[type]} appName      [description]
 * @return {[type]}              [description]
 */
Apps.prototype.getAppByName = function(token_type,access_token,appName){

    var url = this.API_URL + "/v2/apps";
    var headers = {
        'Authorization': token_type + " " + access_token,
    };
    var qs = { };    
    var body = {
        "name": appName
    }

    return this.REST.request("GET",url, headers, qs, body,"200");
}

/**
 * http://apidocs.cloudfoundry.org/214/apps/creating_an_app.html
 * 
 * @param  {[type]} token_type   [description]
 * @param  {[type]} access_token [description]
 * @param  {[type]} name         [description]
 * @param  {[type]} space_guid   [description]
 * @param  {[type]} manifest     [description]
 * @return {[type]}              [description]
 */
Apps.prototype.createApp = function(token_type,access_token,name,space_guid,manifest){

    var url = this.API_URL + "/v2/apps";
    var headers = {
        'Authorization': token_type + " " + access_token,
        'Content-Type': 'application/x-www-form-urlencoded'
    };
    var qs = { };
    var body = JSON.stringify({
        "name": name,
        "space_guid": space_guid,
        "buildpack" : manifest.applications[0].buildpack
    })

    console.log(manifest);
    console.log(manifest.applications[0].buildpack);
    console.log(body);
   
    return this.REST.request("POST",url, headers, qs, body,"201");
}

/**
 * http://apidocs.cloudfoundry.org/214/apps/updating_an_app.html
 * 
 * @param  {[type]} token_type   [description]
 * @param  {[type]} access_token [description]
 * @param  {[type]} appGuid      [description]
 * @return {[type]}              [description]
 */
Apps.prototype.stopApp = function(token_type,access_token,appGuid){

    var url = this.API_URL + '/v2/apps/' + appGuid;
    var headers = {
        'Authorization': token_type + " " + access_token,
        'Content-Type': 'application/x-www-form-urlencoded'
    };
    var qs = { };
    var body = JSON.stringify({
            'state': 'STOPPED'
    })

    return this.REST.request("PUT",url, headers, qs, body,"201"); 
}

/**
 * http://apidocs.cloudfoundry.org/214/apps/updating_an_app.html
 * 
 * @param  {[type]} token_type   [description]
 * @param  {[type]} access_token [description]
 * @param  {[type]} app_Guid     [description]
 * @return {[type]}              [description]
 */
Apps.prototype.startApp = function(token_type,access_token,app_Guid){

    var url = this.API_URL + '/v2/apps/' + app_Guid;
    var headers = {
        'Authorization': token_type + " " + access_token,
        'Content-Type': 'application/x-www-form-urlencoded'
    };
    var qs = { };
    var body = JSON.stringify({
            'state': 'STARTED'
    })

    return this.REST.request("PUT",url, headers, qs, body,"201");
}

/**
 * http://apidocs.cloudfoundry.org/214/apps/delete_a_particular_app.html
 * 
 * @param  {[type]} token_type   [description]
 * @param  {[type]} access_token [description]
 * @param  {[type]} appGuid      [description]
 * @return {[type]}              [description]
 */
Apps.prototype.deleteApp = function (token_type,access_token,appGuid) {

    var url = this.API_URL + '/v2/apps/' + appGuid;
    var headers = {
        'Authorization': token_type + " " + access_token,
        'Content-Type': 'application/x-www-form-urlencoded'
    };
    var qs = { };    
    var body = { };

    return this.REST.request2("DELETE",url, headers, qs, body,"204");
}

/**
 * http://apidocs.cloudfoundry.org/214/apps/get_detailed_stats_for_a_started_app.html
 * 
 * @param  {[type]} token_type   [description]
 * @param  {[type]} access_token [description]
 * @param  {[type]} appGuid      [description]
 * @return {[type]}              [description]
 */
Apps.prototype.checkStat = function(token_type,access_token,appGuid){

    var url = this.API_URL + '/v2/apps/' + appGuid + '/stats'
    var headers = {
        'Authorization': token_type + " " + access_token
    };
    var qs = { };     
    var body = { };

    return this.REST.request2("GET",url, headers, qs, body,"200");    
}

/**
 * 
 * http://apidocs.cloudfoundry.org/214/apps/associate_route_with_the_app.html
 * 
 * @param  {[type]} token_type   [description]
 * @param  {[type]} access_token [description]
 * @param  {[type]} appName      [description]
 * @param  {[type]} app_guid     [description]
 * @param  {[type]} domain_guid  [description]
 * @param  {[type]} space_guid   [description]
 * @param  {[type]} route_guid   [description]
 * @return {[type]}              [description]
 */
Apps.prototype.associateRoute = function(token_type,access_token,appName,app_guid,domain_guid,space_guid,route_guid) {

    var url = this.API_URL + '/v2/apps/' + app_guid + '/routes/' + route_guid
    var headers = {
        'Authorization': token_type + " " + access_token
    };
    var qs = { };
    var body = JSON.stringify({
        'host': appName,
        'domain_guid': domain_guid,
        'space_guid': space_guid
    });

    return this.REST.request("PUT",url, headers, qs, body,"201");
}

/**
 * 
 * http://apidocs.cloudfoundry.org/214/resource_match/list_all_matching_resources.html
 * 
 * @param  {[type]} token_type          [description]
 * @param  {[type]} access_token        [description]
 * @param  {[type]} zipResources [description]
 * @return {[type]}                     [description]
 */
Apps.prototype.checkResources = function(token_type,access_token,zipResources){
    var url = this.API_URL + "/v2/resource_match";  
    var headers = {
        //'Accept': 'application/json',
        'Authorization': token_type + " " + access_token
        //'Content-Type': 'application/x-www-form-urlencoded'        
        //'Content-Type': 'application/json'
    };
    var qs = { };    
    var body = {body:JSON.stringify(zipResources)};//JSON.stringify(zipResources);

    //console.log(body);

    return this.REST.DEBUG("PUT",url, headers, qs, body,"200");

//var url = 'https://www.example.com'
/*
var options = {
  method: 'PUT',
  body: zipResources,
  json: true,
  headers: headers,
  url: url
}
return new Promise(function (resolve, reject) {
    request(options, function (err, res, body) {
        if (err) {
            //inspect(err, 'error posting json')
            return reject(err);
        }
        console.log(body);
        return resolve(body);
    })
});
*/
/*
    var formData = [{
        "sha1": '3722059cc37f7a56db064c1911f063da826cb211',
        "size": '36'
    }];
    return new Promise(function (resolve, reject) {
        request.put({url:url, headers: headers, formData: body}, function optionalCallback(err, httpResponse, body) {
            if (err) {
                console.error('upload failed:', err);
                return reject(error);
            }
            console.log('Upload successful!  Server responded with:', body);
            return resolve(body);
        });
    });
*/

}

/**
 * http://apidocs.cloudfoundry.org/214/apps/uploads_the_bits_for_an_app.html
 * 
 * @param  {[type]} token_type            [description]
 * @param  {[type]} access_token          [description]
 * @param  {[type]} appName               [description]
 * @param  {[type]} app_guid              [description]
 * @param  {[type]} dataRemoteFile        [description]
 * @param  {[type]} dataRemoteFileDetails [description]
 * @return {[type]}                       [description]
 */
Apps.prototype.uploadApp = function(token_type,access_token,appName,app_guid,dataRemoteFile,dataRemoteFileDetails){

    var url = this.API_URL + '/v2/apps/' + app_guid + '/bits';
    //console.log(url);

    /*
    var headers = {
        'Accept': 'application/json',
        'Authorization': token_type + " " + access_token,
        'Content-Type': 'multipart/form-data; boundary=AaB03x'
    };
    var qs =  {
        'q': 'async:false' 
    };
    var body = {
        'resources': JSON.stringify(dataRemoteFileDetails),
        'application': dataRemoteFile
    };
    */
   
       var form = new FormData(),
        CRLF = '\r\n',
        length = dataRemoteFile.length,
        //filename = params.appFile.substr(params.appFile.lastIndexOf('/') + 1),
        zipName = appName + ".zip",
        //filename = zipName,
        options = {
            header: CRLF + [
                '--' + form.getBoundary(),
                'Content-Disposition: form-data; name="application"; filename="' + zipName + '"',
                'Content-Type: application/zip',
                'Content-Length: ' + length,
                'Content-Transfer-Encoding: binary'
            ].join(CRLF) + CRLF + CRLF,
            knownLength: length
        };

        form.append('async', 'true');
        form.append('resources', JSON.stringify(dataRemoteFileDetails));
        form.append('application', dataRemoteFile, options);


        return new Promise(function (resolve, reject) {
            form.getLength(function () {
                var req = request({
                    method: 'PUT',
                    url: url,
                    headers: {
                        'Accept': 'application/json',
                        'Authorization': token_type + ' ' + access_token
                    },
                    qs: {
                        'async': 'true'
                    },
                    formData: {
                        'async': 'true',
                        'resources': JSON.stringify(dataRemoteFileDetails),
                        'application': dataRemoteFile
                    }
                }, function (error, response, body) {

                    /*
                    if (error) {
                        return callback(error);
                        //return reject(error);
                    }
                    if (response.statusCode === 401) {
                        return callback('Authorization error');
                        //return reject('Authorization error');
                    }
                    
                    try {
                        body = JSON.parse(body);
                    } catch (e) {
                        body = null;
                    }
                    
                    if (response.statusCode >= 400) {
                        return callback(functionName + ': ' + (body && body.hasOwnProperty('description') ? body.description : 'Unknown error'));
                        //return reject(error);
                    }
                    if (body && body.metadata && body.metadata.guid && response.statusCode === 201) {
                        return callback(null, body.metadata.guid);
                        //return resolve(body);
                    }
                    return callback('Upload fail');
                    //return reject('Upload fail');
                    */
                    
                    console.log(response.statusCode);
                    var result = JSON.parse(body);
                    if (!error && response.statusCode == 201) {
                        return resolve(result);
                    } else {
                        return reject(body);
                    }

                });
                req._form = form;
            });
        }); 

};

module.exports = Apps;
