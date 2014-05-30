/**
 * Created by samschmid on 28.03.14.
 */

/**
 * Class for writing route
 *
 * writes a route for OPTIONS instance or collection of resource
 *
 * Collection:
 * OPTIONS http://localhost:3000/v1/resources
 *
 * Instance:
 * OPTIONS http://localhost:3000/v1/resources/132456789.json
 *
 * @type {OptionsResourceWriter}
 */
module.exports = OptionsResourceWriter;

String.prototype.replaceAll = function(target, replacement) {
    return this.split(target).join(replacement);
};

function OptionsResourceWriter(grunt, rootdir) {
    this.grunt = grunt;
    this.rootdir = rootdir;
}

OptionsResourceWriter.prototype.write = function(doc, permission, method, collectionOrEntity)  {

    var grunt = this.grunt;
    var instanceContent = grunt.file.read(__dirname +'/options-instance.template');
    var collectionContent = grunt.file.read(__dirname +'/options-collection.template');

    if(collectionOrEntity === undefined) {
        this.writeInstance(doc,permission,method,instanceContent);
        this.writeCollection(doc,permission,method,collectionContent);
    } else if(collectionOrEntity === "collection") {
        this.writeCollection(doc,permission,method,collectionContent);
    } else {
        this.writeInstance(doc,permission,method,instanceContent);
    }
}

OptionsResourceWriter.prototype.writeInstance = function(doc,permission,method, content) {

    if(permission.methods.contains(method.toUpperCase())) {
        this.grunt.file.write(doc.folder + '/' + method.toLowerCase()+'/'+permission.role.toLowerCase()+'/instance.js', content);
    }

}

OptionsResourceWriter.prototype.writeCollection = function(doc,permission,method, content) {

    if(permission.methods.contains(method.toUpperCase())) {
        this.grunt.file.write(doc.folder + '/' + method.toLowerCase()+'/'+permission.role.toLowerCase()+'/collection.js', content);
    }

}

