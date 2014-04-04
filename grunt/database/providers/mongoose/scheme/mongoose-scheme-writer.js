/**
 * Created by samschmid on 28.03.14.
 */
if (typeof String.prototype.startsWith != 'function') {
    // see below for better implementation!
    String.prototype.startsWith = function (str){
        return this.indexOf(str) == 0;
    };
}
String.prototype.endsWith = function(suffix) {
    return this.indexOf(suffix, this.length - suffix.length) !== -1;
};
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
function MongooseScheme(grunt) {
    this.grunt = grunt;
}
MongooseScheme.prototype.getExtendPath = function(doc) {
    var base = doc.baseDoc;
    var baseJson = doc.baseDoc.json;
    var referenzefolderPathComponents = base.schemefolder.split("/");
    var thisfolderPathComponents = doc.schemefolder.split("/");
    referenzefolderPathComponents.shift();
    referenzefolderPathComponents.shift();
    referenzefolderPathComponents.shift();
    thisfolderPathComponents.shift();
    thisfolderPathComponents.shift();
    thisfolderPathComponents.shift();
    thisfolderPathComponents.shift();
    thisfolderPathComponents.forEach(function(c,index) { thisfolderPathComponents[index]=".."});
    return "var " + baseJson.title.capitalize() + " = require('"+thisfolderPathComponents.join("/")+"/"+referenzefolderPathComponents.join("/")+baseJson.singular.capitalize()+".js');"

}
MongooseScheme.prototype.writeScheme = function(doc)  {
    this.grunt.log.debug("create Scheme for: " + doc.json.title);

    var template = "";
    if(doc.base && doc.base !== "none") {
        template = this.grunt.file.read('./grunt/database/providers/mongoose/scheme/extended-scheme.template');
    } else {
        template = this.grunt.file.read('./grunt/database/providers/mongoose/scheme/scheme.template');
    }
    var types = this.grunt.file.read('./grunt/database/providers/mongoose/scheme/types.template');
    template = template.replaceAll("{{{NAME}}}",doc.json.singular);
    template = template.replace("{{{TYPES}}}",types);
    if(doc.base && doc.base !== "none") {
        template = template.replace("{{{REFERENCE}}}",this.getExtendPath(doc));
        template = template.replace("{{{EXTEND}}}",doc.baseDoc.json.title.capitalize());
    }
    var model = doc.json.model;
    var scheme = {};
    for (var key in model) {
        var field = model[key];

        if(field.type.endsWith("[]")) {
            //Array
            var type= "[{type: ";
            if(field.type.startsWith("application/")) {
                type +=  "ObjectId, ref: " +JSON.stringify(field.type.substr(0,field.type.length-2));
            } else {
                type +=  field.type.capitalize();

            }
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
            type += "}]";
            scheme[key] = type;
        } else {
            var type= "{type: ";
            if(field.type.startsWith("application/")) {
                type +=  "ObjectId, ref: " +JSON.stringify(field.type);
            } else {
                type +=  field.type.capitalize();

            }
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

    }

    template = template.replaceAll("{{{SCHEME}}}",objToString(scheme));

    this.grunt.file.write(doc.schemefolder+ doc.json.singular+'.js', template);

    return {
        "path": "./"+doc.json.title.toLowerCase() + "/" + doc.json.singular+'.js',
        "scheme" : doc.json.singular,
        "version":doc.json.version,
        "type": doc.json.type
    };
}


MongooseScheme.prototype.writeAbstractScheme = function(doc)  {
    this.grunt.log.debug("create Scheme for: " + doc.json.title);

    var template = "";
    if(doc.base && doc.base !== "none") {
        template = this.grunt.file.read('./grunt/database/providers/mongoose/scheme/extended-scheme.template');
    } else {
        template = this.grunt.file.read('./grunt/database/providers/mongoose/scheme/scheme.template');
    }
    var types = this.grunt.file.read('./grunt/database/providers/mongoose/scheme/types.template');
    template = template.replaceAll("{{{NAME}}}",doc.json.singular);
    template = template.replace("{{{TYPES}}}",types);
    if(doc.base && doc.base !== "none") {
        template = template.replace("{{{REFERENCE}}}",this.getExtendPath(doc));
        template = template.replace("{{{EXTEND}}}",doc.baseDoc.json.title.capitalize());
    }

    var model = doc.json.model;
    var scheme = {};
    this.grunt.log.debug(doc.json.title);
    for (var key in model) {
        var field = model[key];

        if(field.type.endsWith("[]")) {
            //Array
            var type= "[{type: ";

            if(field.type.startsWith("application/")) {
                type +=  "ObjectId, ref: " +JSON.stringify(field.type.substr(0,field.type.length-2));
            } else {
                type +=  field.type.capitalize();

            }

            if(field.default) {

                type += ", default: " + field.default;
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
            type += "}]";
            scheme[key] = type;
        } else {
            var type= "{type: ";

            if(field.type.startsWith("application/")) {
                type +=  "ObjectId, ref: " +JSON.stringify(field.type);
            } else {
                type +=  field.type.capitalize();

            }

            if(field.default) {

                type += ", default: " + field.default;
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



    }

    template = template.replaceAll("{{{SCHEME}}}",objToString(scheme));
    this.grunt.log.debug(doc.schemefolder);
    this.grunt.file.write(doc.schemefolder+ doc.json.singular+'.js', template);

    return {
        "path": "./abstract/"+doc.json.title.toLowerCase() + "/" + doc.json.singular+'.js',
        "scheme" : doc.json.singular,
        "version":doc.json.version,
        "type" : doc.json.type
    };
}


MongooseScheme.prototype.writeLib = function(lib)  {
    var grunt = this.grunt;
    var template = this.grunt.file.read('./grunt/database/providers/mongoose/scheme/lib.template');
    var templateA = this.grunt.file.read('./grunt/database/providers/mongoose/scheme/lib-start.template');
    var templateB = this.grunt.file.read('./grunt/database/providers/mongoose/scheme/lib-end.template');
    var libfiles = new Array();
    libfiles[0] = undefined;
    lib.forEach(function(scheme) {
        if(libfiles[scheme.version]===undefined) {
            libfiles[scheme.version] = "";
        }

        libfiles[scheme.version] += template.replaceAll("{{{SCHEME}}}", scheme.scheme).replace("{{{PATH}}}", scheme.path).replaceAll("{{{scheme}}}",scheme.scheme.toLowerCase());

    })
    libfiles.forEach(function(libfile,index) {
        if(libfile!==undefined) {
            grunt.log.debug("libs: " +index + " " +libfile);
            grunt.file.write("./database/schemes/v"+index+"/schemes.js", templateA+libfile+templateB);
        }

    })
}

module.exports = MongooseScheme;