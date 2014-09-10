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
  var page = $location.search().page || 1;

  Restangular
    .one('sources/' + sourceId)
    .get()
    .then(function (res) {
      $scope.g.currentSource = res;
    });

  if (!$scope.g.currentPage) {
    $scope.g.currentPage = 1;
  }

  if (page !== 1 && !$scope.g.paginationId) {
    $location.path('/sources/' + sourceId + '/characters').search('page', null);
  }

  $scope.prevPage = function () {
    $location.path('/sources/' + sourceId + '/characters').search('page', --page);
  };

  $scope.nextPage = function () {
    $location.path('/sources/' + sourceId + '/characters').search('page', ++page);
  };

  if (!$scope.g.currentSource || $scope.g.currentSource._id !== sourceId) {
    Restangular
      .one('sources/' + sourceId)
      .get()
      .then(function (res) {
        $scope.g.currentSource = res;
      });
  }

  Restangular
    .one('sources/' + sourceId +'/characters' + 
         '?page=' + page +
         '&paginationId=' + $scope.g.paginationId +
         '&currentPage=' + $scope.g.currentPage)
    .get()
    .then(function (res) {
      $scope.objects = res.objects;
      $scope.g.paginationId = res.objects[0]._id;
      $scope.g.currentPage = page;

      var pageNum = Math.ceil(res.total / res.perPage);
      $scope.hasPrevPage = page > 1;
      $scope.hasNextPage = page < pageNum;
  });
}
