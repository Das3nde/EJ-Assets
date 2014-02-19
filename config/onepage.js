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
      this.key = res.data.uid;
      console.log(res.data.key);
    }
  );
}

OnePageCRM.prototype.createContact = function(/*firstname, lastname, zip_code, emails, phones*/) {
  var hash_uid = crypto.createHash('sha1').update(this.uid).digest('hex');
  console.log('UID hash is: ' + hash_uid);
  var hash_ts = crytp.createHash('sha1').update(toString(Date.now()/1000)).digest('hex');
  console.log('Timestamp hash is: ' + hash_ts);

}


module.exports = OnePageCRM;
