angular.module('bdSearch', [])
    .controller('SearchCtrl', [
        '$scope',
        '$state',
        'Query',
        'Restangular',
        SearchCtrl
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
