# cf-nodejs-client

[![Build Status](https://travis-ci.org/IBM-Bluemix/cf-nodejs-client.svg)](https://travis-ci.org/IBM-Bluemix/cf-nodejs-client)
[![Dependency Status](https://david-dm.org/IBM-Bluemix/cf-nodejs-client.svg)](https://david-dm.org/IBM-Bluemix/cf-nodejs-client)
[![devDependency Status](https://david-dm.org/IBM-Bluemix/cf-nodejs-client/dev-status.svg)](https://david-dm.org/IBM-Bluemix/cf-nodejs-client#info=devDependencies)
[![Changelog](https://img.shields.io/badge/see-CHANGELOG-red.svg?style=flat-square)](https://github.com/IBM-Bluemix/cf-nodejs-client/blob/master/CHANGELOG.md)

[![NPM](https://nodei.co/npm/cf-client.png?stars=true)](https://nodei.co/npm/cf-client/)

#### Note: This package is not ready for a production App yet.

This project provides a simple client library to interact with the [Cloud Foundry Architecture](https://docs.pivotal.io/pivotalcf/concepts/architecture/):

![ScreenShot](https://raw.githubusercontent.com/IBM-Bluemix/cf-nodejs-client/master/docs/cf_architecture_block.png)

Using this library, you could interact with the following platforms: [PWS](https://console.run.pivotal.io)
, [Bluemix](https://console.ng.bluemix.net/) or a [Local Cloud Foundry instance](https://github.com/yudai/cf_nise_installer):

| **[Cloud Controller](http://apidocs.cloudfoundry.org/)**  	| **[UAA](https://github.com/cloudfoundry/uaa)**   	| **Logging & Metrics** 	|
|------------------------ |-----------------------	|------------------------	|
| [Apps](https://IBM-Bluemix.github.io/cf-nodejs-client/docs/v0.12.0/Apps.html)                    | [Users](https://IBM-Bluemix.github.io/cf-nodejs-client/docs/v0.12.0/UsersUAA.html)             	    | [Logs](https://IBM-Bluemix.github.io/cf-nodejs-client/docs/v0.12.0/Logs.html)                   	|
| [Buildpacks](https://IBM-Bluemix.github.io/cf-nodejs-client/docs/v0.12.0/BuildPacks.html)              |                    	    |                       	|
| [Domains](https://IBM-Bluemix.github.io/cf-nodejs-client/docs/v0.12.0/Domains.html)                 |                    	    |                       	|
| [Jobs](https://IBM-Bluemix.github.io/cf-nodejs-client/docs/v0.12.0/Jobs.html)                    |                    	    |                       	|
| [Organizations](https://IBM-Bluemix.github.io/cf-nodejs-client/docs/v0.12.0/Organizations.html)           |                    	    |                       	|
| [Organizations Quotas](https://IBM-Bluemix.github.io/cf-nodejs-client/docs/v0.12.0/OrganizationsQuota.html)     |                    	    |                       	|
| [Routes](https://IBM-Bluemix.github.io/cf-nodejs-client/docs/v0.12.0/Routes.html)                  |                    	    |                       	|
| [Services](https://IBM-Bluemix.github.io/cf-nodejs-client/docs/v0.12.0/Services.html) | | |
| [Service Bindings](https://IBM-Bluemix.github.io/cf-nodejs-client/docs/v0.12.0/ServiceBindings.html)        |                    	    |                       	|
| [Service Instances](https://IBM-Bluemix.github.io/cf-nodejs-client/docs/v0.12.0/ServiceInstances.html) | | |
| [Service Plans](https://IBM-Bluemix.github.io/cf-nodejs-client/docs/v0.12.0/ServicePlans.html) | | |
| [Spaces](https://IBM-Bluemix.github.io/cf-nodejs-client/docs/v0.12.0/Spaces.html)                  |                    	    |                       	|
| [Spaces Quotas](https://IBM-Bluemix.github.io/cf-nodejs-client/docs/v0.12.0/SpacesQuota.html)            |                    	    |                       	|
| [Stacks](https://IBM-Bluemix.github.io/cf-nodejs-client/docs/v0.12.0/Stacks.html)                  |                    	    |                       	|
| [User provided Services](https://IBM-Bluemix.github.io/cf-nodejs-client/docs/v0.12.0/UserProvidedServices.html)  |                    	    |                       	|
| [Users](https://IBM-Bluemix.github.io/cf-nodejs-client/docs/v0.12.0/Users.html)                   |                    	    |                       	|

# Applications

[Node.js](https://nodejs.org/) with [Express](http://expressjs.com/) are a great combination to develop Web applications. If you <a href="https://www.google.com/trends/explore#q=python%20flask%2C%20node%20express%2C%20golang%20pat%2C%20java%20spark%2C%20ruby%20sinatra&cmpt=q&tz=Etc%2FGMT-2" target="_blank">observe the Sinatra market</a>, you will notice that Node.js has a huge Traction.

The development doesn't cover the whole CC API. Main areas of development are:

**App life cycle:**

* Create an App
* Upload source code in .zip or .war (Support for Static, Python, PHP, Node.js & JEE)
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
* Services, Service Instances, Service Plans, User provided Services & Service Binding
* UAA Users
* Users

# Getting Started

If you need to interact with a Cloud Foundry platform try this [online tool](https://tonicdev.com/npm/cf-client) and use this example:

``` Javascript
"use-strict";

const endpoint = "https://api.ng.bluemix.net";
const username = "PWS_USERNAME";
const password = "PWS_PASSWORD";

const CloudController = new (require("cf-client")).CloudController(endpoint);
const UsersUAA = new (require("cf-client")).UsersUAA;
const Apps = new (require("cf-client")).Apps(endpoint);

CloudController.getInfo().then( (result) => {
    UsersUAA.setEndPoint(result.authorization_endpoint);
    return UsersUAA.login(username, password);
}).then( (result) => {
	Apps.setToken(result);
    return Apps.getApps();
}).then( (result) => {
    console.log(result);
}).catch( (reason) => {
    console.error("Error: " + reason);
});

```

Explore the library and if you like the features, use it on your App:

``` Javascript

npm install cf-client --save

```

# Technical Documentation

[JSDoc](https://IBM-Bluemix.github.io/cf-nodejs-client/)

# Testing

This project has a test suite to ensure the readability of this project. Take a look the [Tests cases](https://github.com/jabrena/cf-nodejs-client/tree/master/test/) developed with [Mocha](https://mochajs.org/) & [Chai](http://chaijs.com/api/bdd/) to understand some stuff about [Cloud Foundry](https://www.cloudfoundry.org/)  and the usage of this client. Besides, the project has invested some amount of time in testing phase to be the code with a nice coverage level.

The development has been tested with:

| [Local Instance](https://github.com/yudai/cf_nise_installer) | [PWS](https://console.run.pivotal.io)           | [Bluemix](https://console.ng.bluemix.net/) |
| -------------- |:-------------:| -------:|
| 2.25.0         | 2.47.0        | 2.40.0  |

**Last test:** 2016/01/26

**Testing against Bluemix:**

``` shell
export BLUEMIX_CF_API_URL=https://api.ng.bluemix.net && export BLUEMIX_username=$USERNAME && export BLUEMIX_password=$PASSWORD && npm run test:bluemix
```

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
https://travis-ci.org/IBM-Bluemix/cf-nodejs-client/

```

# Versions

Take a look this [doc](https://github.com/IBM-Bluemix/cf-nodejs-client/blob/master/CHANGELOG.md) to check the evolution of this Client for Cloud foundry.

# References

* API Docs: http://apidocs.cloudfoundry.org/
* Developer list: https://lists.cloudfoundry.org/archives/list/cf-dev@lists.cloudfoundry.org/
* PWS Console: https://console.run.pivotal.io
* Bluemix Console: https://console.ng.bluemix.net/
* PWS Forum: https://support.run.pivotal.io/forums
* Bluemix Forum: https://developer.ibm.com/answers/
* CF for Beginners: From Zero to Hero http://slides.cf-hero.cloudcredo.io/

# Issues

If you have any question or doubt, please [create an issue](https://github.com/IBM-Bluemix/cf-nodejs-client/issues).

# License

Licensed under the [Apache License, Version 2.0](http://www.apache.org/licenses/LICENSE-2.0).
