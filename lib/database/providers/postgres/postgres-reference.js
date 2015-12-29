/**
 * Created by Samuel Schmid on 11.04.14.
 *
 * handles database references
 *
 * @type {MongooseReference}
 */
module.exports = MongooseReference;
require('./../../../helper.js');
var Transaction = require('./../../../transaction.js');
var mongoose = require('mongoose');


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
    this.referenceCreator = new MongooseReferenceCreator();
    this.referenceRemover = new MongooseReferenceRemover();
    this.referenceUpdater = new MongooseReferenceUpdater(this);
    this.path = path;
    this.data = data;
    this.obj = obj;
    this.errorCallback = errorCallback;
    this.referenceFields = [];
}

/**
 * add a reference
 */
MongooseReference.prototype.add = function()  {

    this.referenceCreator.add(this.obj,this.referenceFields,this.path,this.data,this.errorCallback);
}

/**
 * remove a reference
 *
 * @param transaction
 */
MongooseReference.prototype.remove = function(transaction)  {

    this.referenceRemover.remove(this.path, this.obj,transaction);
}

/**
 * update a reference
 */
MongooseReference.prototype.update = function()  {
    this.referenceUpdater.update(this.data, this.obj);
}

/**
 * update reference add
 */
MongooseReference.prototype.updateAdd = function()  {

    //add to new
    this.referenceUpdater.updateAdd(this.data);
}

/**
 * remove reference
 */
MongooseReference.prototype.updateRemove = function()  {

    this.referenceUpdater.updateRemove(this.obj);

}

