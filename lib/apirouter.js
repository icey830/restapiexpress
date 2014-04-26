var apirouter = {};
var Resource = require('./resource');
var config = require('./config.js');
var fs = require('fs');

apirouter.API_FOLDER = "api"
apirouter.DOC_FOLDER = "generated";

apirouter.session = function(req, res) {
    console.log("SESSIONID: " +req.session.id);
}
apirouter.versions = function(req, res) {

    this.session(req, res);
    var role = "public";
    if ('development' == req.app.get('env')) {
        if(req.header("DEV-ROLE") !== undefined) {
            role = req.header("DEV-ROLE");
        }
    }
    req.role = role;
    var apidoc = require("./../"+apirouter.API_FOLDER+"/versions.json");
    res.json(200, apidoc);
};

exports.versions = function (req, res) {

    apirouter.versions(req, res);

};

apirouter.docs = function(req, res) {
    this.session(req, res);
    var role = "public";
    if ('development' == req.app.get('env')) {
        if(req.header("DEV-ROLE") !== undefined) {
            role = req.header("DEV-ROLE");
        }
    }

    var tmpPath = [];
    req.path.match(/\/doc\/v(\d+)\/(\w+)[\/\Z]?$/).map(function (e) {
        tmpPath.push(e);

    })

    var path = __dirname.substring(0,__dirname.length-4) + '/'+apirouter.DOC_FOLDER+'/v'+tmpPath[1]+"/"+tmpPath[2]+"/"+tmpPath[2]+".json";
    console.log("docpath" + path);
    fs.exists(path, function (exists) {
        if(exists) {
            var file = require(path);
            res.json(200, file);
        } else {
            res.status(404).json('{"error":"file does not exists.}');
        }
    });
};

exports.docs = function (req, res) {
    apirouter.docs(req, res);

};

apirouter.apidescription = function(req, res) {
    this.session(req, res);
    var role = "public";
    if ('development' == req.app.get('env')) {
        if(req.header("DEV-ROLE") !== undefined) {
            role = req.header("DEV-ROLE");
        }
    }

    var tmpPath = [];
    req.path.match(/(\/(\w+))/g).map(function (e) {
        tmpPath.push(e.substring(1));

    })

    var path = __dirname.substring(0,__dirname.length-4) + '/'+apirouter.API_FOLDER+'/'+ tmpPath[0]+"/"+req.method+"/"+role+"/instance.json";

    fs.exists(path, function (exists) {
        if(exists) {
            var file = require(path);
            res.json(200, file);
        } else {
            res.status(302).json('{"error":"not authentificated}');
        }
    });

};

exports.apidescription = function (req, res) {
    apirouter.apidescription(req, res);

};

apirouter.route = function (req, res) {
    this.session(req, res);
    var role = "public";
    if ('development' == req.app.get('env')) {
        if(req.header("DEV-ROLE") !== undefined) {
            role = req.header("DEV-ROLE");
        }
    }

    var resource = new Resource(req, role);

    var docLoaded = function(doc) {

        resource.documentationJson = doc;
        // TBD:: define CORS on a per restlet basis and how do we handle Access-Control-Allow-Method ?
        res.header('Access-Control-Allow-Origin', config.CORSAllowOrigin);

        var _method = req.method;
        var isAllowed = false;
        if(resource.documentationJson.permission) {
            resource.documentationJson.permission.forEach(function(permission) {
                if(permission.role.toLowerCase() === role.toLowerCase()) {
                    permission.methods.forEach(function(method) {
                        if(method === _method) isAllowed = true;

                    });
                }
            });
        } else {
            res.status(302).json('{"error":"not authentificated}');
        }
        if(!isAllowed) {
            res.status(302).json('{"error":"not authentificated}');
        }


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

        var sendRestlet = function(restlet) {

            //console.log("Doc:");
            //console.log(util.inspect(doc,false,null));

            // TODO prove attribute constraints

            // load and execute restlet

            // TODO find implementations for documented verbs

            restlet.send(req, res, resource);

        };
        apirouter.getFileFromFileSystem(resource.restlet, apirouter.API_FOLDER,res, sendRestlet);
    }
    apirouter.getFileFromFileSystem(resource.documentation,apirouter.DOC_FOLDER, res, docLoaded);

};
apirouter.getFileFromFileSystem = function (filePath, subfolder, res, callback) {
    if(filePath == undefined) {
        // send 404 if no documentation
        res.status(404).send('Not found');
    } else {
        var path = __dirname.substring(0,__dirname.length-4) + '/'+subfolder+'/'+ filePath;
        //console.log("searchpath" + path);
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



