/***********************************
 * Author: Justin Knutson
 * Updated: 28 February 2014
 * Purpose: Route all GET call to pages
 ***********************************/

/***********************************
 * HOMEPAGE/INDEX
 ***********************************/

exports.index = function(req, res) {
  return function(req, res) {
    res.render('home', {title : 'Eleven James'});
  };
};

/***********************************
 * LOGIN PAGE
 ***********************************/

exports.login = function() {
  return function(req, res) {
    res.render('login');
  };
};

/***********************************
 * SIGN-UP PAGE
 ***********************************/
exports.signup = function() {
  return function(req, res) {
    res.render('signup');
  };
};

/***********************************
 * WATCH DIRECTORY PAGE
 ***********************************/

exports.watches = function(Watch) {
  return function(req, res) {
    Watch.find({}, function(error, watches) {
      res.render('index', {title : 'EJ Watches', watches : watches });
    });
  };
};

/***********************************
 * ADD WATCH FORM PAGE
 ***********************************/

exports.addWatch = function() {
  return function(req, res) {
    res.render('add_watch');
  };
};

/***********************************
 * VIEW INDIVIDUAL WATCH PAGE
 ***********************************/

exports.viewWatch = function(Watch) {
  return function(req, res) {
    Watch.find({_id : req.params.id}, function(error, watch) {
      if(error) {
        console.log("Can't find your fucking watch");
      } else {
        res.render('watch', {watch : watch[0]});
      }
    });
  };
};

/***********************************
 * MAILCHIMP HOME PAGE
 ***********************************/

exports.mailchimp = function() {
  return function(req, res) {
    res.render('mailchimp', {title : 'Mailchimp' });
  };
};
