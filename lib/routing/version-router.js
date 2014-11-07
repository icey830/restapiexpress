/**
 * Created by Samuel Schmid
 *
 * handles routing of RESTAPIEXPRESS for versions
 * for example http://localhost:3000/
 *
 */

/**
 *
 * @type {VersionRouter}
 */
module.exports = VersionRouter;

/**
 * @class VersionRouter
 * @constructor
 */
function VersionRouter(apirouter) {
    this.apirouter = apirouter;
}

/**
 * route the request and send the available versions as response back to the caller
 *
 * @param req
 * @param res
 */
VersionRouter.prototype.route = function(req, res) {

    var apidoc = require("./../../"+this.apirouter.API_FOLDER+"/versions.json");
    res.json(200, apidoc);
}