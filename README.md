# cf-nodejs-client [![Build Status](https://travis-ci.org/jabrena/cf-nodejs-client.svg)](https://travis-ci.org/jabrena/cf-nodejs-client) [![Dependency Status](https://david-dm.org/jabrena/cf-nodejs-client.svg)](https://david-dm.org/jabrena/cf-nodejs-client) [![devDependency Status](https://david-dm.org/jabrena/cf-nodejs-client/dev-status.svg)](https://david-dm.org/jabrena/cf-nodejs-client#info=devDependencies)

[![NPM](https://nodei.co/npm/cf-nodejs-client.png?stars=true)](https://nodei.co/npm/cf-nodejs-client/)

#### Note: This package is not ready for a production App yet.

This project provides a simple client library to interact with the [Cloud Foundry REST API](http://apidocs.cloudfoundry.org/) using [Node.js](https://nodejs.org/). The client provides objects to retrieve information about the following concepts:

* Apps
* BuildPacks
* Domains
* Jobs
* Logs
* Organizations
* Routes
* Service Bindings
* Spaces
* Stacks
* User Provided Services

# Applications

[Node.js](https://nodejs.org/) with [Express](http://expressjs.com/) are a great combination to develop Web applications. If you <a href="https://www.google.com/trends/explore#q=python%20flask%2C%20node%20express%2C%20go%20pat%2C%20java%20spark%2C%20ruby%20sinatra&cmpt=q&tz=Etc%2FGMT-2" target="_blank">observe the Sinatra market</a>, you will notice that the community goes in that address. This library could be useful for you to develop a Web Application to interact with a Cloud Foundry Instance.

The development doesn't cover the whole API. This library puts the focus in the Application life cycle to handle the following tasks:

* Create an App
* Upload zip with source code
* Create an User Provided Services
* Associate Apps with an User Provided Services
* Start | Stop an App
* Logs management
* Scale Apps (Pending)
* Remove Apps
* Remove User Provided Services

# Getting Started

If you need to interact with a Cloud Foundry platform, install the package in your [Node.js](https://nodejs.org/) development:

``` Javascript
npm install cf-nodejs-client --save
```

Once you have installed the package define in a isolated config file the credentials to operate with the platform:

**config.json**

``` Javascript
{
    "endpoint" : "https://api.run.pivotal.io",
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
