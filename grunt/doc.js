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
    this.parseFilename(filename,grunt);
    this.readFile(grunt);
}

Doc.prototype.parseFilename = function(filename,grunt) {

    var that = this;

    filename.match(/_doc_(\w+)_v(\d+).json/).map(function(e, index){

        if (index === 1) {
            that.filetitle = e;
        } else if (index === 2) {
            that.version = e;
        }

    });
}

Doc.prototype.readFile = function(grunt) {

    this.json=grunt.file.readJSON(this.abspath);

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
    var that = this;

    this.supportedMethods.forEach(function(method) {
        that.json.permission.forEach(function(permission) {
            that.createAPIJsForMethod(permission,method,content);
            that.createAPIJTestsForMethod(permission,method,test);
        });

    });

}

Doc.prototype.createAPIJsForMethod = function(permission,method, content) {
    var links = [];
    var that = this;
    var grunt = this.grunt;

    if(permission.methods.contains(method.toUpperCase())) {

        var dynLink =
        {
            "type":"application/com.github.restapiexpress.api",
            "rel": "self",
            "method": method,
            "href": "http://localhost:3000/v"+that.version+"/"
        };

        links.push(dynLink);
    }

    permission.permanentLinks.forEach(function(permanentLink) {
        if(permanentLink.method === method.toUpperCase()) {
            links.push(permanentLink);

        }
    });


    var modifiedContent =  content.replace('{{{links}}}',JSON.stringify(links));
    grunt.file.write(that.folder + '/v'+that.version + '/' + method.toLowerCase()+'/'+permission.role.toLowerCase()+'/instance.json', modifiedContent);
}

Doc.prototype.createAPIJTestsForMethod = function(permission, method, content) {

    var that = this;
    var grunt = this.grunt;

    var modifiedContent =  content.replace('{{{METHOD}}}',method.toUpperCase());
    var modifiedContent =  modifiedContent.replace('{{{method}}}','delete' == method.toLowerCase() ? 'del' : method.toLowerCase());
    var modifiedContent =  modifiedContent.replace('{{{path}}}',"/");
    grunt.file.write(that.testfolder + '/v' + that.version + '/' + method.toLowerCase()+'/'+permission.role.toLowerCase() + '/instance.js', modifiedContent);
}

Doc.prototype.createJsForMethod = function(method) {
    var grunt = this.grunt;
    grunt.file.copy('./grunt/templates/instance.template', this.folder + '_'+method+'_instance_v' + this.version + '.js');
}

module.exports = Doc;