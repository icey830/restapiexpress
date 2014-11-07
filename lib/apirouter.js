/**
 * Created by Samuel Schmid on 10.03.14.
 *
 * handles routing of RESTAPIEXPRESS
 *
 * @type {{}}
 */
var apirouter = {};

var Usermanagement = require('./usermanagement/usermanagement');
var VersionRouter = require('./routing/version-router.js');
var DocumentationRouter = require('./routing/documentation-router.js');
var ApiDescriptionRouter = require('./routing/apidescription-router.js');
var ResourceRouter = require('./routing/resource-router.js');

apirouter.API_FOLDER = "api"
apirouter.DOC_FOLDER = "generated";
apirouter.usermanagement = new Usermanagement();
apirouter.rootdir =  __dirname.substring(0,__dirname.length-4);
apirouter.versionRouter = new VersionRouter(apirouter);
apirouter.documentationRouter = new DocumentationRouter(apirouter);
apirouter.apidescriptionRouter = new ApiDescriptionRouter(apirouter);
apirouter.resourceRouter = new ResourceRouter(apirouter);

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

/**
 * handles login request
 *
 * for example http://localhost:3000/v1/login
 *
 * @param req
 * @param res
 */
exports.login = function (req, res) {

    apirouter.session(req);
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

    apirouter.session(req);
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

    apirouter.session(req);
    apirouter.usermanagement.signup(req, res);

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

/**
 * handles api description requests
 *
 * for example http://localhost:3000/v1/
 *
 * @param req
 * @param res
 */
exports.apidescription = function (req, res) {
    apirouter.apidescription(req, res);

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

//Private
apirouter.session = function(req) {
    //console.log("SESSIONID: " +req.session.id);
    if(req.session.username) {
        console.log("user: " +req.session.username);
    }
    this.setRole(req);
}

apirouter.setRole = function(req) {
    var role = this.getRoleFromSession(req);
    if ('development' == req.app.get('env')) {
        if(req.header("DEV-ROLE") !== undefined) {
            role = req.header("DEV-ROLE");
        }
    }
    req.role = role;
}

apirouter.getRoleFromSession = function(req) {
    if(req.session.user) {
        console.log(JSON.stringify(req.session));
        console.log("user role: " + req.session.user.role);
        return req.session.user.role;
    } else {
        console.log("not logged in");
        //TODO use ENUM
        return "public";
    }
}

apirouter.versions = function(req, res) {
    this.session(req);
    this.versionRouter.route(req, res);

};

apirouter.docs = function(req, res) {
    this.session(req);

    this.documentationRouter.route(req, res);
};

apirouter.apidescription = function(req, res) {
    this.session(req);
    this.apidescriptionRouter.route(req, res);

};

apirouter.route = function (req, res) {
    this.session(req, res);
    this.resourceRouter.route(req, res);

};





