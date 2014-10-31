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
var MongooseReferenceCreator = require('./reference/mongoose-reference-creator.js');
var MongooseReferenceRemover = require('./reference/mongoose-reference-remover.js');
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
    this.path = path;
    this.data = data;
    this.obj = obj;
    this.errorCallback = errorCallback;
    this.referenceFields = [];
}

MongooseReference.prototype.add = function()  {

    this.referenceCreator.add(this.obj,this.referenceFields,this.path,this.data,this.errorCallback);

}

MongooseReference.prototype.remove = function(transaction)  {

    this.referenceRemover.remove(this.path, this.obj,transaction);

}

MongooseReference.prototype.update = function()  {

    var newData = this.data;
    var oldData = this.obj;

    //TODO Refactor that the handle does something
    var transaction = new Transaction();
    transaction.onSuccess = function(obj) {
        //callback(undefined,obj);
        console.log("Success Callback FIRED!");
    }
    transaction.onFail = function(error, obj) {
        console.log("ERROR Callback FIRED!");
        // callback(error, obj);
    }
    transaction.add("update Remove");

    //TODO remove from old
    this.data = {};
    this.obj = oldData;
    this.remove(transaction);

    //TODO add to new
    this.data = newData;
    this.obj = newData;

    this.referenceCreator.add(this.obj,this.referenceFields,this.path,this.data,this.errorCallback);

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

    this.referenceCreator.add(newData,this.referenceFields,this.path, newData,this.errorCallback);
}

MongooseReference.prototype.updateRemove = function(resource, reference)  {

    //TODO Refactor that the handle does something
    var transaction = new Transaction();
    transaction.onSuccess = function(obj) {
        //callback(undefined,obj);
        console.log("Success Callback FIRED!");
    }
    transaction.onFail = function(error, obj) {
        console.log("ERROR Callback FIRED!");
        // callback(error, obj);
    }
    transaction.add("update Remove");


    var newData = this.data;
    var oldData = this.obj;

    //TODO remove from old
    this.data = {};
    this.obj = oldData;
    this.remove(transaction);

}

