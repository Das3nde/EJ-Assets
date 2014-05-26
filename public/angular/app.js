'use strict'

var app = angular.module('lookbook', [
    'ngRoute',
    'controllers'
    ]);

app.config(['$logProvider', function($logProvider) {
  $logProvider.debugEnabled(true);
}]);

app.config(['$routeProvider', function($routeProvider) {
  $routeProvider
    .when('/', {
      templateUrl: 'lookbook/page',
      controller: 'LookbookController'
    })
}]);
