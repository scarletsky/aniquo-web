angular.module('bdSourceEdit', [])
  .controller('SourceEditCtrl', function (
    $scope,
    $location,
    $routeParams,
    Restangular
  ) {
    'use strict';

    var actionType = $routeParams.sourceId ? 'edit' : 'add';

    $scope.source = {};
    $scope.source.alias = [];

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

      if (actionType === 'edit') {
        Restangular
          .one('sources', $routeParams.sourceId)
          .put(data)
          .then(function (res) {
            alert('更新成功！');
            $location.path('/sources/' + $routeParams.sourceId + '/characters');
          });
      } else {
        Restangular
          .one('source/check')
          .get(data)
          .then(function (res) {
            if (res.exist) {
              alert('该作品已存在！');
            } else {
              Restangular.all('sources').post(data).then(function (res) {
                alert('添加成功！');
                $location.path('/');
              });
            }
          });
      }
    };
  });
