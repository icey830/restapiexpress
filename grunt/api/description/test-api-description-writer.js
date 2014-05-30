/**
 * Created by Samuel Schmid on 28.03.14.
 *
 * Class for writing api description Test files
 *
 * @type {TestApiDescriptionWriter}
 */
module.exports = TestApiDescriptionWriter;

/**
 * Constructor
 *
 * @param grunt
 * @param rootdir
 * @constructor
 */
function TestApiDescriptionWriter(grunt, rootdir) {
    this.grunt = grunt;
    this.rootdir = rootdir;
}

/**
 * writes test for each permission and supported verb
 *
 * @param doc
 */
TestApiDescriptionWriter.prototype.write = function(doc)  {

    var grunt = this.grunt;
    var test = grunt.file.read('./grunt/templates/test.template');
    var http200 = grunt.file.read('./grunt/templates/tests/http200.template');
    test = test + '\n' + http200;
    var self = this;
    doc.supportedMethods.forEach(function(method) {
        doc.json.permission.forEach(function(permission) {
            self.writeTests(doc,permission,method,test);
        });

    });

}

//TODO private
TestApiDescriptionWriter.prototype.writeTests = function(doc,permission, method, content) {

    var grunt = this.grunt;
    if(permission.methods.contains(method.toUpperCase())) {

        var modifiedContent =  content.replace('{{{METHOD}}}',method.toUpperCase());
        modifiedContent =  modifiedContent.replace('{{{method}}}','delete' == method.toLowerCase() ? 'del' : method.toLowerCase());
        modifiedContent =  modifiedContent.replaceAll('{{{path}}}','/');
        modifiedContent =  modifiedContent.replaceAll('{{{role}}}',permission.role.toLowerCase());
        modifiedContent =  modifiedContent.replace('{{{appjs}}}',doc.pathToAppJsFromFolder(doc.testfolder));
        grunt.file.write(doc.testfolder + '/' + method.toLowerCase()+'/'+permission.role.toLowerCase() + '/instance.js', modifiedContent);
    }

}

