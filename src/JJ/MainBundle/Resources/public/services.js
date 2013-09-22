'use strict'

angular.module('services', [])

    .factory('songsServ', ['$http', function($http) {
        return {
            findNext: function(playList) {
                var ids = [];
                playList.forEach(function(song) {
                    ids.push(song.id);
                });
                var formData = new FormData();
                formData.append('ids', ids);
                return $http.post(URL_SITE + '/songs/next', formData, {
                    headers: {'Content-Type': undefined },
                    transformRequest: angular.identity
                }).then(function(result) {
                    return result.data;
                });
            }
        }
    }])
;
