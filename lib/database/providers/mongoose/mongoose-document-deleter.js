/**
 * Created by Samuel Schmid on 11.04.14.
 *
 * This class provides methods to delete a document in the database
 *
 * @type {MongooseDocumentDeleter}
 */
module.exports = MongooseDocumentDeleter;

var mongoose = require('mongoose');
var Reference = require('./mongoose-reference.js');
var Transaction = require('./../../../transaction.js');

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

/**
 *
 * @param config
 * @param finder
 * @constructor
 */
function MongooseDocumentDeleter(config, finder) {
    this.config = config;
    this.finder = finder;
}

/**
 *
 * @param resource
 * @param callback
 * @returns {Function}
 */
function getOnRemoveFinishedHandler(resource, callback)  {

    return function(err, obj) {

        if(err) {
            callback(err, obj);
        } else {
            if(!obj) {
                callback(resource.documentationJson.type + " to remove not found");
                return;
            }

            var transaction = new Transaction();
            transaction.onSuccess = function(obj) {
                callback(undefined,obj);
            }
            transaction.onFail = function(error, obj) {
                callback(error, obj);
            }

            transaction.add("Check References");
            //check references

            var hasReferenceToRemove = false;
            for (var property in resource.documentationJson.model) {
                var path = resource.documentationJson.model[property];
                if (path.hasOwnProperty(Reference.ReferenceRuleProperty)) {
                    hasReferenceToRemove = true;
                    //TODO remove last paramenter if possible

                    var ref = new Reference(path, {}, obj,  function(err, obj){
                        console.log("shizzle ERROR callback called");
                        transaction.fail(err,obj,"remove refrence");});

                    console.log("remove ref")
                    ref.remove(transaction);

                }
            }
            console.log("finish transaction");
            transaction.success(obj,"Check References");
        }

    }

}

/**
 * Delete a document from database with callback
 *
 * @param resource
 * @param callback
 */
MongooseDocumentDeleter.prototype.deleteDocument = function(resource, callback)  {

    var model = resource.documentationJson.type;
    var Document = mongoose.model(model);

    if(resource.isCollection) {
        if(resource.scope.length !== 0) {

            //TODO Only delete where you have access!
            var query = this.finder.findDocumentsQuery(resource, false) ;
            query.exec(function(err, result) {

                if(err) {
                    callback(err);
                    return;
                }
                if(result.length > 0) {
                    result.forEach(function(obj) {

                        obj.remove(function(error) {
                            if(error) {
                                if(err == undefined) {
                                    err = error;
                                }
                                err = err + error;
                            }
                        });
                    })

                    callback(err,result)
                    return;
                } else {
                    callback("no document to delete");

                }

            })

        } else {
            callback("You need to define a scope");
        }


    } else {
        Document.findByIdAndRemove( resource.ids[0], getOnRemoveFinishedHandler(resource, callback));
    }


}


