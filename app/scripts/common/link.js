angular.module('bdLink', [])
  .directive('bdLinkify', [
    '$location',
    bdLinkifyDirective
  ]);

function bdLinkifyDirective ($location) {

  return {
    scope: false,
    restrict: 'A',
    link: function ($scope, $element, $attrs) {
      var link = $attrs.bdLinkify;

      $element.on('click', function (e) {
        $scope.$apply(function () {
          $location.path(link).search('kw', null).search('t', null).search('page', null);
        });
      });

    }
  };
}
