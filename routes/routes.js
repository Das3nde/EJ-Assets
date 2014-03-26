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

var routes = require('./pages.js');
var database = require('./database.js');
var watches = require('./watches.js');
var onepage = require('./onepage.js');

var ben_id = '529e29eaeb89975e52000007';

module.exports = function(app, passport, mcApi, exportApi) {

  /***************************************
   * PAGES AND DIRECTORIES
   ***************************************/

  /* GET A WATCH INFO PAGE */
  app.get('/watch-info/:id.json', routes.watchPage(Watch));

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
