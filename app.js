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
Mongoose.connect('localhost', 'ejassets');

/**********************************************
 * Passport for Secure Login
 **********************************************/

var passport = require('passport');

/**********************************************
 * Mailchimp API
 **********************************************/

var MailChimpAPI = require('mailchimp').MailChimpAPI;
var MailChimpExportAPI = require('mailchimp').MailChimpExportAPI;


/**********************************************
 * GraphicsMagick
 **********************************************/

////////////////////////////////////////////////

app = express();

/**********************************************
 * API Keys
 **********************************************/

var mc_key = '99a8d61ae5dc0f904a72ec1899c41f6d-us4';
var ben_id = '529e29eaeb89975e52000007';

/**********************************************
 * Instantiate Mailchimp API Objects
 **********************************************/
/*
try {
  var mcApi = new MailChimpAPI(mc_key, { version : '2.0' });
  console.log('Mailchimp API Successfully instantiated');
} catch (error) {
  console.log(error.message);
}

try {
  var exportApi = new MailChimpExportAPI(mc_key, { version : '1.0', secure : false });
  console.log('Mailchimp Export Api Successfully Instantiated');
} catch (error) {
  console.log(error.message);
}
*/

/**********************************************
 * Initiialize our environments
 **********************************************/

//app.set('port', process.env.PORT || 8080);
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

var ports = [8080];

for(var i = 0; i < ports.length; i++) {
  http.createServer(app).listen(ports[i]);
  console.log("Express now listening on port " + ports[i]);
}
