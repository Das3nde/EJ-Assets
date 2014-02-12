module.exports = function(app, passport) {

  /***************************************
   * HOME PAGE (with login links)
   ***************************************/

  app.get('/home', function(req, res) {
    res.render('testIndex');
  });

  /***************************************
   * LOGIN
   ***************************************/

  app.get('/login', function(req, res) {
    res.render('login');
  });

  app.post('/login', passport.authenticate('local-login', {
    successRedirect : '/',
    failureRedirect : '/login',
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

  app.get('/signup', function(req, res) {
    res.render('signup');
  });

  app.post('/signup', passport.authenticate('local-signup', {
    successRedirect : '/',
    failureRedirect : '/signup',
  }));
};

/*****************************************
 * Route Middleware to make sure
 * user is logged in
 *****************************************/

function isLoggedIn(req, res, next) {
  if(req.isAuthenticated())
    return next();

  res.redirect('/');
}
