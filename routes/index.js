
/*
 * GET home page.
 */

exports.index = function(watches){
  return function(req, res) {
    res.render('index', { title: 'Eleven James' , watches: watches});
  }
};
