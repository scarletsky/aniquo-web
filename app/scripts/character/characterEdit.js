angular.module('bdCharacterEdit', [])
  .controller('CharacterEditCtrl', [
    '$scope',
    '$location',
    '$routeParams',
    'Toast',
    'Restangular',
    CharacterEditCtrl
  ]);

function CharacterEditCtrl (
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
        res = res.plain();
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
      sourceId: $scope.character.sourceId,
      avatar: $scope.character.avatar
    };

    if (angular.isUndefined(data.name)) {
      return Toast.show('角色名字不能为空');
    }

    if (angular.isUndefined(data.sourceId)) {
      return Toast.show('角色所属作品不能为空');
    }

    if (actionType === 'edit') {
      var characterElement = Restangular.one('characters', $routeParams.characterId)
      angular.extend(characterElement, data)
      characterElement
        .put()
        .then(function (res) {
          Toast.show('角色更新成功');
          return $location.path('/characters/' + $routeParams.characterId + '/quotes');
        });

    } else {
      Restangular
        .one('character/check')
        .get(data)
        .then(function (res) {
          res = res.plain();
          if (res.exist) {
            return Toast.show('该角色已存在');

          } else {
            Restangular
              .all('characters')
              .post(data)
              .then(function (res) {
                return Toast.show('角色添加成功');
              }, function (res) {
                return Toast.show('角色添加失败');
              });
          }
        });
    }
  };
}
