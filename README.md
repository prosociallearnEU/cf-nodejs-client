# cf-nodejs-client [Alpha]
A Cloud Foundry Client for Node.js

#### Note: Not use this library in a production App.

This project try to provide a library to interact with Cloud Foundry REST API.
http://apidocs.cloudfoundry.org/213/

Currently, Pivotal offer the following clients:

https://github.com/cloudfoundry/cli

https://github.com/cloudfoundry/cf-java-client

The library uses Promises.

https://promisesaplus.com/

https://strongloop.com/strongblog/promises-in-node-js-with-q-an-alternative-to-callbacks/

Usage

``` Javascript

/*jslint node: true*/
/*global describe: true, it: true*/
"use strict";

var config = require('./config.json');
var cloudFoundry = require("cf-nodejs-client").CloudFoundry;
cloudFoundry = new cloudFoundry(config.CF_API_URL);

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

var token_endpoint = null;

cloudFoundry.getInfo().then(function (result) {
	token_endpoint = result.token_endpoint;	
    return cloudFoundry.login(token_endpoint,config.username,config.password);
}).then(function (result) {
    console.log(result);   
}).catch(function (reason) {
    console.error("Error: " + reason);
});

```