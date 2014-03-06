/***********************************
 * Author: Justin Knutson
 * Updated: 28 February 2014
 * Purpose: Control Adding and Updating Watches
 ***********************************/

function WatchFormController($scope, $http) {
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
