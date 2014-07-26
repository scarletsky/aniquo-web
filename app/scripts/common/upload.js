angular.module('bdUpload', [])
  .constant('UploadConf', {
    domain: 'http://aniquo.qiniudn.com/',
    uploadUrl: 'http://upload.qiniu.com/',
    avatarPrefix: 'images/userAvatar/',
  })

  .directive('bdUpload', function (
    $timeout,
    md5,
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
        $scope.uploadStatus = 'ready';

        $element.on('click', function (e) {
          inputField[0].click()
        });

        inputField.on('change', function (e) {
          $scope.$apply(function () {
            var file = e.target.files[0];

            Restangular.one('upload', 'token').get().then(function (token) {
              var data = new FormData();
              data.append('token', token);
              data.append('key',
                UploadConf.avatarPrefix +
                md5.createHash(Date.now() + file.name)
              );
              data.append('file', file);

              var headers = {
                'Content-Type': undefined
              }

              $scope.uploadStatus = 'uploading';
              Restangular
                .allUrl('/', 'http://upload.qiniu.com/')
                .withHttpConfig({
                  transformRequest: angular.identity
                })
                .post(data, undefined, headers)
                .then(function (res) {
                  var imgSrc = UploadConf.domain + res.key;
                  $scope.uploadTarget = imgSrc;
                  $scope.uploadStatus = 'success';
                  imageField.attr('src', imgSrc);

                  $timeout(function () {
                    $scope.uploadStatus = 'ready';
                  }, 3000);
                }, function (res) {
                  $scope.uploadStatus = 'failed';
                  console.log(res);
                  alert(res.data);

                  $timeout(function () {
                    $scope.uploadStatus = 'ready';
                  }, 3000);
                });
            });
          });
        });
      }
    };
  });
