angular.module('bdCharacterEdit', [])
    .controller('CharacterEditCtrl', [
        '$scope',
        '$location',
        '$stateParams',
        'Toast',
        'Editor',
        'Uploader',
        'ImageViewer',
        'Restangular',
        CharacterEditCtrl
    ]);

function CharacterEditCtrl(
    $scope,
    $location,
    $stateParams,
    Toast,
    Editor,
    Uploader,
    ImageViewer,
    Restangular
) {
    'use strict';

    $scope.sourceKeyword = '';

    var editor = new Editor({
        scope: $scope,
        mode: $stateParams.characterId ? 'edit' : 'new',
        targetId: $stateParams.characterId,
        targetType: 'character',
        queryParams: 'with_source=true',
        canvas: $('#characterAvatar')[0]
    });

    $scope.querySource = function(sourceKeyword) {
        return Restangular
            .one('search')
            .get({
                type: 'source',
                keyword: sourceKeyword
            })
            .then(function(res) {
                res = res.plain();
                return res.objects;
            });
    };

    function cleanCanvas() {
        var canvas = $('#characterAvatar');
        var ctx = canvas[0].getContext('2d');
        ctx.clearRect(0, 0, canvas.width(), canvas.height());
    }

    $scope.submit = function() {

        if ($scope.characterForm.$invalid) return;

        if (!$scope.character.source) return Toast.show('角色所属作品不能为空')

        var alias = _.filter($scope.character.alias, function(value) {
            return $.trim(value);
        });

        var data = {
            sourceId: $scope.character.source._id,
            name: $scope.character.name,
            alias: alias,
            info: $scope.character.info,
            avatarFile: $scope.character.avatarFile,
            avatar: $scope.character.avatar
        };

        $scope.submitting = true;
        if (data.avatarFile) {
            var uploader = new Uploader('characterAvatar');
            uploader
                .upload(data.avatarFile)
                .then(function(fileURL) {
                    Toast.show('头像上传成功');

                    data.avatar = fileURL;
                    delete data.avatarFile;
                    editor.save(data);

                }, function(err) {
                    return Toast.show('头像上传失败');
                });
        } else {
            editor.save(data);
        }
    };
}
