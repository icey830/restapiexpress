/**
 * Created by Samuel Schmid
 *
 * handles routing of RESTAPIEXPRESS for api description
 * for example http://localhost:3000/v1/
 *
 */

/**
 *
 * @type {ApiDescription}
 */
module.exports = ApiDescription;
var fs = require('fs');

/**
 * @class ApiDescription
 * @constructor
 */
function ApiDescription(apirouter) {
    this.apirouter = apirouter;
}

/**
 * get the versions of the rest api
 *
 * @param req
 * @param res
 */
ApiDescription.prototype.route = function(req, res) {

    var tmpPath = [];
    req.path.match(/(\/(\w+))/g).map(function (e) {
        tmpPath.push(e.substring(1));

    })

    var path = __dirname.substring(0,__dirname.length-"lib/routing/".length) + '/' +
        this.apirouter.API_FOLDER+'/' +
        tmpPath[0]+"/" +
        req.method+"/" +
        req.role +
        "/instance.json";

    fs.exists(path, function (exists) {
        if(exists) {
            var file = require(path);
            res.json(200, file);
        } else {
            res.status(302).json('{"error":"not authentificated}');
        }
    });
}