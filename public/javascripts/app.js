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


app.controller('ExportsController', function($scope, $http) {
  $scope.lists = [];
  
  $scope.getLists = function() {
    $http.get('/exports/lists.json').success(function(data) {
      $scope.lists = data.lists;
    }).then(function(data) {
      var newList = {id : '', name : ''};
      for(var i = 0; i < $scope.lists.length; i++) {
        newList.id = $scope.lists[i].id;
        newList.name = $scope.lists[i].name;
        $http.post('/lists.json', newList);
      }
    });
  };
});
