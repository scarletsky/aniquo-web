angular.module('bdQuote', [
  'bdQuoteEdit'
])

  .controller('QuoteCtrl', [
    '$scope',
    '$stateParams',
    'Restangular',
    QuoteCtrl
  ])

  .controller('QuoteListCtrl', [
    '$scope',
    '$location',
    '$stateParams',
    'Query',
    'Restangular',
    QuoteListCtrl
  ]);

function QuoteCtrl (
  $scope,
  $stateParams,
  Restangular
) {
  'use strict';

  var quoteId = $stateParams.quoteId;
  var characterId = $scope.g.currentCharacter ? $scope.g.currentCharacter._id : null;

  Restangular
    .one('quotes/' + quoteId)
    .get({
      with_character_all: true,
      with_contributor: true,
      characterId: characterId
    })
    .then(function (res) {
      res = res.plain();
      $scope.quote = res;
    });
}

function QuoteListCtrl (
  $scope,
  $location,
  $stateParams,
  Query,
  Restangular
) {
  'use strict';

  var q = new Query();
  $scope.q = q;
  var characterId = $stateParams.characterId;
  $scope.characterId = characterId;

  $scope.getObjects = function () {

    if (angular.isDefined(characterId)) {
      q.query({
        scope: $scope,
        route: 'characters/' + characterId + '/quotes'
      });

    } else {

      q.query({
        scope: $scope,
        route: 'quotes'
      });
    }
  };

  $scope.goToQuoteDetailPage = function (id) {
    $location.path('/quotes/' + id);
  }

}
