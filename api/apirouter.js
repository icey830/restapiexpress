var fs = require('fs');
var apirouter = {};
var Resource = require('./resource');

apirouter.route = function (req, res) {
    
    var config = {
        "CORSAllowOrigin" : "*"
    };
    var resource = new Resource(req);
	
    var restlet = require('./' + resource.restlet);
    // TBD:: define CORS on a per restlet basis and how do we handle Access-Control-Allow-Method ?
    res.header('Access-Control-Allow-Origin', config.CORSAllowOrigin);

    // OPTIONS
    // TODO:: send  documentation for implemented verbs as json  we will not violate RFC2616 http://www.w3.org/Protocols/rfc2616/rfc2616-sec9.html
    //
    // @ssNamics this is a express problem
    // see https://github.com/visionmedia/express/pull/772/files
    // see https://groups.google.com/forum/#!topic/express-js/0oNFpyH51_k
    // OPTIONS

    // load restlet documentation file

    // send 404 if no documentation

    // prove attribute constraints

    // load and execute restlet

    // find implementations for documented verbs


    restlet.send(req, res, resource);
};

exports.route = function (req, res) {
    apirouter.route(req, res);

};

