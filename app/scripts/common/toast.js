angular.module('bdToast', [])
  .factory('Toast', [
    '$materialToast',
    ToastService
  ]); 

function ToastService ($materialToast) {

  var toastConfig = {
    duration: 3000,
    template: function (text) {
      return '<material-toast offset-lg="20" offset-md="10" offset-sm="0">' + text + '</material-toast>';
    }
  };

  var service = {
    show: function (text) {
      return $materialToast.show({
        template: toastConfig.template(text),
        duration: toastConfig.duration
      });
    }
  };

  return service;
}
