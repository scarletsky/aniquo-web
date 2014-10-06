angular.module('bdUserContribute', [])
  .controller('UserContributeCtrl', [
    '$scope',
    '$location',
    '$routeParams',
    'G',
    'Session',
    'Restangular',
    UserContributeCtrl
  ]);

function UserContributeCtrl (
  $scope,
  $location,
  $routeParams,
  G,
  Session,
  Restangular
) {
  'use strict';

  $scope.g = G;
  var contributionType = $routeParams.contributionType;
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

  $scope.prevPage = function () {
    $location.path('user/contribution/' + contributionType).search('page', --page);
  };

  $scope.nextPage = function () {
    $location.path('user/contribution/' + contributionType).search('page', ++page);
  };

  Restangular
    .one('users/' + Session.currentUser._id +'/contribution/' + contributionType + 
         '?page=' + page)
    .get()
    .then(function (res) {
      res = res.plain();
      $scope.objects = res.objects;

      var pageNum = Math.ceil(res.total / res.perPage);
      $scope.hasPrevPage = page > 1;
      $scope.hasNextPage = page < pageNum;
  });
}
