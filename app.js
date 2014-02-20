
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
var OnePageCRM = require('./config/onepage.js');
var request = require('request');

Mongoose.connect('localhost', 'ejassets');

var app = express();

var mc_key = '99a8d61ae5dc0f904a72ec1899c41f6d-us4',
    onepage_uid = '525da050eb8997663500001e',
    onepage_key = 'xSWc1f4oYarbhXUtBzRAXx8RH1Iv6zcNRmVefPjuf/U=';

// This may be obsolete
mc = new mcapi.Mailchimp(mc_key);

/**********************************************
 * Instantiate Mailchimp API Object
 **********************************************/

try {
  var api = new MailChimpAPI(mc_key, { version : '2.0' });
  console.log('Mailchimp API Successfully instantiated');
} catch (error) {
  console.log(error.message);
}

/**********************************************
 * Instantiate Mailchimp Export API Object
 **********************************************/

try {
  var exportApi = new MailChimpExportAPI(mc_key, { version : '1.0', secure : false });
  console.log('Mailchimp Export Api Successfully Instantiated');
} catch (error) {
  console.log(error.message);
}

/**********************************************
 * OnePageCRM Tools
 **********************************************/

var crm = new OnePageCRM(onepage_uid, onepage_key);

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

require('./routes/routes.js')(app, passport, api, exportApi, crm);

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
