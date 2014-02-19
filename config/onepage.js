var http = require('http'),
    qs = require('querystring'),
    request = require('request'),
    crypto = require('crypto'),
    base64 = require('base64-js');

function OnePageCRM () {
}

module.exports = OnePageCRM;

OnePageCRM.prototype.createContact = function() {
  console.log('UID is: ' + this.uid);

  var ts = parseInt((Date.now()/1000)).toString();
  console.log('Timestamp is: ' + ts);

  var uri = 'https://app.onepagecrm.com/api/contacts.json';
  var hash_uri = crypto.createHash('sha1').update(uri).digest('hex');
  console.log('URI Hash is: ' + hash_uri);

  var params = qs.stringify({firstname : 'Justin', lastname : 'Knutson'});
  console.log('Params qs is: ' + params);

  var hash_params = crypto.createHash('sha1').update(params).digest('hex');
  console.log('Params Hash is: ' + hash_params);

  var auth_string = this.uid + '.' + ts + '.POST.' + hash_uri + '.' + hash_params;
  console.log('Hash string is: ' + auth_string);

  var buffer = new Buffer(this.key, 'base64');

  var auth = crypto.createHmac('sha256', buffer).update(auth_string).digest('hex');
  console.log('Auth token is: ' + auth);

  request({
    method : 'POST',
    uri : uri,
    headers : {
      'X-OnePageCRM-UID' : this.uid,
      'X-OnePageCRM-TS' : ts,
      'X-OnePageCRM-Auth' : auth
    },
    body : params
  }, function(error, response, body) {
    res = JSON.parse(body);
    console.log(res);
  });
}

