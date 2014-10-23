angular.module('bdToast', [])
  .factory('Toast', [
    '$mdToast',
    ToastService
  ]); 

function ToastService ($mdToast) {

  var toastConfig = {
    duration: 3000,
    template: function (text) {
      return '<md-toast offset-lg="20" offset-md="10" offset-sm="0">' + text + '</md-toast>';
    }
  };

  var service = {
    show: function (text) {
      return $mdToast.show({
        template: toastConfig.template(text),
        duration: toastConfig.duration
      });
    }
  };

  return service;
}
