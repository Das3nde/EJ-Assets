var ZohoCRM = require('../config/zoho.js');
var zoho = new ZohoCRM('68867e4dc484b6da2cf76a6725a60052');

var OnePageCRM = require('../config/onepage.js');
var onepage = new OnePageCRM('525da050eb8997663500001e', 'xSWc1f4oYarbhXUtBzRAXx8RH1Iv6zcNRmVefPjuf/U=');

module.exports = function(passport) {
  require('./main')(passport);
  require('./sso/login')(passport);
  require('./sso/signup')(passport);
  require('./webhooks/zoho')(zoho);
  require('./webhooks/onepage')(onepage);
  require('./watches')(passport);
};
