/*jslint node: true*/
/*global describe: true, before:true, it: true*/
"use strict";

var Promise = require('bluebird');
var chai = require("chai"),
    expect = require("chai").expect;
var randomWords = require('random-words');

var argv = require('optimist').demand('config').argv;
var environment = argv.config;
var nconf = require('nconf');
nconf.argv().env().file({ file: 'config.json' });

var cf_api_url = nconf.get(environment + "_" + 'CF_API_URL'),
    username = nconf.get(environment + "_" + 'username'),
    password = nconf.get(environment + "_" + 'password');

var CloudFoundry = require("../../../lib/model/CloudFoundry");
var CloudFoundrySpaces = require("../../../lib/model/Spaces");
var CloudFoundryUserProvidedServices = require("../../../lib/model/UserProvidedServices");
CloudFoundry = new CloudFoundry(cf_api_url);
CloudFoundrySpaces = new CloudFoundrySpaces(cf_api_url);
CloudFoundryUserProvidedServices = new CloudFoundryUserProvidedServices(cf_api_url);

describe("Cloud foundry User Provided Services", function () {

    var authorization_endpoint = null;
    var token_endpoint = null;
    var token_type = null;
    var access_token = null;
    var space_guid = null;

    before(function () {
        this.timeout(15000);

        CloudFoundry.setEndPoint(cf_api_url);
        CloudFoundrySpaces.setEndPoint(cf_api_url);
        CloudFoundryUserProvidedServices.setEndPoint(cf_api_url);

        return CloudFoundry.getInfo().then(function (result) {
            authorization_endpoint = result.authorization_endpoint;             
            token_endpoint = result.token_endpoint;
            return CloudFoundry.login(authorization_endpoint, username, password);
        }).then(function (result) {
            token_type = result.token_type;
            access_token = result.access_token;
            return CloudFoundrySpaces.getSpaces(token_type, access_token);
        }).then(function (result) {
            space_guid = result.resources[0].metadata.guid;
        });

    });

    function randomInt(low, high) {
        return Math.floor(Math.random() * (high - low) + low);
    }

    it("The platform returns a list of User Provided Services", function () {
        this.timeout(10000);

        return CloudFoundryUserProvidedServices.getServices(token_type, access_token).then(function (result) {
            //console.log(result.resources);
            expect(result.total_results).is.a("number");
        });
    });

    it("The platform returns the first User Provided Service", function () {
        this.timeout(10000);

        var service_guid = null;
        return CloudFoundryUserProvidedServices.getServices(token_type, access_token).then(function (result) {
            if(result.total_results === 0){
                return new Promise(function (resolve, reject) {
                    return reject("No User Provided Service");
                });                
            }            
            service_guid = result.resources[0].metadata.guid;
            return CloudFoundryUserProvidedServices.getService(token_type, access_token, service_guid);
        }).then(function (result) {
            expect(result.metadata.guid).is.a("string");
        }).catch(function (reason) {
            //console.error("Error: " + reason);
            expect(reason).to.equal("No User Provided Service");
        });
    });

    it.skip("Create an User Provided Service", function () {
        this.timeout(10000);

        var serviceName = "s" + randomWords() + randomInt(1, 100);
        var service_guid = null;
        var credentials = {
            dbname : "demo",
            host : "8.8.8.8",
            port : "3306", 
            username : "root",
            password : "123456"
        };
        var user_provided_service_options ={
            "space_guid" : space_guid,
            "name" : serviceName,
            "credentials" : credentials
        };

        return CloudFoundryUserProvidedServices.create(token_type, access_token, user_provided_service_options).then(function (result) {
            expect(result.metadata.guid).is.a("string");
        });
    });

    it("Create & Delete an User Provided Service", function () {
        this.timeout(10000);

        var serviceName = "s" + randomWords() + randomInt(1, 100);
        var service_guid = null;
        var credentials = {
            dbname : "demo",
            host : "8.8.8.8",
            port : "3306", 
            username : "root",
            password : "123456"
        };
        var user_provided_service_options ={
            "space_guid" : space_guid,
            "name" : serviceName,
            "credentials" : credentials
        };        
        return CloudFoundryUserProvidedServices.create(token_type, access_token, user_provided_service_options).then(function (result) {
            service_guid = result.metadata.guid;
            expect(service_guid).is.a("string");
            return CloudFoundryUserProvidedServices.delete(token_type, access_token, service_guid);
        }).then(function (result) {
            expect(true).to.equal(true);
        });
    });

    it("Create, Search & Delete an User Provided Service", function () {
        this.timeout(10000);

        var serviceName = "s" + randomWords() + randomInt(1, 100);
        var service_guid = null;
        var credentials = {
            dbname : "demo",
            host : "8.8.8.8",
            port : "3306", 
            username : "root",
            password : "123456"
        };
        var user_provided_service_options ={
            "space_guid" : space_guid,
            "name" : serviceName,
            "credentials" : credentials
        };         
        return CloudFoundryUserProvidedServices.create(token_type, access_token, user_provided_service_options).then(function (result) {
            service_guid = result.metadata.guid;
            expect(service_guid).is.a("string");
            return CloudFoundryUserProvidedServices.getServiceBindings(token_type, access_token, service_guid);
        }).then(function (result) {   
            expect(result.total_results).is.a("number"); 
            expect(result.total_results).to.equal(0);     
            return CloudFoundryUserProvidedServices.delete(token_type, access_token, service_guid);
        }).then(function (result) {
            expect(true).to.equal(true);
        });
    });    

});