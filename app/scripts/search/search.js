angular.module('bdSearch', [])
    .controller('SearchCtrl', [
        '$scope',
        '$state',
        'Query',
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

function SearchCtrl(
    $scope,
    $state,
    Query,
    Restangular
) {
    'use strict';

    $scope.search = {};

    var keyword = $state.params.keyword;
    var type = $state.params.type;

    if ($scope.search.keyword !== keyword) {
        $scope.search.keyword = keyword;
    }

    if ($scope.search.type !== type) {
        $scope.search.type = type;
    }

    $scope.viewType = type;

    var q = new Query();
    $scope.q = q;

    $scope.getObjects = function () {
        return q.query({
            scope: $scope,
            route: 'search',
            params: {
                keyword: keyword,
                type: type
            }
        });
    };

    $scope.getResults = function() {
        if (!$scope.search.type || !$scope.search.keyword) return;

        $state.go('search', {
            type: $scope.search.type,
            keyword: $scope.search.keyword
        });
    };

    if (type && keyword) {
        $scope.getObjects();
    }

}

function searchUtilsService() {
    'use strict';

    var service = {
        select: {
            prev: function(cur, items) {
                var prev;

                cur.removeClass('list-result-current');
                prev = cur.prev();
                if (!prev.length) {
                    prev = items.last();
                }
                return prev.addClass('list-result-current');
            },

            next: function(cur, items) {
                var next;

                cur.removeClass('list-result-current');
                next = cur.next();
                if (!next.length) {
                    next = items.first();
                }

                return next.addClass('list-result-current');
            },

            choose: function(cur) {
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

function bdSearchDirective(
    $timeout,
    Restangular
) {
    'use strict';

    return {
        scope: false,
        restrict: 'A',
        require: 'ngModel',
        link: function($scope, $element, $attrs, $ctrl) {
            var delayRequest;
            $scope.searchFlag = false;

            $element.on('keydown', function(e) {
                $scope.searchFlag = true;
            });

            $scope.$watch(function() {
                return $ctrl.$modelValue;
            }, function(modelValue) {
                $timeout.cancel(delayRequest);

                if (modelValue && $scope.searchFlag) {
                    delayRequest = $timeout(function() {
                        Restangular
                            .one('search')
                            .get({
                                kw: modelValue,
                                t: $attrs.bdSearchType
                            })
                            .then(function(res) {
                                res = res.plain();
                                $scope.results = res.objects;
                                if (res.objects.length > 0) {
                                    $scope.isListShow = true;
                                } else {
                                    $scope.isListShow = false;
                                }
                            });
                    }, 500);
                } else if (!modelValue) {
                    $scope.$emit('resultSelect', {
                        id: undefined,
                        name: undefined,
                        index: $attrs.bdSearchIndex
                    });
                    $scope.results = [];
                }
            });
        }
    };
}

function bdSelectSearchingDirective(
    searchUtils
) {
    'use strict';

    return {
        link: function($scope, $element, $attrs) {
            var keyCode = {
                up: 38,
                down: 40,
                enter: 13,
                tab: 9
            };
            window.list = $element.next();

            $scope.clickSelect = function(object, index) {
                var resultObject = {
                    name: object.name,
                    id: object._id,
                    index: index
                };

                $scope.$emit('resultSelect', resultObject);
            };

            $scope.keydownSelect = function(e, index) {
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
                            result.index = index;

                            $scope.$emit('resultSelect', resultObject);

                            break;
                    }
                }
            };

            list.on('mouseenter', function(e) {
                var items = list.find('material-item');
                items.removeClass('list-result-current');
            });
        }
    };
}

function bdAutoCompleteDirective() {
    'use strict';

    return {
        require: 'ngModel',
        link: function($scope, $element, $attrs, $ctrl) {
            $scope.$on('resultSelect', function(event, resultObject) {
                switch ($attrs.bdAutoComplete) {

                    case 'id':
                        var id = resultObject.id;
                        var index = resultObject.index;
                        if ($attrs.bdAutoCompleteType === 'array') {
                            $ctrl.$modelValue[index] = id;
                        } else {
                            $ctrl.$setViewValue(id);
                        }
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
