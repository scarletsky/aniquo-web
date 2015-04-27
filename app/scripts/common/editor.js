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
    this.getTargetSuccess = options.getTargetSuccess;
    this.getTargetFailed = options.getTargetFailed;
    this.queryParams = options.queryParams || '';

    this.scope[this.targetType] = {};

    if (this.targetType === 'source' || this.targetType === 'character') {

      this.scope[this.targetType].alias = [];

    }

    // init by mode
    if (this.mode === 'edit') {
      this.targetId = options.targetId;
      this.getURL = this.targetType + 's/' + this.targetId;
      this.saveURL = this.getURL;
      this.canvas = options.canvas || null;

      if (this.queryParams.length !== 0) {
        this.getURL += '?' + this.queryParams;
      }

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

    var getTargetSuccess = self.getTargetSuccess || function (res) {
      res = res.plain();
      self.scope[self.targetType] = res;
      self.showImage(res);
    };

    var getTargetFailed = self.getTargetFailed || function (err) {
      Toast.show(err);
    };

    Restangular
      .one(self.getURL)
      .get()
      .then(getTargetSuccess, getTargetFailed);
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

    var targetTypeMap = {
      'source': '作品',
      'character': '角色',
      'quote': '语录'
    };

    if (!successCallback) {
      successCallback = function () {
        var _map = targetTypeMap[self.targetType];
        var _mode = self.mode === 'new' ? '添加' : '更新';
        var text = _map + '已' + _mode;
        Toast.show(text);
      };
    }

    if (!failedCallback) {
      failedCallback = function () {
        var _map = targetTypeMap[self.targetType];
        var _mode = self.mode === 'new' ? '添加' : '更新';
        var text = _map + _mode + '失败';
        Toast.show(text);
      };
    }

    // For new resource
    if (self.mode === 'new') {

      // 新建作品和角色需要检查是否已存在
      if (self.targetType !== 'quote') {

        self
          .checkIsExits(data)
          .then(function (res) {

            // 已存在
            if (res.exists) {

              Toast.show('该' + targetTypeMap[self.targetType] + '已存在');

            // 不存在
            } else {
              Restangular
                .all(self.saveURL)
                .post(data)
                .then(successCallback, failedCallback);
            }
          });
      // 新建语录时不需要检查语录是否已存在
      } else {

        Restangular
          .all(self.saveURL)
          .post(data)
          .then(successCallback, failedCallback);

      }

    // For update resource
    } else {
        angular.extend(element, data);
        element.put().then(successCallback, failedCallback);
    }

  };

  return Editor;
}
