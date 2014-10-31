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
require('./../../../helper.js');


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
 * Delete a document from database with callback
 *
 * @param resource
 * @param callback
 */
MongooseDocumentDeleter.prototype.deleteDocument = function(resource, callback)  {

    var model = resource.documentationJson.type;
    var Document = mongoose.model(model);

    var transaction = new Transaction();
    transaction.onSuccess = function(objects) {
        callback(undefined,objects[0]);
    }
    transaction.onFail = function(error, obj) {
        callback(error, obj);
    }

    transaction.add("MongooseDocumentDeleter.prototype.deleteDocument ");


    if(resource.isCollection) {

        //TODO check if delete references

        if(resource.scope.length !== 0) {

            //TODO Only delete where you have access!
            var query = this.finder.findDocumentsQuery(resource, false) ;
            query.exec(

                function(err, result) {

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
                }
            );

        } else {
            callback("You need to define a scope");
        }


    } else {

        Document.findByIdAndRemove( resource.ids[0], getOnRemoveFinishedHandler(resource, transaction));
    }


}



/**
 *
 * @param resource
 * @param callback
 * @returns {Function}
 */
function getOnRemoveFinishedHandler(resource, transaction)  {

    return function(err, obj) {

        if(err) {
            transaction.fail(err, obj);

        } else {
            if(!obj) {
                transaction.fail(resource.documentationJson.type + " to remove not found");
                return;
            }

            //Check references
            for (var property in resource.documentationJson.model) {
                var path = resource.documentationJson.model[property];
                if (path.hasOwnProperty(Reference.ReferenceRuleProperty)) {

                    //TODO remove last paramenter if possible

                    var ref = new Reference(path, {}, obj,  function(err, obj){

                        transaction.fail(err,obj,"remove refrence");}
                    );


                    ref.remove(transaction);

                }
            }

            transaction.success(obj,"Check References");
        }

    }

}