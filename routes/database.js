/***********************************
 * Author: Justin Knutson
 * Updated: 28 February 2014
 * Purpose: Database CRUD Operations
 ***********************************/

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
