angular.module('bdUserSettings', [])
  .controller('UserSettingsCtrl', [
    '$scope',
    '$window',
    '$location',
    'Toast',
    'Session',
    'Restangular',
    UserSettingsCtrl
  ]);

function UserSettingsCtrl (
  $scope,
  $window,
  $location,
  Toast,
  Session,
  Restangular
) {
  'use strict';

  $scope.user = Session.currentUser;


  /*
   * Don't define userElement globally:
   */
  Restangular
    .one('user')
    .get()
    .then(function (res) {
      res = res.plain();
      $scope.user = res;
    });

  $scope.updateProfile = function () {
    var data = {
      username: $scope.user.username,
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
        res = res.plain();
        Session.currentUser = res;
        $location.path('/users/' + res._id);
        Toast.show('个人资料更新成功');
      }, function (res) {
        Toast.show('个人资料更新失败');
      });
  };

  $scope.updatePassword = function () {

    var data = {
      oldPassword: $scope.user.oldPassword,
      newPassword: $scope.user.newPassword
    };

    var userElement = Restangular.one('user');
    angular.extend(userElement, data);
    userElement
      .put()
      .then(function (res) {
        Toast.show('密码修改成功');
        delete $scope.user.oldPassword;
        delete $scope.user.newPassword;
        delete $scope.user.confirmPassword;
      }, function (res) {
        Toast.show('原密码错误');
      });
  };
}
