/**
 * Created by samschmid on 28.03.14.
 */

function ApiDescriptionWriter(grunt, rootdir) {
    this.grunt = grunt;
    this.rootdir = rootdir;
}

ApiDescriptionWriter.prototype.write = function(doc)  {

    var grunt = this.grunt;
    var content = grunt.file.read('./grunt/templates/api.template');
    var test = grunt.file.read('./grunt/templates/test.template');
    var http200 = grunt.file.read('./grunt/templates/tests/http200.template');
    test = test + '\n' + http200;
    var self = this;
    doc.supportedMethods.forEach(function(method) {
        doc.json.permission.forEach(function(permission) {
            self.writeJSON(doc,permission,method,content);
        });

    });

}

ApiDescriptionWriter.prototype.writeJSON = function(doc,permission,method, content) {
    var links = [];

    var grunt = this.grunt;
    var isAllowed = false;
    if(permission.methods.contains(method.toUpperCase())) {

        var dynLink =
        {
            "type":"application/com.github.restapiexpress.api",
            "rel": "self",
            "method": method,
            "href": "http://localhost:3000/v" + doc.version + "/"
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
        grunt.file.write(doc.folder + '/' + method.toLowerCase()+'/'+permission.role.toLowerCase()+'/instance.json', modifiedContent);
    }

}


module.exports = ApiDescriptionWriter;