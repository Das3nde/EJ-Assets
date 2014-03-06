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

  $scope.test = function() {
    alert(JSON.stringify($scope.watch));
//    $scope.watchForm.$setPristine();
    $scope.watch = angular.copy($scope.defaultForm);
    $scope.instructions = angular.copy($scope.defaultInstructions);
  };


  $scope.newWatch = {
    brand : '',
    family : '',
    model : '',
    reference : '',
    serial : '',
    img : ''
  };

  $scope.addWatch = function() {
    $http.post('/add_watch.json', $scope.newWatch).success(function(data) {
      if(data.watch) {
        console.log("Success adding watch!");

        $scope.newWatch.brand = '';
        $scope.newWatch.family = '';
        $scope.newWatch.model = '';
        $scope.newWatch.reference = '';
        $scope.newWatch.serial = '';
        $scope.newWatch.img = '';
      } else {
        alert(JSON.stringify(data));
      }
    });
  };
}
