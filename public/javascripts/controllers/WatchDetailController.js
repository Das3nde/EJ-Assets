/***********************************
 * Author: Justin Knutson
 * Updated: 31 March 2014
 * Purpose: Controller for Detail Pages
 ***********************************/

function WatchDetailController($scope, $http) {
  $scope.boxWidth = 100;
  $scope.boxHeight = 100;

  $scope.getWatch = function(id) {
    $http.get('/watches/' + id + '.json').success(function(data) {
      $scope.watch = data.watch;
    });
  };

  $scope.onMouseHover = function($event) {
    $scope.mouseY = $event.offsetY;
    $scope.mouseX = $event.offsetX;
  };

  $scope.test = function($event) {
    alert($event.offsetX + ', ' + $event.offsetY);
  };
  
  function drawRect(mouseX, mouseY) {
  };
}
