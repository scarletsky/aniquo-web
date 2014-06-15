
angular.module('bdConfig', ['restangular'])
  .config(function (RestangularProvider) {
    'use strict';
    RestangularProvider.setBaseUrl('/api');
  });