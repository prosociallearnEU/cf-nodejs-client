'use strict';

module.exports = function (grunt) {
    var localhost = 'http://localhost:';
    var default_port = 9000;
    var development_browser = "Google Chrome";

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
                src: ['./lib/<utils></utils>/*.js', './test/*.js'],
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
    grunt.registerTask('docs', ['jsdoc:dist','connect:docs']);
};