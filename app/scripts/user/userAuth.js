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
    ])

    .directive('bdCheckPassword', [
        bdCheckPasswordDirective
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

        isLogin: function () {
            return !!this.currentUser;
        },

        login: function (res) {
            this.currentUser = res.user;
            $window.localStorage.token = res.token;
        },

        logout: function () {
            this.currentUser = null;
            delete $window.localStorage.token;
            $rootScope.$broadcast(AuthEvents.logoutSuccess);
        }

    };

    $rootScope.$on(AuthEvents.loginSuccess, function (event, res) {
        service.login(res);
        var nextPath = $location.search().next || '/';
        $location.search({});
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
    $scope.submitting = false;

    $scope.login = function () {

        if ($scope.loginForm.$invalid) return;

        var data = {
            email: $scope.user.email,
            password: $scope.user.password
        };

        $scope.submitting = true;

        Restangular
            .all('login')
            .post(data)
            .then(function (res) {
                $scope.submitting = false;
                res = res.plain();
                $rootScope.$broadcast(AuthEvents.loginSuccess, res);
            }, function (res) {
                $scope.submitting = false;
                $rootScope.$broadcast(AuthEvents.loginFailed, res);
            });

    };

    $scope.logout = function (e) {
        e.preventDefault();
        Session.logout();
    };

    $scope.signup = function () {

        if ($scope.signupForm.$invalid) return;

        var data = {
            email: $scope.user.email,
            password: $scope.user.password,
            incode: $scope.user.incode
        };

        $scope.submitting = true;

        Restangular
            .all('signup')
            .post(data)
            .then(function (res) {
                $scope.submitting = false;
                res = res.plain();
                $rootScope.$broadcast(AuthEvents.loginSuccess, res);
            }, function (res) {
                $scope.submitting = false;
                $rootScope.$broadcast(AuthEvents.loginFailed, res);
            });
    };

    function isAuthPage() {
        var currentPage = $location.path();
        return currentPage === '/login' || currentPage === '/signup';
    }

    if (isAuthPage() && Session.isLogin()) {
        return $location.path('/');
    }
}

function bdCheckPasswordDirective () {
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function ($scope, $element, $attrs, ngModel) {
            ngModel.$validators.checkPassword = function (modelValue) {
                return $scope.user.password === modelValue;
            }
        }
    }
}
