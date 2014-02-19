var MCList = require('../models/MCList.js');
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


module.exports = function(app, passport, api, crm) {

  /***************************************
   * HOME
   ***************************************/

  app.get('/', isLoggedIn, function(req, res) {
    res.render('home', {title : 'Eleven James' , watches: watches});
  });

	/***************************************
	 * WATCHES
	 ***************************************/

	app.get('/watches', isLoggedIn, function(req, res) {
		res.render('index', {title : 'EJ Watches', watches : watches });
	});

  /***************************************
   * LOGIN
   ***************************************/

  app.get('/login', function(req, res) {
    res.render('login');
  });

  app.post('/login', passport.authenticate('local-login', {
    successRedirect : '/',
    failureRedirect : '/login',
  }));

  /***************************************
   * LOGOUT
   ***************************************/

  app.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
  });

  /***************************************
   * SIGNUP
   ***************************************/

  app.get('/signup', function(req, res) {
    res.render('signup');
  });

  app.post('/signup', passport.authenticate('local-signup', {
    successRedirect : '/',
    failureRedirect : '/signup',
  }));

	/***************************************
	 * MAILCHIMP
	 ***************************************/

	app.get('/mailchimp', isLoggedIn, function(req, res) {
		mc.helper.ping(function(data) {
			res.render('mailchimp', { title : 'Mailchimp' });
		}, function(err) {
			console.log(err);
			if(err.name == 'Invalid_ApiKey') {
				res.locals.error_flash = "Invalid API key. Set it in app.js";
			} else if (error.error) {
				res.locals.error_flash = error.code + ": " + error.error;
			} else {
				res.locals.error_flash = "An unknown error occurred";
			}
			res.render('mailchimp', { title: 'Mailchimp' });
		});
	});

  app.get('/lists.json', isLoggedIn, function(req, res) {
    MCList.find({}, function(error, lists) {
      console.log(lists);
      res.json({lists : lists});
    });
  });

  app.get('/campaigns.json', isLoggedIn, function(req, res) {
    mc.campaigns.list({'status':'sent'}, function(data) {
      res.json({campaigns : data.data});
    }, function(error) {
      if(error.error) {
        req.session.error_flash = error.code + ": " + error.error;
      } else {
        req.session.error_flash = "An unknown error occurred";
      }
      res.redirect('/mailchimp');
    });
  });

  app.get('/lists/:id', isLoggedIn, function(req, res) {
    mc.lists.list( {filters : { list_id : req.params.id }}, function(listData) {
      var list = listData.data[0];
      mc.lists.members( {id : req.params.id, status : 'subscribed', opts : {sort_field : 'email'}}, function(memberData) {
        console.log(memberData.total);
        console.log(memberData.data[0]);
        for(var i = 0; i < memberData.data.length; i++) {
          console.log(memberData.data[i].email);
        }
        res.render('lists/view', { title : list.title, list : list, members : memberData.data });
      }, function(error) {
        console.log(error);
        if(error.name == "List_DoesNotExist") {
          req.session.error_flash = "The list does not exist";
        } else if(error.error) {
          req.session.error_flash = error.code + ": " + error.error;
        } else {
          req.session.error_flash = "An unknown error occurred";
        }
        res.redirect('/mailchimp');
      });
    });
  });

  /***************************************
   * MAILCHIMP EXPORTS
   ***************************************/

  app.get('/exports/lists.json', isLoggedIn, function(req, res) {
    api.call('lists', 'list', function(error, data) {
      if(error) {
        console.log(error.message);
      } else {
        console.log(data.data);
        res.json({lists : data.data});
      }
    });
  });

  app.post('/lists.json', isLoggedIn, function(req, res) {
    var list = new MCList(req.body);
    list.save(function(error, list) {
      if(error || !list) {
        res.json({error : error});
      } else {
        res.json({ list : list });
      }
    });
  });

  /***************************************
   * TEST Routes
   ***************************************/

  app.get('/test.json', function(req, res) {
    res.json({result : 'It worked' });
  });

  app.get('/test/export', function(req, res) {
    crm.createContact();
  });
};

/*****************************************
 * Route Middleware to make sure
 * user is logged in
 *****************************************/

function isLoggedIn(req, res, next) {
  if(req.isAuthenticated())
    return next();

  res.redirect('/login');
}
