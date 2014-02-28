/***********************************
 * Author: Justin Knutson
 * Updated: 28 February 2014
 * Purpose: Deal with internal mailchimp calls
 ***********************************/

exports.getLists = function(MCList) {
  return function(req, res) {
    MCList.find({}, function(error, lists) {
      res.json({lists : lists});
    });
  };
};

exports.importCampaigns = function(mcApi) {
  return function(req, res) {
    mcApi.call('campaigns', 'list', function(error, data) {
      if(error) {
        console.log(error.message);
        res.json({error : error.message});
      } else {
        res.json({campaigns : data.data});
      }
    });
  };
};
