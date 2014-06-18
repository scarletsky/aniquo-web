angular.module('bdCharacterEdit', [])
  .controller('CharacterEditCtrl', function (
    $scope,
    $location,
    Restangular
  ) {
    'use strict';

    $scope.submit = function () {
      var data = {
        name: $scope.character.name,
        nickname: $scope.character.nickname,
        sourceId: $scope.character.sourceId
      };

      Restangular.one('character/check').get(data).then(function (res) {
        if (res.exist) {
          alert('该角色已存在！');
        } else {
          Restangular.all('characters').post(data).then(function (data) {
            alert('添加成功！');
            $location.path('/');
          });
        }
      });
    };
  });
