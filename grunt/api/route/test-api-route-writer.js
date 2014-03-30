/**
 * Created by samschmid on 28.03.14.
 */
String.prototype.replaceAll = function(target, replacement) {
    return this.split(target).join(replacement);
};

var TestGetResourceWriter = require('./get/test-resource-writer.js');

function TestApiRouteWriter(grunt, rootdir) {
    this.grunt = grunt;
    this.rootdir = rootdir;
    this.testGetResourceWriter = new TestGetResourceWriter(grunt, rootdir);
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
                if(method.toUpperCase() == "GET") {
                    that.testGetResourceWriter.write(doc, permission, method);
                } else {

                    that.createInstanceTestsForMethod(doc,permission,method);
                    that.createCollectionTestsForMethod(doc,permission,method);
                }
            }



        });

    });

    var test = grunt.file.read('./grunt/templates/test.template');
    var http200 = grunt.file.read('./grunt/templates/tests/http200.template');
    test = test + '\n' + http200;
    this.createAPIDocTestsForMethod(doc,test);
}

TestApiRouteWriter.prototype.createInstanceTestsForMethod = function(doc,permission, method) {

    var grunt = this.grunt;
    if(permission.methods.contains(method.toUpperCase())) {

        var test = grunt.file.read('./grunt/templates/test.template');
        if(method.toUpperCase() === "POST" || method.toUpperCase() == "PUT" || method.toUpperCase() == "DELETE") {
            var http200 = grunt.file.read('./grunt/templates/tests/http200.template');
            test = test + '\n' + http200;
        } else {
            var http400 = grunt.file.read('./grunt/templates/tests/http400.template');
            test = test + '\n' + http400;
        }


        var modifiedContent =  test.replace('{{{METHOD}}}',method.toUpperCase());
        modifiedContent =  modifiedContent.replace('{{{method}}}','delete' == method.toLowerCase() ? 'del' : method.toLowerCase());
        var path = '/v'+doc.version + '/' + doc.filetitle + '/123.json';
        modifiedContent =  modifiedContent.replaceAll('{{{path}}}',path);
        modifiedContent =  modifiedContent.replaceAll('{{{role}}}',permission.role.toLowerCase());
        modifiedContent =  modifiedContent.replace('{{{appjs}}}',doc.pathToAppJsFromFolder(doc.testfolder));
        grunt.file.write(doc.testfolder + '/' + method.toLowerCase()+'/'+permission.role.toLowerCase() + '/instance.js', modifiedContent);
    } else {
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

}

TestApiRouteWriter.prototype.createCollectionTestsForMethod = function(doc,permission, method) {

    var grunt = this.grunt;
    if(permission.methods.contains(method.toUpperCase())) {

        var test = grunt.file.read('./grunt/templates/test.template');
        if(method.toUpperCase() === "POST") {
            grunt.log.debug("POST");
            var http201 = grunt.file.read('./grunt/templates/tests/http201.template');
            test = test + '\n' + http201;
        }else  if(method.toUpperCase() == "PUT") {
            var http400 = grunt.file.read('./grunt/templates/tests/http400.template');
            test = test + '\n' + http400;
        } else {
            var http200 = grunt.file.read('./grunt/templates/tests/http200.template');
            test = test + '\n' + http200;
        }


        var modifiedContent =  test.replace('{{{METHOD}}}',method.toUpperCase());
        modifiedContent =  modifiedContent.replace('{{{method}}}','delete' == method.toLowerCase() ? 'del' : method.toLowerCase());
        var path = '/v'+doc.version + '/' + doc.filetitle + '/';
        modifiedContent =  modifiedContent.replaceAll('{{{path}}}',path);
        modifiedContent =  modifiedContent.replaceAll('{{{role}}}',permission.role.toLowerCase());
        modifiedContent =  modifiedContent.replace('{{{appjs}}}',doc.pathToAppJsFromFolder(doc.testfolder));
        grunt.file.write(doc.testfolder + '/' + method.toLowerCase()+'/'+permission.role.toLowerCase() + '/collection.js', modifiedContent);
    } else {

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
    modifiedContent =  modifiedContent.replace('{{{method}}}','delete' == method.toLowerCase() ? 'del' : method.toLowerCase());
    modifiedContent =  modifiedContent.replaceAll('{{{path}}}','/');
    modifiedContent =  modifiedContent.replaceAll('{{{role}}}',role.toLowerCase());
    modifiedContent =  modifiedContent.replace('{{{appjs}}}',doc.pathToAppJsFromFolder(doc.testfolder,2));
    grunt.file.write(doc.testfolder + 'doc-get.js', modifiedContent);

    method = "POST";
    var modifiedContent =  originalContet.replace('{{{METHOD}}}',method.toUpperCase());
    modifiedContent =  modifiedContent.replace('{{{method}}}','delete' == method.toLowerCase() ? 'del' : method.toLowerCase());
    modifiedContent =  modifiedContent.replaceAll('{{{path}}}','/');
    modifiedContent =  modifiedContent.replaceAll('{{{role}}}',role.toLowerCase());
    modifiedContent =  modifiedContent.replace('{{{appjs}}}',doc.pathToAppJsFromFolder(doc.testfolder,2));
    grunt.file.write(doc.testfolder + 'doc-post.js', modifiedContent);
}


module.exports = TestApiRouteWriter;