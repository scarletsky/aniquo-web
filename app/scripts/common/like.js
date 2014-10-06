angular.module('bdLike', [])
  .directive('bdLike', [
    'Restangular',
    bdLikeDirective
  ]);

function bdLikeDirective (Restangular) {

  return {
    scope: {
      object: '=bdLike'
    },
    restrict: 'A',
    template: [
      '<material-button>',
          '<span ng-if="object.liked">取消赞</span>',
          '<span ng-if="!object.liked">赞</span>',
          '<span ng-bind-template="({{ object.likeCount }})"></span>',
      '</material-button>',
    ].join(''),
    link: function ($scope, $element, $attrs) {
      var likeType = $attrs.bdLikeType;

      $element.on('click', function (e) {

        $scope.$apply(function () {

          if (angular.isDefined($scope.object)) {

            if ($scope.object.liked === false) {
              Restangular
                .one('user/like/' + likeType + '/' + $scope.object._id)
                .put()
                .then(function (res) {
                  res = res.plain();
                  $scope.object.liked = res.liked;
                  $scope.object.likeCount = res.likeCount;
                });

            } else {

              Restangular
                .one('user/like/' + likeType + '/' + $scope.object._id)
                .remove()
                .then(function (res) {
                  res = res.plain();
                  $scope.object.liked = res.liked;
                  $scope.object.likeCount = res.likeCount;
                });

            }

          }
        });

      });
    }
  };

}
