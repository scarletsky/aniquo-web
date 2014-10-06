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

  Restangular
    .one('quotes/' + quoteId)
    .get({
      with_character: true,
      with_contributor: true
    })
    .then(function (res) {
      res = res.plain();
      $scope.quote = res;
      $scope.g.currentCharacter = res.character;
  });
}

function QuoteListCtrl (
  $scope,
  $location,
  $routeParams,
  Restangular
) {
  'use strict';

  var characterId = $routeParams.characterId;
  var page = $location.search().page || 1;

  $scope.prevPage = function () {
    $location.path('/characters/' + characterId + '/quotes').search('page', --page);
  };

  $scope.nextPage = function () {
    $location.path('/characters/' + characterId + '/quotes').search('page', ++page);
  };

  Restangular
    .one('characters/' + characterId +'/quotes' + 
         '?page=' + page)
    .get()
    .then(function (res) {
      res = res.plain();
      $scope.objects = res.objects;

      var pageNum = Math.ceil(res.total / res.perPage);
      $scope.hasPrevPage = page > 1;
      $scope.hasNextPage = page < pageNum;
  });

}
