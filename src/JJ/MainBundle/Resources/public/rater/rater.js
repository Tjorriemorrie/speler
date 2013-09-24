'use strict'

angular.module('rater', [])

    .controller('raterCtrl', ['ratingsServ', '$rootScope', '$q', 'storage', '$scope', function(ratingsServ, $rootScope, $q, storage, $scope) {

        $scope.matches = [];
        $scope.match = null;

        $rootScope.$watch('song', function(songNew) {
            if (songNew != null) {
                console.info('rater new song!', songNew);
                ratingsServ.find(songNew).then(function(data) {
                    $scope.matches = data;
                });
            }
        });

        $scope.$watch('matches', function(matches) {
            if (matches.length) {
                console.info('matches changed!', matches);
                $scope.match = matches[0];
            }
        }, true);

    }]);
