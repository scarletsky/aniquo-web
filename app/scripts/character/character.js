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
  ])

  .controller('CharacterListCtrl', [
    '$scope',
    '$location',
    '$routeParams',
    'G',
    'Restangular',
    CharacterListCtrl
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

  if (!$scope.g.currentCharacter || $scope.g.currentCharacter._id !== characterId) {
    $scope.g.currentCharacter = null;
    Restangular
      .one('characters/' + characterId)
      .get({with_source: true})
      .then(function (res) {
        $scope.g.currentSource = res.source;
        $scope.g.currentCharacter = res;
      });
  }
}

function CharacterListCtrl (
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

  $scope.prevPage = function () {
    $location.path('/sources/' + sourceId + '/characters').search('page', --page);
  };

  $scope.nextPage = function () {
    $location.path('/sources/' + sourceId + '/characters').search('page', ++page);
  };

  Restangular
    .one('sources/' + sourceId +'/characters' + 
         '?page=' + page)
    .get()
    .then(function (res) {
      $scope.objects = res.objects;

      var pageNum = Math.ceil(res.total / res.perPage);
      $scope.hasPrevPage = page > 1;
      $scope.hasNextPage = page < pageNum;
  });
}
