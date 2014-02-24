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

OnePageCRM.prototype.execute = function(path, method, params) {
  var self = this;
  
  var timestamp = parseInt((Date.now()/1000)).toString();
  var uri = 'https://app.onepagecrm.com/api/' + path;
  var body = '';
  var params_hash = '';

  if(method == 'POST' || method == 'PUT') {
    body = qs.stringify(params);
    params_hash = '.' + crypto.createHash('sha1').update(qs.stringify(params)).digest('hex');
  } else {
    uri += ('?' + qs.stringify(params));
    console.log(uri);
  }

  var uri_hash = crypto.createHash('sha1').update(uri).digest('hex');

  var hash_string = this.uid + '.' + timestamp + '.' + method + '.' + uri_hash + params_hash;

  var buffer = new Buffer(this.key, 'base64');

  var auth = crypto.createHmac('sha256', buffer).update(hash_string).digest('hex');

  request({
    method : method,
    uri : uri,
    headers : {
      'X-OnePageCRM-UID' : this.uid,
      'X-OnePageCRM-TS' : timestamp,
      'X-OnePageCRM-Auth' : auth
    },
    body : body
  }, function(error, response, body) {
    res = JSON.parse(body);
    console.log(res);
  });
}

OnePageCRM.prototype.createContact = function(params) {
  this.execute('contacts.json', 'POST', params);
}

OnePageCRM.prototype.getContacts = function(params) {
  this.execute('contacts.json', 'GET', params);
}
