/**
 * Created by Samuel Schmid on 28.03.14.
 *
 * Uses api.template and creates version description for URL
 *
 * http://localhost:3000/v1/
 *
 * for given version (1 => v1) and for GET/HEAD/OPTIONS
 *
 * @type {ApiDescriptionWriter}
 */
module.exports = ApiDescriptionWriter;

function ApiDescriptionWriter(grunt, rootdir) {
    this.grunt = grunt;
    this.rootdir = rootdir;
}

if (typeof String.prototype.endsWith != 'function') {
    // see below for better implementation!
    String.prototype.endsWith = function (str){
        return this.indexOf(str) == this.length - str.length;
    };
}

ApiDescriptionWriter.prototype.setDocuments = function (docs) {
    this.docs = docs;
};

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

function writeServiceMap(resources, method, baseUrl, serviceMap) {
    resources.forEach(function (resourceDoc) {

        if(!resourceDoc.json.type.endsWith(".abstract") && !resourceDoc.json.type.endsWith(".apidescription") ) {
            //TODO get a rel from api.json for the method
            var newLink = {
                "type": resourceDoc.json.type,
                "rel": resourceDoc.json.title,
                "method": method,
                "href": baseUrl + resourceDoc.json.title.toLowerCase()
            };

            serviceMap[resourceDoc.json.title] = newLink;
        }

    })
}

ApiDescriptionWriter.prototype.writeJSON = function(doc,permission,method, content) {
    var links = [];
    var servicemap = {};

    var grunt = this.grunt;
    var baseUrl = "";
    var isAllowed = false;
    if(permission.methods.contains(method.toUpperCase())) {

        baseUrl = "http://localhost:3000/v" + doc.version + "/";
        var dynLink =
        {
            "type":"application/com.github.restapiexpress.api",
            "rel": "self",
            "method": method,
            "href": baseUrl
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

        var resources = this.docs.getResourcesDocForRole(permission.role)
        writeServiceMap(resources, method, baseUrl, servicemap);
        var modifiedContent =  content.replace('{{{links}}}',JSON.stringify(links));
        modifiedContent =  modifiedContent.replace('{{{servicelinks}}}',JSON.stringify(servicemap));
        grunt.file.write(doc.folder + '/' + method.toLowerCase()+'/'+permission.role.toLowerCase()+'/instance.json', modifiedContent);
    }

}

