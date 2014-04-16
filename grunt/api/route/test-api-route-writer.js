/**
 * Created by samschmid on 28.03.14.
 */
String.prototype.replaceAll = function(target, replacement) {
    return this.split(target).join(replacement);
};

var TestGetResourceWriter = require('./get/test-resource-writer.js');
var TestPostResourceWriter = require('./post/test-resource-writer.js');
var TestPutResourceWriter = require('./put/test-resource-writer.js');
var TestPatchResourceWriter = require('./patch/test-resource-writer.js');
var TestDeleteResourceWriter = require('./delete/test-resource-writer.js');
var TestOptionsResourceWriter = require('./options/test-resource-writer.js');
function TestApiRouteWriter(grunt, rootdir) {
    this.grunt = grunt;
    this.rootdir = rootdir;
    this.testGetResourceWriter = new TestGetResourceWriter(grunt, rootdir);
    this.testPostResourceWriter = new TestPostResourceWriter(grunt, rootdir);
    this.testPutResourceWriter = new TestPutResourceWriter(grunt, rootdir);
    this.testPatchResourceWriter = new TestPatchResourceWriter(grunt, rootdir);
    this.testDeleteResourceWriter = new TestDeleteResourceWriter(grunt, rootdir);
    this.testOptionsResourceWriter = new TestOptionsResourceWriter(grunt, rootdir);
}

TestApiRouteWriter.prototype.write = function(doc)  {

    var grunt = this.grunt;
    var that = this;

    doc.supportedMethods.forEach(function(method) {
        doc.json.permission.forEach(function(permission) {

            if(!permission.methods.contains(method.toUpperCase())) {

                //No Access tests
                that.createNoAccessInstance(doc,permission,method);
                that.createNoAccessCollection(doc,permission,method);

            } else {
                if(method.toUpperCase() == "GET" || method.toUpperCase() == "HEAD") {
                    that.testGetResourceWriter.write(doc, permission, method);
                } else if(method.toUpperCase() == "POST") {
                    that.testPostResourceWriter.write(doc, permission, method);
                } else if(method.toUpperCase() == "PUT") {
                    that.testPutResourceWriter.write(doc, permission, method);
                } else if(method.toUpperCase() == "PATCH") {
                    that.testPatchResourceWriter.write(doc, permission, method);
                } else if(method.toUpperCase() == "DELETE") {
                    that.testDeleteResourceWriter.write(doc, permission, method);
                } else if(method.toUpperCase() == "OPTIONS") {
                    that.testOptionsResourceWriter.write(doc, permission, method);
                } else {

                    that.grunt.log.write("\n=====");
                    that.grunt.log.write("\nNO Resource-Writer TESTS for method " + method.toUpperCase());
                    that.grunt.log.write("\nplease create one in folder /grunt/api/route/ " + method.toLowerCase() + "/");
                    that.grunt.log.write("\nand add it to the api-writer /grunt/api/route/test-api-route-writer.js");
                    that.grunt.log.write("\nyou can see an example for it in folder /grunt/api/route/get/\n");
                    that.grunt.log.write("\nnever forget to write a test case ;-)\n");
                    that.grunt.log.write("=====\n\n");

                }
            }

        });

    });

    var test = grunt.file.read('./grunt/templates/test.template');
    var http200 = grunt.file.read('./grunt/templates/tests/http200.template');
    test = test + '\n' + http200;
    this.createAPIDocTestsForMethod(doc,test);
}

TestApiRouteWriter.prototype.createNoAccessInstance = function(doc,permission, method) {
    var grunt = this.grunt;
    var test = grunt.file.read('./grunt/templates/test.template');
    var http302 = grunt.file.read('./grunt/templates/tests/http302.template');
    test = test + '\n' + http302;

    var modifiedContent =  test.replace('{{{METHOD}}}',method.toUpperCase());
    modifiedContent =  modifiedContent.replace('{{{method}}}','delete' == method.toLowerCase() ? 'del' : method.toLowerCase());
    var path = '/v'+doc.version + '/' + doc.filetitle + '/123.json';
    modifiedContent =  modifiedContent.replaceAll('{{{path}}}',path);
    modifiedContent =  modifiedContent.replaceAll('{{{role}}}',permission.role.toLowerCase());
    modifiedContent =  modifiedContent.replace('{{{appjs}}}',doc.pathToAppJsFromFolder(doc.testfolder));
    grunt.file.write(doc.testfolder + '/' + method.toLowerCase()+'/'+permission.role.toLowerCase() + '/instance.js', modifiedContent);

}

TestApiRouteWriter.prototype.createNoAccessCollection = function(doc,permission, method) {

    var grunt = this.grunt;

    var test = grunt.file.read('./grunt/templates/test.template');
    var http302 = grunt.file.read('./grunt/templates/tests/http302.template');
    test = test + '\n' + http302;

    var modifiedContent =  test.replace('{{{METHOD}}}',method.toUpperCase());
    modifiedContent =  modifiedContent.replace('{{{method}}}','delete' == method.toLowerCase() ? 'del' : method.toLowerCase());
    var path = '/v'+doc.version + '/' + doc.filetitle + '/';
    modifiedContent =  modifiedContent.replaceAll('{{{path}}}',path);
    modifiedContent =  modifiedContent.replaceAll('{{{role}}}',permission.role.toLowerCase());
    modifiedContent =  modifiedContent.replace('{{{appjs}}}',doc.pathToAppJsFromFolder(doc.testfolder));
    grunt.file.write(doc.testfolder + '/' + method.toLowerCase()+'/'+permission.role.toLowerCase() + '/collection.js', modifiedContent);

}

TestApiRouteWriter.prototype.createAPIDocTestsForMethod = function(doc,content) {
    var grunt = this.grunt;
    var method = "GET";
    var role = "public";
    var originalContet = content;

    var modifiedContent =  content.replace('{{{METHOD}}}',method.toUpperCase());
    modifiedContent =  modifiedContent.replace('{{{method}}}', method.toLowerCase());
    modifiedContent =  modifiedContent.replaceAll('{{{path}}}','/');
    modifiedContent =  modifiedContent.replaceAll('{{{role}}}',role.toLowerCase());
    modifiedContent =  modifiedContent.replace('{{{appjs}}}',doc.pathToAppJsFromFolder(doc.testfolder,2));
    grunt.file.write(doc.testfolder + 'doc-get.js', modifiedContent);

    method = "POST";
    var modifiedContent =  originalContet.replace('{{{METHOD}}}',method.toUpperCase());
    modifiedContent =  modifiedContent.replace('{{{method}}}', method.toLowerCase());
    modifiedContent =  modifiedContent.replaceAll('{{{path}}}','/');
    modifiedContent =  modifiedContent.replaceAll('{{{role}}}',role.toLowerCase());
    modifiedContent =  modifiedContent.replace('{{{appjs}}}',doc.pathToAppJsFromFolder(doc.testfolder,2));
    grunt.file.write(doc.testfolder + 'doc-post.js', modifiedContent);
}


module.exports = TestApiRouteWriter;