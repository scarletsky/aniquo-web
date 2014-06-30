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
      .get()
      .then(function (quote) {
        $scope.quote = quote;

        Restangular
          .one('characters/' + quote.character_id)
          .get()
          .then(function (character) {
            $scope.character = character;
          });
    });
  });
