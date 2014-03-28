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
    var instanceContent = grunt.file.read('./grunt/templates/get-instance.template');
    var collectionContent = grunt.file.read('./grunt/templates/get-collection.template');

    this.createInstanceJsForMethod(doc,permission,method,instanceContent);
    this.createCollectionJsForMethod(doc,permission,method,collectionContent);

}

GetCollectionWriter.prototype.createInstanceJsForMethod = function(doc,permission,method, content) {
    var links = [];
    var grunt = this.grunt;

    if(permission.methods.contains(method.toUpperCase())) {

        var modifiedContent =  content.replace('{{{links}}}',JSON.stringify(links));
        modifiedContent =  modifiedContent.replace('{{{TYPE}}}',JSON.stringify(doc.json.type));
        grunt.file.write(doc.folder + '/' + method.toLowerCase()+'/'+permission.role.toLowerCase()+'/instance.js', modifiedContent);
    }

}

GetCollectionWriter.prototype.createCollectionJsForMethod = function(doc,permission,method, content) {
    var links = [];
    var grunt = this.grunt;
    if(permission.methods.contains(method.toUpperCase())) {

        var modifiedContent =  content.replace('{{{links}}}',JSON.stringify(links));
        modifiedContent =  modifiedContent.replace('{{{TYPE}}}',JSON.stringify(doc.json.type));
        grunt.file.write(doc.folder + '/' + method.toLowerCase()+'/'+permission.role.toLowerCase()+'/collection.js', modifiedContent);
    }

}

module.exports = GetCollectionWriter;