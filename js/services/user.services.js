(function() {
    'use strict';

    angular.module('demoApp')
    .factory('userService', userService);

    userService.$inject = ['$rootScope'];

    function userService($rootScope) {
        var usersMock = {
            'testUser': {
                username: 'testUser',
                password: '1234'
            },
            'testUser2': {
                username: 'testUser2',
                password: '1234'
            }
        };
        var userService = {
            user: undefined,
            login: function (userCredentials) {
                // later --> $http.post('auth', userCredentials).then(...)
                // for demo use local data
                var user = usersMock[userCredentials.username]
                userService.user = (user && (user.password == userCredentials.password)) ?
                    user : undefined;
                return user;
            },
            logout: function () {
                userService.user = undefined;
            }
        }

        return userService;
    }
})();
