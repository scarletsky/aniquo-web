angular.module('bdSource', [
  'bdSourceEdit'
])
  .controller('SourceCtrl', function (
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

    Restangular.one('sources/' + sourceId).get().then(function (data) {
      $scope.g.currentSource = data;
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
      Restangular.one('sources/' + sourceId).get().then(function (data) {
        $scope.g.currentSource = data;
      });
    }

    Restangular
      .one('sources/' + sourceId +'/characters' + 
           '?page=' + page +
           '&paginationId=' + $scope.g.paginationId +
           '&currentPage=' + $scope.g.currentPage)
      .get()
      .then(function (data) {
        $scope.objects = data.objects;
        $scope.g.paginationId = data.objects[0]._id;
        $scope.g.currentPage = page;

        var pageNum = Math.ceil(data.total / data.perPage);
        $scope.hasPrevPage = page > 1;
        $scope.hasNextPage = page < pageNum;
    });
  });