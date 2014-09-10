angular.module('bdQuote', [
  'bdQuoteEdit'
])

  .controller('QuoteCtrl', [
    '$scope',
    '$routeParams',
    'Restangular',
    QuoteCtrl
  ]);

function QuoteCtrl (
  $scope,
  $routeParams,
  Restangular
) {
  'use strict';

  var quoteId = $routeParams.quoteId;

  Restangular
    .one('quotes/' + quoteId)
    .get({
      with_character: true,
      with_contributor: true
    })
    .then(function (res) {
      $scope.quote = res;
      $scope.g.currentCharacter = res.character;
  });
}
