'use strict'

angular.module('lastfm', [])

    .controller('lastFmCtrl', ['lastFm', '$rootScope', '$log', '$scope', function(lastFm, $rootScope, $log, $scope) {

        $scope.lastfm = lastFm.getLastfm();
        lastFm.refresh();

        // IMG
        $scope.img = lastFm.getImage();

        // CLICK
        $scope.lastFmClick = function() {
            lastFm.onClick();
        };

        // NOW PLAYING
        $rootScope.$watch('song', function(songNew, songOld) {
            lastFm.nowPlaying(songNew);
        }, true);

    }])

    .factory('lastFm', ['lastFmServ', 'storage', '$log', function(lastFmServ, storage, $log) {

        var lastfm = storage.get('lastfm');
        var image = {'src': null};
        var apiKey = '2b532992c84242d372f5c0044d6883e5';
        var callBack = 'http://localhost' + URL_SITE + '/lastfm/callback';
        var nowPlayingId = storage.get('lastfm_nowplaying');
        var scrobbleId = storage.get('lastfm_scrobble');

        var fctr = {
            // init
            init: function() {
                //$log.info('lastFm.init');
                fctr.setImage();
            },
            // get lastfm
            getLastfm: function() {
                //$log.info('lastFm.getLastfm', lastfm);
                return lastfm;
            },
            // get session
            refresh: function() {
                lastFmServ.getSession().then(function(response) {
                    if (response == 'null') {
                        response = null;
                    }
                    lastfm = response;
                    storage.set('response', response);
                    fctr.setImage();
                    //$log.info('lastFm.refresh', response);
                });
            },
            // image
            getImage: function() {
                //$log.info('lastFm.getImage', image);
                return image;
            },
            setImage: function() {
                if (!lastfm) {
                    image.src = URL_BASE + '/img/lastfm_bw.png';
                } else {
                    image.src = URL_BASE + '/img/lastfm.png';
                }
                //$log.info('lastFm.setImage', image);
            },
            // on click
            onClick: function() {
                if (lastfm == null) {
                    var url = 'http://www.last.fm/api/auth/?api_key=' + apiKey + '&cb=' + callBack;
                    //$log.info('lastFm click', url);
                    window.location = url;
                } else {
                    var url = 'http://www.last.fm/user/' + lastfm.screen_name;
                    var win = window.open(url, '_blank');
                    win.focus();
                }
                //$log.info('lastFm click', url);
            },

            nowPlaying: function(song) {
                if (song != null && song.hasOwnProperty('artist')) {
                    if (song.id == nowPlayingId) {
                        //$log.info('lastFm.nowPlaying already updated', song.id);
                    } else {
                        //$log.info('lastFm.nowPlaying', song.id);
                        nowPlayingId = song.id;
                        lastFmServ.nowPlaying(song.id).then(
                            function() {
                                storage.set('lastfm_nowplaying', song.id);
                            },
                            function() {
                                nowPlayingId = null;
                                fctr.refresh();
                            }
                        );
                    }
                }
            },

            scrobble: function(song) {
                if (song != null && song.hasOwnProperty('artist')) {
                    if (song.id == scrobbleId) {
                        //$log.info('lastFm.scrobble already updated', song.id);
                    } else {
                        //$log.info('lastFm.scrobble', song.id);
                        scrobbleId = song.id;
                        lastFmServ.scrobble(song.id).then(
                            function() {
                                storage.set('lastfm_scrobble', song.id);
                            },
                            function() {
                                scrobbleId = null;
                                fctr.refresh();
                            }
                        );
                    }
                }
            }
        };

        fctr.init();
        return fctr;
    }])

    .service('lastFmServ', ['$http', '$log', function($http, $log) {

        this.getSession = function() {
            return $http.get(URL_SITE + '/lastfm').then(function(result) {
                return result.data;
            });
        };

        this.nowPlaying = function(songId) {
            return $http.get(URL_SITE + '/lastfm/now/playing/' + songId).then(function(result) {
                return result.data;
            });
        };

        this.scrobble = function(songId) {
            return $http.get(URL_SITE + '/lastfm/scrobble/' + songId).then(function(result) {
                return result.data;
            });
        };
    }])
;
