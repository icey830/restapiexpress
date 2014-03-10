if (typeof String.prototype.startsWith != 'function') {
    // see below for better implementation!
    String.prototype.startsWith = function (str){
        return this.indexOf(str) == 0;
    };
}

var Doc = require('./doc');


function Docs(grunt) {

    this.grunt = grunt;
    this.docs = [];
    this.findDocs(grunt);

}

Docs.prototype.findDocs = function(grunt) {

    var that = this;
    grunt.file.recurse("./api/", function (abspath, rootdir, subdir, filename) {

        if(filename.startsWith("_doc_")) {
            var doc = new Doc(filename,abspath,grunt);
            that.docs.push(doc);
        }

    });

    for(var i=0;i<this.docs.length;i++) {
       /* grunt.log.debug("fn:" +this.docs[i].filename);
        grunt.log.debug("path:"+this.docs[i].abspath);
        grunt.log.debug("folder:"+this.docs[i].folder);
        grunt.log.debug("v:"+this.docs[i].version);
        grunt.log.debug("filetitle:"+this.docs[i].filetitle);
        grunt.log.debug("jSon" + JSON.stringify( this.docs[i].json));*/

    }

}



module.exports = Docs;