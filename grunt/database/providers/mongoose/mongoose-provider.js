/**
 * Created by samschmid on 23.03.14.
 */
var MongooseScheme = require("./scheme/mongoose-scheme.js");
var MongooseLibWriter = require("./lib/mongoose-lib-writer.js");
function MongooseProvider(grunt) {
    this.grunt = grunt;
    this.scheme = new MongooseScheme(grunt);
    this.libWriter = new MongooseLibWriter(grunt);
}

MongooseProvider.prototype.writeScheme = function(doc)  {
    return this.scheme.writeScheme(doc);
}

MongooseProvider.prototype.writeLib = function(lib)  {

    this.libWriter.writeLib(lib);

}

module.exports = MongooseProvider;