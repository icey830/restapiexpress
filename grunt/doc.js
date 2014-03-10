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
    this.folder = abspath.substring(0,abspath.length - filename.length);
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


    var links = JSON.stringify(this.json.permission[0].permanentLinks);
    var content = grunt.file.read('./grunt/templates/api.template');
    content =  content.replace('{{{links}}}',links);
    grunt.file.write(this.folder + 'api_get_v' + this.version + '.json', content);
}

Doc.prototype.createJsForMethod = function(method) {
    var grunt = this.grunt;
    grunt.file.copy('./grunt/templates/instance.template', this.folder + '_'+method+'_instance_v' + this.version + '.js');
}

module.exports = Doc;