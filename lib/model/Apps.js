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

var FormData = require('form-data');
var request = require('request');
var fs = require('fs');
var HttpUtils = require('../utils/HttpUtils');
var RESTUtils = require('../utils/RESTUtils');

function Apps(_API_URL) {
    this.API_URL = _API_URL;
    this.REST = new HttpUtils();
    this.REST2 = new RESTUtils();
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
Apps.prototype.getApps = function (token_type, access_token) {

    var url = this.API_URL + "/v2/apps";
    var options = {
        method: 'GET',
        url: url,
        headers: {
            'Authorization': token_type + ' ' + access_token
        }
    }    

    return this.REST.request(options,"200",true);
};

/**
 * http://apidocs.cloudfoundry.org/213/apps/list_all_apps.html
 * 
 * @param  {[type]} token_type   [description]
 * @param  {[type]} access_token [description]
 * @param  {[type]} appName      [description]
 * @return {[type]}              [description]
 */
Apps.prototype.getAppByName = function (token_type, access_token, appName) {

    var url = this.API_URL + "/v2/apps";
    var options = {
        method: 'GET',
        url: url,
        headers: {
            'Authorization': token_type + ' ' + access_token
        },
        form : {
            "name": appName
        } 
    }    

    return this.REST.request(options,"200",true);
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
    var options = {
        method: 'POST',
        url: url,
        headers: {
            'Authorization': token_type + ' ' + access_token,
            'Content-Type': 'application/x-www-form-urlencoded'            
        },
        form : JSON.stringify({
            "name": name,
            "space_guid": space_guid,
            "buildpack" : manifest.applications[0].buildpack
        })
    }

    //console.log(manifest);
    //console.log(manifest.applications[0].buildpack);
   
    return this.REST.request(options,"201",true);
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
    var options = {
        method: 'PUT',
        url: url,
        headers: {
            'Authorization': token_type + ' ' + access_token,
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        form : JSON.stringify({
            'state': 'STOPPED'
        })
    } 

    return this.REST.request(options,"200",true); 
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
    var options = {
        method: 'PUT',
        url: url,
        headers: {
            'Authorization': token_type + ' ' + access_token,
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        form : JSON.stringify({
            'state': 'STARTED'
        })
    } 

    return this.REST.request(options,"201",true);
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
    var options = {
        method: 'DELETE',
        url: url,
        headers: {
            'Authorization': token_type + ' ' + access_token,
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    } 

    return this.REST.request(options,"204",false);
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
    var options = {
        method: 'GET',
        url: url,
        headers: {
            'Authorization': token_type + ' ' + access_token
        }
    } 

    return this.REST.request(options,"200",false);   
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
    var options = {
        method: 'PUT',
        url: url,
        headers: {
            'Authorization': token_type + ' ' + access_token
        },
        form : JSON.stringify({
            'host': appName,
            'domain_guid': domain_guid,
            'space_guid': space_guid
        })
    } 

    return this.REST.request(options,"201",true);
}

/**
 * 
 * http://apidocs.cloudfoundry.org/214/resource_match/list_all_matching_resources.html
 * https://github.com/cloudfoundry/cf-release/issues/761#issuecomment-128386896
 *
 * @param  {[type]} token_type          [description]
 * @param  {[type]} access_token        [description]
 * @param  {[type]} zipResources [description]
 * @return {[type]}                     [description]
 */
Apps.prototype.checkResources = function(token_type,access_token,zipResources){
    var url = this.API_URL + "/v2/resource_match";
    var options = {
        method: 'PUT',
        url: url,
        headers: {
            'Accept': 'application/json',
            'Authorization': token_type + " " + access_token,
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        form : JSON.stringify(zipResources)
    } 

    return this.REST.request(options,"200",false); 
}


Apps.prototype.uploadApp2 = function(token_type,access_token,appName,app_guid,dataRemoteFile,zipResources){
    var url = this.API_URL + '/v2/apps/' + app_guid + '/bits'; 
    var headers = {
        //'Accept': 'application/json',
        'Authorization': token_type + " " + access_token
        //'Content-Type': 'multipart/form-data'
    };
    var qs =  {
        'guid': app_guid,
        'async': 'true'
    };
    var formData = {
                'async': 'true',
                'resources': JSON.stringify(zipResources),
                'application': dataRemoteFile
            }    
    var form = new FormData(),
        CRLF = '\r\n',
        length = dataRemoteFile.length,
        zipName = appName + ".zip",
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
    form.append('resources', JSON.stringify(zipResources));
    //form.append('application', dataRemoteFile, options);


    return new Promise(function (resolve, reject) {
        
        request({method:'PUT', url:url, headers: headers, qs: qs, formData: form}, function (err, response, body) {
            if (err) {
                console.log(err);
                return reject(err);
            }
            console.log(response);
            return resolve(body);
        });
        //form = r.form();
    }); 
};


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
Apps.prototype.uploadApp = function(token_type,access_token,appName,app_guid,dataRemoteFile,zipResources){
    var url = this.API_URL + '/v2/apps/' + app_guid + '/bits'; 
    var ZIP_URL = "https://github.com/jabrena/CloudFoundryLab/raw/master/zips/StaticWebsite_HelloWorld.zip";

    //console.log(dataRemoteFile);

    var options = {
        method: 'PUT',
        url: url,
        //auth:{bearer:access_token},
        headers: {
            'Authorization': token_type + " " + access_token
        },
        qs: {
            'async': 'true'
        },        
        formData:{
            async: 'true',
            resources: JSON.stringify(zipResources),
            //application:request(ZIP_URL)
            //application:fs.createReadStream("./StaticWebsite_HelloWorld.zip")
            application:dataRemoteFile
        },
        json:true
    } 

    //return this.REST.request(options,"201",false);
    
    var jsonOutput = false;
    var httpStatusAssert = "201";

    var result = null;

    return new Promise(function (resolve, reject) {

        request(options, function (error, response, body) {
            if(error){
                return reject(error);
            }

            //console.log(response);

            if(jsonOutput){
                result = JSON.parse(body);
            }else{
                result = body;
            }

            //console.log(response.statusCode);
            if (!error && response.statusCode == httpStatusAssert) {
                return resolve(result);
            } else {
                return reject(body);
            }
        });

    });

};

Apps.prototype.uploadApp5 = function(token_type,access_token,appName,app_guid,dataRemoteFile,zipResources){
    var url = this.API_URL + '/v2/apps/' + app_guid + '/bits'; 
    var ZIP_URL = "https://github.com/jabrena/CloudFoundryLab/raw/master/zips/StaticWebsite_HelloWorld.zip";

 

    //return this.REST.request(options,"201",false);
    
    var jsonOutput = false;
    var httpStatusAssert = "201";

    var result = null;


    return this.REST2.request(url,access_token,app_guid);

};

module.exports = Apps;
