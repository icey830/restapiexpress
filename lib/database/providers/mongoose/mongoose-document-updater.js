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
function MongooseDocumentUpdater(config) {
    this.config = config;
}

MongooseDocumentUpdater.prototype.updateDocument = function(data, resource, callback)  {

    var model = resource.documentationJson.type;

    var Document = mongoose.model(model);
    var query = Document.findByIdAndUpdate( resource.ids[0], data);

    query.exec(callback);
}

MongooseDocumentUpdater.prototype.updateDocumentOrInsert = function(data, resource, callback)  {

    var model = resource.documentationJson.type;
    var Document = mongoose.model(model);
    Document.findById( resource.ids[0], function(err, obj) {

        if(err) {
            callback(err);
        } else {
            if(obj){
                var query = Document.findByIdAndUpdate( obj._id, data);
                query.exec(callback);
            } else {
                data["_id"] = resource.ids[0];
                var document = new Document(data);
                document.save(callback);

            }
        }

    });
}


MongooseDocumentUpdater.prototype.updateDocumentAndNullifyEmpty = function(data, resource, callback)  {

    var model = resource.documentationJson.type;

    var Document = mongoose.model(model);

    var newData = {};

    for (var property in Document.schema.paths) {
        var path = Document.schema.paths[property];
        if (data.hasOwnProperty(property)) {
            newData[property] = data[property];
        } else {
            if(path.isRequired) {
                console.log(path.defaultValue);
                if(path.hasOwnProperty("defaultValue")) {
                    if(typeof path.defaultValue !== 'function') {
                        newData[property] = path.defaultValue;
                    } else {
                        newData[property] = path.defaultValue();
                    }

                } else {

                    callback(path.path + " is Required",undefined);
                    return;
                }

            } else {
                if(property !== "_id" && property !== "__v" && property !== "__t") {
                    newData[property] = null;
                }

            }
        }
    }

    var query = Document.findByIdAndUpdate( resource.ids[0], newData, {upsert:true});
    query.exec(callback);
}

module.exports = MongooseDocumentUpdater;