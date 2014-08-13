'use strict'

var controllers = angular.module('controllers', []);

controllers.controller('LookbookController', ['$scope', '$filter', '$log', '$timeout', 'matchmedia', 'Watches', function($scope, $filter, $log, $timeout, matchmedia, Watches) {
  $scope.ej_collections = [
    {name: 'Aficionado'},
    {name: 'Connoisseur'},
    {name: 'Virtuoso'}
  ];

  $scope.index = 0;
  $scope.watches = [];

  $scope.watches = Watches.get(function(data) {
    $scope.watches = $filter('filter')(data.watches, {lookbook : true, ej_collection : '! '});
    $scope.watches = $filter('orderBy')($scope.watches, ['ej_collection', 'brand', 'family', 'model']);
    $scope.activeClass = $scope.watches[$scope.index].ej_collection;
    $scope.$watch('index', function() {
      $scope.activeClass = $scope.watches[$scope.index].ej_collection;
    });
  });


  $scope.navClass = function(collection) {
    return collection == $scope.activeClass ? 'active' : '';
  };

  $scope.changeCollection = function(collection) {
    $scope.index = $scope.watches.map(function(e) {return e.ej_collection}).indexOf(collection);
    $scope.activeClass = collection;
  };

  $scope.increment = function() {
    if($scope.index < $scope.watches.length - 1) {
      $scope.index++;
    }
  };

  $scope.decrement = function() {
    if($scope.index > 0) {
      $scope.index--;
    }
  };

  var nextWatchTimeout = function() {
    if($scope.index == $scope.watches.length - 1) {
      $scope.index = 0;
    } else {
      $scope.increment();
    }
    $timeout(nextWatchTimeout, 10 * 1000);
  };

  $timeout(nextWatchTimeout, 10 * 1000);

}]);
