# cf-nodejs-client [Alpha]
A Cloud Foundry Client for Node.js

[![NPM](https://nodei.co/npm/cf-nodejs-client.png?compact=true)](https://nodei.co/npm/cf-nodejs-client/)

[![Build Status](https://travis-ci.org/jabrena/cf-nodejs-client.svg)](https://travis-ci.org/jabrena/cf-nodejs-client)

#### Note: Not ready for a production App yet.

This project try to provide a library to interact with Cloud Foundry REST API.
http://apidocs.cloudfoundry.org/

# Usage

``` Javascript

"use strict";

var pivotal_endpoint = "https://api.run.pivotal.io";
var pivotal_user = "xxx";
var pivotal_password = "yyy";

var cloudFoundry = require("cf-nodejs-client").CloudFoundry;
cloudFoundry = new cloudFoundry(pivotal_endpoint);

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

var token_endpoint = null;

cloudFoundry.getInfo().then(function (result) {
	token_endpoint = result.token_endpoint;	
    return cloudFoundry.login(token_endpoint,pivotal_user,pivotal_password);
}).then(function (result) {
    console.log(result);   
}).catch(function (reason) {
    console.error("Error: " + reason);
});

```