/**
 * Created by samschmid on 30.03.14.
 */
String.prototype.replaceAll = function(target, replacement) {
    return this.split(target).join(replacement);
};


/**
 * Class for writing Test file
 *
 * writes a route tests DELETE Resource or collection
 *
 * @type {TestDeleteResourceWriter}
 */
module.exports = TestDeleteResourceWriter;

/**
 * Constructor
 *
 * @param grunt
 * @param rootdir
 * @constructor
 */
function TestDeleteResourceWriter(grunt, rootdir) {
    this.grunt = grunt;
    this.rootdir = rootdir;
}

TestDeleteResourceWriter.prototype.write = function(doc, permission, method, collectionOrEntity)  {

    if(collectionOrEntity === undefined) {
        this.writeInstance(doc,permission,method);
        this.writeCollection(doc,permission,method);
    } else if(collectionOrEntity === "collection") {
        this.writeCollection(doc,permission,method);
    } else {
        this.writeInstance(doc,permission,method);
    }

}

TestDeleteResourceWriter.prototype.getInstanceTestContent = function(testfileContent, doc, role, appJsPath, success) {
    var grunt = this.grunt;

    if(success === true) {
        var http200 = grunt.file.read('./grunt/api/route/delete/delete-instance-test.template');
        testfileContent = testfileContent + '\n' + http200;
    } else {
        var http400 = grunt.file.read('./grunt/templates/tests/http400.template');
        testfileContent = testfileContent + '\n' + http400;

    }

    var modifiedContent =  testfileContent.replace('{{{METHOD}}}',"DELETE");
    modifiedContent =  modifiedContent.replace('{{{method}}}',"del");
    if(success === true) {
        var path = '/v'+doc.version + '/' + doc.filetitle + '/' +  doc.json._testId;;
        modifiedContent =  modifiedContent.replaceAll('{{{path}}}',path);
    } else {
        var path = '/v'+doc.version + '/' + doc.filetitle + '/123.json';
        modifiedContent =  modifiedContent.replaceAll('{{{path}}}',path);
    }

    modifiedContent =  modifiedContent.replaceAll('{{{role}}}',role);
    modifiedContent =  modifiedContent.replace('{{{appjs}}}',appJsPath);

    return modifiedContent;

}



TestDeleteResourceWriter.prototype.writeInstance = function(doc,permission,method) {

    var grunt = this.grunt;
    var test = grunt.file.read('./grunt/templates/test.template');
    var modifiedContent = this.getInstanceTestContent(test,doc, permission.role.toLowerCase(),doc.pathToAppJsFromFolder(doc.testfolder), false);
    grunt.file.write(doc.testfolder + '/' + method.toLowerCase()+'/'+permission.role.toLowerCase() + '/instance.js', modifiedContent);

}

TestDeleteResourceWriter.prototype.writeCollection = function(doc,permission,method) {

    var grunt = this.grunt;
    var test = grunt.file.read('./grunt/templates/test.template');
    var http400 = grunt.file.read('./grunt/templates/tests/httpWithScope.template');
    test = test + '\n' + http400;

    var modifiedContent =  test.replace('{{{METHOD}}}',method.toUpperCase());
    modifiedContent = modifiedContent.replace("{{{CODE}}}","400");
    modifiedContent = modifiedContent.replace('{{{SCOPE}}}','["_id","gt","0"]');
    modifiedContent =  modifiedContent.replace('{{{method}}}',"del");
    var path = '/v'+doc.version + '/' + doc.filetitle + '/';
    modifiedContent =  modifiedContent.replaceAll('{{{path}}}',path);
    modifiedContent =  modifiedContent.replaceAll('{{{role}}}',permission.role.toLowerCase());
    modifiedContent =  modifiedContent.replace('{{{appjs}}}',doc.pathToAppJsFromFolder(doc.testfolder));
    grunt.file.write(doc.testfolder + '/' + method.toLowerCase()+'/'+permission.role.toLowerCase() + '/collection.js', modifiedContent);

}
