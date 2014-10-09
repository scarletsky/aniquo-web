angular.module('bdTreasure', [])
  .factory('G', [
    globalService
  ]);

function globalService () {
  'use strict';

  var service = {
    searchKeyword: '',
    searchType: '',
    currentCharacter: null,
    currentSource: null
  };

  return service;
}
