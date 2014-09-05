angular.module('bdSourceEdit', [])
  .controller('SourceEditCtrl', function (
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
        return Toast.alert('作品名称不能为空');
      }

      if (actionType === 'edit') {
        Restangular
          .one('sources', $routeParams.sourceId)
          .put(data)
          .then(function (res) {
            Toast.alert('作品更新成功');
            return $location.path('/sources/' + $routeParams.sourceId + '/characters');
          });

      } else {
        Restangular
          .one('source/check')
          .get(data)
          .then(function (res) {
            if (res.exist) {
              return Toast.alert('该作品已存在');

            } else {
              Restangular
                .all('sources')
                .post(data)
                .then(function (res) {
                  return Toast.alert('作品添加成功');
                }, function (res) {
                  return Toast.alert('作品添加失败');
                });
            }
          });
      }
    };
  });
