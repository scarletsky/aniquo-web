angular.module('bdNavigation', [])
  .controller('NavCtrl', [
    '$scope',
    '$timeout',
    '$materialSidenav',
    NavCtrl
  ]);

function NavCtrl ($scope, $timeout, $materialSidenav) {

  $scope.toggleLeft = function() {
    $materialSidenav('left').toggle();
  };

}
