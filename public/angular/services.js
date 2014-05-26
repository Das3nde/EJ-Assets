'use strict';

var services = angular.module('services', ['ngResource']);

services.factory('Watches', function($resource) {
  return $resource('/watches.json');
});
