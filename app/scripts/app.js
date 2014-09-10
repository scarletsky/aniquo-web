angular.module('bd', [
  'ngRoute',
  'ngAnimate',
  'ngMaterial',
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
    'G',
    'Session',
    BrynhildCtrl
  ]);

function BrynhildCtrl (
  $scope,
  G,
  Session
) {
  'use strict';

  $scope.g = G;
  $scope.session = Session;
}
