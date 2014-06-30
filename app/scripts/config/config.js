angular.module('bdConfig', ['restangular'])
  .config(function (
    RestangularProvider
  ) {
    'use strict';
    RestangularProvider.setBaseUrl('/api');

    RestangularProvider
      .addFullRequestInterceptor(function (
        element,
        operation,
        route,
        url,
        headers,
        params,
        httpConfig
      ) {
      if (window.sessionStorage.token !== 'undefined') {
        headers = _.extend(headers, {
          Authorization: 'Bearer ' + window.sessionStorage.token
        });
      }

      return {
        element: element,
        headers: headers,
        params: params,
        httpConfig: httpConfig
      };
    });
  });
