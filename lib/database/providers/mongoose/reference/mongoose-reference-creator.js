/**
 * Created by Samuel Schmid on 31.10.14.
 *
 * handles database references creation
 *
 * @type {MongooseReferenceCreator}
 */
module.exports = MongooseReferenceCreator;
var mongoose = require('mongoose');
var MongooseReference = require('../mongoose-reference.js');
require('./../../../../helper.js');

/**
 *
 * @constructor
 */
function MongooseReferenceCreator() {
    this.referenceFields = [];
}

MongooseReferenceCreator.prototype.add = function(obj, referenceFields, path, data, errorCallback)  {

    this.referenceFields = referenceFields;
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

    if(data[path.name] != null) {
        ReferencingDoc.findById( data[path.name],addReferenceCallback(obj,referenceFields, errorCallback));
    }

}


function addReferenceCallback(obj, referenceFields, errorCallback) {

    return function(err, referencingObject) {

        if(err) {

            return errorCallback(err);

        } else {
            //console.log("referencing object" + referencingObject);
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
                        //console.log("error add reference " + err);
                        return errorCallback(err);
                    }
                });

            } else {
                //TODO throw error
                //console.log("referencing not foiund");
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
