'use strict'

var controllers = angular.module('controllers', []);

controllers.controller('LookbookController', ['$scope', '$filter', '$log', 'matchmedia', 'Watches', function($scope, $filter, $log, matchmedia, Watches) {
  $scope.ej_collections = [
    {name: 'Aficionado', selected: false},
    {name: 'Connoisseur', selected: true},
    {name: 'Virtuoso', selected: false}
  ];

  $scope.watches = Watches.get(function(data) {
    $scope.watches = $filter('orderBy')(data.watches, 'ej_collection');
  });


  $scope.test = function() {
    $log.log($scope.watches[0]);
  };
}]);
