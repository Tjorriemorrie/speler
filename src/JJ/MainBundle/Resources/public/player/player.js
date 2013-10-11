'use strict'

angular.module('player', [])

    .controller('playerCtrl', ['songsServ', '$rootScope', '$q', 'storage', '$log', '$scope', function(songsServ, $rootScope, $q, storage, $log, $scope) {

        // PLAY LIST
        var playList = [];
        var playListSize = 10;
        var findNext = function() {
            var dfd = $q.defer();
            if (playList.length >= playListSize) {
                $log.info('PLAYLIST', playList.length);
                dfd.resolve();
            } else {
                songsServ.findNext(playList).then(function(data) {
                    playList = playList.concat(data);
                    $log.info('PLAYLIST', playList.length);
                    dfd.resolve();
                });
            }
            return dfd.promise;
        };

        $scope.skipSong = function() {
            accrete();
            $scope.endSong();
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
                $log.warn('setSong song NONE');
                dfd.reject('No song');
            } else {
                $rootScope.song = playList[0];
                $log.info('setSong song', $rootScope.song);

                var mediaObject = {};
                mediaObject[ $rootScope.song.extension ] = URL_BASE + '/audio/' + $rootScope.song.path;

//                $scope.jplayer.jPlayer('option', 'supplied', $rootScope.song.extension);

                $scope.jplayer.jPlayer('option', 'volume', Math.max(0.10, !$rootScope.song.hasOwnProperty('rating') ? 0 : ($rootScope.song.rating * $rootScope.song.rating)))
                    .jPlayer('setMedia', mediaObject);

                $scope.jplayer.jPlayer('play', 0);

                document.title = $rootScope.song.name + ($rootScope.song.hasOwnProperty('artist') ? ' | ' + $rootScope.song.artist.name : '');

                accreted = false;

                dfd.resolve();
            }

            return dfd.promise;
        };

        // END SONG
        $scope.endSong = function() {
            $log.log('endSong');
            document.title = 'loading...';
            playList.shift();
            setSong().then(function(data) {
                findNext();
            });
        };

        // PLAYER
        $scope.jplayer = $('#jquery_jplayer_1').jPlayer({
            solution: 'html, flash',
            swfPath: URL_BASE + '/bower_components/jplayer/jquery.jplayer',
            wmode: 'window',
            supplied: 'mp3, m4a',
            preload: 'auto',
            ready: function(event) {
                $log.info('jplayer: READY', event);
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
            },
//            progress: function(event) {
//                songPlayingProgress = event.jPlayer.status.seekPercent;
//            }
            warningAlerts: false,
            errorAlerts: true
        });

    }])

    .controller('infoCtrl', ['editsServ', '$rootScope', '$q', 'storage', '$log', '$scope', function(editsServ, $rootScope, $q, storage, $log, $scope) {

        // SWITCH
        $scope.edit = { 'switch': 'display' };
        // WATCH SONG (goto display on change)
        $rootScope.$watch('song', function(song) {
            $log.debug('song changed, closing info edit forms');
            $scope.edit.switch = 'display';
        });

        // EDIT INFO
        $scope.editInfo = function(infoSwitch) {
            $scope.edit = {
                switch: infoSwitch,
                song: Object.create($rootScope.song),
                'artist': $rootScope.song.hasOwnProperty('artist') ? Object.create($rootScope.song.artist) : Object.create(artist_blank),
                'album': $rootScope.song.hasOwnProperty('album') ? Object.create($rootScope.song.album) : Object.create(album_blank)
            };
            $scope.edit.artist.create = false;
            $log.debug('edit info', infoSwitch, $scope.edit);
        };

        // SAVE SONG
        $scope.saveSong = function(infoSwitch) {
            $log.log('saveSong', $scope.edit.song);
            editsServ.saveSong($scope.edit.song);
            $rootScope.song.name = $scope.edit.song.name;
            $rootScope.song.number = $scope.edit.song.number;
            $scope.editInfo(infoSwitch);
        };

        // SAVE ARTIST
        var artist_blank = {'id': 0, 'name': null};
        $scope.saveArtist = function(infoSwitch) {
            $log.log('saveArtist', $scope.edit.artist);
            $rootScope.song.artist = {
                'name': $scope.edit.artist.name
            };
            editsServ.saveArtist($scope.edit.song, $scope.edit.artist).then(function(data) {
                $log.info('artist saved', data);
                $rootScope.song.artist = data;
            });
            $scope.editInfo(infoSwitch);
        };

        // SAVE ALBUM
        var album_blank = {'id': 0, 'name': null, 'size': null, 'year': null};
        $scope.saveAlbum = function() {
            $log.log('saveAlbum', $scope.edit.album);
            $rootScope.song.album = {
                'name': $scope.edit.album.name,
                'size': $scope.edit.album.size,
                'year': $scope.edit.album.year
            };
            editsServ.saveAlbum($scope.edit.song, $scope.edit.album).then(function(data) {
                $log.info('album saved', data);
                $rootScope.song.album = data;
            });
            $scope.edit.switch = 'display';
        };
    }])
;
