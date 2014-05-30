/**
 * Created by samschmid on 28.03.14.
 */

/**
 * Class for writing route
 *
 * writes a route for PATCH instance or collection of resource
 *
 * Collection:
 * PATCH http://localhost:3000/v1/resources
 *
 * Instance:
 * PATCH http://localhost:3000/v1/resources/132456789.json
 *
 * @type {PatchResourceWriter}
 */
module.exports = PatchResourceWriter;

String.prototype.replaceAll = function(target, replacement) {
    return this.split(target).join(replacement);
};

function PatchResourceWriter(grunt, rootdir) {
    this.grunt = grunt;
    this.rootdir = rootdir;
}

PatchResourceWriter.prototype.write = function(doc, permission, method, collectionOrEntity)  {

    var instanceContent = this.grunt.file.read(__dirname +'/patch-instance.template');
    var post_collectionContent = this.grunt.file.read(__dirname + '/patch-collection.template');

    if(collectionOrEntity === undefined) {
        this.writeInstance(doc,permission,method,instanceContent);
        this.writeCollection(doc,permission,method,post_collectionContent);
    } else if(collectionOrEntity === "collection") {
        this.writeCollection(doc,permission,method,post_collectionContent);
    } else {
        this.writeInstance(doc,permission,method,instanceContent);
    }

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

