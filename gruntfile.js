/**
 * Created by samschmid on 24.02.14.
 */

var Docs = require('./grunt/docs.js');

module.exports = function(grunt){

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

    });

    grunt.test = function() {

        var done = this.async();
        require('child_process').exec('mocha-phantomjs ./tests/index.html', function (err, stdout) {
            grunt.log.write(stdout);
            done(err);
        });
    }

    grunt.registerTask('default', 'searchDocs', function() {

        var allDocuments = new Docs(grunt);

        for(var i=0;i<allDocuments.docs.length;i++) {
            var doc = allDocuments.docs[i];

            if(doc.json.title === 'api') {

                doc.createJsForAPI();

            } else {

                grunt.log.debug("start createing doc");
                doc.createJsForInstanceAndCollection();
                /*var instanceTargetPath = doc.folder + '_get_instance_v' + doc.version;
                var collectionTargetPath = doc.folder + '_get_collection_v' + doc.version;
                grunt.log.debug("targetI:"+instanceTargetPath);
                grunt.log.debug("targetC:"+collectionTargetPath);*/

            }

        }

       /* var done = this.async();
        require('child_process').exec('make test', function (err, stdout) {
            grunt.log.write(stdout);
            done(err);
        });*/
    });

    grunt.registerTask('test', 'test with mocha', function() {

        var done = this.async();
        require('child_process').exec('make test', function (err, stdout) {
            grunt.log.write(stdout);
            done(err);
        });
    });


};