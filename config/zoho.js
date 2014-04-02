var http = require('http'),
    qs = require('querystring'),
    request = require('request'),
    crypto = require('crypto'),
    base64 = require('base64-js'),
    xml = require('xml');

function ZohoCRM(authtoken) {
  this.authtoken = authtoken;
}

module.exports = ZohoCRM;

ZohoCRM.prototype.execute = function(url, method, params, xml_json, callback) {
  var self = this;
  var uri = "https://crm.zoho.com/crm/private/xml/" + url;

  var query = {};
  if(params) {
    query = params;
  }

  query.authtoken = this.authtoken;

  if(xml_json) {
    query.xmlData = "<?xml version='1.0' encoding='UTF-8' ?>" + xml(xml_json);
  }

  console.log(query);
 
  request({
    method : method,
    uri : uri,
    qs : query
  }, function(error, response, body) {
    if(error) {
      console.log(error);
    }
    callback(response);
  });
}

ZohoCRM.prototype.postInquiry = function(xml_json, params, callback) {
  this.execute('Leads/insertRecords', 'POST', params, xml_json, callback);
}

ZohoCRM.prototype.formatName = function(name) {
  if(name) return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
  return null;
}
