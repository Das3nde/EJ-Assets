var ZohoCRM = require('../config/zoho.js');
var zoho = new ZohoCRM('d11a44a5746e17b1c3fcfadf816e619f');
// Make these keys databased

var OnePageCRM = require('../config/onepage.js');
var onepage = new OnePageCRM('525da050eb8997663500001e', 'xSWc1f4oYarbhXUtBzRAXx8RH1Iv6zcNRmVefPjuf/U=');
// Make these keys databased

module.exports = function(passport) {

  // Non-CRUD Pages
  require('./main')(passport);
  
  // Login and Signup pages
  require('./sso/login')(passport);
  require('./sso/signup')(passport);

  // Webhooks
  require('./webhooks/zoho')(zoho);
  require('./webhooks/onepage')(onepage);

  // Watch Ops
  require('./watches')(passport);
};
