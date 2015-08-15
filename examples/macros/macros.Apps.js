function createApp(appName, buildPack) {

    var token_endpoint = null;
    var app_guid = null;
    var space_guid = null;
    var domain_guid = null;
    var routeName = null;
    var route_guid = null;
    var route_create_flag = false;

    return new Promise(function (resolve, reject) {

        cloudFoundry.getInfo().then(function (result) {
            token_endpoint = result.token_endpoint;
 
            return cloudFoundry.login(token_endpoint,config.username,config.password).then(function (result) {
                return cloudFoundrySpaces.getSpaces(result.token_type,result.access_token).then(function (result) {
                    return new Promise(function (resolve, reject) {
                        space_guid = result.resources[0].metadata.guid;
                        //console.log("Space guid: ", space_guid);
                        return resolve();
                    });
                });         
            });
        //Does exist the application?   
        }).then(function (result) {
            var filter = {
                'q': 'name:' + appName,
                'inline-relations-depth': 1
            }       
            return cloudFoundry.login(token_endpoint,config.username,config.password).then(function (result) {
                return cloudFoundrySpaces.getSpaceApps(result.token_type,result.access_token,space_guid,filter);
            });
        }).then(function (result) {

            //If exist the application, Stop
            if(result.total_results === 1){        
                console.log("Stop App: " + appName);
                app_guid = result.resources[0].metadata.guid;
                console.log("App guid: " , app_guid);
                console.log(result.resources[0].entity.name);

                return cloudFoundry.login(token_endpoint,config.username,config.password).then(function (result) {
                    return cloudFoundryApps.stopApp(result.token_type,result.access_token,app_guid);
                });
            }else{       
                //console.log("Create App");
                return cloudFoundry.login(token_endpoint,config.username,config.password).then(function (result) {
                    return cloudFoundryApps.createApp(result.token_type,result.access_token,appName, space_guid, buildPack).then(function (result) {
                        return new Promise(function (resolve, reject) {
                            //console.log(result);
                            app_guid = result.metadata.guid;
                            return resolve();
                        });
                    });
                });
            }
        }).then(function (result) {
            //TODO: How to make the inference?
            return cloudFoundry.login(token_endpoint,config.username,config.password).then(function (result) {
                return cloudFoundryDomains.getSharedDomains(result.token_type,result.access_token);
            });  
        }).then(function (result) {    
            return cloudFoundry.login(token_endpoint,config.username,config.password).then(function (result) {
                return cloudFoundryDomains.getDomains(result.token_type,result.access_token).then(function (result) {
                    return new Promise(function (resolve, reject) {
                        domain_guid = result.resources[0].metadata.guid;
                        //console.log("Domain guid: " , domain_guid);
                        return resolve();
                    });
                });
            }); 
        }).then(function (result) {     
            return cloudFoundry.login(token_endpoint,config.username,config.password).then(function (result) {
                return cloudFoundryRoutes.checkRoute(result.token_type,result.access_token,appName,domain_guid).then(function (result) {
                    return new Promise(function (resolve, reject) {
                        if(result.total_results == 1){
                            console.log("Exist a Route");
                            //console.log(result.resources);
                            route_guid = result.resources[0].metadata.guid;
                            console.log("Route guid: " , route_guid);
                            return resolve(result);
                        }else{
                            //Add Route
                            route_create_flag = true; //Workaround
                            return resolve();
                        }

                    });
                }); 
            });
        }).then(function (result) {
            //TODO: Refactor syntax to code in the right place
            if(route_create_flag){
                //Add Route
                //console.log("Create a Route");
                routeName = appName;
                return cloudFoundry.login(token_endpoint,config.username,config.password).then(function (result) {   
                    return cloudFoundryRoutes.addRoute(result.token_type,result.access_token,domain_guid,space_guid,routeName).then(function (result) {
                        return new Promise(function (resolve, reject) {
                            //console.log(result);
                            route_guid = result.metadata.guid;
                            return resolve(result);
                        });
                    });  
                });
            }else{
                return new Promise(function (resolve, reject) {
                    return resolve();
                });
            }
        }).then(function (result) {
            return cloudFoundry.login(token_endpoint,config.username,config.password).then(function (result) {
                return cloudFoundryApps.associateRoute(result.token_type,result.access_token,appName,app_guid,domain_guid,space_guid,route_guid);
            });
        }).then(function (result) {
            //console.log(result);
            return resolve(result);
        }).catch(function (reason) {
            console.error("Error: " + reason);
            return reject(reason);
        });            

    }); 

}

module.exports = createApp;