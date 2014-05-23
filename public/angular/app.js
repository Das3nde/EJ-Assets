'use strict'

var app = angular.module('lookbook', ['controllers']);

app.config(['$logProvider', function($logProvider) {
  $logProvider.debugEnabled(true);
}]);
