/**
 * Created by samschmid on 28.03.14.
 */

function ApiDescriptionWriter(grunt, rootdir) {
    this.grunt = grunt;
    this.rootdir = rootdir;
}

ApiDescriptionWriter.prototype.write = function(doc)  {

    var grunt = this.grunt;
    var content = grunt.file.read('./grunt/templates/api.template');
    var test = grunt.file.read('./grunt/templates/test.template');
    var http200 = grunt.file.read('./grunt/templates/tests/http200.template');
    test = test + '\n' + http200;
    var self = this;
    doc.supportedMethods.forEach(function(method) {
        doc.json.permission.forEach(function(permission) {
            self.createAPIJsForMethod(doc,permission,method,content);
            self.createAPITestsForMethod(doc,permission,method,test);
        });

    });

}

ApiDescriptionWriter.prototype.createAPIJsForMethod = function(doc,permission,method, content) {
    var links = [];

    var grunt = this.grunt;
    var isAllowed = false;
    if(permission.methods.contains(method.toUpperCase())) {

        var dynLink =
        {
            "type":"application/com.github.restapiexpress.api",
            "rel": "self",
            "method": method,
            "href": "http://localhost:3000/v" + doc.version + "/"
        };

        links.push(dynLink);

        isAllowed = true;
    }

    if(isAllowed) {
        permission.permanentLinks.forEach(function(permanentLink) {
            //if(permanentLink.method === method.toUpperCase()) {
            links.push(permanentLink);

            //}
        });

        var modifiedContent =  content.replace('{{{links}}}',JSON.stringify(links));
        grunt.file.write(doc.folder + '/' + method.toLowerCase()+'/'+permission.role.toLowerCase()+'/instance.json', modifiedContent);
    }

}

ApiDescriptionWriter.prototype.createAPITestsForMethod = function(doc,permission, method, content) {

    var grunt = this.grunt;
    if(permission.methods.contains(method.toUpperCase())) {

        var modifiedContent =  content.replace('{{{METHOD}}}',method.toUpperCase());
        modifiedContent =  modifiedContent.replace('{{{method}}}','delete' == method.toLowerCase() ? 'del' : method.toLowerCase());
        modifiedContent =  modifiedContent.replaceAll('{{{path}}}','/');
        modifiedContent =  modifiedContent.replaceAll('{{{role}}}',permission.role.toLowerCase());
        modifiedContent =  modifiedContent.replace('{{{appjs}}}',this.pathToAppJsFromFolder(doc.testfolder));
        grunt.file.write(doc.testfolder + '/' + method.toLowerCase()+'/'+permission.role.toLowerCase() + '/instance.js', modifiedContent);
    }

}

ApiDescriptionWriter.prototype.pathToAppJsFromFolder = function(folder,minus) {

    if(!minus) {
        minus = 0;
    }
    var level = folder.split('/').length ;
    var pathToAppJS = "app.js";
    for(var i=0;i<=level-minus;i++) pathToAppJS = "../" + pathToAppJS;
    return pathToAppJS;
}

module.exports = ApiDescriptionWriter;