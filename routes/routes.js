/*****************************************
 * Dependencies
 *****************************************/

var formatPhone = require('phone');
var fs = require('fs');

/*****************************************
 * Mongoose Models
 *****************************************/

var MCList = require('../models/MCList.js');
var Contact = require('../models/Contact.js');
var Deletes = require('../models/Deletes.js');
var Watch = require('../models/Watch.js');

/*****************************************
 * Helper Routes
 *****************************************/

var routes = require('./index.js');
var database = require('./database.js');
var accounts = require('./accounts.js');
var watches = require('./watches.js');
var mailchimp = require('./mailchimp.js');
var onepage = require('./onepage.js');

var ben_id = '529e29eaeb89975e52000007';

module.exports = function(app, passport, mcApi, exportApi, crm, zoho) {

  /***************************************
   * PAGES AND DIRECTORIES
   ***************************************/

  /* INDEX PAGE */
  app.get('/', isLoggedIn, routes.index());
  
  /* LOGIN PAGE */
  app.get('/login', routes.login());

  /* SIGNUP PAGE */
  app.get('/signup', isLoggedIn, routes.signup());

  /* VIEW WATCH DIRECTORY */
  app.get('/watches', isLoggedIn, routes.watches(Watch));

  /* ADD A WATCH FORM */
  app.get('/add_watch', isLoggedIn, routes.addWatch());

  /* VIEW MAILCHIMP HOMEPAGE */
  app.get('/mailchimp', isLoggedIn, routes.mailchimp()); 

  /* VIEW AN INDIVIDUAL WATCH */
  app.get('/watches/:id.json'/*, isLoggedIn*/, routes.viewWatch(Watch));

  /* GET A TEMPLATE FOR A WATCH */
  app.get('/watches/templates/:id.json', isLoggedIn, routes.generateTemplate(Watch));

  /* GET WATCH INFO AS PLAINTEXT */
  app.get('/watch-info.json', routes.watchInfo(Watch));


  /***************************************
   * ACCOUNT MANAGEMENT
   ***************************************/

  /* LOGIN */
  app.post('/login', accounts.login(passport));

  /* LOGOUT */
  app.get('/logout', accounts.logout());

  /* SIGN-UP */
  app.post('/signup', isLoggedIn, accounts.signup(passport));


  /***************************************
   * DATABASE CRUD OPERATIONS
   ***************************************/

  /* ADD A WATCH */
  app.post('/watch.json', isLoggedIn, database.addWatch(Watch));

  /* REMOVE A WATCH */
  app.delete('/watches/:id.json', isLoggedIn, database.removeWatch(Watch));

  /* UPDATE A WATCH */
  app.put('/watches/:id.json',/* isLoggedIn,*/ database.updateWatch(Watch));

  /* GET WATCHES */
  app.get('/watches.json', isLoggedIn, database.getWatches(Watch));

  /* POST AN IMAGE */
  app.post('/images/:id.json', /*isLoggedIn,*/ database.addImage(Watch));
  
  /* GET MAILCHIMP LISTS */
  app.get('/mailchimp/lists.json', isLoggedIn, database.getMailchimpLists(MCList));

  /* IMPORT MAILCHIMP CAMPAIGNS */
  app.get('/mailchimp/campaigns.json', isLoggedIn, mailchimp.importCampaigns(mcApi));


  /***************************************
   * MAILCHIMP WEBHOOKS
   ***************************************/

  // Set up Webhooks
  app.get('/webhooks/inquiries.json', function(req, res) {
    res.send({success : 1});
  });

  app.get('/webhooks/zoho.json', function(req, res) {
    res.send({success : 1});
  });

  // Post data to ZohoCRM
  app.post('/webhooks/zoho.json', function(req, res) {
    var data = req.body.data;
    var lname = '';
    if(!data.merges.LNAME) {
      lname = 'Anonymous';
    } else {
      lname = formatName(data.merges.LNAME);
    }
    var fname = '';
    if(!data.merges.FNAME) {
      fname = '';
    } else {
      fname = formatName(data.merges.FNAME);
    }
    var xml_json = [{
      Leads : [{
        row : [
          {_attr : {no : '1'}},
          {FL : [
            {_attr : {val : "Lead Source"}},
            'Web Inquiry']},
          {FL : [
            {_attr : {val : "First Name"}},
            fname]},
          {FL : [
            {_attr : {val : "Last Name"}},
            lname]},
          {FL : [
            {_attr : {val : "Zip Code"}},
            data.merges.ZIPCODE]},
          {FL : [
            {_attr : {val : "Email"}},
            data.email]},
          {FL : [
            {_attr : {val : "Phone"}},
            data.merges.PHONE]}
        ]
      }]
    }];

    zoho.postInquiry(xml_json, {scope : "crmapi", wfTrigger : "true"}, function(data) {
      console.log(data);
    });

    res.json({success : 1});
  });

  // Post data to OnePageCRM
  app.post('/webhooks/inquiries.json', function(req, res) {
    var data = req.body.data;
    var lname = '';
    if(!data.merges.LNAME) {
      lname = 'Anonymous';
    } else {
      lname = formatName(data.merges.LNAME);
    }
    crm.createContact({
      firstname : formatName(data.merges.FNAME),
      lastname : lname,
      zip_code : data.merges.ZIPCODE,
      owner_id : ben_id,
      phones : ('other|' + data.merges.PHONE),
      emails : ('other|' + data.email), tags : 'Inquiries'}, function(contact) {

        // Test case
        var due =  parseOnePageCRMDate(new Date(Date.now()+24*60*60*1000));
        var params = {};
        if(data.merges.PHONE) {
          params = {
            cid : contact.id,
            assignee_id : contact.owner,
            name : 'Schedule follow-up call',
            date : due};
        } else {
          params = {
            cid : contact.id,
            assignee_id : contact.owner,
            name : 'Schedule follow-up email',
            date : due};
        }
        crm.createAction(params, function(data) {
          console.log(data);
        });
        // End Test Case

        console.log(contact);
      });
    res.json({success : 1});
  });
  
  /***************************************
   * MAILCHIMP EXPORTS
   ***************************************/

  app.get('/exports/lists.json', isLoggedIn, function(req, res) {
    mcApi.call('lists', 'list', function(error, data) {
      if(error) {
        console.log(error.message);
      } else {
        console.log(data.data);
        res.json({lists : data.data});
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
  
  app.get('/onepage/member-numbers.json', function(req, res) {
    fs.writeFileSync('members.csv', 'First Name,Last Name,Phone Number\n')
    crm.getContacts({whole_team : 1, filter_id : '5329d355eb89976372000002'}, function(data) {
      for(var index = 1; index <= data.maxpage; index++) {
        crm.getContacts({whole_team : 1, page : index, filter_id : '5329d355eb89976372000002'}, function(data) {
          for(var i = 0; i < data.contacts.length; i++) {
            crm.getContact(data.contacts[i].id, function(data) {
              var contact = data.contact;
              var first_name = formatName(contact.firstname),
                  last_name = formatName(contact.lastname);
              var phone = '';
              if(contact.phones.length > 0) {
                phone = contact.phones[0].number;
              }
              console.log(first_name + ' ' + last_name + ' ' + formatPhone(phone));
              fs.appendFile('members.csv', first_name + ',' + last_name + ',' + formatPhone(phone) + '\n', function(err) {
                if(err) throw err;
                console.log('Saved');
              });
            });
          }
        });
      }
    });
  });

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

                        Contact.update({_id : duplicate._id}, update = compareContacts(duplicate, contact), function(error, numAffected) {
                          if(error) {
                            console.log(error);
                          } else {
                            console.log(numAffected + ' were changed!');
                          }
                        });


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

/*****************************************
 * Format any name to be capitalized
 *****************************************/

function formatName(name) {
  if(name) return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
  return null;
}

/*****************************************
 * Compare two contacts and return update
 * parameters
 *****************************************/

function compareContacts(duplicate, contact) {
  var params = {};
  if(contact.country && !duplicate.country) {
    params.country = contact.country;
  }

  if(contact.state && !duplicate.state) {
    params.state = contact.state;
  }

  if(contact.company && !duplicate.company) {
    params.company = contact.company;
  }

  if(contact.job_title && !duplicate.job_title) {
    params.job_title = contact.job_title;
  }

  if(contact.address && !duplicate.address) {
    params.address = contact.address;
  }

  if(contact.zip && !duplicate.zip) {
    params.zip = contact.zip
  }

  if(contact.city && !duplicate.city) {
    params.city = contact.city;
  }

  if(contact.description) {
    params.description = '';
    if(duplicate.description) {
      params.description = duplicate.description + '\n\nMerged Description\n\n';
    }
    params.description += contact.description;
  }

  if(contact.lead_source && !duplicate.lead_source) {
    params.lead_source = contact.lead_source;
  }

  if(contact.phones.length > 0) {
    params.phones = [];
    var unique = true;
    for(var i = 0; i < contact.phones.length; i++) {
      for(var j = 0; j < duplicate.phones.length; j++) {
        if(contact.phones[i] == duplicate.phones[j]) {
          unique = false;
          break;
        }
      }
      if(unique) {
        params.phones.push(contact.phones[i]);
      }
      unique = true;
    }
  }

  if(contact.emails.length > 0) {
    params.emails = [];
    var unique = true;
    for(var i = 0; i < contact.emails.length; i++) {
      for(var j = 0; j < duplicate.emails.length; j++) {
        if(contact.emails[i] == duplicate.emails[j]) {
          unique = false;
          break;
        }
      }
      if(unique) {
        params.emails.push(contact.emails[i]);
      }
      unique = true;
    }
  }

  if(contact.tags.length > 0) {
    params.tags = [];
    var unique = true;
    for(var i = 0; i < contact.tags.length; i++) {
      for(var j = 0; j < duplicate.tags.length; j++) {
        if(contact.tags[i] == duplicate.tags[j]) {
          unique = false;
          break;
        }
      }
      if(unique) {
        params.tags.push(contact.tags[i]);
      }
      unique = true;
    }
  }
  return params;
}

/*********************************************
 * Parse a date in the style of dd.mm.yyyy
 *********************************************/

function parseOnePageCRMDate(date) {
  var format_date = (date.getDate() < 10) ? ('0' + date.getDate()) : (date.getDate());
  var format_month = (date.getMonth() < 9) ? ('0' + (date.getMonth() + 1)) : (date.getMonth() + 1);
  return format_date + '.' + format_month + '.' + date.getFullYear();
}
