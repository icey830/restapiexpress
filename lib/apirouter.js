var fs = require('fs');
var apirouter = {};
var Resource = require('./resource');
var config = require('./config.js');
var util = require('util');
var fs = require('fs');

apirouter.apidescription = function(req, res) {
    var apidoc = require("./../api/v1/"+req.method+"/public/instance.json");
    res.json(200, apidoc);
};

exports.apidescription = function (req, res) {
    apirouter.apidescription(req, res);

};

apirouter.route = function (req, res) {

    var resource = new Resource(req, "public");

    var loadRestlet = function(restlet) {

        // TBD:: define CORS on a per restlet basis and how do we handle Access-Control-Allow-Method ?
        res.header('Access-Control-Allow-Origin', config.CORSAllowOrigin);

        // OPTIONS
        // TODO:: send  documentation for implemented verbs as json  we will not violate RFC2616 http://www.w3.org/Protocols/rfc2616/rfc2616-sec9.html
        //
        // @ssNamics this is a express problem
        // see https://github.com/visionmedia/express/pull/772/files
        // see https://groups.google.com/forum/#!topic/express-js/0oNFpyH51_k
        // OPTIONS

        //@veith
        //note that require only reads the file once, following calls return the result from cache

        //console.log(util.inspect(resource,false,null));

        var sendRestlet = function(doc) {

            //console.log("Doc:");
            //console.log(util.inspect(doc,false,null));

            // TODO prove attribute constraints

            // load and execute restlet

            // TODO find implementations for documented verbs

            restlet.send(req, res, resource);

        };
        apirouter.getFileFromFileSystem(resource.documentation,'apidoc', res, sendRestlet);
    }
    apirouter.getFileFromFileSystem(resource.restlet, 'api',res, loadRestlet);
};
apirouter.getFileFromFileSystem = function (filePath, subfolder, res, callback) {
    if(filePath == undefined) {
        // send 404 if no documentation
        res.status(404).send('Not found');
    } else {
        var path = __dirname.substring(0,__dirname.length-4) + '/'+subfolder+'/'+ filePath;
        console.log("searchpath" + path);
        fs.exists(path, function (exists) {
            if(exists) {
                // load restlet documentation file
                var file = require(path);

                if (file != undefined) {
                    callback(file);

                } else {
                    // send 500 if  documentation file corrupt
                    res.status(500).send('documentation file corrupt');
                }
            } else {
                // send 404 if no documentation file on server
                res.status(404).send('Not found no file');
            }
        });

    }

}


exports.route = function (req, res) {
    apirouter.route(req, res);

};



