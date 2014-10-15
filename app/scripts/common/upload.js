angular.module('bdUpload', [])
  .constant('UploadConf', {
    domain: 'http://aniquo.qiniudn.com/',
    uploadUrl: 'http://upload.qiniu.com/',
    userAvatarPrefix: 'test/images/userAvatar/',
    sourceCoverPrefix: 'test/images/sourceCover/',
    characterAvatarPrefix: 'test/images/characterAvatar/',
    quoteScenePrefix: 'test/images/quoteScene/',
    fileSizeLimit: 2097152 // 2MB
  })

  .directive('bdUpload', [
    '$timeout',
    'md5',
    'Toast',
    'UploadConf',
    'Restangular',
    bdUploadDirective
  ]);

function bdUploadDirective (
  $timeout,
  md5,
  Toast,
  UploadConf,
  Restangular
) {
  'use strict';

  return {
    scope: {
      uploadTarget: '=',
      uploadStatus: '='
    },
    link: function ($scope, $element, $attrs) {
      var imageField = $element.find('img').eq(0);
      var inputField = $element.find('input[type="file"]');
      var uploadType = $attrs.uploadType + 'Prefix';
      $scope.uploadStatus = 'ready';

      function isFileTypePass (file) {
        var acceptFileType = ['jpg', 'jpeg', 'png'];
        var mimeType = file.type.split('/');

        if (mimeType[0] !== 'image') {
          return false;
        }

        return acceptFileType.indexOf(mimeType[1]) !== -1;
      }

      $element.on('click', function (e) {
        inputField[0].click();
      });

      inputField.on('change', function (e) {
        $scope.$apply(function () {
          var file = e.target.files[0];

          if (!isFileTypePass(file)) {
            return Toast.show('不支持该文件格式');
          }

          if (file.size > UploadConf.fileSizeLimit) {
            return Toast.show('文件最大支持2MB');
          }

          Restangular
            .one('upload', 'token')
            .get()
            .then(function (token) {
              var data = new FormData();
              data.append('token', token);
              data.append('key', UploadConf[uploadType] + md5.createHash(Date.now() + file.name));
              data.append('file', file);

              var headers = {
                'Content-Type': undefined
              };

              $scope.uploadStatus = 'uploading';
              Restangular
                .allUrl('/', 'http://upload.qiniu.com/')
                .withHttpConfig({
                  transformRequest: angular.identity
                })
                .post(data, undefined, headers)
                .then(function (res) {
                  res = res.plain();
                  var imgSrc = UploadConf.domain + res.key;
                  $scope.uploadTarget = imgSrc;
                  $scope.uploadStatus = 'success';
                  imageField.attr('src', imgSrc);
                  Toast.show('上传成功');

                  $timeout(function () {
                    $scope.uploadStatus = 'ready';
                  }, 1000);
                }, function (res) {
                  $scope.uploadStatus = 'failed';
                  console.log(res);
                  Toast.show('上传失败，请重试或联系管理员');

                  $timeout(function () {
                    $scope.uploadStatus = 'ready';
                  }, 1000);
                });
          });
        });
      });
    }
  };
}
