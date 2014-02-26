var MCList = require('../models/MCList.js');
var Contact = require('../models/Contact.js');
var Deletes = require('../models/Deletes.js');
var ben_id = '529e29eaeb89975e52000007';

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


module.exports = function(app, passport, api, exportApi, crm) {

  /***************************************
   * HOME
   ***************************************/

  app.get('/', isLoggedIn, function(req, res) {
    res.render('home', {title : 'Eleven James'});
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
    failureRedirect : '/login'
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

  app.get('/signup', isLoggedIn, function(req, res) {
    res.render('signup');
  });

  app.post('/signup', isLoggedIn, passport.authenticate('local-signup', {
    successRedirect : '/',
    failureRedirect : '/signup',
  }));

	/***************************************
	 * MAILCHIMP API CALLS
	 ***************************************/

  // Mailchimp test/home page
	app.get('/mailchimp', isLoggedIn, function(req, res) {
	  res.render('mailchimp', { title: 'Mailchimp' });
	});

  // GET Mailchimp lists from database
  app.get('/lists.json', isLoggedIn, function(req, res) {
    MCList.find({}, function(error, lists) {
      res.json({lists : lists});
    });
  });

  // GET Mailchimp Campaigns - DEPRECATED 20 February 2014
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

  // GET Mailchimp List Members - DEPRECATED 20 February 2014
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
   * MAILCHIMP WEBHOOKS
   ***************************************/

  // Set up Webhooks
  app.get('/webhooks/inquiries.json', function(req, res) {
    res.send({success : 1});
  });

  // Post data to OnePageCRM
  app.post('/webhooks/inquiries.json', function(req, res) {
    var data = req.body.data;
    crm.createContact({
      firstname : data.merges.FNAME,
      lastname : data.merges.LNAME,
      zip_code : data.merges.ZIPCODE,
      owner_id : ben_id,
      phones : ('other|' + data.merges.PHONE),
      emails : ('other|' + data.email), tags : 'Inquiries'});
    res.json({success : 1});
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

  // Post list to Database
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

  app.get('/exports/lists/:id', isLoggedIn, function(req, res) {
    exportApi.list({id : req.params.id}, function(error, data) {
      if(error) {
        console.log(error.message);
      } else {
        var contact = {};
        console.log(data[0]);
        for(var i = 1; i < data.length; i++) {
          contact = data[i];
          console.log(contact);
          new Contact({
            email : contact[0],
            first_name : formatName(contact[1]),
            last_name : formatName(contact[2]),
            country : contact[14],
            state : contact[15],
              ip : contact[8],
              latitude : contact[9],
              longitude : contact[10],
              region : contact[13],
              created : contact[7],
              euid : contact[18],
              leid : contact[17]
          }).save(function(error, contact) {
            if(error || !contact) {
              res.json({error : error});
            } else {
              res.json({contact : contact});
            }
          });
        }
      }
    });
  });
  
  /***************************************
   * OnePageCRM Routes
   ***************************************/

  app.get('/onepage/contacts', isLoggedIn, function(req, res) {
    crm.getContacts({whole_team : 1}, function(data) {
      // Iterate over all of the available pages
      for(var index = 1; index <= data.maxpage; index++) {
        crm.getContacts({whole_team : 1, page : index}, function(data) {
          for(var i = 0; i < data.contacts.length; i++) {
            crm.getContact(data.contacts[i].id, function(data) {
              var contact = data.contact;
              var first_name = formatName(contact.firstname),
                  last_name = formatName(contact.lastname);
              var email = '';
              var emails = [];
              if(contact.emails.length > 0) {
                email = contact.emails[0].address;
              }

              var phones = [];

              for(var i = 0; i < contact.phones.length; i++) {
                phones.push({type : contact.phones[i].type, number : contact.phones[i].number});
              }
              console.log(first_name + ' ' + last_name);
              console.log('Phones is ' + JSON.stringify(phones));

              Contact.findOne({first_name : first_name, last_name : last_name}, function(error, duplicate) {
                /***********************************************************
                 * CONTACT refers to the current reference on OnePage
                 * DUPLICATE refers to the contact already in the database
                 ***********************************************************/
                if(error || !duplicate) {
                  console.log('No duplicate for ' + first_name + ' ' + last_name);
                  console.log('Adding contact');
                  new Contact({
                    first_name : first_name,
                    last_name : last_name,
                    id : contact.id,
                    email : email,
                    country : contact.country,
                    state : contact.state,
                      company : contact.company,
                      job_title : contact.job_title,
                      address : contact.address,
                      zip : contact.zip,
                      city : contact.city,
                      description : contact.description,
                      phones : phones,
                      owner : contact.owner,
                      status : contact.status,
                      lead_source : contact.lead_source,
                      tags : contact.tags,
                      emails : contact.emails
                  }).save(function(error, contact) {
                    if(error || !contact) {
                     console.log('Error saving contact');
                   } else {
                     console.log('Success!');
                   }
                  });
                } else {
                  console.log('Duplicate found for ' + first_name + ' ' + last_name);
                  console.log('Duplicate ID is ' + duplicate.id);
                  console.log('Contact ID is ' + contact.id);
                  if(duplicate.id != contact.id) {
                    Deletes.findOne({id : duplicate.id}, function(error, deletes) {
                      if(error || !deletes) {
                        /******************************************************
                         * Okay, we found a REAL FUCKING DUPLICATE so let's
                         * merge the records and add it to our pending deletes
                         ******************************************************/

                        console.log('Merging records for ' + first_name + ' ' + last_name);
                        /* MERGES:
                         *
                         * Country
                         * State
                         * Company
                         * Job_title
                         * Address
                         * Zip
                         * City
                         * Description
                         * Phones (push)
                         * Lead_source
                         * Tags (push)
                         * Emails (push)
                         */
                        
                        compareContacts(duplicate, contact); // This function should return a params {} object


                        console.log('Staging ' + first_name + ' ' + last_name + ' for deletion');
                        new Deletes({
                          first_name : first_name,
                          last_name : last_name,
                          id : contact.id
                        }).save(function(error, deletes) {
                          if(error || !deletes) {
                            console.log('Error saving deletes');
                          } else {
                            console.log('Success saving deletes!');
                          }
                        });
                      } else {
                        console.log(first_name + ' ' + last_name + ' is already staged for deletion!');
                      }
                    });
                  } else {
                    console.log('However, the duplicate is literally the same');
                    // This is where we should update the contact and make sure all the fields are the same
                    // Wait... what did I mean by this?
                  }
                }
              });
            });
          }
        });
      }
    });
    res.send({success : 1});
  });

  /***************************************
   * TEST Routes
   ***************************************/

  app.get('/test.json', function(req, res) {
    res.json({result : 'It worked' });
  });

  app.get('/test/export', function(req, res) {
    var params = {firstname : 'Justin', lastname : 'Knutson', zip_code : '07302', owner_id : ben_id, phone : 'other|2537203662', emails : 'other|knutson.justin@gmail.com', tags : 'Inquiries'};
    crm.createContact(params);
  });

  app.get('/test/contacts', function(req, res) {
    var params = {whole_team : 1, search : 'Ahmed'};
    crm.getContacts(params, function(data) {
      console.log(data.contacts[0]);
      res.json(data.contacts[0]);
    });
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

function formatName(name) {
  return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
}

function compareContacts(duplicate, contact) {
  if(contact.country && !duplicate.country) {
    console.log(duplicate.first_name + ' ' + duplicate.last_name + ' needs to merge country field');
  }

  return {};
}
