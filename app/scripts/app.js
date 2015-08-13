angular.module('bd', [
    'ngRoute',
    'ngAnimate',
    'ngMessages',
    'ngMaterial',
    'infinite-scroll',
    'ui.router',
    'bdHome',
    'bdUser',
    'bdQuote',
    'bdSearch',
    'bdConfig',
    'bdCommon',
    'bdSource',
    'bdCharacter',
])
    .controller('BrynhildCtrl', [
        '$scope',
        '$window',
        '$location',
        '$mdSidenav',
        'G',
        'Session',
        'CDN',
        BrynhildCtrl
    ]);

function BrynhildCtrl (
    $scope,
    $window,
    $location,
    $mdSidenav,
    G,
    Session,
    CDN
) {
    'use strict';

    $scope.g = G;
    $scope.session = Session;
    $scope.location = $location;
    $scope.cdn = CDN;

    $scope.toggleSidenav = function () {
        $mdSidenav('left').toggle();
    }
}
