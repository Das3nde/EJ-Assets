var LocalStrategy = require('passport-local').Strategy;
var User = require('../models/User');
var user = {email : 'test', password : 'test'};


module.exports = function(passport) {

  /**********************************************
   * Passport serialize and deserialize users
   **********************************************/

  // need to make this Mongoose at some point
  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  // need to make this Mongoose at some point
  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });

  /**********************************************
   * Define our local strategy
   **********************************************/

  passport.use('local-login', new LocalStrategy({
    usernameField : 'email',
    passwordField : 'password',
    passReqToCallback : true
  },
  function(req, email, password, done) {
    User.findOne({'email' : email}, function(err, user) {
      if(err) {
        return done(err);
      }
      if(!user) {
        return done(null, false);
      }
      if(!user.validPassword(password)) {
        return done(null, false);
      }
      return done(null, user);
    });
  }));
};
