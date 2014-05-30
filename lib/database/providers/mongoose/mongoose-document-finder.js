/**
 * Created by Samuel Schmid on 11.04.14.
 *
 * This class provides methods to find a document in the database
 *
 * @type {MongooseDocumentFinder}
 */
module.exports = MongooseDocumentFinder;
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

/**
 * find a document in database with callback
 *
 * @param resource
 * @param callback
 * @returns {*}
 */
MongooseDocumentFinder.prototype.findDocuments = function(resource, callback)  {

    if(!resource.isCollection) {
        return this.findDocument(resource, callback);
    }
    var query = this.findDocumentsQuery(resource);
    query.exec(callback);

}

/**
 * create query to find a document in database
 *
 * if remove parameter is set, all found documents will be deleted if the query will be run
 *
 * @param resource
 * @param remove
 * @returns {query}
 */
MongooseDocumentFinder.prototype.findDocumentsQuery = function(resource, remove) {
    var model = resource.documentationJson.type;
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
    var query = undefined;
    if(remove == true) {
        query = Document.remove().skip(page * limit).limit(limit).select(fields).sort(sort);
    } else {
        query = Document.find().skip(page * limit).limit(limit).select(fields).sort(sort);
    }


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
    return query;
}

/**
 * find a document in database with callback
 *
 * @param resource
 * @param callback
 */
MongooseDocumentFinder.prototype.findDocument = function(resource, callback)  {
    var model = resource.documentationJson.type;
    var fields = "";

    if(resource.fields) {
        fields = resource.fields.replaceAll(",", " ");
    }

    var Document = mongoose.model(model);
    var query = Document.find({"_id" : resource.ids[0]}).select(fields);

    query.exec(callback);

}

