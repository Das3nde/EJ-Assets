module.exports = function(passport) {

  app.get('/signup', passport.isLoggedIn, function(req, res) {
    res.render('signup');
  });

  app.post('/signup', passport.authenticate('local-signup', {
    successRedirect : '/',
    failureRedirect : '/signup'
  }));

};
