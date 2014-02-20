var http = require('http'),
    qs = require('querystring'),
    request = require('request'),
    crypto = require('crypto'),
    base64 = require('base64-js');

function OnePageCRM (uid, key) {
  this.uid = uid;
  this.key = key;
}

module.exports = OnePageCRM;

OnePageCRM.prototype.createContact = function(firstname, lastname, zip_code, phone, email) {
  var ts = parseInt((Date.now()/1000)).toString(),
      uri = 'https://app.onepagecrm.com/api/contacts.json',
      hash_uri = crypto.createHash('sha1').update(uri).digest('hex'),
      params = qs.stringify({firstname : firstname, lastname : lastname, zip_code : zip_code, phones : 'other|'+phone, emails : 'other|'+email, tags : 'Inquiries'}),
      hash_params = crypto.createHash('sha1').update(params).digest('hex'),
      auth_string = this.uid + '.' + ts + '.POST.' + hash_uri + '.' + hash_params,
      buffer = new Buffer(this.key, 'base64'),
      auth = crypto.createHmac('sha256', buffer).update(auth_string).digest('hex');

  console.log('UID is: ' + this.uid);
  console.log('Timestamp is: ' + ts);
  console.log('URI Hash is: ' + hash_uri);
  console.log('URI Hash is: ' + hash_uri);
  console.log('Params Hash is: ' + hash_params);
  console.log('Hash string is: ' + auth_string);
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

/*
try {
  request({
    method : 'POST',
    uri : 'https://app.onepagecrm.com/api/auth/login.json',
    form : {login : 'justin@elevenjames.com', password : '2q8JIF6aPWQlScMGS1x7'}
  }, function(error, response, body) {
    res = JSON.parse(body);
    crm.uid = res.data.uid;
    console.log("UID is " + res.data.uid);
    crm.key = res.data.key;
    console.log("Key is " + res.data.key);
  });
  console.log('Testing OnePageCRM Login');
} catch(error) {
  console.log(error.message + '... f*** f*** f***');
}
*/
