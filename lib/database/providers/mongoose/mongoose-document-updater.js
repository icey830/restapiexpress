/**
 * Created by Samuel Schmid on 11.04.14.
 *
 * handles database updates on documents
 *
 * @type {MongooseDocumentUpdater}
 */
module.exports = MongooseDocumentUpdater;

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
Array.prototype.contains = function(obj) {
    var i = this.length;
    while (i--) {
        if (this[i].equals(obj)) {
            return true;
        }
    }
    return false;
}

/**
 *
 * @param config
 * @param creator
 * @constructor
 */
function MongooseDocumentUpdater(config, creator) {
    this.config = config;
    this.creator = creator;
}

/**
 *
 * checks the reference if it needed to be updated
 *
 * if yes, the reference will be updated
 *
 * @param callback
 * @param oldData
 * @param resource
 * @returns {Function}
 */
function checkReferences(callback,oldData, resource) {

    return function(err,newObject) {

        if(err) {
            callback(err,newObject);
            return;
        }
        if(!newObject) {
            callback("new referencing object not found", newObject);
            return;
        }
        //check references
        for (var property in resource.documentationJson.model) {
            var path = resource.documentationJson.model[property];

            //console.log("old object: " + oldData);
            //console.log("change to object: " + newObject);
            //console.log("path: " + JSON.stringify(path));
            //console.log("ref: " + path.name);

            //check references
            //console.log("has rule?");
            if (path.hasOwnProperty(Reference.ReferenceRuleProperty)) {
                //console.log("yes");
                if(newObject[path.name] || oldData[path.name]) {

                    //console.log("array?");
                    if(path.type.endsWith("[]")) {
                        //console.log("yes");
                        var oldReferencesArray = oldData[path.name];
                        var newReferencesArray = newObject[path.name];

                        //console.log("old Refernces: " + JSON.stringify(oldReferencesArray));
                        //console.log("new Refernces: " + JSON.stringify(newReferencesArray));
                        if(oldReferencesArray) {
                            oldReferencesArray.forEach(function(reference) {
                                if(newReferencesArray) {
                                    if(!newReferencesArray.contains(reference)) {
                                        //console.log("old had this, but new not: object should be deleted");
                                        var ref = new Reference(path, newObject, oldData, callback);
                                        ref.updateRemove(resource, reference, oldData);

                                    }
                                } else {

                                    //console.log("old had this, but new is empty: object should be deleted");
                                    var ref = new Reference(path, newObject, oldData, callback);
                                    ref.updateRemove(resource, reference, oldData);

                                }

                            });
                        }
                        if(newReferencesArray) {
                            newReferencesArray.forEach(function(newReference) {
                                if(oldReferencesArray) {
                                    if(!oldReferencesArray.contains(newReference)) {
                                        //console.log("new has this, but old is not: object should be added");
                                        var ref = new Reference(path, newObject, oldData, callback);
                                        ref.updateAdd(resource, newReference,oldData);
                                    }
                                } else {
                                    console.log("new has this, but old is empty: object should be added");
                                    var ref = new Reference(path, newObject, oldData, callback);
                                    ref.updateAdd(resource, newReference,oldData);
                                }

                            })
                        }

                    } else {
                        //console.log("no");
                        //console.log("old   : " + oldData[path.name] + "/");
                        //console.log("new   : " + newObject[path.name] + "/");

                        //if(path[Reference.ReferenceRuleProperty] != Reference.ReferenceRule.NOACTION) {
                        if(oldData && newObject && oldData[path.name] != undefined && newObject[path.name] != undefined ){

                            if(newObject[path.name].equals(oldData[path.name])) {
                                //console.log("reference not changed");
                            } else {
                                //console.log("reference changed!");

                                var ref = new Reference(path, newObject, oldData, callback);
                                ref.update();

                            }


                        } else {
                            //Old Data or new DataProperty is Empty
                            if( oldData[path.name] != undefined) {
                                //console.log("reference deleted");
                                var ref = new Reference(path, {} , newObject, callback);
                                ref.remove();
                            }
                            if( newObject[path.name] != undefined) {
                                //console.log("reference added");
                                var ref = new Reference(path, newObject , newObject, callback);
                                ref.add();
                            }
                        }

                    }

                }


            }



        }
        callback(err, newObject);
    }

};


/**
 * update a database document
 *
 * @param data
 * @param resource
 * @param callback
 */
MongooseDocumentUpdater.prototype.updateDocument = function(data, resource, callback)  {

    var model = resource.documentationJson.type;

    var Document = mongoose.model(model);
    Document.findById( resource.ids[0], function(err, old) {
        if(err) {
            callback(err,old);
            return;
        } else {
            if(!old) {
                callback("old object to update not found id:" + resource.ids[0] + "," +model, old);
                return;
            }
            //console.log("new data" + data);
            if(data["_id"]) {
                delete data["_id"];
            }
            var query = Document.findByIdAndUpdate( resource.ids[0], data);

            query.exec(checkReferences(callback, old, resource));
        }
    })

}

/**
 * update or create a new document in database
 *
 * @param data
 * @param resource
 * @param callback
 */
MongooseDocumentUpdater.prototype.updateDocumentOrInsert = function(data, resource, callback)  {

    var model = resource.documentationJson.type;
    var Document = mongoose.model(model);
    var that = this;
    Document.findById( resource.ids[0], function(err, obj) {

        if(err != undefined && err !== "id not found") {
            //console.log("err: " + err + "/")
            callback(err);
        } else {
            if(obj){
                //console.log("object found");
                if(data["_id"]) {
                    delete data["_id"];
                }
                //console.log("new data" + JSON.stringify(data));
                var query = Document.findByIdAndUpdate( obj._id, data);
                query.exec(checkReferences(callback, obj, resource));
            } else {
                that.creator.createEntity(data, resource, callback, function( obj) {

                     callback(undefined,obj);

                });

            }
        }

    });
}

/**
 * update a document and nullify all empty fileds from request
 *
 * @param data
 * @param resource
 * @param callback
 */
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
                //console.log(path.defaultValue);
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
        if(property === "_id") {
            newData[property] = resource.ids[0];
        }
    }

    this.updateDocumentOrInsert(newData, resource, callback);
    /*var query = Document.findByIdAndUpdate( resource.ids[0], newData, {upsert:true});
    query.exec(callback);*/
}

