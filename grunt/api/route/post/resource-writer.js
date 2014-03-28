/**
 * Created by samschmid on 28.03.14.
 */

String.prototype.replaceAll = function(target, replacement) {
    return this.split(target).join(replacement);
};

function PostCollectionWriter(grunt, rootdir) {
    this.grunt = grunt;
    this.rootdir = rootdir;
}

PostCollectionWriter.prototype.write = function(doc, permission, method)  {

    var grunt = this.grunt;
    var instanceContent = grunt.file.read('./grunt/templates/get-instance.template');
    var post_collectionContent = grunt.file.read('./grunt/templates/post-collection.template');

    this.createInstanceJsForMethod(doc,permission,method,instanceContent);
    this.createCollectionJsForMethod(doc,permission,method,post_collectionContent);

}

PostCollectionWriter.prototype.createCollectionJsForMethod = function(doc,permission,method, content) {

    var grunt = this.grunt;
    if(permission.methods.contains(method.toUpperCase())) {
        grunt.file.write(doc.folder + '/' + method.toLowerCase()+'/'+permission.role.toLowerCase()+'/collection.js', content);
    }

}

PostCollectionWriter.prototype.createInstanceJsForMethod = function(doc,permission,method, content) {
    var links = [];
    var grunt = this.grunt;

    if(permission.methods.contains(method.toUpperCase())) {

        var modifiedContent =  content.replace('{{{links}}}',JSON.stringify(links));
        modifiedContent =  modifiedContent.replace('{{{TYPE}}}',JSON.stringify(doc.json.type));
        grunt.file.write(doc.folder + '/' + method.toLowerCase()+'/'+permission.role.toLowerCase()+'/instance.js', modifiedContent);
    }

}


module.exports = PostCollectionWriter;