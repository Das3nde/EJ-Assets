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
 * Shipping NPM Module
 **********************************************/

// var FedexClient = require('shipit').FedexClient;

/**********************************************
 * GraphicsMagick
 **********************************************/
/*
var gm = require('gm');
gm('/public/images/Breitling%20Bentley%20Barnato.jpg')
  .resize(240,240)
  .noProfile()
  .write('/public/images/Breitling%20Resized.jpg', function(err) {
    if(!err) console.log('done');
  });
  */

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

/**********************************************
 * Instantiate Fedex object
 **********************************************/

// var fedex = new FedexClient({key : 'emJ3rD22fhw57TQO', password : 'dgMqbJY6GbLXgVqyuxHfCdUID', account : '510087488', meter : '118628117'});



/**********************************************
 * Initiialize our environments
 **********************************************/

app.set('port', process.env.PORT || 8080);
app.set('views', path.join(__dirname, 'views'));
app.set('config', path.join(__dirname, 'config'));
app.set('view engine', 'jade');

app.use(express.favicon());
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

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
