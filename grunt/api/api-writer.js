/**
 * Created by samschmid on 28.03.14.
 */
var ApiDescriptionWriter = require('./description/api-description-writer.js');
var ApiRouteWriter = require('./route/api-route-writer.js');

function ApiWriter(grunt, rootdir) {
    this.grunt = grunt;
    this.rootdir = rootdir;
    this.apidescwriter = new ApiDescriptionWriter(grunt, rootdir);
    this.apiRouteWriter = new ApiRouteWriter(grunt, rootdir);
}

ApiWriter.prototype.write = function(docs)  {

    var grunt = this.grunt;
    grunt.log.debug("start ");
    for(var i=0;i<docs.docs.length;i++) {
        var doc = docs.docs[i];

        grunt.log.debug(doc.json.type);
        if(doc.json.type.endsWith('.apidescription')) {

            this.apidescwriter.write(doc);

        } else if(doc.json.type.endsWith('.abstract')) {

            //TODO dont write Route
        } else {

            grunt.log.debug("start createing doc");
            this.apiRouteWriter.write(doc);

        }

    }
    grunt.log.debug("ver ");
    this.writeVersions(docs)
}

ApiWriter.prototype.writeVersions = function(docs)  {

    var versionArray = [];
    docs.versions.forEach(function(version) {
        var selfref =
        {
            "type":"application/com.github.restapiexpress.api",
            "rel": "Version " + version,
            "method": "GET",
            "href": "http://localhost:3000/v"+version+"/"
        };
        versionArray.push(selfref);
    });

    var versionJson = {"versions" : versionArray};

    this.grunt.file.write(this.rootdir + '/api/versions.json', JSON.stringify(versionJson));

}


module.exports = ApiWriter;