/**
 * Module dependencies.
 */

var express = require('express');
var http = require('http');
var path = require('path');
var apirouter = require('./lib/apirouter');
var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.bodyParser());
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());

// development only
if ('development' == app.get('env')) {
    app.use(express.errorHandler());
}

app.all('/', apirouter.apidescription);
app.all('*', apirouter.route);

http.createServer(app).listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port') + ' in ' +app.get('env') + ' mode');
});

module.exports = app;