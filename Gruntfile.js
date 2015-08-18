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
            }
        },
        //Open a Web Browser
        open : {
            coverage : {
                path: localhost + default_port,
                app: development_browser
            }
        }
    });

    //Dependencies
    grunt.loadNpmTasks('grunt-open');
    grunt.loadNpmTasks('grunt-connect');

    //Task definition
    grunt.registerTask('default', 'coverage');
    grunt.registerTask('coverage', ['open:coverage', 'connect:coverage']);
};