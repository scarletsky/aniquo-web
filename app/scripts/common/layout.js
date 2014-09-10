angular.module('bdLayout', [])
  .directive('bdFixedFooter', [
    '$window',
    bdFixedFooterDirective
  ]);

function bdFixedFooterDirective ($window) {

  return {
    scope: false,
    link: function ($scope, $element, $attrs) {

      var clientHeight = $window.innerHeight;
      var headerHeight = $('#header').height();
      var restHeight = clientHeight - headerHeight;

      $scope.$watch(function () {
        return $('#contentBody').height();
      }, function (newVal, oldVal) {

        if (restHeight > newVal) {
          $element.addClass('pagination-fixed');
        } else {
          $element.removeClass('pagination-fixed');
        }
      });
    }
  };
}
