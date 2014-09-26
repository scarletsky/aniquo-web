angular.module('bdCharacter', [
  'bdCharacterEdit'
])
  .controller('CharacterCtrl', [
    '$scope',
    '$location',
    '$routeParams',
    'G',
    'Restangular',
    CharacterCtrl
  ]);

function CharacterCtrl (
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
         '?page=' + page)
    .get()
    .then(function (res) {
      $scope.objects = res.objects;

      var pageNum = Math.ceil(res.total / res.perPage);
      $scope.hasPrevPage = page > 1;
      $scope.hasNextPage = page < pageNum;
  });
}
