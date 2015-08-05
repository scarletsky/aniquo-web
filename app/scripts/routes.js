
angular.module('bd')
  .config([
    '$httpProvider',
    '$routeProvider',
    '$locationProvider',
    routeProvider
  ]);

function routeProvider (
  $httpProvider,
  $routeProvider,
  $locationProvider
) {
  'use strict';

  $httpProvider.defaults.headers.common['Content-Type'] = 'application/json';
  $locationProvider.hashPrefix('!').html5Mode(true);

  $routeProvider
    .when('/', {
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
      controller: 'CharacterListCtrl',
      templateUrl: 'views/source/source.html'
    })
    .when('/characters/new', {
      controller: 'CharacterEditCtrl',
      templateUrl: 'views/character/characterForm.html'
    })
    .when('/characters/:characterId/edit', {
      controller: 'CharacterEditCtrl',
      templateUrl: 'views/character/characterForm.html'
    })
    .when('/characters/:characterId/quotes', {
      controller: 'QuoteListCtrl',
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
    .when('/login', {
      templateUrl: 'views/user/userLogin.html'
    })
    .when('/signup', {
      templateUrl: 'views/user/userSignup.html'
    })
    .when('/user/contribution/:contributionType', {
      controller: 'UserContributeCtrl',
      templateUrl: 'views/user/userContribute.html'
    })
    .when('/user/settings', {
      controller: 'UserSettingsCtrl',
      templateUrl: 'views/user/userSettingForm.html'
    });
}
