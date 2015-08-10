angular.module('bdSidenav', [])
    .controller('SidenavCtrl', [
        '$scope',
        '$location',
        '$mdSidenav',
        'Session',
        SidenavCtrl
    ]);

function SidenavCtrl (
    $scope,
    $location,
    $mdSidenav,
    Session
) {

    $scope.locationTo = function (url) {
        $location.path(url);
        $mdSidenav('left').close();
    };

    $scope.goToUserProfile = function () {
        console.log(Session);
        $location.path('/users/' + Session.currentUser._id);
        $mdSidenav('left').close();
    };
}
