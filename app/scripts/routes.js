'use strict';

angular.module('bd')
  .config(function (
    $httpProvider,
    $routeProvider,
    $locationProvider
  ) {

    $httpProvider.defaults.headers.common['Content-Type'] = 'application/json';
    $locationProvider.hashPrefix('!').html5Mode(true);

    $routeProvider
      .when('/', {
        controller: 'SearchCtrl as search',
        templateUrl: 'views/home/home.html'
      })
      .when('/search', {
        controller: 'SearchCtrl as search',
        templateUrl: 'views/search/search.html'
      })
      .when('/sources/:sourceId/characters', {
        controller: 'SourceCtrl',
        templateUrl: 'views/search/source.html'
      })
      .when('/characters/:characterId/quotes', {
        controller: 'CharacterCtrl',
        templateUrl: 'views/search/character.html'
      })
      .when('/quotes/:quoteId', {
        controller: 'QuoteCtrl',
        templateUrl: 'views/search/quote.html'
      })
  });