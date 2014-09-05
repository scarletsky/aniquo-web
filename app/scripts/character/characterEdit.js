angular.module('bdCharacterEdit', [])
  .controller('CharacterEditCtrl', function (
    $scope,
    $location,
    $routeParams,
    Toast,
    Restangular
  ) {
    'use strict';

    var actionType = $routeParams.characterId ? 'edit' : 'add';

    $scope.character = {};
    $scope.character.alias = [''];

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

    $scope.addAlias = function (e) {
      e.preventDefault();
      $scope.character.alias.push('');
    };

    $scope.removeAlias = function (e, index) {
      e.preventDefault();
      $scope.character.alias.splice(index, 1);
    };

    $scope.submit = function () {
      var alias = _.filter($scope.character.alias, function (value) {
        return $.trim(value);
      });

      var data = {
        name: $scope.character.name,
        alias: alias,
        info: $scope.character.info,
        sourceId: $scope.character.sourceId
      };

      if (angular.isUndefined(data.name)) {
        return Toast.alert('角色名字不能为空');
      }

      if (angular.isUndefined(data.sourceId)) {
        return Toast.alert('角色所属作品不能为空');
      }

      if (actionType === 'edit') {
        Restangular
          .one('characters', $routeParams.characterId)
          .put(data)
          .then(function (res) {
            Toast.alert('角色更新成功');
            return $location.path('/characters/' + $routeParams.characterId + '/quotes');
          });

      } else {
        Restangular
          .one('character/check')
          .get(data)
          .then(function (res) {
            if (res.exist) {
              return Toast.alert('该角色已存在');

            } else {
              Restangular
                .all('characters')
                .post(data)
                .then(function (res) {
                  return Toast.alert('角色添加成功');
                }, function (res) {
                  return Toast.alert('角色添加失败');
                });
            }
          });
      }
    };
  });
