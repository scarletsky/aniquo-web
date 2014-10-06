angular.module('bdSourceEdit', [])
  .controller('SourceEditCtrl', [
    '$scope',
    '$location',
    '$routeParams',
    'Toast',
    'Restangular',
    SourceEditCtrl
  ]);

function SourceEditCtrl (
  $scope,
  $location,
  $routeParams,
  Toast,
  Restangular
) {
  'use strict';

  var actionType = $routeParams.sourceId ? 'edit' : 'add';

  $scope.source = {};
  $scope.source.alias = [''];

  if (actionType === 'edit') {
    Restangular
      .one('sources', $routeParams.sourceId)
      .get()
      .then(function (res) {
        res = res.plain();
        $scope.source = res;
        $scope.alias = res.alias;
      });
  }

  $scope.addAlias = function (e) {
    e.preventDefault();
    $scope.source.alias.push('');
  };

  $scope.removeAlias = function (e, index) {
    e.preventDefault();
    $scope.source.alias.splice(index, 1);
  };

  $scope.submit = function () {
    var alias = _.filter($scope.source.alias, function (value) {
      return $.trim(value);
    });

    var data = {
      name: $scope.source.name,
      alias: alias,
      info: $scope.source.info 
    };

    if (angular.isUndefined(data.name)) {
      return Toast.show('作品名称不能为空');
    }

    if (actionType === 'edit') {
      Restangular
        .one('sources', $routeParams.sourceId)
        .put(data)
        .then(function (res) {
          Toast.show('作品更新成功');
          return $location.path('/sources/' + $routeParams.sourceId + '/characters');
        });

    } else {
      Restangular
        .one('source/check')
        .get(data)
        .then(function (res) {
          res = res.plain();
          if (res.exist) {
            return Toast.show('该作品已存在');

          } else {
            Restangular
              .all('sources')
              .post(data)
              .then(function (res) {
                return Toast.show('作品添加成功');
              }, function (res) {
                return Toast.show('作品添加失败');
              });
          }
        });
    }
  };
}
