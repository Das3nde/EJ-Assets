/***********************************
 * Author: Justin Knutson
 * Updated: 28 February 2014
 * Purpose: CRUD Ops for Watches
 ***********************************/

exports.add = function(Watch) {
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
