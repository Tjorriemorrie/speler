'use strict'

angular.module('services', [])

    .factory('songsServ', ['$http', function($http) {
        return {
            findAll: function() {
                return $http.get(URL_SITE + '/songs').then(function(result) {
                    return result.data;
                });
            },
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
            },
            accrete: function(song) {
                return $http.get(URL_SITE + '/songs/' + song.id + '/accrete').then(function(result) {
                    return result.data;
                });
            },
            countAll: function() {
                return $http.get(URL_SITE + '/songs/count').then(function(result) {
                    return result.data;
                });
            }
        }
    }])

    .factory('albumsServ', ['$http', function($http) {
        return {
            countAll: function() {
                return $http.get(URL_SITE + '/albums/count').then(function(result) {
                    return result.data;
                });
            },
            findAll: function() {
                return $http.get(URL_SITE + '/albums').then(function(result) {
                    return result.data;
                });
            }
        }
    }])

    .factory('artistsServ', ['$http', function($http) {
        return {
            countAll: function() {
                return $http.get(URL_SITE + '/artists/count').then(function(result) {
                    return result.data;
                });
            },
            findAll: function() {
                return $http.get(URL_SITE + '/artists').then(function(result) {
                    return result.data;
                });
            }
        }
    }])

    .factory('ratingsServ', ['$http', function($http) {
        return {
            find: function(song) {
                return $http.get(URL_SITE + '/ratings/' + song.id).then(function(result) {
                    return result.data;
                });
            },
            match: function(winner, loser) {
                return $http.get(URL_SITE + '/ratings/' + winner.id + '/' + loser.id).then(function(result) {
                    return result.data;
                });
            }
        }
    }])

    .factory('editsServ', ['$http', function($http) {
        return {
            saveSong: function(song) {
                var formData = new FormData();
                formData.append('name', song.name);
                formData.append('number', song.number);
                return $http.post(URL_SITE + '/songs/' + song.id, formData, {
                    headers: {'Content-Type': undefined },
                    transformRequest: angular.identity
                }).then(function(result) {
                    return result.data;
                });
            },
            saveArtist: function(song, artist) {
                var formData = new FormData();
                formData.append('name', artist.name);
                formData.append('create', artist.create);
                return $http.post(URL_SITE + '/artists/update/' + song.id, formData, {
                    headers: {'Content-Type': undefined },
                    transformRequest: angular.identity
                }).then(function(result) {
                    return result.data;
                });
            }
        }
    }])
;
