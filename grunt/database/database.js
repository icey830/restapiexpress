/**
 * Created by samschmid on 23.03.14.
 */
Array.prototype.contains = function(obj) {
    var i = this.length;
    while (i--) {
        if (this[i] === obj) {
            return true;
        }
    }
    return false;
}

String.prototype.replaceAll = function(target, replacement) {
    return this.split(target).join(replacement);
};

function Database(grunt) {
    this.grunt = grunt;
    this.appconfig = grunt.config().appconfig;
    this.db = this.appconfig.db;
}

Database.prototype.createSchemes = function(docs)  {

    var appconfig = this.appconfig;
    var grunt = this.grunt;

    if(this.db.name === "mongodb") {

        var lib  = [];

        if(this.db.provider === "mongoose") {
            grunt.log.write("start writing schemes for database " + this.db.name + " and provider "+this.db.provider + ".");
            var Provider = require('./providers/mongoose/mongoose-provider.js');
            var provider = new Provider(grunt);
            for(var i=0;i<docs.docs.length;i++) {
                var doc = docs.docs[i];

                if(doc.json.title !== 'api') {
                    //TODO create Scheme for Doc
                    var scheme = provider.writeScheme(doc);
                    lib.push(scheme);

                }

            }

            provider.writeLib(lib);
        } else {

            grunt.log.write("cannot create schemes for database " + this.db.name + ", because there we can't use the provider "+this.db.provider+" for it.");
        }



        //
    } else {
        grunt.log.write("cannot create schemes for database " + this.db.name + ", because there is no provider for it.");

    }
}
module.exports = Database;