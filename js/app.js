angular.module('demoApp', ['ui.router'])
    .run(function ($rootScope, $state) {
        $rootScope.$on('$stateChangeError', function (evt, to, toParams, from, fromParams, error) {
            if (error.redirectTo) {
                $state.go(error.redirectTo);
            } else {
                $state.go('error', {
                    status: error.status
                })
            }
        })
    })
    .factory('userService', userService)
    .config(routes);
//
//myApp.config(function ($stateProvider) {
//    var helloState = {
//        name: 'hello',
//        url: '/hello',
//        template: '<h3>hello world!</h3>'
//    }
//
//    var aboutState = {
//        name: 'about',
//        url: '/about',
//        template: '<h3>Its the UI-Router hello world app!</h3>'
//    }
//
//    $stateProvider.state(helloState);
//    $stateProvider.state(aboutState);
//});

function userService() {
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

function routes($urlRouterProvider, $stateProvider) {

    $urlRouterProvider.otherwise('/');

    $stateProvider
        .state('root', {
            url: '',
            abstract: true,
            resolve: {
                'user': function (userService) {
                    return userService.user; // would be async in a real app
                }
            },
            views: {
                'header': {
                    templateUrl: 'partials/header.html',
                    controller: function ($scope, $state, user, userService) {
                        $scope.user = user;
                        $scope.login = function () {
                            $state.go('login');
                        };
                        $scope.logout = function () {
                            userService.logout();
                            $state.go('root.home', {}, {
                                reload: true
                            });
                        };
                    }
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
                    template: 'Hello at home'
                }
            }
        })
        .state('root.about', {
            url: '/about',
            views: {
                'content@': {
                    template: 'about view'
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
                    template: 'this is only visible after login. Hello {{user}}!',
                    controller: function ($scope, auth) {
                        $scope.user = auth.username;
                    }
                }
            }
        })
        .state('login', {
            url: '/login',
            templateUrl: 'partials/login.html',
            controller: function ($scope, $state, userService) {
                $scope.login = function (cred) {
                    var user = userService.login(cred);

                    if (angular.isUndefined(user)) {
                        alert('username or password incorrect.')
                    } else {
                        $state.go('root.restricted');
                    }
                };
            }
        });
}