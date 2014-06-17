angular.module('bdSearch', [])
  .controller('SearchCtrl', function (
    $scope,
    $location,
    G,
    Restangular
  ) {
    'use strict';

    $scope.g = G;
    var keyword = $location.search().kw || $scope.g.searchKeyword;
    var type = $location.search().t || $scope.g.searchType;

    if ($scope.g.searchKeyword !== keyword) {
      $scope.g.searchKeyword = keyword;
    }

    if (!$scope.g.searchType) {
      $scope.g.searchType = 'character';
    } else if ($scope.g.searchType !== type) {
      $scope.g.searchType = type;
    }

    if (angular.isDefined(keyword)) {
      Restangular.all('search').getList({
        kw: keyword,
        t: type
      }).then(function (data) {
        $scope.objects = data;
      });
    }

    $scope.getResult = function () {
      console.log($scope.g.searchType);
      $location.path('/').search({kw: $scope.g.searchKeyword, t: $scope.g.searchType});
    };

  });
