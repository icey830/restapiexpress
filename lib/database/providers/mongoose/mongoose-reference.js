/**
 * Created by Samuel Schmid on 11.04.14.
 *
 * handles database references
 *
 * @type {MongooseReference}
 */
module.exports = MongooseReference;

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

/**
 *
 * @type {{NULLIFY: string, CASCADE: string, NOACTION: string}}
 */
MongooseReference.ReferenceRule = {
    NULLIFY : "nullify",
    CASCADE: "cascade",
    NOACTION : "noaction"
};

MongooseReference.ReferenceProperty = "reference";
MongooseReference.ReferenceRuleProperty = "referenceRule";

/**
 *
 * @param path
 * @param data
 * @param obj
 * @param errorCallback
 * @constructor
 */
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

    if(data[path.name] != null) {
        ReferencingDoc.findById( data[path.name],addReferenceCallback(this.obj,this.referenceFields, this.errorCallback));
    }

}

MongooseReference.prototype.remove = function(transaction)  {
    var path = this.path;
    var data = this.obj[path.name];

    //TODO REFACTOR WITH PROMISE
    if(data === undefined || data === null) {
        console.log("nothing to remove");
        transaction.success();
        return;
    }

    var that = this;

    var innerErrorCallback = function(callbackObject) {

        if(!callbackObject.success) {
            console.log("inner error callback");
            transaction.fail(callbackObject.error, callbackObject.obj);
        } else {
            console.log("inner success callback");
            transaction.success(callbackObject.obj);
        }

    }


    if(path.type.endsWith("[]")) {
        //Remove Array
        console.log("remove array");
        console.log(data);
        var type =  path.type.substr(0, path.type.length-2);
        var ReferencingDoc = mongoose.model(type);
        if(data.length > 0) {
            data.forEach(function(data) {
                transaction.add();
                console.log("runActionOnReference Array")
                runActionOnReference(path,ReferencingDoc,data,that.obj,innerErrorCallback, transaction);
            });
        } else {
            transaction.success();
        }
    } else {
        //Remove single instance
        var type = path.type;
        var ReferencingDoc = mongoose.model(type);
        transaction.add();
        console.log("runActionOnReference Single")
        runActionOnReference(path, ReferencingDoc,data,this.obj,innerErrorCallback, transaction);
    }

}

MongooseReference.prototype.update = function()  {

    var newData = this.data;
    var oldData = this.obj;

    //TODO Refactor that the handle does something
    /**
     * callbackObject {success:true/false, err, obj}
     *
     * @param callbackObject
     */
    var counter = 0;
    function onRemoveFinished(callbackObject) {

        if(counter == 0) {
            counter++;
            if(callbackObject.success) {
                console.log("Success Callback FIRED!")
                //callback(undefined, obj);
            } else {
                console.log("ERROR Callback FIRED!")
                //callback(callbackObject.error, obj);
            }
        } else {
            counter++;
            if(callbackObject.success) {
                console.log("Success Callback fireing but callback already done...")
            } else {
                console.log("Error Callback fireing but callback already done...");
                console.log(callbackObject.error)
            }

        }
    }

    //TODO remove from old
    this.data = {};
    this.obj = oldData;
    this.remove(onRemoveFinished);
    //TODO add to new
    this.data = newData;
    this.obj = newData;
    this.add();
}

MongooseReference.prototype.updateAdd = function(resource, referenceImage,referenceNews)  {

    var oldData = this.obj;
    var newData = this.data;
    var path = this.path;
    var that = this;

    //add to new
    this.path = path;
    this.data = newData;
    this.obj = newData;
    this.add();
}

MongooseReference.prototype.updateRemove = function(resource, reference)  {

    //TODO Refactor that the handle does something
    var counter = 0;
    function onRemoveFinished(callbackObject) {

        if(counter == 0) {
            counter++;
            if(callbackObject.success) {
                console.log("Success Callback FIRED!")
                //callback(undefined, obj);
            } else {
                console.log("ERROR Callback FIRED!")
                //callback(callbackObject.error, obj);
            }
        } else {
            counter++;
            if(callbackObject.success) {
                console.log("Success Callback fireing but callback already done...")
            } else {
                console.log("Error Callback fireing but callback already done...");
                console.log(callbackObject.error)
            }

        }
    }

    var newData = this.data;
    var oldData = this.obj;

    //TODO remove from old
    this.data = {};
    this.obj = oldData;
    this.remove(onRemoveFinished);

}


//Private methods
function runActionOnReference(path,ReferencingDoc,data,originalObject, callback, transaction) {

    //TODO send success when evereything is done!
    //TODO REFACTOR (WITH PROMISE?)
    console.log("runActionOnReference");
    var innerErrorCallback = function(err, obj) {

        if(err) {
            transaction.fail(err, obj);
            console.log("inner error callback");
            console.log(err);
        } else {
            console.log("inner success callback");
            console.log(obj);
            transaction.success(obj);
        }


    }

    var innerSuccessCallback = function(err, obj) {
        console.log("inner success callback");
        console.log(obj);
        transaction.success(obj);

    }

    var allRef = path[MongooseReference.ReferenceProperty].split(",");

    allRef.forEach(function(referenceField) {

        if(referenceField.endsWith("[]")) {
            referenceField = referenceField.substr(0, referenceField.length -2);
        }

        if(path[MongooseReference.ReferenceRuleProperty] == MongooseReference.ReferenceRule.NOACTION) {
            //NO ACTION
            console.log("no action");
            innerSuccessCallback();
        } else if(path[MongooseReference.ReferenceRuleProperty] == MongooseReference.ReferenceRule.NULLIFY) {
            //SET Referenced object to null
            //console.log("reffield: " + referenceField);
            console.log("nullify");
            ReferencingDoc.findById( data , function(err, obj) {

                console.log(referenceField);
                console.log("found by ID!" + JSON.stringify(data));
                if(err) {
                    console.log("but has an error")
                    innerErrorCallback(err);
                    return;
                }
                if(!obj) {
                    console.log("empty object");
                    innerSuccessCallback();
                    return;
                }
                //console.log("inhalt: " + obj[referenceField]);
                if(obj[referenceField] == undefined || obj[referenceField] == null) {
                    innerSuccessCallback();
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
                obj.save(innerErrorCallback);
            });
        } else if(path[MongooseReference.ReferenceRuleProperty] == MongooseReference.ReferenceRule.CASCADE) {
            //DELETE Referenced object
            //console.log("delete reference");
            console.log("cascade");
            ReferencingDoc.findByIdAndRemove( data , innerErrorCallback);
        }
    })

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

