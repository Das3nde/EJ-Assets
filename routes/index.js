
/*
 * GET home page.
 */

exports.index = function(watches){
  return function(req, res) {
    res.render('layout', { title: 'Eleven James' , watches: watches});
  }
};
