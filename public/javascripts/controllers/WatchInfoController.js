/***********************************
 * Author: Justin Knutson
 * Updated: 19 March 2014
 * Purpose: Dump Watch Info for Cards
 ***********************************/

function WatchInfoController($scope, $http) {
  $scope.watches = [];

  $scope.setWatches = function(watches) {
    $scope.watches = watches;
  };
}
