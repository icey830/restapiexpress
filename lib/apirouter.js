/**
 * Created by Samuel Schmid on 10.03.14.
 *
 * handles routing of RESTAPIEXPRESS
 *
 * @type {{}}
 */
var apirouter = {};
var Resource = require('./resource');
var Usermanagement = require('./usermanagement/usermanagement');
var config = require('./config.js');
var fs = require('fs');
var Error = require('./error');
var Util = require('./util');

/*function ApiRouter() {

    ApiRouter.prototype.bind(this);
};*/

apirouter.API_FOLDER = "api"
apirouter.DOC_FOLDER = "generated";
apirouter.usermanagement = new Usermanagement();
apirouter.rootdir =  __dirname.substring(0,__dirname.length-4);

apirouter.session = function(req, res) {
    //console.log("SESSIONID: " +req.session.id);
    if(req.session.username) {
        //console.log("user: " +req.session.username);
    }
}

/**
 * handles login request
 *
 * for example http://localhost:3000/v1/login
 *
 * @param req
 * @param res
 */
exports.login = function (req, res) {

    apirouter.session(req, res);
    apirouter.usermanagement.login(req, res);

};

/**
 * handles logout request
 *
 * for example http://localhost:3000/v1/logout
 *
 * @param req
 * @param res
 */
exports.logout = function (req, res) {

    apirouter.session(req, res);
    apirouter.usermanagement.logout(req, res);

};

/**
 * handles signup request
 *
 * for example http://localhost:3000/v1/signup
 *
 * @param req
 * @param res
 */
exports.signup = function (req, res) {

    apirouter.session(req, res);
    apirouter.usermanagement.signup(req, res);

};

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

/**
 * handles versions request
 *
 * for example http://localhost:3000/
 *
 * @param req
 * @param res
 */
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

/**
 * handles documentation request
 *
 * for example http://localhost:3000/v1/doc/news/news.json
 *
 * @param req
 * @param res
 */
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

    var resource = new Resource();
    resource.initWithRequestAndRole(req,role);
    //console.log("load doc");
    function evaluatePermissions(error, doc) {
        if(error) {
            console.log("error" + JSON.stringify(error));
            res.status(error.getCode()).send(error.getMessage());
            return;
        }
        resource.documentationJson = doc;

        // TBD:: define CORS on a per restlet basis and how do we handle Access-Control-Allow-Method ?
        res.header('Access-Control-Allow-Origin', config.CORSAllowOrigin);

        var _method = req.method;
        var isAllowed = false;
        //console.log("doc loaded");
        //console.log("permission: " + JSON.stringify(resource.documentationJson.permission));
        if(role == "test") {
            isAllowed = true;
        } else {
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

        }
        if(isAllowed === false) {
            res.status(302).json('{"error":"not authentificated}');
            return;
        }
        //console.log("is allowed" + isAllowed);

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

        function sendResponse(error, restlet) {
            if(error) {
                console.log("error" + JSON.stringify(error));
                res.status(error.getCode()).send(error.getMessage());
                return;
            }
            //console.log("Doc:");
            //console.log(util.inspect(doc,false,null));

            // TODO prove attribute constraints

            // load and execute restlet

            // TODO find implementations for documented verbs

            restlet.send(req, res, resource);

        };
        Util.getFileFromFileSystem(apirouter.rootdir, apirouter.API_FOLDER, resource.restlet, sendResponse);
    }
    Util.getFileFromFileSystem(apirouter.rootdir, apirouter.DOC_FOLDER, resource.documentation, evaluatePermissions);

};

/**
 * handles routing request
 *
 * for example http://localhost:3000/v1/news/news.json
 *
 * @param req
 * @param res
 */
exports.route = function (req, res) {
    apirouter.route(req, res);

};



