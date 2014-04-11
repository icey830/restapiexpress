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
    this.referenceField = undefined;
}

MongooseReference.prototype.update = function()  {

    var path = this.path;
    var data = this.data;

    var ReferencingDoc = mongoose.model(path.type);

    var referenceField = path.reference;
    if(referenceField.endsWith("[]")) {
        referenceField = {"ref": path.reference.substr(0,path.reference.length-2), "isArray" : true}
    } else {
        referenceField = {"ref": path.reference, "isArray" : true}
    }
    this.referenceField = referenceField;

    ReferencingDoc.findById( data[path.name], this.updateReferenceCallback());
}

MongooseReference.prototype.updateReferenceCallback = function() {
    var obj = this.obj;
    var referenceField = this.referenceField;

    return function(err, referencingObject) {

        if(err) {

            return this.errorCallback(err);

        } else {

            if(referencingObject){

                if(referenceField.isArray) {
                    if(referencingObject[referenceField.ref] == null) {

                        referencingObject[referenceField.ref]  = [];
                        referencingObject[referenceField.ref].push(obj);
                    } else {
                        referencingObject[referenceField.ref].push(obj);
                    }
                }

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

module.exports = MongooseReference;