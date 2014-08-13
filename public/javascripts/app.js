/*****************************
 * Angular App
 *****************************/

var app = angular.module('app', []);

require('./controllers/WatchUpdateController.js');

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

  $scope.getContacts = function() {
    $http.get('/onepage/contacts');
  };
});
