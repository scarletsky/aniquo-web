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
        res = res.plain();
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

  var page = 1;

  $scope.addCharacters = function () {

    if (!$scope.pageCount || page <= $scope.pageCount) {

      Restangular
        .one('characters')
        .get({page: page++})
        .then(function (res) {
          res = res.plain();
          $scope.pageCount = res.pageCount;
          $scope.objects = $scope.objects ? $scope.objects.concat(res.objects) : res.objects;
        });
    }

  }
}
