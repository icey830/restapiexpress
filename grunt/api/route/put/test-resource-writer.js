/**
 * Created by samschmid on 30.03.14.
 */
String.prototype.replaceAll = function(target, replacement) {
    return this.split(target).join(replacement);
};

function TestPutResourceWriter(grunt, rootdir) {
    this.grunt = grunt;
    this.rootdir = rootdir;
}

TestPutResourceWriter.prototype.write = function(doc, permission, method, collectionOrEntity)  {

    if(collectionOrEntity === undefined) {
        this.writeInstance(doc,permission,method);
        this.writeCollection(doc,permission,method);
    } else if(collectionOrEntity === "collection") {
        this.writeCollection(doc,permission,method);
    } else {
        this.writeInstance(doc,permission,method);
    }

}

TestPutResourceWriter.prototype.generateJson = function(json,doc) {

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

TestPutResourceWriter.prototype.getInstanceTestContent = function(testfileContent, doc, role, appJsPath) {
    var grunt = this.grunt;

    var http200 = grunt.file.read('./grunt/api/route/put/put-instance-test.template');
    testfileContent = testfileContent + '\n' + http200;

    var json = {};
    this.generateJson(json,doc);

    var modifiedContent =  testfileContent.replaceAll('{{{JSON}}}',JSON.stringify(json));
    var path = '/v'+doc.version + '/' + doc.filetitle + '/' +  doc.json._testId;;
    modifiedContent =  modifiedContent.replaceAll('{{{path}}}',path);
    modifiedContent =  modifiedContent.replaceAll('{{{role}}}',role);
    modifiedContent =  modifiedContent.replace('{{{appjs}}}',appJsPath);

    return modifiedContent;

}


TestPutResourceWriter.prototype.writeInstance = function(doc,permission,method) {

    var grunt = this.grunt;
    var test = grunt.file.read('./grunt/templates/test.template');

    var modifiedContent = this.getInstanceTestContent(test,doc, permission.role.toLowerCase(),doc.pathToAppJsFromFolder(doc.testfolder));
    grunt.file.write(doc.testfolder + '/' + method.toLowerCase()+'/'+permission.role.toLowerCase() + '/instance.js', modifiedContent);

}

TestPutResourceWriter.prototype.writeCollection = function(doc,permission,method) {

    var grunt = this.grunt;
    var test = grunt.file.read('./grunt/templates/test.template');
    var http405 = grunt.file.read('./grunt/templates/tests/http405.template');
    test = test + '\n' + http405;

    var modifiedContent =  test.replace('{{{METHOD}}}',method.toUpperCase());
    modifiedContent =  modifiedContent.replace('{{{method}}}',method.toLowerCase());
    var path = '/v'+doc.version + '/' + doc.filetitle + '/';
    modifiedContent =  modifiedContent.replaceAll('{{{path}}}',path);
    modifiedContent =  modifiedContent.replaceAll('{{{role}}}',permission.role.toLowerCase());
    modifiedContent =  modifiedContent.replace('{{{appjs}}}',doc.pathToAppJsFromFolder(doc.testfolder));
    grunt.file.write(doc.testfolder + '/' + method.toLowerCase()+'/'+permission.role.toLowerCase() + '/collection.js', modifiedContent);

}

module.exports = TestPutResourceWriter;