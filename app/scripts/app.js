angular.module('bd', [
  'ngRoute',
  'ngAnimate',
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
    'G',
    'Session',
    BrynhildCtrl
  ]);

function BrynhildCtrl (
  $scope,
  $window,
  G,
  Session
) {
  'use strict';

  $scope.g = G;
  $scope.session = Session;
}
