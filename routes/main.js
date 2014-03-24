module.exports = function(passport) {

  // INDEX PAGE
  app.get('/', passport.isLoggedIn, function(req, res) {
    res.render('home', {title : 'Home'});
  });

};
