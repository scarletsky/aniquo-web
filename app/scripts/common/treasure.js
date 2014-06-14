angular.module('bdTreasure', [])
  .factory('G', function () {
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
  });