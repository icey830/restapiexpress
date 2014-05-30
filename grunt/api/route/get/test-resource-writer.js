/**
 * Created by Samuel Schmid on 30.03.14.
 *
 * Class for writing Test file
 *
 * writes a route tests GET Resource or collection
 *
 * @type {TestGetResourceWriter}
 */
module.exports = TestGetResourceWriter;

String.prototype.replaceAll = function(target, replacement) {
    return this.split(target).join(replacement);
};

function TestGetResourceWriter(grunt, rootdir) {
    this.grunt = grunt;
    this.rootdir = rootdir;
}

TestGetResourceWriter.prototype.write = function(doc, permission, method, collectionOrEntity)  {

    if(collectionOrEntity === undefined) {
        this.writeInstance(doc,permission,method);
        this.writeCollection(doc,permission,method);
    } else if(collectionOrEntity === "collection") {
        this.writeCollection(doc,permission,method);
    } else {
        this.writeInstance(doc,permission,method);
    }

}

TestGetResourceWriter.prototype.generateJson = function(json,doc) {

    for (var property in doc.json.model) {

        var path = doc.json.model[property];
        if(path.mandatory) {
            if(path.hasOwnProperty("test")) {
                json[property] = path.test;
            } else {
                this.grunt.log.write("no testvalue for propert " + property + " in doument " + doc.title);
            }

        }
    }

    if(doc.base && doc.base != "none") {
        this.generateJson(json,doc.baseDoc);

    }

}

TestGetResourceWriter.prototype.getInstanceTestContent = function(testfileContent, doc, role, appJsPath) {
    var grunt = this.grunt;

    var http200 = grunt.file.read('./grunt/api/route/get/get-instance-test.template');
    testfileContent = testfileContent + '\n' + http200;

    var json = {};
    this.generateJson(json,doc);

    var path = '/v'+doc.version + '/' + doc.filetitle + '/' + doc.json._testId;
    var modifiedContent =  testfileContent.replaceAll('{{{path}}}',path);
    modifiedContent =  modifiedContent.replaceAll('{{{role}}}',role);
    modifiedContent =  modifiedContent.replace('{{{appjs}}}',appJsPath);
    modifiedContent = modifiedContent.replace("{{{JSON}}}", JSON.stringify(json));

    return modifiedContent;

}

TestGetResourceWriter.prototype.writeInstance = function(doc,permission,method) {

    this.writeTestGetExistingResource(doc, permission, method);

}

TestGetResourceWriter.prototype.writeCollection = function(doc,permission,method) {

    var grunt = this.grunt;
    var test = grunt.file.read('./grunt/templates/test.template');
    var http200 = grunt.file.read('./grunt/templates/tests/http200.template');
    test = test + '\n' + http200;

    var modifiedContent =  test.replace('{{{METHOD}}}',method.toUpperCase());
    modifiedContent =  modifiedContent.replace('{{{method}}}',method.toLowerCase());
    var path = '/v'+doc.version + '/' + doc.filetitle + '/';
    modifiedContent =  modifiedContent.replaceAll('{{{path}}}',path);
    modifiedContent =  modifiedContent.replaceAll('{{{role}}}',permission.role.toLowerCase());
    modifiedContent =  modifiedContent.replace('{{{appjs}}}',doc.pathToAppJsFromFolder(doc.testfolder));
    grunt.file.write(doc.testfolder + '/' + method.toLowerCase()+'/'+permission.role.toLowerCase() + '/collection.js', modifiedContent);

}


//private
TestGetResourceWriter.prototype.writeTestGetExistingResource = function(doc,permission,method) {
    var grunt = this.grunt;
    var test = grunt.file.read('./grunt/templates/test.template');
    var http400 = grunt.file.read('./grunt/templates/tests/http400.template');
    test = test + '\n' + http400;

    var modifiedContent =  test.replace('{{{METHOD}}}',method.toUpperCase());
    modifiedContent =  modifiedContent.replace('{{{method}}}',method.toLowerCase());
    var path = '/v'+doc.version + '/' + doc.filetitle + '/' + "123.json";
    modifiedContent =  modifiedContent.replaceAll('{{{path}}}',path);
    modifiedContent =  modifiedContent.replaceAll('{{{role}}}',permission.role.toLowerCase());
    modifiedContent =  modifiedContent.replace('{{{appjs}}}',doc.pathToAppJsFromFolder(doc.testfolder));
    grunt.file.write(doc.testfolder + '/' + method.toLowerCase()+'/'+permission.role.toLowerCase() + '/instance.js', modifiedContent);
}
