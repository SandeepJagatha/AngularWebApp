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
    });
