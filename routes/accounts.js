/***********************************
 * Author: Justin Knutson
 * Updated: 28 February 2014
 * Purpose: Route Login/Logout Calls
 ***********************************/

/***************************************
 * LOGIN
 ***************************************/

exports.login = function(passport) {
  return passport.authenticate('local-login', {
    successRedirect : '/',
    failureRedirect : '/login'
  });
};

/***************************************
 * LOGOUT
 ***************************************/

exports.logout = function() {
  return function(req, res) {
    req.logout();
    res.redirect('/');
  };
};

/***************************************
 * SIGN-UP
 ***************************************/

exports.signup = function(passport) {
  return passport.authenticate('local-signup', {
    successRedirect : '/',
    failureRedirect : '/signup'
  });
};
