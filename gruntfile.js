/**
 * Created by samschmid on 24.02.14.
 */

var Docs = require('./grunt/docs.js');
var Setup = require('./grunt/setup.js');
var Database = require('./grunt/database/database.js');
var ApiWriter = require('./grunt/api/api-writer.js');
var TestWriter = require('./grunt/api/test-writer.js');
var LibDatabase = require('./lib/database/database');
module.exports = function(grunt){

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        appconfig: grunt.file.readJSON('config.json')
    });

    grunt.registerTask('default', 'searchDocs', function() {

        var allDocuments = new Docs(grunt);
        for(var i=0;i<allDocuments.docs.length;i++) {
            var doc = allDocuments.docs[i];

            if(doc.base && doc.base != "none") {

                doc.baseDoc = allDocuments.docMap[doc.base.split("/")[1]];
                grunt.log.debug("basedoc:" + doc.baseDoc.filename);
            }

        }


        var apiWriter = new ApiWriter(grunt, __dirname);
        apiWriter.write(allDocuments);

        var testWriter = new TestWriter(grunt, __dirname);
        testWriter.write(allDocuments);

        var db = new Database(grunt);
        db.createSchemes(allDocuments);

    });

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

    grunt.registerTask('setup', 'install extensions', function() {

        var setup = new Setup(grunt);
        setup.downloadDependencies(this);
    });

    grunt.registerTask('database', 'install database features', function() {

        var db = new Database(grunt);
        var docs = new Docs(grunt);
        db.createSchemes(docs);
    });

};