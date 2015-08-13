angular.module('bdUser', [
    'bdUserAuth',
    'bdUserVerify',
    'bdUserSettings',
    'bdUserContribute'
])
    .controller('UserCtrl', [
        '$scope',
        '$stateParams',
        'Session',
        'Restangular',
        UserCtrl
    ]);

function UserCtrl($scope, $stateParams, Session, Restangular) {

    $scope.user = {};

    if (Session.currentUser !== null &&
        Session.currentUser._id === $stateParams.userId) {

        $scope.user = Session.currentUser;
    } else {

        Restangular
            .one('users', $stateParams.userId)
            .get()
            .then(function (res) {
                res = res.plain();
                $scope.user = res;
            });
    }

}
