/***********************************
 * Author: Justin Knutson
 * Updated: 28 February 2014
 * Purpose: Control Adding and Updating Watches
 ***********************************/

function WatchController($scope, $http) {
  $scope.watches = [];

  $scope.setWatches = function(watches) {
    $scope.watches = watches;
  };

  $scope.defaultForm = {
    brand : '',
    family : '',
    model : '',
    reference : '',
    serial : '',
    img : '',
    instructions : [],
    description_long : '',
    description_short : '',
    trivia : ''
  };

  $scope.defaultInstructions = [{id : '1'}];

  $scope.watch = angular.copy($scope.defaultForm);
  $scope.instructions = angular.copy($scope.defaultInstructions);

  $scope.addWatch = function() {
    $scope.watch.instructions = $scope.instructions;
    $http.post('/watch.json', $scope.watch).success(function(data) {
// Code here to confirm POST
    });
    $scope.watch = angular.copy($scope.defaultForm);
    $scope.instructions = angular.copy($scope.defaultInstructions);
  };

  $scope.addInstruction = function() {
    $scope.instructions.push({id : $scope.instructions.length+1});
  };

  $scope.removeWatch = function(watch) {
    $http.delete('/watches/' + watch._id + '.json').success(function(data) {
      console.log(data);
    });
    $scope.getWatches();
  };

  $scope.getWatches = function() {
    $http.get('/watches.json').success(function(data) {
      $scope.watches = data.watches;
    });
  };
}
