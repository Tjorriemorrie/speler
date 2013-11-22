'use strict'

angular.module('albums', [])

    .factory('albumsMdl', ['albumsSrv', 'storage', '$log', function(albumsSrv, storage, $log) {

        var albumsMdl = {
            albums: [],

            findAll: function(r) {
                albumsSrv.findAll(r).then(function(albums) {
                    angular.forEach(albums, function(album) {
                        if (album.hasOwnProperty('rating')) {
                            album.rating = parseFloat(album.rating);
                        } else {
                            album.rating = 0;
                        }
                    });
                    albumsMdl.albums = albums;
                    storage.set('albums', albums);
                    return albums;
                });
            },

            check: function(album) {
                var found = false;
                albumsMdl.albums.forEach(function(item, index) {
                    if (item.id == album.id) {
                        found = true;
                        albumsMdl.albums[index] = album;
                    }
                });
                if (!found) {
                    albumsMdl.albums.push(album);
                }
                storage.set('albums', albumsMdl.albums);
                //$log.info('albumsMdl.check', found, album);
            },

            refresh: function(id) {
                albumsSrv.find(id, false).then(function(album) {
                    if (album.hasOwnProperty('rating')) {
                        album.rating = parseFloat(album.rating);
                    } else {
                        album.rating = 0;
                    }
                    //$log.info('albumsMdl.refresh', album);
                    albumsMdl.check(album);
                });
            },

        };

        albumsMdl.albums = storage.get('albums');
        if (albumsMdl.albums == null || albumsMdl.albums.length < 1 || Math.random() < 0.10) {
            //$log.info('refreshing albums...');
            albumsMdl.findAll();
        }

        return albumsMdl;
    }])

    .service('albumsSrv', ['$http', '$log', function($http, $log) {

        this.find = function(id, r) {
            return $http.get(URL_SITE + '/albums/' + id, {'cache': !(!!r)}).then(function(result) {
                return result.data;
            });
        };

        this.findAll = function(r) {
            return $http.get(URL_SITE + '/albums', {'cache': !(!!r)}).then(function(result) {
                return result.data;
            });
        };

    }])
;
