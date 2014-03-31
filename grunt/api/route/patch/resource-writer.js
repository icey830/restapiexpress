/**
 * Created by samschmid on 28.03.14.
 */

String.prototype.replaceAll = function(target, replacement) {
    return this.split(target).join(replacement);
};

function PatchResourceWriter(grunt, rootdir) {
    this.grunt = grunt;
    this.rootdir = rootdir;
}

PatchResourceWriter.prototype.write = function(doc, permission, method)  {

    var instanceContent = this.grunt.file.read(__dirname +'/patch-instance.template');
    var post_collectionContent = this.grunt.file.read(__dirname + '/patch-collection.template');
    this.writeInstance(doc,permission,method,instanceContent);
    this.writeCollection(doc,permission,method,post_collectionContent);

}

PatchResourceWriter.prototype.writeCollection = function(doc,permission,method, content) {

    if(permission.methods.contains(method.toUpperCase())) {
        this.grunt.file.write(doc.folder + '/' + method.toLowerCase()+'/'+permission.role.toLowerCase()+'/collection.js', content);
    }

}

PatchResourceWriter.prototype.writeInstance = function(doc,permission,method, content) {

    if(permission.methods.contains(method.toUpperCase())) {
        this.grunt.file.write(doc.folder + '/' + method.toLowerCase()+'/'+permission.role.toLowerCase()+'/instance.js', content);
    }

}


module.exports = PatchResourceWriter;