/**
 * Created by samschmid on 28.03.14.
 */

var PostResourceWriter = require('./post/resource-writer.js');
var GetResourceWriter = require('./get/resource-writer.js');
String.prototype.replaceAll = function(target, replacement) {
    return this.split(target).join(replacement);
};

function ApiRouteWriter(grunt, rootdir) {
    this.grunt = grunt;
    this.rootdir = rootdir;
    this.getResourceWriter = new GetResourceWriter(grunt, rootdir);
    this.postResourceWriter = new PostResourceWriter(grunt, rootdir);
}

ApiRouteWriter.prototype.write = function(doc)  {

    var that = this;

    doc.supportedMethods.forEach(function(method) {
        doc.json.permission.forEach(function(permission) {

            if(method.toUpperCase() == "POST") {

                that.postResourceWriter.write(doc, permission, method);
            } else {
                that.getResourceWriter.write(doc, permission, method);

            }

        });

    });
}

module.exports = ApiRouteWriter;