/**
 * Created by samschmid on 24.03.14.
 */
var mongoose = require('mongoose');
var MongooseDocumentCreator = require('./mongoose-document-creator.js');
var MongooseDocumentDeleter = require('./mongoose-document-deleter.js');
var MongooseDocumentFinder = require('./mongoose-document-finder.js');
var MongooseDocumentUpdater = require('./mongoose-document-updater.js');

String.prototype.replaceAll = function(target, replacement) {
    return this.split(target).join(replacement);
};
String.prototype.capitalize = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
}
function MongooseProvider(config) {
    this.config = config;
    this.connection = undefined;
    this.documentCreator = new MongooseDocumentCreator(config);
    this.documentDeleter = new MongooseDocumentDeleter(config);
    this.documentFinder = new MongooseDocumentFinder(config);
    this.documentUpdater = new MongooseDocumentUpdater(config, this.documentCreator);
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

    this.documentCreator.createEntity(data,resource,handleError,success);
}

MongooseProvider.prototype.find = function(resource, callback)  {

    this.documentFinder.findDocuments(resource, callback);
}

MongooseProvider.prototype.findOne = function(resource, callback)  {

    this.documentFinder.findDocument(resource, callback);
}

MongooseProvider.prototype.update = function(data, resource, callback)  {

    this.documentUpdater.updateDocument(data, resource, callback);
}

MongooseProvider.prototype.updateOrInsert = function(data, resource, callback)  {

    this.documentUpdater.updateDocumentOrInsert(data, resource, callback);
}

MongooseProvider.prototype.updateAndNullifyEmptyFields = function(data, resource, callback)  {

    this.documentUpdater.updateDocumentAndNullifyEmpty(data, resource, callback);
}

MongooseProvider.prototype.delete = function(resource, callback)  {

    this.documentDeleter.deleteDocument(resource,callback);
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

module.exports = MongooseProvider;