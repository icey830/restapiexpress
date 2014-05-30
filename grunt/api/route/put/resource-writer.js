/**
 * Created by samschmid on 28.03.14.
 */

/**
 * Class for writing route
 *
 * writes a route for PUT instance or collection of resource
 *
 * Collection:
 * PUT http://localhost:3000/v1/resources
 *
 * Instance:
 * PUT http://localhost:3000/v1/resources/132456789.json
 *
 * @type {PutResourceWriter}
 */
module.exports = PutResourceWriter;

String.prototype.replaceAll = function(target, replacement) {
    return this.split(target).join(replacement);
};

function PutResourceWriter(grunt, rootdir) {
    this.grunt = grunt;
    this.rootdir = rootdir;
}

PutResourceWriter.prototype.write = function(doc, permission, method,collectionOrEntity)  {

    var instanceContent = this.grunt.file.read(__dirname +'/put-instance.template');
    var post_collectionContent = this.grunt.file.read(__dirname + '/put-collection.template');

    if(collectionOrEntity === undefined) {
        this.writeInstance(doc,permission,method,instanceContent);
        this.writeCollection(doc,permission,method,post_collectionContent);
    } else if(collectionOrEntity === "collection") {
        this.writeCollection(doc,permission,method,post_collectionContent);
    } else {
        this.writeInstance(doc,permission,method,instanceContent);
    }

}

PutResourceWriter.prototype.writeCollection = function(doc,permission,method, content) {

    if(permission.methods.contains(method.toUpperCase())) {
        this.grunt.file.write(doc.folder + '/' + method.toLowerCase()+'/'+permission.role.toLowerCase()+'/collection.js', content);
    }

}

PutResourceWriter.prototype.writeInstance = function(doc,permission,method, content) {

    if(permission.methods.contains(method.toUpperCase())) {
        this.grunt.file.write(doc.folder + '/' + method.toLowerCase()+'/'+permission.role.toLowerCase()+'/instance.js', content);
    }

}

