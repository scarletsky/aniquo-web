angular.module('bdCharacterEdit', [])
  .controller('CharacterEditCtrl', [
    '$scope',
    '$location',
    '$routeParams',
    'Toast',
    'Editor',
    'Uploader',
    'ImageViewer',
    'Restangular',
    CharacterEditCtrl
  ]);

function CharacterEditCtrl (
  $scope,
  $location,
  $routeParams,
  Toast,
  Editor,
  Uploader,
  ImageViewer,
  Restangular
) {
  'use strict';


  var editor = new Editor({
    scope: $scope,
    mode: $routeParams.characterId ? 'edit' : 'new',
    targetId: $routeParams.characterId,
    targetType: 'character',
    canvas: $('#characterAvatar')[0]
  });


  $scope.reset = function () {
    $scope.character = {};
    cleanCanvas();
  };

  function cleanCanvas () {
    var canvas = $('#characterAvatar');
    var ctx = canvas[0].getContext('2d');
    ctx.clearRect(0, 0, canvas.width(), canvas.height());
  }

  $scope.submit = function () {
    var alias = _.filter($scope.character.alias, function (value) {
      return $.trim(value);
    });

    var data = {
      name: $scope.character.name,
      alias: alias,
      info: $scope.character.info,
      avatarFile: $scope.character.avatarFile,
      avatar: $scope.character.avatar
    };

    if (angular.isUndefined(data.name)) {
      return Toast.show('角色名字不能为空');
    }

    if (data.avatarFile) {
      var uploader = new Uploader('characterAvatar');
      uploader
        .upload(data.avatarFile)
        .then(function (fileURL) {
          Toast.show('头像上传成功');

          data.avatar = fileURL;
          delete data.avatarFile;
          editor.save(data);

        }, function (err) {
          return Toast.show('头像上传失败');
        });
    } else {
      editor.save(data);
    }
  };
}
