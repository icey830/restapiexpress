/**
 * Created by samschmid on 28.03.14.
 */
String.prototype.replaceAll = function(target, replacement) {
    return this.split(target).join(replacement);
};

function ApiRouteWriter(grunt, rootdir) {
    this.grunt = grunt;
    this.rootdir = rootdir;
}

ApiRouteWriter.prototype.write = function(doc)  {

    var grunt = this.grunt;
    var instanceContent = grunt.file.read('./grunt/templates/get-instance.template');
    var collectionContent = grunt.file.read('./grunt/templates/get-collection.template');
    var post_collectionContent = grunt.file.read('./grunt/templates/post-collection.template');

    var that = this;

    doc.supportedMethods.forEach(function(method) {
        doc.json.permission.forEach(function(permission) {

            if(method.toUpperCase() == "POST") {
                that.createPOSTCollectionJsForMethod(doc,permission,method,post_collectionContent);
            } else {
                that.createInstanceJsForMethod(doc,permission,method,instanceContent);
                that.createCollectionJsForMethod(doc,permission,method,collectionContent);

            }
            that.createInstanceTestsForMethod(doc,permission,method);
            that.createCollectionTestsForMethod(doc,permission,method);

        });

    });

    var test = grunt.file.read('./grunt/templates/test.template');
    var http200 = grunt.file.read('./grunt/templates/tests/http200.template');
    test = test + '\n' + http200;
    this.createAPIDocTestsForMethod(doc,test);
}

ApiRouteWriter.prototype.createPOSTCollectionJsForMethod = function(doc,permission,method, content) {

    var grunt = this.grunt;
    if(permission.methods.contains(method.toUpperCase())) {
        grunt.file.write(doc.folder + '/' + method.toLowerCase()+'/'+permission.role.toLowerCase()+'/collection.js', content);
    }

}

ApiRouteWriter.prototype.createInstanceJsForMethod = function(doc,permission,method, content) {
    var links = [];
    var grunt = this.grunt;

    if(permission.methods.contains(method.toUpperCase())) {

        var modifiedContent =  content.replace('{{{links}}}',JSON.stringify(links));
        modifiedContent =  modifiedContent.replace('{{{TYPE}}}',JSON.stringify(doc.json.type));
        grunt.file.write(doc.folder + '/' + method.toLowerCase()+'/'+permission.role.toLowerCase()+'/instance.js', modifiedContent);
    }

}

ApiRouteWriter.prototype.createCollectionJsForMethod = function(doc,permission,method, content) {
    var links = [];
    var grunt = this.grunt;
    if(permission.methods.contains(method.toUpperCase())) {

        var modifiedContent =  content.replace('{{{links}}}',JSON.stringify(links));
        modifiedContent =  modifiedContent.replace('{{{TYPE}}}',JSON.stringify(doc.json.type));
        grunt.file.write(doc.folder + '/' + method.toLowerCase()+'/'+permission.role.toLowerCase()+'/collection.js', modifiedContent);
    }

}

ApiRouteWriter.prototype.createInstanceTestsForMethod = function(doc,permission, method) {

    var grunt = this.grunt;
    if(permission.methods.contains(method.toUpperCase())) {

        var test = grunt.file.read('./grunt/templates/test.template');
        var http200 = grunt.file.read('./grunt/templates/tests/http200.template');
        test = test + '\n' + http200;

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

ApiRouteWriter.prototype.createCollectionTestsForMethod = function(doc,permission, method) {

    var grunt = this.grunt;
    if(permission.methods.contains(method.toUpperCase())) {

        var test = grunt.file.read('./grunt/templates/test.template');
        if(method.toUpperCase() === "POST") {
            grunt.log.debug("POST");
            var http201 = grunt.file.read('./grunt/templates/tests/http201.template');
            test = test + '\n' + http201;
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

ApiRouteWriter.prototype.createAPIDocTestsForMethod = function(doc,content) {
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


module.exports = ApiRouteWriter;