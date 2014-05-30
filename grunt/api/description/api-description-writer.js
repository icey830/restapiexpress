/**
 * Created by samschmid on 28.03.14.
 */

/**
 * Uses api.template and creates version description for URL
 *
 * http://localhost:3000/v1/
 *
 * for given version (1 => v1) and for GET/HEAD/OPTIONS and POST
 *
 * @type {ApiDescriptionWriter}
 */
module.exports = ApiDescriptionWriter;

function ApiDescriptionWriter(grunt, rootdir) {
    this.grunt = grunt;
    this.rootdir = rootdir;
}

ApiDescriptionWriter.prototype.write = function(doc)  {

    var grunt = this.grunt;
    var content = grunt.file.read('./grunt/templates/api.template');

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

