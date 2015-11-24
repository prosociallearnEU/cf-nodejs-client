## Version 0.11.1 2015-11-23

- Defensive code in HttpUtils.js (Avoid crashing in case of Server down or service not reply expected JSON)

## Version 0.11.0 2015-11-20

- Refactor some methods:

``` js
Apps.prototype.create = function (token_type, access_token, appOptions) {
Apps.prototype.add = function (token_type, access_token, appOptions) {

Apps.prototype.stopApp = function (token_type, access_token, app_guid) {
Apps.prototype.stop = function (token_type, access_token, app_guid) {

Apps.prototype.startApp = function (token_type, access_token, app_guid) {
Apps.prototype.start = function (token_type, access_token, app_guid) {

Apps.prototype.deleteApp = function (token_type, access_token, app_guid) {
Apps.prototype.remove = function (token_type, access_token, app_guid) {

Apps.prototype.uploadApp = function (token_type, access_token, app_guid, filePath, async) {
Apps.prototype.upload = function (token_type, access_token, app_guid, filePath, async) {

Apps.prototype.environmentVariables = function (token_type, access_token, app_guid) {
Apps.prototype.getEnvironmentVariables = function (token_type, access_token, app_guid) {

Organizations.prototype.memoryUsage = function (token_type, access_token, org_guid) {
Organizations.prototype.getMemoryUsage = function (token_type, access_token, org_guid) {

Organizations.prototype.summary = function (token_type, access_token, org_guid) {
Organizations.prototype.getSummary = function (token_type, access_token, org_guid) {

OrganizationsQuota.prototype.quotaDefinitions = function (token_type, access_token) {
OrganizationsQuota.prototype.getQuotaDefinitions = function (token_type, access_token) {

OrganizationsQuota.prototype.quotaDefinition = function (token_type, access_token, org_guid) {
OrganizationsQuota.prototype.getQuotaDefinition = function (token_type, access_token, org_guid) {

Routes.prototype.addRoute = function (token_type, access_token, routeOptions) {
Routes.prototype.add = function (token_type, access_token, routeOptions) {

Routes.prototype.deleteRoute = function (token_type, access_token, route_guid) {
Routes.prototype.remove = function (token_type, access_token, route_guid) {

ServiceBindings.prototype.removeServiceBinding = function (token_type, access_token, service_guid){
ServiceBindings.prototype.remove = function (token_type, access_token, service_guid) {

Spaces.prototype.summary = function (token_type, access_token, space_guid) {
Spaces.prototype.getSummary = function (token_type, access_token, space_guid) {

Spaces.prototype.userRoles = function (token_type, access_token, space_guid) {
Spaces.prototype.getUserRoles = function (token_type, access_token, space_guid) {

SpacesQuota.prototype.quotaDefinitions = function (token_type, access_token) {
SpacesQuota.prototype.getQuotaDefinitions = function (token_type, access_token) {

UserProvidedServices.prototype.create = function (token_type, access_token, user_provided_service_options) {
UserProvidedServices.prototype.add = function (token_type, access_token, user_provided_service_options) {

UserProvidedServices.prototype.delete = function (token_type, access_token, service_guid) {
UserProvidedServices.prototype.remove = function (token_type, access_token, service_guid) {

Users.prototype.getUsers = function (token_type, access_token, user_guid) {
Users.prototype.getUsers = function (token_type, access_token) {
```
Environment: LOCAL_INSTANCE_1

  72 passing (2m)
  26 pending

Environment: PIVOTAL

  64 passing (5m)
  21 pending

Environment: BLUEMIX

  64 passing (5m)
  21 pending

## Version 0.10.0 2015-11-06

- Adding Online documentation: http://prosociallearneu.github.io/cf-nodejs-client-docs/
- Add method to restage Apps
- Refactor methods:
UserProvidedServices.prototype.create
Routes.prototype.checkRoute & Routes.prototype.getRoutes
Logs.prototype.getRecent
CloudFoundry.prototype.login
Apps.prototype.associateRoute
Apps.prototype.associateRoute
Apps.prototype.stopApp & Apps.prototype.startApp
Apps.prototype.getAppByName
Apps.prototype.getApps
Routes.prototype.addRoute
Routes.prototype.checkRoute

Environment: LOCAL_INSTANCE_1

  71 passing (2m)
  25 pending

Environment: PIVOTAL

  63 passing (4m)
  20 pending

Environment: BLUEMIX

  63 passing (4m)
  20 pending


## Version 0.9.1 2015-10-29

- Adding the dependency Bluebird to improve the performance
- Adding support for Quotas (Org/Space)
- It is possible to create users in the system. (Quota/Org/Space/User)

Environment: LOCAL_INSTANCE_1

  65 passing (2m)
  23 pending

Environment: PIVOTAL

  58 passing (3m)
  19 pending

Environment: BLUEMIX

  58 passing (3m)
  19 pending

## Version 0.9.0 2015-10-23

- Adding support for Java Buildpack
- Testing development in 3 environments: Local Instance (Yudai), PSW & Bluemix
- Initial support for Organizations & Spaces

Environment: LOCAL_INSTANCE_1

  57 passing (1m)
  16 pending

Environment: PIVOTAL

  57 passing (1m)
  16 pending

Environment: BLUEMIX

  57 passing (4m)
  16 pending  

## Version 0.8.3 2015-10-19

- Adding the capability to add filters in a Service Binding Search.

  39 passing (1m)
  15 pending

## Version 0.8.2 2015-10-19

- Minor fix in index.js to export UserProvidedServices in the right way.

  39 passing (2m)
  14 pending

## Version 0.8.1 2015-10-01

- Adding adding method in the whole project: setEndPoint

  39 passing (2m)
  14 pending

## Version 0.8.0 2015-09-28

- Adding support for User Provided Services
- Adding support for Service Binding

  39 passing (1m)
  14 pending

## Version 0.7.0 2015-09-10

- Big performance improvement in tests.
- Remove the usage of process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
- Initial Log support

  37 passing (2m)
  6 pending

## Version 0.6.2 2015-09-04

- CloudFoundry.setEndpoint (0.6.1)
- App.uploadApp with async flag
- App.uploadApp without the useless parameter appName

  35 passing (3m)
  4 pending

## Version 0.0.6 2015-08-20

- Better support for: Create App, Upload Bits for App & Start App

  32 passing (3m)
  3 pending

## Version 0.0.5 2015-08-14

- Pending

  16 passing (23s)
  3 pending

