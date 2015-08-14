angular.module('bdUserVerify', [])
    .controller('UserVerifyCtrl', [
        '$scope',
        '$location',
        '$rootScope',
        '$state',
        '$stateParams',
        'Session',
        'Restangular',
        'Toast',
        UserVerifyCtrl
    ]);

function UserVerifyCtrl(
    $scope,
    $location,
    $rootScope,
    $state,
    $stateParams,
    Session,
    Restangular,
    Toast
) {
    var confirmToken = $location.search().confirm_token;

    if (angular.isUndefined(confirmToken) || confirmToken === '') {
        return goToUserDetailPage();
    }

    $scope.user = {};

    Restangular
        .one('users', $stateParams.userId)
        .one('verify')
        .get({
            confirm_token: confirmToken
        })
        .then(function(res) {
            res = res.plain();
            $scope.user = res.user;
            Session.login(res);
            Toast.show('帐号激活成功');
        }, function(res) {
            if (res.data.user) {
                $scope.user = res.data.user;
                Session.login(res.data);
            }
            Toast.show('你的帐号已经激活，不需要重复激活帐号');
            goToUserDetailPage();
        });

    function goToUserDetailPage() {
        $state.transitionTo('userDetail', {userId: $stateParams.userId});
    }
};
