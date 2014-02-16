var fs = require('fs');
var apirouter = {};

apirouter.route = function (req, res) {
    var tmpPath = [];
    var resource = {
        "type": undefined,
        "version": undefined,
        "pathResources": [],
        "ids": [],
        "path": undefined,
        "restlet": undefined,
        "method": req.method

    };

    req.params[0].match(/(\/(\w+))/g).map(function (e) {
        tmpPath.push(e.substring(1));

    })
    resource.version = tmpPath[0];
    tmpPath.splice(0, 1);
    tmpPath.map(function (e, index) {
        (index % 2 == 0) ? resource.pathResources.push(e) : resource.ids.push(e);
    });

    (tmpPath.length % 2 == 0) ? resource.type = 'instance' : resource.type = 'collection';
    resource.path = resource.pathResources.join('/') + '/';
    resource.restlet = resource.pathResources.join('/') + '/_' + req.method.toLowerCase() + '_' + resource.type + '_' + resource.version + '.js';

    var restlet = require('./' + resource.restlet);

    // load restlet documentation file

    // send 404 if no documentation

    // prove attribute constraints

    // load and execute restlet
    restlet.send(req, res, resource);
};

exports.route = function (req, res) {
    apirouter.route(req, res);

};

