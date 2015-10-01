angular.module('bdSourceEdit', [])
    .controller('SourceEditCtrl', [
        '$scope',
        '$location',
        '$stateParams',
        'Toast',
        'Editor',
        'Uploader',
        'Restangular',
        SourceEditCtrl
    ]);

function SourceEditCtrl(
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

    var editor = new Editor({
        scope: $scope,
        mode: $stateParams.sourceId ? 'edit' : 'new',
        targetId: $stateParams.sourceId,
        targetType: 'source',
        canvas: $('#sourceCover')[0]
    });

    function cleanCanvas() {
        var canvas = $('#sourceCover');
        var ctx = canvas[0].getContext('2d');
        ctx.clearRect(0, 0, canvas.width(), canvas.height());
    }

    $scope.submit = function() {

        if ($scope.sourceForm.$invalid) return;

        var data = {
            name: $scope.source.name,
            alias: $scope.source.alias,
            info: $scope.source.info,
            coverFile: $scope.source.coverFile,
            cover: $scope.source.cover
        };

        $scope.submitting = true;
        if (data.coverFile) {
            var uploader = new Uploader('sourceCover');
            uploader
                .upload(data.coverFile)
                .then(function(fileURL) {
                    Toast.show('封面上传成功');

                    data.cover = fileURL;
                    delete data.coverFile;
                    editor.save(data);

                }, function(err) {
                    return Toast.show('封面上传失败');
                });
        } else {
            editor.save(data);
        }

    };
}
