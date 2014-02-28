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

    .controller('navCtrl', ['scanServ', 'songsServ', 'albumsMdl', 'artistsMdl', 'storage', '$log', '$scope', function(scanServ, songsServ, albumsMdl, artistsMdl, storage, $log, $scope) {

        storage.bind($scope, 'count_songs', {defaultValue: 0});
        $scope.count_albums = albumsMdl.albums == null ? 0 : albumsMdl.albums.length;
        $scope.count_artists = artistsMdl.artists == null ? 0 : artistsMdl.artists.length;

        // update counts
        $scope.updateCounts = function() {
            songsServ.countAll().then(function(data) {
                $scope.count_songs = data;
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
            }, function(rejection) {
                alert('Scan failed: ' + rejection.data);
            });
        }
    }]);
