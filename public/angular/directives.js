'use strict'

var directives = angular.module('directives', []);

directives.directive("mySrc", ['$log', function($log) {
  return {
    link: function(scope, element, attrs) {
      var img, loadImage;
      img = null;

      loadImage = function() {

        element.hide();

        img = new Image();
        $log.log('Attrs is ' + attrs.mySrc);
        img.src = attrs.mySrc;

        img.onload = function() {
          $log.log('Img loaded with src ' + attrs.mySrc);
          element[0].src = attrs.mySrc;
          element.show();
        };
      };
          

      scope.$watch((function() {
        return attrs.mySrc;
      }), function(newVal, oldVal) {
        if(oldVal !== newVal) {
          loadImage();
        }
      });
    }
  };
}]);
