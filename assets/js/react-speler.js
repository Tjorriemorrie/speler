//Custom Formatter component
'use strict';

var PercentageFormatter = React.createClass({
    displayName: 'PercentageFormatter',

    render: function render() {
        return React.createElement(
            'span',
            null,
            Math.round(this.props.value * 100) + '%'
        );
    }
});

var Library = React.createClass({
    displayName: 'Library',

    getInitialState: function getInitialState() {
        console.info('[Library] getInitialState');
        return {
            'isScanning': false,
            'grouping': null,
            'rows': []
        };
    },

    componentDidMount: function componentDidMount() {
        console.info('[Library] componentDidMount');
    },

    onTabSelect: function onTabSelect(grouping) {
        console.info('[Library] onTabSelect: ', grouping);
        this.loadLibrarySongs(grouping);
    },

    scanDirectory: function scanDirectory() {
        console.info('[Library] scandir');
        if (this.state.isScanning) {
            alert('Scanning in progress');
        } else {
            this.setState({ 'isScanning': true });
            $.getJSON('/scan/dir').done((function () {
                console.info('[Library] scanDirectory: done');
            }).bind(this)).always((function (data) {
                this.setState({ 'isScanning': false });
                if (data['parsed'] >= 50) {
                    this.scanDirectory();
                }
            }).bind(this));
        }
    },

    loadLibrarySongs: function loadLibrarySongs(grouping) {
        console.info('[Library] loadLibrarySongs: grouping = ', grouping);
        $.getJSON('/find/' + grouping).done((function (data) {
            console.info('[Library] loadLibrarySongs done');
            this.setState({
                'grouping': grouping,
                'rows': data
            });
        }).bind(this));
    },

    formatPercentage: function formatPercentage(v) {
        return Math.round(v * 100) + '%';
    },

    updateRow: function updateRow(row, key, val) {
        console.info('[Library] updateRow', row, key, val);

        var params = { 'id': row.id };
        params[key] = val;

        // submit form
        $.post('/set/' + this.props.grouping, params).done((function (res) {
            console.info('[Library] updateRow: done', res);
        }).bind(this)).fail((function (data, status, headers, config) {
            console.error('[Library] updateRow: error', data);
            alert('Error [Library] updateRow');
        }).bind(this)).always((function () {
            console.info('[Library] updateRow: always');
            this.loadLibrarySongs(this.props.grouping);
        }).bind(this));
    },

    getGrid: function getGrid() {
        console.info('[Library] getGrid');

        if (this.state.grouping == 'artists') {
            return React.createElement(
                'div',
                null,
                React.createElement(
                    'h4',
                    null,
                    'Artists'
                ),
                React.createElement(SmallGrid, {
                    rows: this.state.rows,
                    cols: [{ 'key': 'rating', 'name': 'Rating', 'format': this.formatPercentage }, { 'key': 'name', 'name': 'Title', 'edit': this.updateRow }, { 'key': 'count_albums', 'name': 'Albums' }, { 'key': 'count_songs', 'name': 'Songs' }]
                })
            );
        } else if (this.state.grouping == 'albums') {
            return React.createElement(
                'div',
                null,
                React.createElement(
                    'h4',
                    null,
                    'Albums'
                ),
                React.createElement(SmallGrid, {
                    rows: this.state.rows,
                    cols: [{ 'key': 'rating', 'name': 'Rating', 'format': this.formatPercentage }, { 'key': 'name', 'name': 'Title', 'edit': this.updateRow }, { 'key': 'artist.name', 'name': 'Artist' }, { 'key': 'count_songs', 'name': 'Songs' }]
                })
            );
        } else if (this.state.grouping == 'songs') {
            return React.createElement(
                'div',
                null,
                React.createElement(
                    'h4',
                    null,
                    'Songs'
                ),
                React.createElement(SmallGrid, {
                    rows: this.state.rows,
                    cols: [{ 'key': 'rating', 'name': 'Rating', 'format': this.formatPercentage }, { 'key': 'name', 'name': 'Title', 'edit': this.updateRow }, { 'key': 'artist.name', 'name': 'Artist', 'edit': this.updateRow }, { 'key': 'album.name', 'name': 'Album', 'edit': this.updateRow }, { 'key': 'track_number', 'name': 'Track', 'edit': this.updateRow }]
                })
            );
        }
    },

    render: function render() {
        console.info('[Library] render');

        var smallGrid = this.getGrid();

        return React.createElement(
            'div',
            { className: 'row' },
            React.createElement(
                'h3',
                null,
                React.createElement(
                    'button',
                    { className: 'btn btn-default btn-sm pull-right', onClick: this.scanDirectory },
                    this.state.isScanning ? 'Scanning...' : 'Refresh'
                ),
                'Library'
            ),
            React.createElement(
                'div',
                { className: 'btn-group', 'data-toggle': 'buttons' },
                React.createElement(
                    'label',
                    { className: 'btn btn-default' },
                    React.createElement('input', { type: 'radio', autoComplete: 'off', onClick: this.onTabSelect.bind(this, 'artists') }),
                    ' Artists'
                ),
                React.createElement(
                    'label',
                    { className: 'btn btn-default' },
                    React.createElement('input', { type: 'radio', autoComplete: 'off', onClick: this.onTabSelect.bind(this, 'albums') }),
                    ' Albums'
                ),
                React.createElement(
                    'label',
                    { className: 'btn btn-default' },
                    React.createElement('input', { type: 'radio', autoComplete: 'off', onClick: this.onTabSelect.bind(this, 'songs') }),
                    ' Songs'
                )
            ),
            smallGrid
        );
    }
});

var Factoid = React.createClass({
    displayName: 'Factoid',

    getInitialState: function getInitialState() {
        return {
            'ordering': ['is_parsed', 'is_songs_named', 'is_songs_tracked', 'is_songs_artist', 'is_songs_album', 'is_albums_sized'],

            //                'is_albums_complete',
            //                'is_logged_in',
            'is_parsed': false,
            'is_songs_named': false,
            'is_songs_tracked': false,
            'is_songs_artist': false,
            'is_songs_album': false,
            'is_albums_sized': false,
            'is_albums_complete': false,
            'is_logged_in': false
        };
    },

    componentDidMount: function componentDidMount() {
        console.info('[Factoid] componentDidMount');
        //        React.findDOMNode(this.refs.focusOnMe).focus();
        this.loadFactoid();
    },

    //    componentDidUpdate: function (prevProps, prevState) {
    //        console.info('[Factoid] componentDidUpdate');
    //    },

    loadFactoid: function loadFactoid() {
        console.info('[Factoid] loadFactoid');

        if (this.state.ordering.length > 0) {
            $.getJSON('/factoid/' + this.state.ordering[0]).done((function (data) {
                var new_state = {};
                if (data === true) {
                    new_state[this.state.ordering[0]] = true;
                    new_state['ordering'] = this.state.ordering;
                    new_state['ordering'].shift();
                    setTimeout((function () {
                        this.loadFactoid();
                    }).bind(this), 1000);
                } else {
                    new_state[this.state.ordering[0]] = data;
                }
                this.setState(new_state);
            }).bind(this)).fail((function (data, status, headers, config) {
                alert('Error loading factoid');
                console.error('[Factoid] loadFactoid: error', data);
            }).bind(this));
        }
    },

    submitSong: function submitSong(e) {
        console.info('[Factoid] submitSong');
        e.preventDefault();
        var form = React.findDOMNode(this.refs.formSong);
        console.info('[Factoid] submitSong form', form);
        this.sendFactoid(form, '/set/songs');
    },

    submitAlbum: function submitAlbum(e) {
        console.info('[Factoid] submitAlbum');
        e.preventDefault();
        var form = React.findDOMNode(this.refs.formAlbum);
        console.info('[Factoid] submitAlbum form', form);
        this.sendFactoid(form, '/set/albums');
    },

    sendFactoid: function sendFactoid(form, url) {
        console.info('[Factoid] sendFactoid');

        // remove factoid during submit
        var new_state = {};
        new_state[this.state.ordering[0]] = false;
        this.setState(new_state);

        // submit form
        $.post(url, $(form).serialize()).done((function (res) {
            console.info('[Factoid] sendFactoid res', res);
        }).bind(this)).fail((function (data, status, headers, config) {
            console.error('[Factoid] loadFactoid: error', data);
            alert('Error sendFactoid');
        }).bind(this)).always((function () {
            console.info('[Factoid] sendFactoid: always');
            this.loadFactoid();
        }).bind(this));
    },

    render: function render() {
        console.info('[Factoid] render');
        var msg = null;

        if (typeof this.state.is_parsed != 'boolean') {
            msg = 'You have ' + this.state.is_parsed.count + ' unparsed songs';
        } else if (typeof this.state.is_songs_named != 'boolean') {
            msg = React.createElement(
                'form',
                { ref: 'formSong', className: 'form', onSubmit: this.submitSong },
                React.createElement(
                    'dl',
                    null,
                    React.createElement(
                        'dt',
                        null,
                        'What is the name of this song?'
                    ),
                    React.createElement(
                        'dd',
                        null,
                        React.createElement(
                            'span',
                            null,
                            this.state.is_songs_named.path_name
                        )
                    ),
                    React.createElement(
                        'dd',
                        null,
                        React.createElement(
                            'small',
                            { classNames: 'text-muted' },
                            this.state.is_songs_named.web_path
                        )
                    )
                ),
                React.createElement('input', { type: 'hidden', name: 'song', value: this.state.is_songs_named.id }),
                React.createElement('input', { type: 'text', name: 'name', className: 'form-control input-sm', required: true, autoFocus: true, autoComplete: 'off' }),
                React.createElement(
                    'button',
                    { type: 'submit', className: 'btn btn-default btn-sm' },
                    'Submit'
                )
            );
        } else if (typeof this.state.is_songs_tracked != 'boolean') {
            msg = React.createElement(
                'form',
                { ref: 'formSong', className: 'form', onSubmit: this.submitSong },
                React.createElement(
                    'dl',
                    null,
                    React.createElement(
                        'dt',
                        null,
                        'What is the track of this song?'
                    ),
                    React.createElement(
                        'dd',
                        null,
                        React.createElement(
                            'span',
                            null,
                            this.state.is_songs_tracked.path_name
                        )
                    ),
                    React.createElement(
                        'dd',
                        null,
                        React.createElement(
                            'small',
                            { classNames: 'text-muted' },
                            this.state.is_songs_tracked.web_path
                        )
                    )
                ),
                React.createElement('input', { type: 'hidden', name: 'id', value: this.state.is_songs_tracked.id }),
                React.createElement('input', { type: 'number', name: 'song_track_number', className: 'form-control input-sm', required: true, autoFocus: true, autoComplete: 'off' }),
                React.createElement(
                    'button',
                    { type: 'submit', className: 'btn btn-default btn-sm' },
                    'Submit'
                )
            );
        } else if (typeof this.state.is_songs_artist != 'boolean') {
            msg = React.createElement(
                'form',
                { ref: 'formSong', className: 'form', onSubmit: this.submitSong },
                React.createElement(
                    'dl',
                    null,
                    React.createElement(
                        'dt',
                        null,
                        'Who is the artist of this song?'
                    ),
                    React.createElement(
                        'dd',
                        null,
                        this.state.is_songs_artist.name
                    ),
                    React.createElement(
                        'dd',
                        null,
                        React.createElement(
                            'small',
                            { className: 'text-muted' },
                            this.state.is_songs_artist.web_path
                        )
                    )
                ),
                React.createElement('input', { type: 'hidden', name: 'id', value: this.state.is_songs_artist.id }),
                React.createElement('input', { type: 'text', className: 'form-control input-sm', name: 'artist.name', required: true, autoFocus: true, autoComplete: 'off' }),
                React.createElement(
                    'button',
                    { type: 'submit', className: 'btn btn-default btn-sm' },
                    'Submit'
                )
            );
        } else if (typeof this.state.is_songs_album != 'boolean') {
            msg = React.createElement(
                'form',
                { ref: 'formSong', className: 'form', onSubmit: this.submitSong },
                React.createElement(
                    'dl',
                    null,
                    React.createElement(
                        'dt',
                        null,
                        'What is the album of this song?'
                    ),
                    React.createElement(
                        'dd',
                        null,
                        this.state.is_songs_album.name
                    ),
                    React.createElement(
                        'dd',
                        null,
                        React.createElement(
                            'small',
                            { className: 'text-muted' },
                            this.state.is_songs_album.web_path
                        )
                    )
                ),
                React.createElement('input', { type: 'hidden', name: 'id', value: this.state.is_songs_album.id }),
                React.createElement('input', { type: 'text', className: 'form-control input-sm', name: 'album.name', required: true, autoFocus: true, autoComplete: 'off' }),
                React.createElement(
                    'button',
                    { type: 'submit', className: 'btn btn-default btn-sm' },
                    'Submit'
                )
            );
        } else if (typeof this.state.is_albums_sized != 'boolean') {
            msg = React.createElement(
                'form',
                { ref: 'formAlbum', className: 'form', onSubmit: this.submitAlbum },
                React.createElement(
                    'dl',
                    null,
                    React.createElement(
                        'dt',
                        null,
                        'How many tracks does this album have?'
                    ),
                    React.createElement(
                        'dd',
                        null,
                        React.createElement(
                            'span',
                            null,
                            this.state.is_albums_sized.name
                        )
                    ),
                    React.createElement(
                        'dd',
                        null,
                        '~ ',
                        this.state.is_albums_sized.artist.name
                    )
                ),
                React.createElement('input', { type: 'hidden', name: 'id', value: this.state.is_albums_sized.id }),
                React.createElement('input', { type: 'number', name: 'total_tracks', className: 'form-control input-sm', required: true, autoFocus: true, autoComplete: 'off' }),
                React.createElement(
                    'button',
                    { type: 'submit', className: 'btn btn-default btn-sm' },
                    'Submit'
                )
            );
        } else if (typeof this.state.is_albums_complete != 'boolean') {
            msg = React.createElement(
                'form',
                { ref: 'formAlbumsSize', className: 'form', onSubmit: this.submitAlbumsSized },
                React.createElement('input', { type: 'hidden', name: 'album_id', value: this.state.is_albums_complete.album.id }),
                React.createElement(
                    'h4',
                    null,
                    'This album has missing tracks!'
                ),
                React.createElement(
                    'dl',
                    null,
                    React.createElement(
                        'dt',
                        null,
                        'Tracks set on the album currently is ',
                        React.createElement(
                            'strong',
                            null,
                            this.state.is_albums_complete.album.total_tracks
                        )
                    ),
                    React.createElement(
                        'dd',
                        null,
                        React.createElement(
                            'span',
                            null,
                            this.state.is_albums_complete.album.name
                        )
                    ),
                    React.createElement(
                        'dd',
                        null,
                        '~ ',
                        this.state.is_albums_complete.album.artist.name
                    )
                ),
                React.createElement('input', { type: 'number', className: 'form-control input-sm', id: 'album_size', name: 'total_tracks', required: true, autoFocus: true }),
                React.createElement(
                    'button',
                    { type: 'submit', className: 'btn btn-default btn-sm' },
                    'Submit'
                ),
                React.createElement('hr', null),
                React.createElement(
                    'dl',
                    null,
                    React.createElement(
                        'dt',
                        null,
                        this.state.is_albums_complete.songs.length,
                        ' songs that belong to the album:'
                    ),
                    this.state.is_albums_complete.songs.map(function (song) {
                        return React.createElement(
                            'dd',
                            null,
                            song.track_number,
                            ' ',
                            song.name
                        );
                    })
                )
            );
        } else if (typeof this.state.is_logged_in != 'boolean') {
            msg = 'You are not logged into Last.fm';
        }

        if (msg) {
            return React.createElement(
                'div',
                { className: 'alert alert-default' },
                msg
            );
        } else {
            return React.createElement('span', null);
        }
    }
});

React.render(React.createElement(
    'section',
    null,
    React.createElement(Factoid, null),
    React.createElement(Library, null)
), document.getElementById('lib-side'));
;var Player = React.createClass({
    displayName: 'Player',

    audio_tag: null,
    getInitialState: function getInitialState() {
        console.info('[Player] getInitialState...');
        return {
            'queue': [],
            'histories': [],
            'selections': [],
            'current': ""
        };
    },
    componentDidMount: function componentDidMount() {
        console.info('[Player] componentDidMount...');
        this.audio_tag = React.findDOMNode(this.refs.audio_tag);
        this.audio_tag.addEventListener('ended', this.onEnded);
        console.info('[Player] audio_tag event listener added for ended');
        this.audio_tag.volume = 0.75;
        console.info('[Player] audio_tag volume set to 75%');
        this.loadQueue();
    },
    notifyPing: function notifyPing() {
        console.info('Notifying ping...');
        if (this.state.selections.length < 1) {
            return false;
        }
        if (this.state.queue.length >= 4) {
            return false;
        }
        var audio_ping = new Audio('/static/sounds/ping.mp3');
        audio_ping.play();
    },
    loadQueue: function loadQueue() {
        console.info('[Player] loadQueue...');
        return $.get('/load/queue').success((function (data, status, headers, config) {
            console.info('[Player] loadQueue: ', data.length, data[0]);
            this.setState({ 'queue': data });
            this.playNext();
            this.getSelections();
            this.loadHistories();
        }).bind(this)).error((function (data, status, headers, config) {
            alert('Error retrieving files');
            console.error('[Player] loadQueue: error', data);
        }).bind(this));
    },
    loadHistories: function loadHistories() {
        console.info('[Player] loadHistories...');
        return $.get('/load/histories').success((function (data, status, headers, config) {
            console.info('[Player] loadHistories: ', data.length, data[0]);
            this.setState({ 'histories': data });
        }).bind(this)).error((function (data, status, headers, config) {
            alert('Error retrieving files');
            console.error('[Player] loadHistories: error', data);
        }).bind(this));
    },
    getSelections: function getSelections() {
        console.info('[Player] getSelection...');
        if (this.state.selections.length > 0) {
            console.info('[Player] getSelection: Already have selections');
            return;
        }
        if (this.state.queue.length > 4) {
            console.info('[Player] getSelection: Already have enough songs in queue');
            return;
        }
        $.get('/selection').success((function (data, status, headers, config) {
            console.info('[Player] getSelection: success', data.length, data[0]);
            this.setState({ "selections": data });
        }).bind(this)).error((function (data, status, headers, config) {
            alert('Error retrieving selection files');
            console.error('[Player] getSelection: error', data);
        }).bind(this));
    },
    setSelection: function setSelection(song) {
        console.info('[Player] setSelection...');

        // remove from selection
        var selections = this.state.selections;
        var selection = selections.shift();
        this.setState({ "selections": selections });
        console.info('[Player] setSelection: removed from selections', this.state.selections.length);

        // update backend
        var losers = [];
        selection.forEach(function (loser) {
            losers.push(loser.id);
        });
        $.post('/add/queue', { 'winner': song.id, 'losers': losers }).success((function (data, status, headers, config) {
            this.loadQueue();
        }).bind(this)).error((function (data, status, headers, config) {
            alert('Error updating selection');
            console.error('[Player] setSelection: error', data);
        }).bind(this));
    },
    playNext: function playNext() {
        console.info('[Player] playNext...');

        // empty queue?
        if (this.state.queue.length < 1) {
            console.warn('[Player] playNext: queue empty');
            return;
        }

        // already playing?
        if (this.state.current != "") {
            console.warn('[Player] playNext: already playing');
            return;
        }

        var queue_first = this.state.queue[0];
        console.info('[Player] playNext:', queue_first);
        this.setState({ "current": queue_first.src });
        this.audio_tag.play();
        document.title = queue_first.song.name + ' ~' + queue_first.song.artist.name;
        this.notifyPing();
    },
    onEnded: function onEnded() {
        console.info('[Player] onEnded...');
        this.setState({ "current": "" });
        document.title = "speler";

        // update backend
        $.post('/ended', { 'id': this.state.queue[0].id }).success((function (data, status, headers, config) {
            this.loadQueue();
        }).bind(this)).error((function (data, status, headers, config) {
            alert('Error updating selection');
            console.error('[Player] setSelection: error', data);
        }).bind(this));
    },
    render: function render() {
        console.info('[Player] render...');
        return React.createElement(
            'div',
            { className: 'row' },
            React.createElement(
                'div',
                { className: 'col-sm-11' },
                React.createElement(
                    'div',
                    null,
                    React.createElement('audio', { ref: 'audio_tag', src: this.state.current, controls: true }),
                    this.state.queue.length ? React.createElement(
                        'a',
                        { onClick: this.onEnded, href: '#', className: 'audio_next' },
                        '⪼'
                    ) : ''
                ),
                !this.state.selections.length ? '' : React.createElement(
                    'div',
                    null,
                    React.createElement(
                        'h5',
                        null,
                        'Choose next song to add to playlist:'
                    ),
                    React.createElement(
                        'div',
                        { className: 'btn-group btn-group-vertical' },
                        this.state.selections[0].map((function (selection) {
                            return React.createElement(
                                'a',
                                { key: selection.id, onClick: this.setSelection.bind(this, selection), className: 'btn btn-default', type: 'button' },
                                React.createElement(
                                    'small',
                                    null,
                                    React.createElement(SongDetails, { song: selection })
                                )
                            );
                        }).bind(this))
                    )
                ),
                React.createElement(
                    'div',
                    null,
                    React.createElement(
                        'h5',
                        null,
                        'Playlist:'
                    ),
                    React.createElement(
                        'ol',
                        null,
                        this.state.queue.map(function (queue, index) {
                            return React.createElement(
                                'li',
                                { key: queue.id, className: index < 1 ? 'current_song' : '' },
                                React.createElement(SongDetails, { song: queue.song })
                            );
                        })
                    )
                ),
                React.createElement(
                    'div',
                    null,
                    React.createElement(
                        'h5',
                        null,
                        'Recently Played:'
                    ),
                    !this.state.histories.length ? React.createElement(
                        'p',
                        null,
                        'no songs played recently'
                    ) : React.createElement(
                        'ol',
                        null,
                        this.state.histories.map(function (history) {
                            return React.createElement(
                                'li',
                                { key: history.id },
                                React.createElement(SongDetails, { song: history.song })
                            );
                        })
                    )
                )
            )
        );
    }
});

var SongDetails = React.createClass({
    displayName: 'SongDetails',

    render: function render() {
        return React.createElement(
            'span',
            null,
            React.createElement(
                'strong',
                null,
                React.createElement(
                    'small',
                    { className: 'text-muted' },
                    this.props.song.track_number,
                    ' '
                ),
                React.createElement(
                    'span',
                    { title: this.props.song.id },
                    ' ',
                    this.props.song.name
                )
            ),
            React.createElement('br', null),
            React.createElement(
                'small',
                null,
                React.createElement(
                    'span',
                    null,
                    this.props.song.artist ? this.props.song.artist.name : 'no artist'
                ),
                React.createElement('br', null),
                React.createElement(
                    'em',
                    null,
                    React.createElement(
                        'small',
                        { className: 'text-muted' },
                        this.props.song.album ? this.props.song.album.year : ''
                    ),
                    ' ',
                    this.props.song.album ? this.props.song.album.name : 'no album'
                )
            )
        );
    }
});

React.render(React.createElement(Player, null), document.getElementById('play-side'));
