'use strict'

angular.module('player', [])

    .controller('playerCtrl', ['songsServ', 'playList', '$rootScope', '$q', 'storage', '$log', '$scope', function(songsServ, playList, $rootScope, $q, storage, $log, $scope) {

        // SKIP SONG
        $scope.skipSong = function() {
            $log.info('skipSong', playList.getPlayList().length);
            if (playList.getPlayList().length > 1) {
                accrete();
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
            $log.info('endSong');
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

    .controller('infoCtrl', ['playList', 'albumsServ', 'artistsServ', 'editsServ', '$filter', '$rootScope', '$q', 'storage', '$log', '$scope', function(playList, albumsServ, artistsServ, editsServ, $filter, $rootScope, $q, storage, $log, $scope) {

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
            $log.info('saveSong', $scope.edit.song);
            $rootScope.song.name = $scope.edit.song.name;
            $rootScope.song.number = $scope.edit.song.number;
            editsServ.saveSong($scope.edit.song).then(function(songResponse) {
                playList.getFirst().name = $rootScope.song.name;
                playList.getFirst().number = $rootScope.song.number;
                storage.set('playList', playList.getPlayList());
            });
            $scope.editInfo(infoSwitch);
        };

        // SAVE ARTIST
        var artist_blank = {'id': 0, 'name': null};
        $scope.saveArtist = function(infoSwitch) {
            $log.info('saveArtist', $scope.edit.artist);
            $rootScope.song.artist = {
                'name': $scope.edit.artist.name
            };
            playList.getFirst().artist = $scope.edit.artist;
            storage.set('playList', playList.getPlayList());
            editsServ.saveArtist($scope.edit.song, $scope.edit.artist).then(function(artistResponse) {
                $log.info('artist saved', artistResponse);
                var found = false;
                $scope.artists.forEach(function(artist, index) {
                    if (artist.id == artistResponse.id) {
                        found = true;
                        $scope.artists[index] = artistResponse;
                        $log.info('artist replace in list', artistResponse);
                    }
                });
                if (!found) {
                    $scope.artists.push(artistResponse);
                    $log.info('artist added to list', artistResponse);
                }
            });
            $scope.editInfo(infoSwitch);
        };

        // SAVE ALBUM
        var album_blank = {'id': 0, 'name': null, 'size': null, 'year': null};
        $scope.saveAlbum = function() {
            $log.info('saveAlbum', $scope.edit.album);
            $rootScope.song.album = {
                'name': $scope.edit.album.name,
                'size': $scope.edit.album.size,
                'year': $scope.edit.album.year
            };
            playList.getFirst().album = $scope.edit.album;
            storage.set('playList', playList.getPlayList());
            editsServ.saveAlbum($scope.edit.song, $scope.edit.album).then(function(albumResponse) {
                $log.info('album saved', albumResponse);
                var found = false;
                $scope.albums.forEach(function(album, index) {
                    if (album.id == albumResponse.id) {
                        found = true;
                        $scope.albums[index] = albumResponse;
                        $log.info('album replace in list', albumResponse);
                    }
                });
                if (!found) {
                    $scope.albums.push(albumResponse);
                    $log.info('album added to list', albumResponse);
                }
            });
            $scope.edit.switch = 'display';
        };

        // LIST ARTISTS
        storage.bind($scope, 'artists', {defaultValue: []});
        if ($scope.artists.length < 1 || Math.random() < 0.10) {
            artistsServ.findAll().then(function(artists) {
                $scope.artists = artists;
            });
        }
        $scope.$watch('artists', function(artists) {
            $log.info('list artists = ' + $scope.artists.length);
        });

        // LIST ALBUMS
        storage.bind($scope, 'albums', {defaultValue: []});
        if ($scope.albums.length < 1 || Math.random() < 0.10) {
            albumsServ.findAll().then(function(albums) {
                $scope.albums = albums;
            });
        }
        $scope.$watch('albums', function(artists) {
            $log.info('list albums = ' + $scope.albums.length);
        });

        // POPULATE ARTIST
        $scope.populateArtist = function(artist) {
            $log.info('populating artist', artist);
            $scope.edit.artist.name = artist.name;
        }

        // POPULATE ALBUM
        $scope.populateAlbum = function(album) {
            $log.info('populating album', album);
            $scope.edit.album.name = album.name;
            $scope.edit.album.size = album.size;
            $scope.edit.album.year = album.year;
        }
    }])
;
