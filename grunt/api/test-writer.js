/**
 * Created by Samuel Schmid on 28.03.14.
 *
 * Class for writing Test files
 *
 * writes test for versions, documentation and routes
 *
 * @type {TestWriter}
 */

module.exports = TestWriter;

var TestApiDescriptionWriter = require('./description/test-api-description-writer.js');
var TestApiRouteWriter = require('./route/test-api-route-writer.js');

Array.prototype.contains = function(obj) {
    var i = this.length;
    while (i--) {
        if (this[i] === obj) {
            return true;
        }
    }
    return false;
}

String.prototype.replaceAll = function(target, replacement) {
    return this.split(target).join(replacement);
};

/**
 * Constructor
 *
 * @param grunt
 * @param rootdir
 * @constructor
 */
function TestWriter(grunt, rootdir) {
    this.grunt = grunt;
    this.rootdir = rootdir;
    this.testApiDescWriter = new TestApiDescriptionWriter(grunt, rootdir);
    this.testApiRouteWriter = new TestApiRouteWriter(grunt, rootdir);
}

/**
 * deletes tests
 * @param docs
 */
TestWriter.prototype.delete = function(docs) {
    var grunt = this.grunt;
    if(docs.docs.length == 0) {
        grunt.log.debug("Empty");
        return;
    }

    var versionsToDelete = [];
    for(var i=0;i<docs.docs.length;i++) {
        var doc = docs.docs[i];

        if(doc.json.type.endsWith('.apidescription')) {
            //Dont delete anything
        } else if(doc.json.type.endsWith('.abstract')) {
            //Dont delete anything
        } else {

            var path = doc.testfolder.split("/");
            var version = path[0] + "/"+path[1];
            if(!versionsToDelete.contains(version)) {
                versionsToDelete.push(version);
            }
        }

    }

    versionsToDelete.forEach(function(path) {

        grunt.log.debug("TestWriter: delete files in folder:" + path);
        grunt.file.delete(path);
    })
}

/**
 * create tests
 *
 * @param docs
 */
TestWriter.prototype.write = function(docs)  {
    var grunt = this.grunt;

    for(var i=0;i<docs.docs.length;i++) {
        var doc = docs.docs[i];

        if(doc.json.type.endsWith('.apidescription')) {

            this.testApiDescWriter.write(doc);
        } else if(doc.json.type.endsWith('.abstract')) {
            //Dont write anything
        } else {

            grunt.log.debug("start createing test doc");
            this.testApiRouteWriter.write(doc,docs);

        }

    }

    this.writeVersionsTest();

}

/**
 * create Version Tests
 *
 * tests if http://localhost:3000/ returns correct json
 *
 */
TestWriter.prototype.writeVersionsTest = function()  {
    var grunt = this.grunt;
    var test = grunt.file.read('./grunt/templates/test.template');
    var http200 = grunt.file.read('./grunt/templates/tests/http200.template');
    test = test + '\n' + http200;

    var modifiedContent =  test.replace('{{{METHOD}}}',"GET");
    modifiedContent =  modifiedContent.replace('{{{method}}}',"get");
    var path = '/';
    modifiedContent =  modifiedContent.replaceAll('{{{path}}}',path);
    modifiedContent =  modifiedContent.replaceAll('{{{role}}}',"public");
    modifiedContent =  modifiedContent.replace('{{{appjs}}}',this.rootdir + '/app.js');
    grunt.file.write(this.rootdir + '/test/versions.js', modifiedContent);

}
