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
    this.folder = abspath.substring(0,abspath.length - filename.length).replace("apidoc/","api/");
    this.testfolder = this.folder.replace("api/","test/");
    this.version = undefined;
    this.filetitle = undefined;
    this.json = {};
    this.supportedMethods = [];
    this.readFile(grunt);
}

/*Doc.prototype.parseFilename = function(filename,grunt) {

    var that = this;

    filename.match(/(\w+)_v(\d+).json/).map(function(e, index){

        if (index === 1) {
            that.filetitle = e;
        } else if (index === 2) {
            that.version = e;
        }

    });
}*/

Doc.prototype.readFile = function(grunt) {

    this.json=grunt.file.readJSON(this.abspath);

    this.version = this.json.version;
    this.filetitle = this.json.title.toLowerCase();
    //Iterate over permissions and get all supported methods
    var that = this;
    this.json.permission.forEach(function(permission) {

        permission.methods.forEach(function(method) {
            if(!that.supportedMethods.contains(method)) {
                that.supportedMethods.push(method);

            }
        });

    });
}

Doc.prototype.createJsForAPI = function() {
    var grunt = this.grunt;
    var content = grunt.file.read('./grunt/templates/api.template');
    var test = grunt.file.read('./grunt/templates/test.template');
    var http200 = grunt.file.read('./grunt/templates/tests/http200.template');
    test = test + '\n' + http200;
    var that = this;

    this.supportedMethods.forEach(function(method) {
        that.json.permission.forEach(function(permission) {
            that.createAPIJsForMethod(permission,method,content);
            that.createAPITestsForMethod(permission,method,test);
        });

    });

}

Doc.prototype.createAPIJsForMethod = function(permission,method, content) {
    var links = [];
    var that = this;
    var grunt = this.grunt;
    var isAllowed = false;
    if(permission.methods.contains(method.toUpperCase())) {

        var dynLink =
        {
            "type":"application/com.github.restapiexpress.api",
            "rel": "self",
            "method": method,
            "href": "http://localhost:3000/v" + that.version + "/"
        };

        links.push(dynLink);

        isAllowed = true;
    }

    if(isAllowed) {
        permission.permanentLinks.forEach(function(permanentLink) {
            //if(permanentLink.method === method.toUpperCase()) {
            links.push(permanentLink);

            //}
        });

        var modifiedContent =  content.replace('{{{links}}}',JSON.stringify(links));
        grunt.file.write(that.folder + '/' + method.toLowerCase()+'/'+permission.role.toLowerCase()+'/instance.json', modifiedContent);
    }

}

Doc.prototype.createJsForInstanceAndCollection = function() {
    var grunt = this.grunt;
    var instanceContent = grunt.file.read('./grunt/templates/instance.template');
    var collectionContent = grunt.file.read('./grunt/templates/collection.template');

    var that = this;

    this.supportedMethods.forEach(function(method) {
        that.json.permission.forEach(function(permission) {

            that.createInstanceJsForMethod(permission,method,instanceContent);
            that.createCollectionJsForMethod(permission,method,collectionContent);
            that.createInstanceTestsForMethod(permission,method);
            that.createCollectionTestsForMethod(permission,method);
        });

    });

    var test = grunt.file.read('./grunt/templates/test.template');
    var http200 = grunt.file.read('./grunt/templates/tests/http200.template');
    test = test + '\n' + http200;
    this.createAPIDocTestsForMethod(test);
}

Doc.prototype.createInstanceJsForMethod = function(permission,method, content) {
    var links = [];
    var that = this;
    var grunt = this.grunt;
    var isAllowed = false;
    if(permission.methods.contains(method.toUpperCase())) {

/*        var dynLink =
        {
            "type":"application/com.github.restapiexpress.api",
            "rel": "self",
            "method": method,
            "href": "http://localhost:3000/v"+that.version+"/" + that.filetitle
        };

        links.push(dynLink);*/

        isAllowed = true;
    }

    if(isAllowed) {


        var modifiedContent =  content.replace('{{{links}}}',JSON.stringify(links));
        grunt.file.write(that.folder + '/' + method.toLowerCase()+'/'+permission.role.toLowerCase()+'/instance.js', modifiedContent);
    }

}


Doc.prototype.createCollectionJsForMethod = function(permission,method, content) {
    var links = [];
    var that = this;
    var grunt = this.grunt;
    var isAllowed = false;
    if(permission.methods.contains(method.toUpperCase())) {

/*        var dynLink =
        {
            "type":"application/com.github.restapiexpress.api",
            "rel": "self",
            "method": method,
            "href": "http://localhost:3000/v"+that.version+"/" + that.filetitle
        };

        links.push(dynLink);*/

        isAllowed = true;
    }

    if(isAllowed) {
        var modifiedContent =  content.replace('{{{links}}}',JSON.stringify(links));
        grunt.file.write(that.folder + '/' + method.toLowerCase()+'/'+permission.role.toLowerCase()+'/collection.js', modifiedContent);
    }

}

Doc.prototype.createAPITestsForMethod = function(permission, method, content) {

    var that = this;
    var grunt = this.grunt;
    if(permission.methods.contains(method.toUpperCase())) {

        var modifiedContent =  content.replace('{{{METHOD}}}',method.toUpperCase());
        modifiedContent =  modifiedContent.replace('{{{method}}}','delete' == method.toLowerCase() ? 'del' : method.toLowerCase());
        modifiedContent =  modifiedContent.replace('{{{path}}}','/');
        modifiedContent =  modifiedContent.replace('{{{path}}}','/');
        modifiedContent =  modifiedContent.replace('{{{role}}}',permission.role.toLowerCase());
        modifiedContent =  modifiedContent.replace('{{{role}}}',permission.role.toLowerCase());
        modifiedContent =  modifiedContent.replace('{{{appjs}}}',that.pathToAppJsFromFolder(that.testfolder));
        grunt.file.write(that.testfolder + '/' + method.toLowerCase()+'/'+permission.role.toLowerCase() + '/instance.js', modifiedContent);
    }

}

Doc.prototype.createAPIDocTestsForMethod = function(content) {

    var that = this;
    var grunt = this.grunt;
    var method = "GET";
    var role = "public";
    var originalContet = content;

    var modifiedContent =  content.replace('{{{METHOD}}}',method.toUpperCase());
    modifiedContent =  modifiedContent.replace('{{{method}}}','delete' == method.toLowerCase() ? 'del' : method.toLowerCase());
    modifiedContent =  modifiedContent.replace('{{{path}}}','/');
    modifiedContent =  modifiedContent.replace('{{{path}}}','/');
    modifiedContent =  modifiedContent.replace('{{{role}}}',role.toLowerCase());
    modifiedContent =  modifiedContent.replace('{{{role}}}',role.toLowerCase());
    modifiedContent =  modifiedContent.replace('{{{appjs}}}',that.pathToAppJsFromFolder(that.testfolder,2));
    grunt.file.write(that.testfolder + 'doc-get.js', modifiedContent);

    method = "POST";
    var modifiedContent =  originalContet.replace('{{{METHOD}}}',method.toUpperCase());
    modifiedContent =  modifiedContent.replace('{{{method}}}','delete' == method.toLowerCase() ? 'del' : method.toLowerCase());
    modifiedContent =  modifiedContent.replace('{{{path}}}','/');
    modifiedContent =  modifiedContent.replace('{{{path}}}','/');
    modifiedContent =  modifiedContent.replace('{{{role}}}',role.toLowerCase());
    modifiedContent =  modifiedContent.replace('{{{role}}}',role.toLowerCase());
    modifiedContent =  modifiedContent.replace('{{{appjs}}}',that.pathToAppJsFromFolder(that.testfolder,2));
    grunt.file.write(that.testfolder + 'doc-post.js', modifiedContent);
}

Doc.prototype.createInstanceTestsForMethod = function(permission, method) {

    var that = this;
    var grunt = this.grunt;
    if(permission.methods.contains(method.toUpperCase())) {

        var test = grunt.file.read('./grunt/templates/test.template');
        var http200 = grunt.file.read('./grunt/templates/tests/http200.template');
        test = test + '\n' + http200;

        var modifiedContent =  test.replace('{{{METHOD}}}',method.toUpperCase());
        modifiedContent =  modifiedContent.replace('{{{method}}}','delete' == method.toLowerCase() ? 'del' : method.toLowerCase());
        var path = '/v'+that.version + '/' + that.filetitle + '/123.json';
        modifiedContent =  modifiedContent.replace('{{{path}}}',path);
        modifiedContent =  modifiedContent.replace('{{{path}}}',path);
        modifiedContent =  modifiedContent.replace('{{{role}}}',permission.role.toLowerCase());
        modifiedContent =  modifiedContent.replace('{{{role}}}',permission.role.toLowerCase());
        modifiedContent =  modifiedContent.replace('{{{appjs}}}',that.pathToAppJsFromFolder(that.testfolder));
        grunt.file.write(that.testfolder + '/' + method.toLowerCase()+'/'+permission.role.toLowerCase() + '/instance.js', modifiedContent);
    } else {
        var test = grunt.file.read('./grunt/templates/test.template');
        var http302 = grunt.file.read('./grunt/templates/tests/http302.template');
        test = test + '\n' + http302;

        var modifiedContent =  test.replace('{{{METHOD}}}',method.toUpperCase());
        modifiedContent =  modifiedContent.replace('{{{method}}}','delete' == method.toLowerCase() ? 'del' : method.toLowerCase());
        var path = '/v'+that.version + '/' + that.filetitle + '/123.json';
        modifiedContent =  modifiedContent.replace('{{{path}}}',path);
        modifiedContent =  modifiedContent.replace('{{{path}}}',path);
        modifiedContent =  modifiedContent.replace('{{{role}}}',permission.role.toLowerCase());
        modifiedContent =  modifiedContent.replace('{{{role}}}',permission.role.toLowerCase());
        modifiedContent =  modifiedContent.replace('{{{appjs}}}',that.pathToAppJsFromFolder(that.testfolder));
        grunt.file.write(that.testfolder + '/' + method.toLowerCase()+'/'+permission.role.toLowerCase() + '/instance.js', modifiedContent);
    }

}

Doc.prototype.createCollectionTestsForMethod = function(permission, method) {

    var that = this;
    var grunt = this.grunt;
    if(permission.methods.contains(method.toUpperCase())) {

        var test = grunt.file.read('./grunt/templates/test.template');
        var http200 = grunt.file.read('./grunt/templates/tests/http200.template');
        test = test + '\n' + http200;

        var modifiedContent =  test.replace('{{{METHOD}}}',method.toUpperCase());
        modifiedContent =  modifiedContent.replace('{{{method}}}','delete' == method.toLowerCase() ? 'del' : method.toLowerCase());
        var path = '/v'+that.version + '/' + that.filetitle + '/';
        modifiedContent =  modifiedContent.replace('{{{path}}}',path);
        modifiedContent =  modifiedContent.replace('{{{path}}}',path);
        modifiedContent =  modifiedContent.replace('{{{role}}}',permission.role.toLowerCase());
        modifiedContent =  modifiedContent.replace('{{{role}}}',permission.role.toLowerCase());
        modifiedContent =  modifiedContent.replace('{{{appjs}}}',that.pathToAppJsFromFolder(that.testfolder));
        grunt.file.write(that.testfolder + '/' + method.toLowerCase()+'/'+permission.role.toLowerCase() + '/collection.js', modifiedContent);
    } else {

        var test = grunt.file.read('./grunt/templates/test.template');
        var http302 = grunt.file.read('./grunt/templates/tests/http302.template');
        test = test + '\n' + http302;

        var modifiedContent =  test.replace('{{{METHOD}}}',method.toUpperCase());
        modifiedContent =  modifiedContent.replace('{{{method}}}','delete' == method.toLowerCase() ? 'del' : method.toLowerCase());
        var path = '/v'+that.version + '/' + that.filetitle + '/';
        modifiedContent =  modifiedContent.replace('{{{path}}}',path);
        modifiedContent =  modifiedContent.replace('{{{path}}}',path);
        modifiedContent =  modifiedContent.replace('{{{role}}}',permission.role.toLowerCase());
        modifiedContent =  modifiedContent.replace('{{{role}}}',permission.role.toLowerCase());
        modifiedContent =  modifiedContent.replace('{{{appjs}}}',that.pathToAppJsFromFolder(that.testfolder));
        grunt.file.write(that.testfolder + '/' + method.toLowerCase()+'/'+permission.role.toLowerCase() + '/collection.js', modifiedContent);
    }

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