/**
 * Created by Samuel Schmid on 28.03.14.
 *
 * Class for writing route
 *
 * writes a route for POST instance or collection of resource
 *
 * Collection:
 * POST http://localhost:3000/v1/resources
 *
 * Instance:
 * POST http://localhost:3000/v1/resources/132456789.json
 *
 * @type {PostResourceWriter}
 */
module.exports = PostResourceWriter;

String.prototype.replaceAll = function(target, replacement) {
    return this.split(target).join(replacement);
};

function PostResourceWriter(grunt, rootdir) {
    this.grunt = grunt;
    this.rootdir = rootdir;
}

PostResourceWriter.prototype.write = function(doc, permission, method, collectionOrEntity)  {

    var instanceContent = this.grunt.file.read(__dirname +'/post-instance.template');
    var post_collectionContent = this.grunt.file.read(__dirname + '/post-collection.template');

    if(collectionOrEntity === undefined) {
        this.writeInstance(doc,permission,method,instanceContent);
        this.writeCollection(doc,permission,method,post_collectionContent);
    } else if(collectionOrEntity === "collection") {
        this.writeCollection(doc,permission,method,post_collectionContent);
    } else {
        this.writeInstance(doc,permission,method,instanceContent);
    }


}

PostResourceWriter.prototype.writeCollection = function(doc,permission,method, content) {

    if(permission.methods.contains(method.toUpperCase())) {
        this.grunt.file.write(doc.folder + '/' + method.toLowerCase()+'/'+permission.role.toLowerCase()+'/collection.js', content);
    }

}

PostResourceWriter.prototype.writeInstance = function(doc,permission,method, content) {

    if(permission.methods.contains(method.toUpperCase())) {
        this.grunt.file.write(doc.folder + '/' + method.toLowerCase()+'/'+permission.role.toLowerCase()+'/instance.js', content);
    }

}
