angular.module('bdUserAuth', [])
  .constant('AuthEvents', {
    loadUserSuccess: 'auth-load-user-success',
    loginSuccess: 'auth-login-success',
    loginFailed: 'auth-login-failed',
    logoutSuccess: 'auth-logout-success'
  })

  .factory('Session', function (
    $window,
    $location,
    $rootScope,
    AuthEvents,
    Restangular
  ) {
    'use strict';

    var service = {
      currentUser: null,

      isAuthenticated: function () {
        return !!this.currentUser;
      },

      logout: function () {
        this.currentUser = null;
        delete $window.sessionStorage.token;
        $rootScope.$broadcast(AuthEvents.logoutSuccess);
      },

      login: function (data) {
        Restangular
          .all('authenticate')
          .post(data)
          .then(function (res) {
            $rootScope.$broadcast(AuthEvents.loginSuccess, res);
          }, function (res) {
            $rootScope.$broadcast(AuthEvents.loginFailed, res);
          });
      }
    };

    $rootScope.$on(AuthEvents.loginSuccess, function (event, res) {
      $window.sessionStorage.token = res.token;
      service.currentUser = res.user; 
      $location.path('/');
    });

    $rootScope.$on(AuthEvents.loadUserSuccess, function (event, res) {
      service.currentUser = res;
    });

    $rootScope.$on(AuthEvents.loginFailed, function (event, res) {
      alert(res.data.error);
    });

    $rootScope.$on(AuthEvents.logoutSuccess, function () {
      $location.path('/');
    });

    return service;
  })

  .controller('AuthCtrl', function (
    $scope,
    $rootScope,
    Session,
    AuthEvents,
    Restangular
  ) {
    'use strict';

    $scope.login = function () {
      var data = {
        username: $scope.user.username,
        password: $scope.user.password
      };

      Session.login(data);
    };

    $scope.logout = function () {
      Session.logout();
    };

    $scope.signup = function () {
      var data = {
        username: $scope.user.username,
        password: $scope.user.password
      };

      Restangular
        .all('register')
        .post(data)
        .then(function (res) {
          $rootScope.$broadcast(AuthEvents.loginSuccess, res);
        }, function (res) {
          $rootScope.$broadcast(AuthEvents.loginFailed, res);
        });
    };
  });
