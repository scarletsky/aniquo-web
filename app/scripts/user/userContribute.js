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
    var contributionType = $routeParams.contributionType;
    var sessionStorage = $window.sessionStorage;
    var page = $location.search().page || 1;

    switch (contributionType) {
      case 'sources':
        $scope.selectedIndex = 0;
        break;
      case 'characters':
        $scope.selectedIndex = 1;
        break;
      case 'quotes':
        $scope.selectedIndex = 2;
        break;
      default:
        $scope.selectedIndex = 0;
    }

    if (!sessionStorage.currentPage) {
      sessionStorage.currentPage = 1;
    }

    $scope.prevPage = function () {
      $location.path('user/contribution/' + contributionType).search('page', --page);
    };

    $scope.nextPage = function () {
      $location.path('user/contribution/' + contributionType).search('page', ++page);
    };

    Restangular
      .one('users/' + Session.currentUser._id +'/contribution/' + contributionType + 
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
