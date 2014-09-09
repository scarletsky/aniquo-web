angular.module('bdConfig', ['restangular', 'angular-md5', 'angular-loading-bar'])
  .run(function (
    $window,
    $rootScope,
    AuthEvents,
    Restangular
  ) {
    'use strict';

    var token = $window.localStorage.token;

    if (token) {
      Restangular
        .one('user')
        .get()
        .then(function (res) {
          $rootScope.$broadcast(AuthEvents.loadUserSuccess, res);
        }, function (res) {
          $rootScope.$broadcast(AuthEvents.tokenExpired, res); 
        });
    }
  })

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

      var token = window.localStorage.token;

      if (angular.isDefined(token)) {
        headers = _.extend(headers, {
          Authorization: 'Bearer ' + window.localStorage.token
        });
      }

      return {
        element: element,
        headers: headers,
        params: params,
        httpConfig: httpConfig
      };
    });
  })

  .config(['cfpLoadingBarProvider', function(cfpLoadingBarProvider) {
    cfpLoadingBarProvider.includeSpinner = true;
  }]);
