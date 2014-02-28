/************************************
 * Author: Justin Knutson
 * Updated: 28 February 2014
 * Purpose: Control Mailchimp Exports
 ************************************/

function ExportsController($scope, $http) {
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
}
