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
      .when('/sources/new', {
        controller: 'SourceEditCtrl',
        templateUrl: 'views/source/sourceForm.html'
      })
      .when('/sources/:sourceId/edit', {
        controller: 'SourceEditCtrl',
        templateUrl: 'views/source/sourceForm.html'
      })
      .when('/sources/:sourceId/characters', {
        controller: 'SourceCtrl',
        templateUrl: 'views/source/source.html'
      })
      .when('/characters/new', {
        controller: 'CharacterEditCtrl',
        templateUrl: 'views/character/CharacterForm.html'
      })
      .when('/characters/:characterId/edit', {
        controller: 'CharacterEditCtrl',
        templateUrl: 'views/character/CharacterForm.html'
      })
      .when('/characters/:characterId/quotes', {
        controller: 'CharacterCtrl',
        templateUrl: 'views/character/character.html'
      })
      .when('/quotes/new', {
        controller: 'QuoteEditCtrl',
        templateUrl: 'views/quote/quoteForm.html'
      })
      .when('/quotes/:quoteId/edit', {
        controller: 'QuoteEditCtrl',
        templateUrl: 'views/quote/quoteForm.html'
      })
      .when('/quotes/:quoteId', {
        controller: 'QuoteCtrl',
        templateUrl: 'views/quote/quote.html'
      })
  });