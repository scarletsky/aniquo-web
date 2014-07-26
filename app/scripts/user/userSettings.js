angular.module('bdUserSettings', [])
  .controller('UserSettingsCtrl', function (
    $scope,
    $window,
    Restangular
  ) {
    'use strict';

    $scope.user = {};

    /*
     * Don't define userElement globally:
     */
    Restangular
      .one('user')
      .get()
      .then(function (res) {
        $scope.user.nickname = res.nickname;
        $scope.user.site = res.site;
        $scope.user.info = res.info;
        $scope.user.avatar = res.avatar;
      });

    $scope.updateProfile = function () {
      var data = {
        nickname: $scope.user.nickname,
        site: $scope.user.site,
        info: $scope.user.info,
        avatar: $scope.user.avatar
      };

      var userElement = Restangular.one('user');
      angular.extend(userElement, data);
      userElement
        .put()
        .then(function (res) {
          $scope.user.nickname = res.nickname;
          $scope.user.site = res.site;
          $scope.user.info = res.info;
          alert('个人资料修改成功!');
        });
    };

    $scope.updatePassword = function () {
      if ($scope.user.newPassword !== $scope.user.confirmPassword) {
        alert('两次密码不一样!');
        return;
      }

      if ($scope.user.oldPassword === $scope.user.newPassword) {
        alert('新密码不能和旧密码一样!');
        return;
      }

      var data = {
        oldPassword: $scope.user.oldPassword,
        newPassword: $scope.user.newPassword
      };

      var userElement = Restangular.one('user');
      angular.extend(userElement, data);
      userElement
        .put()
        .then(function (res) {
          $scope.user.oldPassword = '';
          $scope.user.newPassword = '';
          $scope.user.confirmPassword = '';
          $scope.userPasswordForm.$setPristine();
          alert('密码修改成功!');
        }, function (res) {
          alert('密码错误!');
        });
    };
  });
