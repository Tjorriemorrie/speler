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

    .controller('navCtrl', ['songsServ', 'albumsServ', 'artistsServ', 'storage', '$scope', function(songsServ, albumsServ, artistsServ, storage, $scope) {

        $scope.nav = 'Main';
        $scope.setNav = function(nav) {
            $scope.nav = nav.name;
        };

        $scope.navs = [
            { name: 'Main', url: '#/' },
            { name: 'Artists', url: '#/library/artists' },
            { name: 'Albums', url: '#/library/albums' },
            { name: 'Songs', url: '#/library/songs' },
        ];

        $scope.isActive = function(nav) {
            return nav.name == $scope.nav ? 'active' : '';
        };

        storage.bind($scope, 'count_songs', 0);
        songsServ.countAll().then(function(data) {
            $scope.count_songs = data;
        });

        storage.bind($scope, 'count_albums', 0);
        albumsServ.countAll().then(function(data) {
            $scope.count_albums = data;
        });

        storage.bind($scope, 'count_artists', 0);
        artistsServ.countAll().then(function(data) {
            $scope.count_artists = data;
        });
    }]);
