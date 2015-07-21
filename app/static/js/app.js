'use strict';

var app = angular.module('app', [
    'ngRoute',
    'ngSanitize',
    'com.2fdevs.videogular',
    'com.2fdevs.videogular.plugins.controls'
]);
console.debug('app', app);

app.config(['$routeProvider', '$locationProvider',
    function ($routeProvider, $locationProvider) {
        $routeProvider
            .when('/', {
                templateUrl: '/static/templates/home.html'
            })
            .otherwise({
                redirectTo: '/'
            });

        $locationProvider.html5Mode(true);
    }
]);

app.filter('debug', function () {
    return function (input) {
        if (input === '') return 'empty string';
        return input ? input : ('' + input);
    };
});
