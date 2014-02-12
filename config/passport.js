var LocalStrategy = require('passport-local').Strategy;
var user = {email : 'test', password : 'test'};


module.exports = function(passport) {

  /**********************************************
   * Passport serialize and deserialize users
   **********************************************/

  // need to make this Mongoose at some point
  passport.serializeUser(function(user, done) {
    done(null, user);
  });

  // need to make this Mongoose at some point
  passport.deserializeUser(function(user, done) {
    done(null, user);

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
    if(email=='test' && password=='test') {
      return done(null, user);
    }
  }));
};
