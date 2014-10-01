var fs = require('fs');
var mg_api_key = 'key-207af28e6d73ac4ba594209aff923372';
var domain = 'elevenjames.com';
var mailgun = require('mailgun-js')({apiKey: mg_api_key, domain: domain});

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

// VIEW WATCH (Public)

  app.get('/watch-info/:id.json', function(req, res) {
    res.render('watch-frame', {id : req.params.id, title: "Watch Detail"});
  });

// VIEW ALL WATCH DUMP

  app.get('/watch-info.json', function(req, res) {
    res.render('watch-info', {title: 'Watch Info'});
  });


// NEW PAGES AS OF 5/23/2014
//

  app.get('/lookbook', function(req, res) {
    res.render('lookbook/layout', {title: 'EJ Lookbook'});
  });

  app.get('/lookbook/:page', function(req, res) {
    res.render('lookbook/' + req.params.page);
  });

  app.post('/email', function(req, res) {
    fs.readFile('views/receipt_email.html', 'utf8', function(err, data) {
      if(err) {
        return console.log(err);
      }
      data = data.replace("{{NAME}}", req.body.name)
        .replace("{{WATCH}}", req.body.brand)
        .replace("{{LINK}}", req.body.link);
      var subject = "Your " + req.body.brand + ' ' + req.body.family;
      var email = {
        from : 'Eleven James Concierge <concierge@elevenjames.com>',
        to: req.body.email,
        subject: subject,
        body: '',
        html: data,
        bcc: 'justin@elevenjames.com'
      };

      mailgun.messages().send(email, function(error, body) {
        console.log(body);
      });

      res.send(200);
    });
  });
};

/*

*/
