var Watch = require('../models/Watch.js');
var path = require('path');
var fs = require('fs');
var gm = require('gm');

module.exports = function(passport) {

// GET WATCHES

  app.get('/watches.json', function(req, res) {
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

// ADD AN IMAGE TO A WATCH

  app.post('/images/:id.json', passport.isLoggedIn, function(req, res) {
    Watch.findOne({_id : req.params.id}, function(error, watch) {
      var tempPath = req.files.watchImage.path,
          targetPath = path.resolve('./public/images/'
            + watch._id + '.jpg');
      if(path.extname(req.files.watchImage.name).toLowerCase() === '.jpg') {
        gm(tempPath).resize(1096, 1526).write(targetPath, function(err) {
          if(err) console.log(err);
          watch.img = watch._id + '.jpg';
          watch.save();
          res.redirect('/watches/review/' + req.params.id + '.json');
        });
        /*
        fs.rename(tempPath, targetPath, function(err) {
          if(err) throw err;
          console.log("Upload Complete");
          watch.img = watch.brand + ' ' + watch.family + ' ' + watch.model + '.jpg';
          watch.save();
          res.redirect('/watches/review/' + req.params.id + '.json');
        });
        */
      } else {
        fs.unlink(tempPath, function(err) {
          if(err) throw err;
          console.error("Only .jpg files are allowed!");
        });
      }
    });
  });

// RESIZE ALL IMAGES IN A ONE-TIME BATCH

  app.post('/images/resize', passport.isLoggedIn, function(req, res) {
    Watch.find({}, function(error, watches) {
      for(var i = 0; i < watches.length; i++) {
        var watch = watches[i];
        var watchName = watch.brand + ' ' + watch.family + ' ' + watch.model;
        var targetPath = path.resolve('./public/images/' + watchName + '.jpg');
        var originalPath = path.resolve('./public/images/' + watchName + '_original.jpg');
        resizeRename(targetPath, originalPath);
      }
    });
    res.redirect('/');
  });
};


function resizeRename(targetPath, originalPath) {
  fs.rename(targetPath, originalPath, function(err) {
    if(err) console.log(err);
    gm(originalPath).resize(1096, 1526).write(targetPath, function(err) {
      if(err) console.log(err);
    });
  });
}
