/***********************************
 * Author: Justin Knutson
 * Updated: 28 February 2014
 * Purpose: Database CRUD Operations
 ***********************************/

var path = require('path'),
    fs = require('fs');

/***********************************
 * RETRIEVE MAILCHIMP LISTS
 ***********************************/
exports.getMailchimpLists = function(MCList) {
  return function(req, res) {
    MCList.find({}, function(error, lists) {
      res.json({lists : lists});
    });
  };
};

/***********************************
 * ADD WATCH TO DATABASE
 ***********************************/

exports.addWatch = function(Watch) {
  return function(req, res) {
    var watch = new Watch(req.body);
    watch.save(function(error, watch) {
      if(error || !watch) {
        res.json({error : error});
      } else {
        res.json({watch : watch});
      }
    });
  };
};

/***********************************
 * REMOVE WATCH FROM DATABASE
 ***********************************/

exports.removeWatch = function(Watch) {
  return function(req, res) {
    Watch.findOneAndRemove({_id : req.params.id}, function(error, data) {
      if(error) {
        res.json({error : error});
      } else {
        res.json({data : data});
      }
    });
  };
};

/***********************************
 * GET WATCHES FROM DATABASE
 ***********************************/

exports.getWatches = function(Watch) {
  return function(req, res) {
    Watch.find({}, function(error, watches) {
      if(error) {
        res.json({error : error});
      } else {
        res.json({watches : watches});
      }
    });
  };
};

/***********************************
 * UPDATE A WATCH
 ***********************************/

exports.updateWatch = function(Watch) {
  return function(req, res) {
    var query = req.body[0];
    console.log(query);
    Watch.update(query, req.body[1], function(error, numAffected) {
      if(error) {
        res.json({error : error});
      } else {
        res.json({numAffected : numAffected});
        console.log(numAffected);
      }
    });
  };
};

/***********************************
 * ADD AN IMAGE TO A WATCH
 ***********************************/

exports.addImage = function(Watch) {
  return function(req, res) {
    var tempPath = req.files.watchImage.path,
        targetPath = path.resolve('./images/' + req.files.watchImage.name + '.png');
    if(path.extname(req.files.watchImage.name).toLowerCase() === '.png') {
      fs.rename(tempPath, targetPath, function(error) {
        if(error) throw error;
        console.log("Upload Complete");
      });
    } else {
      fs.unlink(tempPath, function() {
        if(error) throw error;
        console.error("Only .png files are allowed!");
      });
    }
  };
};
