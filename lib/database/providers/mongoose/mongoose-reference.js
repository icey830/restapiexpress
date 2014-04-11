/**
 * Created by samschmid on 11.04.14.
 */

var mongoose = require('mongoose');
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

function MongooseReference(path, data, obj, errorCallback) {
    this.path = path;
    this.data = data;
    this.obj = obj;
    this.errorCallback = errorCallback;
    this.referenceFields = [];
}

MongooseReference.prototype.update = function()  {

    var path = this.path;
    var data = this.data;

    var ReferencingDoc = mongoose.model(path.type);

    var array = path.reference.split(",");
    var that = this;

    array.forEach(function(referenceField) {
        if(referenceField.endsWith("[]")) {
            referenceField = {"ref": referenceField.substr(0,referenceField.length-2), "isArray" : true}
        } else {
            referenceField = {"ref": referenceField, "isArray" : false}
        }

        that.referenceFields.push(referenceField);
    });

    ReferencingDoc.findById( data[path.name], this.updateReferenceCallback());
}

MongooseReference.prototype.updateReferenceCallback = function() {
    var obj = this.obj;
    var referenceFields = this.referenceFields;
    var that = this;
    return function(err, referencingObject) {

        if(err) {

            return this.errorCallback(err);

        } else {

            if(referencingObject){

                referenceFields.forEach(function(referenceField) {
                    if(referenceField.isArray) {
                        that.updateArrayInReference(referencingObject, referenceField, obj);
                    } else {
                        that.updateFieldInReference(referencingObject, referenceField, obj);
                    }

                })
                referencingObject.save(function(err) {
                    if(err) {
                        return this.errorCallback(err);
                    }
                });

            } else {
                //TODO throw error
                return this.errorCallback("id not found");

            }
        }
    };

}

MongooseReference.prototype.updateArrayInReference = function(referencingObject,referenceField, obj ) {

    if(referencingObject[referenceField.ref] == null) {
        referencingObject[referenceField.ref] = [];
        referencingObject[referenceField.ref].push(obj);
    } else {
        referencingObject[referenceField.ref].push(obj);
    }
}

MongooseReference.prototype.updateFieldInReference = function(referencingObject,referenceField, obj ) {
    console.log("ref:" + referenceField.ref);
    referencingObject[referenceField.ref] = obj;
}

module.exports = MongooseReference;