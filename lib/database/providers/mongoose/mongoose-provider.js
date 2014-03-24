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
}

MongooseProvider.prototype.createEntity = function(model, scheme, data, handleError, success)  {

    var Document = mongoose.model(model,scheme);
    Document.create(data, function(err, object) {
        if(err){
            return handleError(err)
        } else {
            success(object)
        };
    });

}
module.exports = MongooseProvider;