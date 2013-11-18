'use strict'


angular.module('app', ['ngRoute', 'ngAnimate',
        'angularLocalStorage', 'ngTable', 'ngProgress',
        'services', 'directives', 'filters', 'ngPlayList',
        'albums', 'artists',
        'ranks',
        'nav', 'player', 'sidebar', 'main', 'library', 'rater', 'lastfm'
    ])

    .config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {
        $routeProvider
            .when('/', {templateUrl: URL_BASE + '/bundles/main/main/main.html'})

            .when('/library/artists', {
                templateUrl: URL_BASE + '/bundles/main/library/artists.html'
            })
            .when('/library/albums', {
                templateUrl: URL_BASE + '/bundles/main/library/albums.html'
            })
            .when('/library/songs', {
                templateUrl: URL_BASE + '/bundles/main/library/songs.html'
            })

            .otherwise({
                template: '<h1>404 Not Found</h1>'
            });
    }])

    .config(['$httpProvider', function ($httpProvider) {
        $httpProvider.interceptors.push(['$timeout', '$q', '$log', function ($timeout, $q, $log) {
            return {
                'request': function(config) {
                    //$log.info('Request: ' + config);
                    return config || $q.when(config);
                },
                'requestError': function(rejection) {
                    //$log.info('Request error: ' + rejection);
                    return $q.reject(rejection);
                },
                'response': function(response) {
                    //$log.info('Successful response: ' + response);
                    return response || $q.when(response);
                },
                'responseError': function(rejection) {
                    //console.dir(rejection);
                    //alert(rejection.status, rejection.data);
                    $log.error('responseError', rejection.status, rejection.data.message);
                    return $q.reject(rejection);
                }
            }
        }]);
    }]);

