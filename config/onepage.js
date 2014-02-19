var http = require('http'),
    qs = require('querystring'),
    request = require('request'),
    crypto = require('crypto');

function OnePageCRM (login, password) {
  request({
    method : 'POST',
    uri : 'https://app.onepagecrm.com/api/auth/login.json',
    form : {login : login, password : password}
  }, function(error, response, body) {
      res = JSON.parse(body);
      this.uid = res.data.uid;
      console.log(res.data.uid);

      this.key = res.data.key;
      console.log(res.data.key);
    }
  );
}

OnePageCRM.prototype.createContact = function() {
  console.log('UID is: ' + this.uid);

  var ts = parseInt((Date.now()/1000)).toString();
  console.log('Timestamp is: ' + ts);

  var uri = 'https://app.onepagecrm.com/api/contacts.json';
  var hash_uri = crypto.createHash('sha1').update(uri).digest('hex');
  console.log('URI Hash is: ' + hash_uri);

  var params = 'firstname==Justin&lastname=Knutson';
  var hash_params = crypto.createHash('sha1').update(params).digest('hex');
  console.log('Params Hash is: ' + hash_params);

  var auth = crypto.createHmac('sha256', this.key).update(this.uid + '.' + ts + '.POST.' + hash_uri + '.' + hash_params).digest('hex');
  console.log('Auth token is: ' + auth);

  request({
    method : 'POST',
    uri : uri,
    headers : {
      'X-OnePageCRM-UID' : this.uid,
      'X-OnePageCRM-TS' : ts,
      'X-OnePageCRM-Auth' : auth
    },
    form : {firstname : 'Justin', lastname : 'Knutson'}
  }, function(error, response, body) {
    res = JSON.parse(body);
    console.log(res);
  });
}


module.exports = OnePageCRM;
