/*****************************
 * Angular App
 *****************************/

var app = angular.module('app', []);

app.controller('MailchimpController', function($scope, $http) {
  $scope.selectedTab = 'home';
  $scope.lists = [];
  $scope.campaigns = [];

  $scope.getContent = function() {
    $scope.getLists();
    $scope.getCampaigns();
  };

  $scope.getLists = function() {
    $http.get('/lists.json').success(function(data) {
      $scope.lists = data.lists;
    });
  };

  $scope.getCampaigns = function() {
    $http.get('/campaigns.json').success(function(data) {
      $scope.campaigns = data.campaigns;
    });
  };
});
