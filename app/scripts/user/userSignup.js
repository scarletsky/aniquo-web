angular.module('bdUserSignup', [])
  .controller('SignupCtrl', function (
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
        .all('register')
        .post(data)
        .then(function (res) {
          if (res.token) {
            $window.sessionStorage.token = res.token;
            alert('注册成功！');
            $location.path('/');
          } else {
            delete $window.sessionStorage.token;
            alert('注册失败！\n原因：' + res.error);
          }
        });
    };
  });
