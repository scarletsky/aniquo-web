angular.module('bdImage', [])
  .directive('bdImageSelected', [
    bdImageSelectedDirective
  ]);

function bdImageSelectedDirective () {
  return {
    scope: {
      selectedFile: '='
    },
    restrict: 'AE',
    link: function ($scope, $element, $attrs) {

      var element = $element[0];
      var width = $element.width();
      var height = $element.height();

      element.width = width;
      element.height = height;

      var ctx = element.getContext('2d');
      var inputField = $element.next();

      $element.on('click', function () {
        inputField.click();
      });

      inputField.on('change', function (e) {

        var reader = new FileReader();
        var file = e.target.files[0];

        reader.onload = function (e) {
          var img = new Image();
          var dataURL = e.target.result;

          img.onload = function () {
            var hRatio = width  / img.width    ;
            var vRatio =  height / img.height  ;
            var ratio  = Math.min ( hRatio, vRatio );

            var centerShiftX = ( width - img.width*ratio ) / 2;
            var centerShiftY = ( height - img.height*ratio ) / 2;  

            ctx.clearRect(0, 0, width, height);
            ctx.drawImage(img, 0, 0, img.width, img.height, centerShiftX, centerShiftY, img.width*ratio, img.height*ratio);

          };

          img.src = dataURL;

          $scope.$apply(function () {
            $scope.selectedFile = file;
          });

        };

        if (file) {
          reader.readAsDataURL(file);
        }

      });

    }
  };
}
