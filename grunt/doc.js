
function Doc(filename,abspath, grunt) {
    this.filename = filename;
    this.abspath = abspath;
    this.version = undefined;
    this.method = undefined;
    this.json = {};
    this.parseFilename(filename,grunt);
    this.readFile(grunt);
}

Doc.prototype.parseFilename = function(filename,grunt) {

    var that = this;

    filename.match(/_doc_(\w+)_v(\d+).json/).map(function(e, index){

        if (index === 1) {
            that.method = e;
        } else if (index === 2) {
            that.version = e;
        }

    });
}

Doc.prototype.readFile = function(grunt) {

    this.json=grunt.file.readJSON(this.abspath);
}

module.exports = Doc;