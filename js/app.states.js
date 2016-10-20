angular.module('demoApp')
    .config(function ($stateProvider, $urlRouterProvider) {

        $urlRouterProvider.otherwise('/');

        $stateProvider
            .state('root', {
                url: '',
                abstract: true,
                resolve: {
                    'userCheck': function (userService) {
                        return userService.user; // would be async in a real app
                    }
                },
                views: {
                    'header': {
                        templateUrl: 'partials/header.html',
                        controller: 'User',
                        controllerAs: 'user'
                    },
                    'footer': {
                        templateUrl: 'partials/footer.html'
                    }
                }
            })
            .state('root.home', {
                url: '/',
                views: {
                    'content@': {
                        template: 'Welcome to Home page'
                    }
                }
            })
            .state('root.about', {
                url: '/about',
                views: {
                    'content@': {
                        template: 'WElcome to how it works'
                    }
                }
            })
            .state('root.bankApp', {
                url: '/bankApp',
                views: {
                    'content@': {
                        templateUrl: 'partials/bank.html',
                        controller: 'AccountController',
                        controllerAs: 'vm'
                    }
                }
            })
            .state('root.restricted', {
                url: '/restricted',
                resolve: {
                    auth: function (userService, $q, $timeout) {

                        var deferred = $q.defer();
                        /* //with an async
                        return UserService.load().then(function(user){
                          if (permissionService.can(user, {goTo: state})) {
                            return deferred.resolve({});
                          } else {
                            return deferred.reject({redirectTo: 'some_other_state'});
                          }
                        }*/

                        $timeout(function () {
                            if (angular.isUndefined(userService.user)) {
                                return deferred.reject({
                                    redirectTo: 'login'
                                });
                            } else {
                                return deferred.resolve(userService.user);
                            }
                        });

                        return deferred.promise;
                    }
                },
                views: {
                    'content@': {
                        template: 'Hello {{user}}! <br> Successfully logged in  :)',
                        controller: function ($scope, auth) {
                            $scope.user = auth.username;
                        }
                    }
                }
            })
            .state('login', {
                url: '/login',
                templateUrl: 'partials/login.html',
                controller: 'Login',
                controllerAs: 'login'
            });


    });
