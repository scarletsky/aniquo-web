angular.module('bdQuote', [
  'bdQuoteEdit'
])
  .controller('QuoteCtrl', function (
    $scope,
    $routeParams,
    Restangular
  ) {
    'use strict';

    var quoteId = $routeParams.quoteId;

    Restangular
      .one('quotes/' + quoteId)
      .get({with_character: true})
      .then(function (res) {
        $scope.quote = res;
        $scope.g.currentCharacter = res.character;
    });
  });
