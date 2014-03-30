/**
 * Created by samschmid on 28.03.14.
 */

var PostResourceWriter = require('./post/resource-writer.js');
var PutResourceWriter = require('./put/resource-writer.js');
var GetResourceWriter = require('./get/resource-writer.js');
var DeleteResourceWriter = require('./delete/resource-writer.js');
var OptionsResourceWriter = require('./options/resource-writer.js');
String.prototype.replaceAll = function(target, replacement) {
    return this.split(target).join(replacement);
};

function ApiRouteWriter(grunt, rootdir) {
    this.grunt = grunt;
    this.rootdir = rootdir;
    this.getResourceWriter = new GetResourceWriter(grunt, rootdir);
    this.postResourceWriter = new PostResourceWriter(grunt, rootdir);
    this.putResourceWriter = new PutResourceWriter(grunt, rootdir);
    this.deleteResourceWriter = new DeleteResourceWriter(grunt, rootdir);
    this.optionsResourceWriter = new OptionsResourceWriter(grunt, rootdir);
}

ApiRouteWriter.prototype.write = function(doc)  {

    var that = this;

    doc.supportedMethods.forEach(function(method) {
        doc.json.permission.forEach(function(permission) {

            if(method.toUpperCase() == "POST") {
                that.postResourceWriter.write(doc, permission, method);

            } else if(method.toUpperCase() == "PUT") {
                that.putResourceWriter.write(doc, permission, method);

            }   else if(method.toUpperCase() == "OPTIONS") {
                that.optionsResourceWriter.write(doc, permission, method);

            } else if(method.toUpperCase() == "DELETE" || method.toUpperCase() == "DEL") {
                that.deleteResourceWriter.write(doc, permission, method);

            } else if(method.toUpperCase() == "GET" || method.toUpperCase() == "HEAD") {
                that.getResourceWriter.write(doc, permission, method);

            } else {
                that.grunt.log.write("\n=====");
                that.grunt.log.write("\nNO Resource-Writer for method " + method.toUpperCase());
                that.grunt.log.write("\nplease create one in folder /grunt/api/route/ " + method.toLowerCase() + "/");
                that.grunt.log.write("\nand add it to the api-writer /grunt/api/route/api-route-writer.js");
                that.grunt.log.write("\nyou can see an example for it in folder /grunt/api/route/get/\n");
                that.grunt.log.write("\ndont'forget to write a test case ;-)\n");
                that.grunt.log.write("=====\n\n");
            }

        });

    });
}

module.exports = ApiRouteWriter;