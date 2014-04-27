/**
 * Created by samschmid on 27.04.14.
 */
var Resource = require('../resource');
var Scope = require('../scope');
var fs = require('fs');

Usermanagement.DOC_FOLDER = "generated";

function Usermanagement() {

    this.config = require("./config.json");
    console.log(JSON.stringify(this.config));
}

Usermanagement.prototype.getVersion = function(req) {
    var tmpPath = [];

    req.path.split("/").map(function (e) {
        tmpPath.push(e);

    })
    return tmpPath[1];
}

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

Usermanagement.prototype.login = function(req, res) {
    function loginFailed(err) {
        res.json(401, {"message" : "login failed", "error" : err});
    }
    if(req.body.username && req.body.password) {

        //load resource
        var resource = this.getResource(req);
        var docLoaded = function(doc) {

            resource.documentationJson = doc;
            var usernameScope = new Scope();
            usernameScope.initWithFieldOperatorAndValue("username","eq",req.body.username);
            resource.scope.push(usernameScope);

            var passwordScope = new Scope();
            passwordScope.initWithFieldOperatorAndValue("password","eq",req.body.password);
            resource.scope.push(passwordScope);

            resource.fields = "username";
            //check username and password in resource
            var dbprovider = req.app.get("db").provider;

            var callback = function(err, result) {
                if(err) {
                    loginFailed(err);

                } else {
                    if(result.length == 1) {
                        req.session.regenerate(function() {
                            console.log("new SESSIONID: " +req.session.id);
                            req.session.username = req.body.username;

                            res.json(200, {"message" :  req.body.username + " logged successfully", "API-TOKEN" : "TOKEN"});
                        });
                    } else {
                        loginFailed("username or password does not match");
                    }

                }
            };
            dbprovider.find(resource, callback);

        }
        this.getFileFromFileSystem(req.app.get("rootdir"),resource.documentation,Usermanagement.DOC_FOLDER, res, docLoaded);


    } else {
        loginFailed("not enough data to validate")
    }
}

Usermanagement.prototype.logout = function(req, res) {

    if(!req.session.username) {
        res.json(400, {"message" : "you cannot logout if you are not logged in"})
    } else {
        req.session.destroy();
        res.json(200, {"message" : "successfully logged out"});
    }
}

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
        var docLoaded = function(doc) {

            resource.documentationJson = doc;
            var usernameScope = new Scope();
            usernameScope.initWithFieldOperatorAndValue("username","eq",req.body.username);
            resource.scope.push(usernameScope);
            resource.fields = "username";
            //check username and password in resource
            var dbprovider = req.app.get("db").provider;

            var callback = function(err, result) {
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
            };
            dbprovider.find(resource, callback);



        }
        this.getFileFromFileSystem(req.app.get("rootdir"),resource.documentation,Usermanagement.DOC_FOLDER, res, docLoaded);


    } else {
        signUpFailed("not enough data to validate")
    }
}


module.exports = Usermanagement;

Usermanagement.prototype.getFileFromFileSystem = function (rootdir, filePath, subfolder, res, callback) {
    if(filePath == undefined) {
        // send 404 if no documentation
        res.status(404).send('Not found');
    } else {
        var path = rootdir + '/'+subfolder+'/'+ filePath;
        console.log("filepath:"+filePath);
        console.log("searchpath" + path);
        fs.exists(path, function (exists) {
            if(exists) {
                // load restlet documentation file
                var file = require(path);

                if (file != undefined) {
                    callback(file);

                } else {
                    // send 500 if  documentation file corrupt
                    res.status(500).send('documentation file corrupt');
                }
            } else {
                // send 404 if no documentation file on server
                console.log("doc not found");
                res.status(404).send('Not found no file');
            }
        });

    }

}