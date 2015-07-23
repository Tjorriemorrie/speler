'use strict';


app.factory('playlistFcty', function ($sce, $http) {
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

    playlist.addQueue = function (song) {
        console.info('Playlist_addQueue...');
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

    playlist.playNext = function () {
        console.info('Playlist_playNext...');

        if (playlist.api.currentState == 'play') {
            console.warn('Playlist_playNext: already playing');
            return;
        }

        if (playlist.queue.length < 1) {
            console.warn('Playlist_playNext: queue empty');
            playlist.loadQueue();
            return;
        }

        // add song
        var queue = playlist.queue[0];
        queue.src = location.protocol + '//' + location.hostname + (location.port ? ':' + location.port : '') + queue.src
        console.info('Queue to play', queue);
        playlist.api.changeSource([
            {
                'type': queue.type,
                'src': $sce.trustAsResourceUrl(queue.src)
            }
        ]);

        // play
        playlist.api.play();
    };

    return playlist;
});


app.controller('playerCtrl', function (playlistFcty) {
    this.playlist = playlistFcty;
    this.config = {
        sources: [],
//        theme: "/static/vendor/videogular-themes-default/videogular.min.css"
        theme: {
            url: "http://www.videogular.com/styles/themes/default/latest/videogular.css"
        }
    };
    this.onPlayerReady = function (api) {
        playlistFcty.api = api;
        playlistFcty.loadQueue();
    };
    this.selectSong = function (song) {
        console.info('selected song', song);
        playlistFcty.selection.shift();
        playlistFcty.addQueue(song);
    };
    this.onSource = function (source) {
        console.log('player source changed', source);
    }
});