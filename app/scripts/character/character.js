angular.module('bdCharacter', [
    'bdCharacterEdit'
])

    .controller('CharacterCtrl', [
        '$scope',
        '$location',
        '$stateParams',
        'Restangular',
        CharacterCtrl
    ])

    .controller('CharacterListCtrl', [
        '$scope',
        '$location',
        '$stateParams',
        'Query',
        'Restangular',
        CharacterListCtrl
    ]);

function CharacterCtrl (
    $scope,
    $location,
    $stateParams,
    Restangular
) {
    'use strict';

    var characterId = $stateParams.characterId;

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
    $stateParams,
    Query,
    Restangular
) {
    'use strict';

    var q = new Query();
    $scope.q = q;

    var sourceId = $stateParams.sourceId;
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
}
