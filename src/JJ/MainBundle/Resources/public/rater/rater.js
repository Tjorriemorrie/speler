'use strict'

angular.module('rater', [])

    .controller('raterCtrl', ['ratingsServ', '$rootScope', '$q', 'storage', '$scope', function(ratingsServ, $rootScope, $q, storage, $scope) {

        $scope.matches = [];
        $scope.match = null;
        $scope.stats = null;

        $rootScope.$watch('song', function(songNew) {
            $scope.matches = [];
            if (songNew != null) {
                console.info('rater new song!', songNew);

                $scope.stats = {
                    'priority': songNew.priority,
                    'count_played': songNew.count_played,
                    'played_at': songNew.played_at,
                    'count_rated': songNew.count_rated,
                    'wins': songNew.hasOwnProperty('rating') ? songNew.count_rated * songNew.rating : 0,
                };
                $scope.setRating();

                if (songNew.hasOwnProperty('matches')) {
                    $scope.matches = songNew.matches;
                } else {
                    ratingsServ.find(songNew).then(function(data) {
                        $scope.matches = data;
                    });
                }
            }
        });

        $scope.$watch('matches', function(matches) {
            $scope.match = null;
            if (matches.length) {
                console.info('matches changed!', matches);
                $scope.match = matches[0];
            }
        }, true);

        $scope.$watch('match', function(match) {
            if (match != null) {
            }
        });

        // set match
        $scope.setMatch = function(result) {
            //console.info('setMatch', result);
            $scope.matches.shift();
            $scope.stats.count_rated++;
            if (result === 1) {
                ratingsServ.match($scope.match, $rootScope.song);
            } else if (result === -1) {
                $scope.stats.wins++;
                ratingsServ.match($rootScope.song, $scope.match);
            } else {
                console.warn('Unknown match result');
            }
            $scope.setRating();
        };

        $scope.setRating = function() {
            var rating = 0;
            if ($scope.stats.count_rated) {
                rating = $scope.stats.wins / $scope.stats.count_rated;
            }
            //console.info('rating', rating);
            $scope.stats.rating = rating;
        };
    }]);
