angular.module('bd', [
  'ngRoute',
  'bdUser',
  'bdQuote',
  'bdSearch',
  'bdConfig',
  'bdCommon',
  'bdSource',
  'bdCharacter',
])

  .controller('BrynhildCtrl', function (
    $scope,
    G,
    Session
  ) {
    'use strict';

    $scope.g = G;
    $scope.session = Session;

  });
