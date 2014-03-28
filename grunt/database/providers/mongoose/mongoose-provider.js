/**
 * Created by samschmid on 23.03.14.
 */

String.prototype.replaceAll = function(target, replacement) {
    return this.split(target).join(replacement);
};
String.prototype.capitalize = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
}
function objToString (obj) {
    var str = '{\n';
    for (var p in obj) {
        if (obj.hasOwnProperty(p)) {
            str += p + ':' + obj[p] + ',\n';
        }
    }
    str = str.substring(0,str.length-2);
    return str + "\n}";
}
function MongooseProvider(grunt) {
    this.grunt = grunt;
}

MongooseProvider.prototype.createSchemeAndGetLibFile = function(doc)  {
    this.grunt.log.debug("create Scheme for: " + doc.json.title);

    var template = this.grunt.file.read('./grunt/database/providers/mongoose/scheme.template');
    var types = this.grunt.file.read('./grunt/database/providers/mongoose/types.template');
    template = template.replaceAll("{{{NAME}}}",doc.json.singular);
    template = template.replace("{{{TYPES}}}",types);
    var model = doc.json.model;
    var scheme = {};
    for (var key in model) {
        var field = model[key];
        var type= "{type: ";
        type +=  field.type.capitalize();
        if(field.default) {

            type += ", default: " + JSON.stringify(field.default);
        }
        if(field.min) {

            type += ", min: " + JSON.stringify(field.min);
        }
        if(field.max) {

            type += ", max: " + JSON.stringify(field.max);
        }
        if(field.regex) {

            type += ', match: [' +field.regex+ ',"That file doesn\'t match '+ field.regex+ ' ({VALUE})"' + ']';
        }
        if(field.mandatory) {
            if(field.mandatory === true) {
                type += ", required: true";
            }
        }
        type += "}";
        scheme[key] = type;
    }
    scheme["type"] = "{type: String}";

    template = template.replaceAll("{{{SCHEME}}}",objToString(scheme));

    this.grunt.file.write(doc.schemefolder+ doc.json.singular+'.js', template);

    return {"path": "./"+doc.json.title.toLowerCase() + "/" + doc.json.singular+'.js', "scheme" : doc.json.singular, "version":doc.json.version};
}

module.exports = MongooseProvider;