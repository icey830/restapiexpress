if (typeof String.prototype.endsWith != 'function') {
    // see below for better implementation!
    String.prototype.endsWith = function (str){
        return this.indexOf(str) == this.length - str.length;
    };
}
Array.prototype.contains = function(obj) {
    var i = this.length;
    while (i--) {
        if (this[i] === obj) {
            return true;
        }
    }
    return false;
}
var fs = require('fs');
var Doc = require('./doc');

function Docs(grunt) {

    this.grunt = grunt;
    this.docs = [];
    this.docMap = {};
    this.versions = [];
    this.findDocs(grunt);

}

Docs.prototype.findDocs = function(grunt) {

    var that = this;

    grunt.file.recurse("./apidoc/", function (abspath, rootdir, subdir, filename) {

        if(filename.endsWith(".json")) {
            if(subdir.indexOf('v') === 0) {
                var version = subdir.substr(1,subdir.indexOf('/') > 0 ? subdir.indexOf('/')-1 : subdir.length);
                if(!that.versions.contains(version)) {
                    that.versions.push(version);

                    //TODO create Test for version
                    that.createVersionTest(version, abspath.substring(0,abspath.length - filename.length).replace("apidoc/","test/"));
                }
            }

            var doc = new Doc(filename,abspath,grunt);

            var key = doc.json.type.split("/")[1];
            that.docMap[key] = doc;

            that.docs.push(doc);


        } else {
            //Must be a directory
            //TODO check if isDirectory


        }

    });


    for(var i=0;i<this.docs.length;i++) {
        var doc = this.docs[i];

        grunt.log.debug("Base: " + doc.base);
        if(doc.base && doc.base != "none") {

            doc.baseDoc = this.docMap[doc.base.split("/")[1]];
            grunt.log.debug("basedoc:" + doc.baseDoc.filename);
        }

    }

    for(var i=0;i<this.docs.length;i++) {
        var doc = this.docs[i];

        doc.readParent();

    }

}

Docs.prototype.genereateDocFiles = function() {

    var grunt = this.grunt;
    for(var i=0;i<this.docs.length;i++) {
        var doc = this.docs[i];
        if(!doc.json.type.endsWith(".abstract")) {
            grunt.log.debug("filename: " + doc.generatedDocsFolder + doc.filename);

            var deepJsonCopy = JSON.parse(JSON.stringify(doc.json));
            deepJsonCopy.permission.forEach(function(permission) {

                permission.allowedMethods = undefined;
                permission.deniedMethods = undefined;
            })
            if(doc.model) {
                deepJsonCopy.model = JSON.parse(JSON.stringify(doc.model));
            }

            grunt.file.write(doc.generatedDocsFolder + doc.filename, JSON.stringify(deepJsonCopy,null, 4));
        }


    }

}
Docs.prototype.createVersionTest = function(version, folder) {

    this.grunt.log.debug("folder:" + folder);
    var that = this;
    var grunt = this.grunt;
    var test = grunt.file.read('./grunt/templates/test.template');
    var http200 = grunt.file.read('./grunt/templates/tests/http200.template');
    test = test + '\n' + http200;
    var method = "GET";
    var role = "public";
    var modifiedContent =  test.replace('{{{METHOD}}}',method.toUpperCase());
    modifiedContent =  modifiedContent.replace('{{{method}}}','delete' == method.toLowerCase() ? 'del' : method.toLowerCase());
    modifiedContent =  modifiedContent.replace('{{{path}}}','/v' + version );
    modifiedContent =  modifiedContent.replace('{{{path}}}','/v' + version);
    modifiedContent =  modifiedContent.replace('{{{role}}}',role.toLowerCase());
    modifiedContent =  modifiedContent.replace('{{{role}}}',role.toLowerCase());
    modifiedContent =  modifiedContent.replace('{{{appjs}}}',that.pathToAppJsFromFolder(folder));
    grunt.file.write(folder + 'version.js', modifiedContent);


}

Docs.prototype.pathToAppJsFromFolder = function(folder) {

    var level = folder.split('/').length ;
    var pathToAppJS = "app.js";
    for(var i=0;i<=level-2;i++) pathToAppJS = "../" + pathToAppJS;
    return pathToAppJS;
}
module.exports = Docs;