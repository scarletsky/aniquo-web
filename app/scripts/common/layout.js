angular.module('bdLayout', [])

  .directive('bdFixedHeader', [
    bdFixedHeaderDirective
  ])

  .directive('bdFixedFooter', [
    '$window',
    bdFixedFooterDirective
  ]);

function bdFixedHeaderDirective () {
  return {
    scope: false,
    link: function ($scope, $element, $attrs) {

      var containerElement = $('material-content');

      containerElement.on('scroll', function (e) {
        var scrollTop = e.target.scrollTop;

        if (scrollTop > 112) {
          $element.addClass('header-fixed');
          containerElement.addClass('scrolling');
        } else {
          $element.removeClass('header-fixed');
          containerElement.removeClass('scrolling');
        }
      });
    }
  };
}

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
