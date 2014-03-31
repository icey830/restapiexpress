/**
 * Created by samschmid on 30.03.14.
 */
String.prototype.replaceAll = function(target, replacement) {
    return this.split(target).join(replacement);
};

function TestPostResourceWriter(grunt, rootdir) {
    this.grunt = grunt;
    this.rootdir = rootdir;
}

TestPostResourceWriter.prototype.write = function(doc, permission, method)  {

    this.writeInstance(doc,permission,method);
    this.writeCollection(doc,permission,method);

}

TestPostResourceWriter.prototype.writeInstance = function(doc,permission,method) {

    var grunt = this.grunt;
    var test = grunt.file.read('./grunt/templates/test.template');
    var http200 = grunt.file.read('./grunt/templates/tests/http200sendsJson.template');
    test = test + '\n' + http200;

    var json = {
        "email": 'Bobby@bob.com'
    };

    var modifiedContent =  test.replace('{{{METHOD}}}',method.toUpperCase());
    modifiedContent =  modifiedContent.replace('{{{method}}}',method.toLowerCase());
    modifiedContent =  modifiedContent.replace('{{{JSON}}}',JSON.stringify(json));
    var path = '/v'+doc.version + '/' + doc.filetitle + '/5339a146d46d35ebe95303ad';
    modifiedContent =  modifiedContent.replaceAll('{{{path}}}',path);
    modifiedContent =  modifiedContent.replaceAll('{{{role}}}',permission.role.toLowerCase());
    modifiedContent =  modifiedContent.replace('{{{appjs}}}',doc.pathToAppJsFromFolder(doc.testfolder));
    grunt.file.write(doc.testfolder + '/' + method.toLowerCase()+'/'+permission.role.toLowerCase() + '/instance.js', modifiedContent);

}

TestPostResourceWriter.prototype.writeCollection = function(doc,permission,method) {

    var grunt = this.grunt;
    var test = grunt.file.read('./grunt/templates/test.template');
    var http201 = grunt.file.read('./grunt/templates/tests/http201.template');
    test = test + '\n' + http201;

    var modifiedContent =  test.replace('{{{METHOD}}}',method.toUpperCase());
    modifiedContent =  modifiedContent.replace('{{{method}}}',method.toLowerCase());
    var path = '/v'+doc.version + '/' + doc.filetitle + '/';
    modifiedContent =  modifiedContent.replaceAll('{{{path}}}',path);
    modifiedContent =  modifiedContent.replaceAll('{{{role}}}',permission.role.toLowerCase());
    modifiedContent =  modifiedContent.replace('{{{appjs}}}',doc.pathToAppJsFromFolder(doc.testfolder));
    grunt.file.write(doc.testfolder + '/' + method.toLowerCase()+'/'+permission.role.toLowerCase() + '/collection.js', modifiedContent);

}

module.exports = TestPostResourceWriter;