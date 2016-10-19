(function() {
'use strict';

	angular.module('demoApp')
	.controller('User', User);

	User.$inject = ['$rootScope','userService', '$state', 'userCheck'];

	function User($rootScope, userService, $state, userCheck) {
    var user = this;

    user.user = userCheck;
    user.login = function () {
        $state.go('login');
    };
    user.logout = function () {
        userService.logout();
        $state.go('root.home', {}, {
            reload: true
        });
    };
  }

})();
