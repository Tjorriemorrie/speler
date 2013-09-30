'use strict'

angular.module('rater', [])

    .controller('raterCtrl', ['ratingsServ', '$rootScope', '$q', '$log', 'storage', '$scope', function (ratingsServ, $rootScope, $q, $log, storage, $scope) {

        // STATS
        $scope.stats = null;
        $rootScope.$watch('song', function (songNew, songOld) {
            if (songNew != null) {
                $log.log('$watch stats');
                $scope.stats = {
                    'priority': songNew.priority,
                    'count_played': songNew.count_played,
                    'played_at': songNew.played_at,
                    'count_rated': songNew.count_rated,
                    'wins': songNew.hasOwnProperty('rating') ? songNew.count_rated * songNew.rating : 0,
                };
                $log.debug($scope.stats);
                $scope.setRating();
            }
        });

        // STATS SET RATING
        $scope.setRating = function () {
            var rating = 0;
            if ($scope.stats.count_rated) {
                rating = $scope.stats.wins / $scope.stats.count_rated;
            }
            //console.info('rating', rating);
            $scope.stats.rating = rating;
        };


        // MATCHES
        $scope.match = null;

        // WATCH MATCHES
        $rootScope.$watch('song.matches', function (matches) {
            if (matches != null) {
                $log.log('$watch matches', matches.length);
                if (!matches.length) {
                    $scope.match = null;
                } else {
                    $scope.match = matches[0];
                }
            }
        });

        // SAVE MATCH
        $scope.setMatch = function (result) {
            $log.log('setMatch', result);
            $scope.stats.count_rated++;
            if (result === 1) {
                ratingsServ.match($scope.match, $rootScope.song);
            } else if (result === -1) {
                $scope.stats.wins++;
                ratingsServ.match($rootScope.song, $scope.match);
            } else {
                $log.warn('Unknown match result');
            }
            $scope.setRating();
            $rootScope.song.matches.shift();
            $log.debug('matches shifted', $rootScope.song.matches);
        };

    }]);
