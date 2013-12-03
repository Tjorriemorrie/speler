'use strict'

angular.module('player', [])

    .controller('playerCtrl', ['lastFm', 'songsServ', 'playList', '$rootScope', '$q', 'storage', '$log', '$scope', function(lastFm, songsServ, playList, $rootScope, $q, storage, $log, $scope) {

        // SKIP SONG
        $scope.skipSong = function() {
            //$log.info('skipSong', playList.getPlayList().length);
            if (playList.getPlayList().length > 1) {
                accrete();
                lastFm.scrobble($rootScope.song);
                $scope.endSong();
            }
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
            if (playList.isPlayListEmpty()) {
                $rootScope.song = null;
                document.title = 'No songs to play';
                $log.warn('setSong song NONE');
                dfd.reject('No song');
            } else {
                $rootScope.song = playList.getFirst();
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
            //$log.info('endSong');
            document.title = 'loading...';
            playList.clearFirst();
            setSong().finally(function(data) {
                playList.findNext();
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
                if (playList.isPlayListEmpty()) {
                    $scope.alert = {'cls': 'alert-primary', 'msg': 'Loading playlist...'};
                    playList.findNext().finally(function() {
                        $scope.alert = null;
                        setSong();
                    });
                } else {
                    setSong();
                    playList.findNext();
                }
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
                    if (progress >= 84) {
                        lastFm.scrobble($rootScope.song);
                    }
                    if (progress >= 88) {
                        accrete();
                        lastFm.scrobble($rootScope.song);
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

    .controller('infoCtrl', ['artistsMdl', 'albumsMdl', 'playList', 'editsServ', '$timeout', '$filter', '$rootScope', '$q', 'storage', '$log', '$scope', function(artistsMdl, albumsMdl, playList, editsServ, $timeout, $filter, $rootScope, $q, storage, $log, $scope) {

        // SWITCH
        $scope.edit = { 'switch': 'display' };
        // WATCH SONG (goto display on change)
        $rootScope.$watch('song', function(song) {
            //$log.debug('song changed, closing info edit forms');
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
            $timeout(function() {
                angular.element('input:visible:eq(0)').select();
            }, 200);
            //$log.debug('edit info', infoSwitch, $scope.edit);
        };

        // SAVE SONG
        $scope.saveSong = function(infoSwitch) {
            //$log.info('saveSong', $scope.edit.song);
            $rootScope.song.name = $scope.edit.song.name;
            $rootScope.song.number = $scope.edit.song.number;
            editsServ.saveSong($scope.edit.song).then(function(songResponse) {
                if (playList.getFirst().id == songResponse.id) {
                    playList.getFirst().name = $rootScope.song.name;
                    playList.getFirst().number = $rootScope.song.number;
                }
                storage.set('playList', playList.getPlayList());
            });
            $scope.editInfo(infoSwitch);
        };

        // SAVE ARTIST
        var artist_blank = {'id': 0, 'name': null};
        $scope.saveArtist = function(infoSwitch) {
            //$log.info('saveArtist', $scope.edit.artist);
            $rootScope.song.artist = {
                'name': $scope.edit.artist.name
            };
            playList.getFirst().artist = $scope.edit.artist;
            storage.set('playList', playList.getPlayList());
            editsServ.saveArtist($scope.edit.song, $scope.edit.artist).then(function(artist) {
                $rootScope.song.artist = artist;
            });
            $scope.editInfo(infoSwitch);
        };

        // SAVE ALBUM
        var album_blank = {'id': 0, 'name': null, 'size': null, 'year': null};
        $scope.saveAlbum = function() {
            //$log.info('saveAlbum', $scope.edit.album);
            $rootScope.song.album = {
                name: $scope.edit.album.name,
                size: $scope.edit.album.size,
                year: $scope.edit.album.year
            };
            playList.getFirst().album = $scope.edit.album;
            storage.set('playList', playList.getPlayList());
            editsServ.saveAlbum($scope.edit.song, $scope.edit.album).then(function(album) {
                $rootScope.song.album = album;
            });
            $scope.edit.switch = 'display';
        };

        // LIST ARTISTS
        $scope.artists = artistsMdl.artists;

        // LIST ALBUMS
        $scope.albums = albumsMdl.albums;

        // POPULATE ARTIST
        $scope.populateArtist = function(artist, form) {
            //$log.info('populating artist', artist);
            $scope.edit.artist.name = artist.name;
            form.$setDirty();
        };

        // FILTER ALBUMS
        $scope.albumFilter = function(album) {
            if (!album.hasOwnProperty('artist') || !$rootScope.song.hasOwnProperty('artist')) {
                return false;
            }
            return album.artist.name == $rootScope.song.artist.name;
        };

        // POPULATE ALBUM
        $scope.populateAlbum = function(album, form) {
            //$log.info('populating album', album);
            $scope.edit.album.name = album.name;
            $scope.edit.album.size = album.size;
            $scope.edit.album.year = album.year;
            form.$setDirty();
        };
    }])
;
