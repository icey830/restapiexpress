/**
 * Created by Samuel Schmid on 24.03.14.
 *
 * handles postgres.
 *
 * @type {PostgresProvider}
 */
module.exports = MongooseProvider;

var mongoose = require('mongoose');
var Creator = require('./postgres-entity-creator');
var Deleter = require('./postgres-entity-deleter.js');
var Finder = require('./postgres-entity-finder.js');
var Updater = require('./postgres-entity-updater.js');

String.prototype.replaceAll = function(target, replacement) {
    return this.split(target).join(replacement);
};
String.prototype.capitalize = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
}

/**
 *
 * @param config
 * @constructor
 */
function MongooseProvider(config) {
    this.config = config;
    this.connection = undefined;
    this.finder = new Finder(config);
    this.creator = new Creator(config);
    this.deleter = new Deleter(config, this.finder);
    this.updater = new Updater(config, this.creator);
}

MongooseProvider.prototype.connect = function()  {

    var options = {
        server: { poolSize: 5 }
    };
    options.server.socketOptions = { keepAlive: 1 };

    if(process.env.NODE_ENV === "test") {

        this.connection = mongoose.connect('mongodb://'+ this.config.testlocation, options)
        console.log("TEST" + this.config.name + " with mongoose provider on "+this.config.testlocation+" connected");
    } else {
        this.connection = mongoose.connect('mongodb://'+ this.config.location, options)
        console.log(this.config.name + " with mongoose provider on "+this.config.location+" connected");
    }

    var Schemes = require("../../../../database/schemes/v1/schemes.js");
    new Schemes();

}

MongooseProvider.prototype.createEntity = function(data, resource, handleError, success)  {

    this.creator.createEntity(data,resource,handleError,success);
}

MongooseProvider.prototype.find = function(resource, callback)  {

    this.finder.findDocuments(resource, callback);
}

MongooseProvider.prototype.findOne = function(resource, callback)  {

    this.finder.findDocument(resource, callback);
}

MongooseProvider.prototype.update = function(data, resource, callback)  {

    this.updater.updateDocument(data, resource, callback);
}

MongooseProvider.prototype.updateOrInsert = function(data, resource, callback)  {

    this.updater.updateDocumentOrInsert(data, resource, callback);
}

MongooseProvider.prototype.updateAndNullifyEmptyFields = function(data, resource, callback)  {

    this.updater.updateDocumentAndNullifyEmpty(data, resource, callback);
}

MongooseProvider.prototype.delete = function(resource, callback)  {

    this.deleter.deleteDocument(resource,callback);
}

MongooseProvider.prototype.clear = function(asyncProcess) {

    var done = asyncProcess;
    var that = this;
    this.connection.connection.on('open', function () {
        that.connection.connection.db.dropDatabase(function(err) {
            if(err) {
                console.log(err);
            } else {
                console.log('Successfully dropped db');
            }
            that.connection.connection.close(done);
        });
    });


}

