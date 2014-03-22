/**
 * Created by samschmid on 22.03.14.
 */

function Database() {
    this.config = "empty";
    var fs = require('fs');
    var file = __dirname.substring(0,__dirname.length-4) + '/config.json';
    var that = this;

    fs.readFile(file, 'utf8', function (err, data) {
        if (err) {
            console.log('Error: ' + err);
            return;
        }

        data = JSON.parse(data);

        that.config = data;
    });

}

module.exports = Database;