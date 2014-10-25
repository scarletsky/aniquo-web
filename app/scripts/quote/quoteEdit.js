angular.module('bdQuoteEdit', [])
  .controller('QuoteEditCtrl', [
    '$scope',
    '$location',
    '$routeParams',
    'Toast',
    'Restangular',
    QuoteEditCtrl
  ]);

function QuoteEditCtrl (
  $scope,
  $location,
  $routeParams,
  Toast,
  Restangular
) {
  'use strict';

  var actionType = $routeParams.quoteId ? 'edit' : 'add';

  $scope.quote = {};
  $scope.quote.characterIds = [];
  $scope.quote.characterNames = [''];

  if (actionType === 'edit') {
    Restangular
      .one('quotes', $routeParams.quoteId)
      .get({'with_character_all': true})
      .then(function (res) {
        res = res.plain();
        $scope.quote = res;
        $scope.quote.characterIds = res.character ? res.character.map(function (object) { return object._id; }) : [];
        $scope.quote.characterNames = res.character ? res.character.map(function (object) { return object.name; }) : [];
      });
  }

  $scope.addCharacter = function (e) {
    e.preventDefault();
    $scope.quote.characterNames.push('');
  };

  $scope.removeCharacter = function (e, index) {
    e.preventDefault();
    $scope.quote.characterNames.splice(index, 1);
    $scope.quote.characterIds.splice(index, 1);
  };

  $scope.submit = function () {
    var characterIds = $scope.quote.characterIds.filter(function (id, index) {
      return angular.isDefined(id) && $scope.quote.characterIds.indexOf(id) === index;
    });
    var data = {
      characterIds: characterIds,
      quote: $scope.quote.quote,
      reference: $scope.quote.reference,
      scene: $scope.quote.scene
    };

    if (angular.isUndefined(data.quote)) {
      return Toast.show('语录不能为空');
    }

    if (angular.isUndefined(data.characterIds) || data.characterIds.length === 0) {
      return Toast.show('语录所属角色不能为空');
    }

    if (actionType === 'edit') {
      Restangular.one('quotes', $routeParams.quoteId)
        .put(data)
        .then(function (res) {
          res = res.plain();
          Toast.show('语录更新成功');
          return $location.path('/quotes/' + $routeParams.quoteId);
        });

    } else {
      Restangular
        .all('quotes')
        .post(data)
        .then(function (res) {
          res = res.plain();
          Toast.show('语录添加成功');
          return $location.path('/quotes/' + res._id);
        }, function (res) {
          return Toast.show('语录添加失败');
        });
    }
  };
}
