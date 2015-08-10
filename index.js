/*!
 * cf-nodejs-client
 * Copyright(c) 2015 Juan Antonio Breña Moral
 * MIT Licensed
 */

'use strict';

var used = [], 
    exports = module.exports = {};

/**
 * Library Version
 * @type {String}
 */
exports.version = '0.0.4';

/**
 * Support for Apps
 * @type {[type]}
 */
var Apps = require('./lib/model/Apps');
exports.Apps = Apps;

/**
 * Support for Cloud Foundry 
 * @type {[type]}
 */
var CloudFoundry = require('./lib/model/CloudFoundry');
exports.CloudFoundry = CloudFoundry;