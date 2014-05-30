/**
 * Created by Samuel Schmid on 23.03.14.
 *
 * Class for supporting MongoDB
 *
 * @type {MongooseProvider}
 */
module.exports = MongooseProvider;
var MongooseSchemeWriter = require("./scheme/mongoose-scheme-writer.js");
var MongooseLibWriter = require("./lib/mongoose-lib-writer.js");
function MongooseProvider(grunt) {
    this.grunt = grunt;
    this.scheme = new MongooseSchemeWriter(grunt);
    this.libWriter = new MongooseLibWriter(grunt);
    this.lib  = [];
}

/**
 * write Scheme
 *
 * @param doc
 */
MongooseProvider.prototype.writeScheme = function(doc)  {
    var scheme = this.scheme.writeScheme(doc);
    this.lib.push(scheme);
}

/**
 * wirte Abstract Schemes
 *
 * @param doc
 */
MongooseProvider.prototype.writeAbstractScheme = function(doc)  {
    var scheme = this.scheme.writeAbstractScheme(doc);
    this.lib.push(scheme);
}

/**
 * write Lib Files
 *
 */
MongooseProvider.prototype.writeLib = function()  {

    this.libWriter.writeLib(this.lib);

}
