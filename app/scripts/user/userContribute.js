angular.module('bdUserContribute', [])
  .controller('UserContributeCtrl', function (
    $scope,
    $location,
    $routeParams,
    G,
    Session,
    Restangular
  ) {
    'use strict';

    $scope.g = G;
    var characterId = $routeParams.characterId;
    var page = $location.search().page || 1;

    if (!$scope.g.currentPage) {
      $scope.g.currentPage = 1;
    }

    if (page !== 1 && !$scope.g.paginationId) {
      $location.path('/user/contribution').search('page', null);
    }

    $scope.prevPage = function () {
      $location.path('user/contribution').search('page', --page);
    };

    $scope.nextPage = function () {
      $location.path('user/contribution').search('page', ++page);
    };

    Restangular
      .one('users/' + Session.currentUser._id +'/contribution/quotes' + 
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
  });
