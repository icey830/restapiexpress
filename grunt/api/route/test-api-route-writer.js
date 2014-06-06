/**
 * Created by Samuel Schmid on 28.03.14.
 *
 * Class for writing Test files
 *
 * writes a route tests for each supported VERB
 * GET/POST/PUT/PATCH/HEAD/OPTIONS/DELETE
 *
 * writes a integration test with test user having all rights
 *
 * @type {TestApiRouteWriter}
 */
module.exports = TestApiRouteWriter;

String.prototype.replaceAll = function(target, replacement) {
    return this.split(target).join(replacement);
};

var TestGetResourceWriter = require('./get/test-resource-writer.js');
var TestPostResourceWriter = require('./post/test-resource-writer.js');
var TestPutResourceWriter = require('./put/test-resource-writer.js');
var TestPatchResourceWriter = require('./patch/test-resource-writer.js');
var TestDeleteResourceWriter = require('./delete/test-resource-writer.js');
var TestOptionsResourceWriter = require('./options/test-resource-writer.js');
var IntegrationTestWriter = require('./integration-test-writer.js');
var PrePostConditionTestWriter = require('./pre-post-condition-test-writer.js');


/**
 * Consturcotr
 *
 * @param grunt
 * @param rootdir
 * @constructor
 */
function TestApiRouteWriter(grunt, rootdir) {
    this.grunt = grunt;
    this.rootdir = rootdir;
    this.testGetResourceWriter = new TestGetResourceWriter(grunt, rootdir);
    this.testPostResourceWriter = new TestPostResourceWriter(grunt, rootdir);
    this.testPutResourceWriter = new TestPutResourceWriter(grunt, rootdir);
    this.testPatchResourceWriter = new TestPatchResourceWriter(grunt, rootdir);
    this.testDeleteResourceWriter = new TestDeleteResourceWriter(grunt, rootdir);
    this.testOptionsResourceWriter = new TestOptionsResourceWriter(grunt, rootdir);
    this.integrationTestWriter = new IntegrationTestWriter(grunt, rootdir, this);
    this.prePostConditionTestWriter = new PrePostConditionTestWriter(grunt, rootdir, this.integrationTestWriter);
}

TestApiRouteWriter.prototype.write = function(doc, docs)  {

    var grunt = this.grunt;
    var that = this;

    doc.supportedMethods.forEach(function(method) {
        doc.getPermissions().forEach(function(permission) {

            writeRouteTest(that,method,doc,permission);

        });

    });

    this.writeRouteForTestingAllMethods(doc, docs);

    var test = grunt.file.read('./grunt/templates/test.template');
    var http200 = grunt.file.read('./grunt/templates/tests/http200.template');
    test = test + '\n' + http200;
    this.createAPIDocTestsForMethod(doc,test);
}

TestApiRouteWriter.prototype.writeRouteForTestingAllMethods = function(doc, docs)  {

    var permission  ={
        "role" : "test",
        "description" : "test methods",
        "methods" : doc.supportedVerbs()
    };
    var that = this;

    var allSupportedMethods = doc.apidescription.supportedMethods;
    Object.keys(allSupportedMethods).forEach(function(verb) {
        var method = allSupportedMethods[verb];
        var collectionMethod = method.collection;
        var entityMethod = method.entity;

        //that.grunt.log.writeln(verb + " c " + JSON.stringify(collectionMethod));
        //that.grunt.log.writeln(verb + " e " +  JSON.stringify(entityMethod));

        if(collectionMethod) {

            writeRouteTest(that, verb.toUpperCase(), doc, permission, "collection");
        }
        if(entityMethod) {

            writeRouteTest(that, verb.toUpperCase(), doc, permission, "entity");
        }
    });

    this.integrationTestWriter.write(doc,docs);
    this.prePostConditionTestWriter.write(doc,docs);

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

//
// private
//
function writeRouteTest(that, method, doc, permission, collectionOrEntity) {
    if(!permission.methods.contains(method.toUpperCase())) {

        //No Access tests
        that.createNoAccessInstance(doc,permission,method);
        that.createNoAccessCollection(doc,permission,method);

    } else {
        if(method.toUpperCase() == "GET" || method.toUpperCase() == "HEAD") {
            that.testGetResourceWriter.write(doc, permission, method, collectionOrEntity);
        } else if(method.toUpperCase() == "POST") {
            that.testPostResourceWriter.write(doc, permission, method, collectionOrEntity);
        } else if(method.toUpperCase() == "PUT") {
            that.testPutResourceWriter.write(doc, permission, method, collectionOrEntity);
        } else if(method.toUpperCase() == "PATCH") {
            that.testPatchResourceWriter.write(doc, permission, method, collectionOrEntity);
        } else if(method.toUpperCase() == "DELETE") {
            that.testDeleteResourceWriter.write(doc, permission, method, collectionOrEntity);
        } else if(method.toUpperCase() == "OPTIONS") {
            that.testOptionsResourceWriter.write(doc, permission, method, collectionOrEntity);
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
}

