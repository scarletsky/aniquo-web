angular.module('bdTreasure', [])
    .factory('G', [
        '$rootScope',
        '$stateParams',
        globalService
    ]);

function globalService($rootScope, $stateParams) {
    'use strict';

    var service = {
        searchKeyword: '',
        searchType: '',
        currentCharacter: null,
        currentSource: null,
        stateParams: {},
        currentState: null
    };

    $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams) {
        service.stateParams = toParams;
        service.currentState = toState.name;
    });

    return service;
}
