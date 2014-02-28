/***********************************
 * Author: Justin Knutson
 * Updated: 28 February 2014
 * Purpose: Route all GET call to pages
 ***********************************/

exports.index = function(req, res) {
  return function(req, res) {
    res.render('home', {title : 'Eleven James'});
  };
};

exports.login = function() {
  return function(req, res) {
    res.render('login');
  };
};

exports.signup = function() {
  return function(req, res) {
    res.render('signup');
  };
};

exports.watches = function(Watch) {
  return function(req, res) {
    Watch.find({}, function(error, watches) {
      res.render('index', {title : 'EJ Watches', watches : watches });
    });
  };
};

exports.addWatch = function() {
  return function(req, res) {
    res.render('add_watch');
  };
};

exports.mailchimp = function() {
  return function(req, res) {
    res.render('mailchimp', {title : 'Mailchimp' });
  };
};
