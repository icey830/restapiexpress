/**
 * Created by Samuel Schmid on 23.03.14.
 *
 * Class for Database Handling
 *
 * Containing
 * - App Config
 * - Database Information
 *
 * @type {Database}
 */
module.exports = Database;

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

/**
 * delete Database Schemes of Docs
 *
 * @param docs
 */
Database.prototype.deleteSchemes = function(docs) {
    var grunt = this.grunt;
    grunt.log.debug("start ");
    if(docs.docs.length > 0) {
        var firstDoc = docs.docs[0];
        var rootfolder =  firstDoc.schemefolder.split("/")[0];

        grunt.log.debug("Database: delete files in folder:" + rootfolder);
        grunt.file.delete(rootfolder);
    } else {
        grunt.log.debug("Empty");
        return;
    }
}

/**
 * create Database Schemes for Docs
 *
 * @param docs
 */
Database.prototype.createSchemes = function(docs)  {

    var grunt = this.grunt;

    if(this.db.name === "mongodb") {

        if(this.db.provider === "mongoose") {
            grunt.log.write("start writing schemes for database " + this.db.name + " and provider "+this.db.provider + ".");
            var Provider = require('./providers/mongoose/mongoose-provider.js');
            var provider = new Provider(grunt);

            for(var i=0;i<docs.docs.length;i++) {
                var doc = docs.docs[i];

                if(doc.json.type.endsWith('.abstract')) {

                    provider.writeAbstractScheme(doc);

                }

            }

            for(var i=0;i<docs.docs.length;i++) {
                var doc = docs.docs[i];

                if(!doc.json.type.endsWith('.apidescription') && !doc.json.type.endsWith('.abstract')) {

                    provider.writeScheme(doc);

                }

            }

            provider.writeLib();
        } else {

            grunt.log.write("cannot create schemes for database " + this.db.name + ", because there we can't use the provider "+this.db.provider+" for it.");
        }

    } else {
        grunt.log.write("cannot create schemes for database " + this.db.name + ", because there is no provider for it.");

    }
}
