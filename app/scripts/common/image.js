angular.module('bdImage', ['bdUpload'])
  .factory('ImageViewer', [
    ImageViewerService
  ])

  .directive('bdImageAutoResize', [
    '$window',
    bdImageAutoResizeDirective
  ])

  .directive('bdImageBackgroundCover', [
    'CDN',
    bdImageBackgroundCoverDirective
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

      self.ctx.clearRect(0, 0, self.width, self.height);
      self.drawImageProp(self.ctx, image, 0, 0, self.width, self.height);
      // var hRatio = self.width  / image.width;
      // var vRatio = self.height / image.height;
      // var ratio  = Math.min ( hRatio, vRatio );
      //
      // var centerShiftX = ( self.width - image.width*ratio ) / 2;
      // var centerShiftY = ( self.height - image.height*ratio ) / 2;
      // self.ctx.drawImage(image,
      //   0, 0, image.width, image.height,
      //   centerShiftX, centerShiftY, image.width*ratio, image.height*ratio);

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

  ImageViewer.prototype.drawImageProp = function (ctx, img, x, y, w, h, offsetX, offsetY) {
    // from http://stackoverflow.com/questions/21961839/simulation-background-size-cover-in-canvas
    /**
     * By Ken Fyrstenberg
     *
     * drawImageProp(context, image [, x, y, width, height [,offsetX, offsetY]])
     *
     * If image and context are only arguments rectangle will equal canvas
    */

    if (arguments.length === 2) {
      x = y = 0;
      w = ctx.canvas.width;
      h = ctx.canvas.height;
    }

    // default offset is center
    offsetX = offsetX ? offsetX : 0.5;
    offsetY = offsetY ? offsetY : 0.5;

    // keep bounds [0.0, 1.0]
    if (offsetX < 0) offsetX = 0;
    if (offsetY < 0) offsetY = 0;
    if (offsetX > 1) offsetX = 1;
    if (offsetY > 1) offsetY = 1;

    var iw = img.width,
      ih = img.height,
      r = Math.min(w / iw, h / ih),
      nw = iw * r,   /// new prop. width
      nh = ih * r,   /// new prop. height
      cx, cy, cw, ch, ar = 1;

    // decide which gap to fill
    if (nw < w) ar = w / nw;
    if (nh < h) ar = h / nh;
    nw *= ar;
    nh *= ar;

    // calc source rectangle
    cw = iw / (nw / w);
    ch = ih / (nh / h);

    cx = (iw - cw) * offsetX;
    cy = (ih - ch) * offsetY;

    // make sure source rectangle is valid
    if (cx < 0) cx = 0;
    if (cy < 0) cy = 0;
    if (cw > iw) cw = iw;
    if (ch > ih) ch = ih;

    // fill image in dest. rectangle
    ctx.drawImage(img, cx, cy, cw, ch,  x, y, w, h);
  };

  return ImageViewer;

}

function bdImageAutoResizeDirective ($window) {
  return {
    restrict: 'AE',
    link: function ($scope, $element) {

      function resizeImage() {
        $element.width('100%');
        $element.height($element.width());
      }

      angular.element($window).on('resize', function() {
        resizeImage();
      });

      $scope.$watch(function () {
        return $element.width();
      }, function (w) {
        resizeImage();
      });

    }
  }
}

function bdImageBackgroundCoverDirective (CDN) {
  return {
    restrict: 'AE',
    link: function ($scope, $element, $attrs) {

      var bgKey;

      var w = $attrs.bdWidth || 500;
      var h = $attrs.bdHeight || 500;

      $element.css({
        'background-size': 'cover',
        'background-position': 'center'
      });

      $attrs.$observe('bdImageName', function (newVal) {
          if (!newVal) return;

          bgKey = newVal.charCodeAt(0) % 9;
          $element.css({
            'background-image': 'url(' + CDN.domain + 'images/bg' + bgKey + '?imageView/2/w/' + w + '/h/' + h + ')'
          });
      });

      $attrs.$observe('bdImageBackgroundCover', function (newVal) {
        if (angular.isUndefined(newVal) || newVal === '') {
          return;
        }

        $element.css({
          'background-image': 'url(' + CDN.domain + newVal + ')',
        });
      });
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
