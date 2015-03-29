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


  var editor = new Editor({
    scope: $scope,
    mode: $routeParams.quoteId ? 'edit' : 'new',
    targetId: $routeParams.quoteId,
    targetType: 'quote',
    getTargetSuccess: function (res) {
      res = res.plain();
      $scope.quote = res;
    }
  });


  $scope.reset = function () {
    $scope.quote = {};
  };

  $scope.submit = function () {

    if (angular.isUndefined($scope.quote.characterIds)) {
      return Toast.show('语录相关角色不能为空');
    }

    if (angular.isUndefined($scope.quote.quote)) {
      return Toast.show('语录内容不能为空');
    }

    // var characterIds = $scope.quote.characterIds.filter(function (id, index) {
    //   return angular.isDefined(id) && $scope.quote.characterIds.indexOf(id) === index;
    // });

    var data = {
      characterIds: $scope.quote.characterIds,
      quote: $scope.quote.quote,
      reference: $scope.quote.reference,
    };

    editor.save(data);

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
