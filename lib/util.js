/** @author
 * Samuel Schmid <samuelschmid75@gmail.com>
 *
 * @module Util
 * @desc
 * provides helper functions
 *
 * @example http://localhost:3000/v1/news/123.json?scope=[“price”,“lt”,9],[“minStock”,“gte”,5]
 *
 */

/**
 *
 * @type {Util}
 */
module.exports = Util;

var fs = require('fs');
var Error = require('./error');
/**
 * @class Util
 * @constructor
 */
function Util() {
}

/**
 * loads a file from file system
 *
 * @param rootdir
 * @param subfolder
 * @param filePath
 * @param callback (error, file)
 */
Util.getFileFromFileSystem = function (rootdir, subfolder, filePath, callback) {
    var error = undefined;
    var file = undefined;
    if(filePath == undefined) {
        // send 404 if no documentation
        error = new Error(404, "file path undfined");
        console.log(error.getMessage());
        callback(error, file);
    } else {
        var path = rootdir + '/'+subfolder+'/'+ filePath;
        //console.log("filepath:"+filePath);
        //console.log("searchpath" + path);
        fs.exists(path, function (exists) {
            if(exists) {
                // load restlet documentation file
                file = require(path);
                if (file == undefined) {
                    // send 500 if  documentation file corrupt
                    console.log("error");
                    error = new Error(500, "file could not be read, maybe it is corrpt");
                    console.log(error.getMessage());
                }
                callback(error, file);
            } else {
                // send 404 if no documentation file on server
                console.log("doc not found");
                var error = new Error(404, "file not found");
                console.log(error.getMessage());
                callback(error, file);
            }
        });

    }

}