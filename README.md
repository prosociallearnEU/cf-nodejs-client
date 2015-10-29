# cf-nodejs-client [![Build Status](https://travis-ci.org/prosociallearnEU/cf-nodejs-client.svg)](https://travis-ci.org/prosociallearnEU/cf-nodejs-client) [![Dependency Status](https://david-dm.org/prosociallearnEU/cf-nodejs-client.svg)](https://david-dm.org/prosociallearnEU/cf-nodejs-client) [![devDependency Status](https://david-dm.org/prosociallearnEU/cf-nodejs-client/dev-status.svg)](https://david-dm.org/prosociallearnEU/cf-nodejs-client#info=devDependencies)

[![NPM](https://nodei.co/npm/cf-nodejs-client.png?stars=true)](https://nodei.co/npm/cf-nodejs-client/)

#### Note: This package is not ready for a production App yet.

This project provides a simple client library to interact with some components used on the [Cloud Foundry Architecture](http://apidocs.cloudfoundry.org/):

![ScreenShot](https://raw.githubusercontent.com/prosociallearnEU/cf-nodejs-client/master/docs/cf_architecture_block.png)

The features implemented are:

**[Cloud Controller Layer](http://apidocs.cloudfoundry.org/):**

* Apps
* BuildPacks
* Domains
* Jobs
* Organizations
* Organizations Quota
* Routes
* Service Bindings
* Spaces
* Spaces Quota
* Stacks
* User Provided Services
* Users

**Authentication layer:**

* UAA Users

**Logging & Metrics layer:**

* Logs

Using this library, you could interact with [PWS](https://console.run.pivotal.io)
, [Bluemix](https://console.ng.bluemix.net/) or a [Local Cloud Foundry instance](https://github.com/yudai/cf_nise_installer) using [Node.js](https://nodejs.org/).

# Applications

[Node.js](https://nodejs.org/) with [Express](http://expressjs.com/) are a great combination to develop Web applications. If you <a href="https://www.google.com/trends/explore#q=python%20flask%2C%20node%20express%2C%20go%20pat%2C%20java%20spark%2C%20ruby%20sinatra&cmpt=q&tz=Etc%2FGMT-2" target="_blank">observe the Sinatra market</a>, you will notice that Node.js has a huge Traction.

The development doesn't cover the whole CC API. Main areas of development are:

**App life cycle:**

* Create an App
* Upload source code in .zip or .war (Support for Static, Node.js & JEE)
* Create an User Provided Services
* Associate Apps with an User Provided Services
* Start | Stop an App
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

If you need to interact with a Cloud Foundry platform, install the package in your [Node.js](https://nodejs.org/) development:

``` Javascript
npm install cf-nodejs-client --save
```

Once you have installed the package define in a isolated config file the credentials to operate with the platform:

**config.json**

Interacting with Pivotal or Bluemix:

``` Javascript
{
    "endpoint" : "https://api.run.pivotal.io", || "endpoint" : "https://api.eu-gb.bluemix.net",
    "username" : "xxx",
    "password" : "yyy"
}
```

With the credentials defined, create a new file to paste this code to authenticate with the platform.

**example.js**

``` Javascript

"use strict";

var config = require('./config.json');//Load CF configuration

var CloudFoundry = require("cf-nodejs-client").CloudFoundry;
CloudFoundry = new CloudFoundry();
CloudFoundry.setEndPoint(config.endpoint);

CloudFoundry.getInfo().then(function (result) {
    return CloudFoundry.login(result.token_endpoint,config.username,config.password);
}).then(function (result) {
    console.log(result);   
}).catch(function (reason) {
    console.error("Error: " + reason);
});

```

Save the file and test:

``` shell
node example.js

```

# Testing

This project has a test suite to ensure the reability of this project. Take a look the [Tests cases](https://github.com/jabrena/cf-nodejs-client/tree/master/test/) developed with [Mocha](https://mochajs.org/) & [Chai](http://chaijs.com/api/bdd/) to understand some stuff about [Cloud Foundry](https://www.cloudfoundry.org/)  and the usage of this client. Besides, the project has invested some amount of time in testing phase to be the code with a nice coverage level.

The development has been tested with:

| [Local Instance](https://github.com/yudai/cf_nise_installer) | [PWS](https://console.run.pivotal.io)           | [Bluemix](https://console.ng.bluemix.net/) |
| -------------- |:-------------:| -------:|
| 2.25.0         | 2.41.0        | 2.27.0  |

Note: Last test: 2015/10/29

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

# Issues

If you have any question or doubt, please [create an issue](https://github.com/jabrena/cf-nodejs-client/issues). 

Juan Antonio
