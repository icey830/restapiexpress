/**
 * Created by samschmid on 24.02.14.
 */

var Docs = require('./grunt/docs.js');

module.exports = function(grunt){

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json')

    });

    grunt.registerTask('default', 'searchDocs', function() {
        grunt.log.write('Logging some stuff...').ok();
        var doc = new Docs(grunt);
    });

};