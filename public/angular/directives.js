'use strict'

var directives = angular.module('directives', []);

directives.directive("backImg", function() {
  return function(scope, element, attrs) {
    attrs.$observe('backImg', function(value) {
      element.css({
        'background-image': 'url(/images/' + value + ')'
      });
    });
  };
});
