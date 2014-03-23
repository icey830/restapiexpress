/**
 * Created by samschmid on 24.02.14.
 */

var Docs = require('./grunt/docs.js');
var Setup = require('./grunt/setup.js');

module.exports = function(grunt){

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        appconfig: grunt.file.readJSON('config.json'),
    });

    grunt.registerTask('default', 'searchDocs', function() {

        var allDocuments = new Docs(grunt);

        for(var i=0;i<allDocuments.docs.length;i++) {
            var doc = allDocuments.docs[i];

            if(doc.json.title === 'api') {

                doc.createJsForAPI();

            } else {

                grunt.log.debug("start createing doc");
                doc.createJsForInstanceAndCollection();

            }

        }

        var versionArray = [];
        allDocuments.versions.forEach(function(version) {
            var selfref =
            {
                "type":"application/com.github.restapiexpress.api",
                "rel": "Version " + version,
                "method": "GET",
                "href": "http://localhost:3000/v"+version+"/"
            };
            versionArray.push(selfref);
        });

        var versionJson = {"versions" : versionArray};

        grunt.file.write(__dirname + '/api/versions.json', JSON.stringify(versionJson));

        var test = grunt.file.read('./grunt/templates/test.template');
        var http200 = grunt.file.read('./grunt/templates/tests/http200.template');
        test = test + '\n' + http200;

        var modifiedContent =  test.replace('{{{METHOD}}}',"GET");
        modifiedContent =  modifiedContent.replace('{{{method}}}',"get");
        var path = '/';
        modifiedContent =  modifiedContent.replace('{{{path}}}',path);
        modifiedContent =  modifiedContent.replace('{{{path}}}',path);
        modifiedContent =  modifiedContent.replace('{{{role}}}',"public");
        modifiedContent =  modifiedContent.replace('{{{role}}}',"public");
        modifiedContent =  modifiedContent.replace('{{{appjs}}}',__dirname + '/app.js');
        grunt.file.write(__dirname + '/test/versions.js', modifiedContent);

    });

    grunt.registerTask('test', 'test with mocha', function() {

        var done = this.async();
        require('child_process').exec('make test', function (err, stdout) {
            grunt.log.write(stdout);
            done(err);
        });
    });

    grunt.registerTask('setup', 'install extensions', function() {

        var setup = new Setup(grunt);
        setup.downloadDependencies(this);
    });

};