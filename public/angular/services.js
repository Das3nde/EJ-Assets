'use strict';

var services = angular.module('services', ['ngResource']);

services.factory('Watches', ['$resource', function($resource) {
  return $resource('/watches.json');
}]);
