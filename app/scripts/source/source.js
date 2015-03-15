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
    'Query',
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
  Query,
  Restangular
) {
  'use strict';


  var q = new Query();
  $scope.q = q;

  $scope.getObjects = function () {

    return q.query({
      scope: $scope,
      route: 'sources'
    });

  };

  $scope.goToCharactersPage = function (id) {
    $location.path('/sources/' + id + '/characters');
  }

}
