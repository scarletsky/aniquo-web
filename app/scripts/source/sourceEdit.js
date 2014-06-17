angular.module('bdSourceEdit', [])
  .controller('SourceEditCtrl', function (
    $scope,
    $location,
    Restangular
  ) {
    'use strict';

    $scope.submit = function () {
      var data = {
        name: $scope.source.name,
        alias: $scope.source.alias,
        info: $scope.source.info 
      };

      Restangular.one('source/check').get(data).then(function (data) {
        if (data.exist) {
          alert('该作品已存在！');
        } else {
          Restangular.all('sources').post(data).then(function (data) {
            alert('添加成功！');
            $location.path('/');
          });
        }
      });
    };
  });
