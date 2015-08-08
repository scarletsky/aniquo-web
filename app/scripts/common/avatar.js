angular.module('bdAvatar', [])
    .factory('Avatar', [
        AvatarService
    ])

    .directive('bdAvatar', [
        'Avatar',
        bdAvatarDirective
    ]);

function AvatarService () {
    return mdAvatar;
}

function bdAvatarDirective (Avatar) {
    return {
        restrict: 'A',
        link: function ($scope, $element, $attrs) {

            var size = $element.width();
            $attrs.$observe('bdAvatarText', function (newVal) {
                var avatar = new Avatar({size: size, text: newVal}).toDataURL();
                $element.attr('src', avatar);
            });

        }
    };
}
