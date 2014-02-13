/*****************************
 * Angular App
 *****************************/

var app = angular.module('app', []);

app.controller('MailchimpController', function($scope) {
  $scope.selectedTab = 'home';
});
