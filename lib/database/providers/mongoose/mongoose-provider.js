/**
 * Created by samschmid on 24.03.14.
 */
var mongoose = require('mongoose');

String.prototype.replaceAll = function(target, replacement) {
    return this.split(target).join(replacement);
};
String.prototype.capitalize = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
}
function MongooseProvider(config) {
    this.config = config;
}

MongooseProvider.prototype.connect = function()  {

    var options = {
        server: { poolSize: 5 }
    };
    options.server.socketOptions = { keepAlive: 1 };
    mongoose.connect('mongodb://'+ this.config.location, options)
    console.log(this.config.name + " with mongoose provider on "+this.config.location+" connected");

    var Schemes = require("../../../../database/schemes/v1/schemes.js");
    new Schemes();

}

MongooseProvider.prototype.createEntity = function(model, data, resource, handleError, success)  {

    var Document = mongoose.model(model);
    console.log(Document);
    console.log(data);

    if(data === undefined || data === {}) {
        //TODO throw error
        success();
    }

    data["type"] = resource.documentationJson.type;
    Document.create(data, function(err, object) {
        if(err){
            return handleError(err)
        } else {
            success(object)
        };
    });

}

MongooseProvider.prototype.find = function(model, resource, callback)  {


    var fields = "";


    if(resource.fields) {
        fields = resource.fields.replaceAll(",", " ");
    }
    /*if(fields === "") {
        callback(undefined,[]);
        return;
    }*/
    var type = {"type":resource.documentationJson.type};

    var limit = 0;
    var page = 0;
    var sort = "";

    if(resource.limit) {
        limit = resource.limit;
    }
    if(resource.page) {
        page = resource.page;
    }
    if(resource.sort) {
        sort = resource.sort.replaceAll(",", " ");
    }
    var Document = mongoose.model(model);
    var query = Document.find(type).skip(page * limit).limit(limit).select(fields).sort(sort);

    if(resource.scope.length !== 0) {
        resource.scope.forEach(function(scope) {
            if(scope.operator === "eq") {
                query = query.where(scope.field).equals(scope.value);
            } else if(scope.operator === "lt") {
                query = query.where(scope.field).lt(scope.value);
            } else if(scope.operator === "lte") {
                query = query.where(scope.field).lte(scope.value);
            } else if(scope.operator === "gt") {
                query = query.where(scope.field).gt(scope.value);
            } else if(scope.operator === "gte") {
                query = query.where(scope.field).gte(scope.value);
            }

        });

    }
    query.exec(callback);

}
module.exports = MongooseProvider;