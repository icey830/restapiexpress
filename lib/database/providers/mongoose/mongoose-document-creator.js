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
 * @param data
 * @param resource
 * @param handleError
 * @param success
 */
MongooseDocumentCreator.prototype.createEntity = function(data, resource, handleError, success)  {

    var model = resource.documentationJson.type;
    var Document = mongoose.model(model);

    if(data === undefined || data === {}) {
        //TODO throw error
        success();
    }

    var transaction = new Transaction();
    transaction.onSuccess = function(objarray) {
        success(objarray[0]);
    }
    transaction.onFail = function(error, obj) {
        handleError(error);
    }
    transaction.add("MongooseDocumentCreator.prototype.createEntity");

    var document = new Document(data);

    document.save(function(err, obj) {
        if(err){
            console.log("error crate:"  + err +"/");
            return transaction.fail(err);
        } else {
            for (var property in resource.documentationJson.model) {
                var path = resource.documentationJson.model[property];
                if (path.hasOwnProperty("reference")) {


                    if(data[path.name] != null) {

                        console.log("add ref");
                        var ref = new Reference(path, data, obj, transaction.fail);
                        ref.add();

                    }
                }
            }
            transaction.success(obj);
        };
    })

}
