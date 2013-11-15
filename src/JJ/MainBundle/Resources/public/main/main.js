'use strict'

angular.module('main', [])

    .controller('mainCtrl', ['albumsMdl', 'ranksMdl', '$rootScope', '$filter', '$log', '$scope', function(albumsMdl, ranksMdl, $rootScope, $filter, $log, $scope) {

        $scope.albums = albumsMdl.albums;
        $scope.albums_start_from = 0;
        $scope.albums_rank_start_at = 1;

        var albumsRefresh = function() {
            $log.info('albumsRefresh');
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
