
/**
 * Module dependencies.
 */

var express = require('express');
var http = require('http');
var path = require('path');
var Mongoose = require('mongoose');
var passport = require('passport');
var mcapi = require('./node_modules/mailchimp-api/mailchimp');
var MailChimpAPI = require('mailchimp').MailChimpAPI;
var MailChimpExportAPI = require('mailchimp').MailChimpExportAPI;

Mongoose.connect('localhost', 'ejassets');

var app = express();

var apikey = '99a8d61ae5dc0f904a72ec1899c41f6d-us4'
mc = new mcapi.Mailchimp(apikey);

/**********************************************
 * Instantiate Mailchimp API Object
 **********************************************/

try {
  var api = new MailChimpAPI(apikey, { version : '2.0' });
  console.log('Mailchimp API Successfully instantiated');
} catch (error) {
  console.log(error.message + '... So go f*** yourself');
}

/**********************************************
 * Instantiate Mailchimp Export API Object
 **********************************************/

try {
  var exportApi = new MailChimpExportAPI(apikey, { version : '1.0', secure : false });
  console.log('Mailchimp Export Api Successfully Instantiated');
} catch (error) {
  console.log(error.message + '... So go f*** yourself');
}

/**********************************************
 * Test section for OnePageCRM Tools
 **********************************************/

var OnePageCRM = require('./config/onepage.js');
/*
try {
  var crm = new OnePageCRM('justin@elevenjames.com', '2q8JIF6aPWQlScMGS1x7');
  console.log('Testing OnePageCRM Login');
} catch(error) {
  console.log(error.message + '... f*** f*** f***');
}
*/

/**********************************************
 * Initiialize our environments
 **********************************************/

app.set('port', process.env.PORT || 8080);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(express.cookieParser());
app.use(express.bodyParser());
app.use(express.session({ secret: 'fortheswarm' }));
app.use(passport.initialize());
app.use(passport.session());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

app.use(function(req, res, next) {
	res.locals.error_flash = req.session.error_flash;
	req.session.error_flash = false;
	res.locals.success_flash = req.session.success_flash;
	req.session.success_flash = false;
	next();
});

/**********************************************
 * Configure passport
 **********************************************/

require('./config/passport')(passport);

/**********************************************
 * Define Routes
 **********************************************/

require('./routes/routes.js')(app, passport, api);

/**********************************************
 * Development Only
 **********************************************/
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

/**********************************************
 * Start Server
 **********************************************/

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
