angular.module('bdTime', [])
    .filter('timeFormat', function () {
        return function (input, format) {
            return moment(input).format(format);
        };
    });
