'use strict'

var directives = angular.module('directives', []);

directives.directive("jkSrc", ['$log', function($log) {
  return {
    link: function(scope, element, attrs) {
      var img, loadImage;
      img = null;

      loadImage = function() {

        element.hide();
        element[0].src = attrs.jkSrc;
        element[0].onload = function() {
          element.show();
        };
      };
          

      scope.$watch((function() {
        return attrs.jkSrc;
      }), function(newVal, oldVal) {
        if(oldVal !== newVal) {
          loadImage();
        }
      });
    }
  };
}]);
