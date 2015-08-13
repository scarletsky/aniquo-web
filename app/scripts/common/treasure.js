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
        tabIndex: 0
    };

    $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams) {
        service.stateParams = toParams;
        service.tabIndex = toState.tabIndex || 0;
    });

    return service;
}
