angular.module('bdConfig', [
  'restangular',
  'angular-md5',
  'angular-loading-bar',
  'hc.marked',
  'ajoslin.promise-tracker',
  'bdCDN'
])

  .run([
    '$window',
    '$rootScope',
    'AuthEvents',
    'Restangular',
    autoLogin
  ])

  .config([
    'RestangularProvider',
    RestangularConfig
  ])

  .config([
    'cfpLoadingBarProvider',
    cfpLoadingBarConfig
  ])

  .config([
    'markedProvider',
    markedConfig
  ]);

function autoLogin (
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
        res = res.plain();
        $rootScope.$broadcast(AuthEvents.loadUserSuccess, res);
      }, function (res) {
        $rootScope.$broadcast(AuthEvents.tokenExpired, res);
      });
  }
}

function RestangularConfig (
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
}

function cfpLoadingBarConfig (cfpLoadingBarProvider) {
  cfpLoadingBarProvider.includeSpinner = false;
}

function markedConfig (markedProvider) {
  markedProvider.setOptions({
    gfm: true,
    sanitize: true
  });
}
