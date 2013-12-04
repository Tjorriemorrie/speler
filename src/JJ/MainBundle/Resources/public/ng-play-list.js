'use strict'

angular.module('ngPlayList', [])

    .factory('playList', ['storage', 'ngProgress', '$timeout', '$http', '$q', '$log', function(storage, ngProgress, $timeout, $http, $q, $log) {
        var playList = storage.get('playList') || [];
        var limit = 8;
        var busy = [];
        var durations = [30000, 30000, 30000, 30000, 30000];
        var avg = 30000;

        var update = function() {
            if (busy.length) {
                //$log.info(busy);
                var completed = 0;
                for (var i=0, l=busy.length; i<l; i++) {
                    busy[i] += 100;
                    completed += busy[i];
                }
                var progress = Math.min(99, completed / (avg * busy.length) * 100);
                //$log.info(busy.length + ' progress ' + progress);
                ngProgress.set(progress);
                $timeout(function() {
                    update();
                }, 100);
            }
        };

        return {
            getPlayList: function() {
                //$log.info('playList.getPlaylist', playList);
                return playList;
            },
            getFirst: function() {
                var song = null;
                if (playList.length > 0) {
                    song = playList[0];
                }
                //$log.info('playList.getFirst', song);
                return song;
            },
            isPlayListEmpty: function() {
                var result = playList.length < 1;
                //$log.info('playList.isPlayListEmpty', result);
                return result;
            },
            findNext: function() {
                var dfd = $q.defer();
                if (playList.length + (busy.length * 2) >= limit) {
                    //$log.info('playList.findNext', playList.length);
                    dfd.resolve();
                } else {
                    var ids = [];
                    playList.forEach(function(song) {
                        ids.push(song.id);
                    });
                    var formData = new FormData();
                    formData.append('ids', ids);

                    busy.push(0);
                    if (ngProgress.status() == 0) {
                        ngProgress.start();
                        update();
                    }
                    $http.post(URL_SITE + '/songs/next', formData, {
                        headers: {'Content-Type': undefined },
                        transformRequest: angular.identity
                    }).then(function(result) {
                        durations.unshift(busy[0]);
                        while (durations.length > 10) {
                            durations.pop();
                        }
                        busy.shift();
                        if (!busy.length) {
                            ngProgress.complete();
                        }
                        var sum = 0;
                        for (var i=0, l=durations.length; i<l; i++) {
                            sum += durations[i];
                        }
                        avg = sum / durations.length;
                        $log.info('avg', avg, durations);
                        result.data.forEach(function(song) {
                            if (song.count_played) {
                                song.played_at_from = moment().diff(moment(song.played_at), 'days');
                            }
                            playList.push(song);
                        });
                        storage.set('playList', playList);
                        //$log.info('playList.findNext', playList);
                        dfd.resolve();
                    });
                }
                return dfd.promise;
            },
            clearFirst: function() {
                if (playList.length > 0) {
                    playList.shift();
                    storage.set('playList', playList);
                }
                //$log.info('playList.clearFirst');
            }
        }
    }])
;
