/**
 * Created by Samuel Schmid on 27.04.14.
 *
 * handles user management
 *
 * login
 * logout
 * signup
 *
 * @type {Usermanagement}
 */
module.exports = Usermanagement;

var Resource = require('../resource/resource');
var Scope = require('../scope');
var Error = require('../error');
var Util = require('../util');
Usermanagement.DOC_FOLDER = "generated";

/**
 *
 * @constructor
 */
function Usermanagement() {

    this.config = require("./config.json");
    console.log(JSON.stringify(this.config));

}

/**
 * get the version out of the url
 * @param req
 * @returns {*}
 */
Usermanagement.prototype.getVersion = function(req) {
    var tmpPath = [];

    req.path.split("/").map(function (e) {
        tmpPath.push(e);

    })
    return tmpPath[1];
}

/**
 * gets the resource
 * @param req
 * @returns {*}
 */
Usermanagement.prototype.getResource = function(req) {
    var version = this.getVersion(req);
    //console.log(JSON.stringify(this.config[version]));

    var key = version + "Resource";
    console.log("KEY:" + key)

    if(!this.hasOwnProperty(key)) {
        console.log("load Resource new")
        var path = this.config[version].resource;
        var resource = new Resource();
        resource.initWithPath(path);

        this[key] = resource;
    } else {
        console.log("alread loaded");
    }

    console.log("content:" + this[key])
    return this[key];
}

/**
 * login to system
 *
 * @param req
 * @param res
 */
Usermanagement.prototype.login = function(req, res) {

    /**
     * error handler
     *
     * @param err
     */
    function loginFailed(err) {
        res.json(401, {"message" : "login failed", "error" : err});
    }

    //Check if request contains username and password
    if(req.body.username && req.body.password) {

        //load resource
        var resource = this.getResource(req);

        Util.getFileFromFileSystem(req.app.get("rootdir"),Usermanagement.DOC_FOLDER,resource.documentation, function(error, doc) {
            console.log("error?");
            if(error) {
                console.log("not undefined" + JSON.stringify(error));
                res.status(error.getCode()).send(error.getMessage());
                return;
            }

            resource.documentationJson = doc;

            var usernameScope = new Scope();
            usernameScope.initWithFieldOperatorAndValue("username","eq",req.body.username);
            resource.scope.push(usernameScope);

            var passwordScope = new Scope();
            passwordScope.initWithFieldOperatorAndValue("password","eq",req.body.password);
            resource.scope.push(passwordScope);

            resource.fields = "username, apitoken, role";

            //check username and password in resource
            var dbprovider = req.app.get("db").provider;


            dbprovider.find(resource, function(err, result) {
                if(err) {
                    console.log("error login");
                    loginFailed(err);

                } else {
                    console.log("success login");
                    if(result.length == 1) {

                        //Genereate new Session with Username
                        req.session.regenerate(function() {
                            console.log("new SESSIONID: " +req.session.id);
                            req.session.username = req.body.username;
                            req.session.user = result[0];
                            res.json(200, {"message" :  req.body.username + "logged in successfully"});
                        });
                    } else {
                        loginFailed("username or password does not match");
                    }

                }
            });
        });
    } else {
        loginFailed("not enough data to validate")
    }
}

/**
 * logout
 *
 * @param req
 * @param res
 */
Usermanagement.prototype.logout = function(req, res) {

    if(!req.session.username) {
        res.json(400, {"message" : "you cannot logout if you are not logged in"})
    } else {
        req.session.destroy();
        res.json(200, {"message" : "successfully logged out"});
    }
}

/**
 * sign up
 *
 * @param req
 * @param res
 */
Usermanagement.prototype.signup = function(req, res) {

    function signUpSuccess() {
        res.json(201, {"message" : "successfully signed up"});
    };
    function signUpFailed(err) {
        res.json(401, {"message" : "signed up failed", "error" : err});
    };
    if(req.body.username && req.body.password) {

        //load resource
        var resource = this.getResource(req);

        Util.getFileFromFileSystem(req.app.get("rootdir"),Usermanagement.DOC_FOLDER, resource.documentation, function(error, doc) {

            if(error) {
                res.status(error.getCode()).send(error.getMessage());
            }

            resource.documentationJson = doc;
            var usernameScope = new Scope();
            usernameScope.initWithFieldOperatorAndValue("username","eq",req.body.username);
            resource.scope.push(usernameScope);
            resource.fields = "username";

            //check username and password in resource
            var dbprovider = req.app.get("db").provider;

            dbprovider.find(resource, function(err, result) {
                if(err) {
                    signUpFailed(err);
                } else {
                    if(result.length === 0) {
                        //check username and password in resource
                        var documentation = resource.documentationJson;

                        dbprovider.createEntity(req.body, resource, function(err) {
                            console.log(err);
                            var links = {
                                "resource":documentation.title.toLowerCase(),
                                "error":err
                            };
                            res.status(400).json(links);
                        }, function(object) {

                            signUpSuccess();
                        })
                    } else {
                        console.log("result " + JSON.stringify(result));
                        signUpFailed("username already exists");
                    }
                }
            });
        });

    } else {
        signUpFailed("not enough data to validate")
    }
}
