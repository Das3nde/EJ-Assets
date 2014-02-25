/*****************************
 * Angular App
 *****************************/

var app = angular.module('app', []);

/***********************************
 * Controller for Mailchimp Calls
 ***********************************/

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

  $scope.getContacts = function(id) {
    $http.get('/exports/lists/' + id);
  };
});

/************************************
 * Controller for Mailchimp Exports
 ************************************/

app.controller('ExportsController', function($scope, $http) {
  $scope.lists = [];
  
  $scope.getLists = function() {
    $http.get('/exports/lists.json').success(function(data) {
      $scope.lists = data.lists;
    }).then(function(data) {
      for(var i = 0; i < $scope.lists.length; i++) {
        $http.post('/lists.json', $scope.lists[i]);
      }
    });
  };
  
  $scope.testExport = function() {
    $http.get('/test/export');
  };
});
