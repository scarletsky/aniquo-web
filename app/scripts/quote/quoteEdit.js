angular.module('bdQuoteEdit', [])
    .controller('QuoteEditCtrl', [
        '$scope',
        '$location',
        '$stateParams',
        'CDN',
        'Toast',
        'Avatar',
        'Editor',
        'ImageViewer',
        'Restangular',
        QuoteEditCtrl
    ]);

function QuoteEditCtrl(
    $scope,
    $location,
    $stateParams,
    CDN,
    Toast,
    Avatar,
    Editor,
    ImageViewer,
    Restangular
) {
    'use strict';

    function resetAvatarSize(characters) {

        var avatarSize = 40;

        return characters.map(function(c) {
            if (c.avatar) {
                c.avatar = CDN.domain + c.avatar + '?imageView2/1/w/' + avatarSize + '/h/' + avatarSize;
            } else {
                c.avatar = new Avatar({
                    size: avatarSize,
                    text: c.name
                }).toDataURL();
            }
            return c;
        });
    }

    function getNonExistCharacters(characters) {
        var existCharacterIds = $scope.quote.characters.map(function(c) {
            return c._id;
        });

        return characters.filter(function(c) {
            return existCharacterIds.indexOf(c._id) === -1;
        });

    }

    $scope.quote = {};

    var editor = new Editor({
        scope: $scope,
        mode: $stateParams.quoteId ? 'edit' : 'new',
        targetId: $stateParams.quoteId,
        targetType: 'quote',
        queryParams: 'with_character_all=true',
        getTargetSuccess: function(res) {
            res = res.plain();
            res.characters = resetAvatarSize(res.characters);
            $scope.quote = res;
        }
    });

    $scope.submit = function() {

        if ($scope.quoteForm.$invalid) return;

        if (angular.isUndefined($scope.quote.characters) || $scope.quote.characters.length === 0) {
            return Toast.show('语录相关角色不能为空');
        }

        var characterIds = $scope.quote.characters.map(function(c) {
            return c._id;
        });

        var data = {
            characterIds: characterIds,
            quote: $scope.quote.quote,
            reference: $scope.quote.reference
        };

        editor.save(data);

    };

    $scope.queryCharacters = function(query) {
        return Restangular.one('search')
            .get({
                type: 'character',
                keyword: query
            })
            .then(function(res) {
                res = res.plain();
                console.log(res);
                var _characters = res.objects;
                var nonExistCharacters = getNonExistCharacters(_characters);
                return resetAvatarSize(nonExistCharacters);
            });
    };

    // $scope.submit = function () {
    //   var characterIds = $scope.quote.characterIds.filter(function (id, index) {
    //     return angular.isDefined(id) && $scope.quote.characterIds.indexOf(id) === index;
    //   });
    //   var data = {
    //     characterIds: characterIds,
    //     quote: $scope.quote.quote,
    //     reference: $scope.quote.reference,
    //     scene: $scope.quote.scene
    //   };

    //   if (actionType === 'edit') {
    //     var quoteElement = Restangular.one('quotes', $stateParams.quoteId)
    //     angular.extend(quoteElement, data)
    //     quoteElement
    //       .put()
    //       .then(function (res) {
    //         res = res.plain();
    //         Toast.show('语录更新成功');
    //         return $location.path('/quotes/' + $stateParams.quoteId);
    //       });

    //   } else {
    //     Restangular
    //       .all('quotes')
    //       .post(data)
    //       .then(function (res) {
    //         res = res.plain();
    //         Toast.show('语录添加成功');
    //         return $location.path('/quotes/' + res._id);
    //       }, function (res) {
    //         return Toast.show('语录添加失败');
    //       });
    //   }
    // };
}
