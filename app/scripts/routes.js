
angular.module('bd')
  .config([
    '$httpProvider',
    '$routeProvider',
    '$stateProvider',
    '$urlRouterProvider',
    '$locationProvider',
    routeProvider
  ]);

function routeProvider (
  $httpProvider,
  $routeProvider,
  $stateProvider,
  $urlRouterProvider,
  $locationProvider
) {
  'use strict';

  $httpProvider.defaults.headers.common['Content-Type'] = 'application/json';
  $locationProvider.hashPrefix('!').html5Mode(true);

  $urlRouterProvider.otherwise('/');

  $stateProvider
    .state('index', {
        url: '/',
        templateUrl: 'views/home/home.html'
    })

    // auth
    .state('login', {
        url: '/login',
        templateUrl: 'views/user/userLogin.html'
    })
    .state('signup', {
        url: '/signup',
        templateUrl: 'views/user/userSignup.html'
    })

    // users
    .state('userDetail', {
        url: '/users/:userId',
        templateUrl: 'views/user/userDetail.html',
        controller: 'UserCtrl'
    })
    .state('userSettings', {
        url: '/user/settings',
        templateUrl: 'views/user/userSettingForm.html'
    })
    .state('userVerify', {
        url: '/users/:userId/verify',
        templateUrl: 'views/user/userDetail.html',
        controller: 'UserVerifyCtrl'
    })

    // for sources
    .state('source', {
        url: '/sources',
        templateUrl: 'views/source/source.html'
    })
    .state('source.characters', {
        url: '/:sourceId/characters',
        templateUrl: 'views/character/characterList.html',
        tabIndex: 0
    })
    .state('source.detail', {
        url: '/:sourceId',
        templateUrl: 'views/source/sourceDetail.html',
        tabIndex: 1
    })
    // 不继承 source，因为父模板不一样
    .state('sourceEdit', {
        url: '/sources/:sourceId/edit',
        templateUrl: 'views/source/sourceForm.html'
    })
    .state('sourceNew', {
        url: '/source/new',
        templateUrl: 'views/source/sourceForm.html'
    })

    // characters
    .state('character', {
        url: '/characters',
        templateUrl: 'views/character/character.html'
    })
    .state('character.quotes', {
        url: '/:characterId/quotes',
        templateUrl: 'views/quote/quoteList.html',
        tabIndex: 0
    })
    .state('character.detail', {
        url: '/:characterId',
        templateUrl: 'views/character/characterDetail.html',
        tabIndex: 1
    })
    // 不继承 character，因为父模板不一样
    .state('characterEdit', {
        url: '/characters/:characterId/edit',
        templateUrl: 'views/character/characterForm.html'
    })
    .state('characterNew', {
        url: '/character/new',
        templateUrl: 'views/character/characterForm.html'
    })

    // quotes
    .state('quoteDetail', {
        url: '/quotes/:quoteId',
        templateUrl: 'views/quote/quoteDetail.html'
    })
    .state('quoteEdit', {
        url: '/quotes/:quoteId/edit',
        templateUrl: 'views/quote/quoteForm.html'
    })
    .state('quoteNew', {
        url: '/quote/new',
        templateUrl: 'views/quote/quoteForm.html'
    })

}
