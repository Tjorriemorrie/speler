'use strict'

angular.module('artists', [])

    .factory('artistsMdl', ['artistsSrv', 'storage', '$log', function(artistsSrv, storage, $log) {

        var artistsMdl = {
            artists: [],

            findAll: function(r) {
                artistsSrv.findAll(r).then(function(artists) {
                    angular.forEach(artists, function(artist) {
                        if (artist.hasOwnProperty('rating')) {
                            artist.rating = parseFloat(artist.rating);
                        } else {
                            artist.rating = 0;
                        }
                    });
                    artistsMdl.artists = artists;
                    storage.set('artists', artists);
                    return artists;
                });
            },

            check: function(artist) {
                var found = false;
                artistsMdl.artists.forEach(function(item, index) {
                    if (item.id == artist.id) {
                        found = true;
                        artistsMdl.artists[index] = artist;
                    }
                });
                if (!found) {
                    artistsMdl.artists.push(artist);
                }
                storage.set('artists', artistsMdl.artists);
                //$log.info('artistsMdl.check', found, artist);
            },

            refresh: function(id) {
                artistsSrv.find(id, false).then(function(artist) {
                    if (artist.hasOwnProperty('rating')) {
                        artist.rating = parseFloat(artist.rating);
                    } else {
                        artist.rating = 0;
                    }
                    //$log.info('artistsMdl.refresh', artist);
                    artistsMdl.check(artist);
                });
            }

        };

        artistsMdl.artists = storage.get('artists');
        if (artistsMdl.artists == null || artistsMdl.artists.length < 1 || Math.random() < 0.10) {
            //$log.info('refreshing artists...');
            artistsMdl.findAll();
        }

        return artistsMdl;
    }])

    .service('artistsSrv', ['$http', '$log', function($http, $log) {

        this.find = function(id, r) {
            return $http.get(URL_SITE + '/artists/' + id, {'cache': !(!!r)}).then(function(result) {
                return result.data;
            });
        };

        this.findAll = function(r) {
            return $http.get(URL_SITE + '/artists', {'cache': !(!!r)}).then(function(result) {
                return result.data;
            });
        };

    }])
;
