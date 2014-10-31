/**
 * Created by samschmid on 31.10.14.
 *
 * @type {MongooseReferenceCreator}
 */
module.exports = MongooseReferenceUpdater;
var Transaction = require('./../../../../transaction.js');
var mongoose = require('mongoose');
var MongooseReference = require('../mongoose-reference.js');
require('./../../../../helper.js');


/**
 *
 * @constructor
 */
function MongooseReferenceUpdater(reference) {
    this.reference = reference;
}


MongooseReferenceUpdater.prototype.update = function(newData,oldData)  {


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
    this.reference.data = {};
    this.reference.obj = oldData;
    this.reference.remove(transaction);

    //TODO add to new
    this.reference.data = newData;
    this.reference.obj = newData;


    this.reference.add();
}

MongooseReferenceUpdater.prototype.updateAdd = function(data)  {

    //add to new
    this.reference.obj = data;
    this.reference.add();
}

MongooseReferenceUpdater.prototype.updateRemove = function(oldData)  {

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
    this.reference.data = {};
    this.reference.obj = oldData;
    this.reference.remove(transaction);

}