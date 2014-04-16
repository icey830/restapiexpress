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
function MongooseDocumentFinder(config) {
    this.config = config;
}

MongooseDocumentFinder.prototype.findDocuments = function(resource, callback)  {

    var model = resource.documentationJson.type;
    if(!resource.isCollection) {
        return this.findDocument(resource, callback);
    }
    var fields = "";

    if(resource.fields) {
        fields = resource.fields.replaceAll(",", " ");
    }
    /*if(fields === "") {
     callback(undefined,[]);
     return;
     }*/

    var limit = 0;
    var page = 0;
    var sort = "";

    if(resource.limit) {
        limit = resource.limit;
    }
    if(resource.page) {
        page = resource.page;
    }
    if(resource.sort) {
        sort = resource.sort.replaceAll(",", " ");
    }
    var Document = mongoose.model(model);
    var query = Document.find().skip(page * limit).limit(limit).select(fields).sort(sort);

    if(resource.scope.length !== 0) {
        resource.scope.forEach(function(scope) {
            if(scope.operator === "eq") {
                query = query.where(scope.field).equals(scope.value);
            } else if(scope.operator === "lt") {
                query = query.where(scope.field).lt(scope.value);
            } else if(scope.operator === "lte") {
                query = query.where(scope.field).lte(scope.value);
            } else if(scope.operator === "gt") {
                query = query.where(scope.field).gt(scope.value);
            } else if(scope.operator === "gte") {
                query = query.where(scope.field).gte(scope.value);
            }

        });

    }
    query.exec(callback);

}

MongooseDocumentFinder.prototype.findDocument = function(resource, callback)  {
    var model = resource.documentationJson.type;
    var fields = "";

    if(resource.fields) {
        fields = resource.fields.replaceAll(",", " ");
    }


    var Document = mongoose.model(model);
    console.log("fields:" + fields);
    console.log("id:" + resource.ids[0]);
    var query = Document.find({"_id" : resource.ids[0]}).select(fields);

    query.exec(callback);

}

module.exports = MongooseDocumentFinder;