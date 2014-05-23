module.exports = function(passport) {

// INDEX PAGE

  app.get('/', passport.isLoggedIn, function(req, res) {
    res.render('home', {title : 'Home'});
  });

// WATCH DIRECTORY

  app.get('/watches', passport.isLoggedIn, function(req, res) {
    res.render('directory', {title : 'EJ Watches'});
  });

// ADD WATCH

  app.get('/watches/new', passport.isLoggedIn, function(req, res) {
    res.render('add_watch', {title: 'Add Watch'});
  });

// VIEW AND EDIT WATCH

  app.get('/watches/review/:id.json', passport.isLoggedIn, function(req, res) {
    res.render('watch', {title : 'View Watch', id : req.params.id});
  });

// VIEW WATCH

  app.get('/watch-info/:id.json', function(req, res) {
    res.render('watch-frame', {id : req.params.id});
  });

// VIEW ALL WATCH DUMP

  app.get('/watch-info.json', function(req, res) {
    res.render('watch-info', {title: 'Watch Info'});
  });

// GENERATE A WATCH EMAIL TEMPLATE

  app.get('/watches/templates/:id.json', passport.isLoggedIn, function(req, res) {
    res.render('template', {title: 'Template', id : req.params.id});
  });

// TEST AJAX ZOOM

  app.get('/zoom-test', function(req, res) {
    res.render('zoom-test', {title: 'Test'});
  });




// NEW PAGES AS OF 5/23/2014
//

  app.get('/lookbook', function(req, res) {
    res.render('lookbook/page', {title: 'EJ Lookbook'});
  });
};
