/*jslint node: true*/
'use strict';

var used = [],
    exports = module.exports = {};

/**
 * Library Version
 * @type {String}
 */
exports.version = '0.10.0';

/**
 * Support for Apps
 * @type {[type]}
 */
var Apps = require('./lib/model/Apps');
exports.Apps = Apps;

/**
 * Support for Buildpacks
 * @type {[type]}
 */
var BuildPacks = require('./lib/model/BuildPacks');
exports.BuildPacks = BuildPacks;

/**
 * Support for Cloud Foundry 
 * @type {[type]}
 */
var CloudFoundry = require('./lib/model/CloudFoundry');
exports.CloudFoundry = CloudFoundry;


/**
 * Support for Domains
 * @type {[type]}
 */
var Domains = require('./lib/model/Domains');
exports.Domains = Domains;

/**
 * Support for Events
 * @type {[type]}
 */
var Events = require('./lib/model/Events');
exports.Events = Events;

/**
 * Support for Jobs
 * @type {[type]}
 */
var Jobs = require('./lib/model/Jobs');
exports.Jobs = Jobs;

/**
 * Support for Logs
 * @type {[type]}
 */
var Logs = require('./lib/model/Logs');
exports.Logs = Logs;

/**
 * Support for Organizations
 * @type {[type]}
 */
var Organizations = require('./lib/model/Organizations');
exports.Organizations = Organizations;

/**
 * Support for Organizations Quota
 * @type {[type]}
 */
var OrganizationsQuota = require('./lib/model/OrganizationsQuota');
exports.OrganizationsQuota = OrganizationsQuota;

/**
 * Support for Routes
 * @type {[type]}
 */
var Routes = require('./lib/model/Routes');
exports.Routes = Routes;

/**
 * Support for ServiceBindings
 * @type {[type]}
 */
var ServiceBindings = require('./lib/model/ServiceBindings');
exports.ServiceBindings = ServiceBindings;

/**
 * Support for Spaces
 * @type {[type]}
 */
var Spaces = require('./lib/model/Spaces');
exports.Spaces = Spaces;

/**
 * Support for Spaces Quota
 * @type {[type]}
 */
var SpacesQuota = require('./lib/model/SpacesQuota');
exports.SpacesQuota = SpacesQuota;

/**
 * Support for Stacks
 * @type {[type]}
 */
var Stacks = require('./lib/model/Stacks');
exports.Stacks = Stacks;

/**
 * Support for User Provided Services
 * @type {[type]}
 */
var UserProvidedServices = require('./lib/model/UserProvidedServices');
exports.UserProvidedServices = UserProvidedServices;

/**
 * Support for Users
 * @type {[type]}
 */
var Users = require('./lib/model/Users');
exports.Users = Users;

/**
 * Support for Users UAA
 * @type {[type]}
 */
var UsersUAA = require('./lib/model/UsersUAA');
exports.UsersUAA = UsersUAA;
