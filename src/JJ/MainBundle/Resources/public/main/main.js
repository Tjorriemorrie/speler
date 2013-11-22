'use strict'

angular.module('main', [])

    .controller('mnArtistsCtrl', ['artistsMdl', '$rootScope', '$filter', '$log', '$scope', function(artistsMdl, $rootScope, $filter, $log, $scope) {

        $scope.artists = artistsMdl.artists;
        $scope.artists_start_from = 0;

        var artistsRefresh = function() {
            var ordered = $filter('orderBy')($scope.artists, ['-rating', '-count_played', 'name']);
            angular.forEach(ordered, function(artist, $index) {
                artist.rank = $index + 1;
                if (artist.id == $rootScope.song.artist.id) {
                    $scope.artists_start_from = Math.max(0, $index - 3);
                }
            });
//            $log.info('artistsRefresh');
        };

        $rootScope.$watch('song.artist', function(artistNew) {
            if (artistNew != null) {
//                $log.info('song artist changed! refreshing order');
                artistsRefresh();
            }
        }, true);

        $scope.$watch('artists', function(artistsNew) {
            if (artistsNew != null && $rootScope.song != null && $rootScope.song.artist != null) {
//                $log.info('artists changed! refreshing order');
                artistsRefresh();
            }
        }, true);

    }])

    .controller('mnAlbumsCtrl', ['albumsMdl', 'ranksMdl', '$rootScope', '$filter', '$log', '$scope', function(albumsMdl, ranksMdl, $rootScope, $filter, $log, $scope) {

        $scope.albums = albumsMdl.albums;
        $scope.albums_start_from = 0;

        var albumsRefresh = function() {
            var ordered = $filter('orderBy')($scope.albums, ['-rating', '-count_played', 'name']);
            angular.forEach(ordered, function(album, $index) {
                album.rank = $index + 1;
                if (album.id == $rootScope.song.album.id) {
                    $scope.albums_start_from = Math.max(0, $index - 3);
                }
            });
//            $log.info('albumsRefresh');
        };

        $rootScope.$watch('song.album', function(albumNew) {
            if (albumNew != null) {
//                $log.info('song album changed! refreshing order');
                albumsRefresh();
            }
        }, true);

        $scope.$watch('albums', function(albumsNew) {
            if (albumsNew != null && $rootScope.song != null && $rootScope.song.album != null) {
//                $log.info('albums changed! refreshing order');
                albumsRefresh();
            }
        }, true);

    }])
;
