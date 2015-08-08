angular.module('bd', [
    'ngRoute',
    'ngAnimate',
    'ngMessages',
    'ngMaterial',
    'infinite-scroll',
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
        'G',
        'Session',
        'CDN',
        BrynhildCtrl
    ]);

function BrynhildCtrl (
    $scope,
    $window,
    $location,
    G,
    Session,
    CDN
) {
    'use strict';

    $scope.g = G;
    $scope.session = Session;
    $scope.location = $location;
    $scope.cdn = CDN;
}
