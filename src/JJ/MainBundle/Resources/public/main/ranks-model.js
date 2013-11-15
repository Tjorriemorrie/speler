'use strict'

angular.module('ranks', [])

    .factory('ranksMdl', ['$rootScope', '$http', '$timeout', '$log', function($rootScope, $http, $timeout, $log) {

        var timeout = null;
        var rankings = {};

        var ranksMdl = {

            getRankings: function() {
                $log.info('ranksMdl.getRankings');
                return rankings;
            },

            reload: function(songId) {
                $log.info('ranksMdl.reload');
                if (timeout) {
                    $timeout.cancel(timeout);
                }
                timeout = $timeout(function() {
                    $http.get(URL_SITE + '/ratings/rankings/' + songId).then(function(result) {
                        $log.info('ranksMdl.load', result.data);
                        rankings.songs = result.data;
                    });
                }, 3000);
            },
        };

        $rootScope.$watch('song.matches', function(matches) {
            if ($rootScope.song != null) {
//                ranksMdl.reload($rootScope.song.id);
            } else {
                rankings.songs = [];
            }
        }, true);

        $rootScope.$watch('song.id', function(id) {
            rankings.songs = [];
            if ($rootScope.song != null) {
//                ranksMdl.reload($rootScope.song.id);
            }
        });

        return ranksMdl;
    }])
;
