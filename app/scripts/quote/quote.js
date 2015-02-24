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
  Restangular
) {
  'use strict';

  var page = 1;

  $scope.addQuotes = function () {

    if (!$scope.pageCount || page <= $scope.pageCount) {

      Restangular
        .one('quotes')
        .get({page: page++})
        .then(function (res) {
          res = res.plain();
          $scope.pageCount = res.pageCount;
          $scope.objects = $scope.objects ? $scope.objects.concat(res.objects) : res.objects;
        });
    }

  }
}
