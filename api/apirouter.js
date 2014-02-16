var fs= require('fs');

exports.get = function (req, res) {

    var tmpPath = [];
    var ressource = {
        "type":undefined,
        "version":undefined,
        "pathRessources":[],
        "ids": [],
        "path": undefined,
        "restlet": undefined

    };

    req.params[0].match(/(\/(\w+))/g).map(function (e) {
        tmpPath.push(e.substring(1));

    })
    ressource.version = tmpPath[0];
    tmpPath.splice(0,1);
    tmpPath.map(function(e,index){
        (index%2==0) ? ressource.pathRessources.push(e) : ressource.ids.push(e);
    });

    (tmpPath.length%2 == 0) ? ressource.type = 'instance' : ressource.type = 'collection';
    ressource.path = ressource.pathRessources.join('/') + '/';
    ressource.restlet = ressource.pathRessources.join('/') + '/_get_' + ressource.type + '_'  + ressource.version + '.js';

    // load restlet documentation file

    // prove attribute constraints

    // load and execute restlet
	var restlet = require('./' + ressource.restlet);
	restlet.send(req, res, ressource);
    
};