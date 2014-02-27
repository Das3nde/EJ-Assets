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

OnePageCRM.prototype.execute = function(path, method, params, callback) {
  var self = this;
  
  var timestamp = parseInt((Date.now()/1000)).toString();
  var uri = 'https://app.onepagecrm.com/api/' + path;
  var body = '';
  var params_hash = '';

  if(method == 'POST' || method == 'PUT') {
    body = qs.stringify(params);
    params_hash = '.' + crypto.createHash('sha1').update(qs.stringify(params)).digest('hex');
  } else {
    if(params != null) {
      uri += ('?' + qs.stringify(params));
    }
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
    if(error) {
      console.log(error);
    }
    callback(JSON.parse(body).data);
  });
}

OnePageCRM.prototype.createContact = function(params) {
  this.execute('contacts.json', 'POST', params, function(data) {
    console.log(data)
  });
}

OnePageCRM.prototype.getContacts = function(params, callback) {
  this.execute('contacts.json', 'GET', params, callback);
}

OnePageCRM.prototype.getContact = function(id, callback) {
  console.log("Getting contact with id " + id);
  this.execute('contacts/' + id + '.json', 'GET', null, callback);
}

OnePageCRM.prototype.updateContact = function(id, params, callback) {
  console.log("Updating contact id " + id);
  this.execute('contacts/' + id + '.json', 'PUT', params, callback);
}

OnePageCRM.prototype.createAction = function(name, params, callback) {
  console.log("Adding a new action with name " + name);
  this.execute('actions.json', 'POST', params, callback);
}
