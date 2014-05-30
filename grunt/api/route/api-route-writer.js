/**
 * Created by samschmid on 28.03.14.
 */

var PostResourceWriter = require('./post/resource-writer.js');
var PutResourceWriter = require('./put/resource-writer.js');
var PatchResourceWriter = require('./patch/resource-writer.js');
var GetResourceWriter = require('./get/resource-writer.js');
var DeleteResourceWriter = require('./delete/resource-writer.js');
var OptionsResourceWriter = require('./options/resource-writer.js');

String.prototype.replaceAll = function(target, replacement) {
    return this.split(target).join(replacement);
};

/**
 * Class for writing route
 *
 * writes a route for each supported VERB for instance and collection of resource
 *
 * Collection:
 * VERB http://localhost:3000/v1/resources
 *
 * Instance:
 * VERB http://localhost:3000/v1/resources/132456789.json
 *
 * @type {ApiRouteWriter}
 */
module.exports = ApiRouteWriter;

function ApiRouteWriter(grunt, rootdir) {
    this.grunt = grunt;
    this.rootdir = rootdir;
    this.getResourceWriter = new GetResourceWriter(grunt, rootdir);
    this.postResourceWriter = new PostResourceWriter(grunt, rootdir);
    this.putResourceWriter = new PutResourceWriter(grunt, rootdir);
    this.patchResourceWriter = new PatchResourceWriter(grunt, rootdir);
    this.deleteResourceWriter = new DeleteResourceWriter(grunt, rootdir);
    this.optionsResourceWriter = new OptionsResourceWriter(grunt, rootdir);
}

ApiRouteWriter.prototype.write = function(doc)  {

    var that = this;

    doc.supportedMethods.forEach(function(method) {
        doc.getPermissions().forEach(function(permission) {
            //that.grunt.log.debug("permission: for role" + permission.role + " and method " + method + " for doc " + doc.filename);
            writeRoute(that, method, doc, permission);

        });

    });

    this.writeRouteForTestingAllMethods(doc);

}

ApiRouteWriter.prototype.writeRouteForTestingAllMethods = function(doc)  {

    var allSupportedMethods = doc.apidescription.supportedMethods;


    var permission  ={
        "role" : "test",
        "description" : "test methods",
        "methods" : doc.supportedVerbs()
    };
    var that = this;


    Object.keys(allSupportedMethods).forEach(function(verb) {
        var method = allSupportedMethods[verb];
        var collectionMethod = method.collection;
        var entityMethod = method.entity;

        //that.grunt.log.writeln(verb + " c " + JSON.stringify(collectionMethod));
        //that.grunt.log.writeln(verb + " e " +  JSON.stringify(entityMethod));

        if(collectionMethod) {
            writeRoute(that, verb.toUpperCase(), doc, permission, "collection");
        }
        if(entityMethod) {
            writeRoute(that, verb.toUpperCase(), doc, permission, "entity");
        }
    });


}

//
// private
//

function writeRoute(that, method, doc, permission, collectionOrEntity) {

    if(method.toUpperCase() == "POST") {
        that.postResourceWriter.write(doc, permission, method, collectionOrEntity);

    } else if(method.toUpperCase() == "PUT") {
        that.putResourceWriter.write(doc, permission, method, collectionOrEntity);

    } else if(method.toUpperCase() == "PATCH") {
        that.patchResourceWriter.write(doc, permission, method, collectionOrEntity);

    }   else if(method.toUpperCase() == "OPTIONS") {
        that.optionsResourceWriter.write(doc, permission, method, collectionOrEntity);

    } else if(method.toUpperCase() == "DELETE" || method.toUpperCase() == "DEL") {
        that.deleteResourceWriter.write(doc, permission, method, collectionOrEntity);

    } else if(method.toUpperCase() == "GET" || method.toUpperCase() == "HEAD") {
        that.getResourceWriter.write(doc, permission, method, collectionOrEntity);

    } else {
        that.grunt.log.write("\n=====");
        that.grunt.log.write("\nNO Resource-Writer for method " + method.toUpperCase());
        that.grunt.log.write("\nplease create one in folder /grunt/api/route/ " + method.toLowerCase() + "/");
        that.grunt.log.write("\nand add it to the api-writer /grunt/api/route/api-route-writer.js");
        that.grunt.log.write("\nyou can see an example for it in folder /grunt/api/route/get/\n");
        that.grunt.log.write("\ndont'forget to write a test case ;-)\n");
        that.grunt.log.write("=====\n\n");
    }
}
