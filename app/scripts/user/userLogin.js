angular.module('bdUserLogin', [])
  .controller('LoginCtrl', function (
    $scope,
    $window,
    $location,
    Restangular
  ) {
    'use strict';

    $scope.submit = function () {
      var data = {
        username: $scope.user.username,
        password: $scope.user.password
      };

      Restangular
        .all('authenticate')
        .post(data)
        .then(function (res) {
          if (res.token) {
            $window.sessionStorage.token = res.token;
            alert('登录成功！');
            $location.path('/');
          } else {
            delete $window.sessionStorage.token;
            alert('登录失败！\n原因：' + res.error);
          }
        });
    };

  });
