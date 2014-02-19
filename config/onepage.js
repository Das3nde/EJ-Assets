var http = require('http'),
    qs = require('querystring'),
    request = require('request');

function OnePageCRM (login, password) {
  request({
    method : 'POST',
    uri : 'https://app.onepagecrm.com/api/auth/login.json',
    form : {login : login, password : password}
  }, function(error, response, body) {
      console.log(JSON.parse(body));
    }
  );
}

module.exports = OnePageCRM;
