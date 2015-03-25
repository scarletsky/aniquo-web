angular.module('bdEditor', [])
  .factory('Editor', [
    '$q',
    'Toast',
    'Uploader',
    'ImageViewer',
    'Restangular',
    EditorService
  ]);

function EditorService ($q, Toast, Uploader, ImageViewer, Restangular) {
  
  var Editor = function (options) {
    if (!options) { throw Error('Editor need an options!'); }
    if (!options.scope) { throw Error('It need a scope in the options!'); }


    this.scope = options.scope;
    this.mode = options.mode; // 'new' || 'edit'
    this.targetType = options.targetType;

    this.scope[this.targetType] = {};

    if (this.mode === 'edit') {
      this.targetId = options.targetId;
      this.getURL = this.targetType + 's/' + this.targetId;
      this.saveURL = this.getURL;
      this.canvas = options.canvas || null;
      this.getTarget();
    } else {
      this.saveURL = this.targetType + 's';
    }
  };

  Editor.prototype.showImage = function (target) {
    var self = this;

    if (!self.canvas) return;

    // 语录不带图片
    var imageTypeMap = {
      'source': 'cover',
      'character': 'avatar'
    };

    var _map = imageTypeMap[self.targetType];
    var src = target[_map];

    if (_map && src) {
      var iv = new ImageViewer({
        canvas: self.canvas,
        src: src
      });

      iv.show();
    }
  };

  Editor.prototype.getTarget = function () {
    var self = this;

    Restangular
      .one(self.getURL)
      .get()
      .then(function (res) {
        res = res.plain();
        self.scope[self.targetType] = res;
        self.showImage(res);
      });
  };

  Editor.prototype.checkIsExits = function (data) {
    var self = this;

    var promise = $q(function (resolve, rejected) {
      Restangular
        .one(self.targetType + '/check')
        .get(data)
        .then(function (res) {
          res = res.plain();
          resolve(res);
        }, function (err) {
          rejected(err);
        });
    });

    return promise;
  };

  Editor.prototype.save = function (data, successCallback, failedCallback) {

    if (angular.isUndefined(data)) {
        throw Error('data is required.');
    }

    var self = this;
    var element = Restangular.one(self.saveURL);

    if (self.mode === 'new') {

        self
          .checkIsExits(data)
          .then(function (res) {

            // 已存在
            if (res.exists) {

              var targetTypeMap = {
                'source': '作品',
                'character': '角色',
                'quote': '语录'
              };

              Toast.show('该' + targetTypeMap[self.targetType] + '已存在');

            // 不存在
            } else {
              Restangular
                .all(self.saveURL)
                .post(data)
                .then(successCallback, failedCallback);
            }
          });

    } else {
        angular.extend(element, data);
        element.put().then(successCallback, failedCallback);
    }

  };

  return Editor;
}
