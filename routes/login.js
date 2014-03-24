module.exports = function(passport) {
  app.get('/login', function(req, res) {
    res.render('login');
  });

  app.post('/login', passport.authenticate('local-login', {
      successRedirect : '/',
      failureRedirect : '/login'
    })
  );

  app.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
  });

};
