angular.module('bdNavigation', [])
  .controller('NavCtrl', [
    '$scope',
    '$mdSidenav',
    NavCtrl
  ]);

function NavCtrl ($scope, $mdSidenav) {

  $scope.toggleLeft = function() {
    $mdSidenav('left').toggle();
  };

}
