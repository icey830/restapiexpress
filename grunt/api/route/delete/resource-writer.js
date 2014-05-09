/**
 * Created by samschmid on 28.03.14.
 */

String.prototype.replaceAll = function(target, replacement) {
    return this.split(target).join(replacement);
};

function DeleteResourceWriter(grunt, rootdir) {
    this.grunt = grunt;
    this.rootdir = rootdir;
}

DeleteResourceWriter.prototype.write = function(doc, permission, method, collectionOrEntity)  {

    var instanceContent = this.grunt.file.read(__dirname +'/delete-instance.template');
    var collectionContent = this.grunt.file.read(__dirname + '/delete-collection.template');

    if(collectionOrEntity === undefined) {
        this.writeInstance(doc,permission,method,instanceContent);
        this.writeCollection(doc,permission,method,collectionContent);
    } else if(collectionOrEntity === "collection") {
        this.writeCollection(doc,permission,method,collectionContent);
    } else {
        this.writeInstance(doc,permission,method,instanceContent);
    }

}

DeleteResourceWriter.prototype.writeCollection = function(doc,permission,method, content) {

    if(permission.methods.contains(method.toUpperCase())) {
        this.grunt.file.write(doc.folder + '/' + method.toLowerCase()+'/'+permission.role.toLowerCase()+'/collection.js', content);
    }

}

DeleteResourceWriter.prototype.writeInstance = function(doc,permission,method, content) {

    if(permission.methods.contains(method.toUpperCase())) {
        this.grunt.file.write(doc.folder + '/' + method.toLowerCase()+'/'+permission.role.toLowerCase()+'/instance.js', content);
    }

}

module.exports = DeleteResourceWriter;