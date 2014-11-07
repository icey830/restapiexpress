/**
 * Created by Samuel Schmid
 *
 * handles routing of RESTAPIEXPRESS for versions
 *
 */

/**
 *
 * @type {Versions}
 */
module.exports = Versions;

/**
 * @class Error
 * @constructor
 */
function Versions(apirouter) {
    this.apirouter = apirouter;
}

/**
 * get the versions of the rest api
 *
 * @param req
 * @param res
 */
Versions.prototype.getVersions = function(req, res) {

    var apidoc = require("./../../"+this.apirouter.API_FOLDER+"/versions.json");
    res.json(200, apidoc);
}