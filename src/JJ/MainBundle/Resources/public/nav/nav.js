'use strict'

angular.module('nav', [])

    .run(['$rootScope', function ($rootScope) {
        $rootScope.getIncludeSrc = function(path) {
            return URL_BASE + path;
        };

        $rootScope.getIncludePath = function(path) {
            return URL_SITE + path;
        };
    }])

    .controller('navCtrl', ['scanServ', 'songsServ', 'albumsServ', 'artistsServ', 'storage', '$log', '$scope', function(scanServ, songsServ, albumsServ, artistsServ, storage, $log, $scope) {

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

        storage.bind($scope, 'count_songs', {defaultValue: 0});
        storage.bind($scope, 'count_albums', {defaultValue: 0});
        storage.bind($scope, 'count_artists', {defaultValue: 0});

        // update counts
        $scope.updateCounts = function() {
            songsServ.countAll().then(function(data) {
                $scope.count_songs = data;
            });
            albumsServ.countAll().then(function(data) {
                $scope.count_albums = data;
            });
            artistsServ.countAll().then(function(data) {
                $scope.count_artists = data;
            });
        };

        // SCAN
        $scope.scan = false;
        var lastScan = +storage.get('lastScan');
        if (lastScan + 57600000 < new Date().getTime()) {
            $scope.scan = true;
            scanServ.run().then(function() {
                $scope.scan = false;
                $scope.updateCounts();
                storage.set('lastScan', new Date().getTime());
            });
        }
    }]);
