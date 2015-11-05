'use strict';

module.exports = function (grunt) {
    var localhost = 'http://localhost:';
    var default_port = 9000;
    var development_browser = "Google Chrome";
    if(process.platform === "win32"){
        development_browser = "Chrome";
    }

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        //Run a web server
        connect: {
            coverage: {
                port: default_port,
                base: 'coverage/'
            },
            docs: {
                port: default_port,
                base: 'doc/'
            }           
        },
        //Open a Web Browser
        open : {
            coverage : {
                path: localhost + default_port,
                app: development_browser
            },
            docs : {
                path: localhost + default_port,
                app: development_browser
            },            
        },
        jsdoc : {
            dist : {
                src: [
                    './lib/utils/*.js',
                    './lib/model/Apps.js', 
                    './lib/model/Buildpacks.js', 
                    './lib/model/CloudFoundry.js',
                    './lib/model/Domains.js',
                    './lib/model/Events.js',
                    './lib/model/Jobs.js',
                    './lib/model/Logs.js',                   
                    './lib/model/Organizations.js',
                    './lib/model/OrganizationsQuota.js',
                    './lib/model/Routes.js'                    
                    ],
                options: {
                    destination: 'doc'
                }
            }
        }        
    });

    //Dependencies
    grunt.loadNpmTasks('grunt-open');
    grunt.loadNpmTasks('grunt-connect');
    grunt.loadNpmTasks('grunt-jsdoc');

    //Task definition
    grunt.registerTask('default', 'coverage');
    grunt.registerTask('coverage', ['open:coverage', 'connect:coverage']);
    grunt.registerTask('docs', ['jsdoc:dist','open:docs','connect:docs']);
};