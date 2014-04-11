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
Array.prototype.remove = function() {
    var what, a = arguments, L = a.length, ax;
    while (L && this.length) {
        what = a[--L];
        while ((ax = this.indexOf(what)) !== -1) {
            this.splice(ax, 1);
        }
    }
    return this;
};
MongooseReference.ReferenceRule = {
    NULLIFY : "nullify",
    CASCADE: "cascade",
    NOACTION : "noaction"
};
MongooseReference.ReferenceProperty = "reference";
MongooseReference.ReferenceRuleProperty = "referenceRule";

function MongooseReference(path, data, obj, errorCallback) {
    this.path = path;
    this.data = data;
    this.obj = obj;
    this.errorCallback = errorCallback;
    this.referenceFields = [];
}

MongooseReference.prototype.add = function()  {

    var path = this.path;
    var data = this.data;
    var type = path.type;
    if(type.endsWith("[]")) {
        type = type.substr(0, type.length-2);
    }
    var ReferencingDoc = mongoose.model(type);

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

    ReferencingDoc.findById( data[path.name],addReferenceCallback(this.obj,this.referenceFields, this.errorCallback));
}

MongooseReference.prototype.remove = function()  {
    var path = this.path;
    var data = this.obj[path.name];
    if(!data) {
        return;
    }

    var that = this;
    if(path.type.endsWith("[]")) {
        //Remove Array
        var type =  path.type.substr(0, path.type.length-2);
        var ReferencingDoc = mongoose.model(type);

        data.forEach(function(data) {
            runActionOnReference(path,ReferencingDoc,data,that.obj,that.errorCallback);
        });
    } else {
        //Remove single instance
        var type = path.type;
        var ReferencingDoc = mongoose.model(type);
        runActionOnReference(path, ReferencingDoc,data,this.obj,this.errorCallback);
    }

}

MongooseReference.prototype.update = function()  {

    var oldData = this.obj;
    var newData = this.data;

    //TODO remove from old
    this.data = {};
    this.obj = oldData;
    this.remove();
    //TODO add to new
    this.data = newData;
    this.obj = newData;
    this.add();
}

module.exports = MongooseReference;

//Private methods
function runActionOnReference(path,ReferencingDoc,data,originalObject, errorCallback) {

    var allRef = path[MongooseReference.ReferenceProperty].split(",");
    allRef.forEach(function(referenceField) {
        if(referenceField.endsWith("[]")) {
            referenceField = referenceField.substr(0, referenceField.length -2);
        }

        if(path[MongooseReference.ReferenceRuleProperty] == MongooseReference.ReferenceRule.NOACTION) {
            //NO ACTION
        } else if(path[MongooseReference.ReferenceRuleProperty] == MongooseReference.ReferenceRule.NULLIFY) {
            //SET Referenced object to null

            ReferencingDoc.findById( data , function(err, obj) {
                if(obj[referenceField] instanceof Array) {

                    obj[referenceField].remove(originalObject);
                } else {

                    if(originalObject._id.equals(obj[referenceField])) {
                        obj[referenceField] = null;
                    }
                }

                obj.save(errorCallback);
            });
        } else if(path[MongooseReference.ReferenceRuleProperty] == MongooseReference.ReferenceRule.CASCADE) {
            //DELETE Referenced object
            ReferencingDoc.findByIdAndRemove( data , function(err, obj) {
                if(err) {
                    errorCallback(err, obj);
                }
            });
        }
    })

}
function addReferenceCallback(obj, referenceFields, errorCallback) {

    return function(err, referencingObject) {

        if(err) {

            return errorCallback(err);

        } else {

            if(referencingObject){

                referenceFields.forEach(function(referenceField) {
                    if(referenceField.isArray) {
                        addArrayInReference(referencingObject, referenceField, obj);
                    } else {
                        addFieldInReference(referencingObject, referenceField, obj);
                    }

                })
                referencingObject.save(function(err) {
                    if(err) {
                        return errorCallback(err);
                    }
                });

            } else {
                //TODO throw error
                return errorCallback("id not found");

            }
        }
    };

}

function addArrayInReference(referencingObject,referenceField, obj ) {

    if(referencingObject[referenceField.ref] == null) {
        referencingObject[referenceField.ref] = [];
        referencingObject[referenceField.ref].push(obj);
    } else {
        referencingObject[referenceField.ref].push(obj);
    }
}

function addFieldInReference(referencingObject,referenceField, obj ) {

    referencingObject[referenceField.ref] = obj;
}

