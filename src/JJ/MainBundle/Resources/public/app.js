'use strict'


angular.module('app', ['ngRoute', 'ngAnimate',
        'angularLocalStorage',
        'services', 'directives', 'filters',
        'nav', 'dashboard'
    ])

    .config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {
        $routeProvider
            .when('/', {
                templateUrl: URL_BASE + '/bundles/main/dashboard/dashboard.html',
                controller: 'dashboardCtrl'
            })

            .otherwise({
                template: '<h1>404 Not Found</h1>'
            });
    }])

    .config(['$httpProvider', function ($httpProvider) {
        $httpProvider.interceptors.push(['$q', '$log', '$rootScope', function ($q, $log, $rootScope) {
            return {
                'request': function(config) {
                    $rootScope.$broadcast('spin');
                    return config || $q.when(config);
                },

                'requestError': function(rejection) {
                    return $q.reject(rejection);
                },

                'response': function(response) {
                    //$log.info('Successful response: ' + response);
                    $rootScope.$broadcast('unspin');
                    return response || $q.when(response);
                },

                'responseError': function(rejection) {
                    //$log.error('Response status: ' + status + '. ' + response);
                    $rootScope.$broadcast('unspin');
                    alert(rejection.data);
                    return $q.reject(rejection);
                }
            }
        }]);
    }]);

