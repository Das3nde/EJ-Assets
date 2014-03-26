var Watch = require('../models/Watch.js');

module.exports = function(passport) {

// GET WATCHES

  app.get('/watches.json', passport.isLoggedIn, function(req, res) {
    Watch.find({}, function(error, watches) {
      if(error) {
        console.log(error);
        res.json({error : error});
      } else {
        res.json({watches : watches});
      }
    });
  });

// GET WATCH

  app.get('/watches/:id.json', function(req, res) {
    Watch.find({_id : req.params.id}, function(error, watch) {
      if(error) {
        console.log(error);
        res.json({error : error});
      } else {
        console.log(watch);
        res.json({watch : watch[0]});
      }
    });
  });

// ADD A WATCH

  app.post('/watches.json', passport.isLoggedIn, function(req, res) {
    var watch = new Watch(req.body);
    watch.save(function(error, watch) {
      if(error || !watch) {
        res.json({error : error});
      } else {
        res.json({watch : watch});
      }
    });
  });

// REMOVE A WATCH

  app.delete('/watches/:id.json', passport.isLoggedIn, function(req, res) {
    Watch.findOneAndRemove({_id : req.params.id}, function(error, data) {
      if(error) {
        res.json({error : error});
      } else {
        res.json({data : data});
      }
    });
  });

// UPDATE A WATCH

  app.put('/watches/:id.json', passport.isLoggedIn, function(req, res) {
    var query = req.body[0];
    Watch.update(query, req.body[1], function(error, numAffected) {
      if(error) {
        res.json({error : error});
      } else {
        res.json({numAffected : numAffected});
      }
    });
  });
};

