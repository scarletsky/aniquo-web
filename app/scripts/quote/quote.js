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
      with_character: true,
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
  $routeParams,
  Query,
  Restangular
) {
  'use strict';

  var q = new Query();
  $scope.q = q;

  $scope.getObjects = function () {

    return q.query({
      scope: $scope,
      route: 'quotes'
    });

  }
  
}
