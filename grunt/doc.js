Array.prototype.contains = function(obj) {
    var i = this.length;
    while (i--) {
        if (this[i] === obj) {
            return true;
        }
    }
    return false;
}

function Doc(filename,abspath, grunt) {
    this.grunt = grunt;
    this.filename = filename;
    this.abspath = abspath;
    this.folder = abspath.substring(0,abspath.length - filename.length).replace("apidoc/","api/");
    this.schemefolder = abspath.substring(0,abspath.length - filename.length).replace("apidoc/","database/schemes/");
    this.testfolder = this.folder.replace("api/","test/");
    this.version = undefined;
    this.filetitle = undefined;
    this.json = {};
    this.supportedMethods = [];
    this.readFile(grunt);
}

Doc.prototype.readFile = function(grunt) {

    this.json=grunt.file.readJSON(this.abspath);

    this.version = this.json.version;
    this.filetitle = this.json.title.toLowerCase();
    //Iterate over permissions and get all supported methods
    var that = this;
    this.json.permission.forEach(function(permission) {

        permission.methods.forEach(function(method) {
            if(!that.supportedMethods.contains(method)) {
                that.supportedMethods.push(method);

            }
        });

    });
}

Doc.prototype.pathToAppJsFromFolder = function(folder,minus) {

    if(!minus) {
        minus = 0;
    }
    var level = folder.split('/').length ;
    var pathToAppJS = "app.js";
    for(var i=0;i<=level-minus;i++) pathToAppJS = "../" + pathToAppJS;
    return pathToAppJS;
}
module.exports = Doc;