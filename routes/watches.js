var Watch = require('../models/Watch.js');
var EJCollections = require('../models/EJCollections.js');
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
        console.log("Got watches successfully");
        res.send({watches : watches});
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

      var baseImagePath = path.resolve('./public/images/' + watch._id);

      var smallPath = baseImagePath + "_small.jpg";
      var mediumPath = baseImagePath + "_medium.jpg";
      var largePath = baseImagePath + "_large.jpg";

      fs.unlink(smallPath, function(err) {
        console.log("Unlinking Small Path");
        if(err) console.log(err);
        console.log("Small Path Deleted");
      });

      fs.unlink(mediumPath, function(err) {
        console.log("Unlinking Medium Path");
        if(err) console.log(err);
        console.log("Medium Path Deleted");
      });

      fs.unlink(largePath, function(err) {
        console.log("Unlinking Large Path");
        if(err) console.log(err);
        console.log("Large Path Deleted");
      });

      fs.unlink(targetPath, function(err) {
        console.log("Unlinking legacy img");
        if(err) console.log(err);
        console.log("Legacy img deleted");
      });

      if(path.extname(req.files.watchImage.name).toLowerCase() === '.jpg' || path.extname(req.files.watchImage.name).toLowerCase() === '.png') {

        gm(tempPath).resize(274, 400).write(smallPath, function(err) {
          if(err) console.log(err);
          watch.img_small = watch._id + '_small.jpg';
          watch.save();
        });

        gm(tempPath).resize(548, 800).write(mediumPath, function(err) {
          if(err) console.log(err);
          watch.img_medium = watch._id + '_medium.jpg';
          watch.save();
        });

        gm(tempPath).resize(1096, 1526).write(largePath, function(err) {
          if(err) console.log(err);
          watch.img_large = watch._id + '_large.jpg';
          watch.save();
        });

        gm(tempPath).resize(1096, 1526).write(targetPath, function(err) {
          if(err) console.log(err);
          watch.img = watch._id + '.jpg';
          watch.save();
          fs.unlink(tempPath, function(err) {
            if(err) throw err;
            console.error(err);
          });
          res.redirect('/watches/review/' + req.params.id + '.json');
        });
      } else {
        fs.unlink(tempPath, function(err) {
          if(err) throw err;
          console.error(err);
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
