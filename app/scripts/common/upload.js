angular.module('bdUpload', [])
  .factory('Uploader', [
    '$q',
    'md5',
    'CDN',
    'Restangular',
    UploaderService
  ]);

function UploaderService (
  $q,
  md5,
  CDN,
  Restangular
) {
  'use strict';

  var uploadTypeList = ['userAvatar', 'sourceCover', 'characterAvatar'];

  // status = ['ready', 'pending', 'success', 'failed'];
  var uploader = function (uploadType) {
    if (!uploadType) {
      throw new Error('uploadType must be specify!');
    }

    if (uploadTypeList.indexOf(uploadType) === -1) {
      throw new Error('uploadType should be userAvatar or sourceCover or characterAvatar!');
    }

    this.status = 'ready';
    this.isFilePass = false;
    this.uploadType = uploadType;
  };

  // check file size
  uploader.checkFileSize = function (file) {
    return file.size < CDN.fileSizeLimit;
  };

  // check file type
  uploader.checkFileType = function (file) {
    var acceptFileType = ['jpg', 'jpeg', 'png'];
    var mimeType = file.type.split('/');

    if (mimeType[0] !== 'image') {
      return false;
    }

    return acceptFileType.indexOf(mimeType[1]) !== -1;
  };

  uploader.prototype.checkFile = function (file) {
    if (!uploader.checkFileType(file)) {
      return Toast.show('目前仅支持jpg, jpeg, png格式的图片');
    }

    if (!uploader.checkFileSize(file)) {
      return Toast.show('文件最大支持2MB');
    }

    this.isFilePass = true;
  };

  // upload
  uploader.prototype.upload = function (file) {
    var self = this;
    self.checkFile(file);

    if (!self.isFilePass) {
      return;
    }

    var promise = $q(function (resolve, rejected) {

      Restangular
        .one('upload', 'token')
        .get()
        .then(function (token) {
          var data = new FormData();
          data.append('token', token);
          data.append('key', CDN[self.uploadType + 'Prefix'] + md5.createHash(Date.now() + file.name));
          data.append('file', file);

          var headers = {
            'Content-Type': undefined
          };

          Restangular
            .allUrl('/', 'http://upload.qiniu.com/')
            .withHttpConfig({
              transformRequest: angular.identity
            })
            .post(data, undefined, headers)
            .then(function (res) {
              res = res.plain();
              var imgSrc = res.key;
              resolve(imgSrc);
            }, function (res) {
              rejected(res);
            });

        });


    });

    return promise;
  };

  return uploader;
}
