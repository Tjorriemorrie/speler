'use strict';


app.factory('playlistFcty', function ($sce, $http, $document) {
    var playlist = {};

    playlist.queue = [];
    playlist.loadQueue = function () {
        console.info('Playlist_loadQueue...');
        $http.get('/load/queue')
            .success(function (data, status, headers, config) {
                console.info('Playlist_loadQueue: success', data.length);

                // init queue
                playlist.queue = data;

                // start playback
                playlist.playNext();

                // get selection for more songs
                playlist.getSelection();
            })
            .error(function (data, status, headers, config) {
                alert('Error retrieving files');
                console.error('Playlist_loadQueue: error', data);
            });
    };

    playlist.selection = [];
    playlist.getSelection = function () {
        console.info('Playlist_selection...');
        if (playlist.selection.length > 0) {
            console.info('Playlist_selection: Already have selections');
            return;
        }
        if (playlist.queue.length > 5) {
            console.info('Playlist_selection: Already have enough songs in queue');
            return;
        }
        $http.get('/selection')
            .success(function (data, status, headers, config) {
                console.info('Playlist_selection: success', data.length);
                playlist.selection = data;
            })
            .error(function (data, status, headers, config) {
                alert('Error retrieving files');
                console.error('Playlist_selection: error', data);
            });
    };

    playlist.setSelection = function (song) {
        console.info('Playlist_addQueue...');
        // remove from selection
        playlist.selection.shift();
        // add to queue
        $http.post('/add/queue', $.param({'id': song.id}), {headers: {'Content-Type': 'application/x-www-form-urlencoded'}})
            .success(function (data, status, headers, config) {
                console.info('Playlist_addQueue: success');
                playlist.loadQueue();
            })
            .error(function (data, status, headers, config) {
                alert('Error retrieving files');
                console.error('Playlist_addQueue: error', data);
            });
    };

    playlist.current = null;
    playlist.playNext = function () {
        console.info('Playlist_playNext...');

        if (playlist.current != null) {
            console.warn('Playlist_playNext: audio player src set');
            return;
        }

        if (playlist.queue.length < 1) {
            console.warn('Playlist_playNext: queue empty');
            playlist.loadQueue();
            return;
        }

        // set song from queue
        var queue = playlist.queue[0];
        var host = location.protocol + '//' + location.hostname + (location.port ? ':' + location.port : '');
        console.info('Queue to play', queue);
        playlist.current = $sce.trustAsResourceUrl(host + queue.src);

        // play
        var el = $document[0].getElementById('audio');
        console.log(typeof(el));
        el.play();
    };

    playlist.ended = function () {
        console.info('Playlist_ended...');
        // move song on backend from queue to history
        // then load history
        // then load selection

        //
    };


    playlist.loadQueue();
    return playlist;
});


app.controller('playerCtrl', function (playlistFcty) {
    this.playlist = playlistFcty;
    this.selectSong = function (song) {
        console.info('selected song', song);
        playlistFcty.setSelection(song);
    };
    this.onEnded = function () {
        console.info('Song ended');
        playlistFcty.ended();
    };
});