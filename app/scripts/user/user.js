angular.module('bdUser', [
    'bdUserAuth',
    'bdUserVerify',
    'bdUserSettings',
    'bdUserContribute'
])
    .controller('UserCtrl', [
        '$scope',
        '$routeParams',
        'Session',
        'Restangular',
        UserCtrl
    ]);

function UserCtrl($scope, $routeParams, Session, Restangular) {

    $scope.user = {};

    if (Session.currentUser !== null &&
        Session.currentUser._id === $routeParams.userId) {

        $scope.user = Session.currentUser;
    } else {

        Restangular
            .one('users', $routeParams.userId)
            .get()
            .then(function (res) {
                res = res.plain();
                $scope.user = res;
            });
    }

}
