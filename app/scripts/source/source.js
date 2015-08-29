angular.module('bdSource', [
    'bdSourceEdit'
    ])

    .controller('SourceDetailCtrl', [
        '$scope',
        '$location',
        '$stateParams',
        'Restangular',
        SourceDetailCtrl
    ])

    .controller('SourceListCtrl', [
        '$scope',
        '$location',
        'Query',
        'Restangular',
        SourceListCtrl
    ]);

function SourceDetailCtrl (
    $scope,
    $location,
    $stateParams,
    Restangular
) {
    'use strict';

    var sourceId = $stateParams.sourceId;

    if (!$scope.g.currentSource || $scope.g.currentSource._id !== sourceId) {
        $scope.g.currentSource = null;
        Restangular
            .one('sources/' + sourceId)
            .get()
            .then(function (res) {
                res = res.plain();
                $scope.source = res;
            });
    }
}

function SourceListCtrl (
    $scope,
    $location,
    Query,
    Restangular
) {
    'use strict';

    var q = new Query();
    $scope.q = q;

    $scope.getObjects = function () {

        return q.query({
            scope: $scope,
            route: 'sources'
        });

    };

}
