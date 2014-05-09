Array.prototype.contains = function(obj) {
    var i = this.length;
    while (i--) {
        if (this[i] === obj) {
            return true;
        }
    }
    return false;
}
function jsonConcat(o1, o2) {
    for (var key in o2) {
        o1[key] = o2[key];
    }
    return o1;
}
function clone(obj) {
    if (null == obj || "object" != typeof obj) return obj;
    var copy = obj.constructor();
    for (var attr in obj) {
        if (obj.hasOwnProperty(attr)) copy[attr] = obj[attr];
    }
    return copy;
}

function Doc(filename,abspath, grunt) {
    this.grunt = grunt;
    this.filename = filename;
    this.abspath = abspath;
    this.base = undefined;
    this.baseDoc = undefined;
    this.folder = abspath.substring(0,abspath.length - filename.length).replace("apidoc/","api/");
    this.schemefolder = abspath.substring(0,abspath.length - filename.length).replace("apidoc/","database/schemes/");
    this.testfolder = this.folder.replace("api/","test/");
    this.generatedDocsFolder = this.folder.replace("api/","generated/");
    this.version = undefined;
    this.filetitle = undefined;
    this.model = undefined;
    this.json = {};
    this.supportedMethods = [];
    this.readFile(grunt);
}

Doc.prototype.readFile = function(grunt) {

    this.json=grunt.file.readJSON(this.abspath);
    this.base = this.json.base;
    this.version = this.json.version;
    this.filetitle = this.json.title.toLowerCase();


}

Doc.prototype.readModel = function() {

    var grunt = this.grunt;

    var parentModel = {};
    if(this.base && this.base != "none") {
        var parentModel = this.baseDoc.readModel();

    }
    if(this.json.model) {
        this.model = JSON.parse(JSON.stringify(this.json.model));
        this.model = jsonConcat(this.model,parentModel);
    }

    return this.model;
}
Doc.prototype.getPermissions = function() {

    var grunt = this.grunt;
    var parentPermissions = [];
    if(this.base && this.base != "none") {
        var parentPermissions = this.baseDoc.getPermissions();

    }

    var thisPermission = this.json.permission;

    //Translate allowedMethods to methods
    grunt.log.debug("thispermission");
    thisPermission.forEach(function(docPermission) {
        if(docPermission.allowedMethods) {
            docPermission.methods = docPermission.allowedMethods;
        }
        if(!docPermission.methods) {
            docPermission.methods = [];
        }
    });


    //Add methods from Parent
    grunt.log.debug("parentPermission");
    parentPermissions.forEach(function(basePermission) {

        var baseRole = basePermission.role;
        var docHasRole = false;
        thisPermission.forEach(function(docPermission) {
           if(docPermission.role === baseRole) {
               docHasRole = true;
               return;
           }
        });
        if(!docHasRole) {
            var translatedBasePermission = basePermission;

            if(translatedBasePermission.allowedMethods) {
                translatedBasePermission.methods = translatedBasePermission.allowedMethods;
            }

            thisPermission.push(translatedBasePermission)
        } else {
            grunt.log.debug("loop basePermissions" +JSON.stringify(basePermission));
            basePermission.allowedMethods.forEach(function(allowedMethod) {

                if(thisPermission.length > 0) {
                    thisPermission.forEach(function(docPermission) {
                        if(docPermission.role === baseRole) {
                            if(docPermission.deniedMethods && docPermission.deniedMethods.contains(allowedMethod)) {
                              return;
                            };
                            if(docPermission.methods && !docPermission.methods.contains(allowedMethod)) {
                                docPermission.methods.push(allowedMethod);
                            } else {
                                docPermission.methods = [];
                                docPermission.methods.push(allowedMethod);
                            }
                        }
                    })
                }
            });
            grunt.log.debug("loop end");
        }

    })

    return thisPermission;
}

Doc.prototype.readParent = function() {

    this.json.permission = this.getPermissions();
    readPermissionFromDoc(this,this.json.permission);
    this.readModel();


}

function readPermissionFromDoc(that,permissions) {

    //that.grunt.log.debug("readPermissionFromDoc");
    permissions.forEach(function(permission) {
        //that.grunt.log.debug("methods");
        if(permission.methods) {
            permission.methods.forEach(function(method) {
                if(!that.supportedMethods.contains(method)) {
                    that.supportedMethods.push(method);

                }
            });
        }


    });
}

Doc.prototype.pathToAppJsFromFolder = function(folder,minus) {

    if(!minus) {
        minus = 0;
    }
    var level = folder.split('/').length ;
    var pathToAppJS = "app.js";
    for(var i=0;i<=level-minus;i++) pathToAppJS = "../" + pathToAppJS;
    return pathToAppJS;
}

Doc.prototype.supportedVerbs = function(){
    if(this.apidescription === undefined) {
        return undefined;
    }
    var allSupportedMethods = this.apidescription.supportedMethods;
    var supportedVerbs = [];
    Object.keys(allSupportedMethods).forEach(function(verb) {
        supportedVerbs.push(verb);
    });
    return supportedVerbs;
}
module.exports = Doc;