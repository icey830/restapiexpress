/**
 * Created by samschmid on 22.03.14.
 */

function Database() {
    this.config = "empty";
    var fs = require('fs');
    var file =  './config.json';
    var that = this;

    fs.readFile(file, 'utf8', function (err, data) {
        if (err) {
            console.log('Error: ' + err);
            return;
        }

        data = JSON.parse(data);

        that.config = data;

        var Provider = require("./providers/"+that.config.db.provider + "/" + that.config.db.provider + "-provider.js");
        that.provider = new Provider(that.config.db);
        that.connect();

    });

}

Database.prototype.connect = function() {
    this.provider.connect();

}
module.exports = Database;