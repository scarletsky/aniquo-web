angular.module('bdSource', [
  'bdSourceEdit'
])

  .controller('SourceCtrl', [
    '$scope',
    '$location',
    '$routeParams',
    'G',
    'Restangular',
    SourceCtrl
  ]);

function SourceCtrl (
  $scope,
  $location,
  $routeParams,
  G,
  Restangular
) {
  'use strict';

  $scope.g = G;
  var sourceId = $routeParams.sourceId;

  if (!$scope.g.currentSource || $scope.g.currentSource._id !== sourceId) {
    $scope.g.currentSource = null;
    Restangular
      .one('sources/' + sourceId)
      .get()
      .then(function (res) {
        res = res.plain();
        $scope.g.currentSource = res;
      });
  }
}
