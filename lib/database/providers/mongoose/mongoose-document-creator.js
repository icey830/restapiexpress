/**
 * Created by samschmid on 24.03.14.
 *
 * This class provides methods to create a document in the database
 *
 * @type {MongooseDocumentCreator}
 */
module.exports = MongooseDocumentCreator;

var mongoose = require('mongoose');
var Transaction = require('./../../../transaction.js');
var Reference = require('./mongoose-reference.js');
require('./../../../helper.js');


/**
 *
 * @param config
 * @constructor
 */
function MongooseDocumentCreator(config) {
    this.config = config;
}

/**
 * creates a document in database with callback
 *
 * @param json data for new entity
 * @param resource
 * @param handleError callback
 * @param success callback
 */
MongooseDocumentCreator.prototype.createEntity = function(json, resource, handleError, success)  {

    var model = resource.documentationJson.type;
    var Document = mongoose.model(model);

    if(json === undefined || json === {}) {
        //TODO throw error
        success();
    }

    var transaction = new Transaction();
    transaction.onSuccess = function(objarray) {
        success(objarray[0]);
    }
    transaction.onFail = function(error) {
        handleError(error);
    }
    transaction.add("MongooseDocumentCreator.prototype.createEntity");

    var document = new Document(json);
    document.save(afterSave(transaction, resource, json));

}

function afterSave(transaction, resource, json) {

    return function(err, obj) {

        if(err){

            //Handle Error
            console.log("error crate:"  + err +"/");
            return transaction.fail(err);

        } else {

            //Handle Successful save
            for (var property in resource.documentationJson.model) {

                addReference(
                    resource.documentationJson.model[property],
                    json,
                    obj,
                    transaction);

            }
            transaction.success(obj);
        };
    };

}

function addReference(path, json, obj, transaction) {

    if (path.hasOwnProperty("reference")) {

        if(json[path.name] != null) {

            var ref = new Reference(path, json, obj, transaction.fail);
            ref.add();

        }
    }
}