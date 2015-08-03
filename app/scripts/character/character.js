angular.module('bdCharacter', [
    'bdCharacterEdit'
])

    .controller('CharacterCtrl', [
        '$scope',
        '$location',
        '$routeParams',
        'Restangular',
        CharacterCtrl
    ])

    .controller('CharacterListCtrl', [
        '$scope',
        '$location',
        '$routeParams',
        'Query',
        'Restangular',
        CharacterListCtrl
    ]);

function CharacterCtrl (
    $scope,
    $location,
    $routeParams,
    Restangular
) {
    'use strict';

    var characterId = $routeParams.characterId;

    Restangular
        .one('characters/' + characterId)
        .get({with_source: true})
        .then(function (res) {
            res = res.plain();
            $scope.character = res;
        });
}

function CharacterListCtrl (
    $scope,
    $location,
    $routeParams,
    Query,
    Restangular
) {
    'use strict';

    var q = new Query();
    $scope.q = q;

    var sourceId = $routeParams.sourceId;
    $scope.sourceId = sourceId;

    $scope.getObjects = function () {

        if (angular.isDefined(sourceId)) {
            q.query({
                scope: $scope,
                route: 'sources/' + sourceId + '/characters'
            });

        } else {

            q.query({
                scope: $scope,
                route: 'characters'
            });
        }
    };

    $scope.goToQuotesPage = function (id) {
        $location.path('/characters/' + id + '/quotes');
    };
}
