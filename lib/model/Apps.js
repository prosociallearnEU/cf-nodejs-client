/*jslint node: true*/
/*globals Promise:true*/
"use strict";

var request = require('request'),
    JSZip = require('jszip'),
    crypto = require('crypto'),
    yaml = require('js-yaml');    
var httpUtils = require('../utils/HttpUtils');

function Apps(_API_URL){
    this.API_URL = _API_URL;
    this.REST = new httpUtils();
    this.dataRemoteFile = null;
    this.manifeset = null;
}

Apps.prototype.getApps = function(token_type,access_token){

    var url = this.API_URL + "/v2/apps";
    var headers = {
        'Authorization': token_type + " " + access_token,
    };
    var body = { }; 

    return this.REST.get(url, headers, body);    
}

//http://apidocs.cloudfoundry.org/213/apps/list_all_apps.html
Apps.prototype.getAppByName = function(token_type,access_token,appName){

    var url = this.API_URL + "/v2/apps";
    var headers = {
        'Authorization': token_type + " " + access_token,
    }; 
    var body = {
        "name": appName,
    }

    return this.REST.get(url, headers, body);  
   
}

Apps.prototype.createApp = function(token_type,access_token,name,space_guid){

    var url = this.API_URL + "/v2/apps";
    var headers = {
        'Authorization': token_type + " " + access_token,
        'Content-Type': 'application/x-www-form-urlencoded'
    };
    var body = JSON.stringify({
        "name": name,
        "space_guid": space_guid
    })    

    return this.REST.post2(url, headers, body);    

}

Apps.prototype.stopApp = function(token_type,access_token,appGuid){

    var url = this.API_URL + '/v2/apps/' + appGuid;
    var headers = {
        'Authorization': token_type + " " + access_token,
        'Content-Type': 'application/x-www-form-urlencoded'
    };
    var body = JSON.stringify({
            'state': 'STOPPED'
    })
    return this.REST.put2(url, headers, body);
}

Apps.prototype.startApp = function(token_type,access_token,appGuid){

    var url = this.API_URL + '/v2/apps/' + appGuid;
    var headers = {
        'Authorization': token_type + " " + access_token,
        'Content-Type': 'application/x-www-form-urlencoded'
    };
    var body = JSON.stringify({
            'state': 'STARTED'
    })

    return this.REST.put(url, headers, body);    

}

Apps.prototype.getResources = function (url) {

    var headers = { };
    var body = {};

    return new Promise(function (resolve, reject) {
        request.get({ url: url, headers: headers, form: body }, function (error, response, body) {
            var result = body;
            if (!error && response.statusCode == 200) {
                return resolve(result);
            } else {
                return reject(body);
            }
        });
    });       

};

Apps.prototype.getResources2 = function (url) {
    /*
    if (!params) {
        return callback('Not enough parameters');
    }
    */
    return new Promise(function (resolve, reject) {

        request.get({ url: url, encoding: null }, function (error, response, body) {

            if (error || response.statusCode !== 200) {
                //return callback('Can not get file');
                return reject(body);                
            }
            this.dataRemoteFile = body;
            var zip = new JSZip(body),
                resources = [];
            for (var i in zip.files) {
                if (zip.files.hasOwnProperty(i) && zip.files[i].dir === false) {
                    var file = zip.files[i],
                        name = file.name,
                        buffer = zip.file(name).asText(),
                        sha1 = crypto.createHash('sha1');
                    if (name.substr(name.lastIndexOf('/') + 1) === 'manifest.yml') {
                        this.manifest = yaml.safeLoad(buffer);
                    }
                    resources.push({
                        'fn': name,
                        'size': file._data.uncompressedSize,
                        'sha1': sha1.update(buffer).digest('hex')

                    });
                }
            }

            //console.log(this.manifest);

            //callback(null, resources);
            return resolve(resources);
        });
    });
};

Apps.prototype.getResources3 = function (url) {
    /*
    if (!params) {
        return callback('Not enough parameters');
    }
    */
    return new Promise(function (resolve, reject) {

        request.get({ url: url, encoding: null }, function (error, response, body) {

            if (error || response.statusCode !== 200) {
                //return callback('Can not get file');
                return reject(body);                
            }
            this.dataRemoteFile = body;
            var zip = new JSZip(body),
                resources = [];
            for (var i in zip.files) {
                if (zip.files.hasOwnProperty(i) && zip.files[i].dir === false) {
                    var file = zip.files[i],
                        name = file.name,
                        buffer = zip.file(name).asText(),
                        sha1 = crypto.createHash('sha1');
                    if (name.substr(name.lastIndexOf('/') + 1) === 'manifest.yml') {
                        this.manifest = yaml.safeLoad(buffer);
                    }
                    resources.push({
                        'fn': name,
                        'size': file._data.uncompressedSize,
                        'sha1': sha1.update(buffer).digest('hex'),
                        'manifest' : this.manifest
                    });
                }
            }

            //console.log(this.manifest);

            //callback(null, resources);
            return resolve(resources);
        });
    });
};

/**
 * [uploadApp description]
 * 
 * http://apidocs.cloudfoundry.org/214/apps/uploads_the_bits_for_an_app.html
 * 
 * @param  {[type]} token_type      [description]
 * @param  {[type]} access_token    [description]
 * @param  {[type]} appGuid         [description]
 * @param  {[type]} dataRemoteFile  [description]
 * @param  {[type]} zipName         [description]
 * @param  {[type]} resourceMatched [description]
 * @return {[type]}                 [description]
 */
Apps.prototype.uploadApp = function (token_type,access_token,appGuid,dataRemoteFile,zipName,resourceMatched, callback) {

    var url = this.API_URL + '/v2/apps/' + appGuid + '/bits';

    //return new Promise(function (resolve, reject) {

        var form = new FormData(),
            CRLF = '\r\n',
            length = dataRemoteFile.length,
            //filename = params.appFile.substr(params.appFile.lastIndexOf('/') + 1),
            filename = zipName,
            options = {
                header: CRLF + [
                    '--' + form.getBoundary(),
                    'Content-Disposition: form-data; name="application"; filename="' + filename + '"',
                    'Content-Type: application/zip',
                    'Content-Length: ' + length,
                    'Content-Transfer-Encoding: binary'
                ].join(CRLF) + CRLF + CRLF,
                knownLength: length
            };

        form.append('async', 'true');
        form.append('resources', JSON.stringify(resourceMatched));
        form.append('application', dataRemoteFile, options);

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
                    'resources': JSON.stringify(resourceMatched),
                    'application': dataRemoteFile
                }
            }, function (error, response, body) {

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
            });
            req._form = form;
        });

    //});       

};

Apps.prototype.checkJob = function(params, callback){

}

function checkJob(params, callback) {
    if (!params) {
        return callback('Not enough parameters');
    }
    var functionName = arguments.callee.name;
    request({
        method: 'GET',
        url: getUrl(params, 'api') + '/v2/jobs/' + params.uploadJobGuid,
        headers: defaultHeaders(type, token)
    }, function (error, response, body) {
        if (error) {
            return callback(error);
        }
        if (response.statusCode === 401) {
            return callback('Authorization error');
        }
        try {
            body = JSON.parse(body);
        } catch (e) {
            body = null;
        }
        if (response.statusCode >= 400) {
            return callback(functionName + ': ' + (body && body.hasOwnProperty('description') ? body.description : 'Unknown error'));
        }
        if (body && body.metadata && body.metadata.hasOwnProperty('guid') && response.statusCode === 200) {
            return callback(null, body.metadata.guid === '0');
        }
        return callback('Check job fail');
    });
}

Apps.prototype.deleteApp = function (token_type,access_token,appGuid) {

    var url = this.API_URL + '/v2/apps/' + appGuid;
    var headers = {
        'Authorization': token_type + " " + access_token,
        'Content-Type': 'application/x-www-form-urlencoded'
    };
    var body = { };

    return this.REST.del(url, headers, body);

}

/**
 * [checkResources description]
 * http://apidocs.cloudfoundry.org/214/resource_match/list_all_matching_resources.html
 * 
 * @param  {[type]} token_type          [description]
 * @param  {[type]} access_token        [description]
 * @param  {[type]} resourcesRemoteFile [description]
 * @return {[type]}                     [description]
 */
Apps.prototype.checkResources = function(token_type,access_token,resourcesRemoteFile){
    //console.log(resourcesRemoteFile);
    var url = this.API_URL + "/v2/resource_match";    
    var headers = {
        'Accept': 'application/json',
        'Authorization': token_type + " " + access_token,
        'Content-Type': 'application/json'        
    };
    var body = JSON.stringify(resourcesRemoteFile);

    return new Promise(function (resolve, reject) {
        request.put({ url: url, headers: headers, form: body  }, function (error, response, body) {
            var result = body;//JSON.parse(body);
            console.log(result);
            console.log(response.statusCode);
            if (!error && response.statusCode == 200) {
                return resolve(result);
            } else {
                return reject(body);
            }
        });
    });
}

module.exports = Apps;