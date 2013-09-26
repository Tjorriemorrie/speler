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

        // ACCRETE
        var accreted = true;
        var accrete = function() {
            if (!accreted) {
                accreted = true;
                songsServ.accrete($rootScope.song);
            }
        };

        // SET SONG
        $rootScope.song = null;
        var setSong = function() {
            var dfd = $q.defer();
            if (playList.length < 1) {
                $rootScope.song = null;
                document.title = 'No songs to play';
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

                $scope.jplayer.jPlayer('option', 'supplied', $rootScope.song.extension)
                    .jPlayer('option', 'volume', Math.max(0.10, !$rootScope.song.hasOwnProperty('rating') ? 0 : ($rootScope.song.rating * $rootScope.song.rating)))
                    .jPlayer('setMedia', mediaObject)
                    .jPlayer('play', 0);

                document.title = $rootScope.song.name + ($rootScope.song.hasOwnProperty('artist') ? ' | ' + $rootScope.song.artist.name : '');

                accreted = false;

                dfd.resolve();
            }

            return dfd.promise;
        };

        // END SONG
        $scope.endSong = function() {
            console.info('endSong');
            document.title = 'loading...';
            playList.shift();

            /*
            Player.songPlaying = null;
            Titel.loadJplayerTitle();
            Rater.end();
            Rater.statsHide();
            Player.hideSkip();
            Charter.hidePlaying();

            //Notifier.info('Player.playList has ' + Player.playList.length + ' songs after cleanup!');
*/

            setSong().then(function(data) {
                findNext();
            });
        };

        // PLAYER
        $scope.jplayer = $('#jquery_jplayer_1').jPlayer({
            swfPath: URL_BASE + '/web_components/jplayer/jquery.jplayer/',
            ready: function(event) {
                console.info('jplayer: READY', event);
                findNext().then(function() {
                    setSong();
                });
            },
            ended: function() {
                $scope.endSong();
            },
            volumechange: function(event) {
                //$scope.volume = event.jPlayer.options.volume;
            },
            timeupdate: function(event) {
                var progress = Math.round(event.jPlayer.status.currentPercentAbsolute);
                //console.info('complete', progress);
                if (progress >= 0) {
                    if (progress >= 90) {
                        accrete();
                    }
                }
            }
//            progress: function(event) {
//                songPlayingProgress = event.jPlayer.status.seekPercent;
//            }
        });

    }])

    .controller('infoCtrl', ['editsServ', '$rootScope', '$q', 'storage', '$scope', function(editsServ, $rootScope, $q, storage, $scope) {

        $scope.edit = { 'switch': 'display' };

        // EDIT INFO
        $scope.editInfo = function(infoSwitch) {
            //console.info('editInfo root', $rootScope.song);
            $scope.edit = {
                switch: infoSwitch,
                song: Object.create($rootScope.song),
                'album': {
                    'name': $rootScope.song.hasOwnProperty('album') ? $rootScope.song.album.name : ''
                },
                'artist': {
                    'name': $rootScope.song.hasOwnProperty('artist') ? $rootScope.song.artist.name : ''
                }
            };
            console.info('editInfo song', $scope.edit.song);
        };

        // SAVE SONG
        $scope.saveSong = function() {
            console.info('saveSong', $scope.edit.song);
            editsServ.saveSong($scope.edit.song);
            $rootScope.song.name = $scope.edit.song.name;
            $rootScope.song.number = $scope.edit.song.number;
            $scope.edit.switch = 'display';
        };
    }])
;
