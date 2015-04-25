angular.module('bdQuoteEdit', [])
  .controller('QuoteEditCtrl', [
    '$scope',
    '$location',
    '$routeParams',
    'Toast',
    'Editor',
    'ImageViewer',
    'Restangular',
    QuoteEditCtrl
  ]);

function QuoteEditCtrl (
  $scope,
  $location,
  $routeParams,
  Toast,
  Editor,
  ImageViewer,
  Restangular
) {
  'use strict';

  function resetAvatarSize(characters) {

    return characters.map(function (c) {
      if (c.avatar) {
        c.avatar += '?imageView2/1/w/40/h/40';
      } else {
        c.avatar = 'http://placehold.it/40x40';
      }
      return c;
    });
  }

  function getNonExistCharacters(characters) {
    var existCharacterIds = $scope.quote.characters.map(function (c) {
      return c._id;
    });

    return characters.filter(function (c) {
      return existCharacterIds.indexOf(c._id) === -1;
    });

  }

  $scope.quote = {};

  var editor = new Editor({
    scope: $scope,
    mode: $routeParams.quoteId ? 'edit' : 'new',
    targetId: $routeParams.quoteId,
    targetType: 'quote',
    queryParams: 'with_character_all=true',
    getTargetSuccess: function (res) {
      res = res.plain();
      res.characters = resetAvatarSize(res.characters);
      $scope.quote = res;
    }
  });

  $scope.reset = function () {
    $scope.quote = {};
  };

  $scope.submit = function () {

    if (angular.isUndefined($scope.quote.characters) || $scope.quote.characters.length === 0) {
      return Toast.show('语录相关角色不能为空');
    }

    if (angular.isUndefined($scope.quote.quote)) {
      return Toast.show('语录内容不能为空');
    }

    var characterIds = $scope.quote.characters.map(function (c) {
      return c._id;
    });

    var data = {
      characterIds: characterIds,
      quote: $scope.quote.quote,
      reference: $scope.quote.reference,
    };

    editor.save(data);

  };

  $scope.queryCharacters = function (query) {
    return Restangular.all('/search')
      .getList({t: 'character', kw: query})
      .then(function (res) {
        var _characters = res.plain();
        var nonExistCharacters = getNonExistCharacters(_characters);
        return resetAvatarSize(nonExistCharacters);
    });
  };

  // $scope.submit = function () {
  //   var characterIds = $scope.quote.characterIds.filter(function (id, index) {
  //     return angular.isDefined(id) && $scope.quote.characterIds.indexOf(id) === index;
  //   });
  //   var data = {
  //     characterIds: characterIds,
  //     quote: $scope.quote.quote,
  //     reference: $scope.quote.reference,
  //     scene: $scope.quote.scene
  //   };

  //   if (actionType === 'edit') {
  //     var quoteElement = Restangular.one('quotes', $routeParams.quoteId)
  //     angular.extend(quoteElement, data)
  //     quoteElement
  //       .put()
  //       .then(function (res) {
  //         res = res.plain();
  //         Toast.show('语录更新成功');
  //         return $location.path('/quotes/' + $routeParams.quoteId);
  //       });

  //   } else {
  //     Restangular
  //       .all('quotes')
  //       .post(data)
  //       .then(function (res) {
  //         res = res.plain();
  //         Toast.show('语录添加成功');
  //         return $location.path('/quotes/' + res._id);
  //       }, function (res) {
  //         return Toast.show('语录添加失败');
  //       });
  //   }
  // };
}
