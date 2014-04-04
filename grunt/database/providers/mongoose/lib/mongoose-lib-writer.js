/**
 * Created by samschmid on 28.03.14.
 */

String.prototype.replaceAll = function(target, replacement) {
    return this.split(target).join(replacement);
};
String.prototype.capitalize = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
}
function objToString (obj) {
    var str = '{\n';
    for (var p in obj) {
        if (obj.hasOwnProperty(p)) {
            str += p + ':' + obj[p] + ',\n';
        }
    }
    str = str.substring(0,str.length-2);
    return str + "\n}";
}
function MongooseLibWriter(grunt) {
    this.grunt = grunt;
}

MongooseLibWriter.prototype.writeLib = function(lib)  {
    var grunt = this.grunt;
    var template = this.grunt.file.read('./grunt/database/providers/mongoose/lib/lib.template');
    var templateA = this.grunt.file.read('./grunt/database/providers/mongoose/lib/lib-start.template');
    var templateB = this.grunt.file.read('./grunt/database/providers/mongoose/lib/lib-end.template');
    var libfiles = new Array();
    libfiles[0] = undefined;
    lib.forEach(function(scheme) {
        if(libfiles[scheme.version]===undefined) {
            libfiles[scheme.version] = "";
        }

        libfiles[scheme.version] += template.replaceAll("{{{SCHEME}}}", scheme.scheme).replace("{{{PATH}}}", scheme.path).replaceAll("{{{type}}}",scheme.type.toLowerCase());

    })
    libfiles.forEach(function(libfile,index) {
        if(libfile!==undefined) {
            grunt.log.debug("libs: " +index + " " +libfile);
            grunt.file.write("./database/schemes/v"+index+"/schemes.js", templateA+libfile+templateB);
        }

    })
}

module.exports = MongooseLibWriter;