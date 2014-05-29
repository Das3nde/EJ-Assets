'use strict'

var controllers = angular.module('controllers', []);

controllers.controller('LookbookController', ['$scope', '$filter', '$log', 'matchmedia', 'Watches', function($scope, $filter, $log, matchmedia, Watches) {
  $scope.ej_collections = [
    {name: 'Aficionado'},
    {name: 'Connoisseur'},
    {name: 'Virtuoso'}
  ];

  $scope.index = 0;

  $scope.watches = Watches.get(function(data) {
    $scope.watches = $filter('orderBy')(data.watches, 'ej_collection');
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

}]);
