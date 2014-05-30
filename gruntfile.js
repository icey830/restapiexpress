/**
 * Created by Samuel Schmid on 24.02.14.
 *
 * Grunt File for generating all Routes based on JSON-Files located in apidoc-Folder.
 *
 */

var Docs = require('./grunt/docs.js');
var Setup = require('./grunt/setup.js');
var Database = require('./grunt/database/database.js');
var ApiWriter = require('./grunt/api/api-writer.js');
var TestWriter = require('./grunt/api/test-writer.js');
var LibDatabase = require('./lib/database/database');


module.exports = function(grunt){

    /**
     * Initialize Grunt
     */
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        appconfig: grunt.file.readJSON('config.json')
    });

    /**
     * Registers default Tasks which runs with command line command 'grunt'
     *
     * 1. reads all documentation files
     * 2. creates generated apidocs
     * 3. creates all routes
     * 4. creates all tests
     * 5. creates all database files
     */
    grunt.registerTask('default', 'searchDocs', function() {

        var allDocuments = new Docs(grunt);

        allDocuments.genereateDocFiles();

        var apiWriter = new ApiWriter(grunt, __dirname);
        apiWriter.delete(allDocuments);
        apiWriter.write(allDocuments);

        var testWriter = new TestWriter(grunt, __dirname);
        testWriter.delete(allDocuments);
        testWriter.write(allDocuments);

        var db = new Database(grunt);
        db.deleteSchemes(allDocuments);
        db.createSchemes(allDocuments);

    });

    /**
     * Registers test task which runs all test with command line command 'grunt test'
     */
    grunt.registerTask('test', 'test with mocha', function() {

        var done = this.async();

        require('child_process').exec('make test', function (err, stdout) {
            grunt.log.write(stdout);
            if(err) {
                grunt.log.errorlns(err);
            } else {
                grunt.log.ok("Test run SUCCESSFULL")
            }

            clearTestDB(done);

        });

        function clearTestDB(done) {
            grunt.log.write("Clear Test DB");
            var database = new LibDatabase(grunt);
            database.clear(done);

        } ;
    });

    /**
     * Registers setup task which downloads all grunt-dependencies with the command line command 'grunt setup'
     */
    grunt.registerTask('setup', 'install extensions', function() {

        var setup = new Setup(grunt);
        setup.downloadDependencies(this);
    });

    /**
     * Registers database task which creates all database files which runs with the command line command 'grunt setup'
     */
    grunt.registerTask('database', 'install database features', function() {

        var db = new Database(grunt);
        var docs = new Docs(grunt);
        db.deleteSchemes(docs);
        db.createSchemes(docs);
    });

};