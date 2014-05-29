'use strict';

var services = angular.module('services', ['ngResource']);

services.config(function($httpProvider) {
  $httpProvider.responseInterceptors.push('imageRequestInterceptor');

  var spinnerFunction = function spinnerFunction(data, headersGetter) {
    $("#spinner").show();
    return data;
  };

  $httpProvider.defaults.transformRequest.push(spinnerFunction);
});

services.factory('imageRequestInterceptor', function($q, $window) {
  return function(promise) {
    return promise.then(function (response) {
      $("#spinner").hide();
      return response;
    }, function(response) {
      $("#spinner").hide();
      return $q.reject(response);
    });
  };
});

services.factory('Watches', ['$resource', function($resource) {
  return $resource('/watches.json');
}]);
