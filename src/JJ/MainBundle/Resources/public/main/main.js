'use strict'

angular.module('main', [])

    .controller('mnArtistsCtrl', ['artistsMdl', '$rootScope', '$filter', '$log', '$scope', function(artistsMdl, $rootScope, $filter, $log, $scope) {

        $scope.artists = artistsMdl.artists;
        $scope.artists_start_from = 0;
        $scope.artists_rank_start_at = 1;

        var artistsRefresh = function() {
            $log.info('artistsRefresh');
            var ordered = $filter('orderBy')($scope.artists, 'rating', true);
            angular.forEach(ordered, function(artist, $index) {
                if (artist.id == $rootScope.song.artist.id) {
                    $scope.artists_start_from = Math.max(0, $index - 4);
                    $scope.artists_rank_start_at = $index + 1;
                }
            });
        };

        $rootScope.$watch('song.artist', function(artistNew) {
            if (artistNew != null) {
                artistsRefresh();
            }
        }, true);

        $scope.$watch('artists', function(artistsNew) {
            if (artistsNew != null && $rootScope.song != null && $rootScope.song.artist != null) {
                artistsRefresh();
            }
        }, true);

    }])

    .controller('mnAlbumsCtrl', ['albumsMdl', 'ranksMdl', '$rootScope', '$filter', '$log', '$scope', function(albumsMdl, ranksMdl, $rootScope, $filter, $log, $scope) {

        $scope.albums = albumsMdl.albums;
        $scope.albums_start_from = 0;
        $scope.albums_rank_start_at = 1;

        var albumsRefresh = function() {
            var ordered = $filter('orderBy')($scope.albums, 'rating', true);
            angular.forEach(ordered, function(album, $index) {
                if (album.id == $rootScope.song.album.id) {
                    $scope.albums_start_from = Math.max(0, $index - 4);
                    $scope.albums_rank_start_at = $index + 1;
                }
            });
        };

        $rootScope.$watch('song.album', function(albumNew) {
            if (albumNew != null) {
                albumsRefresh();
            }
        }, true);

        $scope.$watch('albums', function(albumsNew) {
            if (albumsNew != null && $rootScope.song != null && $rootScope.song.album != null) {
                albumsRefresh();
            }
        }, true);

    }])
;
