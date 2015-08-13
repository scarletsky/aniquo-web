angular.module('bdSidenav', [])
    .controller('SidenavCtrl', [
        '$scope',
        '$state',
        '$mdSidenav',
        'Session',
        SidenavCtrl
    ]);

function SidenavCtrl (
    $scope,
    $state,
    $mdSidenav,
    Session
) {

    $scope.go = function (route) {
        $state.go(route)
        $mdSidenav('left').close();
    };

    $scope.goToUserProfile = function () {
        $state.transitionTo('userDetail', {userId: Session.currentUser._id});
        $mdSidenav('left').close();
    };
}
