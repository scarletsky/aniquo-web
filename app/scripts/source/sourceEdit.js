angular.module('bdSourceEdit', [])
  .controller('SourceEditCtrl', [
    '$scope',
    '$location',
    '$routeParams',
    'Toast',
    'Editor',
    'Uploader',
    'Restangular',
    SourceEditCtrl
  ]);

function SourceEditCtrl (
  $scope,
  $location,
  $routeParams,
  Toast,
  Editor,
  Uploader,
  Restangular
) {
  'use strict';


  var editor = new Editor({
    scope: $scope,
    mode: $routeParams.sourceId ? 'edit' : 'new',
    targetId: $routeParams.sourceId,
    targetType: 'source',
  });

  $scope.submit = function () {
    editor.save($scope.source);
  };

  $scope.reset = function () {
    $scope.source = {};
    cleanCanvas();
  };

  function cleanCanvas () {
    var canvas = $('#sourceCover');
    var ctx = canvas[0].getContext('2d');
    ctx.clearRect(0, 0, canvas.width(), canvas.height());
  }

  // function sendToServer (data) {

  //   if (actionType === 'edit') {
  //     var sourceElement = Restangular.one('sources', $routeParams.sourceId);
  //     angular.extend(sourceElement, data);
  //     sourceElement
  //       .put()
  //       .then(function (res) {
  //         Toast.show('作品更新成功');
  //         return $location.path('/sources/' + $routeParams.sourceId + '/characters');
  //       });

  //   } else {
  //     Restangular
  //       .one('source/check')
  //       .get(data)
  //       .then(function (res) {
  //         res = res.plain();
  //         if (res.exist) {
  //           return Toast.show('该作品已存在');

  //         } else {
  //           Restangular
  //             .all('sources')
  //             .post(data)
  //             .then(function (res) {
  //               return Toast.show('作品添加成功');
  //             }, function (res) {
  //               return Toast.show('作品添加失败');
  //             });
  //         }
  //       });
  //   }
  // }

  // $scope.submit = function () {
  //   var alias = _.filter($scope.source.alias, function (value) {
  //     return $.trim(value);
  //   });

  //   var data = {
  //     name: $scope.source.name,
  //     alias: $scope.source.alias,
  //     info: $scope.source.info,
  //     coverFile: $scope.source.coverFile,
  //     cover: $scope.source.cover
  //   };

  //   if (angular.isUndefined(data.name)) {
  //     return Toast.show('作品名称不能为空');
  //   }

  //   var uploader = new Uploader('sourceCover');

  //   uploader
  //     .upload(data.coverFile)
  //     .then(function (fileURL) {
  //       Toast.show('封面上传成功');

  //       data.cover = fileURL;
  //       delete data.coverFile;
  //       sendToServer(data);

  //     }, function (err) {
  //       console.log(err);
  //       return Toast.show('封面上传失败');
  //     });

  //   return;

  // };
}
