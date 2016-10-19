angular.module('demoApp')
    .config(function($stateProvider, $urlRouterProvider) {

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
                      controller: 'Login',
                      controllerAs: 'login'
                  });


});
