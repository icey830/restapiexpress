/**
 * Created by samschmid on 23.03.14.
 */
var MongooseSchemeWriter = require("./scheme/mongoose-scheme-writer.js");
var MongooseLibWriter = require("./lib/mongoose-lib-writer.js");
function MongooseProvider(grunt) {
    this.grunt = grunt;
    this.scheme = new MongooseSchemeWriter(grunt);
    this.libWriter = new MongooseLibWriter(grunt);
    this.lib  = [];
}

MongooseProvider.prototype.writeScheme = function(doc)  {
    var scheme = this.scheme.writeScheme(doc);
    this.lib.push(scheme);
}

MongooseProvider.prototype.writeAbstractScheme = function(doc)  {
    var scheme = this.scheme.writeAbstractScheme(doc);
    this.lib.push(scheme);
}

MongooseProvider.prototype.writeLib = function()  {

    this.libWriter.writeLib(this.lib);

}

module.exports = MongooseProvider;