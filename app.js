/**
 * Node Js App initializer
 */
var express = require('express');

//Express Middleware
var compression = require('compression');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var favicon = require('serve-favicon');
var methodOverride = require('method-override');
var session = require('express-session');
var errorHandler = require('errorhandler');

var http = require('http');
var path = require('path');
var apirouter = require('./lib/apirouter');
var Database = require('./lib/database/database');
var MongoStore = require('connect-mongo')(session);
var posix = require('posix');
posix.setrlimit('nofile', { soft: 10000 });
var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('json spaces', 2);
var allowCrossDomain = function(req, res, next) {
    //res.header('Access-Control-Allow-Origin', config.allowedDomains);
    res.header('Access-Control-Allow-Origin', "http://club.app");
    res.header('Access-Control-Allow-Credentials', "true")
    res.header('Access-Control-Allow-Methods', '*');
    res.header('Access-Control-Allow-Headers', 'Content-Type');

    next();
}


app.use(logger('dev'));
app.use(compression());
//app.use(favicon());
app.use(bodyParser.json());
app.use(methodOverride());
app.use(allowCrossDomain);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser("SEKR37"));
app.use(session({
    store: new MongoStore({
    url: 'mongodb://localhost:27017/restapiexpressSessions'
    }),
    secret: 'SEKR37',
    key: 'restapiexpress.sid',
    cookie:{ httpOnly: true, maxAge: 1500000 },
    resave: true,
    saveUninitialized: true
}));

// secure: true, if https is active
var database = new Database();


// development only
if ('development' == app.get('env')) {
    app.use(errorHandler());
    //app.set('db', db);
}
// production only
if ('production' == app.get('env')) {

}



//RestAPIExpress specific routes
app.set('db', database);
app.set('rootdir', __dirname);
app.all('/', apirouter.versions);
app.all(/\/v\d+[\/\Z]?$/,apirouter.apidescription);
app.post(/\/v\d+\/login[\/\Z]?$/,apirouter.login);
app.post(/\/v\d+\/logout[\/\Z]?$/,apirouter.logout);
app.post(/\/v\d+\/signup[\/\Z]?$/,apirouter.signup);
app.get(/\/doc\/v(\d+)\/(\w+)[\/\Z]?$/, apirouter.docs);
app.post(/\/doc\/v(\d+)\/(\w+)[\/\Z]?$/, apirouter.docs);
app.all('*', apirouter.route);

app.listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port') + ' in ' +app.get('env') + ' mode');
});

module.exports = app;

//TODO refactor for dependencies injection?
//http://stackoverflow.com/questions/10306185/nodejs-best-way-to-pass-common-variables-into-separate-modules