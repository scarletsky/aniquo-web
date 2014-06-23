angular.module('bdCharacterEdit', [])
  .controller('CharacterEditCtrl', function (
    $scope,
    $location,
    $routeParams,
    Restangular
  ) {
    'use strict';

    var actionType = $routeParams.characterId ? 'edit' : 'add';

    if (actionType === 'edit') {
      Restangular
        .one('characters', $routeParams.characterId)
        .get({'with_source': true})
        .then(function (res) {
          $scope.character = res;
          $scope.character.sourceId = res.source._id;
          $scope.character.sourceName = res.source.name;
        });
    }

    $scope.submit = function () {
      var data = {
        name: $scope.character.name,
        nickname: $scope.character.nickname,
        info: $scope.character.info,
        sourceId: $scope.character.sourceId
      };

      if (actionType === 'edit') {
        Restangular
          .one('characters', $routeParams.characterId)
          .put(data)
          .then(function (res) {
            alert('更新成功！');
            $location.path('/characters/' + $routeParams.characterId + '/quotes');
          });
      } else {
        Restangular
          .one('character/check')
          .get(data)
          .then(function (res) {
            if (res.exist) {
              alert('该角色已存在！');
            } else {
              Restangular
                .all('characters')
                .post(data)
                .then(function (data) {
                  alert('添加成功！');
                  $location.path('/');
              });
            }
        });

      }
    };
  });
