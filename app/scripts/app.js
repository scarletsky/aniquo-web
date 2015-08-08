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
        'UploadConf',
        BrynhildCtrl
    ]);

function BrynhildCtrl (
    $scope,
    $window,
    $location,
    G,
    Session,
    UploadConf
) {
    'use strict';

    $scope.g = G;
    $scope.session = Session;
    $scope.location = $location;
    $scope.cdn = UploadConf;
}
