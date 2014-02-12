
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var http = require('http');
var path = require('path');
var passport = require('passport');

var app = express();

var watches = [
  {name:"Anonimo Militare Flyback"},
  {name:"AP ROOS Chrono"},
{name:"AP ROOS Safari_Temp"},
{name:"AP ROOS Volcano_Temp"},
{name:"Blancpain Villeret"},
{name:"Breguet Classique Retrograde"},
{name:"Breitling Bentley Barnato"},
{name:"Breitling Navitimer"},
{name:"Breitling Transocean Chrono"},
{name:"Breitling Transocean Unitime"},
{name:"Cartier Ballon Bleu Chrono"},
{name:"Clerc Odyssey"},
{name:"Franck Muller Master Banker_Temp"},
{name:"Glashutte Panomatic Lunar"},
{name:"Glashutte Senator Navigator_Temp"},
{name:"Glashutte Senator Sixties"},
{name:"GP 1945 XXL"},
{name:"GP WW.TC Financial_Temp"},
{name:"GP WW.TC Traveller"},
{name:"Graham Swordfish Grillo"},
{name:"Hublot Big Bang Chrono Cappuccino"},
{name:"Hublot Classic Fusion"},
{name:"IWC Big Pilot"},
{name:"IWC Pilot Double Chrono"},
{name:"IWC Pilot Hand Wound Vintage 1936"},
{name:"IWC Pilot Spitfire Chrono"},
{name:"IWC Pilot Top Gun Miramar"},
{name:"IWC Portofino 8-Day"},
{name:"IWC Portuguese Chrono"},
{name:"Jaquet Droz Les Deux Fuseaux Majestic Beijing"},
{name:"JLC Deep Sea Chrono_Temp"},
{name:"JLC Master Compressor_Temp"},
{name:"JLC Master Grande Ultra Thin"},
{name:"Maurice Lacroix Masterpiece Retrograde GMT"},
{name:"Maurice Lacroix Masterpiece Retrograde"},
{name:"Panerai PAM 049"},
{name:"Panerai PAM 086_Temp"},
{name:"Panerai PAM 104"},
{name:"Panerai PAM 441_Temp"},
{name:"Patek Philippe Calatrava_Temp"},
{name:"Rolex Bamford Milgauss"},
{name:"Rolex Datejust II"},
{name:"Rolex Daytona Meteorite"},
{name:"Rolex GMT Master II"},
{name:"Rolex Submariner with Date"},
{name:"Rolex Submariner Without Date"},
{name:"Tudor Heritage Chrono_Temp"},
{name:"Ulysse Nardin GMT Big Date"},
{name:"Ulysse Nardin Maxi Marine Chronometer"},
{name:"Vacheron Constantin Overseas Dual Time"},
{name:"Zenith Class Open Chrono"},
{name:"Zenith El Primero Chronomaster"},
{name:"Zenith El Primero Moonphase"},
{name:"Zenith Pilot"}
  ];

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

// require('./config/passport')(passport); // Pass passport to configuration
require('./routes/routes.js')(app, passport);

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index(watches));
app.get('/users', user.list);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
