angular.module('bdImage', [])
  .directive('bdBgImage', [
    bdBgImageDirective
  ]);

function bdBgImageDirective () {
  return {
    scope: false,
    restrict: 'AE',
    link: function ($scope, $element, $attrs) {
      var imgSrc;
      var image = new Image();

      $attrs.$observe('bdBgImage', function (newVal) {
        if (angular.isDefined(newVal)) {
          imgSrc = newVal;
          image.src = newVal;
        }
      });

      $(image).on('load', function (e) {
        var width = $attrs.width || image.width;
        var height = $attrs.height || image.height;

        $element
          .addClass('image')
          .css('background-image', 'url(' + imgSrc + ')')
          .css('width', width)
          .css('height', height);
      });
    }
  };
}
