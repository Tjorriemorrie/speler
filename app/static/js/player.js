'use strict';


app.factory('playlistFcty', function ($sce) {
    var playlist = {};

    playlist.current = [
        {
//            src: $sce.trustAsResourceUrl("http://static.videogular.com/assets/audios/videogular.mp3"),
            src: "/static/music/foo.mp3",
            type: "audio/mpeg"
        }
    ];

    playlist.queue = [];

    return playlist;
});


app.controller('playerCtrl', function (playlistFcty) {
    this.config = {
        sources: playlistFcty.current,
//        theme: "/static/vendor/videogular-themes-default/videogular.min.css"
        theme: {
            url: "http://www.videogular.com/styles/themes/default/latest/videogular.css"
        }
    };
});