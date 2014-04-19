/**
 * Created by samschmid on 22.03.14.
 */

//This file can be called either from App or from Grunt!
function Database(grunt) {

    if(grunt) {

        //IF CALLED FROM GRUNT IS ALWAYS IN TEST MODE!
        process.env.NODE_ENV = "test";
        this.config = grunt.file.readJSON('./config.json')
        var Provider = require("./providers/"+this.config.db.provider + "/" + this.config.db.provider + "-provider.js");
        this.provider = new Provider(this.config.db);
        grunt.log.write("connect db");
        this.connect();

        Database.prototype.clear = function(asyncProcess) {
            this.provider.clear(asyncProcess);
        }
    } else {
        this.config = "empty";
        var fs = require('fs');
        var file =  './config.json';
        var that = this;

        console.log("file read");

        fs.readFile(file, 'utf8', function (err, data) {
            if (err) {
                console.log('Error: ' + err);
                return;
            }

            data = JSON.parse(data);

            that.config = data;

            var Provider = require("./providers/"+that.config.db.provider + "/" + that.config.db.provider + "-provider.js");
            that.provider = new Provider(that.config.db);
            console.log("connect db");
            that.connect();

        });

    }


}

Database.prototype.connect = function() {
    this.provider.connect();

}


module.exports = Database;