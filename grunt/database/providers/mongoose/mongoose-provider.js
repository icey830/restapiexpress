/**
 * Created by samschmid on 23.03.14.
 */
var MongooseScheme = require("./scheme/mongoose-scheme.js");
var MongooseLibWriter = require("./lib/mongoose-lib-writer.js");
function MongooseProvider(grunt) {
    this.grunt = grunt;
    this.scheme = new MongooseScheme(grunt);
    this.libWriter = new MongooseLibWriter(grunt);
    this.lib  = [];
}

MongooseProvider.prototype.writeScheme = function(doc)  {
    var scheme = this.scheme.writeScheme(doc);
    this.lib.push(scheme);
}

MongooseProvider.prototype.writeLib = function()  {

    this.libWriter.writeLib(this.lib);

}

module.exports = MongooseProvider;