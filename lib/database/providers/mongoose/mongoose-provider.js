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

MongooseProvider.prototype.createEntity = function(data, resource, handleError, success)  {

    var model = resource.documentationJson.singular.toLowerCase()
    var Document = mongoose.model(model);
    console.log(Document);
    console.log(data);

    if(data === undefined || data === {}) {
        //TODO throw error
        success();
    }

    data["type"] = resource.documentationJson.type;

    var document = new Document(data);
    document.save(function(err, obj) {
        if(err){
            return handleError(err)
        } else {
            success(obj)
        };
    })

}

MongooseProvider.prototype.find = function(resource, callback)  {

    var model = resource.documentationJson.singular.toLowerCase()
    if(!resource.isCollection) {
        return this.findOne(resource, callback);
    }
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

MongooseProvider.prototype.findOne = function(resource, callback)  {
    var model = resource.documentationJson.singular.toLowerCase()
    var fields = "";

    console.log(resource.ids);
    if(resource.fields) {
        fields = resource.fields.replaceAll(",", " ");
    }

    var type = {"type":resource.documentationJson.type, "_id" : resource.ids[0]};

    var Document = mongoose.model(model);
    var query = Document.find(type).select(fields);

    query.exec(callback);

}

MongooseProvider.prototype.update = function(data, resource, callback)  {

    var model = resource.documentationJson.singular.toLowerCase()

    var Document = mongoose.model(model);
    var query = Document.findByIdAndUpdate( resource.ids[0], data);

    query.exec(callback);

}

MongooseProvider.prototype.updateOrInsert = function(data, resource, callback)  {

    var model = resource.documentationJson.singular.toLowerCase()


    var Document = mongoose.model(model);
    var query = Document.findByIdAndUpdate( resource.ids[0], data, {upsert:true});

    query.exec(callback);

}

module.exports = MongooseProvider;