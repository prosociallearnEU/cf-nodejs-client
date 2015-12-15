# cf-nodejs-client 

[![Build Status](https://travis-ci.org/prosociallearnEU/cf-nodejs-client.svg)](https://travis-ci.org/prosociallearnEU/cf-nodejs-client) 
[![Dependency Status](https://david-dm.org/prosociallearnEU/cf-nodejs-client.svg)](https://david-dm.org/prosociallearnEU/cf-nodejs-client) 
[![devDependency Status](https://david-dm.org/prosociallearnEU/cf-nodejs-client/dev-status.svg)](https://david-dm.org/prosociallearnEU/cf-nodejs-client#info=devDependencies)
[![Changelog](https://img.shields.io/badge/see-CHANGELOG-red.svg?style=flat-square)](https://github.com/prosociallearnEU/cf-nodejs-client/blob/master/CHANGELOG.md)

[![NPM](https://nodei.co/npm/cf-nodejs-client.png?stars=true)](https://nodei.co/npm/cf-nodejs-client/)

#### Note: This package is not ready for a production App yet.

This project provides a simple client library to interact with the [Cloud Foundry Architecture](https://docs.pivotal.io/pivotalcf/concepts/architecture/):

![ScreenShot](https://raw.githubusercontent.com/prosociallearnEU/cf-nodejs-client/master/docs/cf_architecture_block.png)

Using this library, you could interact the following components on [PWS](https://console.run.pivotal.io)
, [Bluemix](https://console.ng.bluemix.net/) or a [Local Cloud Foundry instance](https://github.com/yudai/cf_nise_installer):

| **[Cloud Controller](http://apidocs.cloudfoundry.org/)**  	| **[UAA](https://github.com/cloudfoundry/uaa)**   	| **Logging & Metrics** 	|
|------------------------ |-----------------------	|------------------------	|
| [Apps](http://prosociallearneu.github.io/cf-nodejs-client-docs/docs/v0.11.0/Apps.html)                    | [Users](http://prosociallearneu.github.io/cf-nodejs-client-docs/docs/v0.11.0/UsersUAA.html)             	    | [Logs](http://prosociallearneu.github.io/cf-nodejs-client-docs/docs/v0.11.0/Logs.html)                   	|
| [Buildpacks](http://prosociallearneu.github.io/cf-nodejs-client-docs/docs/v0.11.0/BuildPacks.html)              |                    	    |                       	|
| [Domains](http://prosociallearneu.github.io/cf-nodejs-client-docs/docs/v0.11.0/Domains.html)                 |                    	    |                       	|
| [Jobs](http://prosociallearneu.github.io/cf-nodejs-client-docs/docs/v0.11.0/Jobs.html)                    |                    	    |                       	|
| [Organizations](http://prosociallearneu.github.io/cf-nodejs-client-docs/docs/v0.11.0/Organizations.html)           |                    	    |                       	|
| [Organizations Quotas](http://prosociallearneu.github.io/cf-nodejs-client-docs/docs/v0.11.0/OrganizationsQuota.html)     |                    	    |                       	|
| [Routes](http://prosociallearneu.github.io/cf-nodejs-client-docs/docs/v0.11.0/Routes.html)                  |                    	    |                       	|
| [Services](#) | | |            
| [Service Bindings](http://prosociallearneu.github.io/cf-nodejs-client-docs/docs/v0.11.0/ServiceBindings.html)        |                    	    |                       	|
| [Service Instances](#) | | |            
| [Service Plans](#) | | |            
| [Spaces](http://prosociallearneu.github.io/cf-nodejs-client-docs/docs/v0.11.0/Spaces.html)                  |                    	    |                       	|
| [Spaces Quotas](http://prosociallearneu.github.io/cf-nodejs-client-docs/docs/v0.11.0/SpacesQuota.html)            |                    	    |                       	|
| [Stacks](http://prosociallearneu.github.io/cf-nodejs-client-docs/docs/v0.11.0/Stacks.html)                  |                    	    |                       	|
| [User provided Services](http://prosociallearneu.github.io/cf-nodejs-client-docs/docs/v0.11.0/UserProvidedServices.html)  |                    	    |                       	|
| [Users](http://prosociallearneu.github.io/cf-nodejs-client-docs/docs/v0.11.0/Users.html)                   |                    	    |                       	|

# Applications

[Node.js](https://nodejs.org/) with [Express](http://expressjs.com/) are a great combination to develop Web applications. If you <a href="https://www.google.com/trends/explore#q=python%20flask%2C%20node%20express%2C%20go%20pat%2C%20java%20spark%2C%20ruby%20sinatra&cmpt=q&tz=Etc%2FGMT-2" target="_blank">observe the Sinatra market</a>, you will notice that Node.js has a huge Traction.

The development doesn't cover the whole CC API. Main areas of development are:

**App life cycle:**

* Create an App
* Upload source code in .zip or .war (Support for Static, Node.js & JEE)
* Create an User Provided Services
* Associate Apps with an User Provided Services
* Start | Stop an App
* Restage Apps
* Scale Apps
* Simple Logs management
* Remove Apps
* Remove User Provided Services

**PaaS Management:**

* Organization quota
* Organization
* Space
* UAA Users
* Users

# Getting Started

If you need to interact with a Cloud Foundry platform try this [online tool](https://tonicdev.com/npm/cf-nodejs-client) and use this example:

``` Javascript

var endpoint = "https://api.run.pivotal.io";
var username = "PWS_USERNAME";
var password = "PWS_PASSWORD";
var authorization_endpoint = "";
var CloudFoundry = require("cf-nodejs-client").CloudFoundry;
var CloudFoundryUsersUAA = require("cf-nodejs-client").UsersUAA;
CloudFoundry = new CloudFoundry();
CloudFoundryUsersUAA = new CloudFoundryUsersUAA();
CloudFoundry.setEndPoint(endpoint);
 
CloudFoundry.getInfo().then(function (result) {
    console.log(result);
    authorization_endpoint = result.authorization_endpoint;
    token_endpoint = result.token_endpoint;
    CloudFoundryUsersUAA.setEndPoint(authorization_endpoint);
    return CloudFoundryUsersUAA.login(username, password);
}).then(function (result) {
    console.log(result);
}).catch(function (reason) {
    console.error("Error: " + reason);
});

```

Explore the library and if you like the features, use it on your App:

``` Javascript

npm install cf-nodejs-client --save

```

Online documentation:

[JSDoc](http://prosociallearneu.github.io/cf-nodejs-client-docs/) 

# Testing

This project has a test suite to ensure the reability of this project. Take a look the [Tests cases](https://github.com/jabrena/cf-nodejs-client/tree/master/test/) developed with [Mocha](https://mochajs.org/) & [Chai](http://chaijs.com/api/bdd/) to understand some stuff about [Cloud Foundry](https://www.cloudfoundry.org/)  and the usage of this client. Besides, the project has invested some amount of time in testing phase to be the code with a nice coverage level.

The development has been tested with:

| [Local Instance](https://github.com/yudai/cf_nise_installer) | [PWS](https://console.run.pivotal.io)           | [Bluemix](https://console.ng.bluemix.net/) |
| -------------- |:-------------:| -------:|
| 2.25.0         | 2.44.0        | 2.27.0  |

Last test: 2015/12/15

**Test suite:**

``` shell
npm test

```

**Code coverage:**

``` shell
istanbul cover node_modules/mocha/bin/_mocha -- -R spec

```

**Continous integration:**

``` shell
https://travis-ci.org/jabrena/cf-nodejs-client/

```

# Versions

Take a look this [doc](https://github.com/jabrena/cf-nodejs-client/blob/master/CHANGELOG.md) to check the evolution of this Client for Cloud foundry.

# References

* Developer list: https://lists.cloudfoundry.org/archives/list/cf-dev@lists.cloudfoundry.org/
* Issue management: https://overv.io

# Issues

If you have any question or doubt, please [create an issue](https://github.com/jabrena/cf-nodejs-client/issues). 

Juan Antonio
