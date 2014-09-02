angular.module('bdNavigation', [])
  .controller('NavCtrl', function ($scope, $timeout, $materialSidenav) {

    $scope.toggleLeft = function() {
      $materialSidenav('left').toggle();
    };

  });
