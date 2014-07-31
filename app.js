/**********************************************
 * Helper Tools and Express
 **********************************************/

var express = require('express');
var http = require('http');
var path = require('path');
var request = require('request');

/**********************************************
 * Connect to Database
 **********************************************/

var Mongoose = require('mongoose');
Mongoose.connect('localhost', 'elevenjames');

/**********************************************
 * Passport for Secure Login
 **********************************************/

var passport = require('passport');

/**********************************************
 * GraphicsMagick
 **********************************************/

////////////////////////////////////////////////

app = express();

/**********************************************
 * Initiialize our environments
 **********************************************/

app.set('views', path.join(__dirname, 'views'));
app.set('config', path.join(__dirname, 'config'));
app.set('view engine', 'jade');

app.use(express.favicon(path.join(__dirname, '/public/images/favicon.ico')));
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(express.cookieParser());
app.use(express.bodyParser({uploadDir:'./temp'}));
app.use(express.session({ secret: 'fortheswarm' }));
app.use(passport.initialize());
app.use(passport.session());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

/**********************************************
 * Configure passport
 **********************************************/

require('./config/passport')(passport);

/**********************************************
 * Define Routes
 **********************************************/

require('./routes/index') (passport);

/**********************************************
 * Development Only
 **********************************************/

if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

/**********************************************
 * Start Server
 **********************************************/

var ports = [8081];

for(var i = 0; i < ports.length; i++) {
  http.createServer(app).listen(ports[i]);
  console.log("Express now listening on port " + ports[i]);
}
