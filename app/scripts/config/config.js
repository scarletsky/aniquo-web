
angular.module('bdConfig', ['restangular'])
  .config(function (RestangularProvider) {
    'use strict';
    RestangularProvider.setBaseUrl('http://localhost:3000/api');
  });