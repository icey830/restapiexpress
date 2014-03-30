/**
 * Created by samschmid on 28.03.14.
 */

String.prototype.replaceAll = function(target, replacement) {
    return this.split(target).join(replacement);
};

function GetCollectionWriter(grunt, rootdir) {
    this.grunt = grunt;
    this.rootdir = rootdir;
}

GetCollectionWriter.prototype.write = function(doc, permission, method)  {

    var grunt = this.grunt;
    var instanceContent = grunt.file.read(__dirname +'/get-instance.template');
    var collectionContent = grunt.file.read(__dirname +'/get-collection.template');

    this.writeInstance(doc,permission,method,instanceContent);
    this.writeCollection(doc,permission,method,collectionContent);

}

GetCollectionWriter.prototype.writeInstance = function(doc,permission,method, content) {

    if(permission.methods.contains(method.toUpperCase())) {
        this.grunt.file.write(doc.folder + '/' + method.toLowerCase()+'/'+permission.role.toLowerCase()+'/instance.js', content);
    }

}

GetCollectionWriter.prototype.writeCollection = function(doc,permission,method, content) {

    if(permission.methods.contains(method.toUpperCase())) {
        this.grunt.file.write(doc.folder + '/' + method.toLowerCase()+'/'+permission.role.toLowerCase()+'/collection.js', content);
    }

}

module.exports = GetCollectionWriter;