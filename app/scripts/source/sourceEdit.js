angular.module('bdSourceEdit', [])
  .controller('SourceEditCtrl', function (
    $scope,
    $location,
    $routeParams,
    Restangular
  ) {
    'use strict';

    var actionType = $routeParams.sourceId ? 'edit' : 'add';

    if (actionType === 'edit') {
      Restangular
        .one('sources', $routeParams.sourceId)
        .get()
        .then(function (res) {
          $scope.source = res;
        });
    }

    $scope.submit = function () {
      var data = {
        name: $scope.source.name,
        alias: $scope.source.alias,
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
          .then(function (data) {
            if (data.exist) {
              alert('该作品已存在！');
            } else {
              Restangular.all('sources').post(data).then(function (data) {
                alert('添加成功！');
                $location.path('/');
              });
            }
        });
      }
    };
  });
