'use strict'

angular.module('nav', [])

    .run(['$rootScope', function ($rootScope) {
        $rootScope.spinner = 0;
        $rootScope.$on('spin', function () {
            $rootScope.spinner++;
        });
        $rootScope.$on('unspin', function () {
            $rootScope.spinner--;
        });

        $rootScope.getIncludeSrc = function(path) {
            return URL_BASE + path;
        };

        $rootScope.getIncludePath = function(path) {
            return URL_SITE + path;
        };
    }])

    .controller('navCtrl', ['$scope', function($scope) {

        $scope.nav = 'Dashboard';
        $scope.setNav = function(nav) {
            $scope.nav = nav.name;
        };

        $scope.navs = [
            { name: 'Dashboard', url: '#/' },
        ];

        $scope.isActive = function(nav) {
            return nav.name == $scope.nav ? 'active' : '';
        };
    }]);
