angular.module('bdUserContribute', [])
  .controller('UserContributeCtrl', [
    '$scope',
    '$window',
    '$location',
    '$routeParams',
    'G',
    'Session',
    'Restangular',
    UserContributeCtrl
  ]);

function UserContributeCtrl (
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
   * Hint:
   *   contributionPaginationId is different from paginationId
   *   contributionCurrentPage is different from currentPage
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

  if (!sessionStorage.contributionCurrentPage) {
    sessionStorage.contributionCurrentPage = 1;
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
         '&paginationId=' + sessionStorage.contributionPaginationId +
         '&currentPage=' + sessionStorage.contributionCurrentPage)
    .get()
    .then(function (res) {
      $scope.objects = res.objects;
      sessionStorage.contributionPaginationId = res.objects[0]._id;
      sessionStorage.contributionCurrentPage = page;

      var pageNum = Math.ceil(res.total / res.perPage);
      $scope.hasPrevPage = page > 1;
      $scope.hasNextPage = page < pageNum;
  });
}
