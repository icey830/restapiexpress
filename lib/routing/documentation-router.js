/**
 * Created by Samuel Schmid
 *
 * handles routing of RESTAPIEXPRESS for documentation
 * for example http://localhost:3000/v1/doc/news/news.json
 *
 */

/**
 *
 * @type {DocumentationRouter}
 */
module.exports = DocumentationRouter;
var fs = require('fs');

/**
 * @class DocumentationRouter
 * @constructor
 */
function DocumentationRouter(apirouter) {
    this.apirouter = apirouter;
}

/**
 * route the documentation of the requested resource and send response back to the caller
 *
 * @param req
 * @param res
 */
DocumentationRouter.prototype.route = function(req, res) {

    var tmpPath = [];
    req.path.match(/\/doc\/v(\d+)\/(\w+)[\/\Z]?$/).map(function (e) {
        tmpPath.push(e);

    })

    var path = __dirname.substring(0,__dirname.length-"lib/routing/".length) + '/'+
        this.apirouter.DOC_FOLDER +
        '/v' +
        tmpPath[1]+"/" +
        tmpPath[2]+"/" +
        tmpPath[2]+".json";

    console.log("docpath" + path);
    fs.exists(path, function (exists) {
        if(exists) {
            var file = require(path);
            res.json(200, file);
        } else {
            res.status(404).json('{"error":"file does not exists.}');
        }
    });
}