/**
 * Created by samschmid on 11.04.14.
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
function MongooseDocumentDeleter(config) {
    this.config = config;
}

MongooseDocumentDeleter.prototype.deleteDocument = function(resource, callback)  {
    var model = resource.documentationJson.type;
    var Document = mongoose.model(model);
    var query = Document.findByIdAndRemove( resource.ids[0]);

    query.exec(callback);

}

module.exports = MongooseDocumentDeleter;