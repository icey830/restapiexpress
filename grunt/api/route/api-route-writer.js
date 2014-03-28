/**
 * Created by samschmid on 28.03.14.
 */
String.prototype.replaceAll = function(target, replacement) {
    return this.split(target).join(replacement);
};

function ApiRouteWriter(grunt, rootdir) {
    this.grunt = grunt;
    this.rootdir = rootdir;
}

ApiRouteWriter.prototype.write = function(doc)  {

    var grunt = this.grunt;
    var instanceContent = grunt.file.read('./grunt/templates/get-instance.template');
    var collectionContent = grunt.file.read('./grunt/templates/get-collection.template');
    var post_collectionContent = grunt.file.read('./grunt/templates/post-collection.template');

    var that = this;

    doc.supportedMethods.forEach(function(method) {
        doc.json.permission.forEach(function(permission) {

            if(method.toUpperCase() == "POST") {
                that.createInstanceJsForMethod(doc,permission,method,instanceContent);
                that.createPOSTCollectionJsForMethod(doc,permission,method,post_collectionContent);
            } else {
                that.createInstanceJsForMethod(doc,permission,method,instanceContent);
                that.createCollectionJsForMethod(doc,permission,method,collectionContent);

            }

        });

    });
}

ApiRouteWriter.prototype.createPOSTCollectionJsForMethod = function(doc,permission,method, content) {

    var grunt = this.grunt;
    if(permission.methods.contains(method.toUpperCase())) {
        grunt.file.write(doc.folder + '/' + method.toLowerCase()+'/'+permission.role.toLowerCase()+'/collection.js', content);
    }

}

ApiRouteWriter.prototype.createInstanceJsForMethod = function(doc,permission,method, content) {
    var links = [];
    var grunt = this.grunt;

    if(permission.methods.contains(method.toUpperCase())) {

        var modifiedContent =  content.replace('{{{links}}}',JSON.stringify(links));
        modifiedContent =  modifiedContent.replace('{{{TYPE}}}',JSON.stringify(doc.json.type));
        grunt.file.write(doc.folder + '/' + method.toLowerCase()+'/'+permission.role.toLowerCase()+'/instance.js', modifiedContent);
    }

}

ApiRouteWriter.prototype.createCollectionJsForMethod = function(doc,permission,method, content) {
    var links = [];
    var grunt = this.grunt;
    if(permission.methods.contains(method.toUpperCase())) {

        var modifiedContent =  content.replace('{{{links}}}',JSON.stringify(links));
        modifiedContent =  modifiedContent.replace('{{{TYPE}}}',JSON.stringify(doc.json.type));
        grunt.file.write(doc.folder + '/' + method.toLowerCase()+'/'+permission.role.toLowerCase()+'/collection.js', modifiedContent);
    }

}



module.exports = ApiRouteWriter;