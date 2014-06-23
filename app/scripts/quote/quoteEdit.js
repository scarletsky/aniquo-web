angular.module('bdQuoteEdit', [])
  .controller('QuoteEditCtrl', function (
    $scope,
    $location,
    $routeParams,
    Restangular
  ) {
    'use strict';

    var actionType = $routeParams.quoteId ? 'edit' : 'add';

    if (actionType === 'edit') {
      Restangular
        .one('quotes', $routeParams.quoteId)
        .get()
        .then(function (res) {
          $scope.quote = res;
          $scope.quote.characterId = res.character_id;

          Restangular
            .one('characters', res.character_id)
            .get()
            .then(function (res) {
              $scope.quote.characterName = res.name;
            });
        });
    }

    $scope.submit = function () {
      var data = {
        characterId: $scope.quote.characterId,
        quote: $scope.quote.quote,
        reference: $scope.quote.reference
      };

      if (actionType === 'edit') {
        Restangular
          .one('quotes', $routeParams.quoteId)
          .put(data)
          .then(function (res) {
            alert('更新成功！');
            $location.path('/quotes/' + $routeParams.quoteId);
          });
      } else {
        Restangular
          .all('quotes')
          .post(data)
          .then(function (res) {
            alert('添加成功！');
            $location.path('/');
          });
      }
    };
  });