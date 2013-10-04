'use strict'

angular.module('rater', [])

    .controller('raterCtrl', ['ratingsServ', '$rootScope', '$q', '$log', 'storage', '$scope', function (ratingsServ, $rootScope, $q, $log, storage, $scope) {

        // STATS
        $scope.stats = null;
        $rootScope.$watch('song', function (songNew, songOld) {
            if (songNew != null) {
                $scope.stats = {
                    'priority': songNew.priority,
                    'count_played': songNew.count_played,
                    'played_at': songNew.played_at,
                    'count_rated': songNew.count_rated,
                    'wins': songNew.hasOwnProperty('rating') ? songNew.count_rated * songNew.rating : 0,
                };
            }
        });

        // STATS SET RATING
        $scope.$watch('stats', function(stats) {
            if ($scope.stats == null) {
                return;
            }
            var rating = 0;
            if ($scope.stats.count_rated) {
                rating = $scope.stats.wins / $scope.stats.count_rated;
            }
            $scope.stats.rating = rating;
            //$log.debug('stats', $scope.stats);
        }, true);


        // MATCHES
        $scope.match = null;

        // FAVICO
        var favicon = new Favico({
            animation:'popFade'
        });

        // WATCH MATCHES
        $rootScope.$watch('song.matches', function (matches) {
            favicon.badge(0);
            if (matches != null) {
                $log.log('$watch matches', matches.length);
                if (!matches.length) {
                    $scope.match = null;
                } else {
                    $scope.match = matches[0];
                    favicon.badge(matches.length);
                }
            }
        }, true);

        // SAVE MATCH
        $scope.setMatch = function (result) {
            $log.log('setMatch...', result);
            $scope.stats.count_rated++;
            if (result === 1) {
                ratingsServ.match($scope.match, $rootScope.song);
            } else if (result === -1) {
                $scope.stats.wins++;
                ratingsServ.match($rootScope.song, $scope.match);
            } else {
                $log.warn('Unknown match result');
            }
            $rootScope.song.matches.shift();
        };

    }]);
