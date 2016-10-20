(function () {
    'use strict';

    angular.module('demoApp')
        .controller('Login', Login);

    Login.$inject = ['$rootScope', '$scope', 'userService', '$state'];

    function Login($rootScope, $scope, userService, $state) {
        var login = this;

        login.login = function (cred) {
            var user = userService.login(cred);

            if (angular.isUndefined(user)) {
                alert('username or password incorrect.');
            } else {
                $state.go('root.restricted');
            }
        };
    }

})();