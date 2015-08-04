angular.module('bdImage', [])
  .factory('ImageViewer', [
    ImageViewerService
  ])

  .directive('bdImageAutoResize', [
    bdImageAutoResizeDirective
  ])

  .directive('bdImageSelected', [
    'ImageViewer',
    bdImageSelectedDirective
  ]);

function ImageViewerService () {

  var ImageViewer = function (options) {
    this.canvas = options.canvas;
    this.width = this.canvas.width;
    this.height = this.canvas.height;
    this.ctx = this.canvas.getContext('2d');

    this.src = options.src;
    this.srcType = (typeof this.src === 'string') ? 'url' : 'file';
  };

  ImageViewer.prototype.clean = function () {
    var self = this;
    self.ctx.clearRect(0, 0, self.width, self.height);
  };

  ImageViewer.prototype.show = function () {
    var self = this;

    if (self.srcType === 'url') {
      self.showFromUrl(self.src);
    } else {
      self.showFromFile(self.src);
    }
  };

  ImageViewer.prototype.showFromUrl = function (url) {
    var self = this;

    var image = new Image();

    image.onload = function () {
      var hRatio = self.width  / image.width;
      var vRatio = self.height / image.height;
      var ratio  = Math.min ( hRatio, vRatio );

      var centerShiftX = ( self.width - image.width*ratio ) / 2;
      var centerShiftY = ( self.height - image.height*ratio ) / 2;

      self.ctx.clearRect(0, 0, self.width, self.height);
      self.ctx.drawImage(image,
        0, 0, image.width, image.height,
        centerShiftX, centerShiftY, image.width*ratio, image.height*ratio);

    };

    image.src = url;

  };

  ImageViewer.prototype.showFromFile = function () {
    var self = this;

    var reader = new FileReader();

    reader.onload = function (e) {
      var dataURL = e.target.result;

      self.showFromUrl(dataURL);
    };

    if (self.src) {
      reader.readAsDataURL(self.src);
    }

  };

  return ImageViewer;

}

function bdImageAutoResizeDirective () {
  return {
    restrict: 'AE',
    link: function ($scope, $element) {

      var width = $element.width();
      $element.width(width);
      $element.height(width);

    }
  }
}

function bdImageSelectedDirective (ImageViewer) {
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
      element.height = width;

      var ctx = element.getContext('2d');
      var inputField = $element.next();

      $element.on('click', function () {
        inputField.click();
      });

      inputField.on('change', function (e) {

        var options = {
          canvas: element,
          src: e.target.files[0]
        };

        var imageViewer = new ImageViewer(options);
        imageViewer.show();
        $scope.$apply(function () {
          $scope.selectedFile = options.src;
        });

      });
    }
  };
}
