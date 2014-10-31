/**
 * Created by Samuel Schmid on 31.10.14.
 *
 * handles database references creation
 *
 * @type {MongooseReferenceCreator}
 */
module.exports = MongooseReferenceRemover;
var Transaction = require('./../../../../transaction.js');
var mongoose = require('mongoose');
var MongooseReference = require('../mongoose-reference.js');
require('./../../../../helper.js');


/**
 *
 * @constructor
 */
function MongooseReferenceRemover() {

}


MongooseReferenceRemover.prototype.remove = function(path, obj, transaction)  {

    this.path = path;
    this.obj = obj;

    var path = this.path;
    var data = this.obj[path.name];
    var tcName = "remove refrence";
    transaction.add(tcName);
    //TODO REFACTOR WITH PROMISE
    if(data === undefined || data === null) {
        console.log("nothing to remove");
        transaction.success(undefined,tcName + "A");
        return;
    }

    var that = this;

    if(path.type.endsWith("[]")) {
        //Remove Array
        console.log("remove array");
        console.log(data);
        var type =  path.type.substr(0, path.type.length-2);
        var ReferencingDoc = mongoose.model(type);
        if(data.length > 0) {
            data.forEach(function(data) {
                console.log("runActionOnReference Array");
                runActionOnReference(path,ReferencingDoc,data,that.obj, transaction);
            });
        }
        transaction.success(undefined, tcName + " X");

    } else {
        //Remove single instance
        var type = path.type;
        var ReferencingDoc = mongoose.model(type);
        console.log("runActionOnReference Single");
        runActionOnReference(path, ReferencingDoc,data,this.obj, transaction);
        transaction.success(undefined, tcName + "Y");
    }

}

//Private methods
function runActionOnReference(path,ReferencingDoc,data,originalObject, transaction) {

    //TODO send success when evereything is done!
    //TODO REFACTOR (WITH PROMISE?)
    console.log("...run");

    var allRef = path[MongooseReference.ReferenceProperty].split(",");

    allRef.forEach(function(referenceField) {
        var tcName = "runActionOnReference inner";
        transaction.add(tcName)
        if(referenceField.endsWith("[]")) {
            referenceField = referenceField.substr(0, referenceField.length -2);
        }

        if(path[MongooseReference.ReferenceRuleProperty] == MongooseReference.ReferenceRule.NOACTION) {
            //NO ACTION
            console.log("no action");
            transaction.success(undefined,tcName);
            return;
        } else if(path[MongooseReference.ReferenceRuleProperty] == MongooseReference.ReferenceRule.NULLIFY) {
            //SET Referenced object to null
            //console.log("reffield: " + referenceField);
            console.log("nullify");
            ReferencingDoc.findById( data , function(err, obj) {

                console.log(referenceField);
                console.log("found by ID!" + JSON.stringify(data));
                if(err) {
                    console.log("but has an error")
                    transaction.fail(err, obj,tcName);
                    return;
                }
                if(!obj) {
                    console.log("empty object");
                    transaction.fail("Empty Object", obj,tcName);
                    return;
                }
                //console.log("inhalt: " + obj[referenceField]);
                if(obj[referenceField] == undefined || obj[referenceField] == null) {
                    transaction.success(undefined,tcName);
                    return;
                }
                if(obj[referenceField] instanceof Array) {
                    console.log("remove from array")
                    obj[referenceField].remove(originalObject);
                } else {

                    if(obj != null && obj != undefined && originalObject && obj[referenceField] && obj[referenceField]!=null) {
                        console.log("set obj[ref] undefined")
                        if(originalObject._id.equals(obj[referenceField])) {
                            obj[referenceField] = null;
                        }
                    }

                }
                console.log("save");
                obj.save(function(err, obj) {
                    if(err) {
                        transaction.fail(err, obj,tcName);
                    } else {
                        transaction.success(obj,tcName);
                    }
                });
            });
        } else if(path[MongooseReference.ReferenceRuleProperty] == MongooseReference.ReferenceRule.CASCADE) {
            //DELETE Referenced object
            //console.log("delete reference");
            console.log("do cascade");
            //TODO rekursiv: wenn die gefunde referenz auch wieder referenzen zum löschen hat, müssen diese auch gelöscht werden
            ReferencingDoc.findByIdAndRemove( data , function(err, obj) {
                if(err) {
                    console.log("cascade done with error");
                    transaction.fail(err, obj,tcName);
                } else {
                    console.log("cascade done with success");
                    transaction.success(obj,tcName);
                }
            });
        }
    })

}
