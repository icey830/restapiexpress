/**
 * Created by Samuel Schmid on 31.05.14.
 *
 * base class for providers
 *
 * @type {MongooseProvider}
 */
module.exports = BaseProvider;

/**
 * @class BaseProvider
 *
 * @classdesc handles database connections and methods
 *
 * @param config
 * @constructor
 */
function BaseProvider(config) {
    this.config = config;
    this.connection = undefined;
}

/**
 * connect to database
 */
BaseProvider.prototype.connect = function()  {}

/**
 * create entity
 *
 * @param data
 * @param resource
 * @param handleError
 * @param success
 */
BaseProvider.prototype.createEntity = function(data, resource, handleError, success)  {}

/**
 * find entity or collection passed in callback
 * @param resource
 * @param callback
 */
BaseProvider.prototype.find = function(resource, callback)  {}

/**
 * find entity passed in callback
 * @param resource
 * @param callback
 */
BaseProvider.prototype.findOne = function(resource, callback) {}

/**
 * update entity, result passed in callback
 * @param data
 * @param resource
 * @param callback
 */
BaseProvider.prototype.update = function(data, resource, callback)  {}

/**
 * update entity or create new one. result passed in callback
 * @param data
 * @param resource
 * @param callback
 */
BaseProvider.prototype.updateOrInsert = function(data, resource, callback) {}

/**
 * update a document and nullify all empty fields from request
 *
 * @param data
 * @param resource
 * @param callback
 */
BaseProvider.prototype.updateAndNullifyEmptyFields = function(data, resource, callback)  {}

/**
 * delete entity
 *
 * @param resource
 * @param callback
 */
BaseProvider.prototype.delete = function(resource, callback)  {}

/**
 * drop database, used for tests
 *
 * @param asyncProcess
 */
MongooseProvider.prototype.clear = function(asyncProcess) {}