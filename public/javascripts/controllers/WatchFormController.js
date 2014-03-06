/***********************************
 * Author: Justin Knutson
 * Updated: 28 February 2014
 * Purpose: Control Adding and Updating Watches
 ***********************************/

function WatchFormController($scope, $http) {
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
    alert(JSON.stringify($scope.watch));
    $http.post('/watch.json', $scope.watch).success(function(data) {
// Code here
    });
    $scope.watch = angular.copy($scope.defaultForm);
    $scope.instructions = angular.copy($scope.defaultInstructions);
  };

  $scope.addInstruction = function() {
    $scope.instructions.push({id : $scope.instructions.length+1});
  };
}
