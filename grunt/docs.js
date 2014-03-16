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
                }
            }

            var doc = new Doc(filename,abspath,grunt);
            that.docs.push(doc);
        } else {
            //Must be a directory
            //TODO check if isDirectory


        }

    });



}

module.exports = Docs;