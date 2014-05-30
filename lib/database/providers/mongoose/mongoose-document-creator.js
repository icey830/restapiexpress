/**
 * Created by samschmid on 24.03.14.
 *
 * This class provides methods to create a document in the database
 *
 * @type {MongooseDocumentCreator}
 */
module.exports = MongooseDocumentCreator;

var mongoose = require('mongoose');
var Reference = require('./mongoose-reference.js');

if (typeof String.prototype.endsWith != 'function') {
    // see below for better implementation!
    String.prototype.endsWith = function (str){
        return this.indexOf(str) == this.length - str.length;
    };
}
String.prototype.replaceAll = function(target, replacement) {
    return this.split(target).join(replacement);
};
String.prototype.capitalize = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
}

/**
 *
 * @param config
 * @constructor
 */
function MongooseDocumentCreator(config) {
    this.config = config;
}

/**
 * creates a document in database with callback
 *
 * @param data
 * @param resource
 * @param handleError
 * @param success
 */
MongooseDocumentCreator.prototype.createEntity = function(data, resource, handleError, success)  {

    var model = resource.documentationJson.type;
    var Document = mongoose.model(model);

    if(data === undefined || data === {}) {
        //TODO throw error
        success();
    }

    var document = new Document(data);

    document.save(function(err, obj) {
        if(err){
            console.log("error crate:"  + err +"/");
            return handleError(err)
        } else {
            for (var property in resource.documentationJson.model) {
                var path = resource.documentationJson.model[property];
                if (path.hasOwnProperty("reference")) {


                    if(data[path.name] != null) {

                        console.log("add ref");
                        var ref = new Reference(path, data, obj, handleError);
                        ref.add();

                    }
                }
            }
            console.log("success");
            success(obj)
        };
    })

}
