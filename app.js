/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var http = require('http');
var path = require('path');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
    app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('*', function (req, res) {

    var tmpPath = [];
    var ressource = {
        "type":undefined,
        "version":undefined,
        "pathRessources":[],
        "ids": [],
        "path": undefined
    };



    req.params[0].match(/(\/(\w+))/g).map(function (e) {
        tmpPath.push(e.substring(1));

    })
    ressource.version = tmpPath[0];
    tmpPath.splice(0,1);
    tmpPath.map(function(e,index){
        (index%2==0) ? ressource.pathRessources.push(e) : ressource.ids.push(e);
    });

    (tmpPath.length%2 == 0) ? ressource.type = 'instance' : ressource.type = 'collection';
    ressource.path = ressource.pathRessources.join('/') + '/_get_' + ressource.type + '_'  + ressource.version + '.js';

    res.send(ressource);
});

http.createServer(app).listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port'));
});
