/*jslint node: true*/
/*globals Promise:true*/
"use strict";

var rest = require('restler');//Analyze a way to remove this dependency
var fs = require('fs');
var HttpUtils = require('../utils/HttpUtils');

function Apps(_API_URL) {
    this.API_URL = _API_URL;
    this.REST = new HttpUtils();
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
    };
    return this.REST.request(options, "200", true);
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
    };
    return this.REST.request(options, "200", true);
};

/**
 * http://apidocs.cloudfoundry.org/214/apps/creating_an_app.html
 *
 *  var appOptions = {
 *       "name": name,
 *       "space_guid": space_guid,
 *       "buildpack" : buildPack
 *  }
 * 
 * @param  {[type]} token_type   [description]
 * @param  {[type]} access_token [description]
 * @param  {[type]} appOptions   [description]
 * @return {[type]}              [description]
 */
Apps.prototype.create = function (token_type, access_token, appOptions) {

    var url = this.API_URL + "/v2/apps";
    var options = {
        method: 'POST',
        url: url,
        headers: {
            'Authorization': token_type + ' ' + access_token,
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        form : JSON.stringify(appOptions)
    };

    return this.REST.request(options, "201", true);
};

/**
 * http://apidocs.cloudfoundry.org/214/apps/updating_an_app.html
 * 
 * @param  {[type]} token_type   [description]
 * @param  {[type]} access_token [description]
 * @param  {[type]} appGuid      [description]
 * @return {[type]}              [description]
 */
Apps.prototype.stopApp = function (token_type, access_token, appGuid) {

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
    };
    return this.REST.request(options, "201", true);
};

/**
 * http://apidocs.cloudfoundry.org/214/apps/updating_an_app.html
 * 
 * @param  {[type]} token_type   [description]
 * @param  {[type]} access_token [description]
 * @param  {[type]} app_Guid     [description]
 * @return {[type]}              [description]
 */
Apps.prototype.startApp = function (token_type, access_token, app_Guid) {

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
    };
    return this.REST.request(options, "201", true);
};

/**
 * http://apidocs.cloudfoundry.org/214/apps/get_app_summary.html
 * 
 * @param  {[type]} token_type   [description]
 * @param  {[type]} access_token [description]
 * @param  {[type]} app_Guid     [description]
 * @return {[type]}              [description]
 */
Apps.prototype.getSummary = function (token_type, access_token, app_Guid) {

    var url = this.API_URL + '/v2/apps/' + app_Guid + "/summary";
    var options = {
        method: 'GET',
        url: url,
        headers: {
            'Authorization': token_type + ' ' + access_token
        }
    };
    return this.REST.request(options, "200", true);
};

/**
 * http://apidocs.cloudfoundry.org/214/apps/delete_a_particular_app.html
 * 
 * @param  {[type]} token_type   [description]
 * @param  {[type]} access_token [description]
 * @param  {[type]} appGuid      [description]
 * @return {[type]}              [description]
 */
Apps.prototype.deleteApp = function (token_type, access_token, appGuid) {

    var url = this.API_URL + '/v2/apps/' + appGuid;
    var options = {
        method: 'DELETE',
        url: url,
        headers: {
            'Authorization': token_type + ' ' + access_token,
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    };
    return this.REST.request(options, "204", false);
};

/**
 * http://apidocs.cloudfoundry.org/214/apps/get_detailed_stats_for_a_started_app.html
 * 
 * @param  {[type]} token_type   [description]
 * @param  {[type]} access_token [description]
 * @param  {[type]} appGuid      [description]
 * @return {[type]}              [description]
 */
Apps.prototype.getStats = function (token_type, access_token, appGuid) {

    var url = this.API_URL + '/v2/apps/' + appGuid + '/stats';
    var options = {
        method: 'GET',
        url: url,
        headers: {
            'Authorization': token_type + ' ' + access_token
        }
    };

    return this.REST.request(options, "200", true);
};

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
Apps.prototype.associateRoute = function (token_type, access_token, appName, app_guid, domain_guid, space_guid, route_guid) {

    var url = this.API_URL + '/v2/apps/' + app_guid + '/routes/' + route_guid;
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
    };

    return this.REST.request(options, "201", true);
};

/**
 * 
 * http://apidocs.cloudfoundry.org/214/resource_match/list_all_matching_resources.html
 * https://github.com/cloudfoundry/cf-release/issues/761#issuecomment-128386896
 *
 * You only need to call the resources_match endpoint to figure out the correct value 
 * to enter in the resources parameter in the app-bits-upload request 
 * *if* you want to take advantage of the optimization of not uploading already-uploaded bits. 
 *
 * @param  {[type]} token_type          [description]
 * @param  {[type]} access_token        [description]
 * @param  {[type]} zipResources [description]
 * @return {[type]}                     [description]
 */
Apps.prototype.checkResources = function (token_type, access_token, zipResources) {
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
    };

    return this.REST.request(options, "200", false);
};

/**
 * http://apidocs.cloudfoundry.org/214/apps/uploads_the_bits_for_an_app.html
 *
 * https://github.com/danwrong/restler
 * function File(path, filename, fileSize, encoding, contentType)
 * 'application': rest.file(path, null, fileSizeInBytes, null, 'application/zip')
 *
 * Doubt: What is the mimetype for a .war?
 * 
 * @param  {[type]} token_type            [description]
 * @param  {[type]} access_token          [description]
 * @param  {[type]} appName               [description]
 * @param  {[type]} app_guid              [description]
 * @param  {[type]} dataRemoteFile        [description]
 * @param  {[type]} dataRemoteFileDetails [description]
 * @return {[type]}                       [description]
 */
Apps.prototype.uploadApp = function (token_type, access_token, app_guid, filePath, async) {

    var url = this.API_URL + '/v2/apps/' + app_guid + '/bits';
    var stats = fs.statSync(filePath);
    var fileSizeInBytes = stats["size"];
    var zipResources = [];
    var async_flag = false;
    if (typeof async === "boolean") {
        if (async) {
            async_flag = true;
        }
    }

    var options = {
        multipart: true,
        accessToken : access_token,
        query: {
            guid: app_guid,
            async: async_flag
        },
        data: {
            'resources': JSON.stringify(zipResources),
            'application': rest.file(filePath, null, fileSizeInBytes, null, 'application/zip')
        }
    };

    return this.REST.upload(url, options, "201", false);
};


/**
 * http://apidocs.cloudfoundry.org/215/apps/get_the_instance_information_for_a_started_app.html
 * 
 * @param  {[type]} token_type   [description]
 * @param  {[type]} access_token [description]
 * @param  {[type]} zipResources [description]
 * @return {[type]}              [description]
 */
Apps.prototype.getInstances = function (token_type, access_token, app_guid) {
    var url = this.API_URL + "/v2/apps/" + app_guid + "/instances";
    var options = {
        method: 'GET',
        url: url,
        headers: {
            'Authorization': token_type + " " + access_token
        }
    };

    return this.REST.request(options, "200", true);
};

/**
 * http://apidocs.cloudfoundry.org/214/apps/list_all_routes_for_the_app.html
 * 
 * @param  {[type]}
 * @param  {[type]}
 * @param  {[type]}
 * @return {[type]}
 */
Apps.prototype.getAppRoutes = function (token_type, access_token, app_guid) {
    var url = this.API_URL + "/v2/apps/" + app_guid + "/routes";
    var options = {
        method: 'GET',
        url: url,
        headers: {
            'Authorization': token_type + " " + access_token
        }
    };

    return this.REST.request(options, "200", true);
};

module.exports = Apps;
