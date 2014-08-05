angular.module('bdUserContribute', [])
  .controller('UserContributeCtrl', function (
    $scope,
    $window,
    $location,
    $routeParams,
    G,
    Session,
    Restangular
  ) {
    'use strict';

    /*
     * TO FIX:
     * currentPage and pagination in sessionStorage will cause another bug.
     *
     */
    $scope.g = G;
    var sessionStorage = $window.sessionStorage;
    var characterId = $routeParams.characterId;
    var page = $location.search().page || 1;

    if (!sessionStorage.currentPage) {
      sessionStorage.currentPage = 1;
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
           '&paginationId=' + sessionStorage.paginationId +
           '&currentPage=' + sessionStorage.currentPage)
      .get()
      .then(function (res) {
        $scope.objects = res.objects;
        sessionStorage.paginationId = res.objects[0]._id;
        sessionStorage.currentPage = page;

        var pageNum = Math.ceil(res.total / res.perPage);
        $scope.hasPrevPage = page > 1;
        $scope.hasNextPage = page < pageNum;
    });
  });
