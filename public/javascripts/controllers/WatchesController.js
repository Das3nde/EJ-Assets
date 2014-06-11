/***********************************
 * Author: Justin Knutson
 * Updated: 28 February 2014
 * Purpose: Control Adding and Updating Watches
 ***********************************/

function WatchesController($scope, $http) {
  $scope.watches = [];

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
    trivia : '',
    lookbook : false
  };

  $scope.defaultInstructions = [{id : '1'}];

  $scope.watch = angular.copy($scope.defaultForm);
  $scope.instructions = angular.copy($scope.defaultInstructions);

  $scope.addWatch = function() {
    $scope.watch.instructions = $scope.instructions;
    $http.post('/watches.json', $scope.watch).success(function(data) {
      alert("Successfully added watch!");
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

  $scope.updateLookbook = function(watch) {
    alert("About to update LookBook with LookBook = " + watch.lookbook);
    $http.put("/watches/" + watch._id + ".json", [
        {_id : watch._id},
        {lookbook : watch.lookbook}]);
  };
}
