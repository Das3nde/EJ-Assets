'use strict'

var controllers = angular.module('controllers', []);

controllers.controller('LookbookController', ['$scope', 'Watches', function($scope, Watches) {
  $scope.ej_collections = [
    {name: 'Aficionado', selected: false},
    {name: 'Connoisseur', selected: true},
    {name: 'Virtuoso', selected: false}
  ];

  $scope.watches = Watches.get();

}]);
