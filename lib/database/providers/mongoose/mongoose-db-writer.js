/**
 * Created by samschmid on 06.04.14.
 */
/**
 * Created by samschmid on 24.03.14.
 */
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
function MongooseDbWriter(config) {
    this.config = config;
}

MongooseDbWriter.prototype.createEntity = function(data, resource, handleError, success)  {

    var model = resource.documentationJson.type;
    var Document = mongoose.model(model);

    if(data === undefined || data === {}) {
        //TODO throw error
        success();
    }

    var document = new Document(data);
    var that = this;
    document.save(function(err, obj) {
        if(err){
            return handleError(err)
        } else {
            for (var property in resource.documentationJson.model) {
                var path = resource.documentationJson.model[property];
                if (path.hasOwnProperty("reference")) {

                    var ref = new Reference(path, data, obj, handleError);
                    ref.update();

                }
            }
            success(obj)
        };
    })

}

module.exports = MongooseDbWriter;