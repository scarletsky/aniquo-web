angular.module('bdTreasure', [])
  .factory('G', [
    globalService
  ]);

function globalService () {
  'use strict';

  var service = {
    searchKeyword: '',
    searchType: '',
    paginationId: '',
    currentPage: null,
    currentCharacter: null,
    currentSource: null
  };

  return service;
}
