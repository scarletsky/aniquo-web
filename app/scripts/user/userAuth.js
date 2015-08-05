angular.module('bdUserAuth', [])
    .constant('AuthEvents', {
        loadUserSuccess: 'auth-load-user-success',
        loginSuccess: 'auth-login-success',
        loginFailed: 'auth-login-failed',
        logoutSuccess: 'auth-logout-success',
        tokenExpired: 'auth-token-expired'
    })

    .factory('Session', [
        '$window',
        '$location',
        '$rootScope',
        'Toast',
        'AuthEvents',
        'Restangular',
        SessionService
    ])

    .controller('AuthCtrl', [
        '$scope',
        '$location',
        '$rootScope',
        'Toast',
        'Session',
        'AuthEvents',
        'Restangular',
        AuthCtrl
    ]);

function SessionService (
    $window,
    $location,
    $rootScope,
    Toast,
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
            delete $window.localStorage.token;
            $rootScope.$broadcast(AuthEvents.logoutSuccess);
        },

        login: function (data) {
            Restangular
                .all('login')
                .post(data)
                .then(function (res) {
                    res = res.plain();
                    $rootScope.$broadcast(AuthEvents.loginSuccess, res);
                }, function (res) {
                    $rootScope.$broadcast(AuthEvents.loginFailed, res);
                });
        }
    };

    $rootScope.$on(AuthEvents.loginSuccess, function (event, res) {
        $window.localStorage.token = res.token;
        service.currentUser = res.user;
        var nextPath = $location.search().next || '/';
        $location.search('next', null);
        $location.path(nextPath);
    });

    $rootScope.$on(AuthEvents.loadUserSuccess, function (event, res) {
        service.currentUser = res;
    });

    $rootScope.$on(AuthEvents.loginFailed, function (event, res) {
        Toast.show(res.data.error);
    });

    $rootScope.$on(AuthEvents.tokenExpired, function (event, res) {
        delete $window.localStorage.token;
    });

    $rootScope.$on(AuthEvents.logoutSuccess, function () {

    });

    return service;
}

function AuthCtrl (
    $scope,
    $location,
    $rootScope,
    Toast,
    Session,
    AuthEvents,
    Restangular
) {
    'use strict';

    $scope.user = {};

    $scope.reset = function () {
        $scope.user = {};
    };
    $scope.login = function () {

        if (angular.isUndefined($scope.user.username)) {
            return Toast.show('请输入用户名');
        }

        if (angular.isUndefined($scope.user.password)) {
            return Toast.show('请输入密码');
        }

        var data = {
            username: $scope.user.username,
            password: $scope.user.password
        };

        return Session.login(data);
    };

    $scope.logout = function (e) {
        e.preventDefault();
        Session.logout();
    };

    $scope.signup = function () {
        if (angular.isUndefined($scope.user.username)) {
            return Toast.show('请输入用户名');
        }

        if (angular.isUndefined($scope.user.password)) {
            return Toast.show('请输入密码');
        }

        if (angular.isUndefined($scope.user.password2)) {
            return Toast.show('请确认密码');
        }

        if ($scope.user.password !== $scope.user.password2) {
            return Toast.show('两次密码不一致');
        }

        if (angular.isUndefined($scope.user.incode)) {
            return Toast.show('邀请码不能为空');
        }

        var data = {
            username: $scope.user.username,
            password: $scope.user.password,
            incode: $scope.user.incode
        };

        Restangular
            .all('signup')
            .post(data)
            .then(function (res) {
                res = res.plain();
                $rootScope.$broadcast(AuthEvents.loginSuccess, res);
            }, function (res) {
                $rootScope.$broadcast(AuthEvents.loginFailed, res);
            });
    };

    function isAuthPage() {
        var currentPage = $location.path();
        return currentPage === '/login' || currentPage === '/signup';
    }

    if (isAuthPage() && Session.isAuthenticated()) {
        return $location.path('/');
    }
}
