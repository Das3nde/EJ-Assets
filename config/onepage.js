var http = require('http'),
    qs = require('querystring'),
    request = require('request');

function OnePageCRM (login, password) {
  request({
    method : 'POST',
    uri : 'https://app.onepagecrm.com/api/auth/login.json',
    form : {login : login, password : password}
  }, function(error, response, body) {
      res = JSON.parse(body);
      this.uid = res.data.uid;
      console.log(res.data.uid);
      this.key = res.data.uid;
      console.log(res.data.key);
    }
  );
}

OnePageCRM.createContact = function(/*firstname, lastname, zip_code, emails, phones*/) {
}


module.exports = OnePageCRM;
