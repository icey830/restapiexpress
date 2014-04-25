Array.prototype.contains = function(obj) {
    var i = this.length;
    while (i--) {
        if (this[i] === obj) {
            return true;
        }
    }
    return false;
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
Doc.prototype.getPermissions = function() {

    var grunt = this.grunt;
    var parentPermissions = [];
    if(this.base && this.base != "none") {
        var parentPermissions = this.baseDoc.getPermissions();

    }

    var thisPermission = this.json.permission;

    //Translate allowedMethods to methods
    thisPermission.forEach(function(docPermission) {
        if(docPermission.allowedMethods) {
            docPermission.methods = docPermission.allowedMethods;
        }

    });

    //Add methods from Parent
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
            grunt.log.debug("loop basePermissions");
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
        }

    })

    return thisPermission;
}

Doc.prototype.readPermissions = function() {

    this.json.permission = this.getPermissions();
    readPermissionFromDoc(this,this.json.permission);

}

function readPermissionFromDoc(that,permissions) {

    permissions.forEach(function(permission) {

        permission.methods.forEach(function(method) {
            if(!that.supportedMethods.contains(method)) {
                that.supportedMethods.push(method);

            }
        });

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
module.exports = Doc;