angular.module('bdQuote', [
  'bdQuoteEdit'
])

  .controller('QuoteCtrl', [
    '$scope',
    '$routeParams',
    'Restangular',
    QuoteCtrl
  ])

  .controller('QuoteListCtrl', [
    '$scope',
    '$location',
    '$routeParams',
    'Query',
    'Restangular',
    QuoteListCtrl
  ]);

function QuoteCtrl (
  $scope,
  $routeParams,
  Restangular
) {
  'use strict';

  var quoteId = $routeParams.quoteId;
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
      console.log(res);
      $scope.quote = res;
    });
}

function QuoteListCtrl (
  $scope,
  $location,
  $routeParams,
  Query,
  Restangular
) {
  'use strict';

  var q = new Query();
  $scope.q = q;
  var characterId = $routeParams.characterId;

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
