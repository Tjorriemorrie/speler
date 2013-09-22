'use strict'

angular.module('player', [])

    .controller('playerCtrl', ['songsServ', '$rootScope', '$q', 'storage', '$scope', function(songsServ, $rootScope, $q, storage, $scope) {

        // PLAY LIST
        var playList = [];
        var playListSize = 10;
        var findNext = function() {
            var dfd = $q.defer();
            if (playList.length >= playListSize) {
                dfd.resolve();
            } else {
                songsServ.findNext(playList).then(function(data) {
                    playList = playList.concat(data);
                    console.info('PLAYLIST', playList);
                    dfd.resolve();
                });
            }
            return dfd.promise;
        };

        // SET SONG
        $rootScope.song = {};
        storage.bind($scope, 'volume', 0.50);
        var setSong = function() {
            var dfd = $q.defer();
            if (playList.length < 1) {
                $rootScope.song = null;
                console.warn('setSong song NONE');
                dfd.reject('No song');
            } else {
    //            songPlayingProgress = 0;
                $rootScope.song = playList[0];
                console.info('setSong song', $rootScope.song);

    //            $('#jp_container_1').show();
    //            Titel.setJplayerTitle();
    //            Titel.setDocumentTitle();

                var mediaObject = {};
                mediaObject[ $rootScope.song.extension ] = URL_BASE + '/audio/' + $rootScope.song.path;
                console.info('media object', mediaObject);

                $scope.jplayer.jPlayer('option', 'supplied', $rootScope.song.extension)
                    .jPlayer('option', 'volume', $scope.volume)
                    .jPlayer('setMedia', mediaObject)
                    .jPlayer('play', 0);

                dfd.resolve();
            }

            return dfd.promise;
        };

        // PLAYER
        $scope.jplayer = $('#jquery_jplayer_1').jPlayer({
            swfPath: URL_BASE + '/web_components/jplayer/jquery.jplayer/',
            ready: function(event) {
                console.info('jplayer: READY', event);
                findNext().then(function() {
                    setSong();
                });
            }
        });

    }]);
