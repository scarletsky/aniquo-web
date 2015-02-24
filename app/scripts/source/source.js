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
  ])

  .controller('SourceListCtrl', [
    '$scope',
    '$location',
    '$routeParams',
    'G',
    'Restangular',
    SourceListCtrl
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

function SourceListCtrl (
  $scope,
  $location,
  $routeParams,
  G,
  Restangular
) {
  'use strict';


  var page = 1;

  $scope.addSources = function () {

    if (!$scope.pageCount || page <= $scope.pageCount) {

      Restangular
        .one('sources')
        .get({page: page++})
        .then(function (res) {
          res = res.plain();
          $scope.pageCount = res.pageCount;
          $scope.objects = $scope.objects ? $scope.objects.concat(res.objects) : res.objects;
        });
    }

  };
}
