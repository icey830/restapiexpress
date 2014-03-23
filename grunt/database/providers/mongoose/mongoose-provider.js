/**
 * Created by samschmid on 23.03.14.
 */

String.prototype.replaceAll = function(target, replacement) {
    return this.split(target).join(replacement);
};
String.prototype.capitalize = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
}
function MongooseProvider(grunt) {
    this.grunt = grunt;
}

MongooseProvider.prototype.createScheme = function(doc)  {
    this.grunt.log.debug("create Scheme for: " + doc.json.title);

    var template = this.grunt.file.read('./grunt/database/providers/mongoose/scheme.template');
    template = template.replaceAll("{{{NAME}}}",doc.json.singular);

    var model = doc.json.model;
    var scheme = {};
    for (var key in model) {
        scheme[key] = model[key].type.capitalize();


    }
    template = template.replaceAll("{{{SCHEME}}}",JSON.stringify(scheme));

    this.grunt.file.write(doc.schemefolder+ '/'+doc.json.singular+'.js', template);
}

module.exports = MongooseProvider;