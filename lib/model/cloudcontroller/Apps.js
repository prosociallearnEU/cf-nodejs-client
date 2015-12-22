/*jslint node: true*/

var rest = require('restler');//Analyze a way to remove this dependency
var fs = require('fs');
var HttpUtils = require('../../utils/HttpUtils');

/**
 * This public class manages the operations related with Applications on Cloud Controller.
 * @param {String} endPoint [CC endpoint]
 * @constructor
 */
function Apps(endPoint) {
    "use strict";
    this.API_URL = endPoint;
    this.REST = new HttpUtils();
}

/**
 * Set endpoint
 * @param {String} endPoint [CC endpoint]
 */
Apps.prototype.setEndPoint = function (endPoint) {
    "use strict";
    this.API_URL = endPoint;
};

/**
 * Returns all applications.
 * {@link http://apidocs.cloudfoundry.org/213/apps/list_all_apps.html}
 *
 * @example
 * PENDING

 * @param  {String} token_type   [Authentication type]
 * @param  {String} access_token [Authentication token]
 * @return {JSON}              [return a JSON response]
 */
Apps.prototype.getApps = function (token_type, access_token, filter) {
    "use strict";
    var url = this.API_URL + "/v2/apps";
    var qs = {};
    if (filter) {
        qs = filter;
    }
    /*
    var form = { };
    if (bodyFilter) {
        form = bodyFilter;
    } */
    var options = {
        method: 'GET',
        url: url,
        headers: {
            Authorization: token_type + ' ' + access_token
        },
        qs: qs
    };

    return this.REST.request(options, "200", true);
};

/**
 * Creates a new application on Cloud Controller.
 * {@link http://apidocs.cloudfoundry.org/214/apps/creating_an_app.html}
 *
 * @example
 * var appOptions = {
 *     "name": name,
 *     "space_guid": space_guid,
 *     "buildpack" : buildPack
 * }
 *
 *  @param  {String} token_type   [Authentication type]
 * @param  {String} access_token [Authentication token]
 * @param  {json} appOptions   [options to create the application]
 * @return {json}              [information about the application]
 */
Apps.prototype.add = function (token_type, access_token, appOptions) {
    "use strict";
    var url = this.API_URL + "/v2/apps";
    var options = {
        method: 'POST',
        url: url,
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            Authorization: token_type + ' ' + access_token
        },
        form: JSON.stringify(appOptions)
    };

    return this.REST.request(options, "201", true);
};

/**
 * Update an App
 * {@link http://apidocs.cloudfoundry.org/217/apps/updating_an_app.html}
 *
 * @param  {String} token_type   [Authentication type]
 * @param  {String} access_token [Authentication token]
 * @param  {String} app_guid     [App guid]
 * @param  {json} appOptions   [options to create the application]
 * @return {json}              [information about the application]
 */
Apps.prototype.update = function (token_type, access_token, app_guid, appOptions) {
    "use strict";
    var url = this.API_URL + "/v2/apps/" + app_guid;
    var options = {
        method: 'PUT',
        url: url,
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            Authorization: token_type + ' ' + access_token
        },
        form: JSON.stringify(appOptions)
    };

    return this.REST.request(options, "201", true);
};

/**
 * Stop an App
 * {@link http://apidocs.cloudfoundry.org/217/apps/updating_an_app.html}
 * @param  {String} token_type   [Authentication type]
 * @param  {String} access_token [Authentication token]
 * @param  {String} app_guid     [App guid]
 * @return {json}              [information about the application]
 */
Apps.prototype.stop = function (token_type, access_token, app_guid) {
    "use strict";
    var appOptions = {
        state: 'STOPPED'
    };

    return this.update(token_type, access_token, app_guid, appOptions);
};

/**
 * Start an App
 * {@link http://apidocs.cloudfoundry.org/217/apps/updating_an_app.html}
 * @param  {String} token_type   [Authentication type]
 * @param  {String} access_token [Authentication token]
 * @param  {String} app_guid     [App guid]
 * @return {json}              [information about the application]
 */
Apps.prototype.start = function (token_type, access_token, app_guid) {
    "use strict";
    var appOptions = {
        state: 'STARTED'
    };

    return this.update(token_type, access_token, app_guid, appOptions);
};

/**
 * Get summary about an application
 * {@link http://apidocs.cloudfoundry.org/214/apps/get_app_summary.html}
 * @param  {String} token_type   [Authentication type]
 * @param  {String} access_token [Authentication token]
 * @param  {String} app_guid     [App guid]
 * @return {json}              [information about the application]
 */
Apps.prototype.getSummary = function (token_type, access_token, app_guid) {
    "use strict";
    var url = this.API_URL + '/v2/apps/' + app_guid + "/summary";
    var options = {
        method: 'GET',
        url: url,
        headers: {
            Authorization: token_type + ' ' + access_token
        }
    };
    return this.REST.request(options, "200", true);
};

/**
 * Delete an App
 * {@link http://apidocs.cloudfoundry.org/214/apps/delete_a_particular_app.html}
 * @param  {String} token_type   [Authentication type]
 * @param  {String} access_token [Authentication token]
 * @param  {String} app_guid     [App guid]
 * @return {json}              [information about the application]
 */
Apps.prototype.remove = function (token_type, access_token, app_guid) {
    "use strict";
    var url = this.API_URL + '/v2/apps/' + app_guid;
    var options = {
        method: 'DELETE',
        url: url,
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            Authorization: token_type + ' ' + access_token
        }
    };
    return this.REST.request(options, "204", false);
};

/**
 * Get stats from an App
 * {@link http://apidocs.cloudfoundry.org/214/apps/get_detailed_stats_for_a_started_app.html}
 * @param  {String} token_type   [Authentication type]
 * @param  {String} access_token [Authentication token]
 * @param  {String} app_guid     [App guid]
 * @return {json}              [information about the application]
 */
Apps.prototype.getStats = function (token_type, access_token, appGuid) {
    "use strict";
    var url = this.API_URL + '/v2/apps/' + appGuid + '/stats';
    var options = {
        method: 'GET',
        url: url,
        headers: {
            Authorization: token_type + ' ' + access_token
        }
    };

    return this.REST.request(options, "200", true);
};

/**
 * Associate an Application with a Route.
 * {@link http://apidocs.cloudfoundry.org/214/apps/associate_route_with_the_app.html}
 * @param  {String} token_type   [Authentication type]
 * @param  {String} access_token [Authentication token]
 * @param  {String} app_guid     [App guid]
 * @param  {String} route_guid   [Route guid]
 * @return {JSon}              [description]
 */
Apps.prototype.associateRoute = function (token_type, access_token, app_guid, route_guid) {
    "use strict";
    var url = this.API_URL + '/v2/apps/' + app_guid + '/routes/' + route_guid;
    var options = {
        method: 'PUT',
        url: url,
        headers: {
            Authorization: token_type + ' ' + access_token
        }
    };

    return this.REST.request(options, "201", true);
};

/**
 * Check resources
 * {@link http://apidocs.cloudfoundry.org/214/resource_match/list_all_matching_resources.html}
 * {@link https://github.com/cloudfoundry/cf-release/issues/761#issuecomment-128386896}
 *
 * You only need to call the resources_match endpoint to figure out the correct value
 * to enter in the resources parameter in the app-bits-upload request
 * if you want to take advantage of the optimization of not uploading already-uploaded bits.
 *
 * @param  {String} token_type          [description]
 * @param  {String} access_token        [description]
 * @param  {JSon} zipResources [description]
 * @return {JSon}                     [description]

Apps.prototype.checkResources = function (token_type, access_token, zipResources) {
    var url = this.API_URL + "/v2/resource_match";
    var options = {
        method: 'PUT',
        url: url,
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': token_type + " " + access_token
        },
        form : JSON.stringify(zipResources)
    };

    return this.REST.request(options, "200", false);
};
 */

/**
 * Upload source code
 * {@link http://apidocs.cloudfoundry.org/214/apps/uploads_the_bits_for_an_app.html}
 *
 * function File(path, filename, fileSize, encoding, contentType)
 * 'application': rest.file(path, null, fileSizeInBytes, null, 'application/zip')
 *
 * @param  {String} token_type   [Authentication type]
 * @param  {String} access_token [Authentication token]
 * @param  {String} app_guid     [App guid]
 * @param  {String} filePath     [file path to upload]
 * @param  {Boolean} async        [Sync/Async]
 * @return {Json/String}              [{}/Job information]
 */
Apps.prototype.upload = function (token_type, access_token, app_guid, filePath, async) {
    "use strict";
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
        accessToken: access_token,
        query: {
            guid: app_guid,
            async: async_flag
        },
        data: {
            resources: JSON.stringify(zipResources),
            application: rest.file(filePath, null, fileSizeInBytes, null, 'application/zip')
        }
    };

    return this.REST.upload(url, options, "201", false);
};


/**
 * Get Instances
 * {@link http://apidocs.cloudfoundry.org/215/apps/get_the_instance_information_for_a_started_app.html}
 * @param  {String} token_type   [Authentication type]
 * @param  {String} access_token [Authentication token]
 * @param  {String} app_guid     [App guid]
 * @return {Json}              [App Info]
 */
Apps.prototype.getInstances = function (token_type, access_token, app_guid) {
    "use strict";
    var url = this.API_URL + "/v2/apps/" + app_guid + "/instances";
    var options = {
        method: 'GET',
        url: url,
        headers: {
            Authorization: token_type + " " + access_token
        }
    };

    return this.REST.request(options, "200", true);
};

/**
 * Get routes from an App
 * {@link http://apidocs.cloudfoundry.org/214/apps/list_all_routes_for_the_app.html}
 * @param  {String} token_type   [Authentication type]
 * @param  {String} access_token [Authentication token]
 * @param  {String} app_guid     [App guid]
 * @return {Json}              [App Info]
 */
Apps.prototype.getAppRoutes = function (token_type, access_token, app_guid) {
    "use strict";
    var url = this.API_URL + "/v2/apps/" + app_guid + "/routes";
    var options = {
        method: 'GET',
        url: url,
        headers: {
            Authorization: token_type + " " + access_token
        }
    };

    return this.REST.request(options, "200", true);
};

/**
 * Get Service Binding from an App
 * {@link http://apidocs.cloudfoundry.org/221/apps/list_all_service_bindings_for_the_app.html}
 * @param  {String} token_type   [Authentication type]
 * @param  {String} access_token [Authentication token]
 * @param  {String} app_guid     [App guid]
 * @param  {String} filter       [description]
 * @return {JSon}              [Service Bindings]
 */
Apps.prototype.getServiceBindings = function (token_type, access_token, app_guid, filter) {
    "use strict";
    var url = this.API_URL + "/v2/apps/" + app_guid + "/service_bindings";
    var qs = {};
    if (filter) {
        qs = filter;
    }
    var options = {
        method: 'GET',
        url: url,
        headers: {
            Authorization: token_type + " " + access_token
        },
        qs: qs
    };

    return this.REST.request(options, "200", true);
};

/**
 * IN DISCUSSION
 * https://github.com/prosociallearnEU/cf-nodejs-client/issues/58
 *
 * Remove a Service Binding from an App.
 * http://apidocs.cloudfoundry.org/217/apps/remove_service_binding_from_the_app.html
 * @param  {String} token_type   [Authentication type]
 * @param  {String} access_token [Authentication token]
 * @param  {String} app_guid     [App guid]
 * @param  {String} service_binding_guid [Service Binding guid]
 * @return {JSON}                      [Response]

Apps.prototype.removeServiceBindings = function (token_type, access_token, app_guid, service_binding_guid) {
    "use strict";
    var url = this.API_URL + "/v2/apps/" + app_guid + "/service_bindings/" + service_binding_guid;
    var options = {
        method: 'DELETE',
        url: url,
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            Authorization: token_type + " " + access_token
        }
    };

    return this.REST.request(options, "201", true);
};
*/

/**
 * Get environment variables
 * {@link http://apidocs.cloudfoundry.org/222/apps/get_the_env_for_an_app.html}
 * @param  {String} token_type   [Authentication type]
 * @param  {String} access_token [Authentication token]
 * @param  {String} app_guid     [App guid]
 * @param  {String} filter       [description]
 * @return {JSon}              [Service Bindings]
 */
Apps.prototype.getEnvironmentVariables = function (token_type, access_token, app_guid) {
    "use strict";
    var url = this.API_URL + "/v2/apps/" + app_guid + "/env";
    var options = {
        method: 'GET',
        url: url,
        headers: {
            Authorization: token_type + " " + access_token
        }
    };

    return this.REST.request(options, "200", true);
};

/**
 * Restage an Application
 * {@link http://apidocs.cloudfoundry.org/222/apps/restage_an_app.html}
 * @param  {String} token_type   [Authentication type]
 * @param  {String} access_token [Authentication token]
 * @param  {String} app_guid     [App guid]
 * @return {JSon}              [Service Bindings]
 */
Apps.prototype.restage = function (token_type, access_token, app_guid) {
    "use strict";
    var url = this.API_URL + '/v2/apps/' + app_guid + "/restage";
    var options = {
        method: 'POST',
        url: url,
        headers: {
            Authorization: token_type + ' ' + access_token
        }
    };

    return this.REST.request(options, "201", true);
};

module.exports = Apps;
