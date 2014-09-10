angular.module('bdUserSettings', [])
  .controller('UserSettingsCtrl', [
    '$scope',
    '$window',
    'Toast',
    'Restangular',
    UserSettingsCtrl
  ]);

function UserSettingsCtrl (
  $scope,
  $window,
  Toast,
  Restangular
) {
  'use strict';

  $scope.user = {};
  $scope.selectedIndex = 0;

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
        Toast.alert('个人资料更新成功');
      }, function (res) {
        Toast.alert('个人资料更新失败');
      });
  };

  $scope.updatePassword = function () {

    if (angular.isUndefined($scope.user.oldPassword)) {
      return Toast.alert('请输入旧密码');
    }

    if (angular.isUndefined($scope.user.newPassword)) {
      return Toast.alert('请输入新密码');
    }

    if (angular.isUndefined($scope.user.confirmPassword)) {
      return Toast.alert('请确认新密码');
    }

    if ($scope.user.newPassword !== $scope.user.confirmPassword) {
      return Toast.alert('两次密码不一样');
    }

    if ($scope.user.oldPassword === $scope.user.newPassword) {
      return Toast.alert('新密码不能和旧密码一样');
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
        Toast.alert('密码修改成功');
        $scope.user.oldPassword = '';
        $scope.user.newPassword = '';
        $scope.user.confirmPassword = '';
        $scope.userPasswordForm.$setPristine();
      }, function (res) {
        Toast.alert('原密码错误');
      });
  };
}
