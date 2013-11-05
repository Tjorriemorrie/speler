'use strict'

angular.module('ngPlayList', [])

    .factory('playList', ['$http', '$q', '$log', function($http, $q, $log) {
        var playList = [];
        var limit = 10;
        return {
            getPlayList: function() {
                $log.info('playList.getPlaylist', playList);
                return playList;
            },
            getFirst: function() {
                var song = null;
                if (playList.length > 0) {
                    song = playList[0];
                }
                $log.info('playList.getFirst', song);
                return song;
            },
            isPlayListEmpty: function() {
                var result = playList.length < 1;
                $log.info('playList.isPlayListEmpty', result);
                return result;
            },
            findNext: function() {
                var dfd = $q.defer();
                if (playList.length > limit) {
                    $log.info('playList.findNext', playList.length);
                    dfd.resolve();
                } else {
                    var ids = [];
                    playList.forEach(function(song) {
                        ids.push(song.id);
                    });
                    var formData = new FormData();
                    formData.append('ids', ids);
                    $http.post(URL_SITE + '/songs/next', formData, {
                        headers: {'Content-Type': undefined },
                        transformRequest: angular.identity
                    }).then(function(result) {
                        result.data.forEach(function(song) {
                            playList.push(song);
                        });
                        //playList = playList.concat(result.data);
                        $log.info('playList.findNext', playList.length);
                        dfd.resolve();
                    });
                }
                return dfd.promise;
            },
            clearFirst: function() {
                if (playList.length > 0) {
                    playList.shift();
                }
                $log.info('playList.clearFirst');
            }
        }
    }])
;
