angular.module('bdCharacter', [
  'bdCharacterEdit'
])
  .controller('CharacterCtrl', function (
    $scope,
    $location,
    $routeParams,
    G,
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
      $location.path('/characters/' + characterId + '/quotes').search('page', null);
    }

    $scope.prevPage = function () {
      $location.path('/characters/' + characterId + '/quotes').search('page', --page);
    };

    $scope.nextPage = function () {
      $location.path('/characters/' + characterId + '/quotes').search('page', ++page);
    };

    if (!$scope.g.currentCharacter || $scope.g.currentCharacter._id !== characterId) {
      Restangular
        .one('characters/' + characterId)
        .get({with_source: true})
        .then(function (res) {
          $scope.g.currentSource = res.source;
          $scope.g.currentCharacter = res;
        });
    }

    Restangular
      .one('characters/' + characterId +'/quotes' + 
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
