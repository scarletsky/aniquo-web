angular.module('bdQuoteEdit', [])
  .controller('QuoteEditCtrl', function (
    $scope,
    $location,
    Restangular
  ) {
    'use strict';

    $scope.submit = function () {
      var data = {
        characterId: $scope.quote.characterId,
        quote: $scope.quote.quote,
        reference: $scope.quote.reference
      };

      Restangular
        .all('quotes')
        .post(data)
        .then(function (res) {
          alert('添加成功！');
          $location.path('/');
        });
    };
  });