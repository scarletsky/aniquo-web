angular.module('bdSearch', [])
  .controller('SearchCtrl', [
    '$scope',
    '$location',
    'G',
    'Restangular',
    SearchCtrl
  ])

  .factory('searchUtils', [
    searchUtilsService
  ])

  .directive('bdSearch', [
    '$timeout',
    'Restangular',
    bdSearchDirective
  ])

  .directive('bdSelectSearching', [
    'searchUtils',
    bdSelectSearchingDirective
  ])

  .directive('bdAutoComplete', [
    bdAutoCompleteDirective
  ]);

function SearchCtrl (
  $scope,
  $location,
  G,
  Restangular
) {
  'use strict';

  $scope.g = G;
  var keyword = $location.search().kw || $scope.g.searchKeyword;
  var type = $location.search().t || $scope.g.searchType;
  var page = $location.search().page || 1;

  if ($scope.g.searchKeyword !== keyword) {
    $scope.g.searchKeyword = keyword;
  }

  if (!$scope.g.searchType) {
    $scope.g.searchType = 'character';
  } else if ($scope.g.searchType !== type) {
    $scope.g.searchType = type;
  }

  var data = {
    kw: keyword,
    t: type,
    page: page
  };

  if (type === 'character') {
    angular.extend(data, {with_source: true});
  }

  if (keyword) {
    Restangular
      .one('search')
      .get(data)
      .then(function (res) {
        $scope.objects = res.objects;

        var pageNum = Math.ceil(res.total / res.perPage);
        $scope.hasPrevPage = page > 1;
        $scope.hasNextPage = page < pageNum;
      });
  }

  $scope.prevPage = function () {
    $location.path('/').search('page', --page);
  };

  $scope.nextPage = function () {
    $location.path('/').search('page', ++page);
  };

  $scope.getResult = function () {
    $location.path('/').search({kw: $scope.g.searchKeyword, t: $scope.g.searchType});
  };
}

function searchUtilsService () {
  'use strict';

  var service = {
    select: {
      prev: function (cur, items) {
        var prev;

        cur.removeClass('list-result-current');
        prev = cur.prev();
        if (!prev.length) {
          prev = items.last();
        }
        return prev.addClass('list-result-current');
      },

      next: function (cur, items) {
        var next;

        cur.removeClass('list-result-current');
        next = cur.next();
        if (!next.length) {
          next = items.first();
        }

        return next.addClass('list-result-current');
      },

      choose: function (cur) {
        var object;

        cur.removeClass('list-result-current');
        object = {
          name: cur.find('p').text(),
          id: cur.find('div').attr('object-id')
        };

        return object;
      }
    }
  };

  return service;
}

function bdSearchDirective (
  $timeout,
  Restangular
) {
  'use strict';

  return {
    scope: false,
    restrict: 'A',
    require: 'ngModel',
    link: function ($scope, $element, $attrs, $ctrl) {
      var delayRequest;
      $scope.searchFlag = false;

      $element.on('keydown', function (e) {
        $scope.searchFlag = true;
      });

      $scope.$watch(function () {
        return $ctrl.$modelValue;
      }, function (modelValue) {
        $timeout.cancel(delayRequest);

        if (modelValue && $scope.searchFlag) {
          delayRequest = $timeout(function () {
            Restangular
              .all('search')
              .getList({
                kw: modelValue,
                t: $attrs.bdSearchType
              })
              .then(function (res) {
                $scope.results = res;
                if (res.length > 0) {
                  $scope.isListShow = true;
                } else {
                  $scope.isListShow = false;
                }
              });
          }, 500);
        } else if (!modelValue) {
          $scope.$emit('resultSelect', {id: undefined, name: undefined});
          $scope.results = [];
        }
      });
    }
  };
}

function bdSelectSearchingDirective (
  searchUtils
) {
  'use strict';

  return {
    link: function ($scope, $element, $attrs) {
      var keyCode = {
        up: 38,
        down: 40,
        enter: 13,
        tab: 9
      };
      window.list = $element.next();

      $scope.clickSelect = function (object) {
        var resultObject = {
          name: object.name,
          id: object._id
        };

        $scope.$emit('resultSelect', resultObject);
      };

      $scope.keydownSelect = function (e) {
        var items = list.find('material-item');
        var cur = list.children('.list-result-current');

        if ($scope.isListShow) {
          switch (e.keyCode) {
            case keyCode.up:
              e.originalEvent.preventDefault();
              searchUtils.select.prev(cur, items);
              break;

            case keyCode.down:
              e.originalEvent.preventDefault();
              searchUtils.select.next(cur, items);
              break;

            case keyCode.tab:
            case keyCode.enter:
              e.originalEvent.preventDefault();
              var resultObject = searchUtils.select.choose(cur, items);

              $scope.$emit('resultSelect', resultObject);

              break;
          }
        }
      };

      list.on('mouseenter', function (e) {
        var items = list.find('material-item');
        items.removeClass('list-result-current');
      });
    }
  };
}

function bdAutoCompleteDirective () {
  'use strict';

  return {
    require: 'ngModel',
    link: function ($scope, $element, $attrs, $ctrl) {
      $scope.$on('resultSelect', function (event, resultObject) {
        switch ($attrs.bdAutoComplete) {

        case 'id':
          var id = resultObject.id;
          $ctrl.$setViewValue(id);
          $element.val(id);
          break;

        case 'name':
          var name = resultObject.name;
          $ctrl.$setViewValue(name);
          $element.val(name);
          break;
        }

        $scope.searchFlag = false;
        $scope.isListShow = false;
      });
    }
  };
}
