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
    'Query',
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
  Query,
  Restangular
) {
  'use strict';

  var q = new Query();
  $scope.q = q;

  var sourceId = $routeParams.sourceId;

  $scope.getObjects = function () {

    if (angular.isDefined(sourceId)) {
      q.query({
        scope: $scope,
        route: 'sources/' + sourceId + '/characters'
      });
   
    } else {

      q.query({
        scope: $scope,
        route: 'characters'
      });
    }
  }

  $scope.goToQuotesPage = function (id) {
    $location.path('/characters/' + id + '/quotes');
  }
}
