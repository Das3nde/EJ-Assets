module.exports = function(app, passport) {

  /***************************************
   * HOME PAGE (with login links)
   ***************************************/

  app.get('/home', function(req, res) {
    res.render('index');
  });

  /***************************************
   * LOGIN
   ***************************************/

  app.get('/login', function(req, res) {
    res.render('login');
  });

  /***************************************
   * LOGOUT
   ***************************************/

  app.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
  });
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
