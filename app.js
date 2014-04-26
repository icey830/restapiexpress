/**
 * Module dependencies.
 */

var express = require('express');
var http = require('http');
var path = require('path');
var apirouter = require('./lib/apirouter');
var Database = require('./lib/database/database');
var MongoStore = require('connect-mongo')(express);
var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// development only
app.configure('development', function(){
    //app.set('db', db);
})
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.compress());
app.use(express.favicon());
app.use(express.json());
app.use(express.methodOverride());
app.use(express.urlencoded());
app.use(express.cookieParser("SEKR37"));
app.use(express.session({
    store: new MongoStore({
    url: 'mongodb://localhost:27017/restapiexpressSessions'
    }),
    secret: 'SEKR37',
    key: 'restapiexpress.sid',
    cookie:{ httpOnly: true, maxAge: 1500000 }
}));
// secure: true, if https is active
var database = new Database();
// development only
app.configure('development', function(){

    app.use(express.errorHandler());
})
// production only
app.configure('production', function(){

})
app.set('db', database);
app.set('rootdir', __dirname);
app.all('/', apirouter.versions);
app.all(/\/v\d+[\/\Z]?$/,apirouter.apidescription);
app.post(/\/v\d+\/login[\/\Z]?$/,apirouter.login);
app.post(/\/v\d+\/signup[\/\Z]?$/,apirouter.signup);
app.get(/\/doc\/v(\d+)\/(\w+)[\/\Z]?$/, apirouter.docs);
app.post(/\/doc\/v(\d+)\/(\w+)[\/\Z]?$/, apirouter.docs);
app.all('*', apirouter.route);

http.createServer(app).listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port') + ' in ' +app.get('env') + ' mode');
});

module.exports = app;

//TODO refactor for dependencies injection?
//http://stackoverflow.com/questions/10306185/nodejs-best-way-to-pass-common-variables-into-separate-modules