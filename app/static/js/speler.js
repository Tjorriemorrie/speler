(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var React = require('react');
var Player = require('./Player.jsx');
var Library = require('./Library.jsx');
var Factoid = require('./Factoid.jsx');

var App = new React.createClass({

	render: function render() {
		console.info('[App] render');
		return React.createElement(
			'div',
			{ className: 'row' },
			React.createElement(
				'div',
				{ id: 'play-side', className: 'col-sm-5' },
				React.createElement(Player, null)
			),
			React.createElement(
				'div',
				{ id: 'lib-side', className: 'col-sm-7' },
				React.createElement(Factoid, null),
				React.createElement(Library, null)
			)
		);
	}

});

React.render(React.createElement(App, null), document.getElementById('app'));

},{"./Factoid.jsx":2,"./Library.jsx":3,"./Player.jsx":4,"react":162}],2:[function(require,module,exports){
'use strict';

var React = require('react');

var Factoid = React.createClass({

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

module.exports = Factoid;

},{"react":162}],3:[function(require,module,exports){
'use strict';

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactSmallgrid = require('react-smallgrid');

var _reactSmallgrid2 = _interopRequireDefault(_reactSmallgrid);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Library = _react2.default.createClass({

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
                this.scanId3s();
            }).bind(this));
        }
    },

    scanId3s: function scanId3s() {
        console.info('[Library] scanId3s');
        $.getJSON('/scan/id3').done((function (data) {
            console.info('[Library] scanId3s: done');
            if (data['parsed'] >= 50) {
                this.scanId3s();
            } else {
                this.setState({ 'isScanning': false });
            }
        }).bind(this));
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
            console.info('[Library] getGrid: artists');
            return _react2.default.createElement(
                'div',
                null,
                _react2.default.createElement(
                    'h4',
                    null,
                    'Artists'
                ),
                _react2.default.createElement(_reactSmallgrid2.default, {
                    rows: this.state.rows,
                    cols: [{ 'key': 'rating', 'name': 'Rating', 'format': this.formatPercentage }, { 'key': 'name', 'name': 'Title', 'edit': this.updateRow }, { 'key': 'count_albums', 'name': 'Albums' }, { 'key': 'count_songs', 'name': 'Songs' }]
                })
            );
        } else if (this.state.grouping == 'albums') {
            return _react2.default.createElement(
                'div',
                null,
                _react2.default.createElement(
                    'h4',
                    null,
                    'Albums'
                ),
                _react2.default.createElement(_reactSmallgrid2.default, {
                    rows: this.state.rows,
                    cols: [{ 'key': 'rating', 'name': 'Rating', 'format': this.formatPercentage }, { 'key': 'name', 'name': 'Title', 'edit': this.updateRow }, { 'key': 'artist.name', 'name': 'Artist' }, { 'key': 'count_songs', 'name': 'Songs' }]
                })
            );
        } else if (this.state.grouping == 'songs') {
            return _react2.default.createElement(
                'div',
                null,
                _react2.default.createElement(
                    'h4',
                    null,
                    'Songs'
                ),
                _react2.default.createElement(_reactSmallgrid2.default, {
                    rows: this.state.rows,
                    cols: [{ 'key': 'rating', 'name': 'Rating', 'format': this.formatPercentage }, { 'key': 'name', 'name': 'Title', 'edit': this.updateRow }, { 'key': 'artist.name', 'name': 'Artist', 'edit': this.updateRow }, { 'key': 'album.name', 'name': 'Album', 'edit': this.updateRow }, { 'key': 'track_number', 'name': 'Track', 'edit': this.updateRow }]
                })
            );
        }
    },

    render: function render() {
        console.info('[Library] render');

        var smallGrid = this.getGrid();

        return _react2.default.createElement(
            'div',
            { className: 'row' },
            _react2.default.createElement(
                'h3',
                null,
                _react2.default.createElement(
                    'button',
                    { className: 'btn btn-default btn-sm pull-right', onClick: this.scanDirectory },
                    this.state.isScanning ? 'Scanning...' : 'Refresh'
                ),
                'Library'
            ),
            _react2.default.createElement(
                'div',
                { className: 'btn-group', 'data-toggle': 'buttons' },
                _react2.default.createElement(
                    'label',
                    { className: 'btn btn-default', onClick: this.onTabSelect.bind(this, 'artists') },
                    _react2.default.createElement('input', { type: 'radio', autoComplete: 'off' }),
                    ' Artists'
                ),
                _react2.default.createElement(
                    'label',
                    { className: 'btn btn-default', onClick: this.onTabSelect.bind(this, 'albums') },
                    _react2.default.createElement('input', { type: 'radio', autoComplete: 'off' }),
                    ' Albums'
                ),
                _react2.default.createElement(
                    'label',
                    { className: 'btn btn-default', onClick: this.onTabSelect.bind(this, 'songs') },
                    _react2.default.createElement('input', { type: 'radio', autoComplete: 'off' }),
                    ' Songs'
                )
            ),
            smallGrid
        );
    }
});

module.exports = Library;

},{"react":162,"react-smallgrid":7}],4:[function(require,module,exports){
'use strict';

var React = require('react');
var SongDetails = require('./SongDetails.jsx');

var Player = React.createClass({
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
        this.audio_tag.volume = 0.50;
        console.info('[Player] audio_tag volume set to 50%');
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

module.exports = Player;

},{"./SongDetails.jsx":5,"react":162}],5:[function(require,module,exports){
'use strict';

var React = require('react');

var SongDetails = React.createClass({
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

module.exports = SongDetails;

},{"react":162}],6:[function(require,module,exports){
// shim for using process in browser

var process = module.exports = {};
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = setTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    clearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        setTimeout(drainQueue, 0);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}],7:[function(require,module,exports){
(function (global){
!function a(b,c,d){function e(g,h){if(!c[g]){if(!b[g]){var i="function"==typeof require&&require;if(!h&&i)return i(g,!0);if(f)return f(g,!0);var j=new Error("Cannot find module '"+g+"'");throw j.code="MODULE_NOT_FOUND",j}var k=c[g]={exports:{}};b[g][0].call(k.exports,function(a){var c=b[g][1][a];return e(c?c:a)},k,k.exports,a,b,c,d)}return c[g].exports}for(var f="function"==typeof require&&require,g=0;g<d.length;g++)e(d[g]);return e}({1:[function(a,b,c){function d(){k=!1,h.length?j=h.concat(j):l=-1,j.length&&e()}function e(){if(!k){var a=setTimeout(d);k=!0;for(var b=j.length;b;){for(h=j,j=[];++l<b;)h&&h[l].run();l=-1,b=j.length}h=null,k=!1,clearTimeout(a)}}function f(a,b){this.fun=a,this.array=b}function g(){}var h,i=b.exports={},j=[],k=!1,l=-1;i.nextTick=function(a){var b=new Array(arguments.length-1);if(arguments.length>1)for(var c=1;c<arguments.length;c++)b[c-1]=arguments[c];j.push(new f(a,b)),1!==j.length||k||setTimeout(e,0)},f.prototype.run=function(){this.fun.apply(null,this.array)},i.title="browser",i.browser=!0,i.env={},i.argv=[],i.version="",i.versions={},i.on=g,i.addListener=g,i.once=g,i.off=g,i.removeListener=g,i.removeAllListeners=g,i.emit=g,i.binding=function(a){throw new Error("process.binding is not supported")},i.cwd=function(){return"/"},i.chdir=function(a){throw new Error("process.chdir is not supported")},i.umask=function(){return 0}},{}],2:[function(a,b,c){(function(a){(function(){function d(a,b){if(a!==b){var c=null===a,d=a===z,e=a===a,f=null===b,g=b===z,h=b===b;if(a>b&&!f||!e||c&&!g&&h||d&&h)return 1;if(b>a&&!c||!h||f&&!d&&e||g&&e)return-1}return 0}function e(a,b,c){for(var d=a.length,e=c?d:-1;c?e--:++e<d;)if(b(a[e],e,a))return e;return-1}function f(a,b,c){if(b!==b)return q(a,c);for(var d=c-1,e=a.length;++d<e;)if(a[d]===b)return d;return-1}function g(a){return"function"==typeof a||!1}function h(a){return null==a?"":a+""}function i(a,b){for(var c=-1,d=a.length;++c<d&&b.indexOf(a.charAt(c))>-1;);return c}function j(a,b){for(var c=a.length;c--&&b.indexOf(a.charAt(c))>-1;);return c}function k(a,b){return d(a.criteria,b.criteria)||a.index-b.index}function l(a,b,c){for(var e=-1,f=a.criteria,g=b.criteria,h=f.length,i=c.length;++e<h;){var j=d(f[e],g[e]);if(j){if(e>=i)return j;var k=c[e];return j*("asc"===k||k===!0?1:-1)}}return a.index-b.index}function m(a){return Sa[a]}function n(a){return Ta[a]}function o(a,b,c){return b?a=Wa[a]:c&&(a=Xa[a]),"\\"+a}function p(a){return"\\"+Xa[a]}function q(a,b,c){for(var d=a.length,e=b+(c?0:-1);c?e--:++e<d;){var f=a[e];if(f!==f)return e}return-1}function r(a){return!!a&&"object"==typeof a}function s(a){return 160>=a&&a>=9&&13>=a||32==a||160==a||5760==a||6158==a||a>=8192&&(8202>=a||8232==a||8233==a||8239==a||8287==a||12288==a||65279==a)}function t(a,b){for(var c=-1,d=a.length,e=-1,f=[];++c<d;)a[c]===b&&(a[c]=S,f[++e]=c);return f}function u(a,b){for(var c,d=-1,e=a.length,f=-1,g=[];++d<e;){var h=a[d],i=b?b(h,d,a):h;d&&c===i||(c=i,g[++f]=h)}return g}function v(a){for(var b=-1,c=a.length;++b<c&&s(a.charCodeAt(b)););return b}function w(a){for(var b=a.length;b--&&s(a.charCodeAt(b)););return b}function x(a){return Ua[a]}function y(a){function b(a){if(r(a)&&!Ch(a)&&!(a instanceof Z)){if(a instanceof s)return a;if(ag.call(a,"__chain__")&&ag.call(a,"__wrapped__"))return md(a)}return new s(a)}function c(){}function s(a,b,c){this.__wrapped__=a,this.__actions__=c||[],this.__chain__=!!b}function Z(a){this.__wrapped__=a,this.__actions__=[],this.__dir__=1,this.__filtered__=!1,this.__iteratees__=[],this.__takeCount__=Bg,this.__views__=[]}function ba(){var a=new Z(this.__wrapped__);return a.__actions__=ab(this.__actions__),a.__dir__=this.__dir__,a.__filtered__=this.__filtered__,a.__iteratees__=ab(this.__iteratees__),a.__takeCount__=this.__takeCount__,a.__views__=ab(this.__views__),a}function da(){if(this.__filtered__){var a=new Z(this);a.__dir__=-1,a.__filtered__=!0}else a=this.clone(),a.__dir__*=-1;return a}function Sa(){var a=this.__wrapped__.value(),b=this.__dir__,c=Ch(a),d=0>b,e=c?a.length:0,f=Tc(0,e,this.__views__),g=f.start,h=f.end,i=h-g,j=d?h:g-1,k=this.__iteratees__,l=k.length,m=0,n=wg(i,this.__takeCount__);if(!c||O>e||e==i&&n==i)return cc(d&&c?a.reverse():a,this.__actions__);var o=[];a:for(;i--&&n>m;){j+=b;for(var p=-1,q=a[j];++p<l;){var r=k[p],s=r.iteratee,t=r.type,u=s(q);if(t==Q)q=u;else if(!u){if(t==P)continue a;break a}}o[m++]=q}return o}function Ta(){this.__data__={}}function Ua(a){return this.has(a)&&delete this.__data__[a]}function Va(a){return"__proto__"==a?z:this.__data__[a]}function Wa(a){return"__proto__"!=a&&ag.call(this.__data__,a)}function Xa(a,b){return"__proto__"!=a&&(this.__data__[a]=b),this}function Ya(a){var b=a?a.length:0;for(this.data={hash:qg(null),set:new kg};b--;)this.push(a[b])}function Za(a,b){var c=a.data,d="string"==typeof b||He(b)?c.set.has(b):c.hash[b];return d?0:-1}function $a(a){var b=this.data;"string"==typeof a||He(a)?b.set.add(a):b.hash[a]=!0}function _a(a,b){for(var c=-1,d=a.length,e=-1,f=b.length,g=Of(d+f);++c<d;)g[c]=a[c];for(;++e<f;)g[c++]=b[e];return g}function ab(a,b){var c=-1,d=a.length;for(b||(b=Of(d));++c<d;)b[c]=a[c];return b}function bb(a,b){for(var c=-1,d=a.length;++c<d&&b(a[c],c,a)!==!1;);return a}function eb(a,b){for(var c=a.length;c--&&b(a[c],c,a)!==!1;);return a}function fb(a,b){for(var c=-1,d=a.length;++c<d;)if(!b(a[c],c,a))return!1;return!0}function gb(a,b,c,d){for(var e=-1,f=a.length,g=d,h=g;++e<f;){var i=a[e],j=+b(i);c(j,g)&&(g=j,h=i)}return h}function hb(a,b){for(var c=-1,d=a.length,e=-1,f=[];++c<d;){var g=a[c];b(g,c,a)&&(f[++e]=g)}return f}function ib(a,b){for(var c=-1,d=a.length,e=Of(d);++c<d;)e[c]=b(a[c],c,a);return e}function jb(a,b){for(var c=-1,d=b.length,e=a.length;++c<d;)a[e+c]=b[c];return a}function kb(a,b,c,d){var e=-1,f=a.length;for(d&&f&&(c=a[++e]);++e<f;)c=b(c,a[e],e,a);return c}function lb(a,b,c,d){var e=a.length;for(d&&e&&(c=a[--e]);e--;)c=b(c,a[e],e,a);return c}function mb(a,b){for(var c=-1,d=a.length;++c<d;)if(b(a[c],c,a))return!0;return!1}function nb(a,b){for(var c=a.length,d=0;c--;)d+=+b(a[c])||0;return d}function ob(a,b){return a===z?b:a}function pb(a,b,c,d){return a!==z&&ag.call(d,c)?a:b}function qb(a,b,c){for(var d=-1,e=Nh(b),f=e.length;++d<f;){var g=e[d],h=a[g],i=c(h,b[g],g,a,b);(i===i?i===h:h!==h)&&(h!==z||g in a)||(a[g]=i)}return a}function rb(a,b){return null==b?a:tb(b,Nh(b),a)}function sb(a,b){for(var c=-1,d=null==a,e=!d&&Yc(a),f=e?a.length:0,g=b.length,h=Of(g);++c<g;){var i=b[c];e?h[c]=Zc(i,f)?a[i]:z:h[c]=d?z:a[i]}return h}function tb(a,b,c){c||(c={});for(var d=-1,e=b.length;++d<e;){var f=b[d];c[f]=a[f]}return c}function ub(a,b,c){var d=typeof a;return"function"==d?b===z?a:fc(a,b,c):null==a?Bf:"object"==d?Nb(a):b===z?Hf(a):Ob(a,b)}function vb(a,b,c,d,e,f,g){var h;if(c&&(h=e?c(a,d,e):c(a)),h!==z)return h;if(!He(a))return a;var i=Ch(a);if(i){if(h=Uc(a),!b)return ab(a,h)}else{var j=cg.call(a),k=j==Y;if(j!=_&&j!=T&&(!k||e))return Ra[j]?Wc(a,j,b):e?a:{};if(h=Vc(k?{}:a),!b)return rb(h,a)}f||(f=[]),g||(g=[]);for(var l=f.length;l--;)if(f[l]==a)return g[l];return f.push(a),g.push(h),(i?bb:Fb)(a,function(d,e){h[e]=vb(d,b,c,e,a,f,g)}),h}function wb(a,b,c){if("function"!=typeof a)throw new Xf(R);return lg(function(){a.apply(z,c)},b)}function xb(a,b){var c=a?a.length:0,d=[];if(!c)return d;var e=-1,g=Qc(),h=g==f,i=h&&b.length>=O?oc(b):null,j=b.length;i&&(g=Za,h=!1,b=i);a:for(;++e<c;){var k=a[e];if(h&&k===k){for(var l=j;l--;)if(b[l]===k)continue a;d.push(k)}else g(b,k,0)<0&&d.push(k)}return d}function yb(a,b){var c=!0;return Jg(a,function(a,d,e){return c=!!b(a,d,e)}),c}function zb(a,b,c,d){var e=d,f=e;return Jg(a,function(a,g,h){var i=+b(a,g,h);(c(i,e)||i===d&&i===f)&&(e=i,f=a)}),f}function Ab(a,b,c,d){var e=a.length;for(c=null==c?0:+c||0,0>c&&(c=-c>e?0:e+c),d=d===z||d>e?e:+d||0,0>d&&(d+=e),e=c>d?0:d>>>0,c>>>=0;e>c;)a[c++]=b;return a}function Bb(a,b){var c=[];return Jg(a,function(a,d,e){b(a,d,e)&&c.push(a)}),c}function Cb(a,b,c,d){var e;return c(a,function(a,c,f){return b(a,c,f)?(e=d?c:a,!1):void 0}),e}function Db(a,b,c,d){d||(d=[]);for(var e=-1,f=a.length;++e<f;){var g=a[e];r(g)&&Yc(g)&&(c||Ch(g)||ye(g))?b?Db(g,b,c,d):jb(d,g):c||(d[d.length]=g)}return d}function Eb(a,b){return Lg(a,b,_e)}function Fb(a,b){return Lg(a,b,Nh)}function Gb(a,b){return Mg(a,b,Nh)}function Hb(a,b){for(var c=-1,d=b.length,e=-1,f=[];++c<d;){var g=b[c];Ge(a[g])&&(f[++e]=g)}return f}function Ib(a,b,c){if(null!=a){c!==z&&c in kd(a)&&(b=[c]);for(var d=0,e=b.length;null!=a&&e>d;)a=a[b[d++]];return d&&d==e?a:z}}function Jb(a,b,c,d,e,f){return a===b?!0:null==a||null==b||!He(a)&&!r(b)?a!==a&&b!==b:Kb(a,b,Jb,c,d,e,f)}function Kb(a,b,c,d,e,f,g){var h=Ch(a),i=Ch(b),j=U,k=U;h||(j=cg.call(a),j==T?j=_:j!=_&&(h=Qe(a))),i||(k=cg.call(b),k==T?k=_:k!=_&&(i=Qe(b)));var l=j==_,m=k==_,n=j==k;if(n&&!h&&!l)return Mc(a,b,j);if(!e){var o=l&&ag.call(a,"__wrapped__"),p=m&&ag.call(b,"__wrapped__");if(o||p)return c(o?a.value():a,p?b.value():b,d,e,f,g)}if(!n)return!1;f||(f=[]),g||(g=[]);for(var q=f.length;q--;)if(f[q]==a)return g[q]==b;f.push(a),g.push(b);var r=(h?Lc:Nc)(a,b,c,d,e,f,g);return f.pop(),g.pop(),r}function Lb(a,b,c){var d=b.length,e=d,f=!c;if(null==a)return!e;for(a=kd(a);d--;){var g=b[d];if(f&&g[2]?g[1]!==a[g[0]]:!(g[0]in a))return!1}for(;++d<e;){g=b[d];var h=g[0],i=a[h],j=g[1];if(f&&g[2]){if(i===z&&!(h in a))return!1}else{var k=c?c(i,j,h):z;if(!(k===z?Jb(j,i,c,!0):k))return!1}}return!0}function Mb(a,b){var c=-1,d=Yc(a)?Of(a.length):[];return Jg(a,function(a,e,f){d[++c]=b(a,e,f)}),d}function Nb(a){var b=Rc(a);if(1==b.length&&b[0][2]){var c=b[0][0],d=b[0][1];return function(a){return null==a?!1:a[c]===d&&(d!==z||c in kd(a))}}return function(a){return Lb(a,b)}}function Ob(a,b){var c=Ch(a),d=_c(a)&&cd(b),e=a+"";return a=ld(a),function(f){if(null==f)return!1;var g=e;if(f=kd(f),(c||!d)&&!(g in f)){if(f=1==a.length?f:Ib(f,Wb(a,0,-1)),null==f)return!1;g=zd(a),f=kd(f)}return f[g]===b?b!==z||g in f:Jb(b,f[g],z,!0)}}function Pb(a,b,c,d,e){if(!He(a))return a;var f=Yc(b)&&(Ch(b)||Qe(b)),g=f?z:Nh(b);return bb(g||b,function(h,i){if(g&&(i=h,h=b[i]),r(h))d||(d=[]),e||(e=[]),Qb(a,b,i,Pb,c,d,e);else{var j=a[i],k=c?c(j,h,i,a,b):z,l=k===z;l&&(k=h),k===z&&(!f||i in a)||!l&&(k===k?k===j:j!==j)||(a[i]=k)}}),a}function Qb(a,b,c,d,e,f,g){for(var h=f.length,i=b[c];h--;)if(f[h]==i)return void(a[c]=g[h]);var j=a[c],k=e?e(j,i,c,a,b):z,l=k===z;l&&(k=i,Yc(i)&&(Ch(i)||Qe(i))?k=Ch(j)?j:Yc(j)?ab(j):[]:Ne(i)||ye(i)?k=ye(j)?Ve(j):Ne(j)?j:{}:l=!1),f.push(i),g.push(k),l?a[c]=d(k,i,e,f,g):(k===k?k!==j:j===j)&&(a[c]=k)}function Rb(a){return function(b){return null==b?z:b[a]}}function Sb(a){var b=a+"";return a=ld(a),function(c){return Ib(c,a,b)}}function Tb(a,b){for(var c=a?b.length:0;c--;){var d=b[c];if(d!=e&&Zc(d)){var e=d;mg.call(a,d,1)}}return a}function Ub(a,b){return a+rg(zg()*(b-a+1))}function Vb(a,b,c,d,e){return e(a,function(a,e,f){c=d?(d=!1,a):b(c,a,e,f)}),c}function Wb(a,b,c){var d=-1,e=a.length;b=null==b?0:+b||0,0>b&&(b=-b>e?0:e+b),c=c===z||c>e?e:+c||0,0>c&&(c+=e),e=b>c?0:c-b>>>0,b>>>=0;for(var f=Of(e);++d<e;)f[d]=a[d+b];return f}function Xb(a,b){var c;return Jg(a,function(a,d,e){return c=b(a,d,e),!c}),!!c}function Yb(a,b){var c=a.length;for(a.sort(b);c--;)a[c]=a[c].value;return a}function Zb(a,b,c){var d=Oc(),e=-1;b=ib(b,function(a){return d(a)});var f=Mb(a,function(a){var c=ib(b,function(b){return b(a)});return{criteria:c,index:++e,value:a}});return Yb(f,function(a,b){return l(a,b,c)})}function $b(a,b){var c=0;return Jg(a,function(a,d,e){c+=+b(a,d,e)||0}),c}function _b(a,b){var c=-1,d=Qc(),e=a.length,g=d==f,h=g&&e>=O,i=h?oc():null,j=[];i?(d=Za,g=!1):(h=!1,i=b?[]:j);a:for(;++c<e;){var k=a[c],l=b?b(k,c,a):k;if(g&&k===k){for(var m=i.length;m--;)if(i[m]===l)continue a;b&&i.push(l),j.push(k)}else d(i,l,0)<0&&((b||h)&&i.push(l),j.push(k))}return j}function ac(a,b){for(var c=-1,d=b.length,e=Of(d);++c<d;)e[c]=a[b[c]];return e}function bc(a,b,c,d){for(var e=a.length,f=d?e:-1;(d?f--:++f<e)&&b(a[f],f,a););return c?Wb(a,d?0:f,d?f+1:e):Wb(a,d?f+1:0,d?e:f)}function cc(a,b){var c=a;c instanceof Z&&(c=c.value());for(var d=-1,e=b.length;++d<e;){var f=b[d];c=f.func.apply(f.thisArg,jb([c],f.args))}return c}function dc(a,b,c){var d=0,e=a?a.length:d;if("number"==typeof b&&b===b&&Eg>=e){for(;e>d;){var f=d+e>>>1,g=a[f];(c?b>=g:b>g)&&null!==g?d=f+1:e=f}return e}return ec(a,b,Bf,c)}function ec(a,b,c,d){b=c(b);for(var e=0,f=a?a.length:0,g=b!==b,h=null===b,i=b===z;f>e;){var j=rg((e+f)/2),k=c(a[j]),l=k!==z,m=k===k;if(g)var n=m||d;else n=h?m&&l&&(d||null!=k):i?m&&(d||l):null==k?!1:d?b>=k:b>k;n?e=j+1:f=j}return wg(f,Dg)}function fc(a,b,c){if("function"!=typeof a)return Bf;if(b===z)return a;switch(c){case 1:return function(c){return a.call(b,c)};case 3:return function(c,d,e){return a.call(b,c,d,e)};case 4:return function(c,d,e,f){return a.call(b,c,d,e,f)};case 5:return function(c,d,e,f,g){return a.call(b,c,d,e,f,g)}}return function(){return a.apply(b,arguments)}}function gc(a){var b=new fg(a.byteLength),c=new ng(b);return c.set(new ng(a)),b}function hc(a,b,c){for(var d=c.length,e=-1,f=vg(a.length-d,0),g=-1,h=b.length,i=Of(h+f);++g<h;)i[g]=b[g];for(;++e<d;)i[c[e]]=a[e];for(;f--;)i[g++]=a[e++];return i}function ic(a,b,c){for(var d=-1,e=c.length,f=-1,g=vg(a.length-e,0),h=-1,i=b.length,j=Of(g+i);++f<g;)j[f]=a[f];for(var k=f;++h<i;)j[k+h]=b[h];for(;++d<e;)j[k+c[d]]=a[f++];return j}function jc(a,b){return function(c,d,e){var f=b?b():{};if(d=Oc(d,e,3),Ch(c))for(var g=-1,h=c.length;++g<h;){var i=c[g];a(f,i,d(i,g,c),c)}else Jg(c,function(b,c,e){a(f,b,d(b,c,e),e)});return f}}function kc(a){return qe(function(b,c){var d=-1,e=null==b?0:c.length,f=e>2?c[e-2]:z,g=e>2?c[2]:z,h=e>1?c[e-1]:z;for("function"==typeof f?(f=fc(f,h,5),e-=2):(f="function"==typeof h?h:z,e-=f?1:0),g&&$c(c[0],c[1],g)&&(f=3>e?z:f,e=1);++d<e;){var i=c[d];i&&a(b,i,f)}return b})}function lc(a,b){return function(c,d){var e=c?Pg(c):0;if(!bd(e))return a(c,d);for(var f=b?e:-1,g=kd(c);(b?f--:++f<e)&&d(g[f],f,g)!==!1;);return c}}function mc(a){return function(b,c,d){for(var e=kd(b),f=d(b),g=f.length,h=a?g:-1;a?h--:++h<g;){var i=f[h];if(c(e[i],i,e)===!1)break}return b}}function nc(a,b){function c(){var e=this&&this!==cb&&this instanceof c?d:a;return e.apply(b,arguments)}var d=qc(a);return c}function oc(a){return qg&&kg?new Ya(a):null}function pc(a){return function(b){for(var c=-1,d=yf(kf(b)),e=d.length,f="";++c<e;)f=a(f,d[c],c);return f}}function qc(a){return function(){var b=arguments;switch(b.length){case 0:return new a;case 1:return new a(b[0]);case 2:return new a(b[0],b[1]);case 3:return new a(b[0],b[1],b[2]);case 4:return new a(b[0],b[1],b[2],b[3]);case 5:return new a(b[0],b[1],b[2],b[3],b[4]);case 6:return new a(b[0],b[1],b[2],b[3],b[4],b[5]);case 7:return new a(b[0],b[1],b[2],b[3],b[4],b[5],b[6])}var c=Ig(a.prototype),d=a.apply(c,b);return He(d)?d:c}}function rc(a){function b(c,d,e){e&&$c(c,d,e)&&(d=z);var f=Kc(c,a,z,z,z,z,z,d);return f.placeholder=b.placeholder,f}return b}function sc(a,b){return qe(function(c){var d=c[0];return null==d?d:(c.push(b),a.apply(z,c))})}function tc(a,b){return function(c,d,e){if(e&&$c(c,d,e)&&(d=z),d=Oc(d,e,3),1==d.length){c=Ch(c)?c:jd(c);var f=gb(c,d,a,b);if(!c.length||f!==b)return f}return zb(c,d,a,b)}}function uc(a,b){return function(c,d,f){if(d=Oc(d,f,3),Ch(c)){var g=e(c,d,b);return g>-1?c[g]:z}return Cb(c,d,a)}}function vc(a){return function(b,c,d){return b&&b.length?(c=Oc(c,d,3),e(b,c,a)):-1}}function wc(a){return function(b,c,d){return c=Oc(c,d,3),Cb(b,c,a,!0)}}function xc(a){return function(){for(var b,c=arguments.length,d=a?c:-1,e=0,f=Of(c);a?d--:++d<c;){var g=f[e++]=arguments[d];if("function"!=typeof g)throw new Xf(R);!b&&s.prototype.thru&&"wrapper"==Pc(g)&&(b=new s([],!0))}for(d=b?-1:c;++d<c;){g=f[d];var h=Pc(g),i="wrapper"==h?Og(g):z;b=i&&ad(i[0])&&i[1]==(I|E|G|J)&&!i[4].length&&1==i[9]?b[Pc(i[0])].apply(b,i[3]):1==g.length&&ad(g)?b[h]():b.thru(g)}return function(){var a=arguments,d=a[0];if(b&&1==a.length&&Ch(d)&&d.length>=O)return b.plant(d).value();for(var e=0,g=c?f[e].apply(this,a):d;++e<c;)g=f[e].call(this,g);return g}}}function yc(a,b){return function(c,d,e){return"function"==typeof d&&e===z&&Ch(c)?a(c,d):b(c,fc(d,e,3))}}function zc(a){return function(b,c,d){return("function"!=typeof c||d!==z)&&(c=fc(c,d,3)),a(b,c,_e)}}function Ac(a){return function(b,c,d){return("function"!=typeof c||d!==z)&&(c=fc(c,d,3)),a(b,c)}}function Bc(a){return function(b,c,d){var e={};return c=Oc(c,d,3),Fb(b,function(b,d,f){var g=c(b,d,f);d=a?g:d,b=a?b:g,e[d]=b}),e}}function Cc(a){return function(b,c,d){return b=h(b),(a?b:"")+Gc(b,c,d)+(a?"":b)}}function Dc(a){var b=qe(function(c,d){var e=t(d,b.placeholder);return Kc(c,a,z,d,e)});return b}function Ec(a,b){return function(c,d,e,f){var g=arguments.length<3;return"function"==typeof d&&f===z&&Ch(c)?a(c,d,e,g):Vb(c,Oc(d,f,4),e,g,b)}}function Fc(a,b,c,d,e,f,g,h,i,j){function k(){for(var s=arguments.length,u=s,v=Of(s);u--;)v[u]=arguments[u];if(d&&(v=hc(v,d,e)),f&&(v=ic(v,f,g)),o||q){var w=k.placeholder,x=t(v,w);if(s-=x.length,j>s){var y=h?ab(h):z,A=vg(j-s,0),D=o?x:z,E=o?z:x,F=o?v:z,I=o?z:v;b|=o?G:H,b&=~(o?H:G),p||(b&=~(B|C));var J=[a,b,c,F,D,I,E,y,i,A],K=Fc.apply(z,J);return ad(a)&&Qg(K,J),K.placeholder=w,K}}var L=m?c:this,M=n?L[a]:a;return h&&(v=hd(v,h)),l&&i<v.length&&(v.length=i),this&&this!==cb&&this instanceof k&&(M=r||qc(a)),M.apply(L,v)}var l=b&I,m=b&B,n=b&C,o=b&E,p=b&D,q=b&F,r=n?z:qc(a);return k}function Gc(a,b,c){var d=a.length;if(b=+b,d>=b||!tg(b))return"";var e=b-d;return c=null==c?" ":c+"",qf(c,pg(e/c.length)).slice(0,e)}function Hc(a,b,c,d){function e(){for(var b=-1,h=arguments.length,i=-1,j=d.length,k=Of(j+h);++i<j;)k[i]=d[i];for(;h--;)k[i++]=arguments[++b];var l=this&&this!==cb&&this instanceof e?g:a;return l.apply(f?c:this,k)}var f=b&B,g=qc(a);return e}function Ic(a){var b=Sf[a];return function(a,c){return c=c===z?0:+c||0,c?(c=ig(10,c),b(a*c)/c):b(a)}}function Jc(a){return function(b,c,d,e){var f=Oc(d);return null==d&&f===ub?dc(b,c,a):ec(b,c,f(d,e,1),a)}}function Kc(a,b,c,d,e,f,g,h){var i=b&C;if(!i&&"function"!=typeof a)throw new Xf(R);var j=d?d.length:0;if(j||(b&=~(G|H),d=e=z),j-=e?e.length:0,b&H){var k=d,l=e;d=e=z}var m=i?z:Og(a),n=[a,b,c,d,e,k,l,f,g,h];if(m&&(dd(n,m),b=n[1],h=n[9]),n[9]=null==h?i?0:a.length:vg(h-j,0)||0,b==B)var o=nc(n[0],n[2]);else o=b!=G&&b!=(B|G)||n[4].length?Fc.apply(z,n):Hc.apply(z,n);var p=m?Ng:Qg;return p(o,n)}function Lc(a,b,c,d,e,f,g){var h=-1,i=a.length,j=b.length;if(i!=j&&!(e&&j>i))return!1;for(;++h<i;){var k=a[h],l=b[h],m=d?d(e?l:k,e?k:l,h):z;if(m!==z){if(m)continue;return!1}if(e){if(!mb(b,function(a){return k===a||c(k,a,d,e,f,g)}))return!1}else if(k!==l&&!c(k,l,d,e,f,g))return!1}return!0}function Mc(a,b,c){switch(c){case V:case W:return+a==+b;case X:return a.name==b.name&&a.message==b.message;case $:return a!=+a?b!=+b:a==+b;case aa:case ca:return a==b+""}return!1}function Nc(a,b,c,d,e,f,g){var h=Nh(a),i=h.length,j=Nh(b),k=j.length;if(i!=k&&!e)return!1;for(var l=i;l--;){var m=h[l];if(!(e?m in b:ag.call(b,m)))return!1}for(var n=e;++l<i;){m=h[l];var o=a[m],p=b[m],q=d?d(e?p:o,e?o:p,m):z;if(!(q===z?c(o,p,d,e,f,g):q))return!1;n||(n="constructor"==m)}if(!n){var r=a.constructor,s=b.constructor;if(r!=s&&"constructor"in a&&"constructor"in b&&!("function"==typeof r&&r instanceof r&&"function"==typeof s&&s instanceof s))return!1}return!0}function Oc(a,c,d){var e=b.callback||zf;return e=e===zf?ub:e,d?e(a,c,d):e}function Pc(a){for(var b=a.name,c=Hg[b],d=c?c.length:0;d--;){var e=c[d],f=e.func;if(null==f||f==a)return e.name}return b}function Qc(a,c,d){var e=b.indexOf||xd;return e=e===xd?f:e,a?e(a,c,d):e}function Rc(a){for(var b=af(a),c=b.length;c--;)b[c][2]=cd(b[c][1]);return b}function Sc(a,b){var c=null==a?z:a[b];return Ke(c)?c:z}function Tc(a,b,c){for(var d=-1,e=c.length;++d<e;){var f=c[d],g=f.size;switch(f.type){case"drop":a+=g;break;case"dropRight":b-=g;break;case"take":b=wg(b,a+g);break;case"takeRight":a=vg(a,b-g)}}return{start:a,end:b}}function Uc(a){var b=a.length,c=new a.constructor(b);return b&&"string"==typeof a[0]&&ag.call(a,"index")&&(c.index=a.index,c.input=a.input),c}function Vc(a){var b=a.constructor;return"function"==typeof b&&b instanceof b||(b=Uf),new b}function Wc(a,b,c){var d=a.constructor;switch(b){case ea:return gc(a);case V:case W:return new d(+a);case fa:case ga:case ha:case ia:case ja:case ka:case la:case ma:case na:var e=a.buffer;return new d(c?gc(e):e,a.byteOffset,a.length);case $:case ca:return new d(a);case aa:var f=new d(a.source,Ga.exec(a));f.lastIndex=a.lastIndex}return f}function Xc(a,b,c){null==a||_c(b,a)||(b=ld(b),a=1==b.length?a:Ib(a,Wb(b,0,-1)),b=zd(b));var d=null==a?a:a[b];return null==d?z:d.apply(a,c)}function Yc(a){return null!=a&&bd(Pg(a))}function Zc(a,b){return a="number"==typeof a||Ja.test(a)?+a:-1,b=null==b?Fg:b,a>-1&&a%1==0&&b>a}function $c(a,b,c){if(!He(c))return!1;var d=typeof b;if("number"==d?Yc(c)&&Zc(b,c.length):"string"==d&&b in c){var e=c[b];return a===a?a===e:e!==e}return!1}function _c(a,b){var c=typeof a;if("string"==c&&za.test(a)||"number"==c)return!0;if(Ch(a))return!1;var d=!ya.test(a);return d||null!=b&&a in kd(b)}function ad(a){var c=Pc(a);if(!(c in Z.prototype))return!1;var d=b[c];if(a===d)return!0;var e=Og(d);return!!e&&a===e[0]}function bd(a){return"number"==typeof a&&a>-1&&a%1==0&&Fg>=a}function cd(a){return a===a&&!He(a)}function dd(a,b){var c=a[1],d=b[1],e=c|d,f=I>e,g=d==I&&c==E||d==I&&c==J&&a[7].length<=b[8]||d==(I|J)&&c==E;if(!f&&!g)return a;d&B&&(a[2]=b[2],e|=c&B?0:D);var h=b[3];if(h){var i=a[3];a[3]=i?hc(i,h,b[4]):ab(h),a[4]=i?t(a[3],S):ab(b[4])}return h=b[5],h&&(i=a[5],a[5]=i?ic(i,h,b[6]):ab(h),a[6]=i?t(a[5],S):ab(b[6])),h=b[7],h&&(a[7]=ab(h)),d&I&&(a[8]=null==a[8]?b[8]:wg(a[8],b[8])),null==a[9]&&(a[9]=b[9]),a[0]=b[0],a[1]=e,a}function ed(a,b){return a===z?b:Dh(a,b,ed)}function fd(a,b){a=kd(a);for(var c=-1,d=b.length,e={};++c<d;){var f=b[c];f in a&&(e[f]=a[f])}return e}function gd(a,b){var c={};return Eb(a,function(a,d,e){b(a,d,e)&&(c[d]=a)}),c}function hd(a,b){for(var c=a.length,d=wg(b.length,c),e=ab(a);d--;){var f=b[d];a[d]=Zc(f,c)?e[f]:z}return a}function id(a){for(var b=_e(a),c=b.length,d=c&&a.length,e=!!d&&bd(d)&&(Ch(a)||ye(a)),f=-1,g=[];++f<c;){var h=b[f];(e&&Zc(h,d)||ag.call(a,h))&&g.push(h)}return g}function jd(a){return null==a?[]:Yc(a)?He(a)?a:Uf(a):ef(a)}function kd(a){return He(a)?a:Uf(a)}function ld(a){if(Ch(a))return a;var b=[];return h(a).replace(Aa,function(a,c,d,e){b.push(d?e.replace(Ea,"$1"):c||a)}),b}function md(a){return a instanceof Z?a.clone():new s(a.__wrapped__,a.__chain__,ab(a.__actions__))}function nd(a,b,c){b=(c?$c(a,b,c):null==b)?1:vg(rg(b)||1,1);for(var d=0,e=a?a.length:0,f=-1,g=Of(pg(e/b));e>d;)g[++f]=Wb(a,d,d+=b);return g}function od(a){for(var b=-1,c=a?a.length:0,d=-1,e=[];++b<c;){var f=a[b];f&&(e[++d]=f)}return e}function pd(a,b,c){var d=a?a.length:0;return d?((c?$c(a,b,c):null==b)&&(b=1),Wb(a,0>b?0:b)):[]}function qd(a,b,c){var d=a?a.length:0;return d?((c?$c(a,b,c):null==b)&&(b=1),b=d-(+b||0),Wb(a,0,0>b?0:b)):[]}function rd(a,b,c){return a&&a.length?bc(a,Oc(b,c,3),!0,!0):[]}function sd(a,b,c){return a&&a.length?bc(a,Oc(b,c,3),!0):[]}function td(a,b,c,d){var e=a?a.length:0;return e?(c&&"number"!=typeof c&&$c(a,b,c)&&(c=0,d=e),Ab(a,b,c,d)):[]}function ud(a){return a?a[0]:z}function vd(a,b,c){var d=a?a.length:0;return c&&$c(a,b,c)&&(b=!1),d?Db(a,b):[]}function wd(a){var b=a?a.length:0;return b?Db(a,!0):[]}function xd(a,b,c){var d=a?a.length:0;if(!d)return-1;if("number"==typeof c)c=0>c?vg(d+c,0):c;else if(c){var e=dc(a,b);return d>e&&(b===b?b===a[e]:a[e]!==a[e])?e:-1}return f(a,b,c||0)}function yd(a){return qd(a,1)}function zd(a){var b=a?a.length:0;return b?a[b-1]:z}function Ad(a,b,c){var d=a?a.length:0;if(!d)return-1;var e=d;if("number"==typeof c)e=(0>c?vg(d+c,0):wg(c||0,d-1))+1;else if(c){e=dc(a,b,!0)-1;var f=a[e];return(b===b?b===f:f!==f)?e:-1}if(b!==b)return q(a,e,!0);for(;e--;)if(a[e]===b)return e;return-1}function Bd(){var a=arguments,b=a[0];if(!b||!b.length)return b;for(var c=0,d=Qc(),e=a.length;++c<e;)for(var f=0,g=a[c];(f=d(b,g,f))>-1;)mg.call(b,f,1);return b}function Cd(a,b,c){var d=[];if(!a||!a.length)return d;var e=-1,f=[],g=a.length;for(b=Oc(b,c,3);++e<g;){var h=a[e];b(h,e,a)&&(d.push(h),f.push(e))}return Tb(a,f),d}function Dd(a){return pd(a,1)}function Ed(a,b,c){var d=a?a.length:0;return d?(c&&"number"!=typeof c&&$c(a,b,c)&&(b=0,c=d),Wb(a,b,c)):[]}function Fd(a,b,c){var d=a?a.length:0;return d?((c?$c(a,b,c):null==b)&&(b=1),Wb(a,0,0>b?0:b)):[]}function Gd(a,b,c){var d=a?a.length:0;return d?((c?$c(a,b,c):null==b)&&(b=1),b=d-(+b||0),Wb(a,0>b?0:b)):[]}function Hd(a,b,c){return a&&a.length?bc(a,Oc(b,c,3),!1,!0):[]}function Id(a,b,c){return a&&a.length?bc(a,Oc(b,c,3)):[]}function Jd(a,b,c,d){var e=a?a.length:0;if(!e)return[];null!=b&&"boolean"!=typeof b&&(d=c,c=$c(a,b,d)?z:b,b=!1);var g=Oc();return(null!=c||g!==ub)&&(c=g(c,d,3)),b&&Qc()==f?u(a,c):_b(a,c)}function Kd(a){if(!a||!a.length)return[];var b=-1,c=0;a=hb(a,function(a){return Yc(a)?(c=vg(a.length,c),!0):void 0});for(var d=Of(c);++b<c;)d[b]=ib(a,Rb(b));return d}function Ld(a,b,c){var d=a?a.length:0;if(!d)return[];var e=Kd(a);return null==b?e:(b=fc(b,c,4),ib(e,function(a){return kb(a,b,z,!0)}))}function Md(){for(var a=-1,b=arguments.length;++a<b;){var c=arguments[a];if(Yc(c))var d=d?jb(xb(d,c),xb(c,d)):c}return d?_b(d):[]}function Nd(a,b){var c=-1,d=a?a.length:0,e={};for(!d||b||Ch(a[0])||(b=[]);++c<d;){var f=a[c];b?e[f]=b[c]:f&&(e[f[0]]=f[1])}return e}function Od(a){var c=b(a);return c.__chain__=!0,c}function Pd(a,b,c){return b.call(c,a),a}function Qd(a,b,c){return b.call(c,a)}function Rd(){return Od(this)}function Sd(){return new s(this.value(),this.__chain__)}function Td(a){for(var b,d=this;d instanceof c;){var e=md(d);b?f.__wrapped__=e:b=e;var f=e;d=d.__wrapped__}return f.__wrapped__=a,b}function Ud(){var a=this.__wrapped__,b=function(a){return c&&c.__dir__<0?a:a.reverse()};if(a instanceof Z){var c=a;return this.__actions__.length&&(c=new Z(this)),c=c.reverse(),c.__actions__.push({func:Qd,args:[b],thisArg:z}),new s(c,this.__chain__)}return this.thru(b)}function Vd(){return this.value()+""}function Wd(){return cc(this.__wrapped__,this.__actions__)}function Xd(a,b,c){var d=Ch(a)?fb:yb;return c&&$c(a,b,c)&&(b=z),("function"!=typeof b||c!==z)&&(b=Oc(b,c,3)),d(a,b)}function Yd(a,b,c){var d=Ch(a)?hb:Bb;return b=Oc(b,c,3),d(a,b)}function Zd(a,b){return dh(a,Nb(b))}function $d(a,b,c,d){var e=a?Pg(a):0;return bd(e)||(a=ef(a),e=a.length),c="number"!=typeof c||d&&$c(b,c,d)?0:0>c?vg(e+c,0):c||0,"string"==typeof a||!Ch(a)&&Pe(a)?e>=c&&a.indexOf(b,c)>-1:!!e&&Qc(a,b,c)>-1}function _d(a,b,c){var d=Ch(a)?ib:Mb;return b=Oc(b,c,3),d(a,b)}function ae(a,b){return _d(a,Hf(b))}function be(a,b,c){var d=Ch(a)?hb:Bb;return b=Oc(b,c,3),d(a,function(a,c,d){return!b(a,c,d)})}function ce(a,b,c){if(c?$c(a,b,c):null==b){a=jd(a);var d=a.length;return d>0?a[Ub(0,d-1)]:z}var e=-1,f=Ue(a),d=f.length,g=d-1;for(b=wg(0>b?0:+b||0,d);++e<b;){var h=Ub(e,g),i=f[h];f[h]=f[e],f[e]=i}return f.length=b,f}function de(a){return ce(a,Bg)}function ee(a){var b=a?Pg(a):0;return bd(b)?b:Nh(a).length}function fe(a,b,c){var d=Ch(a)?mb:Xb;return c&&$c(a,b,c)&&(b=z),("function"!=typeof b||c!==z)&&(b=Oc(b,c,3)),d(a,b)}function ge(a,b,c){if(null==a)return[];c&&$c(a,b,c)&&(b=z);var d=-1;b=Oc(b,c,3);var e=Mb(a,function(a,c,e){return{criteria:b(a,c,e),index:++d,value:a}});return Yb(e,k)}function he(a,b,c,d){return null==a?[]:(d&&$c(b,c,d)&&(c=z),Ch(b)||(b=null==b?[]:[b]),Ch(c)||(c=null==c?[]:[c]),Zb(a,b,c))}function ie(a,b){return Yd(a,Nb(b))}function je(a,b){if("function"!=typeof b){if("function"!=typeof a)throw new Xf(R);var c=a;a=b,b=c}return a=tg(a=+a)?a:0,function(){return--a<1?b.apply(this,arguments):void 0}}function ke(a,b,c){return c&&$c(a,b,c)&&(b=z),b=a&&null==b?a.length:vg(+b||0,0),Kc(a,I,z,z,z,z,b)}function le(a,b){var c;if("function"!=typeof b){if("function"!=typeof a)throw new Xf(R);var d=a;a=b,b=d}return function(){return--a>0&&(c=b.apply(this,arguments)),1>=a&&(b=z),c}}function me(a,b,c){function d(){n&&gg(n),j&&gg(j),p=0,j=n=o=z}function e(b,c){c&&gg(c),j=n=o=z,b&&(p=oh(),k=a.apply(m,i),n||j||(i=m=z))}function f(){var a=b-(oh()-l);0>=a||a>b?e(o,j):n=lg(f,a)}function g(){e(r,n)}function h(){if(i=arguments,l=oh(),m=this,o=r&&(n||!s),q===!1)var c=s&&!n;else{j||s||(p=l);var d=q-(l-p),e=0>=d||d>q;e?(j&&(j=gg(j)),p=l,k=a.apply(m,i)):j||(j=lg(g,d))}return e&&n?n=gg(n):n||b===q||(n=lg(f,b)),c&&(e=!0,k=a.apply(m,i)),!e||n||j||(i=m=z),k}var i,j,k,l,m,n,o,p=0,q=!1,r=!0;if("function"!=typeof a)throw new Xf(R);if(b=0>b?0:+b||0,c===!0){var s=!0;r=!1}else He(c)&&(s=!!c.leading,q="maxWait"in c&&vg(+c.maxWait||0,b),r="trailing"in c?!!c.trailing:r);return h.cancel=d,h}function ne(a,b){if("function"!=typeof a||b&&"function"!=typeof b)throw new Xf(R);var c=function(){var d=arguments,e=b?b.apply(this,d):d[0],f=c.cache;if(f.has(e))return f.get(e);var g=a.apply(this,d);return c.cache=f.set(e,g),g};return c.cache=new ne.Cache,c}function oe(a){if("function"!=typeof a)throw new Xf(R);return function(){return!a.apply(this,arguments)}}function pe(a){return le(2,a)}function qe(a,b){if("function"!=typeof a)throw new Xf(R);return b=vg(b===z?a.length-1:+b||0,0),function(){for(var c=arguments,d=-1,e=vg(c.length-b,0),f=Of(e);++d<e;)f[d]=c[b+d];switch(b){case 0:return a.call(this,f);case 1:return a.call(this,c[0],f);case 2:return a.call(this,c[0],c[1],f)}var g=Of(b+1);for(d=-1;++d<b;)g[d]=c[d];return g[b]=f,a.apply(this,g)}}function re(a){if("function"!=typeof a)throw new Xf(R);return function(b){return a.apply(this,b)}}function se(a,b,c){var d=!0,e=!0;if("function"!=typeof a)throw new Xf(R);return c===!1?d=!1:He(c)&&(d="leading"in c?!!c.leading:d,e="trailing"in c?!!c.trailing:e),me(a,b,{leading:d,maxWait:+b,trailing:e})}function te(a,b){return b=null==b?Bf:b,Kc(b,G,z,[a],[])}function ue(a,b,c,d){return b&&"boolean"!=typeof b&&$c(a,b,c)?b=!1:"function"==typeof b&&(d=c,c=b,b=!1),"function"==typeof c?vb(a,b,fc(c,d,1)):vb(a,b)}function ve(a,b,c){return"function"==typeof b?vb(a,!0,fc(b,c,1)):vb(a,!0)}function we(a,b){return a>b}function xe(a,b){return a>=b}function ye(a){return r(a)&&Yc(a)&&ag.call(a,"callee")&&!jg.call(a,"callee")}function ze(a){return a===!0||a===!1||r(a)&&cg.call(a)==V}function Ae(a){return r(a)&&cg.call(a)==W}function Be(a){return!!a&&1===a.nodeType&&r(a)&&!Ne(a)}function Ce(a){return null==a?!0:Yc(a)&&(Ch(a)||Pe(a)||ye(a)||r(a)&&Ge(a.splice))?!a.length:!Nh(a).length}function De(a,b,c,d){c="function"==typeof c?fc(c,d,3):z;var e=c?c(a,b):z;return e===z?Jb(a,b,c):!!e}function Ee(a){return r(a)&&"string"==typeof a.message&&cg.call(a)==X}function Fe(a){return"number"==typeof a&&tg(a)}function Ge(a){return He(a)&&cg.call(a)==Y}function He(a){var b=typeof a;return!!a&&("object"==b||"function"==b)}function Ie(a,b,c,d){return c="function"==typeof c?fc(c,d,3):z,Lb(a,Rc(b),c)}function Je(a){return Me(a)&&a!=+a}function Ke(a){return null==a?!1:Ge(a)?eg.test(_f.call(a)):r(a)&&Ia.test(a)}function Le(a){return null===a}function Me(a){return"number"==typeof a||r(a)&&cg.call(a)==$}function Ne(a){var b;if(!r(a)||cg.call(a)!=_||ye(a)||!ag.call(a,"constructor")&&(b=a.constructor,"function"==typeof b&&!(b instanceof b)))return!1;var c;return Eb(a,function(a,b){c=b}),c===z||ag.call(a,c)}function Oe(a){return He(a)&&cg.call(a)==aa}function Pe(a){return"string"==typeof a||r(a)&&cg.call(a)==ca}function Qe(a){return r(a)&&bd(a.length)&&!!Qa[cg.call(a)]}function Re(a){return a===z}function Se(a,b){return b>a}function Te(a,b){return b>=a}function Ue(a){var b=a?Pg(a):0;return bd(b)?b?ab(a):[]:ef(a)}function Ve(a){return tb(a,_e(a))}function We(a,b,c){var d=Ig(a);return c&&$c(a,b,c)&&(b=z),b?rb(d,b):d}function Xe(a){return Hb(a,_e(a))}function Ye(a,b,c){var d=null==a?z:Ib(a,ld(b),b+"");return d===z?c:d}function Ze(a,b){if(null==a)return!1;var c=ag.call(a,b);if(!c&&!_c(b)){if(b=ld(b),a=1==b.length?a:Ib(a,Wb(b,0,-1)),null==a)return!1;b=zd(b),c=ag.call(a,b)}return c||bd(a.length)&&Zc(b,a.length)&&(Ch(a)||ye(a))}function $e(a,b,c){c&&$c(a,b,c)&&(b=z);for(var d=-1,e=Nh(a),f=e.length,g={};++d<f;){var h=e[d],i=a[h];b?ag.call(g,i)?g[i].push(h):g[i]=[h]:g[i]=h}return g}function _e(a){if(null==a)return[];He(a)||(a=Uf(a));var b=a.length;b=b&&bd(b)&&(Ch(a)||ye(a))&&b||0;
for(var c=a.constructor,d=-1,e="function"==typeof c&&c.prototype===a,f=Of(b),g=b>0;++d<b;)f[d]=d+"";for(var h in a)g&&Zc(h,b)||"constructor"==h&&(e||!ag.call(a,h))||f.push(h);return f}function af(a){a=kd(a);for(var b=-1,c=Nh(a),d=c.length,e=Of(d);++b<d;){var f=c[b];e[b]=[f,a[f]]}return e}function bf(a,b,c){var d=null==a?z:a[b];return d===z&&(null==a||_c(b,a)||(b=ld(b),a=1==b.length?a:Ib(a,Wb(b,0,-1)),d=null==a?z:a[zd(b)]),d=d===z?c:d),Ge(d)?d.call(a):d}function cf(a,b,c){if(null==a)return a;var d=b+"";b=null!=a[d]||_c(b,a)?[d]:ld(b);for(var e=-1,f=b.length,g=f-1,h=a;null!=h&&++e<f;){var i=b[e];He(h)&&(e==g?h[i]=c:null==h[i]&&(h[i]=Zc(b[e+1])?[]:{})),h=h[i]}return a}function df(a,b,c,d){var e=Ch(a)||Qe(a);if(b=Oc(b,d,4),null==c)if(e||He(a)){var f=a.constructor;c=e?Ch(a)?new f:[]:Ig(Ge(f)?f.prototype:z)}else c={};return(e?bb:Fb)(a,function(a,d,e){return b(c,a,d,e)}),c}function ef(a){return ac(a,Nh(a))}function ff(a){return ac(a,_e(a))}function gf(a,b,c){return b=+b||0,c===z?(c=b,b=0):c=+c||0,a>=wg(b,c)&&a<vg(b,c)}function hf(a,b,c){c&&$c(a,b,c)&&(b=c=z);var d=null==a,e=null==b;if(null==c&&(e&&"boolean"==typeof a?(c=a,a=1):"boolean"==typeof b&&(c=b,e=!0)),d&&e&&(b=1,e=!1),a=+a||0,e?(b=a,a=0):b=+b||0,c||a%1||b%1){var f=zg();return wg(a+f*(b-a+hg("1e-"+((f+"").length-1))),b)}return Ub(a,b)}function jf(a){return a=h(a),a&&a.charAt(0).toUpperCase()+a.slice(1)}function kf(a){return a=h(a),a&&a.replace(Ka,m).replace(Da,"")}function lf(a,b,c){a=h(a),b+="";var d=a.length;return c=c===z?d:wg(0>c?0:+c||0,d),c-=b.length,c>=0&&a.indexOf(b,c)==c}function mf(a){return a=h(a),a&&ua.test(a)?a.replace(sa,n):a}function nf(a){return a=h(a),a&&Ca.test(a)?a.replace(Ba,o):a||"(?:)"}function of(a,b,c){a=h(a),b=+b;var d=a.length;if(d>=b||!tg(b))return a;var e=(b-d)/2,f=rg(e),g=pg(e);return c=Gc("",g,c),c.slice(0,f)+a+c}function pf(a,b,c){return(c?$c(a,b,c):null==b)?b=0:b&&(b=+b),a=tf(a),yg(a,b||(Ha.test(a)?16:10))}function qf(a,b){var c="";if(a=h(a),b=+b,1>b||!a||!tg(b))return c;do b%2&&(c+=a),b=rg(b/2),a+=a;while(b);return c}function rf(a,b,c){return a=h(a),c=null==c?0:wg(0>c?0:+c||0,a.length),a.lastIndexOf(b,c)==c}function sf(a,c,d){var e=b.templateSettings;d&&$c(a,c,d)&&(c=d=z),a=h(a),c=qb(rb({},d||c),e,pb);var f,g,i=qb(rb({},c.imports),e.imports,pb),j=Nh(i),k=ac(i,j),l=0,m=c.interpolate||La,n="__p += '",o=Vf((c.escape||La).source+"|"+m.source+"|"+(m===xa?Fa:La).source+"|"+(c.evaluate||La).source+"|$","g"),q="//# sourceURL="+("sourceURL"in c?c.sourceURL:"lodash.templateSources["+ ++Pa+"]")+"\n";a.replace(o,function(b,c,d,e,h,i){return d||(d=e),n+=a.slice(l,i).replace(Ma,p),c&&(f=!0,n+="' +\n__e("+c+") +\n'"),h&&(g=!0,n+="';\n"+h+";\n__p += '"),d&&(n+="' +\n((__t = ("+d+")) == null ? '' : __t) +\n'"),l=i+b.length,b}),n+="';\n";var r=c.variable;r||(n="with (obj) {\n"+n+"\n}\n"),n=(g?n.replace(oa,""):n).replace(pa,"$1").replace(qa,"$1;"),n="function("+(r||"obj")+") {\n"+(r?"":"obj || (obj = {});\n")+"var __t, __p = ''"+(f?", __e = _.escape":"")+(g?", __j = Array.prototype.join;\nfunction print() { __p += __j.call(arguments, '') }\n":";\n")+n+"return __p\n}";var s=Yh(function(){return Rf(j,q+"return "+n).apply(z,k)});if(s.source=n,Ee(s))throw s;return s}function tf(a,b,c){var d=a;return(a=h(a))?(c?$c(d,b,c):null==b)?a.slice(v(a),w(a)+1):(b+="",a.slice(i(a,b),j(a,b)+1)):a}function uf(a,b,c){var d=a;return a=h(a),a?(c?$c(d,b,c):null==b)?a.slice(v(a)):a.slice(i(a,b+"")):a}function vf(a,b,c){var d=a;return a=h(a),a?(c?$c(d,b,c):null==b)?a.slice(0,w(a)+1):a.slice(0,j(a,b+"")+1):a}function wf(a,b,c){c&&$c(a,b,c)&&(b=z);var d=K,e=L;if(null!=b)if(He(b)){var f="separator"in b?b.separator:f;d="length"in b?+b.length||0:d,e="omission"in b?h(b.omission):e}else d=+b||0;if(a=h(a),d>=a.length)return a;var g=d-e.length;if(1>g)return e;var i=a.slice(0,g);if(null==f)return i+e;if(Oe(f)){if(a.slice(g).search(f)){var j,k,l=a.slice(0,g);for(f.global||(f=Vf(f.source,(Ga.exec(f)||"")+"g")),f.lastIndex=0;j=f.exec(l);)k=j.index;i=i.slice(0,null==k?g:k)}}else if(a.indexOf(f,g)!=g){var m=i.lastIndexOf(f);m>-1&&(i=i.slice(0,m))}return i+e}function xf(a){return a=h(a),a&&ta.test(a)?a.replace(ra,x):a}function yf(a,b,c){return c&&$c(a,b,c)&&(b=z),a=h(a),a.match(b||Na)||[]}function zf(a,b,c){return c&&$c(a,b,c)&&(b=z),r(a)?Cf(a):ub(a,b)}function Af(a){return function(){return a}}function Bf(a){return a}function Cf(a){return Nb(vb(a,!0))}function Df(a,b){return Ob(a,vb(b,!0))}function Ef(a,b,c){if(null==c){var d=He(b),e=d?Nh(b):z,f=e&&e.length?Hb(b,e):z;(f?f.length:d)||(f=!1,c=b,b=a,a=this)}f||(f=Hb(b,Nh(b)));var g=!0,h=-1,i=Ge(a),j=f.length;c===!1?g=!1:He(c)&&"chain"in c&&(g=c.chain);for(;++h<j;){var k=f[h],l=b[k];a[k]=l,i&&(a.prototype[k]=function(b){return function(){var c=this.__chain__;if(g||c){var d=a(this.__wrapped__),e=d.__actions__=ab(this.__actions__);return e.push({func:b,args:arguments,thisArg:a}),d.__chain__=c,d}return b.apply(a,jb([this.value()],arguments))}}(l))}return a}function Ff(){return cb._=dg,this}function Gf(){}function Hf(a){return _c(a)?Rb(a):Sb(a)}function If(a){return function(b){return Ib(a,ld(b),b+"")}}function Jf(a,b,c){c&&$c(a,b,c)&&(b=c=z),a=+a||0,c=null==c?1:+c||0,null==b?(b=a,a=0):b=+b||0;for(var d=-1,e=vg(pg((b-a)/(c||1)),0),f=Of(e);++d<e;)f[d]=a,a+=c;return f}function Kf(a,b,c){if(a=rg(a),1>a||!tg(a))return[];var d=-1,e=Of(wg(a,Cg));for(b=fc(b,c,1);++d<a;)Cg>d?e[d]=b(d):b(d);return e}function Lf(a){var b=++bg;return h(a)+b}function Mf(a,b){return(+a||0)+(+b||0)}function Nf(a,b,c){return c&&$c(a,b,c)&&(b=z),b=Oc(b,c,3),1==b.length?nb(Ch(a)?a:jd(a),b):$b(a,b)}a=a?db.defaults(cb.Object(),a,db.pick(cb,Oa)):cb;var Of=a.Array,Pf=a.Date,Qf=a.Error,Rf=a.Function,Sf=a.Math,Tf=a.Number,Uf=a.Object,Vf=a.RegExp,Wf=a.String,Xf=a.TypeError,Yf=Of.prototype,Zf=Uf.prototype,$f=Wf.prototype,_f=Rf.prototype.toString,ag=Zf.hasOwnProperty,bg=0,cg=Zf.toString,dg=cb._,eg=Vf("^"+_f.call(ag).replace(/[\\^$.*+?()[\]{}|]/g,"\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g,"$1.*?")+"$"),fg=a.ArrayBuffer,gg=a.clearTimeout,hg=a.parseFloat,ig=Sf.pow,jg=Zf.propertyIsEnumerable,kg=Sc(a,"Set"),lg=a.setTimeout,mg=Yf.splice,ng=a.Uint8Array,og=Sc(a,"WeakMap"),pg=Sf.ceil,qg=Sc(Uf,"create"),rg=Sf.floor,sg=Sc(Of,"isArray"),tg=a.isFinite,ug=Sc(Uf,"keys"),vg=Sf.max,wg=Sf.min,xg=Sc(Pf,"now"),yg=a.parseInt,zg=Sf.random,Ag=Tf.NEGATIVE_INFINITY,Bg=Tf.POSITIVE_INFINITY,Cg=4294967295,Dg=Cg-1,Eg=Cg>>>1,Fg=9007199254740991,Gg=og&&new og,Hg={};b.support={};b.templateSettings={escape:va,evaluate:wa,interpolate:xa,variable:"",imports:{_:b}};var Ig=function(){function a(){}return function(b){if(He(b)){a.prototype=b;var c=new a;a.prototype=z}return c||{}}}(),Jg=lc(Fb),Kg=lc(Gb,!0),Lg=mc(),Mg=mc(!0),Ng=Gg?function(a,b){return Gg.set(a,b),a}:Bf,Og=Gg?function(a){return Gg.get(a)}:Gf,Pg=Rb("length"),Qg=function(){var a=0,b=0;return function(c,d){var e=oh(),f=N-(e-b);if(b=e,f>0){if(++a>=M)return c}else a=0;return Ng(c,d)}}(),Rg=qe(function(a,b){return r(a)&&Yc(a)?xb(a,Db(b,!1,!0)):[]}),Sg=vc(),Tg=vc(!0),Ug=qe(function(a){for(var b=a.length,c=b,d=Of(l),e=Qc(),g=e==f,h=[];c--;){var i=a[c]=Yc(i=a[c])?i:[];d[c]=g&&i.length>=120?oc(c&&i):null}var j=a[0],k=-1,l=j?j.length:0,m=d[0];a:for(;++k<l;)if(i=j[k],(m?Za(m,i):e(h,i,0))<0){for(var c=b;--c;){var n=d[c];if((n?Za(n,i):e(a[c],i,0))<0)continue a}m&&m.push(i),h.push(i)}return h}),Vg=qe(function(a,b){b=Db(b);var c=sb(a,b);return Tb(a,b.sort(d)),c}),Wg=Jc(),Xg=Jc(!0),Yg=qe(function(a){return _b(Db(a,!1,!0))}),Zg=qe(function(a,b){return Yc(a)?xb(a,b):[]}),$g=qe(Kd),_g=qe(function(a){var b=a.length,c=b>2?a[b-2]:z,d=b>1?a[b-1]:z;return b>2&&"function"==typeof c?b-=2:(c=b>1&&"function"==typeof d?(--b,d):z,d=z),a.length=b,Ld(a,c,d)}),ah=qe(function(a){return a=Db(a),this.thru(function(b){return _a(Ch(b)?b:[kd(b)],a)})}),bh=qe(function(a,b){return sb(a,Db(b))}),ch=jc(function(a,b,c){ag.call(a,c)?++a[c]:a[c]=1}),dh=uc(Jg),eh=uc(Kg,!0),fh=yc(bb,Jg),gh=yc(eb,Kg),hh=jc(function(a,b,c){ag.call(a,c)?a[c].push(b):a[c]=[b]}),ih=jc(function(a,b,c){a[c]=b}),jh=qe(function(a,b,c){var d=-1,e="function"==typeof b,f=_c(b),g=Yc(a)?Of(a.length):[];return Jg(a,function(a){var h=e?b:f&&null!=a?a[b]:z;g[++d]=h?h.apply(a,c):Xc(a,b,c)}),g}),kh=jc(function(a,b,c){a[c?0:1].push(b)},function(){return[[],[]]}),lh=Ec(kb,Jg),mh=Ec(lb,Kg),nh=qe(function(a,b){if(null==a)return[];var c=b[2];return c&&$c(b[0],b[1],c)&&(b.length=1),Zb(a,Db(b),[])}),oh=xg||function(){return(new Pf).getTime()},ph=qe(function(a,b,c){var d=B;if(c.length){var e=t(c,ph.placeholder);d|=G}return Kc(a,d,b,c,e)}),qh=qe(function(a,b){b=b.length?Db(b):Xe(a);for(var c=-1,d=b.length;++c<d;){var e=b[c];a[e]=Kc(a[e],B,a)}return a}),rh=qe(function(a,b,c){var d=B|C;if(c.length){var e=t(c,rh.placeholder);d|=G}return Kc(b,d,a,c,e)}),sh=rc(E),th=rc(F),uh=qe(function(a,b){return wb(a,1,b)}),vh=qe(function(a,b,c){return wb(a,b,c)}),wh=xc(),xh=xc(!0),yh=qe(function(a,b){if(b=Db(b),"function"!=typeof a||!fb(b,g))throw new Xf(R);var c=b.length;return qe(function(d){for(var e=wg(d.length,c);e--;)d[e]=b[e](d[e]);return a.apply(this,d)})}),zh=Dc(G),Ah=Dc(H),Bh=qe(function(a,b){return Kc(a,J,z,z,z,Db(b))}),Ch=sg||function(a){return r(a)&&bd(a.length)&&cg.call(a)==U},Dh=kc(Pb),Eh=kc(function(a,b,c){return c?qb(a,b,c):rb(a,b)}),Fh=sc(Eh,ob),Gh=sc(Dh,ed),Hh=wc(Fb),Ih=wc(Gb),Jh=zc(Lg),Kh=zc(Mg),Lh=Ac(Fb),Mh=Ac(Gb),Nh=ug?function(a){var b=null==a?z:a.constructor;return"function"==typeof b&&b.prototype===a||"function"!=typeof a&&Yc(a)?id(a):He(a)?ug(a):[]}:id,Oh=Bc(!0),Ph=Bc(),Qh=qe(function(a,b){if(null==a)return{};if("function"!=typeof b[0]){var b=ib(Db(b),Wf);return fd(a,xb(_e(a),b))}var c=fc(b[0],b[1],3);return gd(a,function(a,b,d){return!c(a,b,d)})}),Rh=qe(function(a,b){return null==a?{}:"function"==typeof b[0]?gd(a,fc(b[0],b[1],3)):fd(a,Db(b))}),Sh=pc(function(a,b,c){return b=b.toLowerCase(),a+(c?b.charAt(0).toUpperCase()+b.slice(1):b)}),Th=pc(function(a,b,c){return a+(c?"-":"")+b.toLowerCase()}),Uh=Cc(),Vh=Cc(!0),Wh=pc(function(a,b,c){return a+(c?"_":"")+b.toLowerCase()}),Xh=pc(function(a,b,c){return a+(c?" ":"")+(b.charAt(0).toUpperCase()+b.slice(1))}),Yh=qe(function(a,b){try{return a.apply(z,b)}catch(c){return Ee(c)?c:new Qf(c)}}),Zh=qe(function(a,b){return function(c){return Xc(c,a,b)}}),$h=qe(function(a,b){return function(c){return Xc(a,c,b)}}),_h=Ic("ceil"),ai=Ic("floor"),bi=tc(we,Ag),ci=tc(Se,Bg),di=Ic("round");return b.prototype=c.prototype,s.prototype=Ig(c.prototype),s.prototype.constructor=s,Z.prototype=Ig(c.prototype),Z.prototype.constructor=Z,Ta.prototype["delete"]=Ua,Ta.prototype.get=Va,Ta.prototype.has=Wa,Ta.prototype.set=Xa,Ya.prototype.push=$a,ne.Cache=Ta,b.after=je,b.ary=ke,b.assign=Eh,b.at=bh,b.before=le,b.bind=ph,b.bindAll=qh,b.bindKey=rh,b.callback=zf,b.chain=Od,b.chunk=nd,b.compact=od,b.constant=Af,b.countBy=ch,b.create=We,b.curry=sh,b.curryRight=th,b.debounce=me,b.defaults=Fh,b.defaultsDeep=Gh,b.defer=uh,b.delay=vh,b.difference=Rg,b.drop=pd,b.dropRight=qd,b.dropRightWhile=rd,b.dropWhile=sd,b.fill=td,b.filter=Yd,b.flatten=vd,b.flattenDeep=wd,b.flow=wh,b.flowRight=xh,b.forEach=fh,b.forEachRight=gh,b.forIn=Jh,b.forInRight=Kh,b.forOwn=Lh,b.forOwnRight=Mh,b.functions=Xe,b.groupBy=hh,b.indexBy=ih,b.initial=yd,b.intersection=Ug,b.invert=$e,b.invoke=jh,b.keys=Nh,b.keysIn=_e,b.map=_d,b.mapKeys=Oh,b.mapValues=Ph,b.matches=Cf,b.matchesProperty=Df,b.memoize=ne,b.merge=Dh,b.method=Zh,b.methodOf=$h,b.mixin=Ef,b.modArgs=yh,b.negate=oe,b.omit=Qh,b.once=pe,b.pairs=af,b.partial=zh,b.partialRight=Ah,b.partition=kh,b.pick=Rh,b.pluck=ae,b.property=Hf,b.propertyOf=If,b.pull=Bd,b.pullAt=Vg,b.range=Jf,b.rearg=Bh,b.reject=be,b.remove=Cd,b.rest=Dd,b.restParam=qe,b.set=cf,b.shuffle=de,b.slice=Ed,b.sortBy=ge,b.sortByAll=nh,b.sortByOrder=he,b.spread=re,b.take=Fd,b.takeRight=Gd,b.takeRightWhile=Hd,b.takeWhile=Id,b.tap=Pd,b.throttle=se,b.thru=Qd,b.times=Kf,b.toArray=Ue,b.toPlainObject=Ve,b.transform=df,b.union=Yg,b.uniq=Jd,b.unzip=Kd,b.unzipWith=Ld,b.values=ef,b.valuesIn=ff,b.where=ie,b.without=Zg,b.wrap=te,b.xor=Md,b.zip=$g,b.zipObject=Nd,b.zipWith=_g,b.backflow=xh,b.collect=_d,b.compose=xh,b.each=fh,b.eachRight=gh,b.extend=Eh,b.iteratee=zf,b.methods=Xe,b.object=Nd,b.select=Yd,b.tail=Dd,b.unique=Jd,Ef(b,b),b.add=Mf,b.attempt=Yh,b.camelCase=Sh,b.capitalize=jf,b.ceil=_h,b.clone=ue,b.cloneDeep=ve,b.deburr=kf,b.endsWith=lf,b.escape=mf,b.escapeRegExp=nf,b.every=Xd,b.find=dh,b.findIndex=Sg,b.findKey=Hh,b.findLast=eh,b.findLastIndex=Tg,b.findLastKey=Ih,b.findWhere=Zd,b.first=ud,b.floor=ai,b.get=Ye,b.gt=we,b.gte=xe,b.has=Ze,b.identity=Bf,b.includes=$d,b.indexOf=xd,b.inRange=gf,b.isArguments=ye,b.isArray=Ch,b.isBoolean=ze,b.isDate=Ae,b.isElement=Be,b.isEmpty=Ce,b.isEqual=De,b.isError=Ee,b.isFinite=Fe,b.isFunction=Ge,b.isMatch=Ie,b.isNaN=Je,b.isNative=Ke,b.isNull=Le,b.isNumber=Me,b.isObject=He,b.isPlainObject=Ne,b.isRegExp=Oe,b.isString=Pe,b.isTypedArray=Qe,b.isUndefined=Re,b.kebabCase=Th,b.last=zd,b.lastIndexOf=Ad,b.lt=Se,b.lte=Te,b.max=bi,b.min=ci,b.noConflict=Ff,b.noop=Gf,b.now=oh,b.pad=of,b.padLeft=Uh,b.padRight=Vh,b.parseInt=pf,b.random=hf,b.reduce=lh,b.reduceRight=mh,b.repeat=qf,b.result=bf,b.round=di,b.runInContext=y,b.size=ee,b.snakeCase=Wh,b.some=fe,b.sortedIndex=Wg,b.sortedLastIndex=Xg,b.startCase=Xh,b.startsWith=rf,b.sum=Nf,b.template=sf,b.trim=tf,b.trimLeft=uf,b.trimRight=vf,b.trunc=wf,b.unescape=xf,b.uniqueId=Lf,b.words=yf,b.all=Xd,b.any=fe,b.contains=$d,b.eq=De,b.detect=dh,b.foldl=lh,b.foldr=mh,b.head=ud,b.include=$d,b.inject=lh,Ef(b,function(){var a={};return Fb(b,function(c,d){b.prototype[d]||(a[d]=c)}),a}(),!1),b.sample=ce,b.prototype.sample=function(a){return this.__chain__||null!=a?this.thru(function(b){return ce(b,a)}):ce(this.value())},b.VERSION=A,bb(["bind","bindKey","curry","curryRight","partial","partialRight"],function(a){b[a].placeholder=b}),bb(["drop","take"],function(a,b){Z.prototype[a]=function(c){var d=this.__filtered__;if(d&&!b)return new Z(this);c=null==c?1:vg(rg(c)||0,0);var e=this.clone();return d?e.__takeCount__=wg(e.__takeCount__,c):e.__views__.push({size:c,type:a+(e.__dir__<0?"Right":"")}),e},Z.prototype[a+"Right"]=function(b){return this.reverse()[a](b).reverse()}}),bb(["filter","map","takeWhile"],function(a,b){var c=b+1,d=c!=Q;Z.prototype[a]=function(a,b){var e=this.clone();return e.__iteratees__.push({iteratee:Oc(a,b,1),type:c}),e.__filtered__=e.__filtered__||d,e}}),bb(["first","last"],function(a,b){var c="take"+(b?"Right":"");Z.prototype[a]=function(){return this[c](1).value()[0]}}),bb(["initial","rest"],function(a,b){var c="drop"+(b?"":"Right");Z.prototype[a]=function(){return this.__filtered__?new Z(this):this[c](1)}}),bb(["pluck","where"],function(a,b){var c=b?"filter":"map",d=b?Nb:Hf;Z.prototype[a]=function(a){return this[c](d(a))}}),Z.prototype.compact=function(){return this.filter(Bf)},Z.prototype.reject=function(a,b){return a=Oc(a,b,1),this.filter(function(b){return!a(b)})},Z.prototype.slice=function(a,b){a=null==a?0:+a||0;var c=this;return c.__filtered__&&(a>0||0>b)?new Z(c):(0>a?c=c.takeRight(-a):a&&(c=c.drop(a)),b!==z&&(b=+b||0,c=0>b?c.dropRight(-b):c.take(b-a)),c)},Z.prototype.takeRightWhile=function(a,b){return this.reverse().takeWhile(a,b).reverse()},Z.prototype.toArray=function(){return this.take(Bg)},Fb(Z.prototype,function(a,c){var d=/^(?:filter|map|reject)|While$/.test(c),e=/^(?:first|last)$/.test(c),f=b[e?"take"+("last"==c?"Right":""):c];f&&(b.prototype[c]=function(){var b=e?[1]:arguments,c=this.__chain__,g=this.__wrapped__,h=!!this.__actions__.length,i=g instanceof Z,j=b[0],k=i||Ch(g);k&&d&&"function"==typeof j&&1!=j.length&&(i=k=!1);var l=function(a){return e&&c?f(a,1)[0]:f.apply(z,jb([a],b))},m={func:Qd,args:[l],thisArg:z},n=i&&!h;if(e&&!c)return n?(g=g.clone(),g.__actions__.push(m),a.call(g)):f.call(z,this.value())[0];if(!e&&k){g=n?g:new Z(this);var o=a.apply(g,b);return o.__actions__.push(m),new s(o,c)}return this.thru(l)})}),bb(["join","pop","push","replace","shift","sort","splice","split","unshift"],function(a){var c=(/^(?:replace|split)$/.test(a)?$f:Yf)[a],d=/^(?:push|sort|unshift)$/.test(a)?"tap":"thru",e=/^(?:join|pop|replace|shift)$/.test(a);b.prototype[a]=function(){var a=arguments;return e&&!this.__chain__?c.apply(this.value(),a):this[d](function(b){return c.apply(b,a)})}}),Fb(Z.prototype,function(a,c){var d=b[c];if(d){var e=d.name,f=Hg[e]||(Hg[e]=[]);f.push({name:c,func:d})}}),Hg[Fc(z,C).name]=[{name:"wrapper",func:z}],Z.prototype.clone=ba,Z.prototype.reverse=da,Z.prototype.value=Sa,b.prototype.chain=Rd,b.prototype.commit=Sd,b.prototype.concat=ah,b.prototype.plant=Td,b.prototype.reverse=Ud,b.prototype.toString=Vd,b.prototype.run=b.prototype.toJSON=b.prototype.valueOf=b.prototype.value=Wd,b.prototype.collect=b.prototype.map,b.prototype.head=b.prototype.first,b.prototype.select=b.prototype.filter,b.prototype.tail=b.prototype.rest,b}var z,A="3.10.1",B=1,C=2,D=4,E=8,F=16,G=32,H=64,I=128,J=256,K=30,L="...",M=150,N=16,O=200,P=1,Q=2,R="Expected a function",S="__lodash_placeholder__",T="[object Arguments]",U="[object Array]",V="[object Boolean]",W="[object Date]",X="[object Error]",Y="[object Function]",Z="[object Map]",$="[object Number]",_="[object Object]",aa="[object RegExp]",ba="[object Set]",ca="[object String]",da="[object WeakMap]",ea="[object ArrayBuffer]",fa="[object Float32Array]",ga="[object Float64Array]",ha="[object Int8Array]",ia="[object Int16Array]",ja="[object Int32Array]",ka="[object Uint8Array]",la="[object Uint8ClampedArray]",ma="[object Uint16Array]",na="[object Uint32Array]",oa=/\b__p \+= '';/g,pa=/\b(__p \+=) '' \+/g,qa=/(__e\(.*?\)|\b__t\)) \+\n'';/g,ra=/&(?:amp|lt|gt|quot|#39|#96);/g,sa=/[&<>"'`]/g,ta=RegExp(ra.source),ua=RegExp(sa.source),va=/<%-([\s\S]+?)%>/g,wa=/<%([\s\S]+?)%>/g,xa=/<%=([\s\S]+?)%>/g,ya=/\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\n\\]|\\.)*?\1)\]/,za=/^\w*$/,Aa=/[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\n\\]|\\.)*?)\2)\]/g,Ba=/^[:!,]|[\\^$.*+?()[\]{}|\/]|(^[0-9a-fA-Fnrtuvx])|([\n\r\u2028\u2029])/g,Ca=RegExp(Ba.source),Da=/[\u0300-\u036f\ufe20-\ufe23]/g,Ea=/\\(\\)?/g,Fa=/\$\{([^\\}]*(?:\\.[^\\}]*)*)\}/g,Ga=/\w*$/,Ha=/^0[xX]/,Ia=/^\[object .+?Constructor\]$/,Ja=/^\d+$/,Ka=/[\xc0-\xd6\xd8-\xde\xdf-\xf6\xf8-\xff]/g,La=/($^)/,Ma=/['\n\r\u2028\u2029\\]/g,Na=function(){var a="[A-Z\\xc0-\\xd6\\xd8-\\xde]",b="[a-z\\xdf-\\xf6\\xf8-\\xff]+";return RegExp(a+"+(?="+a+b+")|"+a+"?"+b+"|"+a+"+|[0-9]+","g")}(),Oa=["Array","ArrayBuffer","Date","Error","Float32Array","Float64Array","Function","Int8Array","Int16Array","Int32Array","Math","Number","Object","RegExp","Set","String","_","clearTimeout","isFinite","parseFloat","parseInt","setTimeout","TypeError","Uint8Array","Uint8ClampedArray","Uint16Array","Uint32Array","WeakMap"],Pa=-1,Qa={};Qa[fa]=Qa[ga]=Qa[ha]=Qa[ia]=Qa[ja]=Qa[ka]=Qa[la]=Qa[ma]=Qa[na]=!0,Qa[T]=Qa[U]=Qa[ea]=Qa[V]=Qa[W]=Qa[X]=Qa[Y]=Qa[Z]=Qa[$]=Qa[_]=Qa[aa]=Qa[ba]=Qa[ca]=Qa[da]=!1;var Ra={};Ra[T]=Ra[U]=Ra[ea]=Ra[V]=Ra[W]=Ra[fa]=Ra[ga]=Ra[ha]=Ra[ia]=Ra[ja]=Ra[$]=Ra[_]=Ra[aa]=Ra[ca]=Ra[ka]=Ra[la]=Ra[ma]=Ra[na]=!0,Ra[X]=Ra[Y]=Ra[Z]=Ra[ba]=Ra[da]=!1;var Sa={"À":"A","Á":"A","Â":"A","Ã":"A","Ä":"A","Å":"A","à":"a","á":"a","â":"a","ã":"a","ä":"a","å":"a","Ç":"C","ç":"c","Ð":"D","ð":"d","È":"E","É":"E","Ê":"E","Ë":"E","è":"e","é":"e","ê":"e","ë":"e","Ì":"I","Í":"I","Î":"I","Ï":"I","ì":"i","í":"i","î":"i","ï":"i","Ñ":"N","ñ":"n","Ò":"O","Ó":"O","Ô":"O","Õ":"O","Ö":"O","Ø":"O","ò":"o","ó":"o","ô":"o","õ":"o","ö":"o","ø":"o","Ù":"U","Ú":"U","Û":"U","Ü":"U","ù":"u","ú":"u","û":"u","ü":"u","Ý":"Y","ý":"y","ÿ":"y","Æ":"Ae","æ":"ae","Þ":"Th","þ":"th","ß":"ss"},Ta={"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;","`":"&#96;"},Ua={"&amp;":"&","&lt;":"<","&gt;":">","&quot;":'"',"&#39;":"'","&#96;":"`"},Va={"function":!0,object:!0},Wa={0:"x30",1:"x31",2:"x32",3:"x33",4:"x34",5:"x35",6:"x36",7:"x37",8:"x38",9:"x39",A:"x41",B:"x42",C:"x43",D:"x44",E:"x45",F:"x46",a:"x61",b:"x62",c:"x63",d:"x64",e:"x65",f:"x66",n:"x6e",r:"x72",t:"x74",u:"x75",v:"x76",x:"x78"},Xa={"\\":"\\","'":"'","\n":"n","\r":"r","\u2028":"u2028","\u2029":"u2029"},Ya=Va[typeof c]&&c&&!c.nodeType&&c,Za=Va[typeof b]&&b&&!b.nodeType&&b,$a=Ya&&Za&&"object"==typeof a&&a&&a.Object&&a,_a=Va[typeof self]&&self&&self.Object&&self,ab=Va[typeof window]&&window&&window.Object&&window,bb=Za&&Za.exports===Ya&&Ya,cb=$a||ab!==(this&&this.window)&&ab||_a||this,db=y();"function"==typeof define&&"object"==typeof define.amd&&define.amd?(cb._=db,define(function(){return db})):Ya&&Za?bb?(Za.exports=db)._=db:Ya._=db:cb._=db}).call(this)}).call(this,"undefined"!=typeof global?global:"undefined"!=typeof self?self:"undefined"!=typeof window?window:{})},{}],3:[function(a,b,c){"use strict";var d=a("./focusNode"),e={componentDidMount:function(){this.props.autoFocus&&d(this.getDOMNode())}};b.exports=e},{"./focusNode":121}],4:[function(a,b,c){"use strict";function d(){var a=window.opera;return"object"==typeof a&&"function"==typeof a.version&&parseInt(a.version(),10)<=12}function e(a){return(a.ctrlKey||a.altKey||a.metaKey)&&!(a.ctrlKey&&a.altKey)}function f(a){switch(a){case C.topCompositionStart:return D.compositionStart;case C.topCompositionEnd:return D.compositionEnd;case C.topCompositionUpdate:return D.compositionUpdate}}function g(a,b){return a===C.topKeyDown&&b.keyCode===v}function h(a,b){switch(a){case C.topKeyUp:return-1!==u.indexOf(b.keyCode);case C.topKeyDown:return b.keyCode!==v;case C.topKeyPress:case C.topMouseDown:case C.topBlur:return!0;default:return!1}}function i(a){var b=a.detail;return"object"==typeof b&&"data"in b?b.data:null}function j(a,b,c,d){var e,j;if(w?e=f(a):F?h(a,d)&&(e=D.compositionEnd):g(a,d)&&(e=D.compositionStart),!e)return null;z&&(F||e!==D.compositionStart?e===D.compositionEnd&&F&&(j=F.getData()):F=q.getPooled(b));var k=r.getPooled(e,c,d);if(j)k.data=j;else{var l=i(d);null!==l&&(k.data=l)}return o.accumulateTwoPhaseDispatches(k),k}function k(a,b){switch(a){case C.topCompositionEnd:return i(b);case C.topKeyPress:var c=b.which;return c!==A?null:(E=!0,B);case C.topTextInput:var d=b.data;return d===B&&E?null:d;default:return null}}function l(a,b){if(F){if(a===C.topCompositionEnd||h(a,b)){var c=F.getData();return q.release(F),F=null,c}return null}switch(a){case C.topPaste:return null;case C.topKeyPress:return b.which&&!e(b)?String.fromCharCode(b.which):null;case C.topCompositionEnd:return z?null:b.data;default:return null}}function m(a,b,c,d){var e;if(e=y?k(a,d):l(a,d),!e)return null;var f=s.getPooled(D.beforeInput,c,d);return f.data=e,o.accumulateTwoPhaseDispatches(f),f}var n=a("./EventConstants"),o=a("./EventPropagators"),p=a("./ExecutionEnvironment"),q=a("./FallbackCompositionState"),r=a("./SyntheticCompositionEvent"),s=a("./SyntheticInputEvent"),t=a("./keyOf"),u=[9,13,27,32],v=229,w=p.canUseDOM&&"CompositionEvent"in window,x=null;p.canUseDOM&&"documentMode"in document&&(x=document.documentMode);var y=p.canUseDOM&&"TextEvent"in window&&!x&&!d(),z=p.canUseDOM&&(!w||x&&x>8&&11>=x),A=32,B=String.fromCharCode(A),C=n.topLevelTypes,D={beforeInput:{phasedRegistrationNames:{bubbled:t({onBeforeInput:null}),captured:t({onBeforeInputCapture:null})},dependencies:[C.topCompositionEnd,C.topKeyPress,C.topTextInput,C.topPaste]},compositionEnd:{phasedRegistrationNames:{bubbled:t({onCompositionEnd:null}),captured:t({onCompositionEndCapture:null})},dependencies:[C.topBlur,C.topCompositionEnd,C.topKeyDown,C.topKeyPress,C.topKeyUp,C.topMouseDown]},compositionStart:{phasedRegistrationNames:{bubbled:t({onCompositionStart:null}),captured:t({onCompositionStartCapture:null})},dependencies:[C.topBlur,C.topCompositionStart,C.topKeyDown,C.topKeyPress,C.topKeyUp,C.topMouseDown]},compositionUpdate:{phasedRegistrationNames:{bubbled:t({onCompositionUpdate:null}),captured:t({onCompositionUpdateCapture:null})},dependencies:[C.topBlur,C.topCompositionUpdate,C.topKeyDown,C.topKeyPress,C.topKeyUp,C.topMouseDown]}},E=!1,F=null,G={eventTypes:D,extractEvents:function(a,b,c,d){return[j(a,b,c,d),m(a,b,c,d)]}};b.exports=G},{"./EventConstants":16,"./EventPropagators":21,"./ExecutionEnvironment":22,"./FallbackCompositionState":23,"./SyntheticCompositionEvent":95,"./SyntheticInputEvent":99,"./keyOf":143}],5:[function(a,b,c){"use strict";function d(a,b){return a+b.charAt(0).toUpperCase()+b.substring(1)}var e={boxFlex:!0,boxFlexGroup:!0,columnCount:!0,flex:!0,flexGrow:!0,flexPositive:!0,flexShrink:!0,flexNegative:!0,fontWeight:!0,lineClamp:!0,lineHeight:!0,opacity:!0,order:!0,orphans:!0,widows:!0,zIndex:!0,zoom:!0,fillOpacity:!0,strokeDashoffset:!0,strokeOpacity:!0,strokeWidth:!0},f=["Webkit","ms","Moz","O"];Object.keys(e).forEach(function(a){f.forEach(function(b){e[d(b,a)]=e[a]})});var g={background:{backgroundImage:!0,backgroundPosition:!0,backgroundRepeat:!0,backgroundColor:!0},border:{borderWidth:!0,borderStyle:!0,borderColor:!0},borderBottom:{borderBottomWidth:!0,borderBottomStyle:!0,borderBottomColor:!0},borderLeft:{borderLeftWidth:!0,borderLeftStyle:!0,borderLeftColor:!0},borderRight:{borderRightWidth:!0,borderRightStyle:!0,borderRightColor:!0},borderTop:{borderTopWidth:!0,borderTopStyle:!0,borderTopColor:!0},font:{fontStyle:!0,fontVariant:!0,fontWeight:!0,fontSize:!0,lineHeight:!0,fontFamily:!0}},h={isUnitlessNumber:e,shorthandPropertyExpansions:g};b.exports=h},{}],6:[function(a,b,c){(function(c){"use strict";var d=a("./CSSProperty"),e=a("./ExecutionEnvironment"),f=a("./camelizeStyleName"),g=a("./dangerousStyleValue"),h=a("./hyphenateStyleName"),i=a("./memoizeStringOnly"),j=a("./warning"),k=i(function(a){return h(a)}),l="cssFloat";if(e.canUseDOM&&void 0===document.documentElement.style.cssFloat&&(l="styleFloat"),"production"!==c.env.NODE_ENV)var m=/^(?:webkit|moz|o)[A-Z]/,n=/;\s*$/,o={},p={},q=function(a){o.hasOwnProperty(a)&&o[a]||(o[a]=!0,"production"!==c.env.NODE_ENV?j(!1,"Unsupported style property %s. Did you mean %s?",a,f(a)):null)},r=function(a){o.hasOwnProperty(a)&&o[a]||(o[a]=!0,"production"!==c.env.NODE_ENV?j(!1,"Unsupported vendor-prefixed style property %s. Did you mean %s?",a,a.charAt(0).toUpperCase()+a.slice(1)):null)},s=function(a,b){p.hasOwnProperty(b)&&p[b]||(p[b]=!0,"production"!==c.env.NODE_ENV?j(!1,'Style property values shouldn\'t contain a semicolon. Try "%s: %s" instead.',a,b.replace(n,"")):null)},t=function(a,b){a.indexOf("-")>-1?q(a):m.test(a)?r(a):n.test(b)&&s(a,b)};var u={createMarkupForStyles:function(a){var b="";for(var d in a)if(a.hasOwnProperty(d)){var e=a[d];"production"!==c.env.NODE_ENV&&t(d,e),null!=e&&(b+=k(d)+":",b+=g(d,e)+";")}return b||null},setValueForStyles:function(a,b){var e=a.style;for(var f in b)if(b.hasOwnProperty(f)){"production"!==c.env.NODE_ENV&&t(f,b[f]);var h=g(f,b[f]);if("float"===f&&(f=l),h)e[f]=h;else{var i=d.shorthandPropertyExpansions[f];if(i)for(var j in i)e[j]="";else e[f]=""}}}};b.exports=u}).call(this,a("_process"))},{"./CSSProperty":5,"./ExecutionEnvironment":22,"./camelizeStyleName":110,"./dangerousStyleValue":115,"./hyphenateStyleName":135,"./memoizeStringOnly":145,"./warning":156,_process:1}],7:[function(a,b,c){(function(c){"use strict";function d(){this._callbacks=null,this._contexts=null}var e=a("./PooledClass"),f=a("./Object.assign"),g=a("./invariant");f(d.prototype,{enqueue:function(a,b){this._callbacks=this._callbacks||[],this._contexts=this._contexts||[],this._callbacks.push(a),this._contexts.push(b)},notifyAll:function(){var a=this._callbacks,b=this._contexts;if(a){"production"!==c.env.NODE_ENV?g(a.length===b.length,"Mismatched list of contexts in callback queue"):g(a.length===b.length),this._callbacks=null,this._contexts=null;for(var d=0,e=a.length;e>d;d++)a[d].call(b[d]);a.length=0,b.length=0}},reset:function(){this._callbacks=null,this._contexts=null},destructor:function(){this.reset()}}),e.addPoolingTo(d),b.exports=d}).call(this,a("_process"))},{"./Object.assign":28,"./PooledClass":29,"./invariant":137,_process:1}],8:[function(a,b,c){"use strict";function d(a){return"SELECT"===a.nodeName||"INPUT"===a.nodeName&&"file"===a.type}function e(a){var b=x.getPooled(C.change,E,a);u.accumulateTwoPhaseDispatches(b),w.batchedUpdates(f,b)}function f(a){t.enqueueEvents(a),t.processEventQueue()}function g(a,b){D=a,E=b,D.attachEvent("onchange",e)}function h(){D&&(D.detachEvent("onchange",e),D=null,E=null)}function i(a,b,c){return a===B.topChange?c:void 0}function j(a,b,c){a===B.topFocus?(h(),g(b,c)):a===B.topBlur&&h()}function k(a,b){D=a,E=b,F=a.value,G=Object.getOwnPropertyDescriptor(a.constructor.prototype,"value"),Object.defineProperty(D,"value",J),D.attachEvent("onpropertychange",m)}function l(){D&&(delete D.value,D.detachEvent("onpropertychange",m),D=null,E=null,F=null,G=null)}function m(a){if("value"===a.propertyName){var b=a.srcElement.value;b!==F&&(F=b,e(a))}}function n(a,b,c){return a===B.topInput?c:void 0}function o(a,b,c){a===B.topFocus?(l(),k(b,c)):a===B.topBlur&&l()}function p(a,b,c){return a!==B.topSelectionChange&&a!==B.topKeyUp&&a!==B.topKeyDown||!D||D.value===F?void 0:(F=D.value,E)}function q(a){return"INPUT"===a.nodeName&&("checkbox"===a.type||"radio"===a.type)}function r(a,b,c){return a===B.topClick?c:void 0}var s=a("./EventConstants"),t=a("./EventPluginHub"),u=a("./EventPropagators"),v=a("./ExecutionEnvironment"),w=a("./ReactUpdates"),x=a("./SyntheticEvent"),y=a("./isEventSupported"),z=a("./isTextInputElement"),A=a("./keyOf"),B=s.topLevelTypes,C={change:{phasedRegistrationNames:{bubbled:A({onChange:null}),captured:A({onChangeCapture:null})},dependencies:[B.topBlur,B.topChange,B.topClick,B.topFocus,B.topInput,B.topKeyDown,B.topKeyUp,B.topSelectionChange]}},D=null,E=null,F=null,G=null,H=!1;v.canUseDOM&&(H=y("change")&&(!("documentMode"in document)||document.documentMode>8));var I=!1;v.canUseDOM&&(I=y("input")&&(!("documentMode"in document)||document.documentMode>9));var J={get:function(){return G.get.call(this)},set:function(a){F=""+a,G.set.call(this,a)}},K={eventTypes:C,extractEvents:function(a,b,c,e){var f,g;if(d(b)?H?f=i:g=j:z(b)?I?f=n:(f=p,g=o):q(b)&&(f=r),f){var h=f(a,b,c);if(h){var k=x.getPooled(C.change,h,e);return u.accumulateTwoPhaseDispatches(k),k}}g&&g(a,b,c)}};b.exports=K},{"./EventConstants":16,"./EventPluginHub":18,"./EventPropagators":21,"./ExecutionEnvironment":22,"./ReactUpdates":89,"./SyntheticEvent":97,"./isEventSupported":138,"./isTextInputElement":140,"./keyOf":143}],9:[function(a,b,c){"use strict";var d=0,e={createReactRootIndex:function(){return d++}};b.exports=e},{}],10:[function(a,b,c){(function(c){"use strict";function d(a,b,c){a.insertBefore(b,a.childNodes[c]||null)}var e=a("./Danger"),f=a("./ReactMultiChildUpdateTypes"),g=a("./setTextContent"),h=a("./invariant"),i={dangerouslyReplaceNodeWithMarkup:e.dangerouslyReplaceNodeWithMarkup,updateTextContent:g,processUpdates:function(a,b){for(var i,j=null,k=null,l=0;l<a.length;l++)if(i=a[l],i.type===f.MOVE_EXISTING||i.type===f.REMOVE_NODE){var m=i.fromIndex,n=i.parentNode.childNodes[m],o=i.parentID;"production"!==c.env.NODE_ENV?h(n,"processUpdates(): Unable to find child %s of element. This probably means the DOM was unexpectedly mutated (e.g., by the browser), usually due to forgetting a <tbody> when using tables, nesting tags like <form>, <p>, or <a>, or using non-SVG elements in an <svg> parent. Try inspecting the child nodes of the element with React ID `%s`.",m,o):h(n),j=j||{},j[o]=j[o]||[],j[o][m]=n,k=k||[],k.push(n)}var p=e.dangerouslyRenderMarkup(b);if(k)for(var q=0;q<k.length;q++)k[q].parentNode.removeChild(k[q]);for(var r=0;r<a.length;r++)switch(i=a[r],i.type){case f.INSERT_MARKUP:d(i.parentNode,p[i.markupIndex],i.toIndex);break;case f.MOVE_EXISTING:d(i.parentNode,j[i.parentID][i.fromIndex],i.toIndex);break;case f.TEXT_CONTENT:g(i.parentNode,i.textContent);break;case f.REMOVE_NODE:}}};b.exports=i}).call(this,a("_process"))},{"./Danger":13,"./ReactMultiChildUpdateTypes":74,"./invariant":137,"./setTextContent":151,_process:1}],11:[function(a,b,c){(function(c){"use strict";function d(a,b){return(a&b)===b}var e=a("./invariant"),f={MUST_USE_ATTRIBUTE:1,MUST_USE_PROPERTY:2,HAS_SIDE_EFFECTS:4,HAS_BOOLEAN_VALUE:8,HAS_NUMERIC_VALUE:16,HAS_POSITIVE_NUMERIC_VALUE:48,HAS_OVERLOADED_BOOLEAN_VALUE:64,injectDOMPropertyConfig:function(a){var b=a.Properties||{},g=a.DOMAttributeNames||{},i=a.DOMPropertyNames||{},j=a.DOMMutationMethods||{};a.isCustomAttribute&&h._isCustomAttributeFunctions.push(a.isCustomAttribute);
for(var k in b){"production"!==c.env.NODE_ENV?e(!h.isStandardName.hasOwnProperty(k),"injectDOMPropertyConfig(...): You're trying to inject DOM property '%s' which has already been injected. You may be accidentally injecting the same DOM property config twice, or you may be injecting two configs that have conflicting property names.",k):e(!h.isStandardName.hasOwnProperty(k)),h.isStandardName[k]=!0;var l=k.toLowerCase();if(h.getPossibleStandardName[l]=k,g.hasOwnProperty(k)){var m=g[k];h.getPossibleStandardName[m]=k,h.getAttributeName[k]=m}else h.getAttributeName[k]=l;h.getPropertyName[k]=i.hasOwnProperty(k)?i[k]:k,j.hasOwnProperty(k)?h.getMutationMethod[k]=j[k]:h.getMutationMethod[k]=null;var n=b[k];h.mustUseAttribute[k]=d(n,f.MUST_USE_ATTRIBUTE),h.mustUseProperty[k]=d(n,f.MUST_USE_PROPERTY),h.hasSideEffects[k]=d(n,f.HAS_SIDE_EFFECTS),h.hasBooleanValue[k]=d(n,f.HAS_BOOLEAN_VALUE),h.hasNumericValue[k]=d(n,f.HAS_NUMERIC_VALUE),h.hasPositiveNumericValue[k]=d(n,f.HAS_POSITIVE_NUMERIC_VALUE),h.hasOverloadedBooleanValue[k]=d(n,f.HAS_OVERLOADED_BOOLEAN_VALUE),"production"!==c.env.NODE_ENV?e(!h.mustUseAttribute[k]||!h.mustUseProperty[k],"DOMProperty: Cannot require using both attribute and property: %s",k):e(!h.mustUseAttribute[k]||!h.mustUseProperty[k]),"production"!==c.env.NODE_ENV?e(h.mustUseProperty[k]||!h.hasSideEffects[k],"DOMProperty: Properties that have side effects must use property: %s",k):e(h.mustUseProperty[k]||!h.hasSideEffects[k]),"production"!==c.env.NODE_ENV?e(!!h.hasBooleanValue[k]+!!h.hasNumericValue[k]+!!h.hasOverloadedBooleanValue[k]<=1,"DOMProperty: Value can be one of boolean, overloaded boolean, or numeric value, but not a combination: %s",k):e(!!h.hasBooleanValue[k]+!!h.hasNumericValue[k]+!!h.hasOverloadedBooleanValue[k]<=1)}}},g={},h={ID_ATTRIBUTE_NAME:"data-reactid",isStandardName:{},getPossibleStandardName:{},getAttributeName:{},getPropertyName:{},getMutationMethod:{},mustUseAttribute:{},mustUseProperty:{},hasSideEffects:{},hasBooleanValue:{},hasNumericValue:{},hasPositiveNumericValue:{},hasOverloadedBooleanValue:{},_isCustomAttributeFunctions:[],isCustomAttribute:function(a){for(var b=0;b<h._isCustomAttributeFunctions.length;b++){var c=h._isCustomAttributeFunctions[b];if(c(a))return!0}return!1},getDefaultValueForProperty:function(a,b){var c,d=g[a];return d||(g[a]=d={}),b in d||(c=document.createElement(a),d[b]=c[b]),d[b]},injection:f};b.exports=h}).call(this,a("_process"))},{"./invariant":137,_process:1}],12:[function(a,b,c){(function(c){"use strict";function d(a,b){return null==b||e.hasBooleanValue[a]&&!b||e.hasNumericValue[a]&&isNaN(b)||e.hasPositiveNumericValue[a]&&1>b||e.hasOverloadedBooleanValue[a]&&b===!1}var e=a("./DOMProperty"),f=a("./quoteAttributeValueForBrowser"),g=a("./warning");if("production"!==c.env.NODE_ENV)var h={children:!0,dangerouslySetInnerHTML:!0,key:!0,ref:!0},i={},j=function(a){if(!(h.hasOwnProperty(a)&&h[a]||i.hasOwnProperty(a)&&i[a])){i[a]=!0;var b=a.toLowerCase(),d=e.isCustomAttribute(b)?b:e.getPossibleStandardName.hasOwnProperty(b)?e.getPossibleStandardName[b]:null;"production"!==c.env.NODE_ENV?g(null==d,"Unknown DOM property %s. Did you mean %s?",a,d):null}};var k={createMarkupForID:function(a){return e.ID_ATTRIBUTE_NAME+"="+f(a)},createMarkupForProperty:function(a,b){if(e.isStandardName.hasOwnProperty(a)&&e.isStandardName[a]){if(d(a,b))return"";var g=e.getAttributeName[a];return e.hasBooleanValue[a]||e.hasOverloadedBooleanValue[a]&&b===!0?g:g+"="+f(b)}return e.isCustomAttribute(a)?null==b?"":a+"="+f(b):("production"!==c.env.NODE_ENV&&j(a),null)},setValueForProperty:function(a,b,f){if(e.isStandardName.hasOwnProperty(b)&&e.isStandardName[b]){var g=e.getMutationMethod[b];if(g)g(a,f);else if(d(b,f))this.deleteValueForProperty(a,b);else if(e.mustUseAttribute[b])a.setAttribute(e.getAttributeName[b],""+f);else{var h=e.getPropertyName[b];e.hasSideEffects[b]&&""+a[h]==""+f||(a[h]=f)}}else e.isCustomAttribute(b)?null==f?a.removeAttribute(b):a.setAttribute(b,""+f):"production"!==c.env.NODE_ENV&&j(b)},deleteValueForProperty:function(a,b){if(e.isStandardName.hasOwnProperty(b)&&e.isStandardName[b]){var d=e.getMutationMethod[b];if(d)d(a,void 0);else if(e.mustUseAttribute[b])a.removeAttribute(e.getAttributeName[b]);else{var f=e.getPropertyName[b],g=e.getDefaultValueForProperty(a.nodeName,f);e.hasSideEffects[b]&&""+a[f]===g||(a[f]=g)}}else e.isCustomAttribute(b)?a.removeAttribute(b):"production"!==c.env.NODE_ENV&&j(b)}};b.exports=k}).call(this,a("_process"))},{"./DOMProperty":11,"./quoteAttributeValueForBrowser":149,"./warning":156,_process:1}],13:[function(a,b,c){(function(c){"use strict";function d(a){return a.substring(1,a.indexOf(" "))}var e=a("./ExecutionEnvironment"),f=a("./createNodesFromMarkup"),g=a("./emptyFunction"),h=a("./getMarkupWrap"),i=a("./invariant"),j=/^(<[^ \/>]+)/,k="data-danger-index",l={dangerouslyRenderMarkup:function(a){"production"!==c.env.NODE_ENV?i(e.canUseDOM,"dangerouslyRenderMarkup(...): Cannot render markup in a worker thread. Make sure `window` and `document` are available globally before requiring React when unit testing or use React.renderToString for server rendering."):i(e.canUseDOM);for(var b,l={},m=0;m<a.length;m++)"production"!==c.env.NODE_ENV?i(a[m],"dangerouslyRenderMarkup(...): Missing markup."):i(a[m]),b=d(a[m]),b=h(b)?b:"*",l[b]=l[b]||[],l[b][m]=a[m];var n=[],o=0;for(b in l)if(l.hasOwnProperty(b)){var p,q=l[b];for(p in q)if(q.hasOwnProperty(p)){var r=q[p];q[p]=r.replace(j,"$1 "+k+'="'+p+'" ')}for(var s=f(q.join(""),g),t=0;t<s.length;++t){var u=s[t];u.hasAttribute&&u.hasAttribute(k)?(p=+u.getAttribute(k),u.removeAttribute(k),"production"!==c.env.NODE_ENV?i(!n.hasOwnProperty(p),"Danger: Assigning to an already-occupied result index."):i(!n.hasOwnProperty(p)),n[p]=u,o+=1):"production"!==c.env.NODE_ENV&&console.error("Danger: Discarding unexpected node:",u)}}return"production"!==c.env.NODE_ENV?i(o===n.length,"Danger: Did not assign to every index of resultList."):i(o===n.length),"production"!==c.env.NODE_ENV?i(n.length===a.length,"Danger: Expected markup to render %s nodes, but rendered %s.",a.length,n.length):i(n.length===a.length),n},dangerouslyReplaceNodeWithMarkup:function(a,b){"production"!==c.env.NODE_ENV?i(e.canUseDOM,"dangerouslyReplaceNodeWithMarkup(...): Cannot render markup in a worker thread. Make sure `window` and `document` are available globally before requiring React when unit testing or use React.renderToString for server rendering."):i(e.canUseDOM),"production"!==c.env.NODE_ENV?i(b,"dangerouslyReplaceNodeWithMarkup(...): Missing markup."):i(b),"production"!==c.env.NODE_ENV?i("html"!==a.tagName.toLowerCase(),"dangerouslyReplaceNodeWithMarkup(...): Cannot replace markup of the <html> node. This is because browser quirks make this unreliable and/or slow. If you want to render to the root you must use server rendering. See React.renderToString()."):i("html"!==a.tagName.toLowerCase());var d=f(b,g)[0];a.parentNode.replaceChild(d,a)}};b.exports=l}).call(this,a("_process"))},{"./ExecutionEnvironment":22,"./createNodesFromMarkup":114,"./emptyFunction":116,"./getMarkupWrap":129,"./invariant":137,_process:1}],14:[function(a,b,c){"use strict";var d=a("./keyOf"),e=[d({ResponderEventPlugin:null}),d({SimpleEventPlugin:null}),d({TapEventPlugin:null}),d({EnterLeaveEventPlugin:null}),d({ChangeEventPlugin:null}),d({SelectEventPlugin:null}),d({BeforeInputEventPlugin:null}),d({AnalyticsEventPlugin:null}),d({MobileSafariClickEventPlugin:null})];b.exports=e},{"./keyOf":143}],15:[function(a,b,c){"use strict";var d=a("./EventConstants"),e=a("./EventPropagators"),f=a("./SyntheticMouseEvent"),g=a("./ReactMount"),h=a("./keyOf"),i=d.topLevelTypes,j=g.getFirstReactDOM,k={mouseEnter:{registrationName:h({onMouseEnter:null}),dependencies:[i.topMouseOut,i.topMouseOver]},mouseLeave:{registrationName:h({onMouseLeave:null}),dependencies:[i.topMouseOut,i.topMouseOver]}},l=[null,null],m={eventTypes:k,extractEvents:function(a,b,c,d){if(a===i.topMouseOver&&(d.relatedTarget||d.fromElement))return null;if(a!==i.topMouseOut&&a!==i.topMouseOver)return null;var h;if(b.window===b)h=b;else{var m=b.ownerDocument;h=m?m.defaultView||m.parentWindow:window}var n,o;if(a===i.topMouseOut?(n=b,o=j(d.relatedTarget||d.toElement)||h):(n=h,o=b),n===o)return null;var p=n?g.getID(n):"",q=o?g.getID(o):"",r=f.getPooled(k.mouseLeave,p,d);r.type="mouseleave",r.target=n,r.relatedTarget=o;var s=f.getPooled(k.mouseEnter,q,d);return s.type="mouseenter",s.target=o,s.relatedTarget=n,e.accumulateEnterLeaveDispatches(r,s,p,q),l[0]=r,l[1]=s,l}};b.exports=m},{"./EventConstants":16,"./EventPropagators":21,"./ReactMount":72,"./SyntheticMouseEvent":101,"./keyOf":143}],16:[function(a,b,c){"use strict";var d=a("./keyMirror"),e=d({bubbled:null,captured:null}),f=d({topBlur:null,topChange:null,topClick:null,topCompositionEnd:null,topCompositionStart:null,topCompositionUpdate:null,topContextMenu:null,topCopy:null,topCut:null,topDoubleClick:null,topDrag:null,topDragEnd:null,topDragEnter:null,topDragExit:null,topDragLeave:null,topDragOver:null,topDragStart:null,topDrop:null,topError:null,topFocus:null,topInput:null,topKeyDown:null,topKeyPress:null,topKeyUp:null,topLoad:null,topMouseDown:null,topMouseMove:null,topMouseOut:null,topMouseOver:null,topMouseUp:null,topPaste:null,topReset:null,topScroll:null,topSelectionChange:null,topSubmit:null,topTextInput:null,topTouchCancel:null,topTouchEnd:null,topTouchMove:null,topTouchStart:null,topWheel:null}),g={topLevelTypes:f,PropagationPhases:e};b.exports=g},{"./keyMirror":142}],17:[function(a,b,c){(function(c){var d=a("./emptyFunction"),e={listen:function(a,b,c){return a.addEventListener?(a.addEventListener(b,c,!1),{remove:function(){a.removeEventListener(b,c,!1)}}):a.attachEvent?(a.attachEvent("on"+b,c),{remove:function(){a.detachEvent("on"+b,c)}}):void 0},capture:function(a,b,e){return a.addEventListener?(a.addEventListener(b,e,!0),{remove:function(){a.removeEventListener(b,e,!0)}}):("production"!==c.env.NODE_ENV&&console.error("Attempted to listen to events during the capture phase on a browser that does not support the capture phase. Your application will not receive some events."),{remove:d})},registerDefault:function(){}};b.exports=e}).call(this,a("_process"))},{"./emptyFunction":116,_process:1}],18:[function(a,b,c){(function(c){"use strict";function d(){var a=m&&m.traverseTwoPhase&&m.traverseEnterLeave;"production"!==c.env.NODE_ENV?i(a,"InstanceHandle not injected before use!"):i(a)}var e=a("./EventPluginRegistry"),f=a("./EventPluginUtils"),g=a("./accumulateInto"),h=a("./forEachAccumulated"),i=a("./invariant"),j={},k=null,l=function(a){if(a){var b=f.executeDispatch,c=e.getPluginModuleForEvent(a);c&&c.executeDispatch&&(b=c.executeDispatch),f.executeDispatchesInOrder(a,b),a.isPersistent()||a.constructor.release(a)}},m=null,n={injection:{injectMount:f.injection.injectMount,injectInstanceHandle:function(a){m=a,"production"!==c.env.NODE_ENV&&d()},getInstanceHandle:function(){return"production"!==c.env.NODE_ENV&&d(),m},injectEventPluginOrder:e.injectEventPluginOrder,injectEventPluginsByName:e.injectEventPluginsByName},eventNameDispatchConfigs:e.eventNameDispatchConfigs,registrationNameModules:e.registrationNameModules,putListener:function(a,b,d){"production"!==c.env.NODE_ENV?i(!d||"function"==typeof d,"Expected %s listener to be a function, instead got type %s",b,typeof d):i(!d||"function"==typeof d);var e=j[b]||(j[b]={});e[a]=d},getListener:function(a,b){var c=j[b];return c&&c[a]},deleteListener:function(a,b){var c=j[b];c&&delete c[a]},deleteAllListeners:function(a){for(var b in j)delete j[b][a]},extractEvents:function(a,b,c,d){for(var f,h=e.plugins,i=0,j=h.length;j>i;i++){var k=h[i];if(k){var l=k.extractEvents(a,b,c,d);l&&(f=g(f,l))}}return f},enqueueEvents:function(a){a&&(k=g(k,a))},processEventQueue:function(){var a=k;k=null,h(a,l),"production"!==c.env.NODE_ENV?i(!k,"processEventQueue(): Additional events were enqueued while processing an event queue. Support for this has not yet been implemented."):i(!k)},__purge:function(){j={}},__getListenerBank:function(){return j}};b.exports=n}).call(this,a("_process"))},{"./EventPluginRegistry":19,"./EventPluginUtils":20,"./accumulateInto":107,"./forEachAccumulated":122,"./invariant":137,_process:1}],19:[function(a,b,c){(function(c){"use strict";function d(){if(h)for(var a in i){var b=i[a],d=h.indexOf(a);if("production"!==c.env.NODE_ENV?g(d>-1,"EventPluginRegistry: Cannot inject event plugins that do not exist in the plugin ordering, `%s`.",a):g(d>-1),!j.plugins[d]){"production"!==c.env.NODE_ENV?g(b.extractEvents,"EventPluginRegistry: Event plugins must implement an `extractEvents` method, but `%s` does not.",a):g(b.extractEvents),j.plugins[d]=b;var f=b.eventTypes;for(var k in f)"production"!==c.env.NODE_ENV?g(e(f[k],b,k),"EventPluginRegistry: Failed to publish event `%s` for plugin `%s`.",k,a):g(e(f[k],b,k))}}}function e(a,b,d){"production"!==c.env.NODE_ENV?g(!j.eventNameDispatchConfigs.hasOwnProperty(d),"EventPluginHub: More than one plugin attempted to publish the same event name, `%s`.",d):g(!j.eventNameDispatchConfigs.hasOwnProperty(d)),j.eventNameDispatchConfigs[d]=a;var e=a.phasedRegistrationNames;if(e){for(var h in e)if(e.hasOwnProperty(h)){var i=e[h];f(i,b,d)}return!0}return a.registrationName?(f(a.registrationName,b,d),!0):!1}function f(a,b,d){"production"!==c.env.NODE_ENV?g(!j.registrationNameModules[a],"EventPluginHub: More than one plugin attempted to publish the same registration name, `%s`.",a):g(!j.registrationNameModules[a]),j.registrationNameModules[a]=b,j.registrationNameDependencies[a]=b.eventTypes[d].dependencies}var g=a("./invariant"),h=null,i={},j={plugins:[],eventNameDispatchConfigs:{},registrationNameModules:{},registrationNameDependencies:{},injectEventPluginOrder:function(a){"production"!==c.env.NODE_ENV?g(!h,"EventPluginRegistry: Cannot inject event plugin ordering more than once. You are likely trying to load more than one copy of React."):g(!h),h=Array.prototype.slice.call(a),d()},injectEventPluginsByName:function(a){var b=!1;for(var e in a)if(a.hasOwnProperty(e)){var f=a[e];i.hasOwnProperty(e)&&i[e]===f||("production"!==c.env.NODE_ENV?g(!i[e],"EventPluginRegistry: Cannot inject two different event plugins using the same name, `%s`.",e):g(!i[e]),i[e]=f,b=!0)}b&&d()},getPluginModuleForEvent:function(a){var b=a.dispatchConfig;if(b.registrationName)return j.registrationNameModules[b.registrationName]||null;for(var c in b.phasedRegistrationNames)if(b.phasedRegistrationNames.hasOwnProperty(c)){var d=j.registrationNameModules[b.phasedRegistrationNames[c]];if(d)return d}return null},_resetEventPlugins:function(){h=null;for(var a in i)i.hasOwnProperty(a)&&delete i[a];j.plugins.length=0;var b=j.eventNameDispatchConfigs;for(var c in b)b.hasOwnProperty(c)&&delete b[c];var d=j.registrationNameModules;for(var e in d)d.hasOwnProperty(e)&&delete d[e]}};b.exports=j}).call(this,a("_process"))},{"./invariant":137,_process:1}],20:[function(a,b,c){(function(c){"use strict";function d(a){return a===r.topMouseUp||a===r.topTouchEnd||a===r.topTouchCancel}function e(a){return a===r.topMouseMove||a===r.topTouchMove}function f(a){return a===r.topMouseDown||a===r.topTouchStart}function g(a,b){var d=a._dispatchListeners,e=a._dispatchIDs;if("production"!==c.env.NODE_ENV&&n(a),Array.isArray(d))for(var f=0;f<d.length&&!a.isPropagationStopped();f++)b(a,d[f],e[f]);else d&&b(a,d,e)}function h(a,b,c){a.currentTarget=q.Mount.getNode(c);var d=b(a,c);return a.currentTarget=null,d}function i(a,b){g(a,b),a._dispatchListeners=null,a._dispatchIDs=null}function j(a){var b=a._dispatchListeners,d=a._dispatchIDs;if("production"!==c.env.NODE_ENV&&n(a),Array.isArray(b)){for(var e=0;e<b.length&&!a.isPropagationStopped();e++)if(b[e](a,d[e]))return d[e]}else if(b&&b(a,d))return d;return null}function k(a){var b=j(a);return a._dispatchIDs=null,a._dispatchListeners=null,b}function l(a){"production"!==c.env.NODE_ENV&&n(a);var b=a._dispatchListeners,d=a._dispatchIDs;"production"!==c.env.NODE_ENV?p(!Array.isArray(b),"executeDirectDispatch(...): Invalid `event`."):p(!Array.isArray(b));var e=b?b(a,d):null;return a._dispatchListeners=null,a._dispatchIDs=null,e}function m(a){return!!a._dispatchListeners}var n,o=a("./EventConstants"),p=a("./invariant"),q={Mount:null,injectMount:function(a){q.Mount=a,"production"!==c.env.NODE_ENV&&("production"!==c.env.NODE_ENV?p(a&&a.getNode,"EventPluginUtils.injection.injectMount(...): Injected Mount module is missing getNode."):p(a&&a.getNode))}},r=o.topLevelTypes;"production"!==c.env.NODE_ENV&&(n=function(a){var b=a._dispatchListeners,d=a._dispatchIDs,e=Array.isArray(b),f=Array.isArray(d),g=f?d.length:d?1:0,h=e?b.length:b?1:0;"production"!==c.env.NODE_ENV?p(f===e&&g===h,"EventPluginUtils: Invalid `event`."):p(f===e&&g===h)});var s={isEndish:d,isMoveish:e,isStartish:f,executeDirectDispatch:l,executeDispatch:h,executeDispatchesInOrder:i,executeDispatchesInOrderStopAtTrue:k,hasDispatches:m,injection:q,useTouchEvents:!1};b.exports=s}).call(this,a("_process"))},{"./EventConstants":16,"./invariant":137,_process:1}],21:[function(a,b,c){(function(c){"use strict";function d(a,b,c){var d=b.dispatchConfig.phasedRegistrationNames[c];return q(a,d)}function e(a,b,e){if("production"!==c.env.NODE_ENV&&!a)throw new Error("Dispatching id must not be null");var f=b?p.bubbled:p.captured,g=d(a,e,f);g&&(e._dispatchListeners=n(e._dispatchListeners,g),e._dispatchIDs=n(e._dispatchIDs,a))}function f(a){a&&a.dispatchConfig.phasedRegistrationNames&&m.injection.getInstanceHandle().traverseTwoPhase(a.dispatchMarker,e,a)}function g(a,b,c){if(c&&c.dispatchConfig.registrationName){var d=c.dispatchConfig.registrationName,e=q(a,d);e&&(c._dispatchListeners=n(c._dispatchListeners,e),c._dispatchIDs=n(c._dispatchIDs,a))}}function h(a){a&&a.dispatchConfig.registrationName&&g(a.dispatchMarker,null,a)}function i(a){o(a,f)}function j(a,b,c,d){m.injection.getInstanceHandle().traverseEnterLeave(c,d,g,a,b)}function k(a){o(a,h)}var l=a("./EventConstants"),m=a("./EventPluginHub"),n=a("./accumulateInto"),o=a("./forEachAccumulated"),p=l.PropagationPhases,q=m.getListener,r={accumulateTwoPhaseDispatches:i,accumulateDirectDispatches:k,accumulateEnterLeaveDispatches:j};b.exports=r}).call(this,a("_process"))},{"./EventConstants":16,"./EventPluginHub":18,"./accumulateInto":107,"./forEachAccumulated":122,_process:1}],22:[function(a,b,c){"use strict";var d=!("undefined"==typeof window||!window.document||!window.document.createElement),e={canUseDOM:d,canUseWorkers:"undefined"!=typeof Worker,canUseEventListeners:d&&!(!window.addEventListener&&!window.attachEvent),canUseViewport:d&&!!window.screen,isInWorker:!d};b.exports=e},{}],23:[function(a,b,c){"use strict";function d(a){this._root=a,this._startText=this.getText(),this._fallbackText=null}var e=a("./PooledClass"),f=a("./Object.assign"),g=a("./getTextContentAccessor");f(d.prototype,{getText:function(){return"value"in this._root?this._root.value:this._root[g()]},getData:function(){if(this._fallbackText)return this._fallbackText;var a,b,c=this._startText,d=c.length,e=this.getText(),f=e.length;for(a=0;d>a&&c[a]===e[a];a++);var g=d-a;for(b=1;g>=b&&c[d-b]===e[f-b];b++);var h=b>1?1-b:void 0;return this._fallbackText=e.slice(a,h),this._fallbackText}}),e.addPoolingTo(d),b.exports=d},{"./Object.assign":28,"./PooledClass":29,"./getTextContentAccessor":132}],24:[function(a,b,c){"use strict";var d,e=a("./DOMProperty"),f=a("./ExecutionEnvironment"),g=e.injection.MUST_USE_ATTRIBUTE,h=e.injection.MUST_USE_PROPERTY,i=e.injection.HAS_BOOLEAN_VALUE,j=e.injection.HAS_SIDE_EFFECTS,k=e.injection.HAS_NUMERIC_VALUE,l=e.injection.HAS_POSITIVE_NUMERIC_VALUE,m=e.injection.HAS_OVERLOADED_BOOLEAN_VALUE;if(f.canUseDOM){var n=document.implementation;d=n&&n.hasFeature&&n.hasFeature("http://www.w3.org/TR/SVG11/feature#BasicStructure","1.1")}var o={isCustomAttribute:RegExp.prototype.test.bind(/^(data|aria)-[a-z_][a-z\d_.\-]*$/),Properties:{accept:null,acceptCharset:null,accessKey:null,action:null,allowFullScreen:g|i,allowTransparency:g,alt:null,async:i,autoComplete:null,autoPlay:i,cellPadding:null,cellSpacing:null,charSet:g,checked:h|i,classID:g,className:d?g:h,cols:g|l,colSpan:null,content:null,contentEditable:null,contextMenu:g,controls:h|i,coords:null,crossOrigin:null,data:null,dateTime:g,defer:i,dir:null,disabled:g|i,download:m,draggable:null,encType:null,form:g,formAction:g,formEncType:g,formMethod:g,formNoValidate:i,formTarget:g,frameBorder:g,headers:null,height:g,hidden:g|i,high:null,href:null,hrefLang:null,htmlFor:null,httpEquiv:null,icon:null,id:h,label:null,lang:null,list:g,loop:h|i,low:null,manifest:g,marginHeight:null,marginWidth:null,max:null,maxLength:g,media:g,mediaGroup:null,method:null,min:null,multiple:h|i,muted:h|i,name:null,noValidate:i,open:i,optimum:null,pattern:null,placeholder:null,poster:null,preload:null,radioGroup:null,readOnly:h|i,rel:null,required:i,role:g,rows:g|l,rowSpan:null,sandbox:null,scope:null,scoped:i,scrolling:null,seamless:g|i,selected:h|i,shape:null,size:g|l,sizes:g,span:l,spellCheck:null,src:null,srcDoc:h,srcSet:g,start:k,step:null,style:null,tabIndex:null,target:null,title:null,type:null,useMap:null,value:h|j,width:g,wmode:g,autoCapitalize:null,autoCorrect:null,itemProp:g,itemScope:g|i,itemType:g,itemID:g,itemRef:g,property:null,unselectable:g},DOMAttributeNames:{acceptCharset:"accept-charset",className:"class",htmlFor:"for",httpEquiv:"http-equiv"},DOMPropertyNames:{autoCapitalize:"autocapitalize",autoComplete:"autocomplete",autoCorrect:"autocorrect",autoFocus:"autofocus",autoPlay:"autoplay",encType:"encoding",hrefLang:"hreflang",radioGroup:"radiogroup",spellCheck:"spellcheck",srcDoc:"srcdoc",srcSet:"srcset"}};b.exports=o},{"./DOMProperty":11,"./ExecutionEnvironment":22}],25:[function(a,b,c){(function(c){"use strict";function d(a){"production"!==c.env.NODE_ENV?j(null==a.props.checkedLink||null==a.props.valueLink,"Cannot provide a checkedLink and a valueLink. If you want to use checkedLink, you probably don't want to use valueLink and vice versa."):j(null==a.props.checkedLink||null==a.props.valueLink)}function e(a){d(a),"production"!==c.env.NODE_ENV?j(null==a.props.value&&null==a.props.onChange,"Cannot provide a valueLink and a value or onChange event. If you want to use value or onChange, you probably don't want to use valueLink."):j(null==a.props.value&&null==a.props.onChange)}function f(a){d(a),"production"!==c.env.NODE_ENV?j(null==a.props.checked&&null==a.props.onChange,"Cannot provide a checkedLink and a checked property or onChange event. If you want to use checked or onChange, you probably don't want to use checkedLink"):j(null==a.props.checked&&null==a.props.onChange)}function g(a){this.props.valueLink.requestChange(a.target.value)}function h(a){this.props.checkedLink.requestChange(a.target.checked)}var i=a("./ReactPropTypes"),j=a("./invariant"),k={button:!0,checkbox:!0,image:!0,hidden:!0,radio:!0,reset:!0,submit:!0},l={Mixin:{propTypes:{value:function(a,b,c){return!a[b]||k[a.type]||a.onChange||a.readOnly||a.disabled?null:new Error("You provided a `value` prop to a form field without an `onChange` handler. This will render a read-only field. If the field should be mutable use `defaultValue`. Otherwise, set either `onChange` or `readOnly`.")},checked:function(a,b,c){return!a[b]||a.onChange||a.readOnly||a.disabled?null:new Error("You provided a `checked` prop to a form field without an `onChange` handler. This will render a read-only field. If the field should be mutable use `defaultChecked`. Otherwise, set either `onChange` or `readOnly`.")},onChange:i.func}},getValue:function(a){return a.props.valueLink?(e(a),a.props.valueLink.value):a.props.value},getChecked:function(a){return a.props.checkedLink?(f(a),a.props.checkedLink.value):a.props.checked},getOnChange:function(a){return a.props.valueLink?(e(a),g):a.props.checkedLink?(f(a),h):a.props.onChange}};b.exports=l}).call(this,a("_process"))},{"./ReactPropTypes":80,"./invariant":137,_process:1}],26:[function(a,b,c){(function(c){"use strict";function d(a){a.remove()}var e=a("./ReactBrowserEventEmitter"),f=a("./accumulateInto"),g=a("./forEachAccumulated"),h=a("./invariant"),i={trapBubbledEvent:function(a,b){"production"!==c.env.NODE_ENV?h(this.isMounted(),"Must be mounted to trap events"):h(this.isMounted());var d=this.getDOMNode();"production"!==c.env.NODE_ENV?h(d,"LocalEventTrapMixin.trapBubbledEvent(...): Requires node to be rendered."):h(d);var g=e.trapBubbledEvent(a,b,d);this._localEventListeners=f(this._localEventListeners,g)},componentWillUnmount:function(){this._localEventListeners&&g(this._localEventListeners,d)}};b.exports=i}).call(this,a("_process"))},{"./ReactBrowserEventEmitter":32,"./accumulateInto":107,"./forEachAccumulated":122,"./invariant":137,_process:1}],27:[function(a,b,c){"use strict";var d=a("./EventConstants"),e=a("./emptyFunction"),f=d.topLevelTypes,g={eventTypes:null,extractEvents:function(a,b,c,d){if(a===f.topTouchStart){var g=d.target;g&&!g.onclick&&(g.onclick=e)}}};b.exports=g},{"./EventConstants":16,"./emptyFunction":116}],28:[function(a,b,c){"use strict";function d(a,b){if(null==a)throw new TypeError("Object.assign target cannot be null or undefined");for(var c=Object(a),d=Object.prototype.hasOwnProperty,e=1;e<arguments.length;e++){var f=arguments[e];if(null!=f){var g=Object(f);for(var h in g)d.call(g,h)&&(c[h]=g[h])}}return c}b.exports=d},{}],29:[function(a,b,c){(function(c){"use strict";var d=a("./invariant"),e=function(a){var b=this;if(b.instancePool.length){var c=b.instancePool.pop();return b.call(c,a),c}return new b(a)},f=function(a,b){var c=this;if(c.instancePool.length){var d=c.instancePool.pop();return c.call(d,a,b),d}return new c(a,b)},g=function(a,b,c){var d=this;if(d.instancePool.length){var e=d.instancePool.pop();return d.call(e,a,b,c),e}return new d(a,b,c)},h=function(a,b,c,d,e){var f=this;if(f.instancePool.length){var g=f.instancePool.pop();return f.call(g,a,b,c,d,e),g}return new f(a,b,c,d,e)},i=function(a){var b=this;"production"!==c.env.NODE_ENV?d(a instanceof b,"Trying to release an instance into a pool of a different type."):d(a instanceof b),a.destructor&&a.destructor(),b.instancePool.length<b.poolSize&&b.instancePool.push(a)},j=10,k=e,l=function(a,b){var c=a;return c.instancePool=[],c.getPooled=b||k,c.poolSize||(c.poolSize=j),c.release=i,c},m={addPoolingTo:l,oneArgumentPooler:e,twoArgumentPooler:f,threeArgumentPooler:g,fiveArgumentPooler:h};b.exports=m}).call(this,a("_process"))},{"./invariant":137,_process:1}],30:[function(a,b,c){(function(c){"use strict";var d=a("./EventPluginUtils"),e=a("./ReactChildren"),f=a("./ReactComponent"),g=a("./ReactClass"),h=a("./ReactContext"),i=a("./ReactCurrentOwner"),j=a("./ReactElement"),k=a("./ReactElementValidator"),l=a("./ReactDOM"),m=a("./ReactDOMTextComponent"),n=a("./ReactDefaultInjection"),o=a("./ReactInstanceHandles"),p=a("./ReactMount"),q=a("./ReactPerf"),r=a("./ReactPropTypes"),s=a("./ReactReconciler"),t=a("./ReactServerRendering"),u=a("./Object.assign"),v=a("./findDOMNode"),w=a("./onlyChild");n.inject();var x=j.createElement,y=j.createFactory,z=j.cloneElement;"production"!==c.env.NODE_ENV&&(x=k.createElement,y=k.createFactory,z=k.cloneElement);var A=q.measure("React","render",p.render),B={Children:{map:e.map,forEach:e.forEach,count:e.count,only:w},Component:f,DOM:l,PropTypes:r,initializeTouchEvents:function(a){d.useTouchEvents=a},createClass:g.createClass,createElement:x,cloneElement:z,createFactory:y,createMixin:function(a){return a},constructAndRenderComponent:p.constructAndRenderComponent,constructAndRenderComponentByID:p.constructAndRenderComponentByID,findDOMNode:v,render:A,renderToString:t.renderToString,renderToStaticMarkup:t.renderToStaticMarkup,unmountComponentAtNode:p.unmountComponentAtNode,isValidElement:j.isValidElement,withContext:h.withContext,__spread:u};if("undefined"!=typeof __REACT_DEVTOOLS_GLOBAL_HOOK__&&"function"==typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.inject&&__REACT_DEVTOOLS_GLOBAL_HOOK__.inject({CurrentOwner:i,InstanceHandles:o,Mount:p,Reconciler:s,TextComponent:m}),"production"!==c.env.NODE_ENV){var C=a("./ExecutionEnvironment");if(C.canUseDOM&&window.top===window.self){navigator.userAgent.indexOf("Chrome")>-1&&"undefined"==typeof __REACT_DEVTOOLS_GLOBAL_HOOK__&&console.debug("Download the React DevTools for a better development experience: https://fb.me/react-devtools");for(var D=[Array.isArray,Array.prototype.every,Array.prototype.forEach,Array.prototype.indexOf,Array.prototype.map,Date.now,Function.prototype.bind,Object.keys,String.prototype.split,String.prototype.trim,Object.create,Object.freeze],E=0;E<D.length;E++)if(!D[E]){console.error("One or more ES5 shim/shams expected by React are not available: https://fb.me/react-warning-polyfills");break}}}B.version="0.13.3",b.exports=B}).call(this,a("_process"))},{"./EventPluginUtils":20,"./ExecutionEnvironment":22,"./Object.assign":28,"./ReactChildren":34,"./ReactClass":35,"./ReactComponent":36,"./ReactContext":40,"./ReactCurrentOwner":41,"./ReactDOM":42,"./ReactDOMTextComponent":53,"./ReactDefaultInjection":56,"./ReactElement":59,"./ReactElementValidator":60,"./ReactInstanceHandles":68,"./ReactMount":72,"./ReactPerf":77,"./ReactPropTypes":80,"./ReactReconciler":83,"./ReactServerRendering":86,"./findDOMNode":119,"./onlyChild":146,_process:1}],31:[function(a,b,c){"use strict";var d=a("./findDOMNode"),e={getDOMNode:function(){return d(this)}};b.exports=e},{"./findDOMNode":119}],32:[function(a,b,c){"use strict";function d(a){return Object.prototype.hasOwnProperty.call(a,p)||(a[p]=n++,l[a[p]]={}),l[a[p]]}var e=a("./EventConstants"),f=a("./EventPluginHub"),g=a("./EventPluginRegistry"),h=a("./ReactEventEmitterMixin"),i=a("./ViewportMetrics"),j=a("./Object.assign"),k=a("./isEventSupported"),l={},m=!1,n=0,o={topBlur:"blur",topChange:"change",topClick:"click",topCompositionEnd:"compositionend",topCompositionStart:"compositionstart",topCompositionUpdate:"compositionupdate",topContextMenu:"contextmenu",topCopy:"copy",topCut:"cut",topDoubleClick:"dblclick",topDrag:"drag",topDragEnd:"dragend",topDragEnter:"dragenter",topDragExit:"dragexit",topDragLeave:"dragleave",topDragOver:"dragover",topDragStart:"dragstart",topDrop:"drop",topFocus:"focus",topInput:"input",topKeyDown:"keydown",topKeyPress:"keypress",topKeyUp:"keyup",topMouseDown:"mousedown",topMouseMove:"mousemove",topMouseOut:"mouseout",topMouseOver:"mouseover",topMouseUp:"mouseup",topPaste:"paste",topScroll:"scroll",topSelectionChange:"selectionchange",topTextInput:"textInput",topTouchCancel:"touchcancel",topTouchEnd:"touchend",topTouchMove:"touchmove",topTouchStart:"touchstart",topWheel:"wheel"},p="_reactListenersID"+String(Math.random()).slice(2),q=j({},h,{ReactEventListener:null,injection:{injectReactEventListener:function(a){a.setHandleTopLevel(q.handleTopLevel),q.ReactEventListener=a}},setEnabled:function(a){q.ReactEventListener&&q.ReactEventListener.setEnabled(a)},isEnabled:function(){return!(!q.ReactEventListener||!q.ReactEventListener.isEnabled())},listenTo:function(a,b){for(var c=b,f=d(c),h=g.registrationNameDependencies[a],i=e.topLevelTypes,j=0,l=h.length;l>j;j++){var m=h[j];f.hasOwnProperty(m)&&f[m]||(m===i.topWheel?k("wheel")?q.ReactEventListener.trapBubbledEvent(i.topWheel,"wheel",c):k("mousewheel")?q.ReactEventListener.trapBubbledEvent(i.topWheel,"mousewheel",c):q.ReactEventListener.trapBubbledEvent(i.topWheel,"DOMMouseScroll",c):m===i.topScroll?k("scroll",!0)?q.ReactEventListener.trapCapturedEvent(i.topScroll,"scroll",c):q.ReactEventListener.trapBubbledEvent(i.topScroll,"scroll",q.ReactEventListener.WINDOW_HANDLE):m===i.topFocus||m===i.topBlur?(k("focus",!0)?(q.ReactEventListener.trapCapturedEvent(i.topFocus,"focus",c),q.ReactEventListener.trapCapturedEvent(i.topBlur,"blur",c)):k("focusin")&&(q.ReactEventListener.trapBubbledEvent(i.topFocus,"focusin",c),q.ReactEventListener.trapBubbledEvent(i.topBlur,"focusout",c)),f[i.topBlur]=!0,f[i.topFocus]=!0):o.hasOwnProperty(m)&&q.ReactEventListener.trapBubbledEvent(m,o[m],c),f[m]=!0)}},trapBubbledEvent:function(a,b,c){return q.ReactEventListener.trapBubbledEvent(a,b,c);
},trapCapturedEvent:function(a,b,c){return q.ReactEventListener.trapCapturedEvent(a,b,c)},ensureScrollValueMonitoring:function(){if(!m){var a=i.refreshScrollValues;q.ReactEventListener.monitorScrollValue(a),m=!0}},eventNameDispatchConfigs:f.eventNameDispatchConfigs,registrationNameModules:f.registrationNameModules,putListener:f.putListener,getListener:f.getListener,deleteListener:f.deleteListener,deleteAllListeners:f.deleteAllListeners});b.exports=q},{"./EventConstants":16,"./EventPluginHub":18,"./EventPluginRegistry":19,"./Object.assign":28,"./ReactEventEmitterMixin":63,"./ViewportMetrics":106,"./isEventSupported":138}],33:[function(a,b,c){"use strict";var d=a("./ReactReconciler"),e=a("./flattenChildren"),f=a("./instantiateReactComponent"),g=a("./shouldUpdateReactComponent"),h={instantiateChildren:function(a,b,c){var d=e(a);for(var g in d)if(d.hasOwnProperty(g)){var h=d[g],i=f(h,null);d[g]=i}return d},updateChildren:function(a,b,c,h){var i=e(b);if(!i&&!a)return null;var j;for(j in i)if(i.hasOwnProperty(j)){var k=a&&a[j],l=k&&k._currentElement,m=i[j];if(g(l,m))d.receiveComponent(k,m,c,h),i[j]=k;else{k&&d.unmountComponent(k,j);var n=f(m,null);i[j]=n}}for(j in a)!a.hasOwnProperty(j)||i&&i.hasOwnProperty(j)||d.unmountComponent(a[j]);return i},unmountChildren:function(a){for(var b in a){var c=a[b];d.unmountComponent(c)}}};b.exports=h},{"./ReactReconciler":83,"./flattenChildren":120,"./instantiateReactComponent":136,"./shouldUpdateReactComponent":153}],34:[function(a,b,c){(function(c){"use strict";function d(a,b){this.forEachFunction=a,this.forEachContext=b}function e(a,b,c,d){var e=a;e.forEachFunction.call(e.forEachContext,b,d)}function f(a,b,c){if(null==a)return a;var f=d.getPooled(b,c);n(a,e,f),d.release(f)}function g(a,b,c){this.mapResult=a,this.mapFunction=b,this.mapContext=c}function h(a,b,d,e){var f=a,g=f.mapResult,h=!g.hasOwnProperty(d);if("production"!==c.env.NODE_ENV&&("production"!==c.env.NODE_ENV?o(h,"ReactChildren.map(...): Encountered two children with the same key, `%s`. Child keys must be unique; when two children share a key, only the first child will be used.",d):null),h){var i=f.mapFunction.call(f.mapContext,b,e);g[d]=i}}function i(a,b,c){if(null==a)return a;var d={},e=g.getPooled(d,b,c);return n(a,h,e),g.release(e),m.create(d)}function j(a,b,c,d){return null}function k(a,b){return n(a,j,null)}var l=a("./PooledClass"),m=a("./ReactFragment"),n=a("./traverseAllChildren"),o=a("./warning"),p=l.twoArgumentPooler,q=l.threeArgumentPooler;l.addPoolingTo(d,p),l.addPoolingTo(g,q);var r={forEach:f,map:i,count:k};b.exports=r}).call(this,a("_process"))},{"./PooledClass":29,"./ReactFragment":65,"./traverseAllChildren":155,"./warning":156,_process:1}],35:[function(a,b,c){(function(c){"use strict";function d(a,b,d){for(var e in b)b.hasOwnProperty(e)&&("production"!==c.env.NODE_ENV?z("function"==typeof b[e],"%s: %s type `%s` is invalid; it must be a function, usually from React.PropTypes.",a.displayName||"ReactClass",t[d],e):null)}function e(a,b){var d=D.hasOwnProperty(b)?D[b]:null;G.hasOwnProperty(b)&&("production"!==c.env.NODE_ENV?w(d===B.OVERRIDE_BASE,"ReactClassInterface: You are attempting to override `%s` from your class specification. Ensure that your method names do not overlap with React methods.",b):w(d===B.OVERRIDE_BASE)),a.hasOwnProperty(b)&&("production"!==c.env.NODE_ENV?w(d===B.DEFINE_MANY||d===B.DEFINE_MANY_MERGED,"ReactClassInterface: You are attempting to define `%s` on your component more than once. This conflict may be due to a mixin.",b):w(d===B.DEFINE_MANY||d===B.DEFINE_MANY_MERGED))}function f(a,b){if(b){"production"!==c.env.NODE_ENV?w("function"!=typeof b,"ReactClass: You're attempting to use a component class as a mixin. Instead, just use a regular object."):w("function"!=typeof b),"production"!==c.env.NODE_ENV?w(!o.isValidElement(b),"ReactClass: You're attempting to use a component as a mixin. Instead, just use a regular object."):w(!o.isValidElement(b));var d=a.prototype;b.hasOwnProperty(A)&&E.mixins(a,b.mixins);for(var f in b)if(b.hasOwnProperty(f)&&f!==A){var g=b[f];if(e(d,f),E.hasOwnProperty(f))E[f](a,g);else{var h=D.hasOwnProperty(f),k=d.hasOwnProperty(f),l=g&&g.__reactDontBind,m="function"==typeof g,n=m&&!h&&!k&&!l;if(n)d.__reactAutoBindMap||(d.__reactAutoBindMap={}),d.__reactAutoBindMap[f]=g,d[f]=g;else if(k){var p=D[f];"production"!==c.env.NODE_ENV?w(h&&(p===B.DEFINE_MANY_MERGED||p===B.DEFINE_MANY),"ReactClass: Unexpected spec policy %s for key %s when mixing in component specs.",p,f):w(h&&(p===B.DEFINE_MANY_MERGED||p===B.DEFINE_MANY)),p===B.DEFINE_MANY_MERGED?d[f]=i(d[f],g):p===B.DEFINE_MANY&&(d[f]=j(d[f],g))}else d[f]=g,"production"!==c.env.NODE_ENV&&"function"==typeof g&&b.displayName&&(d[f].displayName=b.displayName+"_"+f)}}}}function g(a,b){if(b)for(var d in b){var e=b[d];if(b.hasOwnProperty(d)){var f=d in E;"production"!==c.env.NODE_ENV?w(!f,'ReactClass: You are attempting to define a reserved property, `%s`, that shouldn\'t be on the "statics" key. Define it as an instance property instead; it will still be accessible on the constructor.',d):w(!f);var g=d in a;"production"!==c.env.NODE_ENV?w(!g,"ReactClass: You are attempting to define `%s` on your component more than once. This conflict may be due to a mixin.",d):w(!g),a[d]=e}}}function h(a,b){"production"!==c.env.NODE_ENV?w(a&&b&&"object"==typeof a&&"object"==typeof b,"mergeIntoWithNoDuplicateKeys(): Cannot merge non-objects."):w(a&&b&&"object"==typeof a&&"object"==typeof b);for(var d in b)b.hasOwnProperty(d)&&("production"!==c.env.NODE_ENV?w(void 0===a[d],"mergeIntoWithNoDuplicateKeys(): Tried to merge two objects with the same key: `%s`. This conflict may be due to a mixin; in particular, this may be caused by two getInitialState() or getDefaultProps() methods returning objects with clashing keys.",d):w(void 0===a[d]),a[d]=b[d]);return a}function i(a,b){return function(){var c=a.apply(this,arguments),d=b.apply(this,arguments);if(null==c)return d;if(null==d)return c;var e={};return h(e,c),h(e,d),e}}function j(a,b){return function(){a.apply(this,arguments),b.apply(this,arguments)}}function k(a,b){var d=b.bind(a);if("production"!==c.env.NODE_ENV){d.__reactBoundContext=a,d.__reactBoundMethod=b,d.__reactBoundArguments=null;var e=a.constructor.displayName,f=d.bind;d.bind=function(g){for(var h=[],i=1,j=arguments.length;j>i;i++)h.push(arguments[i]);if(g!==a&&null!==g)"production"!==c.env.NODE_ENV?z(!1,"bind(): React component methods may only be bound to the component instance. See %s",e):null;else if(!h.length)return"production"!==c.env.NODE_ENV?z(!1,"bind(): You are binding a component method to the component. React does this for you automatically in a high-performance way, so you can safely remove this call. See %s",e):null,d;var k=f.apply(d,arguments);return k.__reactBoundContext=a,k.__reactBoundMethod=b,k.__reactBoundArguments=h,k}}return d}function l(a){for(var b in a.__reactAutoBindMap)if(a.__reactAutoBindMap.hasOwnProperty(b)){var c=a.__reactAutoBindMap[b];a[b]=k(a,p.guard(c,a.constructor.displayName+"."+b))}}var m=a("./ReactComponent"),n=a("./ReactCurrentOwner"),o=a("./ReactElement"),p=a("./ReactErrorUtils"),q=a("./ReactInstanceMap"),r=a("./ReactLifeCycle"),s=a("./ReactPropTypeLocations"),t=a("./ReactPropTypeLocationNames"),u=a("./ReactUpdateQueue"),v=a("./Object.assign"),w=a("./invariant"),x=a("./keyMirror"),y=a("./keyOf"),z=a("./warning"),A=y({mixins:null}),B=x({DEFINE_ONCE:null,DEFINE_MANY:null,OVERRIDE_BASE:null,DEFINE_MANY_MERGED:null}),C=[],D={mixins:B.DEFINE_MANY,statics:B.DEFINE_MANY,propTypes:B.DEFINE_MANY,contextTypes:B.DEFINE_MANY,childContextTypes:B.DEFINE_MANY,getDefaultProps:B.DEFINE_MANY_MERGED,getInitialState:B.DEFINE_MANY_MERGED,getChildContext:B.DEFINE_MANY_MERGED,render:B.DEFINE_ONCE,componentWillMount:B.DEFINE_MANY,componentDidMount:B.DEFINE_MANY,componentWillReceiveProps:B.DEFINE_MANY,shouldComponentUpdate:B.DEFINE_ONCE,componentWillUpdate:B.DEFINE_MANY,componentDidUpdate:B.DEFINE_MANY,componentWillUnmount:B.DEFINE_MANY,updateComponent:B.OVERRIDE_BASE},E={displayName:function(a,b){a.displayName=b},mixins:function(a,b){if(b)for(var c=0;c<b.length;c++)f(a,b[c])},childContextTypes:function(a,b){"production"!==c.env.NODE_ENV&&d(a,b,s.childContext),a.childContextTypes=v({},a.childContextTypes,b)},contextTypes:function(a,b){"production"!==c.env.NODE_ENV&&d(a,b,s.context),a.contextTypes=v({},a.contextTypes,b)},getDefaultProps:function(a,b){a.getDefaultProps?a.getDefaultProps=i(a.getDefaultProps,b):a.getDefaultProps=b},propTypes:function(a,b){"production"!==c.env.NODE_ENV&&d(a,b,s.prop),a.propTypes=v({},a.propTypes,b)},statics:function(a,b){g(a,b)}},F={enumerable:!1,get:function(){var a=this.displayName||this.name||"Component";return"production"!==c.env.NODE_ENV?z(!1,"%s.type is deprecated. Use %s directly to access the class.",a,a):null,Object.defineProperty(this,"type",{value:this}),this}},G={replaceState:function(a,b){u.enqueueReplaceState(this,a),b&&u.enqueueCallback(this,b)},isMounted:function(){if("production"!==c.env.NODE_ENV){var a=n.current;null!==a&&("production"!==c.env.NODE_ENV?z(a._warnedAboutRefsInRender,"%s is accessing isMounted inside its render() function. render() should be a pure function of props and state. It should never access something that requires stale data from the previous render, such as refs. Move this logic to componentDidMount and componentDidUpdate instead.",a.getName()||"A component"):null,a._warnedAboutRefsInRender=!0)}var b=q.get(this);return b&&b!==r.currentlyMountingInstance},setProps:function(a,b){u.enqueueSetProps(this,a),b&&u.enqueueCallback(this,b)},replaceProps:function(a,b){u.enqueueReplaceProps(this,a),b&&u.enqueueCallback(this,b)}},H=function(){};v(H.prototype,m.prototype,G);var I={createClass:function(a){var b=function(a,d){"production"!==c.env.NODE_ENV&&("production"!==c.env.NODE_ENV?z(this instanceof b,"Something is calling a React component directly. Use a factory or JSX instead. See: https://fb.me/react-legacyfactory"):null),this.__reactAutoBindMap&&l(this),this.props=a,this.context=d,this.state=null;var e=this.getInitialState?this.getInitialState():null;"production"!==c.env.NODE_ENV&&"undefined"==typeof e&&this.getInitialState._isMockFunction&&(e=null),"production"!==c.env.NODE_ENV?w("object"==typeof e&&!Array.isArray(e),"%s.getInitialState(): must return an object or null",b.displayName||"ReactCompositeComponent"):w("object"==typeof e&&!Array.isArray(e)),this.state=e};b.prototype=new H,b.prototype.constructor=b,C.forEach(f.bind(null,b)),f(b,a),b.getDefaultProps&&(b.defaultProps=b.getDefaultProps()),"production"!==c.env.NODE_ENV&&(b.getDefaultProps&&(b.getDefaultProps.isReactClassApproved={}),b.prototype.getInitialState&&(b.prototype.getInitialState.isReactClassApproved={})),"production"!==c.env.NODE_ENV?w(b.prototype.render,"createClass(...): Class specification must implement a `render` method."):w(b.prototype.render),"production"!==c.env.NODE_ENV&&("production"!==c.env.NODE_ENV?z(!b.prototype.componentShouldUpdate,"%s has a method called componentShouldUpdate(). Did you mean shouldComponentUpdate()? The name is phrased as a question because the function is expected to return a value.",a.displayName||"A component"):null);for(var d in D)b.prototype[d]||(b.prototype[d]=null);if(b.type=b,"production"!==c.env.NODE_ENV)try{Object.defineProperty(b,"type",F)}catch(e){}return b},injection:{injectMixin:function(a){C.push(a)}}};b.exports=I}).call(this,a("_process"))},{"./Object.assign":28,"./ReactComponent":36,"./ReactCurrentOwner":41,"./ReactElement":59,"./ReactErrorUtils":62,"./ReactInstanceMap":69,"./ReactLifeCycle":70,"./ReactPropTypeLocationNames":78,"./ReactPropTypeLocations":79,"./ReactUpdateQueue":88,"./invariant":137,"./keyMirror":142,"./keyOf":143,"./warning":156,_process:1}],36:[function(a,b,c){(function(c){"use strict";function d(a,b){this.props=a,this.context=b}var e=a("./ReactUpdateQueue"),f=a("./invariant"),g=a("./warning");if(d.prototype.setState=function(a,b){"production"!==c.env.NODE_ENV?f("object"==typeof a||"function"==typeof a||null==a,"setState(...): takes an object of state variables to update or a function which returns an object of state variables."):f("object"==typeof a||"function"==typeof a||null==a),"production"!==c.env.NODE_ENV&&("production"!==c.env.NODE_ENV?g(null!=a,"setState(...): You passed an undefined or null state object; instead, use forceUpdate()."):null),e.enqueueSetState(this,a),b&&e.enqueueCallback(this,b)},d.prototype.forceUpdate=function(a){e.enqueueForceUpdate(this),a&&e.enqueueCallback(this,a)},"production"!==c.env.NODE_ENV){var h={getDOMNode:["getDOMNode","Use React.findDOMNode(component) instead."],isMounted:["isMounted","Instead, make sure to clean up subscriptions and pending requests in componentWillUnmount to prevent memory leaks."],replaceProps:["replaceProps","Instead, call React.render again at the top level."],replaceState:["replaceState","Refactor your code to use setState instead (see https://github.com/facebook/react/issues/3236)."],setProps:["setProps","Instead, call React.render again at the top level."]},i=function(a,b){try{Object.defineProperty(d.prototype,a,{get:function(){return void("production"!==c.env.NODE_ENV?g(!1,"%s(...) is deprecated in plain JavaScript React classes. %s",b[0],b[1]):null)}})}catch(e){}};for(var j in h)h.hasOwnProperty(j)&&i(j,h[j])}b.exports=d}).call(this,a("_process"))},{"./ReactUpdateQueue":88,"./invariant":137,"./warning":156,_process:1}],37:[function(a,b,c){"use strict";var d=a("./ReactDOMIDOperations"),e=a("./ReactMount"),f={processChildrenUpdates:d.dangerouslyProcessChildrenUpdates,replaceNodeWithMarkupByID:d.dangerouslyReplaceNodeWithMarkupByID,unmountIDFromEnvironment:function(a){e.purgeID(a)}};b.exports=f},{"./ReactDOMIDOperations":46,"./ReactMount":72}],38:[function(a,b,c){(function(c){"use strict";var d=a("./invariant"),e=!1,f={unmountIDFromEnvironment:null,replaceNodeWithMarkupByID:null,processChildrenUpdates:null,injection:{injectEnvironment:function(a){"production"!==c.env.NODE_ENV?d(!e,"ReactCompositeComponent: injectEnvironment() can only be called once."):d(!e),f.unmountIDFromEnvironment=a.unmountIDFromEnvironment,f.replaceNodeWithMarkupByID=a.replaceNodeWithMarkupByID,f.processChildrenUpdates=a.processChildrenUpdates,e=!0}}};b.exports=f}).call(this,a("_process"))},{"./invariant":137,_process:1}],39:[function(a,b,c){(function(c){"use strict";function d(a){var b=a._currentElement._owner||null;if(b){var c=b.getName();if(c)return" Check the render method of `"+c+"`."}return""}var e=a("./ReactComponentEnvironment"),f=a("./ReactContext"),g=a("./ReactCurrentOwner"),h=a("./ReactElement"),i=a("./ReactElementValidator"),j=a("./ReactInstanceMap"),k=a("./ReactLifeCycle"),l=a("./ReactNativeComponent"),m=a("./ReactPerf"),n=a("./ReactPropTypeLocations"),o=a("./ReactPropTypeLocationNames"),p=a("./ReactReconciler"),q=a("./ReactUpdates"),r=a("./Object.assign"),s=a("./emptyObject"),t=a("./invariant"),u=a("./shouldUpdateReactComponent"),v=a("./warning"),w=1,x={construct:function(a){this._currentElement=a,this._rootNodeID=null,this._instance=null,this._pendingElement=null,this._pendingStateQueue=null,this._pendingReplaceState=!1,this._pendingForceUpdate=!1,this._renderedComponent=null,this._context=null,this._mountOrder=0,this._isTopLevel=!1,this._pendingCallbacks=null},mountComponent:function(a,b,d){this._context=d,this._mountOrder=w++,this._rootNodeID=a;var e=this._processProps(this._currentElement.props),f=this._processContext(this._currentElement._context),g=l.getComponentClassForElement(this._currentElement),h=new g(e,f);"production"!==c.env.NODE_ENV&&("production"!==c.env.NODE_ENV?v(null!=h.render,"%s(...): No `render` method found on the returned component instance: you may have forgotten to define `render` in your component or you may have accidentally tried to render an element whose type is a function that isn't a React component.",g.displayName||g.name||"Component"):null),h.props=e,h.context=f,h.refs=s,this._instance=h,j.set(h,this),"production"!==c.env.NODE_ENV&&this._warnIfContextsDiffer(this._currentElement._context,d),"production"!==c.env.NODE_ENV&&("production"!==c.env.NODE_ENV?v(!h.getInitialState||h.getInitialState.isReactClassApproved,"getInitialState was defined on %s, a plain JavaScript class. This is only supported for classes created using React.createClass. Did you mean to define a state property instead?",this.getName()||"a component"):null,"production"!==c.env.NODE_ENV?v(!h.getDefaultProps||h.getDefaultProps.isReactClassApproved,"getDefaultProps was defined on %s, a plain JavaScript class. This is only supported for classes created using React.createClass. Use a static property to define defaultProps instead.",this.getName()||"a component"):null,"production"!==c.env.NODE_ENV?v(!h.propTypes,"propTypes was defined as an instance property on %s. Use a static property to define propTypes instead.",this.getName()||"a component"):null,"production"!==c.env.NODE_ENV?v(!h.contextTypes,"contextTypes was defined as an instance property on %s. Use a static property to define contextTypes instead.",this.getName()||"a component"):null,"production"!==c.env.NODE_ENV?v("function"!=typeof h.componentShouldUpdate,"%s has a method called componentShouldUpdate(). Did you mean shouldComponentUpdate()? The name is phrased as a question because the function is expected to return a value.",this.getName()||"A component"):null);var i=h.state;void 0===i&&(h.state=i=null),"production"!==c.env.NODE_ENV?t("object"==typeof i&&!Array.isArray(i),"%s.state: must be set to an object or null",this.getName()||"ReactCompositeComponent"):t("object"==typeof i&&!Array.isArray(i)),this._pendingStateQueue=null,this._pendingReplaceState=!1,this._pendingForceUpdate=!1;var m,n,o=k.currentlyMountingInstance;k.currentlyMountingInstance=this;try{h.componentWillMount&&(h.componentWillMount(),this._pendingStateQueue&&(h.state=this._processPendingState(h.props,h.context))),m=this._getValidatedChildContext(d),n=this._renderValidatedComponent(m)}finally{k.currentlyMountingInstance=o}this._renderedComponent=this._instantiateReactComponent(n,this._currentElement.type);var q=p.mountComponent(this._renderedComponent,a,b,this._mergeChildContext(d,m));return h.componentDidMount&&b.getReactMountReady().enqueue(h.componentDidMount,h),q},unmountComponent:function(){var a=this._instance;if(a.componentWillUnmount){var b=k.currentlyUnmountingInstance;k.currentlyUnmountingInstance=this;try{a.componentWillUnmount()}finally{k.currentlyUnmountingInstance=b}}p.unmountComponent(this._renderedComponent),this._renderedComponent=null,this._pendingStateQueue=null,this._pendingReplaceState=!1,this._pendingForceUpdate=!1,this._pendingCallbacks=null,this._pendingElement=null,this._context=null,this._rootNodeID=null,j.remove(a)},_setPropsInternal:function(a,b){var c=this._pendingElement||this._currentElement;this._pendingElement=h.cloneAndReplaceProps(c,r({},c.props,a)),q.enqueueUpdate(this,b)},_maskContext:function(a){var b=null;if("string"==typeof this._currentElement.type)return s;var c=this._currentElement.type.contextTypes;if(!c)return s;b={};for(var d in c)b[d]=a[d];return b},_processContext:function(a){var b=this._maskContext(a);if("production"!==c.env.NODE_ENV){var d=l.getComponentClassForElement(this._currentElement);d.contextTypes&&this._checkPropTypes(d.contextTypes,b,n.context)}return b},_getValidatedChildContext:function(a){var b=this._instance,d=b.getChildContext&&b.getChildContext();if(d){"production"!==c.env.NODE_ENV?t("object"==typeof b.constructor.childContextTypes,"%s.getChildContext(): childContextTypes must be defined in order to use getChildContext().",this.getName()||"ReactCompositeComponent"):t("object"==typeof b.constructor.childContextTypes),"production"!==c.env.NODE_ENV&&this._checkPropTypes(b.constructor.childContextTypes,d,n.childContext);for(var e in d)"production"!==c.env.NODE_ENV?t(e in b.constructor.childContextTypes,'%s.getChildContext(): key "%s" is not defined in childContextTypes.',this.getName()||"ReactCompositeComponent",e):t(e in b.constructor.childContextTypes);return d}return null},_mergeChildContext:function(a,b){return b?r({},a,b):a},_processProps:function(a){if("production"!==c.env.NODE_ENV){var b=l.getComponentClassForElement(this._currentElement);b.propTypes&&this._checkPropTypes(b.propTypes,a,n.prop)}return a},_checkPropTypes:function(a,b,e){var f=this.getName();for(var g in a)if(a.hasOwnProperty(g)){var h;try{"production"!==c.env.NODE_ENV?t("function"==typeof a[g],"%s: %s type `%s` is invalid; it must be a function, usually from React.PropTypes.",f||"React class",o[e],g):t("function"==typeof a[g]),h=a[g](b,g,f,e)}catch(i){h=i}if(h instanceof Error){var j=d(this);e===n.prop?"production"!==c.env.NODE_ENV?v(!1,"Failed Composite propType: %s%s",h.message,j):null:"production"!==c.env.NODE_ENV?v(!1,"Failed Context Types: %s%s",h.message,j):null}}},receiveComponent:function(a,b,c){var d=this._currentElement,e=this._context;this._pendingElement=null,this.updateComponent(b,d,a,e,c)},performUpdateIfNecessary:function(a){null!=this._pendingElement&&p.receiveComponent(this,this._pendingElement||this._currentElement,a,this._context),(null!==this._pendingStateQueue||this._pendingForceUpdate)&&("production"!==c.env.NODE_ENV&&i.checkAndWarnForMutatedProps(this._currentElement),this.updateComponent(a,this._currentElement,this._currentElement,this._context,this._context))},_warnIfContextsDiffer:function(a,b){a=this._maskContext(a),b=this._maskContext(b);for(var d=Object.keys(b).sort(),e=this.getName()||"ReactCompositeComponent",f=0;f<d.length;f++){var g=d[f];"production"!==c.env.NODE_ENV?v(a[g]===b[g],"owner-based and parent-based contexts differ (values: `%s` vs `%s`) for key (%s) while mounting %s (see: http://fb.me/react-context-by-parent)",a[g],b[g],g,e):null}},updateComponent:function(a,b,d,e,f){var g=this._instance,h=g.context,i=g.props;b!==d&&(h=this._processContext(d._context),i=this._processProps(d.props),"production"!==c.env.NODE_ENV&&null!=f&&this._warnIfContextsDiffer(d._context,f),g.componentWillReceiveProps&&g.componentWillReceiveProps(i,h));var j=this._processPendingState(i,h),k=this._pendingForceUpdate||!g.shouldComponentUpdate||g.shouldComponentUpdate(i,j,h);"production"!==c.env.NODE_ENV&&("production"!==c.env.NODE_ENV?v("undefined"!=typeof k,"%s.shouldComponentUpdate(): Returned undefined instead of a boolean value. Make sure to return true or false.",this.getName()||"ReactCompositeComponent"):null),k?(this._pendingForceUpdate=!1,this._performComponentUpdate(d,i,j,h,a,f)):(this._currentElement=d,this._context=f,g.props=i,g.state=j,g.context=h)},_processPendingState:function(a,b){var c=this._instance,d=this._pendingStateQueue,e=this._pendingReplaceState;if(this._pendingReplaceState=!1,this._pendingStateQueue=null,!d)return c.state;if(e&&1===d.length)return d[0];for(var f=r({},e?d[0]:c.state),g=e?1:0;g<d.length;g++){var h=d[g];r(f,"function"==typeof h?h.call(c,f,a,b):h)}return f},_performComponentUpdate:function(a,b,c,d,e,f){var g=this._instance,h=g.props,i=g.state,j=g.context;g.componentWillUpdate&&g.componentWillUpdate(b,c,d),this._currentElement=a,this._context=f,g.props=b,g.state=c,g.context=d,this._updateRenderedComponent(e,f),g.componentDidUpdate&&e.getReactMountReady().enqueue(g.componentDidUpdate.bind(g,h,i,j),g)},_updateRenderedComponent:function(a,b){var c=this._renderedComponent,d=c._currentElement,e=this._getValidatedChildContext(),f=this._renderValidatedComponent(e);if(u(d,f))p.receiveComponent(c,f,a,this._mergeChildContext(b,e));else{var g=this._rootNodeID,h=c._rootNodeID;p.unmountComponent(c),this._renderedComponent=this._instantiateReactComponent(f,this._currentElement.type);var i=p.mountComponent(this._renderedComponent,g,a,this._mergeChildContext(b,e));this._replaceNodeWithMarkupByID(h,i)}},_replaceNodeWithMarkupByID:function(a,b){e.replaceNodeWithMarkupByID(a,b)},_renderValidatedComponentWithoutOwnerOrContext:function(){var a=this._instance,b=a.render();return"production"!==c.env.NODE_ENV&&"undefined"==typeof b&&a.render._isMockFunction&&(b=null),b},_renderValidatedComponent:function(a){var b,d=f.current;f.current=this._mergeChildContext(this._currentElement._context,a),g.current=this;try{b=this._renderValidatedComponentWithoutOwnerOrContext()}finally{f.current=d,g.current=null}return"production"!==c.env.NODE_ENV?t(null===b||b===!1||h.isValidElement(b),"%s.render(): A valid ReactComponent must be returned. You may have returned undefined, an array or some other invalid object.",this.getName()||"ReactCompositeComponent"):t(null===b||b===!1||h.isValidElement(b)),b},attachRef:function(a,b){var c=this.getPublicInstance(),d=c.refs===s?c.refs={}:c.refs;d[a]=b.getPublicInstance()},detachRef:function(a){var b=this.getPublicInstance().refs;delete b[a]},getName:function(){var a=this._currentElement.type,b=this._instance&&this._instance.constructor;return a.displayName||b&&b.displayName||a.name||b&&b.name||null},getPublicInstance:function(){return this._instance},_instantiateReactComponent:null};m.measureMethods(x,"ReactCompositeComponent",{mountComponent:"mountComponent",updateComponent:"updateComponent",_renderValidatedComponent:"_renderValidatedComponent"});var y={Mixin:x};b.exports=y}).call(this,a("_process"))},{"./Object.assign":28,"./ReactComponentEnvironment":38,"./ReactContext":40,"./ReactCurrentOwner":41,"./ReactElement":59,"./ReactElementValidator":60,"./ReactInstanceMap":69,"./ReactLifeCycle":70,"./ReactNativeComponent":75,"./ReactPerf":77,"./ReactPropTypeLocationNames":78,"./ReactPropTypeLocations":79,"./ReactReconciler":83,"./ReactUpdates":89,"./emptyObject":117,"./invariant":137,"./shouldUpdateReactComponent":153,"./warning":156,_process:1}],40:[function(a,b,c){(function(c){"use strict";var d=a("./Object.assign"),e=a("./emptyObject"),f=a("./warning"),g=!1,h={current:e,withContext:function(a,b){"production"!==c.env.NODE_ENV&&("production"!==c.env.NODE_ENV?f(g,"withContext is deprecated and will be removed in a future version. Use a wrapper component with getChildContext instead."):null,g=!0);var e,i=h.current;h.current=d({},i,a);try{e=b()}finally{h.current=i}return e}};b.exports=h}).call(this,a("_process"))},{"./Object.assign":28,"./emptyObject":117,"./warning":156,_process:1}],41:[function(a,b,c){"use strict";var d={current:null};b.exports=d},{}],42:[function(a,b,c){(function(c){"use strict";function d(a){return"production"!==c.env.NODE_ENV?f.createFactory(a):e.createFactory(a)}var e=a("./ReactElement"),f=a("./ReactElementValidator"),g=a("./mapObject"),h=g({a:"a",abbr:"abbr",address:"address",area:"area",article:"article",aside:"aside",audio:"audio",b:"b",base:"base",bdi:"bdi",bdo:"bdo",big:"big",blockquote:"blockquote",body:"body",br:"br",button:"button",canvas:"canvas",caption:"caption",cite:"cite",code:"code",col:"col",colgroup:"colgroup",data:"data",datalist:"datalist",dd:"dd",del:"del",details:"details",dfn:"dfn",dialog:"dialog",div:"div",dl:"dl",dt:"dt",em:"em",embed:"embed",fieldset:"fieldset",figcaption:"figcaption",figure:"figure",footer:"footer",form:"form",h1:"h1",h2:"h2",h3:"h3",h4:"h4",h5:"h5",h6:"h6",head:"head",header:"header",hr:"hr",html:"html",i:"i",iframe:"iframe",img:"img",input:"input",ins:"ins",kbd:"kbd",keygen:"keygen",label:"label",legend:"legend",li:"li",link:"link",main:"main",map:"map",mark:"mark",menu:"menu",menuitem:"menuitem",meta:"meta",meter:"meter",nav:"nav",noscript:"noscript",object:"object",ol:"ol",optgroup:"optgroup",option:"option",output:"output",p:"p",param:"param",picture:"picture",pre:"pre",progress:"progress",q:"q",rp:"rp",rt:"rt",ruby:"ruby",s:"s",samp:"samp",script:"script",section:"section",select:"select",small:"small",source:"source",span:"span",strong:"strong",style:"style",sub:"sub",summary:"summary",sup:"sup",table:"table",tbody:"tbody",td:"td",textarea:"textarea",tfoot:"tfoot",th:"th",thead:"thead",time:"time",title:"title",tr:"tr",track:"track",u:"u",ul:"ul","var":"var",video:"video",wbr:"wbr",circle:"circle",clipPath:"clipPath",defs:"defs",ellipse:"ellipse",g:"g",line:"line",linearGradient:"linearGradient",mask:"mask",path:"path",pattern:"pattern",polygon:"polygon",polyline:"polyline",radialGradient:"radialGradient",rect:"rect",stop:"stop",svg:"svg",text:"text",tspan:"tspan"},d);b.exports=h}).call(this,a("_process"))},{"./ReactElement":59,"./ReactElementValidator":60,"./mapObject":144,_process:1}],43:[function(a,b,c){"use strict";var d=a("./AutoFocusMixin"),e=a("./ReactBrowserComponentMixin"),f=a("./ReactClass"),g=a("./ReactElement"),h=a("./keyMirror"),i=g.createFactory("button"),j=h({onClick:!0,onDoubleClick:!0,onMouseDown:!0,onMouseMove:!0,onMouseUp:!0,onClickCapture:!0,onDoubleClickCapture:!0,onMouseDownCapture:!0,onMouseMoveCapture:!0,onMouseUpCapture:!0}),k=f.createClass({displayName:"ReactDOMButton",tagName:"BUTTON",mixins:[d,e],render:function(){var a={};for(var b in this.props)!this.props.hasOwnProperty(b)||this.props.disabled&&j[b]||(a[b]=this.props[b]);return i(a,this.props.children)}});b.exports=k},{"./AutoFocusMixin":3,"./ReactBrowserComponentMixin":31,"./ReactClass":35,"./ReactElement":59,"./keyMirror":142}],44:[function(a,b,c){(function(c){"use strict";function d(a){a&&(null!=a.dangerouslySetInnerHTML&&("production"!==c.env.NODE_ENV?r(null==a.children,"Can only set one of `children` or `props.dangerouslySetInnerHTML`."):r(null==a.children),"production"!==c.env.NODE_ENV?r("object"==typeof a.dangerouslySetInnerHTML&&"__html"in a.dangerouslySetInnerHTML,"`props.dangerouslySetInnerHTML` must be in the form `{__html: ...}`. Please visit https://fb.me/react-invariant-dangerously-set-inner-html for more information."):r("object"==typeof a.dangerouslySetInnerHTML&&"__html"in a.dangerouslySetInnerHTML)),"production"!==c.env.NODE_ENV&&("production"!==c.env.NODE_ENV?u(null==a.innerHTML,"Directly setting property `innerHTML` is not permitted. For more information, lookup documentation on `dangerouslySetInnerHTML`."):null,"production"!==c.env.NODE_ENV?u(!a.contentEditable||null==a.children,"A component is `contentEditable` and contains `children` managed by React. It is now your responsibility to guarantee that none of those nodes are unexpectedly modified or duplicated. This is probably not intentional."):null),"production"!==c.env.NODE_ENV?r(null==a.style||"object"==typeof a.style,"The `style` prop expects a mapping from style properties to values, not a string. For example, style={{marginRight: spacing + 'em'}} when using JSX."):r(null==a.style||"object"==typeof a.style))}function e(a,b,d,e){"production"!==c.env.NODE_ENV&&("production"!==c.env.NODE_ENV?u("onScroll"!==b||s("scroll",!0),"This browser doesn't support the `onScroll` event"):null);var f=m.findReactContainerForID(a);if(f){var g=f.nodeType===A?f.ownerDocument:f;w(b,g)}e.getPutListenerQueue().enqueuePutListener(a,b,d)}function f(a){F.call(E,a)||("production"!==c.env.NODE_ENV?r(D.test(a),"Invalid tag: %s",a):r(D.test(a)),E[a]=!0)}function g(a){f(a),this._tag=a,this._renderedChildren=null,this._previousStyleCopy=null,this._rootNodeID=null}var h=a("./CSSPropertyOperations"),i=a("./DOMProperty"),j=a("./DOMPropertyOperations"),k=a("./ReactBrowserEventEmitter"),l=a("./ReactComponentBrowserEnvironment"),m=a("./ReactMount"),n=a("./ReactMultiChild"),o=a("./ReactPerf"),p=a("./Object.assign"),q=a("./escapeTextContentForBrowser"),r=a("./invariant"),s=a("./isEventSupported"),t=a("./keyOf"),u=a("./warning"),v=k.deleteListener,w=k.listenTo,x=k.registrationNameModules,y={string:!0,number:!0},z=t({style:null}),A=1,B=null,C={area:!0,base:!0,br:!0,col:!0,embed:!0,hr:!0,img:!0,input:!0,keygen:!0,link:!0,meta:!0,param:!0,source:!0,track:!0,wbr:!0},D=/^[a-zA-Z][a-zA-Z:_\.\-\d]*$/,E={},F={}.hasOwnProperty;g.displayName="ReactDOMComponent",g.Mixin={construct:function(a){this._currentElement=a},mountComponent:function(a,b,c){this._rootNodeID=a,d(this._currentElement.props);var e=C[this._tag]?"":"</"+this._tag+">";return this._createOpenTagMarkupAndPutListeners(b)+this._createContentMarkup(b,c)+e},_createOpenTagMarkupAndPutListeners:function(a){
var b=this._currentElement.props,c="<"+this._tag;for(var d in b)if(b.hasOwnProperty(d)){var f=b[d];if(null!=f)if(x.hasOwnProperty(d))e(this._rootNodeID,d,f,a);else{d===z&&(f&&(f=this._previousStyleCopy=p({},b.style)),f=h.createMarkupForStyles(f));var g=j.createMarkupForProperty(d,f);g&&(c+=" "+g)}}if(a.renderToStaticMarkup)return c+">";var i=j.createMarkupForID(this._rootNodeID);return c+" "+i+">"},_createContentMarkup:function(a,b){var c="";("listing"===this._tag||"pre"===this._tag||"textarea"===this._tag)&&(c="\n");var d=this._currentElement.props,e=d.dangerouslySetInnerHTML;if(null!=e){if(null!=e.__html)return c+e.__html}else{var f=y[typeof d.children]?d.children:null,g=null!=f?null:d.children;if(null!=f)return c+q(f);if(null!=g){var h=this.mountChildren(g,a,b);return c+h.join("")}}return c},receiveComponent:function(a,b,c){var d=this._currentElement;this._currentElement=a,this.updateComponent(b,d,a,c)},updateComponent:function(a,b,c,e){d(this._currentElement.props),this._updateDOMProperties(b.props,a),this._updateDOMChildren(b.props,a,e)},_updateDOMProperties:function(a,b){var c,d,f,g=this._currentElement.props;for(c in a)if(!g.hasOwnProperty(c)&&a.hasOwnProperty(c))if(c===z){var h=this._previousStyleCopy;for(d in h)h.hasOwnProperty(d)&&(f=f||{},f[d]="");this._previousStyleCopy=null}else x.hasOwnProperty(c)?v(this._rootNodeID,c):(i.isStandardName[c]||i.isCustomAttribute(c))&&B.deletePropertyByID(this._rootNodeID,c);for(c in g){var j=g[c],k=c===z?this._previousStyleCopy:a[c];if(g.hasOwnProperty(c)&&j!==k)if(c===z)if(j?j=this._previousStyleCopy=p({},j):this._previousStyleCopy=null,k){for(d in k)!k.hasOwnProperty(d)||j&&j.hasOwnProperty(d)||(f=f||{},f[d]="");for(d in j)j.hasOwnProperty(d)&&k[d]!==j[d]&&(f=f||{},f[d]=j[d])}else f=j;else x.hasOwnProperty(c)?e(this._rootNodeID,c,j,b):(i.isStandardName[c]||i.isCustomAttribute(c))&&B.updatePropertyByID(this._rootNodeID,c,j)}f&&B.updateStylesByID(this._rootNodeID,f)},_updateDOMChildren:function(a,b,c){var d=this._currentElement.props,e=y[typeof a.children]?a.children:null,f=y[typeof d.children]?d.children:null,g=a.dangerouslySetInnerHTML&&a.dangerouslySetInnerHTML.__html,h=d.dangerouslySetInnerHTML&&d.dangerouslySetInnerHTML.__html,i=null!=e?null:a.children,j=null!=f?null:d.children,k=null!=e||null!=g,l=null!=f||null!=h;null!=i&&null==j?this.updateChildren(null,b,c):k&&!l&&this.updateTextContent(""),null!=f?e!==f&&this.updateTextContent(""+f):null!=h?g!==h&&B.updateInnerHTMLByID(this._rootNodeID,h):null!=j&&this.updateChildren(j,b,c)},unmountComponent:function(){this.unmountChildren(),k.deleteAllListeners(this._rootNodeID),l.unmountIDFromEnvironment(this._rootNodeID),this._rootNodeID=null}},o.measureMethods(g,"ReactDOMComponent",{mountComponent:"mountComponent",updateComponent:"updateComponent"}),p(g.prototype,g.Mixin,n.Mixin),g.injection={injectIDOperations:function(a){g.BackendIDOperations=B=a}},b.exports=g}).call(this,a("_process"))},{"./CSSPropertyOperations":6,"./DOMProperty":11,"./DOMPropertyOperations":12,"./Object.assign":28,"./ReactBrowserEventEmitter":32,"./ReactComponentBrowserEnvironment":37,"./ReactMount":72,"./ReactMultiChild":73,"./ReactPerf":77,"./escapeTextContentForBrowser":118,"./invariant":137,"./isEventSupported":138,"./keyOf":143,"./warning":156,_process:1}],45:[function(a,b,c){"use strict";var d=a("./EventConstants"),e=a("./LocalEventTrapMixin"),f=a("./ReactBrowserComponentMixin"),g=a("./ReactClass"),h=a("./ReactElement"),i=h.createFactory("form"),j=g.createClass({displayName:"ReactDOMForm",tagName:"FORM",mixins:[f,e],render:function(){return i(this.props)},componentDidMount:function(){this.trapBubbledEvent(d.topLevelTypes.topReset,"reset"),this.trapBubbledEvent(d.topLevelTypes.topSubmit,"submit")}});b.exports=j},{"./EventConstants":16,"./LocalEventTrapMixin":26,"./ReactBrowserComponentMixin":31,"./ReactClass":35,"./ReactElement":59}],46:[function(a,b,c){(function(c){"use strict";var d=a("./CSSPropertyOperations"),e=a("./DOMChildrenOperations"),f=a("./DOMPropertyOperations"),g=a("./ReactMount"),h=a("./ReactPerf"),i=a("./invariant"),j=a("./setInnerHTML"),k={dangerouslySetInnerHTML:"`dangerouslySetInnerHTML` must be set using `updateInnerHTMLByID()`.",style:"`style` must be set using `updateStylesByID()`."},l={updatePropertyByID:function(a,b,d){var e=g.getNode(a);"production"!==c.env.NODE_ENV?i(!k.hasOwnProperty(b),"updatePropertyByID(...): %s",k[b]):i(!k.hasOwnProperty(b)),null!=d?f.setValueForProperty(e,b,d):f.deleteValueForProperty(e,b)},deletePropertyByID:function(a,b,d){var e=g.getNode(a);"production"!==c.env.NODE_ENV?i(!k.hasOwnProperty(b),"updatePropertyByID(...): %s",k[b]):i(!k.hasOwnProperty(b)),f.deleteValueForProperty(e,b,d)},updateStylesByID:function(a,b){var c=g.getNode(a);d.setValueForStyles(c,b)},updateInnerHTMLByID:function(a,b){var c=g.getNode(a);j(c,b)},updateTextContentByID:function(a,b){var c=g.getNode(a);e.updateTextContent(c,b)},dangerouslyReplaceNodeWithMarkupByID:function(a,b){var c=g.getNode(a);e.dangerouslyReplaceNodeWithMarkup(c,b)},dangerouslyProcessChildrenUpdates:function(a,b){for(var c=0;c<a.length;c++)a[c].parentNode=g.getNode(a[c].parentID);e.processUpdates(a,b)}};h.measureMethods(l,"ReactDOMIDOperations",{updatePropertyByID:"updatePropertyByID",deletePropertyByID:"deletePropertyByID",updateStylesByID:"updateStylesByID",updateInnerHTMLByID:"updateInnerHTMLByID",updateTextContentByID:"updateTextContentByID",dangerouslyReplaceNodeWithMarkupByID:"dangerouslyReplaceNodeWithMarkupByID",dangerouslyProcessChildrenUpdates:"dangerouslyProcessChildrenUpdates"}),b.exports=l}).call(this,a("_process"))},{"./CSSPropertyOperations":6,"./DOMChildrenOperations":10,"./DOMPropertyOperations":12,"./ReactMount":72,"./ReactPerf":77,"./invariant":137,"./setInnerHTML":150,_process:1}],47:[function(a,b,c){"use strict";var d=a("./EventConstants"),e=a("./LocalEventTrapMixin"),f=a("./ReactBrowserComponentMixin"),g=a("./ReactClass"),h=a("./ReactElement"),i=h.createFactory("iframe"),j=g.createClass({displayName:"ReactDOMIframe",tagName:"IFRAME",mixins:[f,e],render:function(){return i(this.props)},componentDidMount:function(){this.trapBubbledEvent(d.topLevelTypes.topLoad,"load")}});b.exports=j},{"./EventConstants":16,"./LocalEventTrapMixin":26,"./ReactBrowserComponentMixin":31,"./ReactClass":35,"./ReactElement":59}],48:[function(a,b,c){"use strict";var d=a("./EventConstants"),e=a("./LocalEventTrapMixin"),f=a("./ReactBrowserComponentMixin"),g=a("./ReactClass"),h=a("./ReactElement"),i=h.createFactory("img"),j=g.createClass({displayName:"ReactDOMImg",tagName:"IMG",mixins:[f,e],render:function(){return i(this.props)},componentDidMount:function(){this.trapBubbledEvent(d.topLevelTypes.topLoad,"load"),this.trapBubbledEvent(d.topLevelTypes.topError,"error")}});b.exports=j},{"./EventConstants":16,"./LocalEventTrapMixin":26,"./ReactBrowserComponentMixin":31,"./ReactClass":35,"./ReactElement":59}],49:[function(a,b,c){(function(c){"use strict";function d(){this.isMounted()&&this.forceUpdate()}var e=a("./AutoFocusMixin"),f=a("./DOMPropertyOperations"),g=a("./LinkedValueUtils"),h=a("./ReactBrowserComponentMixin"),i=a("./ReactClass"),j=a("./ReactElement"),k=a("./ReactMount"),l=a("./ReactUpdates"),m=a("./Object.assign"),n=a("./invariant"),o=j.createFactory("input"),p={},q=i.createClass({displayName:"ReactDOMInput",tagName:"INPUT",mixins:[e,g.Mixin,h],getInitialState:function(){var a=this.props.defaultValue;return{initialChecked:this.props.defaultChecked||!1,initialValue:null!=a?a:null}},render:function(){var a=m({},this.props);a.defaultChecked=null,a.defaultValue=null;var b=g.getValue(this);a.value=null!=b?b:this.state.initialValue;var c=g.getChecked(this);return a.checked=null!=c?c:this.state.initialChecked,a.onChange=this._handleChange,o(a,this.props.children)},componentDidMount:function(){var a=k.getID(this.getDOMNode());p[a]=this},componentWillUnmount:function(){var a=this.getDOMNode(),b=k.getID(a);delete p[b]},componentDidUpdate:function(a,b,c){var d=this.getDOMNode();null!=this.props.checked&&f.setValueForProperty(d,"checked",this.props.checked||!1);var e=g.getValue(this);null!=e&&f.setValueForProperty(d,"value",""+e)},_handleChange:function(a){var b,e=g.getOnChange(this);e&&(b=e.call(this,a)),l.asap(d,this);var f=this.props.name;if("radio"===this.props.type&&null!=f){for(var h=this.getDOMNode(),i=h;i.parentNode;)i=i.parentNode;for(var j=i.querySelectorAll("input[name="+JSON.stringify(""+f)+'][type="radio"]'),m=0,o=j.length;o>m;m++){var q=j[m];if(q!==h&&q.form===h.form){var r=k.getID(q);"production"!==c.env.NODE_ENV?n(r,"ReactDOMInput: Mixing React and non-React radio inputs with the same `name` is not supported."):n(r);var s=p[r];"production"!==c.env.NODE_ENV?n(s,"ReactDOMInput: Unknown radio button ID %s.",r):n(s),l.asap(d,s)}}}return b}});b.exports=q}).call(this,a("_process"))},{"./AutoFocusMixin":3,"./DOMPropertyOperations":12,"./LinkedValueUtils":25,"./Object.assign":28,"./ReactBrowserComponentMixin":31,"./ReactClass":35,"./ReactElement":59,"./ReactMount":72,"./ReactUpdates":89,"./invariant":137,_process:1}],50:[function(a,b,c){(function(c){"use strict";var d=a("./ReactBrowserComponentMixin"),e=a("./ReactClass"),f=a("./ReactElement"),g=a("./warning"),h=f.createFactory("option"),i=e.createClass({displayName:"ReactDOMOption",tagName:"OPTION",mixins:[d],componentWillMount:function(){"production"!==c.env.NODE_ENV&&("production"!==c.env.NODE_ENV?g(null==this.props.selected,"Use the `defaultValue` or `value` props on <select> instead of setting `selected` on <option>."):null)},render:function(){return h(this.props,this.props.children)}});b.exports=i}).call(this,a("_process"))},{"./ReactBrowserComponentMixin":31,"./ReactClass":35,"./ReactElement":59,"./warning":156,_process:1}],51:[function(a,b,c){"use strict";function d(){if(this._pendingUpdate){this._pendingUpdate=!1;var a=h.getValue(this);null!=a&&this.isMounted()&&f(this,a)}}function e(a,b,c){if(null==a[b])return null;if(a.multiple){if(!Array.isArray(a[b]))return new Error("The `"+b+"` prop supplied to <select> must be an array if `multiple` is true.")}else if(Array.isArray(a[b]))return new Error("The `"+b+"` prop supplied to <select> must be a scalar value if `multiple` is false.")}function f(a,b){var c,d,e,f=a.getDOMNode().options;if(a.props.multiple){for(c={},d=0,e=b.length;e>d;d++)c[""+b[d]]=!0;for(d=0,e=f.length;e>d;d++){var g=c.hasOwnProperty(f[d].value);f[d].selected!==g&&(f[d].selected=g)}}else{for(c=""+b,d=0,e=f.length;e>d;d++)if(f[d].value===c)return void(f[d].selected=!0);f.length&&(f[0].selected=!0)}}var g=a("./AutoFocusMixin"),h=a("./LinkedValueUtils"),i=a("./ReactBrowserComponentMixin"),j=a("./ReactClass"),k=a("./ReactElement"),l=a("./ReactUpdates"),m=a("./Object.assign"),n=k.createFactory("select"),o=j.createClass({displayName:"ReactDOMSelect",tagName:"SELECT",mixins:[g,h.Mixin,i],propTypes:{defaultValue:e,value:e},render:function(){var a=m({},this.props);return a.onChange=this._handleChange,a.value=null,n(a,this.props.children)},componentWillMount:function(){this._pendingUpdate=!1},componentDidMount:function(){var a=h.getValue(this);null!=a?f(this,a):null!=this.props.defaultValue&&f(this,this.props.defaultValue)},componentDidUpdate:function(a){var b=h.getValue(this);null!=b?(this._pendingUpdate=!1,f(this,b)):!a.multiple!=!this.props.multiple&&(null!=this.props.defaultValue?f(this,this.props.defaultValue):f(this,this.props.multiple?[]:""))},_handleChange:function(a){var b,c=h.getOnChange(this);return c&&(b=c.call(this,a)),this._pendingUpdate=!0,l.asap(d,this),b}});b.exports=o},{"./AutoFocusMixin":3,"./LinkedValueUtils":25,"./Object.assign":28,"./ReactBrowserComponentMixin":31,"./ReactClass":35,"./ReactElement":59,"./ReactUpdates":89}],52:[function(a,b,c){"use strict";function d(a,b,c,d){return a===c&&b===d}function e(a){var b=document.selection,c=b.createRange(),d=c.text.length,e=c.duplicate();e.moveToElementText(a),e.setEndPoint("EndToStart",c);var f=e.text.length,g=f+d;return{start:f,end:g}}function f(a){var b=window.getSelection&&window.getSelection();if(!b||0===b.rangeCount)return null;var c=b.anchorNode,e=b.anchorOffset,f=b.focusNode,g=b.focusOffset,h=b.getRangeAt(0),i=d(b.anchorNode,b.anchorOffset,b.focusNode,b.focusOffset),j=i?0:h.toString().length,k=h.cloneRange();k.selectNodeContents(a),k.setEnd(h.startContainer,h.startOffset);var l=d(k.startContainer,k.startOffset,k.endContainer,k.endOffset),m=l?0:k.toString().length,n=m+j,o=document.createRange();o.setStart(c,e),o.setEnd(f,g);var p=o.collapsed;return{start:p?n:m,end:p?m:n}}function g(a,b){var c,d,e=document.selection.createRange().duplicate();"undefined"==typeof b.end?(c=b.start,d=c):b.start>b.end?(c=b.end,d=b.start):(c=b.start,d=b.end),e.moveToElementText(a),e.moveStart("character",c),e.setEndPoint("EndToStart",e),e.moveEnd("character",d-c),e.select()}function h(a,b){if(window.getSelection){var c=window.getSelection(),d=a[k()].length,e=Math.min(b.start,d),f="undefined"==typeof b.end?e:Math.min(b.end,d);if(!c.extend&&e>f){var g=f;f=e,e=g}var h=j(a,e),i=j(a,f);if(h&&i){var l=document.createRange();l.setStart(h.node,h.offset),c.removeAllRanges(),e>f?(c.addRange(l),c.extend(i.node,i.offset)):(l.setEnd(i.node,i.offset),c.addRange(l))}}}var i=a("./ExecutionEnvironment"),j=a("./getNodeForCharacterOffset"),k=a("./getTextContentAccessor"),l=i.canUseDOM&&"selection"in document&&!("getSelection"in window),m={getOffsets:l?e:f,setOffsets:l?g:h};b.exports=m},{"./ExecutionEnvironment":22,"./getNodeForCharacterOffset":130,"./getTextContentAccessor":132}],53:[function(a,b,c){"use strict";var d=a("./DOMPropertyOperations"),e=a("./ReactComponentBrowserEnvironment"),f=a("./ReactDOMComponent"),g=a("./Object.assign"),h=a("./escapeTextContentForBrowser"),i=function(a){};g(i.prototype,{construct:function(a){this._currentElement=a,this._stringText=""+a,this._rootNodeID=null,this._mountIndex=0},mountComponent:function(a,b,c){this._rootNodeID=a;var e=h(this._stringText);return b.renderToStaticMarkup?e:"<span "+d.createMarkupForID(a)+">"+e+"</span>"},receiveComponent:function(a,b){if(a!==this._currentElement){this._currentElement=a;var c=""+a;c!==this._stringText&&(this._stringText=c,f.BackendIDOperations.updateTextContentByID(this._rootNodeID,c))}},unmountComponent:function(){e.unmountIDFromEnvironment(this._rootNodeID)}}),b.exports=i},{"./DOMPropertyOperations":12,"./Object.assign":28,"./ReactComponentBrowserEnvironment":37,"./ReactDOMComponent":44,"./escapeTextContentForBrowser":118}],54:[function(a,b,c){(function(c){"use strict";function d(){this.isMounted()&&this.forceUpdate()}var e=a("./AutoFocusMixin"),f=a("./DOMPropertyOperations"),g=a("./LinkedValueUtils"),h=a("./ReactBrowserComponentMixin"),i=a("./ReactClass"),j=a("./ReactElement"),k=a("./ReactUpdates"),l=a("./Object.assign"),m=a("./invariant"),n=a("./warning"),o=j.createFactory("textarea"),p=i.createClass({displayName:"ReactDOMTextarea",tagName:"TEXTAREA",mixins:[e,g.Mixin,h],getInitialState:function(){var a=this.props.defaultValue,b=this.props.children;null!=b&&("production"!==c.env.NODE_ENV&&("production"!==c.env.NODE_ENV?n(!1,"Use the `defaultValue` or `value` props instead of setting children on <textarea>."):null),"production"!==c.env.NODE_ENV?m(null==a,"If you supply `defaultValue` on a <textarea>, do not pass children."):m(null==a),Array.isArray(b)&&("production"!==c.env.NODE_ENV?m(b.length<=1,"<textarea> can only have at most one child."):m(b.length<=1),b=b[0]),a=""+b),null==a&&(a="");var d=g.getValue(this);return{initialValue:""+(null!=d?d:a)}},render:function(){var a=l({},this.props);return"production"!==c.env.NODE_ENV?m(null==a.dangerouslySetInnerHTML,"`dangerouslySetInnerHTML` does not make sense on <textarea>."):m(null==a.dangerouslySetInnerHTML),a.defaultValue=null,a.value=null,a.onChange=this._handleChange,o(a,this.state.initialValue)},componentDidUpdate:function(a,b,c){var d=g.getValue(this);if(null!=d){var e=this.getDOMNode();f.setValueForProperty(e,"value",""+d)}},_handleChange:function(a){var b,c=g.getOnChange(this);return c&&(b=c.call(this,a)),k.asap(d,this),b}});b.exports=p}).call(this,a("_process"))},{"./AutoFocusMixin":3,"./DOMPropertyOperations":12,"./LinkedValueUtils":25,"./Object.assign":28,"./ReactBrowserComponentMixin":31,"./ReactClass":35,"./ReactElement":59,"./ReactUpdates":89,"./invariant":137,"./warning":156,_process:1}],55:[function(a,b,c){"use strict";function d(){this.reinitializeTransaction()}var e=a("./ReactUpdates"),f=a("./Transaction"),g=a("./Object.assign"),h=a("./emptyFunction"),i={initialize:h,close:function(){m.isBatchingUpdates=!1}},j={initialize:h,close:e.flushBatchedUpdates.bind(e)},k=[j,i];g(d.prototype,f.Mixin,{getTransactionWrappers:function(){return k}});var l=new d,m={isBatchingUpdates:!1,batchedUpdates:function(a,b,c,d,e){var f=m.isBatchingUpdates;m.isBatchingUpdates=!0,f?a(b,c,d,e):l.perform(a,null,b,c,d,e)}};b.exports=m},{"./Object.assign":28,"./ReactUpdates":89,"./Transaction":105,"./emptyFunction":116}],56:[function(a,b,c){(function(c){"use strict";function d(a){return o.createClass({tagName:a.toUpperCase(),render:function(){return new C(a,null,null,null,null,this.props)}})}function e(){if(E.EventEmitter.injectReactEventListener(D),E.EventPluginHub.injectEventPluginOrder(i),E.EventPluginHub.injectInstanceHandle(F),E.EventPluginHub.injectMount(G),E.EventPluginHub.injectEventPluginsByName({SimpleEventPlugin:K,EnterLeaveEventPlugin:j,ChangeEventPlugin:g,MobileSafariClickEventPlugin:m,SelectEventPlugin:I,BeforeInputEventPlugin:f}),E.NativeComponent.injectGenericComponentClass(r),E.NativeComponent.injectTextComponentClass(B),E.NativeComponent.injectAutoWrapper(d),E.Class.injectMixin(n),E.NativeComponent.injectComponentClasses({button:s,form:t,iframe:w,img:u,input:x,option:y,select:z,textarea:A,html:M("html"),head:M("head"),body:M("body")}),E.DOMProperty.injectDOMPropertyConfig(l),E.DOMProperty.injectDOMPropertyConfig(L),E.EmptyComponent.injectEmptyComponent("noscript"),E.Updates.injectReconcileTransaction(H),E.Updates.injectBatchingStrategy(q),E.RootIndex.injectCreateReactRootIndex(k.canUseDOM?h.createReactRootIndex:J.createReactRootIndex),E.Component.injectEnvironment(p),E.DOMComponent.injectIDOperations(v),"production"!==c.env.NODE_ENV){var b=k.canUseDOM&&window.location.href||"";if(/[?&]react_perf\b/.test(b)){var e=a("./ReactDefaultPerf");e.start()}}}var f=a("./BeforeInputEventPlugin"),g=a("./ChangeEventPlugin"),h=a("./ClientReactRootIndex"),i=a("./DefaultEventPluginOrder"),j=a("./EnterLeaveEventPlugin"),k=a("./ExecutionEnvironment"),l=a("./HTMLDOMPropertyConfig"),m=a("./MobileSafariClickEventPlugin"),n=a("./ReactBrowserComponentMixin"),o=a("./ReactClass"),p=a("./ReactComponentBrowserEnvironment"),q=a("./ReactDefaultBatchingStrategy"),r=a("./ReactDOMComponent"),s=a("./ReactDOMButton"),t=a("./ReactDOMForm"),u=a("./ReactDOMImg"),v=a("./ReactDOMIDOperations"),w=a("./ReactDOMIframe"),x=a("./ReactDOMInput"),y=a("./ReactDOMOption"),z=a("./ReactDOMSelect"),A=a("./ReactDOMTextarea"),B=a("./ReactDOMTextComponent"),C=a("./ReactElement"),D=a("./ReactEventListener"),E=a("./ReactInjection"),F=a("./ReactInstanceHandles"),G=a("./ReactMount"),H=a("./ReactReconcileTransaction"),I=a("./SelectEventPlugin"),J=a("./ServerReactRootIndex"),K=a("./SimpleEventPlugin"),L=a("./SVGDOMPropertyConfig"),M=a("./createFullPageComponent");b.exports={inject:e}}).call(this,a("_process"))},{"./BeforeInputEventPlugin":4,"./ChangeEventPlugin":8,"./ClientReactRootIndex":9,"./DefaultEventPluginOrder":14,"./EnterLeaveEventPlugin":15,"./ExecutionEnvironment":22,"./HTMLDOMPropertyConfig":24,"./MobileSafariClickEventPlugin":27,"./ReactBrowserComponentMixin":31,"./ReactClass":35,"./ReactComponentBrowserEnvironment":37,"./ReactDOMButton":43,"./ReactDOMComponent":44,"./ReactDOMForm":45,"./ReactDOMIDOperations":46,"./ReactDOMIframe":47,"./ReactDOMImg":48,"./ReactDOMInput":49,"./ReactDOMOption":50,"./ReactDOMSelect":51,"./ReactDOMTextComponent":53,"./ReactDOMTextarea":54,"./ReactDefaultBatchingStrategy":55,"./ReactDefaultPerf":57,"./ReactElement":59,"./ReactEventListener":64,"./ReactInjection":66,"./ReactInstanceHandles":68,"./ReactMount":72,"./ReactReconcileTransaction":82,"./SVGDOMPropertyConfig":90,"./SelectEventPlugin":91,"./ServerReactRootIndex":92,"./SimpleEventPlugin":93,"./createFullPageComponent":113,_process:1}],57:[function(a,b,c){"use strict";function d(a){return Math.floor(100*a)/100}function e(a,b,c){a[b]=(a[b]||0)+c}var f=a("./DOMProperty"),g=a("./ReactDefaultPerfAnalysis"),h=a("./ReactMount"),i=a("./ReactPerf"),j=a("./performanceNow"),k={_allMeasurements:[],_mountStack:[0],_injected:!1,start:function(){k._injected||i.injection.injectMeasure(k.measure),k._allMeasurements.length=0,i.enableMeasure=!0},stop:function(){i.enableMeasure=!1},getLastMeasurements:function(){return k._allMeasurements},printExclusive:function(a){a=a||k._allMeasurements;var b=g.getExclusiveSummary(a);console.table(b.map(function(a){return{"Component class name":a.componentName,"Total inclusive time (ms)":d(a.inclusive),"Exclusive mount time (ms)":d(a.exclusive),"Exclusive render time (ms)":d(a.render),"Mount time per instance (ms)":d(a.exclusive/a.count),"Render time per instance (ms)":d(a.render/a.count),Instances:a.count}}))},printInclusive:function(a){a=a||k._allMeasurements;var b=g.getInclusiveSummary(a);console.table(b.map(function(a){return{"Owner > component":a.componentName,"Inclusive time (ms)":d(a.time),Instances:a.count}})),console.log("Total time:",g.getTotalTime(a).toFixed(2)+" ms")},getMeasurementsSummaryMap:function(a){var b=g.getInclusiveSummary(a,!0);return b.map(function(a){return{"Owner > component":a.componentName,"Wasted time (ms)":a.time,Instances:a.count}})},printWasted:function(a){a=a||k._allMeasurements,console.table(k.getMeasurementsSummaryMap(a)),console.log("Total time:",g.getTotalTime(a).toFixed(2)+" ms")},printDOM:function(a){a=a||k._allMeasurements;var b=g.getDOMSummary(a);console.table(b.map(function(a){var b={};return b[f.ID_ATTRIBUTE_NAME]=a.id,b.type=a.type,b.args=JSON.stringify(a.args),b})),console.log("Total time:",g.getTotalTime(a).toFixed(2)+" ms")},_recordWrite:function(a,b,c,d){var e=k._allMeasurements[k._allMeasurements.length-1].writes;e[a]=e[a]||[],e[a].push({type:b,time:c,args:d})},measure:function(a,b,c){return function(){for(var d=[],f=0,g=arguments.length;g>f;f++)d.push(arguments[f]);var i,l,m;if("_renderNewRootComponent"===b||"flushBatchedUpdates"===b)return k._allMeasurements.push({exclusive:{},inclusive:{},render:{},counts:{},writes:{},displayNames:{},totalTime:0}),m=j(),l=c.apply(this,d),k._allMeasurements[k._allMeasurements.length-1].totalTime=j()-m,l;if("_mountImageIntoNode"===b||"ReactDOMIDOperations"===a){if(m=j(),l=c.apply(this,d),i=j()-m,"_mountImageIntoNode"===b){var n=h.getID(d[1]);k._recordWrite(n,b,i,d[0])}else"dangerouslyProcessChildrenUpdates"===b?d[0].forEach(function(a){var b={};null!==a.fromIndex&&(b.fromIndex=a.fromIndex),null!==a.toIndex&&(b.toIndex=a.toIndex),null!==a.textContent&&(b.textContent=a.textContent),null!==a.markupIndex&&(b.markup=d[1][a.markupIndex]),k._recordWrite(a.parentID,a.type,i,b)}):k._recordWrite(d[0],b,i,Array.prototype.slice.call(d,1));return l}if("ReactCompositeComponent"!==a||"mountComponent"!==b&&"updateComponent"!==b&&"_renderValidatedComponent"!==b)return c.apply(this,d);if("string"==typeof this._currentElement.type)return c.apply(this,d);var o="mountComponent"===b?d[0]:this._rootNodeID,p="_renderValidatedComponent"===b,q="mountComponent"===b,r=k._mountStack,s=k._allMeasurements[k._allMeasurements.length-1];if(p?e(s.counts,o,1):q&&r.push(0),m=j(),l=c.apply(this,d),i=j()-m,p)e(s.render,o,i);else if(q){var t=r.pop();r[r.length-1]+=i,e(s.exclusive,o,i-t),e(s.inclusive,o,i)}else e(s.inclusive,o,i);return s.displayNames[o]={current:this.getName(),owner:this._currentElement._owner?this._currentElement._owner.getName():"<root>"},l}}};b.exports=k},{"./DOMProperty":11,"./ReactDefaultPerfAnalysis":58,"./ReactMount":72,"./ReactPerf":77,"./performanceNow":148}],58:[function(a,b,c){function d(a){for(var b=0,c=0;c<a.length;c++){var d=a[c];b+=d.totalTime}return b}function e(a){for(var b=[],c=0;c<a.length;c++){var d,e=a[c];for(d in e.writes)e.writes[d].forEach(function(a){b.push({id:d,type:k[a.type]||a.type,args:a.args})})}return b}function f(a){for(var b,c={},d=0;d<a.length;d++){var e=a[d],f=i({},e.exclusive,e.inclusive);for(var g in f)b=e.displayNames[g].current,c[b]=c[b]||{componentName:b,inclusive:0,exclusive:0,render:0,count:0},e.render[g]&&(c[b].render+=e.render[g]),e.exclusive[g]&&(c[b].exclusive+=e.exclusive[g]),e.inclusive[g]&&(c[b].inclusive+=e.inclusive[g]),e.counts[g]&&(c[b].count+=e.counts[g])}var h=[];for(b in c)c[b].exclusive>=j&&h.push(c[b]);return h.sort(function(a,b){return b.exclusive-a.exclusive}),h}function g(a,b){for(var c,d={},e=0;e<a.length;e++){var f,g=a[e],k=i({},g.exclusive,g.inclusive);b&&(f=h(g));for(var l in k)if(!b||f[l]){var m=g.displayNames[l];c=m.owner+" > "+m.current,d[c]=d[c]||{componentName:c,time:0,count:0},g.inclusive[l]&&(d[c].time+=g.inclusive[l]),g.counts[l]&&(d[c].count+=g.counts[l])}}var n=[];for(c in d)d[c].time>=j&&n.push(d[c]);return n.sort(function(a,b){return b.time-a.time}),n}function h(a){var b={},c=Object.keys(a.writes),d=i({},a.exclusive,a.inclusive);for(var e in d){for(var f=!1,g=0;g<c.length;g++)if(0===c[g].indexOf(e)){f=!0;break}!f&&a.counts[e]>0&&(b[e]=!0)}return b}var i=a("./Object.assign"),j=1.2,k={_mountImageIntoNode:"set innerHTML",INSERT_MARKUP:"set innerHTML",MOVE_EXISTING:"move",REMOVE_NODE:"remove",TEXT_CONTENT:"set textContent",updatePropertyByID:"update attribute",deletePropertyByID:"delete attribute",updateStylesByID:"update styles",updateInnerHTMLByID:"set innerHTML",dangerouslyReplaceNodeWithMarkupByID:"replace"},l={getExclusiveSummary:f,getInclusiveSummary:g,getDOMSummary:e,getTotalTime:d};b.exports=l},{"./Object.assign":28}],59:[function(a,b,c){(function(c){"use strict";function d(a,b){Object.defineProperty(a,b,{configurable:!1,enumerable:!0,get:function(){return this._store?this._store[b]:null},set:function(a){"production"!==c.env.NODE_ENV?i(!1,"Don't set the %s property of the React element. Instead, specify the correct value when initially creating the element.",b):null,this._store[b]=a}})}function e(a){try{var b={props:!0};for(var c in b)d(a,c);k=!0}catch(e){}}var f=a("./ReactContext"),g=a("./ReactCurrentOwner"),h=a("./Object.assign"),i=a("./warning"),j={key:!0,ref:!0},k=!1,l=function(a,b,d,e,f,g){if(this.type=a,this.key=b,this.ref=d,this._owner=e,this._context=f,"production"!==c.env.NODE_ENV){this._store={props:g,originalProps:h({},g)};try{Object.defineProperty(this._store,"validated",{configurable:!1,enumerable:!1,writable:!0})}catch(i){}if(this._store.validated=!1,k)return void Object.freeze(this)}this.props=g};l.prototype={_isReactElement:!0},"production"!==c.env.NODE_ENV&&e(l.prototype),l.createElement=function(a,b,c){var d,e={},h=null,i=null;if(null!=b){i=void 0===b.ref?null:b.ref,h=void 0===b.key?null:""+b.key;for(d in b)b.hasOwnProperty(d)&&!j.hasOwnProperty(d)&&(e[d]=b[d])}var k=arguments.length-2;if(1===k)e.children=c;else if(k>1){for(var m=Array(k),n=0;k>n;n++)m[n]=arguments[n+2];e.children=m}if(a&&a.defaultProps){var o=a.defaultProps;for(d in o)"undefined"==typeof e[d]&&(e[d]=o[d])}return new l(a,h,i,g.current,f.current,e)},l.createFactory=function(a){var b=l.createElement.bind(null,a);return b.type=a,b},l.cloneAndReplaceProps=function(a,b){var d=new l(a.type,a.key,a.ref,a._owner,a._context,b);return"production"!==c.env.NODE_ENV&&(d._store.validated=a._store.validated),d},l.cloneElement=function(a,b,c){var d,e=h({},a.props),f=a.key,i=a.ref,k=a._owner;if(null!=b){void 0!==b.ref&&(i=b.ref,k=g.current),void 0!==b.key&&(f=""+b.key);for(d in b)b.hasOwnProperty(d)&&!j.hasOwnProperty(d)&&(e[d]=b[d])}var m=arguments.length-2;if(1===m)e.children=c;else if(m>1){for(var n=Array(m),o=0;m>o;o++)n[o]=arguments[o+2];e.children=n}return new l(a.type,f,i,k,a._context,e)},l.isValidElement=function(a){var b=!(!a||!a._isReactElement);return b},b.exports=l}).call(this,a("_process"))},{"./Object.assign":28,"./ReactContext":40,"./ReactCurrentOwner":41,"./warning":156,_process:1}],60:[function(a,b,c){(function(c){"use strict";function d(){if(t.current){var a=t.current.getName();if(a)return" Check the render method of `"+a+"`."}return""}function e(a){var b=a&&a.getPublicInstance();if(!b)return void 0;var c=b.constructor;return c?c.displayName||c.name||void 0:void 0}function f(){var a=t.current;return a&&e(a)||void 0}function g(a,b){a._store.validated||null!=a.key||(a._store.validated=!0,i('Each child in an array or iterator should have a unique "key" prop.',a,b))}function h(a,b,c){A.test(a)&&i("Child objects should have non-numeric keys so ordering is preserved.",b,c)}function i(a,b,d){var g=f(),h="string"==typeof d?d:d.displayName||d.name,i=g||h,j=y[a]||(y[a]={});if(!j.hasOwnProperty(i)){j[i]=!0;var k=g?" Check the render method of "+g+".":h?" Check the React.render call using <"+h+">.":"",l="";if(b&&b._owner&&b._owner!==t.current){var m=e(b._owner);l=" It was passed a child from "+m+"."}"production"!==c.env.NODE_ENV?x(!1,a+"%s%s See https://fb.me/react-warning-keys for more information.",k,l):null}}function j(a,b){if(Array.isArray(a))for(var c=0;c<a.length;c++){var d=a[c];p.isValidElement(d)&&g(d,b)}else if(p.isValidElement(a))a._store.validated=!0;else if(a){var e=v(a);if(e){if(e!==a.entries)for(var f,i=e.call(a);!(f=i.next()).done;)p.isValidElement(f.value)&&g(f.value,b)}else if("object"==typeof a){var j=q.extractIfFragment(a);for(var k in j)j.hasOwnProperty(k)&&h(k,j[k],b)}}}function k(a,b,e,f){for(var g in b)if(b.hasOwnProperty(g)){var h;try{"production"!==c.env.NODE_ENV?w("function"==typeof b[g],"%s: %s type `%s` is invalid; it must be a function, usually from React.PropTypes.",a||"React class",s[f],g):w("function"==typeof b[g]),h=b[g](e,g,a,f)}catch(i){h=i}if(h instanceof Error&&!(h.message in z)){z[h.message]=!0;var j=d(this);"production"!==c.env.NODE_ENV?x(!1,"Failed propType: %s%s",h.message,j):null}}}function l(a,b){var d=b.type,e="string"==typeof d?d:d.displayName,f=b._owner?b._owner.getPublicInstance().constructor.displayName:null,g=a+"|"+e+"|"+f;if(!B.hasOwnProperty(g)){B[g]=!0;var h="";e&&(h=" <"+e+" />");var i="";f&&(i=" The element was created by "+f+"."),"production"!==c.env.NODE_ENV?x(!1,"Don't set .props.%s of the React component%s. Instead, specify the correct value when initially creating the element or use React.cloneElement to make a new element with updated props.%s",a,h,i):null}}function m(a,b){return a!==a?b!==b:0===a&&0===b?1/a===1/b:a===b}function n(a){if(a._store){var b=a._store.originalProps,c=a.props;for(var d in c)c.hasOwnProperty(d)&&(b.hasOwnProperty(d)&&m(b[d],c[d])||(l(d,a),b[d]=c[d]))}}function o(a){if(null!=a.type){var b=u.getComponentClassForElement(a),d=b.displayName||b.name;b.propTypes&&k(d,b.propTypes,a.props,r.prop),"function"==typeof b.getDefaultProps&&("production"!==c.env.NODE_ENV?x(b.getDefaultProps.isReactClassApproved,"getDefaultProps is only used on classic React.createClass definitions. Use a static property named `defaultProps` instead."):null)}}var p=a("./ReactElement"),q=a("./ReactFragment"),r=a("./ReactPropTypeLocations"),s=a("./ReactPropTypeLocationNames"),t=a("./ReactCurrentOwner"),u=a("./ReactNativeComponent"),v=a("./getIteratorFn"),w=a("./invariant"),x=a("./warning"),y={},z={},A=/^\d+$/,B={},C={checkAndWarnForMutatedProps:n,createElement:function(a,b,d){"production"!==c.env.NODE_ENV?x(null!=a,"React.createElement: type should not be null or undefined. It should be a string (for DOM elements) or a ReactClass (for composite components)."):null;var e=p.createElement.apply(this,arguments);if(null==e)return e;for(var f=2;f<arguments.length;f++)j(arguments[f],a);return o(e),e},createFactory:function(a){var b=C.createElement.bind(null,a);if(b.type=a,"production"!==c.env.NODE_ENV)try{Object.defineProperty(b,"type",{enumerable:!1,get:function(){return"production"!==c.env.NODE_ENV?x(!1,"Factory.type is deprecated. Access the class directly before passing it to createFactory."):null,
Object.defineProperty(this,"type",{value:a}),a}})}catch(d){}return b},cloneElement:function(a,b,c){for(var d=p.cloneElement.apply(this,arguments),e=2;e<arguments.length;e++)j(arguments[e],d.type);return o(d),d}};b.exports=C}).call(this,a("_process"))},{"./ReactCurrentOwner":41,"./ReactElement":59,"./ReactFragment":65,"./ReactNativeComponent":75,"./ReactPropTypeLocationNames":78,"./ReactPropTypeLocations":79,"./getIteratorFn":128,"./invariant":137,"./warning":156,_process:1}],61:[function(a,b,c){(function(c){"use strict";function d(a){k[a]=!0}function e(a){delete k[a]}function f(a){return!!k[a]}var g,h=a("./ReactElement"),i=a("./ReactInstanceMap"),j=a("./invariant"),k={},l={injectEmptyComponent:function(a){g=h.createFactory(a)}},m=function(){};m.prototype.componentDidMount=function(){var a=i.get(this);a&&d(a._rootNodeID)},m.prototype.componentWillUnmount=function(){var a=i.get(this);a&&e(a._rootNodeID)},m.prototype.render=function(){return"production"!==c.env.NODE_ENV?j(g,"Trying to return null from a render, but no null placeholder component was injected."):j(g),g()};var n=h.createElement(m),o={emptyElement:n,injection:l,isNullComponentID:f};b.exports=o}).call(this,a("_process"))},{"./ReactElement":59,"./ReactInstanceMap":69,"./invariant":137,_process:1}],62:[function(a,b,c){"use strict";var d={guard:function(a,b){return a}};b.exports=d},{}],63:[function(a,b,c){"use strict";function d(a){e.enqueueEvents(a),e.processEventQueue()}var e=a("./EventPluginHub"),f={handleTopLevel:function(a,b,c,f){var g=e.extractEvents(a,b,c,f);d(g)}};b.exports=f},{"./EventPluginHub":18}],64:[function(a,b,c){"use strict";function d(a){var b=l.getID(a),c=k.getReactRootIDFromNodeID(b),d=l.findReactContainerForID(c),e=l.getFirstReactDOM(d);return e}function e(a,b){this.topLevelType=a,this.nativeEvent=b,this.ancestors=[]}function f(a){for(var b=l.getFirstReactDOM(o(a.nativeEvent))||window,c=b;c;)a.ancestors.push(c),c=d(c);for(var e=0,f=a.ancestors.length;f>e;e++){b=a.ancestors[e];var g=l.getID(b)||"";q._handleTopLevel(a.topLevelType,b,g,a.nativeEvent)}}function g(a){var b=p(window);a(b)}var h=a("./EventListener"),i=a("./ExecutionEnvironment"),j=a("./PooledClass"),k=a("./ReactInstanceHandles"),l=a("./ReactMount"),m=a("./ReactUpdates"),n=a("./Object.assign"),o=a("./getEventTarget"),p=a("./getUnboundedScrollPosition");n(e.prototype,{destructor:function(){this.topLevelType=null,this.nativeEvent=null,this.ancestors.length=0}}),j.addPoolingTo(e,j.twoArgumentPooler);var q={_enabled:!0,_handleTopLevel:null,WINDOW_HANDLE:i.canUseDOM?window:null,setHandleTopLevel:function(a){q._handleTopLevel=a},setEnabled:function(a){q._enabled=!!a},isEnabled:function(){return q._enabled},trapBubbledEvent:function(a,b,c){var d=c;return d?h.listen(d,b,q.dispatchEvent.bind(null,a)):null},trapCapturedEvent:function(a,b,c){var d=c;return d?h.capture(d,b,q.dispatchEvent.bind(null,a)):null},monitorScrollValue:function(a){var b=g.bind(null,a);h.listen(window,"scroll",b)},dispatchEvent:function(a,b){if(q._enabled){var c=e.getPooled(a,b);try{m.batchedUpdates(f,c)}finally{e.release(c)}}}};b.exports=q},{"./EventListener":17,"./ExecutionEnvironment":22,"./Object.assign":28,"./PooledClass":29,"./ReactInstanceHandles":68,"./ReactMount":72,"./ReactUpdates":89,"./getEventTarget":127,"./getUnboundedScrollPosition":133}],65:[function(a,b,c){(function(c){"use strict";var d=a("./ReactElement"),e=a("./warning");if("production"!==c.env.NODE_ENV){var f="_reactFragment",g="_reactDidWarn",h=!1;try{var i=function(){return 1};Object.defineProperty({},f,{enumerable:!1,value:!0}),Object.defineProperty({},"key",{enumerable:!0,get:i}),h=!0}catch(j){}var k=function(a,b){Object.defineProperty(a,b,{enumerable:!0,get:function(){return"production"!==c.env.NODE_ENV?e(this[g],"A ReactFragment is an opaque type. Accessing any of its properties is deprecated. Pass it to one of the React.Children helpers."):null,this[g]=!0,this[f][b]},set:function(a){"production"!==c.env.NODE_ENV?e(this[g],"A ReactFragment is an immutable opaque type. Mutating its properties is deprecated."):null,this[g]=!0,this[f][b]=a}})},l={},m=function(a){var b="";for(var c in a)b+=c+":"+typeof a[c]+",";var d=!!l[b];return l[b]=!0,d}}var n={create:function(a){if("production"!==c.env.NODE_ENV){if("object"!=typeof a||!a||Array.isArray(a))return"production"!==c.env.NODE_ENV?e(!1,"React.addons.createFragment only accepts a single object.",a):null,a;if(d.isValidElement(a))return"production"!==c.env.NODE_ENV?e(!1,"React.addons.createFragment does not accept a ReactElement without a wrapper object."):null,a;if(h){var b={};Object.defineProperty(b,f,{enumerable:!1,value:a}),Object.defineProperty(b,g,{writable:!0,enumerable:!1,value:!1});for(var i in a)k(b,i);return Object.preventExtensions(b),b}}return a},extract:function(a){return"production"!==c.env.NODE_ENV&&h?a[f]?a[f]:("production"!==c.env.NODE_ENV?e(m(a),"Any use of a keyed object should be wrapped in React.addons.createFragment(object) before being passed as a child."):null,a):a},extractIfFragment:function(a){if("production"!==c.env.NODE_ENV&&h){if(a[f])return a[f];for(var b in a)if(a.hasOwnProperty(b)&&d.isValidElement(a[b]))return n.extract(a)}return a}};b.exports=n}).call(this,a("_process"))},{"./ReactElement":59,"./warning":156,_process:1}],66:[function(a,b,c){"use strict";var d=a("./DOMProperty"),e=a("./EventPluginHub"),f=a("./ReactComponentEnvironment"),g=a("./ReactClass"),h=a("./ReactEmptyComponent"),i=a("./ReactBrowserEventEmitter"),j=a("./ReactNativeComponent"),k=a("./ReactDOMComponent"),l=a("./ReactPerf"),m=a("./ReactRootIndex"),n=a("./ReactUpdates"),o={Component:f.injection,Class:g.injection,DOMComponent:k.injection,DOMProperty:d.injection,EmptyComponent:h.injection,EventPluginHub:e.injection,EventEmitter:i.injection,NativeComponent:j.injection,Perf:l.injection,RootIndex:m.injection,Updates:n.injection};b.exports=o},{"./DOMProperty":11,"./EventPluginHub":18,"./ReactBrowserEventEmitter":32,"./ReactClass":35,"./ReactComponentEnvironment":38,"./ReactDOMComponent":44,"./ReactEmptyComponent":61,"./ReactNativeComponent":75,"./ReactPerf":77,"./ReactRootIndex":85,"./ReactUpdates":89}],67:[function(a,b,c){"use strict";function d(a){return f(document.documentElement,a)}var e=a("./ReactDOMSelection"),f=a("./containsNode"),g=a("./focusNode"),h=a("./getActiveElement"),i={hasSelectionCapabilities:function(a){return a&&("INPUT"===a.nodeName&&"text"===a.type||"TEXTAREA"===a.nodeName||"true"===a.contentEditable)},getSelectionInformation:function(){var a=h();return{focusedElem:a,selectionRange:i.hasSelectionCapabilities(a)?i.getSelection(a):null}},restoreSelection:function(a){var b=h(),c=a.focusedElem,e=a.selectionRange;b!==c&&d(c)&&(i.hasSelectionCapabilities(c)&&i.setSelection(c,e),g(c))},getSelection:function(a){var b;if("selectionStart"in a)b={start:a.selectionStart,end:a.selectionEnd};else if(document.selection&&"INPUT"===a.nodeName){var c=document.selection.createRange();c.parentElement()===a&&(b={start:-c.moveStart("character",-a.value.length),end:-c.moveEnd("character",-a.value.length)})}else b=e.getOffsets(a);return b||{start:0,end:0}},setSelection:function(a,b){var c=b.start,d=b.end;if("undefined"==typeof d&&(d=c),"selectionStart"in a)a.selectionStart=c,a.selectionEnd=Math.min(d,a.value.length);else if(document.selection&&"INPUT"===a.nodeName){var f=a.createTextRange();f.collapse(!0),f.moveStart("character",c),f.moveEnd("character",d-c),f.select()}else e.setOffsets(a,b)}};b.exports=i},{"./ReactDOMSelection":52,"./containsNode":111,"./focusNode":121,"./getActiveElement":123}],68:[function(a,b,c){(function(c){"use strict";function d(a){return n+a.toString(36)}function e(a,b){return a.charAt(b)===n||b===a.length}function f(a){return""===a||a.charAt(0)===n&&a.charAt(a.length-1)!==n}function g(a,b){return 0===b.indexOf(a)&&e(b,a.length)}function h(a){return a?a.substr(0,a.lastIndexOf(n)):""}function i(a,b){if("production"!==c.env.NODE_ENV?m(f(a)&&f(b),"getNextDescendantID(%s, %s): Received an invalid React DOM ID.",a,b):m(f(a)&&f(b)),"production"!==c.env.NODE_ENV?m(g(a,b),"getNextDescendantID(...): React has made an invalid assumption about the DOM hierarchy. Expected `%s` to be an ancestor of `%s`.",a,b):m(g(a,b)),a===b)return a;var d,h=a.length+o;for(d=h;d<b.length&&!e(b,d);d++);return b.substr(0,d)}function j(a,b){var d=Math.min(a.length,b.length);if(0===d)return"";for(var g=0,h=0;d>=h;h++)if(e(a,h)&&e(b,h))g=h;else if(a.charAt(h)!==b.charAt(h))break;var i=a.substr(0,g);return"production"!==c.env.NODE_ENV?m(f(i),"getFirstCommonAncestorID(%s, %s): Expected a valid React DOM ID: %s",a,b,i):m(f(i)),i}function k(a,b,d,e,f,j){a=a||"",b=b||"","production"!==c.env.NODE_ENV?m(a!==b,"traverseParentPath(...): Cannot traverse from and to the same ID, `%s`.",a):m(a!==b);var k=g(b,a);"production"!==c.env.NODE_ENV?m(k||g(a,b),"traverseParentPath(%s, %s, ...): Cannot traverse from two IDs that do not have a parent path.",a,b):m(k||g(a,b));for(var l=0,n=k?h:i,o=a;;o=n(o,b)){var q;if(f&&o===a||j&&o===b||(q=d(o,k,e)),q===!1||o===b)break;"production"!==c.env.NODE_ENV?m(l++<p,"traverseParentPath(%s, %s, ...): Detected an infinite loop while traversing the React DOM ID tree. This may be due to malformed IDs: %s",a,b):m(l++<p)}}var l=a("./ReactRootIndex"),m=a("./invariant"),n=".",o=n.length,p=100,q={createReactRootID:function(){return d(l.createReactRootIndex())},createReactID:function(a,b){return a+b},getReactRootIDFromNodeID:function(a){if(a&&a.charAt(0)===n&&a.length>1){var b=a.indexOf(n,1);return b>-1?a.substr(0,b):a}return null},traverseEnterLeave:function(a,b,c,d,e){var f=j(a,b);f!==a&&k(a,f,c,d,!1,!0),f!==b&&k(f,b,c,e,!0,!1)},traverseTwoPhase:function(a,b,c){a&&(k("",a,b,c,!0,!1),k(a,"",b,c,!1,!0))},traverseAncestors:function(a,b,c){k("",a,b,c,!0,!1)},_getFirstCommonAncestorID:j,_getNextDescendantID:i,isAncestorIDOf:g,SEPARATOR:n};b.exports=q}).call(this,a("_process"))},{"./ReactRootIndex":85,"./invariant":137,_process:1}],69:[function(a,b,c){"use strict";var d={remove:function(a){a._reactInternalInstance=void 0},get:function(a){return a._reactInternalInstance},has:function(a){return void 0!==a._reactInternalInstance},set:function(a,b){a._reactInternalInstance=b}};b.exports=d},{}],70:[function(a,b,c){"use strict";var d={currentlyMountingInstance:null,currentlyUnmountingInstance:null};b.exports=d},{}],71:[function(a,b,c){"use strict";var d=a("./adler32"),e={CHECKSUM_ATTR_NAME:"data-react-checksum",addChecksumToMarkup:function(a){var b=d(a);return a.replace(">"," "+e.CHECKSUM_ATTR_NAME+'="'+b+'">')},canReuseMarkup:function(a,b){var c=b.getAttribute(e.CHECKSUM_ATTR_NAME);c=c&&parseInt(c,10);var f=d(a);return f===c}};b.exports=e},{"./adler32":108}],72:[function(a,b,c){(function(c){"use strict";function d(a,b){for(var c=Math.min(a.length,b.length),d=0;c>d;d++)if(a.charAt(d)!==b.charAt(d))return d;return a.length===b.length?-1:c}function e(a){var b=F(a);return b&&V.getID(b)}function f(a){var b=g(a);if(b)if(N.hasOwnProperty(b)){var d=N[b];d!==a&&("production"!==c.env.NODE_ENV?H(!k(d,b),"ReactMount: Two valid but unequal nodes with the same `%s`: %s",M,b):H(!k(d,b)),N[b]=a)}else N[b]=a;return b}function g(a){return a&&a.getAttribute&&a.getAttribute(M)||""}function h(a,b){var c=g(a);c!==b&&delete N[c],a.setAttribute(M,b),N[b]=a}function i(a){return N.hasOwnProperty(a)&&k(N[a],a)||(N[a]=V.findReactNodeByID(a)),N[a]}function j(a){var b=x.get(a)._rootNodeID;return v.isNullComponentID(b)?null:(N.hasOwnProperty(b)&&k(N[b],b)||(N[b]=V.findReactNodeByID(b)),N[b])}function k(a,b){if(a){"production"!==c.env.NODE_ENV?H(g(a)===b,"ReactMount: Unexpected modification of `%s`",M):H(g(a)===b);var d=V.findReactContainerForID(b);if(d&&E(d,a))return!0}return!1}function l(a){delete N[a]}function m(a){var b=N[a];return b&&k(b,a)?void(U=b):!1}function n(a){U=null,w.traverseAncestors(a,m);var b=U;return U=null,b}function o(a,b,c,d,e){var f=A.mountComponent(a,b,d,D);a._isTopLevel=!0,V._mountImageIntoNode(f,c,e)}function p(a,b,c,d){var e=C.ReactReconcileTransaction.getPooled();e.perform(o,null,a,b,c,e,d),C.ReactReconcileTransaction.release(e)}var q=a("./DOMProperty"),r=a("./ReactBrowserEventEmitter"),s=a("./ReactCurrentOwner"),t=a("./ReactElement"),u=a("./ReactElementValidator"),v=a("./ReactEmptyComponent"),w=a("./ReactInstanceHandles"),x=a("./ReactInstanceMap"),y=a("./ReactMarkupChecksum"),z=a("./ReactPerf"),A=a("./ReactReconciler"),B=a("./ReactUpdateQueue"),C=a("./ReactUpdates"),D=a("./emptyObject"),E=a("./containsNode"),F=a("./getReactRootElementInContainer"),G=a("./instantiateReactComponent"),H=a("./invariant"),I=a("./setInnerHTML"),J=a("./shouldUpdateReactComponent"),K=a("./warning"),L=w.SEPARATOR,M=q.ID_ATTRIBUTE_NAME,N={},O=1,P=9,Q={},R={};if("production"!==c.env.NODE_ENV)var S={};var T=[],U=null,V={_instancesByReactRootID:Q,scrollMonitor:function(a,b){b()},_updateRootComponent:function(a,b,d,f){return"production"!==c.env.NODE_ENV&&u.checkAndWarnForMutatedProps(b),V.scrollMonitor(d,function(){B.enqueueElementInternal(a,b),f&&B.enqueueCallbackInternal(a,f)}),"production"!==c.env.NODE_ENV&&(S[e(d)]=F(d)),a},_registerComponent:function(a,b){"production"!==c.env.NODE_ENV?H(b&&(b.nodeType===O||b.nodeType===P),"_registerComponent(...): Target container is not a DOM element."):H(b&&(b.nodeType===O||b.nodeType===P)),r.ensureScrollValueMonitoring();var d=V.registerContainer(b);return Q[d]=a,d},_renderNewRootComponent:function(a,b,d){"production"!==c.env.NODE_ENV?K(null==s.current,"_renderNewRootComponent(): Render methods should be a pure function of props and state; triggering nested component updates from render is not allowed. If necessary, trigger nested updates in componentDidUpdate."):null;var e=G(a,null),f=V._registerComponent(e,b);return C.batchedUpdates(p,e,f,b,d),"production"!==c.env.NODE_ENV&&(S[f]=F(b)),e},render:function(a,b,d){"production"!==c.env.NODE_ENV?H(t.isValidElement(a),"React.render(): Invalid component element.%s","string"==typeof a?" Instead of passing an element string, make sure to instantiate it by passing it to React.createElement.":"function"==typeof a?" Instead of passing a component class, make sure to instantiate it by passing it to React.createElement.":null!=a&&void 0!==a.props?" This may be caused by unintentionally loading two independent copies of React.":""):H(t.isValidElement(a));var f=Q[e(b)];if(f){var g=f._currentElement;if(J(g,a))return V._updateRootComponent(f,a,b,d).getPublicInstance();V.unmountComponentAtNode(b)}var h=F(b),i=h&&V.isRenderedByReact(h);if("production"!==c.env.NODE_ENV&&(!i||h.nextSibling))for(var j=h;j;){if(V.isRenderedByReact(j)){"production"!==c.env.NODE_ENV?K(!1,"render(): Target node has markup rendered by React, but there are unrelated nodes as well. This is most commonly caused by white-space inserted around server-rendered markup."):null;break}j=j.nextSibling}var k=i&&!f,l=V._renderNewRootComponent(a,b,k).getPublicInstance();return d&&d.call(l),l},constructAndRenderComponent:function(a,b,c){var d=t.createElement(a,b);return V.render(d,c)},constructAndRenderComponentByID:function(a,b,d){var e=document.getElementById(d);return"production"!==c.env.NODE_ENV?H(e,'Tried to get element with id of "%s" but it is not present on the page.',d):H(e),V.constructAndRenderComponent(a,b,e)},registerContainer:function(a){var b=e(a);return b&&(b=w.getReactRootIDFromNodeID(b)),b||(b=w.createReactRootID()),R[b]=a,b},unmountComponentAtNode:function(a){"production"!==c.env.NODE_ENV?K(null==s.current,"unmountComponentAtNode(): Render methods should be a pure function of props and state; triggering nested component updates from render is not allowed. If necessary, trigger nested updates in componentDidUpdate."):null,"production"!==c.env.NODE_ENV?H(a&&(a.nodeType===O||a.nodeType===P),"unmountComponentAtNode(...): Target container is not a DOM element."):H(a&&(a.nodeType===O||a.nodeType===P));var b=e(a),d=Q[b];return d?(V.unmountComponentFromNode(d,a),delete Q[b],delete R[b],"production"!==c.env.NODE_ENV&&delete S[b],!0):!1},unmountComponentFromNode:function(a,b){for(A.unmountComponent(a),b.nodeType===P&&(b=b.documentElement);b.lastChild;)b.removeChild(b.lastChild)},findReactContainerForID:function(a){var b=w.getReactRootIDFromNodeID(a),d=R[b];if("production"!==c.env.NODE_ENV){var e=S[b];if(e&&e.parentNode!==d){"production"!==c.env.NODE_ENV?H(g(e)===b,"ReactMount: Root element ID differed from reactRootID."):H(g(e)===b);var f=d.firstChild;f&&b===g(f)?S[b]=f:"production"!==c.env.NODE_ENV?K(!1,"ReactMount: Root element has been removed from its original container. New container:",e.parentNode):null}}return d},findReactNodeByID:function(a){var b=V.findReactContainerForID(a);return V.findComponentRoot(b,a)},isRenderedByReact:function(a){if(1!==a.nodeType)return!1;var b=V.getID(a);return b?b.charAt(0)===L:!1},getFirstReactDOM:function(a){for(var b=a;b&&b.parentNode!==b;){if(V.isRenderedByReact(b))return b;b=b.parentNode}return null},findComponentRoot:function(a,b){var d=T,e=0,f=n(b)||a;for(d[0]=f.firstChild,d.length=1;e<d.length;){for(var g,h=d[e++];h;){var i=V.getID(h);i?b===i?g=h:w.isAncestorIDOf(i,b)&&(d.length=e=0,d.push(h.firstChild)):d.push(h.firstChild),h=h.nextSibling}if(g)return d.length=0,g}d.length=0,"production"!==c.env.NODE_ENV?H(!1,"findComponentRoot(..., %s): Unable to find element. This probably means the DOM was unexpectedly mutated (e.g., by the browser), usually due to forgetting a <tbody> when using tables, nesting tags like <form>, <p>, or <a>, or using non-SVG elements in an <svg> parent. Try inspecting the child nodes of the element with React ID `%s`.",b,V.getID(a)):H(!1)},_mountImageIntoNode:function(a,b,e){if("production"!==c.env.NODE_ENV?H(b&&(b.nodeType===O||b.nodeType===P),"mountComponentIntoNode(...): Target container is not valid."):H(b&&(b.nodeType===O||b.nodeType===P)),e){var f=F(b);if(y.canReuseMarkup(a,f))return;var g=f.getAttribute(y.CHECKSUM_ATTR_NAME);f.removeAttribute(y.CHECKSUM_ATTR_NAME);var h=f.outerHTML;f.setAttribute(y.CHECKSUM_ATTR_NAME,g);var i=d(a,h),j=" (client) "+a.substring(i-20,i+20)+"\n (server) "+h.substring(i-20,i+20);"production"!==c.env.NODE_ENV?H(b.nodeType!==P,"You're trying to render a component to the document using server rendering but the checksum was invalid. This usually means you rendered a different component type or props on the client from the one on the server, or your render() methods are impure. React cannot handle this case due to cross-browser quirks by rendering at the document root. You should look for environment dependent code in your components and ensure the props are the same client and server side:\n%s",j):H(b.nodeType!==P),"production"!==c.env.NODE_ENV&&("production"!==c.env.NODE_ENV?K(!1,"React attempted to reuse markup in a container but the checksum was invalid. This generally means that you are using server rendering and the markup generated on the server was not what the client was expecting. React injected new markup to compensate which works but you have lost many of the benefits of server rendering. Instead, figure out why the markup being generated is different on the client or server:\n%s",j):null)}"production"!==c.env.NODE_ENV?H(b.nodeType!==P,"You're trying to render a component to the document but you didn't use server rendering. We can't do this without using server rendering due to cross-browser quirks. See React.renderToString() for server rendering."):H(b.nodeType!==P),I(b,a)},getReactRootID:e,getID:f,setID:h,getNode:i,getNodeFromInstance:j,purgeID:l};z.measureMethods(V,"ReactMount",{_renderNewRootComponent:"_renderNewRootComponent",_mountImageIntoNode:"_mountImageIntoNode"}),b.exports=V}).call(this,a("_process"))},{"./DOMProperty":11,"./ReactBrowserEventEmitter":32,"./ReactCurrentOwner":41,"./ReactElement":59,"./ReactElementValidator":60,"./ReactEmptyComponent":61,"./ReactInstanceHandles":68,"./ReactInstanceMap":69,"./ReactMarkupChecksum":71,"./ReactPerf":77,"./ReactReconciler":83,"./ReactUpdateQueue":88,"./ReactUpdates":89,"./containsNode":111,"./emptyObject":117,"./getReactRootElementInContainer":131,"./instantiateReactComponent":136,"./invariant":137,"./setInnerHTML":150,"./shouldUpdateReactComponent":153,"./warning":156,_process:1}],73:[function(a,b,c){"use strict";function d(a,b,c){o.push({parentID:a,parentNode:null,type:k.INSERT_MARKUP,markupIndex:p.push(b)-1,textContent:null,fromIndex:null,toIndex:c})}function e(a,b,c){o.push({parentID:a,parentNode:null,type:k.MOVE_EXISTING,markupIndex:null,textContent:null,fromIndex:b,toIndex:c})}function f(a,b){o.push({parentID:a,parentNode:null,type:k.REMOVE_NODE,markupIndex:null,textContent:null,fromIndex:b,toIndex:null})}function g(a,b){o.push({parentID:a,parentNode:null,type:k.TEXT_CONTENT,markupIndex:null,textContent:b,fromIndex:null,toIndex:null})}function h(){o.length&&(j.processChildrenUpdates(o,p),i())}function i(){o.length=0,p.length=0}var j=a("./ReactComponentEnvironment"),k=a("./ReactMultiChildUpdateTypes"),l=a("./ReactReconciler"),m=a("./ReactChildReconciler"),n=0,o=[],p=[],q={Mixin:{mountChildren:function(a,b,c){var d=m.instantiateChildren(a,b,c);this._renderedChildren=d;var e=[],f=0;for(var g in d)if(d.hasOwnProperty(g)){var h=d[g],i=this._rootNodeID+g,j=l.mountComponent(h,i,b,c);h._mountIndex=f,e.push(j),f++}return e},updateTextContent:function(a){n++;var b=!0;try{var c=this._renderedChildren;m.unmountChildren(c);for(var d in c)c.hasOwnProperty(d)&&this._unmountChildByName(c[d],d);this.setTextContent(a),b=!1}finally{n--,n||(b?i():h())}},updateChildren:function(a,b,c){n++;var d=!0;try{this._updateChildren(a,b,c),d=!1}finally{n--,n||(d?i():h())}},_updateChildren:function(a,b,c){var d=this._renderedChildren,e=m.updateChildren(d,a,b,c);if(this._renderedChildren=e,e||d){var f,g=0,h=0;for(f in e)if(e.hasOwnProperty(f)){var i=d&&d[f],j=e[f];i===j?(this.moveChild(i,h,g),g=Math.max(i._mountIndex,g),i._mountIndex=h):(i&&(g=Math.max(i._mountIndex,g),this._unmountChildByName(i,f)),this._mountChildByNameAtIndex(j,f,h,b,c)),h++}for(f in d)!d.hasOwnProperty(f)||e&&e.hasOwnProperty(f)||this._unmountChildByName(d[f],f)}},unmountChildren:function(){var a=this._renderedChildren;m.unmountChildren(a),this._renderedChildren=null},moveChild:function(a,b,c){a._mountIndex<c&&e(this._rootNodeID,a._mountIndex,b)},createChild:function(a,b){d(this._rootNodeID,b,a._mountIndex)},removeChild:function(a){f(this._rootNodeID,a._mountIndex)},setTextContent:function(a){g(this._rootNodeID,a)},_mountChildByNameAtIndex:function(a,b,c,d,e){var f=this._rootNodeID+b,g=l.mountComponent(a,f,d,e);a._mountIndex=c,this.createChild(a,g)},_unmountChildByName:function(a,b){this.removeChild(a),a._mountIndex=null}}};b.exports=q},{"./ReactChildReconciler":33,"./ReactComponentEnvironment":38,"./ReactMultiChildUpdateTypes":74,"./ReactReconciler":83}],74:[function(a,b,c){"use strict";var d=a("./keyMirror"),e=d({INSERT_MARKUP:null,MOVE_EXISTING:null,REMOVE_NODE:null,TEXT_CONTENT:null});b.exports=e},{"./keyMirror":142}],75:[function(a,b,c){(function(c){"use strict";function d(a){if("function"==typeof a.type)return a.type;var b=a.type,c=l[b];return null==c&&(l[b]=c=j(b)),c}function e(a){return"production"!==c.env.NODE_ENV?i(k,"There is no registered component for the tag %s",a.type):i(k),new k(a.type,a.props)}function f(a){return new m(a)}function g(a){return a instanceof m}var h=a("./Object.assign"),i=a("./invariant"),j=null,k=null,l={},m=null,n={injectGenericComponentClass:function(a){k=a},injectTextComponentClass:function(a){m=a},injectComponentClasses:function(a){h(l,a)},injectAutoWrapper:function(a){j=a}},o={getComponentClassForElement:d,createInternalComponent:e,createInstanceForText:f,isTextComponent:g,injection:n};b.exports=o}).call(this,a("_process"))},{"./Object.assign":28,"./invariant":137,_process:1}],76:[function(a,b,c){(function(c){"use strict";var d=a("./invariant"),e={isValidOwner:function(a){return!(!a||"function"!=typeof a.attachRef||"function"!=typeof a.detachRef)},addComponentAsRefTo:function(a,b,f){"production"!==c.env.NODE_ENV?d(e.isValidOwner(f),"addComponentAsRefTo(...): Only a ReactOwner can have refs. This usually means that you're trying to add a ref to a component that doesn't have an owner (that is, was not created inside of another component's `render` method). Try rendering this component inside of a new top-level component which will hold the ref."):d(e.isValidOwner(f)),f.attachRef(b,a)},removeComponentAsRefFrom:function(a,b,f){"production"!==c.env.NODE_ENV?d(e.isValidOwner(f),"removeComponentAsRefFrom(...): Only a ReactOwner can have refs. This usually means that you're trying to remove a ref to a component that doesn't have an owner (that is, was not created inside of another component's `render` method). Try rendering this component inside of a new top-level component which will hold the ref."):d(e.isValidOwner(f)),f.getPublicInstance().refs[b]===a.getPublicInstance()&&f.detachRef(b)}};b.exports=e}).call(this,a("_process"))},{"./invariant":137,_process:1}],77:[function(a,b,c){(function(a){"use strict";function c(a,b,c){return c}var d={enableMeasure:!1,storedMeasure:c,measureMethods:function(b,c,e){if("production"!==a.env.NODE_ENV)for(var f in e)e.hasOwnProperty(f)&&(b[f]=d.measure(c,e[f],b[f]))},measure:function(b,c,e){if("production"!==a.env.NODE_ENV){var f=null,g=function(){return d.enableMeasure?(f||(f=d.storedMeasure(b,c,e)),f.apply(this,arguments)):e.apply(this,arguments)};return g.displayName=b+"_"+c,g}return e},injection:{injectMeasure:function(a){d.storedMeasure=a}}};b.exports=d}).call(this,a("_process"))},{_process:1}],78:[function(a,b,c){(function(a){"use strict";var c={};"production"!==a.env.NODE_ENV&&(c={prop:"prop",context:"context",childContext:"child context"}),b.exports=c}).call(this,a("_process"))},{_process:1}],79:[function(a,b,c){"use strict";var d=a("./keyMirror"),e=d({prop:null,context:null,childContext:null});b.exports=e},{"./keyMirror":142}],80:[function(a,b,c){"use strict";function d(a){function b(b,c,d,e,f){if(e=e||v,null==c[d]){var g=t[f];return b?new Error("Required "+g+" `"+d+"` was not specified in "+("`"+e+"`.")):null}return a(c,d,e,f)}var c=b.bind(null,!1);return c.isRequired=b.bind(null,!0),c}function e(a){function b(b,c,d,e){var f=b[c],g=p(f);if(g!==a){var h=t[e],i=q(f);return new Error("Invalid "+h+" `"+c+"` of type `"+i+"` "+("supplied to `"+d+"`, expected `"+a+"`."))}return null}return d(b)}function f(){return d(u.thatReturns(null))}function g(a){function b(b,c,d,e){var f=b[c];if(!Array.isArray(f)){var g=t[e],h=p(f);return new Error("Invalid "+g+" `"+c+"` of type "+("`"+h+"` supplied to `"+d+"`, expected an array."))}for(var i=0;i<f.length;i++){var j=a(f,i,d,e);if(j instanceof Error)return j}return null}return d(b)}function h(){function a(a,b,c,d){if(!r.isValidElement(a[b])){var e=t[d];return new Error("Invalid "+e+" `"+b+"` supplied to "+("`"+c+"`, expected a ReactElement."))}return null}return d(a)}function i(a){function b(b,c,d,e){if(!(b[c]instanceof a)){var f=t[e],g=a.name||v;return new Error("Invalid "+f+" `"+c+"` supplied to "+("`"+d+"`, expected instance of `"+g+"`."))}return null}return d(b)}function j(a){function b(b,c,d,e){for(var f=b[c],g=0;g<a.length;g++)if(f===a[g])return null;var h=t[e],i=JSON.stringify(a);return new Error("Invalid "+h+" `"+c+"` of value `"+f+"` "+("supplied to `"+d+"`, expected one of "+i+"."))}return d(b)}function k(a){function b(b,c,d,e){var f=b[c],g=p(f);if("object"!==g){var h=t[e];return new Error("Invalid "+h+" `"+c+"` of type "+("`"+g+"` supplied to `"+d+"`, expected an object."))}for(var i in f)if(f.hasOwnProperty(i)){var j=a(f,i,d,e);if(j instanceof Error)return j}return null}return d(b)}function l(a){function b(b,c,d,e){for(var f=0;f<a.length;f++){var g=a[f];if(null==g(b,c,d,e))return null}var h=t[e];return new Error("Invalid "+h+" `"+c+"` supplied to "+("`"+d+"`."))}return d(b)}function m(){function a(a,b,c,d){if(!o(a[b])){var e=t[d];return new Error("Invalid "+e+" `"+b+"` supplied to "+("`"+c+"`, expected a ReactNode."))}return null}return d(a)}function n(a){function b(b,c,d,e){var f=b[c],g=p(f);if("object"!==g){var h=t[e];return new Error("Invalid "+h+" `"+c+"` of type `"+g+"` "+("supplied to `"+d+"`, expected `object`."))}for(var i in a){var j=a[i];if(j){var k=j(f,i,d,e);if(k)return k}}return null}return d(b)}function o(a){switch(typeof a){case"number":case"string":case"undefined":return!0;case"boolean":return!a;case"object":if(Array.isArray(a))return a.every(o);if(null===a||r.isValidElement(a))return!0;a=s.extractIfFragment(a);for(var b in a)if(!o(a[b]))return!1;return!0;default:return!1}}function p(a){var b=typeof a;return Array.isArray(a)?"array":a instanceof RegExp?"object":b}function q(a){var b=p(a);if("object"===b){if(a instanceof Date)return"date";if(a instanceof RegExp)return"regexp"}return b}var r=a("./ReactElement"),s=a("./ReactFragment"),t=a("./ReactPropTypeLocationNames"),u=a("./emptyFunction"),v="<<anonymous>>",w=h(),x=m(),y={array:e("array"),bool:e("boolean"),func:e("function"),number:e("number"),object:e("object"),string:e("string"),any:f(),arrayOf:g,element:w,instanceOf:i,node:x,objectOf:k,oneOf:j,oneOfType:l,shape:n};b.exports=y},{"./ReactElement":59,"./ReactFragment":65,"./ReactPropTypeLocationNames":78,"./emptyFunction":116}],81:[function(a,b,c){"use strict";function d(){this.listenersToPut=[]}var e=a("./PooledClass"),f=a("./ReactBrowserEventEmitter"),g=a("./Object.assign");g(d.prototype,{enqueuePutListener:function(a,b,c){this.listenersToPut.push({rootNodeID:a,propKey:b,propValue:c})},putListeners:function(){for(var a=0;a<this.listenersToPut.length;a++){var b=this.listenersToPut[a];f.putListener(b.rootNodeID,b.propKey,b.propValue)}},reset:function(){this.listenersToPut.length=0},destructor:function(){this.reset()}}),e.addPoolingTo(d),b.exports=d},{"./Object.assign":28,"./PooledClass":29,"./ReactBrowserEventEmitter":32}],82:[function(a,b,c){"use strict";function d(){this.reinitializeTransaction(),this.renderToStaticMarkup=!1,this.reactMountReady=e.getPooled(null),this.putListenerQueue=i.getPooled()}var e=a("./CallbackQueue"),f=a("./PooledClass"),g=a("./ReactBrowserEventEmitter"),h=a("./ReactInputSelection"),i=a("./ReactPutListenerQueue"),j=a("./Transaction"),k=a("./Object.assign"),l={initialize:h.getSelectionInformation,close:h.restoreSelection},m={initialize:function(){var a=g.isEnabled();return g.setEnabled(!1),a},close:function(a){g.setEnabled(a)}},n={initialize:function(){this.reactMountReady.reset()},close:function(){this.reactMountReady.notifyAll()}},o={initialize:function(){this.putListenerQueue.reset()},close:function(){this.putListenerQueue.putListeners()}},p=[o,l,m,n],q={getTransactionWrappers:function(){return p},getReactMountReady:function(){return this.reactMountReady},getPutListenerQueue:function(){return this.putListenerQueue},destructor:function(){e.release(this.reactMountReady),this.reactMountReady=null,i.release(this.putListenerQueue),this.putListenerQueue=null}};k(d.prototype,j.Mixin,q),f.addPoolingTo(d),b.exports=d},{"./CallbackQueue":7,"./Object.assign":28,"./PooledClass":29,"./ReactBrowserEventEmitter":32,"./ReactInputSelection":67,"./ReactPutListenerQueue":81,"./Transaction":105}],83:[function(a,b,c){(function(c){"use strict";function d(){e.attachRefs(this,this._currentElement)}var e=a("./ReactRef"),f=a("./ReactElementValidator"),g={mountComponent:function(a,b,e,g){var h=a.mountComponent(b,e,g);return"production"!==c.env.NODE_ENV&&f.checkAndWarnForMutatedProps(a._currentElement),e.getReactMountReady().enqueue(d,a),h},unmountComponent:function(a){e.detachRefs(a,a._currentElement),a.unmountComponent()},receiveComponent:function(a,b,g,h){var i=a._currentElement;if(b!==i||null==b._owner){"production"!==c.env.NODE_ENV&&f.checkAndWarnForMutatedProps(b);var j=e.shouldUpdateRefs(i,b);j&&e.detachRefs(a,i),a.receiveComponent(b,g,h),j&&g.getReactMountReady().enqueue(d,a)}},performUpdateIfNecessary:function(a,b){a.performUpdateIfNecessary(b)}};b.exports=g}).call(this,a("_process"))},{"./ReactElementValidator":60,"./ReactRef":84,_process:1}],84:[function(a,b,c){"use strict";function d(a,b,c){"function"==typeof a?a(b.getPublicInstance()):f.addComponentAsRefTo(b,a,c);
}function e(a,b,c){"function"==typeof a?a(null):f.removeComponentAsRefFrom(b,a,c)}var f=a("./ReactOwner"),g={};g.attachRefs=function(a,b){var c=b.ref;null!=c&&d(c,a,b._owner)},g.shouldUpdateRefs=function(a,b){return b._owner!==a._owner||b.ref!==a.ref},g.detachRefs=function(a,b){var c=b.ref;null!=c&&e(c,a,b._owner)},b.exports=g},{"./ReactOwner":76}],85:[function(a,b,c){"use strict";var d={injectCreateReactRootIndex:function(a){e.createReactRootIndex=a}},e={createReactRootIndex:null,injection:d};b.exports=e},{}],86:[function(a,b,c){(function(c){"use strict";function d(a){"production"!==c.env.NODE_ENV?l(f.isValidElement(a),"renderToString(): You must pass a valid ReactElement."):l(f.isValidElement(a));var b;try{var d=g.createReactRootID();return b=i.getPooled(!1),b.perform(function(){var c=k(a,null),e=c.mountComponent(d,b,j);return h.addChecksumToMarkup(e)},null)}finally{i.release(b)}}function e(a){"production"!==c.env.NODE_ENV?l(f.isValidElement(a),"renderToStaticMarkup(): You must pass a valid ReactElement."):l(f.isValidElement(a));var b;try{var d=g.createReactRootID();return b=i.getPooled(!0),b.perform(function(){var c=k(a,null);return c.mountComponent(d,b,j)},null)}finally{i.release(b)}}var f=a("./ReactElement"),g=a("./ReactInstanceHandles"),h=a("./ReactMarkupChecksum"),i=a("./ReactServerRenderingTransaction"),j=a("./emptyObject"),k=a("./instantiateReactComponent"),l=a("./invariant");b.exports={renderToString:d,renderToStaticMarkup:e}}).call(this,a("_process"))},{"./ReactElement":59,"./ReactInstanceHandles":68,"./ReactMarkupChecksum":71,"./ReactServerRenderingTransaction":87,"./emptyObject":117,"./instantiateReactComponent":136,"./invariant":137,_process:1}],87:[function(a,b,c){"use strict";function d(a){this.reinitializeTransaction(),this.renderToStaticMarkup=a,this.reactMountReady=f.getPooled(null),this.putListenerQueue=g.getPooled()}var e=a("./PooledClass"),f=a("./CallbackQueue"),g=a("./ReactPutListenerQueue"),h=a("./Transaction"),i=a("./Object.assign"),j=a("./emptyFunction"),k={initialize:function(){this.reactMountReady.reset()},close:j},l={initialize:function(){this.putListenerQueue.reset()},close:j},m=[l,k],n={getTransactionWrappers:function(){return m},getReactMountReady:function(){return this.reactMountReady},getPutListenerQueue:function(){return this.putListenerQueue},destructor:function(){f.release(this.reactMountReady),this.reactMountReady=null,g.release(this.putListenerQueue),this.putListenerQueue=null}};i(d.prototype,h.Mixin,n),e.addPoolingTo(d),b.exports=d},{"./CallbackQueue":7,"./Object.assign":28,"./PooledClass":29,"./ReactPutListenerQueue":81,"./Transaction":105,"./emptyFunction":116}],88:[function(a,b,c){(function(c){"use strict";function d(a){a!==f.currentlyMountingInstance&&j.enqueueUpdate(a)}function e(a,b){"production"!==c.env.NODE_ENV?l(null==g.current,"%s(...): Cannot update during an existing state transition (such as within `render`). Render methods should be a pure function of props and state.",b):l(null==g.current);var d=i.get(a);return d?d===f.currentlyUnmountingInstance?null:d:("production"!==c.env.NODE_ENV&&("production"!==c.env.NODE_ENV?m(!b,"%s(...): Can only update a mounted or mounting component. This usually means you called %s() on an unmounted component. This is a no-op.",b,b):null),null)}var f=a("./ReactLifeCycle"),g=a("./ReactCurrentOwner"),h=a("./ReactElement"),i=a("./ReactInstanceMap"),j=a("./ReactUpdates"),k=a("./Object.assign"),l=a("./invariant"),m=a("./warning"),n={enqueueCallback:function(a,b){"production"!==c.env.NODE_ENV?l("function"==typeof b,"enqueueCallback(...): You called `setProps`, `replaceProps`, `setState`, `replaceState`, or `forceUpdate` with a callback that isn't callable."):l("function"==typeof b);var g=e(a);return g&&g!==f.currentlyMountingInstance?(g._pendingCallbacks?g._pendingCallbacks.push(b):g._pendingCallbacks=[b],void d(g)):null},enqueueCallbackInternal:function(a,b){"production"!==c.env.NODE_ENV?l("function"==typeof b,"enqueueCallback(...): You called `setProps`, `replaceProps`, `setState`, `replaceState`, or `forceUpdate` with a callback that isn't callable."):l("function"==typeof b),a._pendingCallbacks?a._pendingCallbacks.push(b):a._pendingCallbacks=[b],d(a)},enqueueForceUpdate:function(a){var b=e(a,"forceUpdate");b&&(b._pendingForceUpdate=!0,d(b))},enqueueReplaceState:function(a,b){var c=e(a,"replaceState");c&&(c._pendingStateQueue=[b],c._pendingReplaceState=!0,d(c))},enqueueSetState:function(a,b){var c=e(a,"setState");if(c){var f=c._pendingStateQueue||(c._pendingStateQueue=[]);f.push(b),d(c)}},enqueueSetProps:function(a,b){var f=e(a,"setProps");if(f){"production"!==c.env.NODE_ENV?l(f._isTopLevel,"setProps(...): You called `setProps` on a component with a parent. This is an anti-pattern since props will get reactively updated when rendered. Instead, change the owner's `render` method to pass the correct value as props to the component where it is created."):l(f._isTopLevel);var g=f._pendingElement||f._currentElement,i=k({},g.props,b);f._pendingElement=h.cloneAndReplaceProps(g,i),d(f)}},enqueueReplaceProps:function(a,b){var f=e(a,"replaceProps");if(f){"production"!==c.env.NODE_ENV?l(f._isTopLevel,"replaceProps(...): You called `replaceProps` on a component with a parent. This is an anti-pattern since props will get reactively updated when rendered. Instead, change the owner's `render` method to pass the correct value as props to the component where it is created."):l(f._isTopLevel);var g=f._pendingElement||f._currentElement;f._pendingElement=h.cloneAndReplaceProps(g,b),d(f)}},enqueueElementInternal:function(a,b){a._pendingElement=b,d(a)}};b.exports=n}).call(this,a("_process"))},{"./Object.assign":28,"./ReactCurrentOwner":41,"./ReactElement":59,"./ReactInstanceMap":69,"./ReactLifeCycle":70,"./ReactUpdates":89,"./invariant":137,"./warning":156,_process:1}],89:[function(a,b,c){(function(c){"use strict";function d(){"production"!==c.env.NODE_ENV?r(C.ReactReconcileTransaction&&w,"ReactUpdates: must inject a reconcile transaction class and batching strategy"):r(C.ReactReconcileTransaction&&w)}function e(){this.reinitializeTransaction(),this.dirtyComponentsLength=null,this.callbackQueue=k.getPooled(),this.reconcileTransaction=C.ReactReconcileTransaction.getPooled()}function f(a,b,c,e,f){d(),w.batchedUpdates(a,b,c,e,f)}function g(a,b){return a._mountOrder-b._mountOrder}function h(a){var b=a.dirtyComponentsLength;"production"!==c.env.NODE_ENV?r(b===t.length,"Expected flush transaction's stored dirty-components length (%s) to match dirty-components array length (%s).",b,t.length):r(b===t.length),t.sort(g);for(var d=0;b>d;d++){var e=t[d],f=e._pendingCallbacks;if(e._pendingCallbacks=null,o.performUpdateIfNecessary(e,a.reconcileTransaction),f)for(var h=0;h<f.length;h++)a.callbackQueue.enqueue(f[h],e.getPublicInstance())}}function i(a){return d(),"production"!==c.env.NODE_ENV?s(null==m.current,"enqueueUpdate(): Render methods should be a pure function of props and state; triggering nested component updates from render is not allowed. If necessary, trigger nested updates in componentDidUpdate."):null,w.isBatchingUpdates?void t.push(a):void w.batchedUpdates(i,a)}function j(a,b){"production"!==c.env.NODE_ENV?r(w.isBatchingUpdates,"ReactUpdates.asap: Can't enqueue an asap callback in a context whereupdates are not being batched."):r(w.isBatchingUpdates),u.enqueue(a,b),v=!0}var k=a("./CallbackQueue"),l=a("./PooledClass"),m=a("./ReactCurrentOwner"),n=a("./ReactPerf"),o=a("./ReactReconciler"),p=a("./Transaction"),q=a("./Object.assign"),r=a("./invariant"),s=a("./warning"),t=[],u=k.getPooled(),v=!1,w=null,x={initialize:function(){this.dirtyComponentsLength=t.length},close:function(){this.dirtyComponentsLength!==t.length?(t.splice(0,this.dirtyComponentsLength),A()):t.length=0}},y={initialize:function(){this.callbackQueue.reset()},close:function(){this.callbackQueue.notifyAll()}},z=[x,y];q(e.prototype,p.Mixin,{getTransactionWrappers:function(){return z},destructor:function(){this.dirtyComponentsLength=null,k.release(this.callbackQueue),this.callbackQueue=null,C.ReactReconcileTransaction.release(this.reconcileTransaction),this.reconcileTransaction=null},perform:function(a,b,c){return p.Mixin.perform.call(this,this.reconcileTransaction.perform,this.reconcileTransaction,a,b,c)}}),l.addPoolingTo(e);var A=function(){for(;t.length||v;){if(t.length){var a=e.getPooled();a.perform(h,null,a),e.release(a)}if(v){v=!1;var b=u;u=k.getPooled(),b.notifyAll(),k.release(b)}}};A=n.measure("ReactUpdates","flushBatchedUpdates",A);var B={injectReconcileTransaction:function(a){"production"!==c.env.NODE_ENV?r(a,"ReactUpdates: must provide a reconcile transaction class"):r(a),C.ReactReconcileTransaction=a},injectBatchingStrategy:function(a){"production"!==c.env.NODE_ENV?r(a,"ReactUpdates: must provide a batching strategy"):r(a),"production"!==c.env.NODE_ENV?r("function"==typeof a.batchedUpdates,"ReactUpdates: must provide a batchedUpdates() function"):r("function"==typeof a.batchedUpdates),"production"!==c.env.NODE_ENV?r("boolean"==typeof a.isBatchingUpdates,"ReactUpdates: must provide an isBatchingUpdates boolean attribute"):r("boolean"==typeof a.isBatchingUpdates),w=a}},C={ReactReconcileTransaction:null,batchedUpdates:f,enqueueUpdate:i,flushBatchedUpdates:A,injection:B,asap:j};b.exports=C}).call(this,a("_process"))},{"./CallbackQueue":7,"./Object.assign":28,"./PooledClass":29,"./ReactCurrentOwner":41,"./ReactPerf":77,"./ReactReconciler":83,"./Transaction":105,"./invariant":137,"./warning":156,_process:1}],90:[function(a,b,c){"use strict";var d=a("./DOMProperty"),e=d.injection.MUST_USE_ATTRIBUTE,f={Properties:{clipPath:e,cx:e,cy:e,d:e,dx:e,dy:e,fill:e,fillOpacity:e,fontFamily:e,fontSize:e,fx:e,fy:e,gradientTransform:e,gradientUnits:e,markerEnd:e,markerMid:e,markerStart:e,offset:e,opacity:e,patternContentUnits:e,patternUnits:e,points:e,preserveAspectRatio:e,r:e,rx:e,ry:e,spreadMethod:e,stopColor:e,stopOpacity:e,stroke:e,strokeDasharray:e,strokeLinecap:e,strokeOpacity:e,strokeWidth:e,textAnchor:e,transform:e,version:e,viewBox:e,x1:e,x2:e,x:e,y1:e,y2:e,y:e},DOMAttributeNames:{clipPath:"clip-path",fillOpacity:"fill-opacity",fontFamily:"font-family",fontSize:"font-size",gradientTransform:"gradientTransform",gradientUnits:"gradientUnits",markerEnd:"marker-end",markerMid:"marker-mid",markerStart:"marker-start",patternContentUnits:"patternContentUnits",patternUnits:"patternUnits",preserveAspectRatio:"preserveAspectRatio",spreadMethod:"spreadMethod",stopColor:"stop-color",stopOpacity:"stop-opacity",strokeDasharray:"stroke-dasharray",strokeLinecap:"stroke-linecap",strokeOpacity:"stroke-opacity",strokeWidth:"stroke-width",textAnchor:"text-anchor",viewBox:"viewBox"}};b.exports=f},{"./DOMProperty":11}],91:[function(a,b,c){"use strict";function d(a){if("selectionStart"in a&&h.hasSelectionCapabilities(a))return{start:a.selectionStart,end:a.selectionEnd};if(window.getSelection){var b=window.getSelection();return{anchorNode:b.anchorNode,anchorOffset:b.anchorOffset,focusNode:b.focusNode,focusOffset:b.focusOffset}}if(document.selection){var c=document.selection.createRange();return{parentElement:c.parentElement(),text:c.text,top:c.boundingTop,left:c.boundingLeft}}}function e(a){if(s||null==p||p!==j())return null;var b=d(p);if(!r||!m(r,b)){r=b;var c=i.getPooled(o.select,q,a);return c.type="select",c.target=p,g.accumulateTwoPhaseDispatches(c),c}}var f=a("./EventConstants"),g=a("./EventPropagators"),h=a("./ReactInputSelection"),i=a("./SyntheticEvent"),j=a("./getActiveElement"),k=a("./isTextInputElement"),l=a("./keyOf"),m=a("./shallowEqual"),n=f.topLevelTypes,o={select:{phasedRegistrationNames:{bubbled:l({onSelect:null}),captured:l({onSelectCapture:null})},dependencies:[n.topBlur,n.topContextMenu,n.topFocus,n.topKeyDown,n.topMouseDown,n.topMouseUp,n.topSelectionChange]}},p=null,q=null,r=null,s=!1,t={eventTypes:o,extractEvents:function(a,b,c,d){switch(a){case n.topFocus:(k(b)||"true"===b.contentEditable)&&(p=b,q=c,r=null);break;case n.topBlur:p=null,q=null,r=null;break;case n.topMouseDown:s=!0;break;case n.topContextMenu:case n.topMouseUp:return s=!1,e(d);case n.topSelectionChange:case n.topKeyDown:case n.topKeyUp:return e(d)}}};b.exports=t},{"./EventConstants":16,"./EventPropagators":21,"./ReactInputSelection":67,"./SyntheticEvent":97,"./getActiveElement":123,"./isTextInputElement":140,"./keyOf":143,"./shallowEqual":152}],92:[function(a,b,c){"use strict";var d=Math.pow(2,53),e={createReactRootIndex:function(){return Math.ceil(Math.random()*d)}};b.exports=e},{}],93:[function(a,b,c){(function(c){"use strict";var d=a("./EventConstants"),e=a("./EventPluginUtils"),f=a("./EventPropagators"),g=a("./SyntheticClipboardEvent"),h=a("./SyntheticEvent"),i=a("./SyntheticFocusEvent"),j=a("./SyntheticKeyboardEvent"),k=a("./SyntheticMouseEvent"),l=a("./SyntheticDragEvent"),m=a("./SyntheticTouchEvent"),n=a("./SyntheticUIEvent"),o=a("./SyntheticWheelEvent"),p=a("./getEventCharCode"),q=a("./invariant"),r=a("./keyOf"),s=a("./warning"),t=d.topLevelTypes,u={blur:{phasedRegistrationNames:{bubbled:r({onBlur:!0}),captured:r({onBlurCapture:!0})}},click:{phasedRegistrationNames:{bubbled:r({onClick:!0}),captured:r({onClickCapture:!0})}},contextMenu:{phasedRegistrationNames:{bubbled:r({onContextMenu:!0}),captured:r({onContextMenuCapture:!0})}},copy:{phasedRegistrationNames:{bubbled:r({onCopy:!0}),captured:r({onCopyCapture:!0})}},cut:{phasedRegistrationNames:{bubbled:r({onCut:!0}),captured:r({onCutCapture:!0})}},doubleClick:{phasedRegistrationNames:{bubbled:r({onDoubleClick:!0}),captured:r({onDoubleClickCapture:!0})}},drag:{phasedRegistrationNames:{bubbled:r({onDrag:!0}),captured:r({onDragCapture:!0})}},dragEnd:{phasedRegistrationNames:{bubbled:r({onDragEnd:!0}),captured:r({onDragEndCapture:!0})}},dragEnter:{phasedRegistrationNames:{bubbled:r({onDragEnter:!0}),captured:r({onDragEnterCapture:!0})}},dragExit:{phasedRegistrationNames:{bubbled:r({onDragExit:!0}),captured:r({onDragExitCapture:!0})}},dragLeave:{phasedRegistrationNames:{bubbled:r({onDragLeave:!0}),captured:r({onDragLeaveCapture:!0})}},dragOver:{phasedRegistrationNames:{bubbled:r({onDragOver:!0}),captured:r({onDragOverCapture:!0})}},dragStart:{phasedRegistrationNames:{bubbled:r({onDragStart:!0}),captured:r({onDragStartCapture:!0})}},drop:{phasedRegistrationNames:{bubbled:r({onDrop:!0}),captured:r({onDropCapture:!0})}},focus:{phasedRegistrationNames:{bubbled:r({onFocus:!0}),captured:r({onFocusCapture:!0})}},input:{phasedRegistrationNames:{bubbled:r({onInput:!0}),captured:r({onInputCapture:!0})}},keyDown:{phasedRegistrationNames:{bubbled:r({onKeyDown:!0}),captured:r({onKeyDownCapture:!0})}},keyPress:{phasedRegistrationNames:{bubbled:r({onKeyPress:!0}),captured:r({onKeyPressCapture:!0})}},keyUp:{phasedRegistrationNames:{bubbled:r({onKeyUp:!0}),captured:r({onKeyUpCapture:!0})}},load:{phasedRegistrationNames:{bubbled:r({onLoad:!0}),captured:r({onLoadCapture:!0})}},error:{phasedRegistrationNames:{bubbled:r({onError:!0}),captured:r({onErrorCapture:!0})}},mouseDown:{phasedRegistrationNames:{bubbled:r({onMouseDown:!0}),captured:r({onMouseDownCapture:!0})}},mouseMove:{phasedRegistrationNames:{bubbled:r({onMouseMove:!0}),captured:r({onMouseMoveCapture:!0})}},mouseOut:{phasedRegistrationNames:{bubbled:r({onMouseOut:!0}),captured:r({onMouseOutCapture:!0})}},mouseOver:{phasedRegistrationNames:{bubbled:r({onMouseOver:!0}),captured:r({onMouseOverCapture:!0})}},mouseUp:{phasedRegistrationNames:{bubbled:r({onMouseUp:!0}),captured:r({onMouseUpCapture:!0})}},paste:{phasedRegistrationNames:{bubbled:r({onPaste:!0}),captured:r({onPasteCapture:!0})}},reset:{phasedRegistrationNames:{bubbled:r({onReset:!0}),captured:r({onResetCapture:!0})}},scroll:{phasedRegistrationNames:{bubbled:r({onScroll:!0}),captured:r({onScrollCapture:!0})}},submit:{phasedRegistrationNames:{bubbled:r({onSubmit:!0}),captured:r({onSubmitCapture:!0})}},touchCancel:{phasedRegistrationNames:{bubbled:r({onTouchCancel:!0}),captured:r({onTouchCancelCapture:!0})}},touchEnd:{phasedRegistrationNames:{bubbled:r({onTouchEnd:!0}),captured:r({onTouchEndCapture:!0})}},touchMove:{phasedRegistrationNames:{bubbled:r({onTouchMove:!0}),captured:r({onTouchMoveCapture:!0})}},touchStart:{phasedRegistrationNames:{bubbled:r({onTouchStart:!0}),captured:r({onTouchStartCapture:!0})}},wheel:{phasedRegistrationNames:{bubbled:r({onWheel:!0}),captured:r({onWheelCapture:!0})}}},v={topBlur:u.blur,topClick:u.click,topContextMenu:u.contextMenu,topCopy:u.copy,topCut:u.cut,topDoubleClick:u.doubleClick,topDrag:u.drag,topDragEnd:u.dragEnd,topDragEnter:u.dragEnter,topDragExit:u.dragExit,topDragLeave:u.dragLeave,topDragOver:u.dragOver,topDragStart:u.dragStart,topDrop:u.drop,topError:u.error,topFocus:u.focus,topInput:u.input,topKeyDown:u.keyDown,topKeyPress:u.keyPress,topKeyUp:u.keyUp,topLoad:u.load,topMouseDown:u.mouseDown,topMouseMove:u.mouseMove,topMouseOut:u.mouseOut,topMouseOver:u.mouseOver,topMouseUp:u.mouseUp,topPaste:u.paste,topReset:u.reset,topScroll:u.scroll,topSubmit:u.submit,topTouchCancel:u.touchCancel,topTouchEnd:u.touchEnd,topTouchMove:u.touchMove,topTouchStart:u.touchStart,topWheel:u.wheel};for(var w in v)v[w].dependencies=[w];var x={eventTypes:u,executeDispatch:function(a,b,d){var f=e.executeDispatch(a,b,d);"production"!==c.env.NODE_ENV?s("boolean"!=typeof f,"Returning `false` from an event handler is deprecated and will be ignored in a future release. Instead, manually call e.stopPropagation() or e.preventDefault(), as appropriate."):null,f===!1&&(a.stopPropagation(),a.preventDefault())},extractEvents:function(a,b,d,e){var r=v[a];if(!r)return null;var s;switch(a){case t.topInput:case t.topLoad:case t.topError:case t.topReset:case t.topSubmit:s=h;break;case t.topKeyPress:if(0===p(e))return null;case t.topKeyDown:case t.topKeyUp:s=j;break;case t.topBlur:case t.topFocus:s=i;break;case t.topClick:if(2===e.button)return null;case t.topContextMenu:case t.topDoubleClick:case t.topMouseDown:case t.topMouseMove:case t.topMouseOut:case t.topMouseOver:case t.topMouseUp:s=k;break;case t.topDrag:case t.topDragEnd:case t.topDragEnter:case t.topDragExit:case t.topDragLeave:case t.topDragOver:case t.topDragStart:case t.topDrop:s=l;break;case t.topTouchCancel:case t.topTouchEnd:case t.topTouchMove:case t.topTouchStart:s=m;break;case t.topScroll:s=n;break;case t.topWheel:s=o;break;case t.topCopy:case t.topCut:case t.topPaste:s=g}"production"!==c.env.NODE_ENV?q(s,"SimpleEventPlugin: Unhandled event type, `%s`.",a):q(s);var u=s.getPooled(r,d,e);return f.accumulateTwoPhaseDispatches(u),u}};b.exports=x}).call(this,a("_process"))},{"./EventConstants":16,"./EventPluginUtils":20,"./EventPropagators":21,"./SyntheticClipboardEvent":94,"./SyntheticDragEvent":96,"./SyntheticEvent":97,"./SyntheticFocusEvent":98,"./SyntheticKeyboardEvent":100,"./SyntheticMouseEvent":101,"./SyntheticTouchEvent":102,"./SyntheticUIEvent":103,"./SyntheticWheelEvent":104,"./getEventCharCode":124,"./invariant":137,"./keyOf":143,"./warning":156,_process:1}],94:[function(a,b,c){"use strict";function d(a,b,c){e.call(this,a,b,c)}var e=a("./SyntheticEvent"),f={clipboardData:function(a){return"clipboardData"in a?a.clipboardData:window.clipboardData}};e.augmentClass(d,f),b.exports=d},{"./SyntheticEvent":97}],95:[function(a,b,c){"use strict";function d(a,b,c){e.call(this,a,b,c)}var e=a("./SyntheticEvent"),f={data:null};e.augmentClass(d,f),b.exports=d},{"./SyntheticEvent":97}],96:[function(a,b,c){"use strict";function d(a,b,c){e.call(this,a,b,c)}var e=a("./SyntheticMouseEvent"),f={dataTransfer:null};e.augmentClass(d,f),b.exports=d},{"./SyntheticMouseEvent":101}],97:[function(a,b,c){"use strict";function d(a,b,c){this.dispatchConfig=a,this.dispatchMarker=b,this.nativeEvent=c;var d=this.constructor.Interface;for(var e in d)if(d.hasOwnProperty(e)){var f=d[e];f?this[e]=f(c):this[e]=c[e]}var h=null!=c.defaultPrevented?c.defaultPrevented:c.returnValue===!1;h?this.isDefaultPrevented=g.thatReturnsTrue:this.isDefaultPrevented=g.thatReturnsFalse,this.isPropagationStopped=g.thatReturnsFalse}var e=a("./PooledClass"),f=a("./Object.assign"),g=a("./emptyFunction"),h=a("./getEventTarget"),i={type:null,target:h,currentTarget:g.thatReturnsNull,eventPhase:null,bubbles:null,cancelable:null,timeStamp:function(a){return a.timeStamp||Date.now()},defaultPrevented:null,isTrusted:null};f(d.prototype,{preventDefault:function(){this.defaultPrevented=!0;var a=this.nativeEvent;a.preventDefault?a.preventDefault():a.returnValue=!1,this.isDefaultPrevented=g.thatReturnsTrue},stopPropagation:function(){var a=this.nativeEvent;a.stopPropagation?a.stopPropagation():a.cancelBubble=!0,this.isPropagationStopped=g.thatReturnsTrue},persist:function(){this.isPersistent=g.thatReturnsTrue},isPersistent:g.thatReturnsFalse,destructor:function(){var a=this.constructor.Interface;for(var b in a)this[b]=null;this.dispatchConfig=null,this.dispatchMarker=null,this.nativeEvent=null}}),d.Interface=i,d.augmentClass=function(a,b){var c=this,d=Object.create(c.prototype);f(d,a.prototype),a.prototype=d,a.prototype.constructor=a,a.Interface=f({},c.Interface,b),a.augmentClass=c.augmentClass,e.addPoolingTo(a,e.threeArgumentPooler)},e.addPoolingTo(d,e.threeArgumentPooler),b.exports=d},{"./Object.assign":28,"./PooledClass":29,"./emptyFunction":116,"./getEventTarget":127}],98:[function(a,b,c){"use strict";function d(a,b,c){e.call(this,a,b,c)}var e=a("./SyntheticUIEvent"),f={relatedTarget:null};e.augmentClass(d,f),b.exports=d},{"./SyntheticUIEvent":103}],99:[function(a,b,c){"use strict";function d(a,b,c){e.call(this,a,b,c)}var e=a("./SyntheticEvent"),f={data:null};e.augmentClass(d,f),b.exports=d},{"./SyntheticEvent":97}],100:[function(a,b,c){"use strict";function d(a,b,c){e.call(this,a,b,c)}var e=a("./SyntheticUIEvent"),f=a("./getEventCharCode"),g=a("./getEventKey"),h=a("./getEventModifierState"),i={key:g,location:null,ctrlKey:null,shiftKey:null,altKey:null,metaKey:null,repeat:null,locale:null,getModifierState:h,charCode:function(a){return"keypress"===a.type?f(a):0},keyCode:function(a){return"keydown"===a.type||"keyup"===a.type?a.keyCode:0},which:function(a){return"keypress"===a.type?f(a):"keydown"===a.type||"keyup"===a.type?a.keyCode:0}};e.augmentClass(d,i),b.exports=d},{"./SyntheticUIEvent":103,"./getEventCharCode":124,"./getEventKey":125,"./getEventModifierState":126}],101:[function(a,b,c){"use strict";function d(a,b,c){e.call(this,a,b,c)}var e=a("./SyntheticUIEvent"),f=a("./ViewportMetrics"),g=a("./getEventModifierState"),h={screenX:null,screenY:null,clientX:null,clientY:null,ctrlKey:null,shiftKey:null,altKey:null,metaKey:null,getModifierState:g,button:function(a){var b=a.button;return"which"in a?b:2===b?2:4===b?1:0},buttons:null,relatedTarget:function(a){return a.relatedTarget||(a.fromElement===a.srcElement?a.toElement:a.fromElement)},pageX:function(a){return"pageX"in a?a.pageX:a.clientX+f.currentScrollLeft},pageY:function(a){return"pageY"in a?a.pageY:a.clientY+f.currentScrollTop}};e.augmentClass(d,h),b.exports=d},{"./SyntheticUIEvent":103,"./ViewportMetrics":106,"./getEventModifierState":126}],102:[function(a,b,c){"use strict";function d(a,b,c){e.call(this,a,b,c)}var e=a("./SyntheticUIEvent"),f=a("./getEventModifierState"),g={touches:null,targetTouches:null,changedTouches:null,altKey:null,metaKey:null,ctrlKey:null,shiftKey:null,getModifierState:f};e.augmentClass(d,g),b.exports=d},{"./SyntheticUIEvent":103,"./getEventModifierState":126}],103:[function(a,b,c){"use strict";function d(a,b,c){e.call(this,a,b,c)}var e=a("./SyntheticEvent"),f=a("./getEventTarget"),g={view:function(a){if(a.view)return a.view;var b=f(a);if(null!=b&&b.window===b)return b;var c=b.ownerDocument;return c?c.defaultView||c.parentWindow:window},detail:function(a){return a.detail||0}};e.augmentClass(d,g),b.exports=d},{"./SyntheticEvent":97,"./getEventTarget":127}],104:[function(a,b,c){"use strict";function d(a,b,c){e.call(this,a,b,c)}var e=a("./SyntheticMouseEvent"),f={deltaX:function(a){return"deltaX"in a?a.deltaX:"wheelDeltaX"in a?-a.wheelDeltaX:0},deltaY:function(a){return"deltaY"in a?a.deltaY:"wheelDeltaY"in a?-a.wheelDeltaY:"wheelDelta"in a?-a.wheelDelta:0},deltaZ:null,deltaMode:null};e.augmentClass(d,f),b.exports=d},{"./SyntheticMouseEvent":101}],105:[function(a,b,c){(function(c){"use strict";var d=a("./invariant"),e={reinitializeTransaction:function(){this.transactionWrappers=this.getTransactionWrappers(),this.wrapperInitData?this.wrapperInitData.length=0:this.wrapperInitData=[],this._isInTransaction=!1},_isInTransaction:!1,getTransactionWrappers:null,isInTransaction:function(){return!!this._isInTransaction},perform:function(a,b,e,f,g,h,i,j){"production"!==c.env.NODE_ENV?d(!this.isInTransaction(),"Transaction.perform(...): Cannot initialize a transaction when there is already an outstanding transaction."):d(!this.isInTransaction());var k,l;try{this._isInTransaction=!0,k=!0,this.initializeAll(0),l=a.call(b,e,f,g,h,i,j),k=!1}finally{try{if(k)try{this.closeAll(0)}catch(m){}else this.closeAll(0)}finally{this._isInTransaction=!1}}return l},initializeAll:function(a){for(var b=this.transactionWrappers,c=a;c<b.length;c++){var d=b[c];try{this.wrapperInitData[c]=f.OBSERVED_ERROR,this.wrapperInitData[c]=d.initialize?d.initialize.call(this):null}finally{if(this.wrapperInitData[c]===f.OBSERVED_ERROR)try{this.initializeAll(c+1)}catch(e){}}}},closeAll:function(a){"production"!==c.env.NODE_ENV?d(this.isInTransaction(),"Transaction.closeAll(): Cannot close transaction when none are open."):d(this.isInTransaction());for(var b=this.transactionWrappers,e=a;e<b.length;e++){var g,h=b[e],i=this.wrapperInitData[e];try{g=!0,i!==f.OBSERVED_ERROR&&h.close&&h.close.call(this,i),g=!1}finally{if(g)try{this.closeAll(e+1)}catch(j){}}}this.wrapperInitData.length=0}},f={Mixin:e,OBSERVED_ERROR:{}};b.exports=f}).call(this,a("_process"))},{"./invariant":137,_process:1}],106:[function(a,b,c){"use strict";var d={currentScrollLeft:0,currentScrollTop:0,refreshScrollValues:function(a){d.currentScrollLeft=a.x,d.currentScrollTop=a.y}};b.exports=d},{}],107:[function(a,b,c){(function(c){"use strict";function d(a,b){if("production"!==c.env.NODE_ENV?e(null!=b,"accumulateInto(...): Accumulated items must not be null or undefined."):e(null!=b),null==a)return b;var d=Array.isArray(a),f=Array.isArray(b);return d&&f?(a.push.apply(a,b),a):d?(a.push(b),a):f?[a].concat(b):[a,b]}var e=a("./invariant");b.exports=d}).call(this,a("_process"))},{"./invariant":137,_process:1}],108:[function(a,b,c){"use strict";function d(a){for(var b=1,c=0,d=0;d<a.length;d++)b=(b+a.charCodeAt(d))%e,c=(c+b)%e;return b|c<<16}var e=65521;b.exports=d},{}],109:[function(a,b,c){function d(a){return a.replace(e,function(a,b){return b.toUpperCase()})}var e=/-(.)/g;b.exports=d},{}],110:[function(a,b,c){"use strict";function d(a){return e(a.replace(f,"ms-"))}var e=a("./camelize"),f=/^-ms-/;b.exports=d},{"./camelize":109}],111:[function(a,b,c){function d(a,b){return a&&b?a===b?!0:e(a)?!1:e(b)?d(a,b.parentNode):a.contains?a.contains(b):a.compareDocumentPosition?!!(16&a.compareDocumentPosition(b)):!1:!1}var e=a("./isTextNode");b.exports=d},{"./isTextNode":141}],112:[function(a,b,c){function d(a){return!!a&&("object"==typeof a||"function"==typeof a)&&"length"in a&&!("setInterval"in a)&&"number"!=typeof a.nodeType&&(Array.isArray(a)||"callee"in a||"item"in a)}function e(a){return d(a)?Array.isArray(a)?a.slice():f(a):[a]}var f=a("./toArray");b.exports=e},{"./toArray":154}],113:[function(a,b,c){(function(c){"use strict";function d(a){var b=f.createFactory(a),d=e.createClass({tagName:a.toUpperCase(),displayName:"ReactFullPageComponent"+a,componentWillUnmount:function(){"production"!==c.env.NODE_ENV?g(!1,"%s tried to unmount. Because of cross-browser quirks it is impossible to unmount some top-level components (eg <html>, <head>, and <body>) reliably and efficiently. To fix this, have a single top-level component that never unmounts render these elements.",this.constructor.displayName):g(!1)},render:function(){return b(this.props)}});return d}var e=a("./ReactClass"),f=a("./ReactElement"),g=a("./invariant");b.exports=d}).call(this,a("_process"))},{"./ReactClass":35,"./ReactElement":59,"./invariant":137,_process:1}],114:[function(a,b,c){(function(c){function d(a){var b=a.match(k);return b&&b[1].toLowerCase()}function e(a,b){var e=j;"production"!==c.env.NODE_ENV?i(!!j,"createNodesFromMarkup dummy not initialized"):i(!!j);var f=d(a),k=f&&h(f);if(k){e.innerHTML=k[1]+a+k[2];for(var l=k[0];l--;)e=e.lastChild}else e.innerHTML=a;var m=e.getElementsByTagName("script");m.length&&("production"!==c.env.NODE_ENV?i(b,"createNodesFromMarkup(...): Unexpected <script> element rendered."):i(b),g(m).forEach(b));for(var n=g(e.childNodes);e.lastChild;)e.removeChild(e.lastChild);return n}var f=a("./ExecutionEnvironment"),g=a("./createArrayFromMixed"),h=a("./getMarkupWrap"),i=a("./invariant"),j=f.canUseDOM?document.createElement("div"):null,k=/^\s*<(\w+)/;b.exports=e}).call(this,a("_process"))},{"./ExecutionEnvironment":22,"./createArrayFromMixed":112,"./getMarkupWrap":129,"./invariant":137,_process:1}],115:[function(a,b,c){"use strict";function d(a,b){var c=null==b||"boolean"==typeof b||""===b;if(c)return"";var d=isNaN(b);return d||0===b||f.hasOwnProperty(a)&&f[a]?""+b:("string"==typeof b&&(b=b.trim()),b+"px")}var e=a("./CSSProperty"),f=e.isUnitlessNumber;b.exports=d},{"./CSSProperty":5}],116:[function(a,b,c){function d(a){return function(){return a}}function e(){}e.thatReturns=d,e.thatReturnsFalse=d(!1),e.thatReturnsTrue=d(!0),e.thatReturnsNull=d(null),e.thatReturnsThis=function(){return this},e.thatReturnsArgument=function(a){return a},b.exports=e},{}],117:[function(a,b,c){(function(a){"use strict";var c={};"production"!==a.env.NODE_ENV&&Object.freeze(c),b.exports=c}).call(this,a("_process"))},{_process:1}],118:[function(a,b,c){"use strict";function d(a){return f[a]}function e(a){return(""+a).replace(g,d)}var f={"&":"&amp;",">":"&gt;","<":"&lt;",'"':"&quot;","'":"&#x27;"},g=/[&><"']/g;b.exports=e},{}],119:[function(a,b,c){(function(c){"use strict";function d(a){if("production"!==c.env.NODE_ENV){var b=e.current;null!==b&&("production"!==c.env.NODE_ENV?j(b._warnedAboutRefsInRender,"%s is accessing getDOMNode or findDOMNode inside its render(). render() should be a pure function of props and state. It should never access something that requires stale data from the previous render, such as refs. Move this logic to componentDidMount and componentDidUpdate instead.",b.getName()||"A component"):null,b._warnedAboutRefsInRender=!0)}return null==a?null:i(a)?a:f.has(a)?g.getNodeFromInstance(a):("production"!==c.env.NODE_ENV?h(null==a.render||"function"!=typeof a.render,"Component (with keys: %s) contains `render` method but is not mounted in the DOM",Object.keys(a)):h(null==a.render||"function"!=typeof a.render),void("production"!==c.env.NODE_ENV?h(!1,"Element appears to be neither ReactComponent nor DOMNode (keys: %s)",Object.keys(a)):h(!1)))}var e=a("./ReactCurrentOwner"),f=a("./ReactInstanceMap"),g=a("./ReactMount"),h=a("./invariant"),i=a("./isNode"),j=a("./warning");b.exports=d}).call(this,a("_process"))},{"./ReactCurrentOwner":41,"./ReactInstanceMap":69,"./ReactMount":72,"./invariant":137,"./isNode":139,"./warning":156,_process:1}],120:[function(a,b,c){(function(c){"use strict";function d(a,b,d){var e=a,f=!e.hasOwnProperty(d);"production"!==c.env.NODE_ENV&&("production"!==c.env.NODE_ENV?g(f,"flattenChildren(...): Encountered two children with the same key, `%s`. Child keys must be unique; when two children share a key, only the first child will be used.",d):null),f&&null!=b&&(e[d]=b)}function e(a){if(null==a)return a;var b={};return f(a,d,b),b}var f=a("./traverseAllChildren"),g=a("./warning");b.exports=e}).call(this,a("_process"))},{"./traverseAllChildren":155,"./warning":156,_process:1}],121:[function(a,b,c){"use strict";function d(a){try{a.focus()}catch(b){}}b.exports=d},{}],122:[function(a,b,c){"use strict";var d=function(a,b,c){Array.isArray(a)?a.forEach(b,c):a&&b.call(c,a)};b.exports=d},{}],123:[function(a,b,c){function d(){try{return document.activeElement||document.body}catch(a){return document.body;
}}b.exports=d},{}],124:[function(a,b,c){"use strict";function d(a){var b,c=a.keyCode;return"charCode"in a?(b=a.charCode,0===b&&13===c&&(b=13)):b=c,b>=32||13===b?b:0}b.exports=d},{}],125:[function(a,b,c){"use strict";function d(a){if(a.key){var b=f[a.key]||a.key;if("Unidentified"!==b)return b}if("keypress"===a.type){var c=e(a);return 13===c?"Enter":String.fromCharCode(c)}return"keydown"===a.type||"keyup"===a.type?g[a.keyCode]||"Unidentified":""}var e=a("./getEventCharCode"),f={Esc:"Escape",Spacebar:" ",Left:"ArrowLeft",Up:"ArrowUp",Right:"ArrowRight",Down:"ArrowDown",Del:"Delete",Win:"OS",Menu:"ContextMenu",Apps:"ContextMenu",Scroll:"ScrollLock",MozPrintableKey:"Unidentified"},g={8:"Backspace",9:"Tab",12:"Clear",13:"Enter",16:"Shift",17:"Control",18:"Alt",19:"Pause",20:"CapsLock",27:"Escape",32:" ",33:"PageUp",34:"PageDown",35:"End",36:"Home",37:"ArrowLeft",38:"ArrowUp",39:"ArrowRight",40:"ArrowDown",45:"Insert",46:"Delete",112:"F1",113:"F2",114:"F3",115:"F4",116:"F5",117:"F6",118:"F7",119:"F8",120:"F9",121:"F10",122:"F11",123:"F12",144:"NumLock",145:"ScrollLock",224:"Meta"};b.exports=d},{"./getEventCharCode":124}],126:[function(a,b,c){"use strict";function d(a){var b=this,c=b.nativeEvent;if(c.getModifierState)return c.getModifierState(a);var d=f[a];return d?!!c[d]:!1}function e(a){return d}var f={Alt:"altKey",Control:"ctrlKey",Meta:"metaKey",Shift:"shiftKey"};b.exports=e},{}],127:[function(a,b,c){"use strict";function d(a){var b=a.target||a.srcElement||window;return 3===b.nodeType?b.parentNode:b}b.exports=d},{}],128:[function(a,b,c){"use strict";function d(a){var b=a&&(e&&a[e]||a[f]);return"function"==typeof b?b:void 0}var e="function"==typeof Symbol&&Symbol.iterator,f="@@iterator";b.exports=d},{}],129:[function(a,b,c){(function(c){function d(a){return"production"!==c.env.NODE_ENV?f(!!g,"Markup wrapping node not initialized"):f(!!g),m.hasOwnProperty(a)||(a="*"),h.hasOwnProperty(a)||("*"===a?g.innerHTML="<link />":g.innerHTML="<"+a+"></"+a+">",h[a]=!g.firstChild),h[a]?m[a]:null}var e=a("./ExecutionEnvironment"),f=a("./invariant"),g=e.canUseDOM?document.createElement("div"):null,h={circle:!0,clipPath:!0,defs:!0,ellipse:!0,g:!0,line:!0,linearGradient:!0,path:!0,polygon:!0,polyline:!0,radialGradient:!0,rect:!0,stop:!0,text:!0},i=[1,'<select multiple="true">',"</select>"],j=[1,"<table>","</table>"],k=[3,"<table><tbody><tr>","</tr></tbody></table>"],l=[1,"<svg>","</svg>"],m={"*":[1,"?<div>","</div>"],area:[1,"<map>","</map>"],col:[2,"<table><tbody></tbody><colgroup>","</colgroup></table>"],legend:[1,"<fieldset>","</fieldset>"],param:[1,"<object>","</object>"],tr:[2,"<table><tbody>","</tbody></table>"],optgroup:i,option:i,caption:j,colgroup:j,tbody:j,tfoot:j,thead:j,td:k,th:k,circle:l,clipPath:l,defs:l,ellipse:l,g:l,line:l,linearGradient:l,path:l,polygon:l,polyline:l,radialGradient:l,rect:l,stop:l,text:l};b.exports=d}).call(this,a("_process"))},{"./ExecutionEnvironment":22,"./invariant":137,_process:1}],130:[function(a,b,c){"use strict";function d(a){for(;a&&a.firstChild;)a=a.firstChild;return a}function e(a){for(;a;){if(a.nextSibling)return a.nextSibling;a=a.parentNode}}function f(a,b){for(var c=d(a),f=0,g=0;c;){if(3===c.nodeType){if(g=f+c.textContent.length,b>=f&&g>=b)return{node:c,offset:b-f};f=g}c=d(e(c))}}b.exports=f},{}],131:[function(a,b,c){"use strict";function d(a){return a?a.nodeType===e?a.documentElement:a.firstChild:null}var e=9;b.exports=d},{}],132:[function(a,b,c){"use strict";function d(){return!f&&e.canUseDOM&&(f="textContent"in document.documentElement?"textContent":"innerText"),f}var e=a("./ExecutionEnvironment"),f=null;b.exports=d},{"./ExecutionEnvironment":22}],133:[function(a,b,c){"use strict";function d(a){return a===window?{x:window.pageXOffset||document.documentElement.scrollLeft,y:window.pageYOffset||document.documentElement.scrollTop}:{x:a.scrollLeft,y:a.scrollTop}}b.exports=d},{}],134:[function(a,b,c){function d(a){return a.replace(e,"-$1").toLowerCase()}var e=/([A-Z])/g;b.exports=d},{}],135:[function(a,b,c){"use strict";function d(a){return e(a).replace(f,"-ms-")}var e=a("./hyphenate"),f=/^ms-/;b.exports=d},{"./hyphenate":134}],136:[function(a,b,c){(function(c){"use strict";function d(a){return"function"==typeof a&&"undefined"!=typeof a.prototype&&"function"==typeof a.prototype.mountComponent&&"function"==typeof a.prototype.receiveComponent}function e(a,b){var e;if((null===a||a===!1)&&(a=g.emptyElement),"object"==typeof a){var f=a;"production"!==c.env.NODE_ENV&&("production"!==c.env.NODE_ENV?k(f&&("function"==typeof f.type||"string"==typeof f.type),"Only functions or strings can be mounted as React components."):null),e=b===f.type&&"string"==typeof f.type?h.createInternalComponent(f):d(f.type)?new f.type(f):new l}else"string"==typeof a||"number"==typeof a?e=h.createInstanceForText(a):"production"!==c.env.NODE_ENV?j(!1,"Encountered invalid React node of type %s",typeof a):j(!1);return"production"!==c.env.NODE_ENV&&("production"!==c.env.NODE_ENV?k("function"==typeof e.construct&&"function"==typeof e.mountComponent&&"function"==typeof e.receiveComponent&&"function"==typeof e.unmountComponent,"Only React Components can be mounted."):null),e.construct(a),e._mountIndex=0,e._mountImage=null,"production"!==c.env.NODE_ENV&&(e._isOwnerNecessary=!1,e._warnedAboutRefsInRender=!1),"production"!==c.env.NODE_ENV&&Object.preventExtensions&&Object.preventExtensions(e),e}var f=a("./ReactCompositeComponent"),g=a("./ReactEmptyComponent"),h=a("./ReactNativeComponent"),i=a("./Object.assign"),j=a("./invariant"),k=a("./warning"),l=function(){};i(l.prototype,f.Mixin,{_instantiateReactComponent:e}),b.exports=e}).call(this,a("_process"))},{"./Object.assign":28,"./ReactCompositeComponent":39,"./ReactEmptyComponent":61,"./ReactNativeComponent":75,"./invariant":137,"./warning":156,_process:1}],137:[function(a,b,c){(function(a){"use strict";var c=function(b,c,d,e,f,g,h,i){if("production"!==a.env.NODE_ENV&&void 0===c)throw new Error("invariant requires an error message argument");if(!b){var j;if(void 0===c)j=new Error("Minified exception occurred; use the non-minified dev environment for the full error message and additional helpful warnings.");else{var k=[d,e,f,g,h,i],l=0;j=new Error("Invariant Violation: "+c.replace(/%s/g,function(){return k[l++]}))}throw j.framesToPop=1,j}};b.exports=c}).call(this,a("_process"))},{_process:1}],138:[function(a,b,c){"use strict";function d(a,b){if(!f.canUseDOM||b&&!("addEventListener"in document))return!1;var c="on"+a,d=c in document;if(!d){var g=document.createElement("div");g.setAttribute(c,"return;"),d="function"==typeof g[c]}return!d&&e&&"wheel"===a&&(d=document.implementation.hasFeature("Events.wheel","3.0")),d}var e,f=a("./ExecutionEnvironment");f.canUseDOM&&(e=document.implementation&&document.implementation.hasFeature&&document.implementation.hasFeature("","")!==!0),b.exports=d},{"./ExecutionEnvironment":22}],139:[function(a,b,c){function d(a){return!(!a||!("function"==typeof Node?a instanceof Node:"object"==typeof a&&"number"==typeof a.nodeType&&"string"==typeof a.nodeName))}b.exports=d},{}],140:[function(a,b,c){"use strict";function d(a){return a&&("INPUT"===a.nodeName&&e[a.type]||"TEXTAREA"===a.nodeName)}var e={color:!0,date:!0,datetime:!0,"datetime-local":!0,email:!0,month:!0,number:!0,password:!0,range:!0,search:!0,tel:!0,text:!0,time:!0,url:!0,week:!0};b.exports=d},{}],141:[function(a,b,c){function d(a){return e(a)&&3==a.nodeType}var e=a("./isNode");b.exports=d},{"./isNode":139}],142:[function(a,b,c){(function(c){"use strict";var d=a("./invariant"),e=function(a){var b,e={};"production"!==c.env.NODE_ENV?d(a instanceof Object&&!Array.isArray(a),"keyMirror(...): Argument must be an object."):d(a instanceof Object&&!Array.isArray(a));for(b in a)a.hasOwnProperty(b)&&(e[b]=b);return e};b.exports=e}).call(this,a("_process"))},{"./invariant":137,_process:1}],143:[function(a,b,c){var d=function(a){var b;for(b in a)if(a.hasOwnProperty(b))return b;return null};b.exports=d},{}],144:[function(a,b,c){"use strict";function d(a,b,c){if(!a)return null;var d={};for(var f in a)e.call(a,f)&&(d[f]=b.call(c,a[f],f,a));return d}var e=Object.prototype.hasOwnProperty;b.exports=d},{}],145:[function(a,b,c){"use strict";function d(a){var b={};return function(c){return b.hasOwnProperty(c)||(b[c]=a.call(this,c)),b[c]}}b.exports=d},{}],146:[function(a,b,c){(function(c){"use strict";function d(a){return"production"!==c.env.NODE_ENV?f(e.isValidElement(a),"onlyChild must be passed a children with exactly one child."):f(e.isValidElement(a)),a}var e=a("./ReactElement"),f=a("./invariant");b.exports=d}).call(this,a("_process"))},{"./ReactElement":59,"./invariant":137,_process:1}],147:[function(a,b,c){"use strict";var d,e=a("./ExecutionEnvironment");e.canUseDOM&&(d=window.performance||window.msPerformance||window.webkitPerformance),b.exports=d||{}},{"./ExecutionEnvironment":22}],148:[function(a,b,c){var d=a("./performance");d&&d.now||(d=Date);var e=d.now.bind(d);b.exports=e},{"./performance":147}],149:[function(a,b,c){"use strict";function d(a){return'"'+e(a)+'"'}var e=a("./escapeTextContentForBrowser");b.exports=d},{"./escapeTextContentForBrowser":118}],150:[function(a,b,c){"use strict";var d=a("./ExecutionEnvironment"),e=/^[ \r\n\t\f]/,f=/<(!--|link|noscript|meta|script|style)[ \r\n\t\f\/>]/,g=function(a,b){a.innerHTML=b};if("undefined"!=typeof MSApp&&MSApp.execUnsafeLocalFunction&&(g=function(a,b){MSApp.execUnsafeLocalFunction(function(){a.innerHTML=b})}),d.canUseDOM){var h=document.createElement("div");h.innerHTML=" ",""===h.innerHTML&&(g=function(a,b){if(a.parentNode&&a.parentNode.replaceChild(a,a),e.test(b)||"<"===b[0]&&f.test(b)){a.innerHTML="\ufeff"+b;var c=a.firstChild;1===c.data.length?a.removeChild(c):c.deleteData(0,1)}else a.innerHTML=b})}b.exports=g},{"./ExecutionEnvironment":22}],151:[function(a,b,c){"use strict";var d=a("./ExecutionEnvironment"),e=a("./escapeTextContentForBrowser"),f=a("./setInnerHTML"),g=function(a,b){a.textContent=b};d.canUseDOM&&("textContent"in document.documentElement||(g=function(a,b){f(a,e(b))})),b.exports=g},{"./ExecutionEnvironment":22,"./escapeTextContentForBrowser":118,"./setInnerHTML":150}],152:[function(a,b,c){"use strict";function d(a,b){if(a===b)return!0;var c;for(c in a)if(a.hasOwnProperty(c)&&(!b.hasOwnProperty(c)||a[c]!==b[c]))return!1;for(c in b)if(b.hasOwnProperty(c)&&!a.hasOwnProperty(c))return!1;return!0}b.exports=d},{}],153:[function(a,b,c){(function(c){"use strict";function d(a,b){if(null!=a&&null!=b){var d=typeof a,f=typeof b;if("string"===d||"number"===d)return"string"===f||"number"===f;if("object"===f&&a.type===b.type&&a.key===b.key){var g=a._owner===b._owner,h=null,i=null,j=null;return"production"!==c.env.NODE_ENV&&(g||(null!=a._owner&&null!=a._owner.getPublicInstance()&&null!=a._owner.getPublicInstance().constructor&&(h=a._owner.getPublicInstance().constructor.displayName),null!=b._owner&&null!=b._owner.getPublicInstance()&&null!=b._owner.getPublicInstance().constructor&&(i=b._owner.getPublicInstance().constructor.displayName),null!=b.type&&null!=b.type.displayName&&(j=b.type.displayName),null!=b.type&&"string"==typeof b.type&&(j=b.type),("string"!=typeof b.type||"input"===b.type||"textarea"===b.type)&&(null!=a._owner&&a._owner._isOwnerNecessary===!1||null!=b._owner&&b._owner._isOwnerNecessary===!1)&&(null!=a._owner&&(a._owner._isOwnerNecessary=!0),null!=b._owner&&(b._owner._isOwnerNecessary=!0),"production"!==c.env.NODE_ENV?e(!1,"<%s /> is being rendered by both %s and %s using the same key (%s) in the same place. Currently, this means that they don't preserve state. This behavior should be very rare so we're considering deprecating it. Please contact the React team and explain your use case so that we can take that into consideration.",j||"Unknown Component",h||"[Unknown]",i||"[Unknown]",a.key):null))),g}}return!1}var e=a("./warning");b.exports=d}).call(this,a("_process"))},{"./warning":156,_process:1}],154:[function(a,b,c){(function(c){function d(a){var b=a.length;if("production"!==c.env.NODE_ENV?e(!Array.isArray(a)&&("object"==typeof a||"function"==typeof a),"toArray: Array-like object expected"):e(!Array.isArray(a)&&("object"==typeof a||"function"==typeof a)),"production"!==c.env.NODE_ENV?e("number"==typeof b,"toArray: Object needs a length property"):e("number"==typeof b),"production"!==c.env.NODE_ENV?e(0===b||b-1 in a,"toArray: Object should have keys for indices"):e(0===b||b-1 in a),a.hasOwnProperty)try{return Array.prototype.slice.call(a)}catch(d){}for(var f=Array(b),g=0;b>g;g++)f[g]=a[g];return f}var e=a("./invariant");b.exports=d}).call(this,a("_process"))},{"./invariant":137,_process:1}],155:[function(a,b,c){(function(c){"use strict";function d(a){return r[a]}function e(a,b){return a&&null!=a.key?g(a.key):b.toString(36)}function f(a){return(""+a).replace(s,d)}function g(a){return"$"+f(a)}function h(a,b,d,f,i){var l=typeof a;if(("undefined"===l||"boolean"===l)&&(a=null),null===a||"string"===l||"number"===l||j.isValidElement(a))return f(i,a,""===b?p+e(a,0):b,d),1;var r,s,u,v=0;if(Array.isArray(a))for(var w=0;w<a.length;w++)r=a[w],s=(""!==b?b+q:p)+e(r,w),u=d+v,v+=h(r,s,u,f,i);else{var x=m(a);if(x){var y,z=x.call(a);if(x!==a.entries)for(var A=0;!(y=z.next()).done;)r=y.value,s=(""!==b?b+q:p)+e(r,A++),u=d+v,v+=h(r,s,u,f,i);else for("production"!==c.env.NODE_ENV&&("production"!==c.env.NODE_ENV?o(t,"Using Maps as children is not yet fully supported. It is an experimental feature that might be removed. Convert it to a sequence / iterable of keyed ReactElements instead."):null,t=!0);!(y=z.next()).done;){var B=y.value;B&&(r=B[1],s=(""!==b?b+q:p)+g(B[0])+q+e(r,0),u=d+v,v+=h(r,s,u,f,i))}}else if("object"===l){"production"!==c.env.NODE_ENV?n(1!==a.nodeType,"traverseAllChildren(...): Encountered an invalid child; DOM elements are not valid children of React components."):n(1!==a.nodeType);var C=k.extract(a);for(var D in C)C.hasOwnProperty(D)&&(r=C[D],s=(""!==b?b+q:p)+g(D)+q+e(r,0),u=d+v,v+=h(r,s,u,f,i))}}return v}function i(a,b,c){return null==a?0:h(a,"",0,b,c)}var j=a("./ReactElement"),k=a("./ReactFragment"),l=a("./ReactInstanceHandles"),m=a("./getIteratorFn"),n=a("./invariant"),o=a("./warning"),p=l.SEPARATOR,q=":",r={"=":"=0",".":"=1",":":"=2"},s=/[=.:]/g,t=!1;b.exports=i}).call(this,a("_process"))},{"./ReactElement":59,"./ReactFragment":65,"./ReactInstanceHandles":68,"./getIteratorFn":128,"./invariant":137,"./warning":156,_process:1}],156:[function(a,b,c){(function(c){"use strict";var d=a("./emptyFunction"),e=d;"production"!==c.env.NODE_ENV&&(e=function(a,b){for(var c=[],d=2,e=arguments.length;e>d;d++)c.push(arguments[d]);if(void 0===b)throw new Error("`warning(condition, format, ...args)` requires a warning message argument");if(b.length<10||/^[s\W]*$/.test(b))throw new Error("The warning format should be able to uniquely identify this warning. Please, use a more descriptive format than: "+b);if(0!==b.indexOf("Failed Composite propType: ")&&!a){var f=0,g="Warning: "+b.replace(/%s/g,function(){return c[f++]});console.warn(g);try{throw new Error(g)}catch(h){}}}),b.exports=e}).call(this,a("_process"))},{"./emptyFunction":116,_process:1}],157:[function(a,b,c){b.exports=a("./lib/React")},{"./lib/React":30}],158:[function(a,b,c){"use strict";function d(a){return a&&a.__esModule?a:{"default":a}}function e(a,b){if(!(a instanceof b))throw new TypeError("Cannot call a class as a function")}function f(a,b){if(!a)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!b||"object"!=typeof b&&"function"!=typeof b?a:b}function g(a,b){if("function"!=typeof b&&null!==b)throw new TypeError("Super expression must either be null or a function, not "+typeof b);a.prototype=Object.create(b&&b.prototype,{constructor:{value:a,enumerable:!1,writable:!0,configurable:!0}}),b&&(Object.setPrototypeOf?Object.setPrototypeOf(a,b):a.__proto__=b)}function h(a){return a&&"undefined"!=typeof Symbol&&a.constructor===Symbol?"symbol":typeof a}var i=function(){function a(a,b){for(var c=0;c<b.length;c++){var d=b[c];d.enumerable=d.enumerable||!1,d.configurable=!0,"value"in d&&(d.writable=!0),Object.defineProperty(a,d.key,d)}}return function(b,c,d){return c&&a(b.prototype,c),d&&a(b,d),b}}();Object.defineProperty(c,"__esModule",{value:!0});var j=a("react"),k=d(j),l=a("lodash"),m=d(l),n=function(a){function b(a){e(this,b),console.info("[SmallGrid] constructor");var c=f(this,Object.getPrototypeOf(b).call(this,a));return c.state={edit_idx:null,edit_prop:null,limit:20,page:1,total_pages:1,sort_by:null,sort_dir:"desc"},c}return g(b,a),i(b,[{key:"componentWillMount",value:function(){console.info("[SmallGrid] componentWillMount"),m["default"].has(this.props,"rows")||(console.error("[SmallGrid] no rows attribute found"),this.props.rows=[]),m["default"].has(this.props,"cols")||(console.error("[SmallGrid] no cols attribute found"),this.props.rows=[],this.props.cols=[]),m["default"].isArray(this.props.rows)||(console.error("[SmallGrid] rows prop is not an array"),this.props.rows=[]),m["default"].isArray(this.props.cols)||(console.error("[SmallGrid] cols prop is not an array"),this.props.rows=[],this.props.cols=[]),this.setTotalPages()}},{key:"componentWillUpdate",value:function(){console.info("[SmallGrid] componentWillUpdate"),this.setTotalPages()}},{key:"setTotalPages",value:function(){var a=Math.ceil(this.props.rows.length/this.state.limit);this.state.total_pages!=a&&(console.info("[SmallGrid] setTotalPages: total_pages",a),this.setState({total_pages:a}))}},{key:"formatDefault",value:function(a){return a}},{key:"getCols",value:function(){var a=m["default"].map(this.props.cols,function(a,b,c){return a.hasOwnProperty("key")?(a.hasOwnProperty("name")||(a.name=a.key),a.hasOwnProperty("format")&&m["default"].isFunction(a.format)||(a.format=this.formatDefault),a.hasOwnProperty("edit")&&m["default"].isFunction(a.edit)||(a.edit=null),a):void 0},this);return console.info("[SmallGrid] getCols",a),m["default"].compact(a)}},{key:"getRows",value:function(){this.sortRows();var a=this.props.rows.slice(this.getStart(),this.getEnd());return console.info("[SmallGrid] getRows",a),a}},{key:"getStart",value:function(){var a=(this.state.page-1)*this.state.limit;return a}},{key:"getEnd",value:function(){var a=this.state.page*this.state.limit;return a}},{key:"getCell",value:function(a,b,c,d){var e=this,f=d.format(m["default"].get(b,d.key,d["default"]));return this.state.edit_idx==a&&this.state.edit_prop==d.key?k["default"].createElement("td",{key:c},k["default"].createElement("form",{onSubmit:this.editValue.bind(this)},k["default"].createElement("input",{type:"text",name:d.key,defaultValue:f,ref:function(a){return e._input=a},onKeyDown:this.onKeyDown.bind(this),"data-row":a,autoFocus:!0}))):d.edit?k["default"].createElement("td",{key:c,onClick:this.editCell.bind(this,a,d.key),className:"edit"},f):k["default"].createElement("td",{key:c},f)}},{key:"getPages",value:function(){for(var a=[],b=this.state.page-4;b<=this.state.page+4;b++)b>0&&b<=this.state.total_pages&&a.push(b);return console.info("[SmallGrid] getPages: pages",a),a}},{key:"setPage",value:function(a){this.editExit(),this.setState({page:a})}},{key:"sortBy",value:function(a){this.editExit();var b={};this.state.sort_by==a?"desc"==this.state.sort_dir?(b.sort_by=a,b.sort_dir="asc"):(b.sort_by=null,b.sort_dir="desc"):(b.sort_by=a,b.sort_dir="desc"),this.setState(b),console.info("[SmallGrid] sortBy",b)}},{key:"sortRows",value:function(){console.info("[SmallGrid] sortRows",this.state.sort_by,this.state.sort_dir),this.state.sort_by?(console.info("[SmallGrid] sortRows: sorting"),this.props.rows.sort(function(a,b){var c=a[this.state.sort_by],d=b[this.state.sort_by];return"desc"==this.state.sort_dir?d>c?1:c>d?-1:0:d>c?-1:c>d?1:0}.bind(this))):console.info("[SmallGrid] sortRows: nothing to sort by")}},{key:"render",value:function(){var a=this;if(console.info("[SmallGrid] render"),!this.props.hasOwnProperty("rows")||this.props.rows.length<1)return k["default"].createElement("div",{className:"alert alert-default"},"no data");var b=function(){var b=a.getPages(),c=a.getCols(),d=a.getRows();return{v:k["default"].createElement("section",null,k["default"].createElement("a",{name:"library_table"}),k["default"].createElement("br",null),k["default"].createElement("table",{className:"table table-condensed table-sort table-hl"},k["default"].createElement("thead",null,k["default"].createElement("tr",null,m["default"].map(c,function(a,b,c){return k["default"].createElement("th",{key:b,onClick:this.sortBy.bind(this,a.key),className:this.state.sort_by!=a.key?"":"sort-"+this.state.sort_dir},a.name)},a))),k["default"].createElement("tbody",null,m["default"].map(d,function(a,b,d){return k["default"].createElement("tr",{key:b},m["default"].map(c,function(c,d,e){return this.getCell(b,a,d,c)},this))},a)),k["default"].createElement("tfoot",null,k["default"].createElement("tr",null,k["default"].createElement("td",{colSpan:"4"},k["default"].createElement("ul",{className:"pagination"},k["default"].createElement("li",{className:a.state.page<2?"disabled":""},k["default"].createElement("a",{onClick:a.setPage.bind(a,a.state.page-1),href:"#library_table","aria-label":"Previous"},k["default"].createElement("span",{"aria-hidden":"true"},"«"))),b.map(function(a,b,c){return k["default"].createElement("li",{key:b,className:this.state.page==a?"active":""},k["default"].createElement("a",{href:"#library_table",onClick:this.setPage.bind(this,a)},a))}.bind(a)),k["default"].createElement("li",{className:a.state.page>=a.state.total_pages?"disabled":""},k["default"].createElement("a",{onClick:a.setPage.bind(a,a.state.page+1),href:"#library_table","aria-label":"Next"},k["default"].createElement("span",{"aria-hidden":"true"},"»"))))),k["default"].createElement("td",null,k["default"].createElement("span",{className:"pull-right"},a.props.rows.length," rows"))))))}}();return"object"===("undefined"==typeof b?"undefined":h(b))?b.v:void 0}},{key:"onKeyDown",value:function(a){console.info("[SmallGrid] onKeyDown",a.keyCode),27==a.keyCode&&(console.info("[SmallGrid] edit cancelled"),this.editExit())}},{key:"editExit",value:function(){console.info("Exited editing"),null!=this.state.edit_idx&&this.setState({edit_idx:null,edit_prop:null})}},{key:"editCell",value:function(a,b){console.info("[SmallGrid] editCell",a,b),this.setState({edit_idx:a,edit_prop:b})}},{key:"editValue",value:function(a){console.info("[SmallGrid] editValue",a),a.preventDefault(),this.editExit(),console.info("[SmallGrid] editValue: exiting editing");var b=parseInt(this._input.dataset.row),c=this._input.name,d=this._input.value,e=this._input.defaultValue;if(console.info("[SmallGrid] editValue: row_i",b),console.info("[SmallGrid] editValue: col_name",c),console.info("[SmallGrid] editValue: val",d),console.info("[SmallGrid] editValue: deval",e),d!=e){var f=this.getStart()+b;console.info("[SmallGrid] editValue: i",f);var g=this.props.rows[f];console.info("[SmallGrid] editValue: row",g),m["default"].set(this.props.rows[f],c,d),console.info("[SmallGrid] editValue: row val updated");var h=m["default"].filter(this.getCols(),{key:c})[0];console.info("[SmallGrid] editValue: col",h),console.info("[SmallGrid] editValue: col edit",h.edit),h.edit(g,c,d)}}}]),b}(k["default"].Component);c["default"]=n},{lodash:2,react:157}]},{},[158]);
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],8:[function(require,module,exports){
/**
 * Copyright 2013-2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule AutoFocusMixin
 * @typechecks static-only
 */

'use strict';

var focusNode = require("./focusNode");

var AutoFocusMixin = {
  componentDidMount: function() {
    if (this.props.autoFocus) {
      focusNode(this.getDOMNode());
    }
  }
};

module.exports = AutoFocusMixin;

},{"./focusNode":126}],9:[function(require,module,exports){
/**
 * Copyright 2013-2015 Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule BeforeInputEventPlugin
 * @typechecks static-only
 */

'use strict';

var EventConstants = require("./EventConstants");
var EventPropagators = require("./EventPropagators");
var ExecutionEnvironment = require("./ExecutionEnvironment");
var FallbackCompositionState = require("./FallbackCompositionState");
var SyntheticCompositionEvent = require("./SyntheticCompositionEvent");
var SyntheticInputEvent = require("./SyntheticInputEvent");

var keyOf = require("./keyOf");

var END_KEYCODES = [9, 13, 27, 32]; // Tab, Return, Esc, Space
var START_KEYCODE = 229;

var canUseCompositionEvent = (
  ExecutionEnvironment.canUseDOM &&
  'CompositionEvent' in window
);

var documentMode = null;
if (ExecutionEnvironment.canUseDOM && 'documentMode' in document) {
  documentMode = document.documentMode;
}

// Webkit offers a very useful `textInput` event that can be used to
// directly represent `beforeInput`. The IE `textinput` event is not as
// useful, so we don't use it.
var canUseTextInputEvent = (
  ExecutionEnvironment.canUseDOM &&
  'TextEvent' in window &&
  !documentMode &&
  !isPresto()
);

// In IE9+, we have access to composition events, but the data supplied
// by the native compositionend event may be incorrect. Japanese ideographic
// spaces, for instance (\u3000) are not recorded correctly.
var useFallbackCompositionData = (
  ExecutionEnvironment.canUseDOM &&
  (
    (!canUseCompositionEvent || documentMode && documentMode > 8 && documentMode <= 11)
  )
);

/**
 * Opera <= 12 includes TextEvent in window, but does not fire
 * text input events. Rely on keypress instead.
 */
function isPresto() {
  var opera = window.opera;
  return (
    typeof opera === 'object' &&
    typeof opera.version === 'function' &&
    parseInt(opera.version(), 10) <= 12
  );
}

var SPACEBAR_CODE = 32;
var SPACEBAR_CHAR = String.fromCharCode(SPACEBAR_CODE);

var topLevelTypes = EventConstants.topLevelTypes;

// Events and their corresponding property names.
var eventTypes = {
  beforeInput: {
    phasedRegistrationNames: {
      bubbled: keyOf({onBeforeInput: null}),
      captured: keyOf({onBeforeInputCapture: null})
    },
    dependencies: [
      topLevelTypes.topCompositionEnd,
      topLevelTypes.topKeyPress,
      topLevelTypes.topTextInput,
      topLevelTypes.topPaste
    ]
  },
  compositionEnd: {
    phasedRegistrationNames: {
      bubbled: keyOf({onCompositionEnd: null}),
      captured: keyOf({onCompositionEndCapture: null})
    },
    dependencies: [
      topLevelTypes.topBlur,
      topLevelTypes.topCompositionEnd,
      topLevelTypes.topKeyDown,
      topLevelTypes.topKeyPress,
      topLevelTypes.topKeyUp,
      topLevelTypes.topMouseDown
    ]
  },
  compositionStart: {
    phasedRegistrationNames: {
      bubbled: keyOf({onCompositionStart: null}),
      captured: keyOf({onCompositionStartCapture: null})
    },
    dependencies: [
      topLevelTypes.topBlur,
      topLevelTypes.topCompositionStart,
      topLevelTypes.topKeyDown,
      topLevelTypes.topKeyPress,
      topLevelTypes.topKeyUp,
      topLevelTypes.topMouseDown
    ]
  },
  compositionUpdate: {
    phasedRegistrationNames: {
      bubbled: keyOf({onCompositionUpdate: null}),
      captured: keyOf({onCompositionUpdateCapture: null})
    },
    dependencies: [
      topLevelTypes.topBlur,
      topLevelTypes.topCompositionUpdate,
      topLevelTypes.topKeyDown,
      topLevelTypes.topKeyPress,
      topLevelTypes.topKeyUp,
      topLevelTypes.topMouseDown
    ]
  }
};

// Track whether we've ever handled a keypress on the space key.
var hasSpaceKeypress = false;

/**
 * Return whether a native keypress event is assumed to be a command.
 * This is required because Firefox fires `keypress` events for key commands
 * (cut, copy, select-all, etc.) even though no character is inserted.
 */
function isKeypressCommand(nativeEvent) {
  return (
    (nativeEvent.ctrlKey || nativeEvent.altKey || nativeEvent.metaKey) &&
    // ctrlKey && altKey is equivalent to AltGr, and is not a command.
    !(nativeEvent.ctrlKey && nativeEvent.altKey)
  );
}


/**
 * Translate native top level events into event types.
 *
 * @param {string} topLevelType
 * @return {object}
 */
function getCompositionEventType(topLevelType) {
  switch (topLevelType) {
    case topLevelTypes.topCompositionStart:
      return eventTypes.compositionStart;
    case topLevelTypes.topCompositionEnd:
      return eventTypes.compositionEnd;
    case topLevelTypes.topCompositionUpdate:
      return eventTypes.compositionUpdate;
  }
}

/**
 * Does our fallback best-guess model think this event signifies that
 * composition has begun?
 *
 * @param {string} topLevelType
 * @param {object} nativeEvent
 * @return {boolean}
 */
function isFallbackCompositionStart(topLevelType, nativeEvent) {
  return (
    topLevelType === topLevelTypes.topKeyDown &&
    nativeEvent.keyCode === START_KEYCODE
  );
}

/**
 * Does our fallback mode think that this event is the end of composition?
 *
 * @param {string} topLevelType
 * @param {object} nativeEvent
 * @return {boolean}
 */
function isFallbackCompositionEnd(topLevelType, nativeEvent) {
  switch (topLevelType) {
    case topLevelTypes.topKeyUp:
      // Command keys insert or clear IME input.
      return (END_KEYCODES.indexOf(nativeEvent.keyCode) !== -1);
    case topLevelTypes.topKeyDown:
      // Expect IME keyCode on each keydown. If we get any other
      // code we must have exited earlier.
      return (nativeEvent.keyCode !== START_KEYCODE);
    case topLevelTypes.topKeyPress:
    case topLevelTypes.topMouseDown:
    case topLevelTypes.topBlur:
      // Events are not possible without cancelling IME.
      return true;
    default:
      return false;
  }
}

/**
 * Google Input Tools provides composition data via a CustomEvent,
 * with the `data` property populated in the `detail` object. If this
 * is available on the event object, use it. If not, this is a plain
 * composition event and we have nothing special to extract.
 *
 * @param {object} nativeEvent
 * @return {?string}
 */
function getDataFromCustomEvent(nativeEvent) {
  var detail = nativeEvent.detail;
  if (typeof detail === 'object' && 'data' in detail) {
    return detail.data;
  }
  return null;
}

// Track the current IME composition fallback object, if any.
var currentComposition = null;

/**
 * @param {string} topLevelType Record from `EventConstants`.
 * @param {DOMEventTarget} topLevelTarget The listening component root node.
 * @param {string} topLevelTargetID ID of `topLevelTarget`.
 * @param {object} nativeEvent Native browser event.
 * @return {?object} A SyntheticCompositionEvent.
 */
function extractCompositionEvent(
  topLevelType,
  topLevelTarget,
  topLevelTargetID,
  nativeEvent
) {
  var eventType;
  var fallbackData;

  if (canUseCompositionEvent) {
    eventType = getCompositionEventType(topLevelType);
  } else if (!currentComposition) {
    if (isFallbackCompositionStart(topLevelType, nativeEvent)) {
      eventType = eventTypes.compositionStart;
    }
  } else if (isFallbackCompositionEnd(topLevelType, nativeEvent)) {
    eventType = eventTypes.compositionEnd;
  }

  if (!eventType) {
    return null;
  }

  if (useFallbackCompositionData) {
    // The current composition is stored statically and must not be
    // overwritten while composition continues.
    if (!currentComposition && eventType === eventTypes.compositionStart) {
      currentComposition = FallbackCompositionState.getPooled(topLevelTarget);
    } else if (eventType === eventTypes.compositionEnd) {
      if (currentComposition) {
        fallbackData = currentComposition.getData();
      }
    }
  }

  var event = SyntheticCompositionEvent.getPooled(
    eventType,
    topLevelTargetID,
    nativeEvent
  );

  if (fallbackData) {
    // Inject data generated from fallback path into the synthetic event.
    // This matches the property of native CompositionEventInterface.
    event.data = fallbackData;
  } else {
    var customData = getDataFromCustomEvent(nativeEvent);
    if (customData !== null) {
      event.data = customData;
    }
  }

  EventPropagators.accumulateTwoPhaseDispatches(event);
  return event;
}

/**
 * @param {string} topLevelType Record from `EventConstants`.
 * @param {object} nativeEvent Native browser event.
 * @return {?string} The string corresponding to this `beforeInput` event.
 */
function getNativeBeforeInputChars(topLevelType, nativeEvent) {
  switch (topLevelType) {
    case topLevelTypes.topCompositionEnd:
      return getDataFromCustomEvent(nativeEvent);
    case topLevelTypes.topKeyPress:
      /**
       * If native `textInput` events are available, our goal is to make
       * use of them. However, there is a special case: the spacebar key.
       * In Webkit, preventing default on a spacebar `textInput` event
       * cancels character insertion, but it *also* causes the browser
       * to fall back to its default spacebar behavior of scrolling the
       * page.
       *
       * Tracking at:
       * https://code.google.com/p/chromium/issues/detail?id=355103
       *
       * To avoid this issue, use the keypress event as if no `textInput`
       * event is available.
       */
      var which = nativeEvent.which;
      if (which !== SPACEBAR_CODE) {
        return null;
      }

      hasSpaceKeypress = true;
      return SPACEBAR_CHAR;

    case topLevelTypes.topTextInput:
      // Record the characters to be added to the DOM.
      var chars = nativeEvent.data;

      // If it's a spacebar character, assume that we have already handled
      // it at the keypress level and bail immediately. Android Chrome
      // doesn't give us keycodes, so we need to blacklist it.
      if (chars === SPACEBAR_CHAR && hasSpaceKeypress) {
        return null;
      }

      return chars;

    default:
      // For other native event types, do nothing.
      return null;
  }
}

/**
 * For browsers that do not provide the `textInput` event, extract the
 * appropriate string to use for SyntheticInputEvent.
 *
 * @param {string} topLevelType Record from `EventConstants`.
 * @param {object} nativeEvent Native browser event.
 * @return {?string} The fallback string for this `beforeInput` event.
 */
function getFallbackBeforeInputChars(topLevelType, nativeEvent) {
  // If we are currently composing (IME) and using a fallback to do so,
  // try to extract the composed characters from the fallback object.
  if (currentComposition) {
    if (
      topLevelType === topLevelTypes.topCompositionEnd ||
      isFallbackCompositionEnd(topLevelType, nativeEvent)
    ) {
      var chars = currentComposition.getData();
      FallbackCompositionState.release(currentComposition);
      currentComposition = null;
      return chars;
    }
    return null;
  }

  switch (topLevelType) {
    case topLevelTypes.topPaste:
      // If a paste event occurs after a keypress, throw out the input
      // chars. Paste events should not lead to BeforeInput events.
      return null;
    case topLevelTypes.topKeyPress:
      /**
       * As of v27, Firefox may fire keypress events even when no character
       * will be inserted. A few possibilities:
       *
       * - `which` is `0`. Arrow keys, Esc key, etc.
       *
       * - `which` is the pressed key code, but no char is available.
       *   Ex: 'AltGr + d` in Polish. There is no modified character for
       *   this key combination and no character is inserted into the
       *   document, but FF fires the keypress for char code `100` anyway.
       *   No `input` event will occur.
       *
       * - `which` is the pressed key code, but a command combination is
       *   being used. Ex: `Cmd+C`. No character is inserted, and no
       *   `input` event will occur.
       */
      if (nativeEvent.which && !isKeypressCommand(nativeEvent)) {
        return String.fromCharCode(nativeEvent.which);
      }
      return null;
    case topLevelTypes.topCompositionEnd:
      return useFallbackCompositionData ? null : nativeEvent.data;
    default:
      return null;
  }
}

/**
 * Extract a SyntheticInputEvent for `beforeInput`, based on either native
 * `textInput` or fallback behavior.
 *
 * @param {string} topLevelType Record from `EventConstants`.
 * @param {DOMEventTarget} topLevelTarget The listening component root node.
 * @param {string} topLevelTargetID ID of `topLevelTarget`.
 * @param {object} nativeEvent Native browser event.
 * @return {?object} A SyntheticInputEvent.
 */
function extractBeforeInputEvent(
  topLevelType,
  topLevelTarget,
  topLevelTargetID,
  nativeEvent
) {
  var chars;

  if (canUseTextInputEvent) {
    chars = getNativeBeforeInputChars(topLevelType, nativeEvent);
  } else {
    chars = getFallbackBeforeInputChars(topLevelType, nativeEvent);
  }

  // If no characters are being inserted, no BeforeInput event should
  // be fired.
  if (!chars) {
    return null;
  }

  var event = SyntheticInputEvent.getPooled(
    eventTypes.beforeInput,
    topLevelTargetID,
    nativeEvent
  );

  event.data = chars;
  EventPropagators.accumulateTwoPhaseDispatches(event);
  return event;
}

/**
 * Create an `onBeforeInput` event to match
 * http://www.w3.org/TR/2013/WD-DOM-Level-3-Events-20131105/#events-inputevents.
 *
 * This event plugin is based on the native `textInput` event
 * available in Chrome, Safari, Opera, and IE. This event fires after
 * `onKeyPress` and `onCompositionEnd`, but before `onInput`.
 *
 * `beforeInput` is spec'd but not implemented in any browsers, and
 * the `input` event does not provide any useful information about what has
 * actually been added, contrary to the spec. Thus, `textInput` is the best
 * available event to identify the characters that have actually been inserted
 * into the target node.
 *
 * This plugin is also responsible for emitting `composition` events, thus
 * allowing us to share composition fallback code for both `beforeInput` and
 * `composition` event types.
 */
var BeforeInputEventPlugin = {

  eventTypes: eventTypes,

  /**
   * @param {string} topLevelType Record from `EventConstants`.
   * @param {DOMEventTarget} topLevelTarget The listening component root node.
   * @param {string} topLevelTargetID ID of `topLevelTarget`.
   * @param {object} nativeEvent Native browser event.
   * @return {*} An accumulation of synthetic events.
   * @see {EventPluginHub.extractEvents}
   */
  extractEvents: function(
    topLevelType,
    topLevelTarget,
    topLevelTargetID,
    nativeEvent
  ) {
    return [
      extractCompositionEvent(
        topLevelType,
        topLevelTarget,
        topLevelTargetID,
        nativeEvent
      ),
      extractBeforeInputEvent(
        topLevelType,
        topLevelTarget,
        topLevelTargetID,
        nativeEvent
      )
    ];
  }
};

module.exports = BeforeInputEventPlugin;

},{"./EventConstants":21,"./EventPropagators":26,"./ExecutionEnvironment":27,"./FallbackCompositionState":28,"./SyntheticCompositionEvent":100,"./SyntheticInputEvent":104,"./keyOf":148}],10:[function(require,module,exports){
/**
 * Copyright 2013-2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule CSSProperty
 */

'use strict';

/**
 * CSS properties which accept numbers but are not in units of "px".
 */
var isUnitlessNumber = {
  boxFlex: true,
  boxFlexGroup: true,
  columnCount: true,
  flex: true,
  flexGrow: true,
  flexPositive: true,
  flexShrink: true,
  flexNegative: true,
  fontWeight: true,
  lineClamp: true,
  lineHeight: true,
  opacity: true,
  order: true,
  orphans: true,
  widows: true,
  zIndex: true,
  zoom: true,

  // SVG-related properties
  fillOpacity: true,
  strokeDashoffset: true,
  strokeOpacity: true,
  strokeWidth: true
};

/**
 * @param {string} prefix vendor-specific prefix, eg: Webkit
 * @param {string} key style name, eg: transitionDuration
 * @return {string} style name prefixed with `prefix`, properly camelCased, eg:
 * WebkitTransitionDuration
 */
function prefixKey(prefix, key) {
  return prefix + key.charAt(0).toUpperCase() + key.substring(1);
}

/**
 * Support style names that may come passed in prefixed by adding permutations
 * of vendor prefixes.
 */
var prefixes = ['Webkit', 'ms', 'Moz', 'O'];

// Using Object.keys here, or else the vanilla for-in loop makes IE8 go into an
// infinite loop, because it iterates over the newly added props too.
Object.keys(isUnitlessNumber).forEach(function(prop) {
  prefixes.forEach(function(prefix) {
    isUnitlessNumber[prefixKey(prefix, prop)] = isUnitlessNumber[prop];
  });
});

/**
 * Most style properties can be unset by doing .style[prop] = '' but IE8
 * doesn't like doing that with shorthand properties so for the properties that
 * IE8 breaks on, which are listed here, we instead unset each of the
 * individual properties. See http://bugs.jquery.com/ticket/12385.
 * The 4-value 'clock' properties like margin, padding, border-width seem to
 * behave without any problems. Curiously, list-style works too without any
 * special prodding.
 */
var shorthandPropertyExpansions = {
  background: {
    backgroundImage: true,
    backgroundPosition: true,
    backgroundRepeat: true,
    backgroundColor: true
  },
  border: {
    borderWidth: true,
    borderStyle: true,
    borderColor: true
  },
  borderBottom: {
    borderBottomWidth: true,
    borderBottomStyle: true,
    borderBottomColor: true
  },
  borderLeft: {
    borderLeftWidth: true,
    borderLeftStyle: true,
    borderLeftColor: true
  },
  borderRight: {
    borderRightWidth: true,
    borderRightStyle: true,
    borderRightColor: true
  },
  borderTop: {
    borderTopWidth: true,
    borderTopStyle: true,
    borderTopColor: true
  },
  font: {
    fontStyle: true,
    fontVariant: true,
    fontWeight: true,
    fontSize: true,
    lineHeight: true,
    fontFamily: true
  }
};

var CSSProperty = {
  isUnitlessNumber: isUnitlessNumber,
  shorthandPropertyExpansions: shorthandPropertyExpansions
};

module.exports = CSSProperty;

},{}],11:[function(require,module,exports){
(function (process){
/**
 * Copyright 2013-2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule CSSPropertyOperations
 * @typechecks static-only
 */

'use strict';

var CSSProperty = require("./CSSProperty");
var ExecutionEnvironment = require("./ExecutionEnvironment");

var camelizeStyleName = require("./camelizeStyleName");
var dangerousStyleValue = require("./dangerousStyleValue");
var hyphenateStyleName = require("./hyphenateStyleName");
var memoizeStringOnly = require("./memoizeStringOnly");
var warning = require("./warning");

var processStyleName = memoizeStringOnly(function(styleName) {
  return hyphenateStyleName(styleName);
});

var styleFloatAccessor = 'cssFloat';
if (ExecutionEnvironment.canUseDOM) {
  // IE8 only supports accessing cssFloat (standard) as styleFloat
  if (document.documentElement.style.cssFloat === undefined) {
    styleFloatAccessor = 'styleFloat';
  }
}

if ("production" !== process.env.NODE_ENV) {
  // 'msTransform' is correct, but the other prefixes should be capitalized
  var badVendoredStyleNamePattern = /^(?:webkit|moz|o)[A-Z]/;

  // style values shouldn't contain a semicolon
  var badStyleValueWithSemicolonPattern = /;\s*$/;

  var warnedStyleNames = {};
  var warnedStyleValues = {};

  var warnHyphenatedStyleName = function(name) {
    if (warnedStyleNames.hasOwnProperty(name) && warnedStyleNames[name]) {
      return;
    }

    warnedStyleNames[name] = true;
    ("production" !== process.env.NODE_ENV ? warning(
      false,
      'Unsupported style property %s. Did you mean %s?',
      name,
      camelizeStyleName(name)
    ) : null);
  };

  var warnBadVendoredStyleName = function(name) {
    if (warnedStyleNames.hasOwnProperty(name) && warnedStyleNames[name]) {
      return;
    }

    warnedStyleNames[name] = true;
    ("production" !== process.env.NODE_ENV ? warning(
      false,
      'Unsupported vendor-prefixed style property %s. Did you mean %s?',
      name,
      name.charAt(0).toUpperCase() + name.slice(1)
    ) : null);
  };

  var warnStyleValueWithSemicolon = function(name, value) {
    if (warnedStyleValues.hasOwnProperty(value) && warnedStyleValues[value]) {
      return;
    }

    warnedStyleValues[value] = true;
    ("production" !== process.env.NODE_ENV ? warning(
      false,
      'Style property values shouldn\'t contain a semicolon. ' +
      'Try "%s: %s" instead.',
      name,
      value.replace(badStyleValueWithSemicolonPattern, '')
    ) : null);
  };

  /**
   * @param {string} name
   * @param {*} value
   */
  var warnValidStyle = function(name, value) {
    if (name.indexOf('-') > -1) {
      warnHyphenatedStyleName(name);
    } else if (badVendoredStyleNamePattern.test(name)) {
      warnBadVendoredStyleName(name);
    } else if (badStyleValueWithSemicolonPattern.test(value)) {
      warnStyleValueWithSemicolon(name, value);
    }
  };
}

/**
 * Operations for dealing with CSS properties.
 */
var CSSPropertyOperations = {

  /**
   * Serializes a mapping of style properties for use as inline styles:
   *
   *   > createMarkupForStyles({width: '200px', height: 0})
   *   "width:200px;height:0;"
   *
   * Undefined values are ignored so that declarative programming is easier.
   * The result should be HTML-escaped before insertion into the DOM.
   *
   * @param {object} styles
   * @return {?string}
   */
  createMarkupForStyles: function(styles) {
    var serialized = '';
    for (var styleName in styles) {
      if (!styles.hasOwnProperty(styleName)) {
        continue;
      }
      var styleValue = styles[styleName];
      if ("production" !== process.env.NODE_ENV) {
        warnValidStyle(styleName, styleValue);
      }
      if (styleValue != null) {
        serialized += processStyleName(styleName) + ':';
        serialized += dangerousStyleValue(styleName, styleValue) + ';';
      }
    }
    return serialized || null;
  },

  /**
   * Sets the value for multiple styles on a node.  If a value is specified as
   * '' (empty string), the corresponding style property will be unset.
   *
   * @param {DOMElement} node
   * @param {object} styles
   */
  setValueForStyles: function(node, styles) {
    var style = node.style;
    for (var styleName in styles) {
      if (!styles.hasOwnProperty(styleName)) {
        continue;
      }
      if ("production" !== process.env.NODE_ENV) {
        warnValidStyle(styleName, styles[styleName]);
      }
      var styleValue = dangerousStyleValue(styleName, styles[styleName]);
      if (styleName === 'float') {
        styleName = styleFloatAccessor;
      }
      if (styleValue) {
        style[styleName] = styleValue;
      } else {
        var expansion = CSSProperty.shorthandPropertyExpansions[styleName];
        if (expansion) {
          // Shorthand property that IE8 won't like unsetting, so unset each
          // component to placate it
          for (var individualStyleName in expansion) {
            style[individualStyleName] = '';
          }
        } else {
          style[styleName] = '';
        }
      }
    }
  }

};

module.exports = CSSPropertyOperations;

}).call(this,require('_process'))
},{"./CSSProperty":10,"./ExecutionEnvironment":27,"./camelizeStyleName":115,"./dangerousStyleValue":120,"./hyphenateStyleName":140,"./memoizeStringOnly":150,"./warning":161,"_process":6}],12:[function(require,module,exports){
(function (process){
/**
 * Copyright 2013-2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule CallbackQueue
 */

'use strict';

var PooledClass = require("./PooledClass");

var assign = require("./Object.assign");
var invariant = require("./invariant");

/**
 * A specialized pseudo-event module to help keep track of components waiting to
 * be notified when their DOM representations are available for use.
 *
 * This implements `PooledClass`, so you should never need to instantiate this.
 * Instead, use `CallbackQueue.getPooled()`.
 *
 * @class ReactMountReady
 * @implements PooledClass
 * @internal
 */
function CallbackQueue() {
  this._callbacks = null;
  this._contexts = null;
}

assign(CallbackQueue.prototype, {

  /**
   * Enqueues a callback to be invoked when `notifyAll` is invoked.
   *
   * @param {function} callback Invoked when `notifyAll` is invoked.
   * @param {?object} context Context to call `callback` with.
   * @internal
   */
  enqueue: function(callback, context) {
    this._callbacks = this._callbacks || [];
    this._contexts = this._contexts || [];
    this._callbacks.push(callback);
    this._contexts.push(context);
  },

  /**
   * Invokes all enqueued callbacks and clears the queue. This is invoked after
   * the DOM representation of a component has been created or updated.
   *
   * @internal
   */
  notifyAll: function() {
    var callbacks = this._callbacks;
    var contexts = this._contexts;
    if (callbacks) {
      ("production" !== process.env.NODE_ENV ? invariant(
        callbacks.length === contexts.length,
        'Mismatched list of contexts in callback queue'
      ) : invariant(callbacks.length === contexts.length));
      this._callbacks = null;
      this._contexts = null;
      for (var i = 0, l = callbacks.length; i < l; i++) {
        callbacks[i].call(contexts[i]);
      }
      callbacks.length = 0;
      contexts.length = 0;
    }
  },

  /**
   * Resets the internal queue.
   *
   * @internal
   */
  reset: function() {
    this._callbacks = null;
    this._contexts = null;
  },

  /**
   * `PooledClass` looks for this.
   */
  destructor: function() {
    this.reset();
  }

});

PooledClass.addPoolingTo(CallbackQueue);

module.exports = CallbackQueue;

}).call(this,require('_process'))
},{"./Object.assign":33,"./PooledClass":34,"./invariant":142,"_process":6}],13:[function(require,module,exports){
/**
 * Copyright 2013-2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule ChangeEventPlugin
 */

'use strict';

var EventConstants = require("./EventConstants");
var EventPluginHub = require("./EventPluginHub");
var EventPropagators = require("./EventPropagators");
var ExecutionEnvironment = require("./ExecutionEnvironment");
var ReactUpdates = require("./ReactUpdates");
var SyntheticEvent = require("./SyntheticEvent");

var isEventSupported = require("./isEventSupported");
var isTextInputElement = require("./isTextInputElement");
var keyOf = require("./keyOf");

var topLevelTypes = EventConstants.topLevelTypes;

var eventTypes = {
  change: {
    phasedRegistrationNames: {
      bubbled: keyOf({onChange: null}),
      captured: keyOf({onChangeCapture: null})
    },
    dependencies: [
      topLevelTypes.topBlur,
      topLevelTypes.topChange,
      topLevelTypes.topClick,
      topLevelTypes.topFocus,
      topLevelTypes.topInput,
      topLevelTypes.topKeyDown,
      topLevelTypes.topKeyUp,
      topLevelTypes.topSelectionChange
    ]
  }
};

/**
 * For IE shims
 */
var activeElement = null;
var activeElementID = null;
var activeElementValue = null;
var activeElementValueProp = null;

/**
 * SECTION: handle `change` event
 */
function shouldUseChangeEvent(elem) {
  return (
    elem.nodeName === 'SELECT' ||
    (elem.nodeName === 'INPUT' && elem.type === 'file')
  );
}

var doesChangeEventBubble = false;
if (ExecutionEnvironment.canUseDOM) {
  // See `handleChange` comment below
  doesChangeEventBubble = isEventSupported('change') && (
    (!('documentMode' in document) || document.documentMode > 8)
  );
}

function manualDispatchChangeEvent(nativeEvent) {
  var event = SyntheticEvent.getPooled(
    eventTypes.change,
    activeElementID,
    nativeEvent
  );
  EventPropagators.accumulateTwoPhaseDispatches(event);

  // If change and propertychange bubbled, we'd just bind to it like all the
  // other events and have it go through ReactBrowserEventEmitter. Since it
  // doesn't, we manually listen for the events and so we have to enqueue and
  // process the abstract event manually.
  //
  // Batching is necessary here in order to ensure that all event handlers run
  // before the next rerender (including event handlers attached to ancestor
  // elements instead of directly on the input). Without this, controlled
  // components don't work properly in conjunction with event bubbling because
  // the component is rerendered and the value reverted before all the event
  // handlers can run. See https://github.com/facebook/react/issues/708.
  ReactUpdates.batchedUpdates(runEventInBatch, event);
}

function runEventInBatch(event) {
  EventPluginHub.enqueueEvents(event);
  EventPluginHub.processEventQueue();
}

function startWatchingForChangeEventIE8(target, targetID) {
  activeElement = target;
  activeElementID = targetID;
  activeElement.attachEvent('onchange', manualDispatchChangeEvent);
}

function stopWatchingForChangeEventIE8() {
  if (!activeElement) {
    return;
  }
  activeElement.detachEvent('onchange', manualDispatchChangeEvent);
  activeElement = null;
  activeElementID = null;
}

function getTargetIDForChangeEvent(
    topLevelType,
    topLevelTarget,
    topLevelTargetID) {
  if (topLevelType === topLevelTypes.topChange) {
    return topLevelTargetID;
  }
}
function handleEventsForChangeEventIE8(
    topLevelType,
    topLevelTarget,
    topLevelTargetID) {
  if (topLevelType === topLevelTypes.topFocus) {
    // stopWatching() should be a noop here but we call it just in case we
    // missed a blur event somehow.
    stopWatchingForChangeEventIE8();
    startWatchingForChangeEventIE8(topLevelTarget, topLevelTargetID);
  } else if (topLevelType === topLevelTypes.topBlur) {
    stopWatchingForChangeEventIE8();
  }
}


/**
 * SECTION: handle `input` event
 */
var isInputEventSupported = false;
if (ExecutionEnvironment.canUseDOM) {
  // IE9 claims to support the input event but fails to trigger it when
  // deleting text, so we ignore its input events
  isInputEventSupported = isEventSupported('input') && (
    (!('documentMode' in document) || document.documentMode > 9)
  );
}

/**
 * (For old IE.) Replacement getter/setter for the `value` property that gets
 * set on the active element.
 */
var newValueProp =  {
  get: function() {
    return activeElementValueProp.get.call(this);
  },
  set: function(val) {
    // Cast to a string so we can do equality checks.
    activeElementValue = '' + val;
    activeElementValueProp.set.call(this, val);
  }
};

/**
 * (For old IE.) Starts tracking propertychange events on the passed-in element
 * and override the value property so that we can distinguish user events from
 * value changes in JS.
 */
function startWatchingForValueChange(target, targetID) {
  activeElement = target;
  activeElementID = targetID;
  activeElementValue = target.value;
  activeElementValueProp = Object.getOwnPropertyDescriptor(
    target.constructor.prototype,
    'value'
  );

  Object.defineProperty(activeElement, 'value', newValueProp);
  activeElement.attachEvent('onpropertychange', handlePropertyChange);
}

/**
 * (For old IE.) Removes the event listeners from the currently-tracked element,
 * if any exists.
 */
function stopWatchingForValueChange() {
  if (!activeElement) {
    return;
  }

  // delete restores the original property definition
  delete activeElement.value;
  activeElement.detachEvent('onpropertychange', handlePropertyChange);

  activeElement = null;
  activeElementID = null;
  activeElementValue = null;
  activeElementValueProp = null;
}

/**
 * (For old IE.) Handles a propertychange event, sending a `change` event if
 * the value of the active element has changed.
 */
function handlePropertyChange(nativeEvent) {
  if (nativeEvent.propertyName !== 'value') {
    return;
  }
  var value = nativeEvent.srcElement.value;
  if (value === activeElementValue) {
    return;
  }
  activeElementValue = value;

  manualDispatchChangeEvent(nativeEvent);
}

/**
 * If a `change` event should be fired, returns the target's ID.
 */
function getTargetIDForInputEvent(
    topLevelType,
    topLevelTarget,
    topLevelTargetID) {
  if (topLevelType === topLevelTypes.topInput) {
    // In modern browsers (i.e., not IE8 or IE9), the input event is exactly
    // what we want so fall through here and trigger an abstract event
    return topLevelTargetID;
  }
}

// For IE8 and IE9.
function handleEventsForInputEventIE(
    topLevelType,
    topLevelTarget,
    topLevelTargetID) {
  if (topLevelType === topLevelTypes.topFocus) {
    // In IE8, we can capture almost all .value changes by adding a
    // propertychange handler and looking for events with propertyName
    // equal to 'value'
    // In IE9, propertychange fires for most input events but is buggy and
    // doesn't fire when text is deleted, but conveniently, selectionchange
    // appears to fire in all of the remaining cases so we catch those and
    // forward the event if the value has changed
    // In either case, we don't want to call the event handler if the value
    // is changed from JS so we redefine a setter for `.value` that updates
    // our activeElementValue variable, allowing us to ignore those changes
    //
    // stopWatching() should be a noop here but we call it just in case we
    // missed a blur event somehow.
    stopWatchingForValueChange();
    startWatchingForValueChange(topLevelTarget, topLevelTargetID);
  } else if (topLevelType === topLevelTypes.topBlur) {
    stopWatchingForValueChange();
  }
}

// For IE8 and IE9.
function getTargetIDForInputEventIE(
    topLevelType,
    topLevelTarget,
    topLevelTargetID) {
  if (topLevelType === topLevelTypes.topSelectionChange ||
      topLevelType === topLevelTypes.topKeyUp ||
      topLevelType === topLevelTypes.topKeyDown) {
    // On the selectionchange event, the target is just document which isn't
    // helpful for us so just check activeElement instead.
    //
    // 99% of the time, keydown and keyup aren't necessary. IE8 fails to fire
    // propertychange on the first input event after setting `value` from a
    // script and fires only keydown, keypress, keyup. Catching keyup usually
    // gets it and catching keydown lets us fire an event for the first
    // keystroke if user does a key repeat (it'll be a little delayed: right
    // before the second keystroke). Other input methods (e.g., paste) seem to
    // fire selectionchange normally.
    if (activeElement && activeElement.value !== activeElementValue) {
      activeElementValue = activeElement.value;
      return activeElementID;
    }
  }
}


/**
 * SECTION: handle `click` event
 */
function shouldUseClickEvent(elem) {
  // Use the `click` event to detect changes to checkbox and radio inputs.
  // This approach works across all browsers, whereas `change` does not fire
  // until `blur` in IE8.
  return (
    elem.nodeName === 'INPUT' &&
    (elem.type === 'checkbox' || elem.type === 'radio')
  );
}

function getTargetIDForClickEvent(
    topLevelType,
    topLevelTarget,
    topLevelTargetID) {
  if (topLevelType === topLevelTypes.topClick) {
    return topLevelTargetID;
  }
}

/**
 * This plugin creates an `onChange` event that normalizes change events
 * across form elements. This event fires at a time when it's possible to
 * change the element's value without seeing a flicker.
 *
 * Supported elements are:
 * - input (see `isTextInputElement`)
 * - textarea
 * - select
 */
var ChangeEventPlugin = {

  eventTypes: eventTypes,

  /**
   * @param {string} topLevelType Record from `EventConstants`.
   * @param {DOMEventTarget} topLevelTarget The listening component root node.
   * @param {string} topLevelTargetID ID of `topLevelTarget`.
   * @param {object} nativeEvent Native browser event.
   * @return {*} An accumulation of synthetic events.
   * @see {EventPluginHub.extractEvents}
   */
  extractEvents: function(
      topLevelType,
      topLevelTarget,
      topLevelTargetID,
      nativeEvent) {

    var getTargetIDFunc, handleEventFunc;
    if (shouldUseChangeEvent(topLevelTarget)) {
      if (doesChangeEventBubble) {
        getTargetIDFunc = getTargetIDForChangeEvent;
      } else {
        handleEventFunc = handleEventsForChangeEventIE8;
      }
    } else if (isTextInputElement(topLevelTarget)) {
      if (isInputEventSupported) {
        getTargetIDFunc = getTargetIDForInputEvent;
      } else {
        getTargetIDFunc = getTargetIDForInputEventIE;
        handleEventFunc = handleEventsForInputEventIE;
      }
    } else if (shouldUseClickEvent(topLevelTarget)) {
      getTargetIDFunc = getTargetIDForClickEvent;
    }

    if (getTargetIDFunc) {
      var targetID = getTargetIDFunc(
        topLevelType,
        topLevelTarget,
        topLevelTargetID
      );
      if (targetID) {
        var event = SyntheticEvent.getPooled(
          eventTypes.change,
          targetID,
          nativeEvent
        );
        EventPropagators.accumulateTwoPhaseDispatches(event);
        return event;
      }
    }

    if (handleEventFunc) {
      handleEventFunc(
        topLevelType,
        topLevelTarget,
        topLevelTargetID
      );
    }
  }

};

module.exports = ChangeEventPlugin;

},{"./EventConstants":21,"./EventPluginHub":23,"./EventPropagators":26,"./ExecutionEnvironment":27,"./ReactUpdates":94,"./SyntheticEvent":102,"./isEventSupported":143,"./isTextInputElement":145,"./keyOf":148}],14:[function(require,module,exports){
/**
 * Copyright 2013-2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule ClientReactRootIndex
 * @typechecks
 */

'use strict';

var nextReactRootIndex = 0;

var ClientReactRootIndex = {
  createReactRootIndex: function() {
    return nextReactRootIndex++;
  }
};

module.exports = ClientReactRootIndex;

},{}],15:[function(require,module,exports){
(function (process){
/**
 * Copyright 2013-2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule DOMChildrenOperations
 * @typechecks static-only
 */

'use strict';

var Danger = require("./Danger");
var ReactMultiChildUpdateTypes = require("./ReactMultiChildUpdateTypes");

var setTextContent = require("./setTextContent");
var invariant = require("./invariant");

/**
 * Inserts `childNode` as a child of `parentNode` at the `index`.
 *
 * @param {DOMElement} parentNode Parent node in which to insert.
 * @param {DOMElement} childNode Child node to insert.
 * @param {number} index Index at which to insert the child.
 * @internal
 */
function insertChildAt(parentNode, childNode, index) {
  // By exploiting arrays returning `undefined` for an undefined index, we can
  // rely exclusively on `insertBefore(node, null)` instead of also using
  // `appendChild(node)`. However, using `undefined` is not allowed by all
  // browsers so we must replace it with `null`.
  parentNode.insertBefore(
    childNode,
    parentNode.childNodes[index] || null
  );
}

/**
 * Operations for updating with DOM children.
 */
var DOMChildrenOperations = {

  dangerouslyReplaceNodeWithMarkup: Danger.dangerouslyReplaceNodeWithMarkup,

  updateTextContent: setTextContent,

  /**
   * Updates a component's children by processing a series of updates. The
   * update configurations are each expected to have a `parentNode` property.
   *
   * @param {array<object>} updates List of update configurations.
   * @param {array<string>} markupList List of markup strings.
   * @internal
   */
  processUpdates: function(updates, markupList) {
    var update;
    // Mapping from parent IDs to initial child orderings.
    var initialChildren = null;
    // List of children that will be moved or removed.
    var updatedChildren = null;

    for (var i = 0; i < updates.length; i++) {
      update = updates[i];
      if (update.type === ReactMultiChildUpdateTypes.MOVE_EXISTING ||
          update.type === ReactMultiChildUpdateTypes.REMOVE_NODE) {
        var updatedIndex = update.fromIndex;
        var updatedChild = update.parentNode.childNodes[updatedIndex];
        var parentID = update.parentID;

        ("production" !== process.env.NODE_ENV ? invariant(
          updatedChild,
          'processUpdates(): Unable to find child %s of element. This ' +
          'probably means the DOM was unexpectedly mutated (e.g., by the ' +
          'browser), usually due to forgetting a <tbody> when using tables, ' +
          'nesting tags like <form>, <p>, or <a>, or using non-SVG elements ' +
          'in an <svg> parent. Try inspecting the child nodes of the element ' +
          'with React ID `%s`.',
          updatedIndex,
          parentID
        ) : invariant(updatedChild));

        initialChildren = initialChildren || {};
        initialChildren[parentID] = initialChildren[parentID] || [];
        initialChildren[parentID][updatedIndex] = updatedChild;

        updatedChildren = updatedChildren || [];
        updatedChildren.push(updatedChild);
      }
    }

    var renderedMarkup = Danger.dangerouslyRenderMarkup(markupList);

    // Remove updated children first so that `toIndex` is consistent.
    if (updatedChildren) {
      for (var j = 0; j < updatedChildren.length; j++) {
        updatedChildren[j].parentNode.removeChild(updatedChildren[j]);
      }
    }

    for (var k = 0; k < updates.length; k++) {
      update = updates[k];
      switch (update.type) {
        case ReactMultiChildUpdateTypes.INSERT_MARKUP:
          insertChildAt(
            update.parentNode,
            renderedMarkup[update.markupIndex],
            update.toIndex
          );
          break;
        case ReactMultiChildUpdateTypes.MOVE_EXISTING:
          insertChildAt(
            update.parentNode,
            initialChildren[update.parentID][update.fromIndex],
            update.toIndex
          );
          break;
        case ReactMultiChildUpdateTypes.TEXT_CONTENT:
          setTextContent(
            update.parentNode,
            update.textContent
          );
          break;
        case ReactMultiChildUpdateTypes.REMOVE_NODE:
          // Already removed by the for-loop above.
          break;
      }
    }
  }

};

module.exports = DOMChildrenOperations;

}).call(this,require('_process'))
},{"./Danger":18,"./ReactMultiChildUpdateTypes":79,"./invariant":142,"./setTextContent":156,"_process":6}],16:[function(require,module,exports){
(function (process){
/**
 * Copyright 2013-2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule DOMProperty
 * @typechecks static-only
 */

/*jslint bitwise: true */

'use strict';

var invariant = require("./invariant");

function checkMask(value, bitmask) {
  return (value & bitmask) === bitmask;
}

var DOMPropertyInjection = {
  /**
   * Mapping from normalized, camelcased property names to a configuration that
   * specifies how the associated DOM property should be accessed or rendered.
   */
  MUST_USE_ATTRIBUTE: 0x1,
  MUST_USE_PROPERTY: 0x2,
  HAS_SIDE_EFFECTS: 0x4,
  HAS_BOOLEAN_VALUE: 0x8,
  HAS_NUMERIC_VALUE: 0x10,
  HAS_POSITIVE_NUMERIC_VALUE: 0x20 | 0x10,
  HAS_OVERLOADED_BOOLEAN_VALUE: 0x40,

  /**
   * Inject some specialized knowledge about the DOM. This takes a config object
   * with the following properties:
   *
   * isCustomAttribute: function that given an attribute name will return true
   * if it can be inserted into the DOM verbatim. Useful for data-* or aria-*
   * attributes where it's impossible to enumerate all of the possible
   * attribute names,
   *
   * Properties: object mapping DOM property name to one of the
   * DOMPropertyInjection constants or null. If your attribute isn't in here,
   * it won't get written to the DOM.
   *
   * DOMAttributeNames: object mapping React attribute name to the DOM
   * attribute name. Attribute names not specified use the **lowercase**
   * normalized name.
   *
   * DOMPropertyNames: similar to DOMAttributeNames but for DOM properties.
   * Property names not specified use the normalized name.
   *
   * DOMMutationMethods: Properties that require special mutation methods. If
   * `value` is undefined, the mutation method should unset the property.
   *
   * @param {object} domPropertyConfig the config as described above.
   */
  injectDOMPropertyConfig: function(domPropertyConfig) {
    var Properties = domPropertyConfig.Properties || {};
    var DOMAttributeNames = domPropertyConfig.DOMAttributeNames || {};
    var DOMPropertyNames = domPropertyConfig.DOMPropertyNames || {};
    var DOMMutationMethods = domPropertyConfig.DOMMutationMethods || {};

    if (domPropertyConfig.isCustomAttribute) {
      DOMProperty._isCustomAttributeFunctions.push(
        domPropertyConfig.isCustomAttribute
      );
    }

    for (var propName in Properties) {
      ("production" !== process.env.NODE_ENV ? invariant(
        !DOMProperty.isStandardName.hasOwnProperty(propName),
        'injectDOMPropertyConfig(...): You\'re trying to inject DOM property ' +
        '\'%s\' which has already been injected. You may be accidentally ' +
        'injecting the same DOM property config twice, or you may be ' +
        'injecting two configs that have conflicting property names.',
        propName
      ) : invariant(!DOMProperty.isStandardName.hasOwnProperty(propName)));

      DOMProperty.isStandardName[propName] = true;

      var lowerCased = propName.toLowerCase();
      DOMProperty.getPossibleStandardName[lowerCased] = propName;

      if (DOMAttributeNames.hasOwnProperty(propName)) {
        var attributeName = DOMAttributeNames[propName];
        DOMProperty.getPossibleStandardName[attributeName] = propName;
        DOMProperty.getAttributeName[propName] = attributeName;
      } else {
        DOMProperty.getAttributeName[propName] = lowerCased;
      }

      DOMProperty.getPropertyName[propName] =
        DOMPropertyNames.hasOwnProperty(propName) ?
          DOMPropertyNames[propName] :
          propName;

      if (DOMMutationMethods.hasOwnProperty(propName)) {
        DOMProperty.getMutationMethod[propName] = DOMMutationMethods[propName];
      } else {
        DOMProperty.getMutationMethod[propName] = null;
      }

      var propConfig = Properties[propName];
      DOMProperty.mustUseAttribute[propName] =
        checkMask(propConfig, DOMPropertyInjection.MUST_USE_ATTRIBUTE);
      DOMProperty.mustUseProperty[propName] =
        checkMask(propConfig, DOMPropertyInjection.MUST_USE_PROPERTY);
      DOMProperty.hasSideEffects[propName] =
        checkMask(propConfig, DOMPropertyInjection.HAS_SIDE_EFFECTS);
      DOMProperty.hasBooleanValue[propName] =
        checkMask(propConfig, DOMPropertyInjection.HAS_BOOLEAN_VALUE);
      DOMProperty.hasNumericValue[propName] =
        checkMask(propConfig, DOMPropertyInjection.HAS_NUMERIC_VALUE);
      DOMProperty.hasPositiveNumericValue[propName] =
        checkMask(propConfig, DOMPropertyInjection.HAS_POSITIVE_NUMERIC_VALUE);
      DOMProperty.hasOverloadedBooleanValue[propName] =
        checkMask(propConfig, DOMPropertyInjection.HAS_OVERLOADED_BOOLEAN_VALUE);

      ("production" !== process.env.NODE_ENV ? invariant(
        !DOMProperty.mustUseAttribute[propName] ||
          !DOMProperty.mustUseProperty[propName],
        'DOMProperty: Cannot require using both attribute and property: %s',
        propName
      ) : invariant(!DOMProperty.mustUseAttribute[propName] ||
        !DOMProperty.mustUseProperty[propName]));
      ("production" !== process.env.NODE_ENV ? invariant(
        DOMProperty.mustUseProperty[propName] ||
          !DOMProperty.hasSideEffects[propName],
        'DOMProperty: Properties that have side effects must use property: %s',
        propName
      ) : invariant(DOMProperty.mustUseProperty[propName] ||
        !DOMProperty.hasSideEffects[propName]));
      ("production" !== process.env.NODE_ENV ? invariant(
        !!DOMProperty.hasBooleanValue[propName] +
          !!DOMProperty.hasNumericValue[propName] +
          !!DOMProperty.hasOverloadedBooleanValue[propName] <= 1,
        'DOMProperty: Value can be one of boolean, overloaded boolean, or ' +
        'numeric value, but not a combination: %s',
        propName
      ) : invariant(!!DOMProperty.hasBooleanValue[propName] +
        !!DOMProperty.hasNumericValue[propName] +
        !!DOMProperty.hasOverloadedBooleanValue[propName] <= 1));
    }
  }
};
var defaultValueCache = {};

/**
 * DOMProperty exports lookup objects that can be used like functions:
 *
 *   > DOMProperty.isValid['id']
 *   true
 *   > DOMProperty.isValid['foobar']
 *   undefined
 *
 * Although this may be confusing, it performs better in general.
 *
 * @see http://jsperf.com/key-exists
 * @see http://jsperf.com/key-missing
 */
var DOMProperty = {

  ID_ATTRIBUTE_NAME: 'data-reactid',

  /**
   * Checks whether a property name is a standard property.
   * @type {Object}
   */
  isStandardName: {},

  /**
   * Mapping from lowercase property names to the properly cased version, used
   * to warn in the case of missing properties.
   * @type {Object}
   */
  getPossibleStandardName: {},

  /**
   * Mapping from normalized names to attribute names that differ. Attribute
   * names are used when rendering markup or with `*Attribute()`.
   * @type {Object}
   */
  getAttributeName: {},

  /**
   * Mapping from normalized names to properties on DOM node instances.
   * (This includes properties that mutate due to external factors.)
   * @type {Object}
   */
  getPropertyName: {},

  /**
   * Mapping from normalized names to mutation methods. This will only exist if
   * mutation cannot be set simply by the property or `setAttribute()`.
   * @type {Object}
   */
  getMutationMethod: {},

  /**
   * Whether the property must be accessed and mutated as an object property.
   * @type {Object}
   */
  mustUseAttribute: {},

  /**
   * Whether the property must be accessed and mutated using `*Attribute()`.
   * (This includes anything that fails `<propName> in <element>`.)
   * @type {Object}
   */
  mustUseProperty: {},

  /**
   * Whether or not setting a value causes side effects such as triggering
   * resources to be loaded or text selection changes. We must ensure that
   * the value is only set if it has changed.
   * @type {Object}
   */
  hasSideEffects: {},

  /**
   * Whether the property should be removed when set to a falsey value.
   * @type {Object}
   */
  hasBooleanValue: {},

  /**
   * Whether the property must be numeric or parse as a
   * numeric and should be removed when set to a falsey value.
   * @type {Object}
   */
  hasNumericValue: {},

  /**
   * Whether the property must be positive numeric or parse as a positive
   * numeric and should be removed when set to a falsey value.
   * @type {Object}
   */
  hasPositiveNumericValue: {},

  /**
   * Whether the property can be used as a flag as well as with a value. Removed
   * when strictly equal to false; present without a value when strictly equal
   * to true; present with a value otherwise.
   * @type {Object}
   */
  hasOverloadedBooleanValue: {},

  /**
   * All of the isCustomAttribute() functions that have been injected.
   */
  _isCustomAttributeFunctions: [],

  /**
   * Checks whether a property name is a custom attribute.
   * @method
   */
  isCustomAttribute: function(attributeName) {
    for (var i = 0; i < DOMProperty._isCustomAttributeFunctions.length; i++) {
      var isCustomAttributeFn = DOMProperty._isCustomAttributeFunctions[i];
      if (isCustomAttributeFn(attributeName)) {
        return true;
      }
    }
    return false;
  },

  /**
   * Returns the default property value for a DOM property (i.e., not an
   * attribute). Most default values are '' or false, but not all. Worse yet,
   * some (in particular, `type`) vary depending on the type of element.
   *
   * TODO: Is it better to grab all the possible properties when creating an
   * element to avoid having to create the same element twice?
   */
  getDefaultValueForProperty: function(nodeName, prop) {
    var nodeDefaults = defaultValueCache[nodeName];
    var testElement;
    if (!nodeDefaults) {
      defaultValueCache[nodeName] = nodeDefaults = {};
    }
    if (!(prop in nodeDefaults)) {
      testElement = document.createElement(nodeName);
      nodeDefaults[prop] = testElement[prop];
    }
    return nodeDefaults[prop];
  },

  injection: DOMPropertyInjection
};

module.exports = DOMProperty;

}).call(this,require('_process'))
},{"./invariant":142,"_process":6}],17:[function(require,module,exports){
(function (process){
/**
 * Copyright 2013-2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule DOMPropertyOperations
 * @typechecks static-only
 */

'use strict';

var DOMProperty = require("./DOMProperty");

var quoteAttributeValueForBrowser = require("./quoteAttributeValueForBrowser");
var warning = require("./warning");

function shouldIgnoreValue(name, value) {
  return value == null ||
    (DOMProperty.hasBooleanValue[name] && !value) ||
    (DOMProperty.hasNumericValue[name] && isNaN(value)) ||
    (DOMProperty.hasPositiveNumericValue[name] && (value < 1)) ||
    (DOMProperty.hasOverloadedBooleanValue[name] && value === false);
}

if ("production" !== process.env.NODE_ENV) {
  var reactProps = {
    children: true,
    dangerouslySetInnerHTML: true,
    key: true,
    ref: true
  };
  var warnedProperties = {};

  var warnUnknownProperty = function(name) {
    if (reactProps.hasOwnProperty(name) && reactProps[name] ||
        warnedProperties.hasOwnProperty(name) && warnedProperties[name]) {
      return;
    }

    warnedProperties[name] = true;
    var lowerCasedName = name.toLowerCase();

    // data-* attributes should be lowercase; suggest the lowercase version
    var standardName = (
      DOMProperty.isCustomAttribute(lowerCasedName) ?
        lowerCasedName :
      DOMProperty.getPossibleStandardName.hasOwnProperty(lowerCasedName) ?
        DOMProperty.getPossibleStandardName[lowerCasedName] :
        null
    );

    // For now, only warn when we have a suggested correction. This prevents
    // logging too much when using transferPropsTo.
    ("production" !== process.env.NODE_ENV ? warning(
      standardName == null,
      'Unknown DOM property %s. Did you mean %s?',
      name,
      standardName
    ) : null);

  };
}

/**
 * Operations for dealing with DOM properties.
 */
var DOMPropertyOperations = {

  /**
   * Creates markup for the ID property.
   *
   * @param {string} id Unescaped ID.
   * @return {string} Markup string.
   */
  createMarkupForID: function(id) {
    return DOMProperty.ID_ATTRIBUTE_NAME + '=' +
      quoteAttributeValueForBrowser(id);
  },

  /**
   * Creates markup for a property.
   *
   * @param {string} name
   * @param {*} value
   * @return {?string} Markup string, or null if the property was invalid.
   */
  createMarkupForProperty: function(name, value) {
    if (DOMProperty.isStandardName.hasOwnProperty(name) &&
        DOMProperty.isStandardName[name]) {
      if (shouldIgnoreValue(name, value)) {
        return '';
      }
      var attributeName = DOMProperty.getAttributeName[name];
      if (DOMProperty.hasBooleanValue[name] ||
          (DOMProperty.hasOverloadedBooleanValue[name] && value === true)) {
        return attributeName;
      }
      return attributeName + '=' + quoteAttributeValueForBrowser(value);
    } else if (DOMProperty.isCustomAttribute(name)) {
      if (value == null) {
        return '';
      }
      return name + '=' + quoteAttributeValueForBrowser(value);
    } else if ("production" !== process.env.NODE_ENV) {
      warnUnknownProperty(name);
    }
    return null;
  },

  /**
   * Sets the value for a property on a node.
   *
   * @param {DOMElement} node
   * @param {string} name
   * @param {*} value
   */
  setValueForProperty: function(node, name, value) {
    if (DOMProperty.isStandardName.hasOwnProperty(name) &&
        DOMProperty.isStandardName[name]) {
      var mutationMethod = DOMProperty.getMutationMethod[name];
      if (mutationMethod) {
        mutationMethod(node, value);
      } else if (shouldIgnoreValue(name, value)) {
        this.deleteValueForProperty(node, name);
      } else if (DOMProperty.mustUseAttribute[name]) {
        // `setAttribute` with objects becomes only `[object]` in IE8/9,
        // ('' + value) makes it output the correct toString()-value.
        node.setAttribute(DOMProperty.getAttributeName[name], '' + value);
      } else {
        var propName = DOMProperty.getPropertyName[name];
        // Must explicitly cast values for HAS_SIDE_EFFECTS-properties to the
        // property type before comparing; only `value` does and is string.
        if (!DOMProperty.hasSideEffects[name] ||
            ('' + node[propName]) !== ('' + value)) {
          // Contrary to `setAttribute`, object properties are properly
          // `toString`ed by IE8/9.
          node[propName] = value;
        }
      }
    } else if (DOMProperty.isCustomAttribute(name)) {
      if (value == null) {
        node.removeAttribute(name);
      } else {
        node.setAttribute(name, '' + value);
      }
    } else if ("production" !== process.env.NODE_ENV) {
      warnUnknownProperty(name);
    }
  },

  /**
   * Deletes the value for a property on a node.
   *
   * @param {DOMElement} node
   * @param {string} name
   */
  deleteValueForProperty: function(node, name) {
    if (DOMProperty.isStandardName.hasOwnProperty(name) &&
        DOMProperty.isStandardName[name]) {
      var mutationMethod = DOMProperty.getMutationMethod[name];
      if (mutationMethod) {
        mutationMethod(node, undefined);
      } else if (DOMProperty.mustUseAttribute[name]) {
        node.removeAttribute(DOMProperty.getAttributeName[name]);
      } else {
        var propName = DOMProperty.getPropertyName[name];
        var defaultValue = DOMProperty.getDefaultValueForProperty(
          node.nodeName,
          propName
        );
        if (!DOMProperty.hasSideEffects[name] ||
            ('' + node[propName]) !== defaultValue) {
          node[propName] = defaultValue;
        }
      }
    } else if (DOMProperty.isCustomAttribute(name)) {
      node.removeAttribute(name);
    } else if ("production" !== process.env.NODE_ENV) {
      warnUnknownProperty(name);
    }
  }

};

module.exports = DOMPropertyOperations;

}).call(this,require('_process'))
},{"./DOMProperty":16,"./quoteAttributeValueForBrowser":154,"./warning":161,"_process":6}],18:[function(require,module,exports){
(function (process){
/**
 * Copyright 2013-2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule Danger
 * @typechecks static-only
 */

/*jslint evil: true, sub: true */

'use strict';

var ExecutionEnvironment = require("./ExecutionEnvironment");

var createNodesFromMarkup = require("./createNodesFromMarkup");
var emptyFunction = require("./emptyFunction");
var getMarkupWrap = require("./getMarkupWrap");
var invariant = require("./invariant");

var OPEN_TAG_NAME_EXP = /^(<[^ \/>]+)/;
var RESULT_INDEX_ATTR = 'data-danger-index';

/**
 * Extracts the `nodeName` from a string of markup.
 *
 * NOTE: Extracting the `nodeName` does not require a regular expression match
 * because we make assumptions about React-generated markup (i.e. there are no
 * spaces surrounding the opening tag and there is at least one attribute).
 *
 * @param {string} markup String of markup.
 * @return {string} Node name of the supplied markup.
 * @see http://jsperf.com/extract-nodename
 */
function getNodeName(markup) {
  return markup.substring(1, markup.indexOf(' '));
}

var Danger = {

  /**
   * Renders markup into an array of nodes. The markup is expected to render
   * into a list of root nodes. Also, the length of `resultList` and
   * `markupList` should be the same.
   *
   * @param {array<string>} markupList List of markup strings to render.
   * @return {array<DOMElement>} List of rendered nodes.
   * @internal
   */
  dangerouslyRenderMarkup: function(markupList) {
    ("production" !== process.env.NODE_ENV ? invariant(
      ExecutionEnvironment.canUseDOM,
      'dangerouslyRenderMarkup(...): Cannot render markup in a worker ' +
      'thread. Make sure `window` and `document` are available globally ' +
      'before requiring React when unit testing or use ' +
      'React.renderToString for server rendering.'
    ) : invariant(ExecutionEnvironment.canUseDOM));
    var nodeName;
    var markupByNodeName = {};
    // Group markup by `nodeName` if a wrap is necessary, else by '*'.
    for (var i = 0; i < markupList.length; i++) {
      ("production" !== process.env.NODE_ENV ? invariant(
        markupList[i],
        'dangerouslyRenderMarkup(...): Missing markup.'
      ) : invariant(markupList[i]));
      nodeName = getNodeName(markupList[i]);
      nodeName = getMarkupWrap(nodeName) ? nodeName : '*';
      markupByNodeName[nodeName] = markupByNodeName[nodeName] || [];
      markupByNodeName[nodeName][i] = markupList[i];
    }
    var resultList = [];
    var resultListAssignmentCount = 0;
    for (nodeName in markupByNodeName) {
      if (!markupByNodeName.hasOwnProperty(nodeName)) {
        continue;
      }
      var markupListByNodeName = markupByNodeName[nodeName];

      // This for-in loop skips the holes of the sparse array. The order of
      // iteration should follow the order of assignment, which happens to match
      // numerical index order, but we don't rely on that.
      var resultIndex;
      for (resultIndex in markupListByNodeName) {
        if (markupListByNodeName.hasOwnProperty(resultIndex)) {
          var markup = markupListByNodeName[resultIndex];

          // Push the requested markup with an additional RESULT_INDEX_ATTR
          // attribute.  If the markup does not start with a < character, it
          // will be discarded below (with an appropriate console.error).
          markupListByNodeName[resultIndex] = markup.replace(
            OPEN_TAG_NAME_EXP,
            // This index will be parsed back out below.
            '$1 ' + RESULT_INDEX_ATTR + '="' + resultIndex + '" '
          );
        }
      }

      // Render each group of markup with similar wrapping `nodeName`.
      var renderNodes = createNodesFromMarkup(
        markupListByNodeName.join(''),
        emptyFunction // Do nothing special with <script> tags.
      );

      for (var j = 0; j < renderNodes.length; ++j) {
        var renderNode = renderNodes[j];
        if (renderNode.hasAttribute &&
            renderNode.hasAttribute(RESULT_INDEX_ATTR)) {

          resultIndex = +renderNode.getAttribute(RESULT_INDEX_ATTR);
          renderNode.removeAttribute(RESULT_INDEX_ATTR);

          ("production" !== process.env.NODE_ENV ? invariant(
            !resultList.hasOwnProperty(resultIndex),
            'Danger: Assigning to an already-occupied result index.'
          ) : invariant(!resultList.hasOwnProperty(resultIndex)));

          resultList[resultIndex] = renderNode;

          // This should match resultList.length and markupList.length when
          // we're done.
          resultListAssignmentCount += 1;

        } else if ("production" !== process.env.NODE_ENV) {
          console.error(
            'Danger: Discarding unexpected node:',
            renderNode
          );
        }
      }
    }

    // Although resultList was populated out of order, it should now be a dense
    // array.
    ("production" !== process.env.NODE_ENV ? invariant(
      resultListAssignmentCount === resultList.length,
      'Danger: Did not assign to every index of resultList.'
    ) : invariant(resultListAssignmentCount === resultList.length));

    ("production" !== process.env.NODE_ENV ? invariant(
      resultList.length === markupList.length,
      'Danger: Expected markup to render %s nodes, but rendered %s.',
      markupList.length,
      resultList.length
    ) : invariant(resultList.length === markupList.length));

    return resultList;
  },

  /**
   * Replaces a node with a string of markup at its current position within its
   * parent. The markup must render into a single root node.
   *
   * @param {DOMElement} oldChild Child node to replace.
   * @param {string} markup Markup to render in place of the child node.
   * @internal
   */
  dangerouslyReplaceNodeWithMarkup: function(oldChild, markup) {
    ("production" !== process.env.NODE_ENV ? invariant(
      ExecutionEnvironment.canUseDOM,
      'dangerouslyReplaceNodeWithMarkup(...): Cannot render markup in a ' +
      'worker thread. Make sure `window` and `document` are available ' +
      'globally before requiring React when unit testing or use ' +
      'React.renderToString for server rendering.'
    ) : invariant(ExecutionEnvironment.canUseDOM));
    ("production" !== process.env.NODE_ENV ? invariant(markup, 'dangerouslyReplaceNodeWithMarkup(...): Missing markup.') : invariant(markup));
    ("production" !== process.env.NODE_ENV ? invariant(
      oldChild.tagName.toLowerCase() !== 'html',
      'dangerouslyReplaceNodeWithMarkup(...): Cannot replace markup of the ' +
      '<html> node. This is because browser quirks make this unreliable ' +
      'and/or slow. If you want to render to the root you must use ' +
      'server rendering. See React.renderToString().'
    ) : invariant(oldChild.tagName.toLowerCase() !== 'html'));

    var newChild = createNodesFromMarkup(markup, emptyFunction)[0];
    oldChild.parentNode.replaceChild(newChild, oldChild);
  }

};

module.exports = Danger;

}).call(this,require('_process'))
},{"./ExecutionEnvironment":27,"./createNodesFromMarkup":119,"./emptyFunction":121,"./getMarkupWrap":134,"./invariant":142,"_process":6}],19:[function(require,module,exports){
/**
 * Copyright 2013-2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule DefaultEventPluginOrder
 */

'use strict';

var keyOf = require("./keyOf");

/**
 * Module that is injectable into `EventPluginHub`, that specifies a
 * deterministic ordering of `EventPlugin`s. A convenient way to reason about
 * plugins, without having to package every one of them. This is better than
 * having plugins be ordered in the same order that they are injected because
 * that ordering would be influenced by the packaging order.
 * `ResponderEventPlugin` must occur before `SimpleEventPlugin` so that
 * preventing default on events is convenient in `SimpleEventPlugin` handlers.
 */
var DefaultEventPluginOrder = [
  keyOf({ResponderEventPlugin: null}),
  keyOf({SimpleEventPlugin: null}),
  keyOf({TapEventPlugin: null}),
  keyOf({EnterLeaveEventPlugin: null}),
  keyOf({ChangeEventPlugin: null}),
  keyOf({SelectEventPlugin: null}),
  keyOf({BeforeInputEventPlugin: null}),
  keyOf({AnalyticsEventPlugin: null}),
  keyOf({MobileSafariClickEventPlugin: null})
];

module.exports = DefaultEventPluginOrder;

},{"./keyOf":148}],20:[function(require,module,exports){
/**
 * Copyright 2013-2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule EnterLeaveEventPlugin
 * @typechecks static-only
 */

'use strict';

var EventConstants = require("./EventConstants");
var EventPropagators = require("./EventPropagators");
var SyntheticMouseEvent = require("./SyntheticMouseEvent");

var ReactMount = require("./ReactMount");
var keyOf = require("./keyOf");

var topLevelTypes = EventConstants.topLevelTypes;
var getFirstReactDOM = ReactMount.getFirstReactDOM;

var eventTypes = {
  mouseEnter: {
    registrationName: keyOf({onMouseEnter: null}),
    dependencies: [
      topLevelTypes.topMouseOut,
      topLevelTypes.topMouseOver
    ]
  },
  mouseLeave: {
    registrationName: keyOf({onMouseLeave: null}),
    dependencies: [
      topLevelTypes.topMouseOut,
      topLevelTypes.topMouseOver
    ]
  }
};

var extractedEvents = [null, null];

var EnterLeaveEventPlugin = {

  eventTypes: eventTypes,

  /**
   * For almost every interaction we care about, there will be both a top-level
   * `mouseover` and `mouseout` event that occurs. Only use `mouseout` so that
   * we do not extract duplicate events. However, moving the mouse into the
   * browser from outside will not fire a `mouseout` event. In this case, we use
   * the `mouseover` top-level event.
   *
   * @param {string} topLevelType Record from `EventConstants`.
   * @param {DOMEventTarget} topLevelTarget The listening component root node.
   * @param {string} topLevelTargetID ID of `topLevelTarget`.
   * @param {object} nativeEvent Native browser event.
   * @return {*} An accumulation of synthetic events.
   * @see {EventPluginHub.extractEvents}
   */
  extractEvents: function(
      topLevelType,
      topLevelTarget,
      topLevelTargetID,
      nativeEvent) {
    if (topLevelType === topLevelTypes.topMouseOver &&
        (nativeEvent.relatedTarget || nativeEvent.fromElement)) {
      return null;
    }
    if (topLevelType !== topLevelTypes.topMouseOut &&
        topLevelType !== topLevelTypes.topMouseOver) {
      // Must not be a mouse in or mouse out - ignoring.
      return null;
    }

    var win;
    if (topLevelTarget.window === topLevelTarget) {
      // `topLevelTarget` is probably a window object.
      win = topLevelTarget;
    } else {
      // TODO: Figure out why `ownerDocument` is sometimes undefined in IE8.
      var doc = topLevelTarget.ownerDocument;
      if (doc) {
        win = doc.defaultView || doc.parentWindow;
      } else {
        win = window;
      }
    }

    var from, to;
    if (topLevelType === topLevelTypes.topMouseOut) {
      from = topLevelTarget;
      to =
        getFirstReactDOM(nativeEvent.relatedTarget || nativeEvent.toElement) ||
        win;
    } else {
      from = win;
      to = topLevelTarget;
    }

    if (from === to) {
      // Nothing pertains to our managed components.
      return null;
    }

    var fromID = from ? ReactMount.getID(from) : '';
    var toID = to ? ReactMount.getID(to) : '';

    var leave = SyntheticMouseEvent.getPooled(
      eventTypes.mouseLeave,
      fromID,
      nativeEvent
    );
    leave.type = 'mouseleave';
    leave.target = from;
    leave.relatedTarget = to;

    var enter = SyntheticMouseEvent.getPooled(
      eventTypes.mouseEnter,
      toID,
      nativeEvent
    );
    enter.type = 'mouseenter';
    enter.target = to;
    enter.relatedTarget = from;

    EventPropagators.accumulateEnterLeaveDispatches(leave, enter, fromID, toID);

    extractedEvents[0] = leave;
    extractedEvents[1] = enter;

    return extractedEvents;
  }

};

module.exports = EnterLeaveEventPlugin;

},{"./EventConstants":21,"./EventPropagators":26,"./ReactMount":77,"./SyntheticMouseEvent":106,"./keyOf":148}],21:[function(require,module,exports){
/**
 * Copyright 2013-2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule EventConstants
 */

'use strict';

var keyMirror = require("./keyMirror");

var PropagationPhases = keyMirror({bubbled: null, captured: null});

/**
 * Types of raw signals from the browser caught at the top level.
 */
var topLevelTypes = keyMirror({
  topBlur: null,
  topChange: null,
  topClick: null,
  topCompositionEnd: null,
  topCompositionStart: null,
  topCompositionUpdate: null,
  topContextMenu: null,
  topCopy: null,
  topCut: null,
  topDoubleClick: null,
  topDrag: null,
  topDragEnd: null,
  topDragEnter: null,
  topDragExit: null,
  topDragLeave: null,
  topDragOver: null,
  topDragStart: null,
  topDrop: null,
  topError: null,
  topFocus: null,
  topInput: null,
  topKeyDown: null,
  topKeyPress: null,
  topKeyUp: null,
  topLoad: null,
  topMouseDown: null,
  topMouseMove: null,
  topMouseOut: null,
  topMouseOver: null,
  topMouseUp: null,
  topPaste: null,
  topReset: null,
  topScroll: null,
  topSelectionChange: null,
  topSubmit: null,
  topTextInput: null,
  topTouchCancel: null,
  topTouchEnd: null,
  topTouchMove: null,
  topTouchStart: null,
  topWheel: null
});

var EventConstants = {
  topLevelTypes: topLevelTypes,
  PropagationPhases: PropagationPhases
};

module.exports = EventConstants;

},{"./keyMirror":147}],22:[function(require,module,exports){
(function (process){
/**
 * Copyright 2013-2015, Facebook, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @providesModule EventListener
 * @typechecks
 */

var emptyFunction = require("./emptyFunction");

/**
 * Upstream version of event listener. Does not take into account specific
 * nature of platform.
 */
var EventListener = {
  /**
   * Listen to DOM events during the bubble phase.
   *
   * @param {DOMEventTarget} target DOM element to register listener on.
   * @param {string} eventType Event type, e.g. 'click' or 'mouseover'.
   * @param {function} callback Callback function.
   * @return {object} Object with a `remove` method.
   */
  listen: function(target, eventType, callback) {
    if (target.addEventListener) {
      target.addEventListener(eventType, callback, false);
      return {
        remove: function() {
          target.removeEventListener(eventType, callback, false);
        }
      };
    } else if (target.attachEvent) {
      target.attachEvent('on' + eventType, callback);
      return {
        remove: function() {
          target.detachEvent('on' + eventType, callback);
        }
      };
    }
  },

  /**
   * Listen to DOM events during the capture phase.
   *
   * @param {DOMEventTarget} target DOM element to register listener on.
   * @param {string} eventType Event type, e.g. 'click' or 'mouseover'.
   * @param {function} callback Callback function.
   * @return {object} Object with a `remove` method.
   */
  capture: function(target, eventType, callback) {
    if (!target.addEventListener) {
      if ("production" !== process.env.NODE_ENV) {
        console.error(
          'Attempted to listen to events during the capture phase on a ' +
          'browser that does not support the capture phase. Your application ' +
          'will not receive some events.'
        );
      }
      return {
        remove: emptyFunction
      };
    } else {
      target.addEventListener(eventType, callback, true);
      return {
        remove: function() {
          target.removeEventListener(eventType, callback, true);
        }
      };
    }
  },

  registerDefault: function() {}
};

module.exports = EventListener;

}).call(this,require('_process'))
},{"./emptyFunction":121,"_process":6}],23:[function(require,module,exports){
(function (process){
/**
 * Copyright 2013-2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule EventPluginHub
 */

'use strict';

var EventPluginRegistry = require("./EventPluginRegistry");
var EventPluginUtils = require("./EventPluginUtils");

var accumulateInto = require("./accumulateInto");
var forEachAccumulated = require("./forEachAccumulated");
var invariant = require("./invariant");

/**
 * Internal store for event listeners
 */
var listenerBank = {};

/**
 * Internal queue of events that have accumulated their dispatches and are
 * waiting to have their dispatches executed.
 */
var eventQueue = null;

/**
 * Dispatches an event and releases it back into the pool, unless persistent.
 *
 * @param {?object} event Synthetic event to be dispatched.
 * @private
 */
var executeDispatchesAndRelease = function(event) {
  if (event) {
    var executeDispatch = EventPluginUtils.executeDispatch;
    // Plugins can provide custom behavior when dispatching events.
    var PluginModule = EventPluginRegistry.getPluginModuleForEvent(event);
    if (PluginModule && PluginModule.executeDispatch) {
      executeDispatch = PluginModule.executeDispatch;
    }
    EventPluginUtils.executeDispatchesInOrder(event, executeDispatch);

    if (!event.isPersistent()) {
      event.constructor.release(event);
    }
  }
};

/**
 * - `InstanceHandle`: [required] Module that performs logical traversals of DOM
 *   hierarchy given ids of the logical DOM elements involved.
 */
var InstanceHandle = null;

function validateInstanceHandle() {
  var valid =
    InstanceHandle &&
    InstanceHandle.traverseTwoPhase &&
    InstanceHandle.traverseEnterLeave;
  ("production" !== process.env.NODE_ENV ? invariant(
    valid,
    'InstanceHandle not injected before use!'
  ) : invariant(valid));
}

/**
 * This is a unified interface for event plugins to be installed and configured.
 *
 * Event plugins can implement the following properties:
 *
 *   `extractEvents` {function(string, DOMEventTarget, string, object): *}
 *     Required. When a top-level event is fired, this method is expected to
 *     extract synthetic events that will in turn be queued and dispatched.
 *
 *   `eventTypes` {object}
 *     Optional, plugins that fire events must publish a mapping of registration
 *     names that are used to register listeners. Values of this mapping must
 *     be objects that contain `registrationName` or `phasedRegistrationNames`.
 *
 *   `executeDispatch` {function(object, function, string)}
 *     Optional, allows plugins to override how an event gets dispatched. By
 *     default, the listener is simply invoked.
 *
 * Each plugin that is injected into `EventsPluginHub` is immediately operable.
 *
 * @public
 */
var EventPluginHub = {

  /**
   * Methods for injecting dependencies.
   */
  injection: {

    /**
     * @param {object} InjectedMount
     * @public
     */
    injectMount: EventPluginUtils.injection.injectMount,

    /**
     * @param {object} InjectedInstanceHandle
     * @public
     */
    injectInstanceHandle: function(InjectedInstanceHandle) {
      InstanceHandle = InjectedInstanceHandle;
      if ("production" !== process.env.NODE_ENV) {
        validateInstanceHandle();
      }
    },

    getInstanceHandle: function() {
      if ("production" !== process.env.NODE_ENV) {
        validateInstanceHandle();
      }
      return InstanceHandle;
    },

    /**
     * @param {array} InjectedEventPluginOrder
     * @public
     */
    injectEventPluginOrder: EventPluginRegistry.injectEventPluginOrder,

    /**
     * @param {object} injectedNamesToPlugins Map from names to plugin modules.
     */
    injectEventPluginsByName: EventPluginRegistry.injectEventPluginsByName

  },

  eventNameDispatchConfigs: EventPluginRegistry.eventNameDispatchConfigs,

  registrationNameModules: EventPluginRegistry.registrationNameModules,

  /**
   * Stores `listener` at `listenerBank[registrationName][id]`. Is idempotent.
   *
   * @param {string} id ID of the DOM element.
   * @param {string} registrationName Name of listener (e.g. `onClick`).
   * @param {?function} listener The callback to store.
   */
  putListener: function(id, registrationName, listener) {
    ("production" !== process.env.NODE_ENV ? invariant(
      !listener || typeof listener === 'function',
      'Expected %s listener to be a function, instead got type %s',
      registrationName, typeof listener
    ) : invariant(!listener || typeof listener === 'function'));

    var bankForRegistrationName =
      listenerBank[registrationName] || (listenerBank[registrationName] = {});
    bankForRegistrationName[id] = listener;
  },

  /**
   * @param {string} id ID of the DOM element.
   * @param {string} registrationName Name of listener (e.g. `onClick`).
   * @return {?function} The stored callback.
   */
  getListener: function(id, registrationName) {
    var bankForRegistrationName = listenerBank[registrationName];
    return bankForRegistrationName && bankForRegistrationName[id];
  },

  /**
   * Deletes a listener from the registration bank.
   *
   * @param {string} id ID of the DOM element.
   * @param {string} registrationName Name of listener (e.g. `onClick`).
   */
  deleteListener: function(id, registrationName) {
    var bankForRegistrationName = listenerBank[registrationName];
    if (bankForRegistrationName) {
      delete bankForRegistrationName[id];
    }
  },

  /**
   * Deletes all listeners for the DOM element with the supplied ID.
   *
   * @param {string} id ID of the DOM element.
   */
  deleteAllListeners: function(id) {
    for (var registrationName in listenerBank) {
      delete listenerBank[registrationName][id];
    }
  },

  /**
   * Allows registered plugins an opportunity to extract events from top-level
   * native browser events.
   *
   * @param {string} topLevelType Record from `EventConstants`.
   * @param {DOMEventTarget} topLevelTarget The listening component root node.
   * @param {string} topLevelTargetID ID of `topLevelTarget`.
   * @param {object} nativeEvent Native browser event.
   * @return {*} An accumulation of synthetic events.
   * @internal
   */
  extractEvents: function(
      topLevelType,
      topLevelTarget,
      topLevelTargetID,
      nativeEvent) {
    var events;
    var plugins = EventPluginRegistry.plugins;
    for (var i = 0, l = plugins.length; i < l; i++) {
      // Not every plugin in the ordering may be loaded at runtime.
      var possiblePlugin = plugins[i];
      if (possiblePlugin) {
        var extractedEvents = possiblePlugin.extractEvents(
          topLevelType,
          topLevelTarget,
          topLevelTargetID,
          nativeEvent
        );
        if (extractedEvents) {
          events = accumulateInto(events, extractedEvents);
        }
      }
    }
    return events;
  },

  /**
   * Enqueues a synthetic event that should be dispatched when
   * `processEventQueue` is invoked.
   *
   * @param {*} events An accumulation of synthetic events.
   * @internal
   */
  enqueueEvents: function(events) {
    if (events) {
      eventQueue = accumulateInto(eventQueue, events);
    }
  },

  /**
   * Dispatches all synthetic events on the event queue.
   *
   * @internal
   */
  processEventQueue: function() {
    // Set `eventQueue` to null before processing it so that we can tell if more
    // events get enqueued while processing.
    var processingEventQueue = eventQueue;
    eventQueue = null;
    forEachAccumulated(processingEventQueue, executeDispatchesAndRelease);
    ("production" !== process.env.NODE_ENV ? invariant(
      !eventQueue,
      'processEventQueue(): Additional events were enqueued while processing ' +
      'an event queue. Support for this has not yet been implemented.'
    ) : invariant(!eventQueue));
  },

  /**
   * These are needed for tests only. Do not use!
   */
  __purge: function() {
    listenerBank = {};
  },

  __getListenerBank: function() {
    return listenerBank;
  }

};

module.exports = EventPluginHub;

}).call(this,require('_process'))
},{"./EventPluginRegistry":24,"./EventPluginUtils":25,"./accumulateInto":112,"./forEachAccumulated":127,"./invariant":142,"_process":6}],24:[function(require,module,exports){
(function (process){
/**
 * Copyright 2013-2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule EventPluginRegistry
 * @typechecks static-only
 */

'use strict';

var invariant = require("./invariant");

/**
 * Injectable ordering of event plugins.
 */
var EventPluginOrder = null;

/**
 * Injectable mapping from names to event plugin modules.
 */
var namesToPlugins = {};

/**
 * Recomputes the plugin list using the injected plugins and plugin ordering.
 *
 * @private
 */
function recomputePluginOrdering() {
  if (!EventPluginOrder) {
    // Wait until an `EventPluginOrder` is injected.
    return;
  }
  for (var pluginName in namesToPlugins) {
    var PluginModule = namesToPlugins[pluginName];
    var pluginIndex = EventPluginOrder.indexOf(pluginName);
    ("production" !== process.env.NODE_ENV ? invariant(
      pluginIndex > -1,
      'EventPluginRegistry: Cannot inject event plugins that do not exist in ' +
      'the plugin ordering, `%s`.',
      pluginName
    ) : invariant(pluginIndex > -1));
    if (EventPluginRegistry.plugins[pluginIndex]) {
      continue;
    }
    ("production" !== process.env.NODE_ENV ? invariant(
      PluginModule.extractEvents,
      'EventPluginRegistry: Event plugins must implement an `extractEvents` ' +
      'method, but `%s` does not.',
      pluginName
    ) : invariant(PluginModule.extractEvents));
    EventPluginRegistry.plugins[pluginIndex] = PluginModule;
    var publishedEvents = PluginModule.eventTypes;
    for (var eventName in publishedEvents) {
      ("production" !== process.env.NODE_ENV ? invariant(
        publishEventForPlugin(
          publishedEvents[eventName],
          PluginModule,
          eventName
        ),
        'EventPluginRegistry: Failed to publish event `%s` for plugin `%s`.',
        eventName,
        pluginName
      ) : invariant(publishEventForPlugin(
        publishedEvents[eventName],
        PluginModule,
        eventName
      )));
    }
  }
}

/**
 * Publishes an event so that it can be dispatched by the supplied plugin.
 *
 * @param {object} dispatchConfig Dispatch configuration for the event.
 * @param {object} PluginModule Plugin publishing the event.
 * @return {boolean} True if the event was successfully published.
 * @private
 */
function publishEventForPlugin(dispatchConfig, PluginModule, eventName) {
  ("production" !== process.env.NODE_ENV ? invariant(
    !EventPluginRegistry.eventNameDispatchConfigs.hasOwnProperty(eventName),
    'EventPluginHub: More than one plugin attempted to publish the same ' +
    'event name, `%s`.',
    eventName
  ) : invariant(!EventPluginRegistry.eventNameDispatchConfigs.hasOwnProperty(eventName)));
  EventPluginRegistry.eventNameDispatchConfigs[eventName] = dispatchConfig;

  var phasedRegistrationNames = dispatchConfig.phasedRegistrationNames;
  if (phasedRegistrationNames) {
    for (var phaseName in phasedRegistrationNames) {
      if (phasedRegistrationNames.hasOwnProperty(phaseName)) {
        var phasedRegistrationName = phasedRegistrationNames[phaseName];
        publishRegistrationName(
          phasedRegistrationName,
          PluginModule,
          eventName
        );
      }
    }
    return true;
  } else if (dispatchConfig.registrationName) {
    publishRegistrationName(
      dispatchConfig.registrationName,
      PluginModule,
      eventName
    );
    return true;
  }
  return false;
}

/**
 * Publishes a registration name that is used to identify dispatched events and
 * can be used with `EventPluginHub.putListener` to register listeners.
 *
 * @param {string} registrationName Registration name to add.
 * @param {object} PluginModule Plugin publishing the event.
 * @private
 */
function publishRegistrationName(registrationName, PluginModule, eventName) {
  ("production" !== process.env.NODE_ENV ? invariant(
    !EventPluginRegistry.registrationNameModules[registrationName],
    'EventPluginHub: More than one plugin attempted to publish the same ' +
    'registration name, `%s`.',
    registrationName
  ) : invariant(!EventPluginRegistry.registrationNameModules[registrationName]));
  EventPluginRegistry.registrationNameModules[registrationName] = PluginModule;
  EventPluginRegistry.registrationNameDependencies[registrationName] =
    PluginModule.eventTypes[eventName].dependencies;
}

/**
 * Registers plugins so that they can extract and dispatch events.
 *
 * @see {EventPluginHub}
 */
var EventPluginRegistry = {

  /**
   * Ordered list of injected plugins.
   */
  plugins: [],

  /**
   * Mapping from event name to dispatch config
   */
  eventNameDispatchConfigs: {},

  /**
   * Mapping from registration name to plugin module
   */
  registrationNameModules: {},

  /**
   * Mapping from registration name to event name
   */
  registrationNameDependencies: {},

  /**
   * Injects an ordering of plugins (by plugin name). This allows the ordering
   * to be decoupled from injection of the actual plugins so that ordering is
   * always deterministic regardless of packaging, on-the-fly injection, etc.
   *
   * @param {array} InjectedEventPluginOrder
   * @internal
   * @see {EventPluginHub.injection.injectEventPluginOrder}
   */
  injectEventPluginOrder: function(InjectedEventPluginOrder) {
    ("production" !== process.env.NODE_ENV ? invariant(
      !EventPluginOrder,
      'EventPluginRegistry: Cannot inject event plugin ordering more than ' +
      'once. You are likely trying to load more than one copy of React.'
    ) : invariant(!EventPluginOrder));
    // Clone the ordering so it cannot be dynamically mutated.
    EventPluginOrder = Array.prototype.slice.call(InjectedEventPluginOrder);
    recomputePluginOrdering();
  },

  /**
   * Injects plugins to be used by `EventPluginHub`. The plugin names must be
   * in the ordering injected by `injectEventPluginOrder`.
   *
   * Plugins can be injected as part of page initialization or on-the-fly.
   *
   * @param {object} injectedNamesToPlugins Map from names to plugin modules.
   * @internal
   * @see {EventPluginHub.injection.injectEventPluginsByName}
   */
  injectEventPluginsByName: function(injectedNamesToPlugins) {
    var isOrderingDirty = false;
    for (var pluginName in injectedNamesToPlugins) {
      if (!injectedNamesToPlugins.hasOwnProperty(pluginName)) {
        continue;
      }
      var PluginModule = injectedNamesToPlugins[pluginName];
      if (!namesToPlugins.hasOwnProperty(pluginName) ||
          namesToPlugins[pluginName] !== PluginModule) {
        ("production" !== process.env.NODE_ENV ? invariant(
          !namesToPlugins[pluginName],
          'EventPluginRegistry: Cannot inject two different event plugins ' +
          'using the same name, `%s`.',
          pluginName
        ) : invariant(!namesToPlugins[pluginName]));
        namesToPlugins[pluginName] = PluginModule;
        isOrderingDirty = true;
      }
    }
    if (isOrderingDirty) {
      recomputePluginOrdering();
    }
  },

  /**
   * Looks up the plugin for the supplied event.
   *
   * @param {object} event A synthetic event.
   * @return {?object} The plugin that created the supplied event.
   * @internal
   */
  getPluginModuleForEvent: function(event) {
    var dispatchConfig = event.dispatchConfig;
    if (dispatchConfig.registrationName) {
      return EventPluginRegistry.registrationNameModules[
        dispatchConfig.registrationName
      ] || null;
    }
    for (var phase in dispatchConfig.phasedRegistrationNames) {
      if (!dispatchConfig.phasedRegistrationNames.hasOwnProperty(phase)) {
        continue;
      }
      var PluginModule = EventPluginRegistry.registrationNameModules[
        dispatchConfig.phasedRegistrationNames[phase]
      ];
      if (PluginModule) {
        return PluginModule;
      }
    }
    return null;
  },

  /**
   * Exposed for unit testing.
   * @private
   */
  _resetEventPlugins: function() {
    EventPluginOrder = null;
    for (var pluginName in namesToPlugins) {
      if (namesToPlugins.hasOwnProperty(pluginName)) {
        delete namesToPlugins[pluginName];
      }
    }
    EventPluginRegistry.plugins.length = 0;

    var eventNameDispatchConfigs = EventPluginRegistry.eventNameDispatchConfigs;
    for (var eventName in eventNameDispatchConfigs) {
      if (eventNameDispatchConfigs.hasOwnProperty(eventName)) {
        delete eventNameDispatchConfigs[eventName];
      }
    }

    var registrationNameModules = EventPluginRegistry.registrationNameModules;
    for (var registrationName in registrationNameModules) {
      if (registrationNameModules.hasOwnProperty(registrationName)) {
        delete registrationNameModules[registrationName];
      }
    }
  }

};

module.exports = EventPluginRegistry;

}).call(this,require('_process'))
},{"./invariant":142,"_process":6}],25:[function(require,module,exports){
(function (process){
/**
 * Copyright 2013-2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule EventPluginUtils
 */

'use strict';

var EventConstants = require("./EventConstants");

var invariant = require("./invariant");

/**
 * Injected dependencies:
 */

/**
 * - `Mount`: [required] Module that can convert between React dom IDs and
 *   actual node references.
 */
var injection = {
  Mount: null,
  injectMount: function(InjectedMount) {
    injection.Mount = InjectedMount;
    if ("production" !== process.env.NODE_ENV) {
      ("production" !== process.env.NODE_ENV ? invariant(
        InjectedMount && InjectedMount.getNode,
        'EventPluginUtils.injection.injectMount(...): Injected Mount module ' +
        'is missing getNode.'
      ) : invariant(InjectedMount && InjectedMount.getNode));
    }
  }
};

var topLevelTypes = EventConstants.topLevelTypes;

function isEndish(topLevelType) {
  return topLevelType === topLevelTypes.topMouseUp ||
         topLevelType === topLevelTypes.topTouchEnd ||
         topLevelType === topLevelTypes.topTouchCancel;
}

function isMoveish(topLevelType) {
  return topLevelType === topLevelTypes.topMouseMove ||
         topLevelType === topLevelTypes.topTouchMove;
}
function isStartish(topLevelType) {
  return topLevelType === topLevelTypes.topMouseDown ||
         topLevelType === topLevelTypes.topTouchStart;
}


var validateEventDispatches;
if ("production" !== process.env.NODE_ENV) {
  validateEventDispatches = function(event) {
    var dispatchListeners = event._dispatchListeners;
    var dispatchIDs = event._dispatchIDs;

    var listenersIsArr = Array.isArray(dispatchListeners);
    var idsIsArr = Array.isArray(dispatchIDs);
    var IDsLen = idsIsArr ? dispatchIDs.length : dispatchIDs ? 1 : 0;
    var listenersLen = listenersIsArr ?
      dispatchListeners.length :
      dispatchListeners ? 1 : 0;

    ("production" !== process.env.NODE_ENV ? invariant(
      idsIsArr === listenersIsArr && IDsLen === listenersLen,
      'EventPluginUtils: Invalid `event`.'
    ) : invariant(idsIsArr === listenersIsArr && IDsLen === listenersLen));
  };
}

/**
 * Invokes `cb(event, listener, id)`. Avoids using call if no scope is
 * provided. The `(listener,id)` pair effectively forms the "dispatch" but are
 * kept separate to conserve memory.
 */
function forEachEventDispatch(event, cb) {
  var dispatchListeners = event._dispatchListeners;
  var dispatchIDs = event._dispatchIDs;
  if ("production" !== process.env.NODE_ENV) {
    validateEventDispatches(event);
  }
  if (Array.isArray(dispatchListeners)) {
    for (var i = 0; i < dispatchListeners.length; i++) {
      if (event.isPropagationStopped()) {
        break;
      }
      // Listeners and IDs are two parallel arrays that are always in sync.
      cb(event, dispatchListeners[i], dispatchIDs[i]);
    }
  } else if (dispatchListeners) {
    cb(event, dispatchListeners, dispatchIDs);
  }
}

/**
 * Default implementation of PluginModule.executeDispatch().
 * @param {SyntheticEvent} SyntheticEvent to handle
 * @param {function} Application-level callback
 * @param {string} domID DOM id to pass to the callback.
 */
function executeDispatch(event, listener, domID) {
  event.currentTarget = injection.Mount.getNode(domID);
  var returnValue = listener(event, domID);
  event.currentTarget = null;
  return returnValue;
}

/**
 * Standard/simple iteration through an event's collected dispatches.
 */
function executeDispatchesInOrder(event, cb) {
  forEachEventDispatch(event, cb);
  event._dispatchListeners = null;
  event._dispatchIDs = null;
}

/**
 * Standard/simple iteration through an event's collected dispatches, but stops
 * at the first dispatch execution returning true, and returns that id.
 *
 * @return id of the first dispatch execution who's listener returns true, or
 * null if no listener returned true.
 */
function executeDispatchesInOrderStopAtTrueImpl(event) {
  var dispatchListeners = event._dispatchListeners;
  var dispatchIDs = event._dispatchIDs;
  if ("production" !== process.env.NODE_ENV) {
    validateEventDispatches(event);
  }
  if (Array.isArray(dispatchListeners)) {
    for (var i = 0; i < dispatchListeners.length; i++) {
      if (event.isPropagationStopped()) {
        break;
      }
      // Listeners and IDs are two parallel arrays that are always in sync.
      if (dispatchListeners[i](event, dispatchIDs[i])) {
        return dispatchIDs[i];
      }
    }
  } else if (dispatchListeners) {
    if (dispatchListeners(event, dispatchIDs)) {
      return dispatchIDs;
    }
  }
  return null;
}

/**
 * @see executeDispatchesInOrderStopAtTrueImpl
 */
function executeDispatchesInOrderStopAtTrue(event) {
  var ret = executeDispatchesInOrderStopAtTrueImpl(event);
  event._dispatchIDs = null;
  event._dispatchListeners = null;
  return ret;
}

/**
 * Execution of a "direct" dispatch - there must be at most one dispatch
 * accumulated on the event or it is considered an error. It doesn't really make
 * sense for an event with multiple dispatches (bubbled) to keep track of the
 * return values at each dispatch execution, but it does tend to make sense when
 * dealing with "direct" dispatches.
 *
 * @return The return value of executing the single dispatch.
 */
function executeDirectDispatch(event) {
  if ("production" !== process.env.NODE_ENV) {
    validateEventDispatches(event);
  }
  var dispatchListener = event._dispatchListeners;
  var dispatchID = event._dispatchIDs;
  ("production" !== process.env.NODE_ENV ? invariant(
    !Array.isArray(dispatchListener),
    'executeDirectDispatch(...): Invalid `event`.'
  ) : invariant(!Array.isArray(dispatchListener)));
  var res = dispatchListener ?
    dispatchListener(event, dispatchID) :
    null;
  event._dispatchListeners = null;
  event._dispatchIDs = null;
  return res;
}

/**
 * @param {SyntheticEvent} event
 * @return {bool} True iff number of dispatches accumulated is greater than 0.
 */
function hasDispatches(event) {
  return !!event._dispatchListeners;
}

/**
 * General utilities that are useful in creating custom Event Plugins.
 */
var EventPluginUtils = {
  isEndish: isEndish,
  isMoveish: isMoveish,
  isStartish: isStartish,

  executeDirectDispatch: executeDirectDispatch,
  executeDispatch: executeDispatch,
  executeDispatchesInOrder: executeDispatchesInOrder,
  executeDispatchesInOrderStopAtTrue: executeDispatchesInOrderStopAtTrue,
  hasDispatches: hasDispatches,
  injection: injection,
  useTouchEvents: false
};

module.exports = EventPluginUtils;

}).call(this,require('_process'))
},{"./EventConstants":21,"./invariant":142,"_process":6}],26:[function(require,module,exports){
(function (process){
/**
 * Copyright 2013-2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule EventPropagators
 */

'use strict';

var EventConstants = require("./EventConstants");
var EventPluginHub = require("./EventPluginHub");

var accumulateInto = require("./accumulateInto");
var forEachAccumulated = require("./forEachAccumulated");

var PropagationPhases = EventConstants.PropagationPhases;
var getListener = EventPluginHub.getListener;

/**
 * Some event types have a notion of different registration names for different
 * "phases" of propagation. This finds listeners by a given phase.
 */
function listenerAtPhase(id, event, propagationPhase) {
  var registrationName =
    event.dispatchConfig.phasedRegistrationNames[propagationPhase];
  return getListener(id, registrationName);
}

/**
 * Tags a `SyntheticEvent` with dispatched listeners. Creating this function
 * here, allows us to not have to bind or create functions for each event.
 * Mutating the event's members allows us to not have to create a wrapping
 * "dispatch" object that pairs the event with the listener.
 */
function accumulateDirectionalDispatches(domID, upwards, event) {
  if ("production" !== process.env.NODE_ENV) {
    if (!domID) {
      throw new Error('Dispatching id must not be null');
    }
  }
  var phase = upwards ? PropagationPhases.bubbled : PropagationPhases.captured;
  var listener = listenerAtPhase(domID, event, phase);
  if (listener) {
    event._dispatchListeners =
      accumulateInto(event._dispatchListeners, listener);
    event._dispatchIDs = accumulateInto(event._dispatchIDs, domID);
  }
}

/**
 * Collect dispatches (must be entirely collected before dispatching - see unit
 * tests). Lazily allocate the array to conserve memory.  We must loop through
 * each event and perform the traversal for each one. We can not perform a
 * single traversal for the entire collection of events because each event may
 * have a different target.
 */
function accumulateTwoPhaseDispatchesSingle(event) {
  if (event && event.dispatchConfig.phasedRegistrationNames) {
    EventPluginHub.injection.getInstanceHandle().traverseTwoPhase(
      event.dispatchMarker,
      accumulateDirectionalDispatches,
      event
    );
  }
}


/**
 * Accumulates without regard to direction, does not look for phased
 * registration names. Same as `accumulateDirectDispatchesSingle` but without
 * requiring that the `dispatchMarker` be the same as the dispatched ID.
 */
function accumulateDispatches(id, ignoredDirection, event) {
  if (event && event.dispatchConfig.registrationName) {
    var registrationName = event.dispatchConfig.registrationName;
    var listener = getListener(id, registrationName);
    if (listener) {
      event._dispatchListeners =
        accumulateInto(event._dispatchListeners, listener);
      event._dispatchIDs = accumulateInto(event._dispatchIDs, id);
    }
  }
}

/**
 * Accumulates dispatches on an `SyntheticEvent`, but only for the
 * `dispatchMarker`.
 * @param {SyntheticEvent} event
 */
function accumulateDirectDispatchesSingle(event) {
  if (event && event.dispatchConfig.registrationName) {
    accumulateDispatches(event.dispatchMarker, null, event);
  }
}

function accumulateTwoPhaseDispatches(events) {
  forEachAccumulated(events, accumulateTwoPhaseDispatchesSingle);
}

function accumulateEnterLeaveDispatches(leave, enter, fromID, toID) {
  EventPluginHub.injection.getInstanceHandle().traverseEnterLeave(
    fromID,
    toID,
    accumulateDispatches,
    leave,
    enter
  );
}


function accumulateDirectDispatches(events) {
  forEachAccumulated(events, accumulateDirectDispatchesSingle);
}



/**
 * A small set of propagation patterns, each of which will accept a small amount
 * of information, and generate a set of "dispatch ready event objects" - which
 * are sets of events that have already been annotated with a set of dispatched
 * listener functions/ids. The API is designed this way to discourage these
 * propagation strategies from actually executing the dispatches, since we
 * always want to collect the entire set of dispatches before executing event a
 * single one.
 *
 * @constructor EventPropagators
 */
var EventPropagators = {
  accumulateTwoPhaseDispatches: accumulateTwoPhaseDispatches,
  accumulateDirectDispatches: accumulateDirectDispatches,
  accumulateEnterLeaveDispatches: accumulateEnterLeaveDispatches
};

module.exports = EventPropagators;

}).call(this,require('_process'))
},{"./EventConstants":21,"./EventPluginHub":23,"./accumulateInto":112,"./forEachAccumulated":127,"_process":6}],27:[function(require,module,exports){
/**
 * Copyright 2013-2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule ExecutionEnvironment
 */

/*jslint evil: true */

"use strict";

var canUseDOM = !!(
  (typeof window !== 'undefined' &&
  window.document && window.document.createElement)
);

/**
 * Simple, lightweight module assisting with the detection and context of
 * Worker. Helps avoid circular dependencies and allows code to reason about
 * whether or not they are in a Worker, even if they never include the main
 * `ReactWorker` dependency.
 */
var ExecutionEnvironment = {

  canUseDOM: canUseDOM,

  canUseWorkers: typeof Worker !== 'undefined',

  canUseEventListeners:
    canUseDOM && !!(window.addEventListener || window.attachEvent),

  canUseViewport: canUseDOM && !!window.screen,

  isInWorker: !canUseDOM // For now, this is true - might change in the future.

};

module.exports = ExecutionEnvironment;

},{}],28:[function(require,module,exports){
/**
 * Copyright 2013-2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule FallbackCompositionState
 * @typechecks static-only
 */

'use strict';

var PooledClass = require("./PooledClass");

var assign = require("./Object.assign");
var getTextContentAccessor = require("./getTextContentAccessor");

/**
 * This helper class stores information about text content of a target node,
 * allowing comparison of content before and after a given event.
 *
 * Identify the node where selection currently begins, then observe
 * both its text content and its current position in the DOM. Since the
 * browser may natively replace the target node during composition, we can
 * use its position to find its replacement.
 *
 * @param {DOMEventTarget} root
 */
function FallbackCompositionState(root) {
  this._root = root;
  this._startText = this.getText();
  this._fallbackText = null;
}

assign(FallbackCompositionState.prototype, {
  /**
   * Get current text of input.
   *
   * @return {string}
   */
  getText: function() {
    if ('value' in this._root) {
      return this._root.value;
    }
    return this._root[getTextContentAccessor()];
  },

  /**
   * Determine the differing substring between the initially stored
   * text content and the current content.
   *
   * @return {string}
   */
  getData: function() {
    if (this._fallbackText) {
      return this._fallbackText;
    }

    var start;
    var startValue = this._startText;
    var startLength = startValue.length;
    var end;
    var endValue = this.getText();
    var endLength = endValue.length;

    for (start = 0; start < startLength; start++) {
      if (startValue[start] !== endValue[start]) {
        break;
      }
    }

    var minEnd = startLength - start;
    for (end = 1; end <= minEnd; end++) {
      if (startValue[startLength - end] !== endValue[endLength - end]) {
        break;
      }
    }

    var sliceTail = end > 1 ? 1 - end : undefined;
    this._fallbackText = endValue.slice(start, sliceTail);
    return this._fallbackText;
  }
});

PooledClass.addPoolingTo(FallbackCompositionState);

module.exports = FallbackCompositionState;

},{"./Object.assign":33,"./PooledClass":34,"./getTextContentAccessor":137}],29:[function(require,module,exports){
/**
 * Copyright 2013-2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule HTMLDOMPropertyConfig
 */

/*jslint bitwise: true*/

'use strict';

var DOMProperty = require("./DOMProperty");
var ExecutionEnvironment = require("./ExecutionEnvironment");

var MUST_USE_ATTRIBUTE = DOMProperty.injection.MUST_USE_ATTRIBUTE;
var MUST_USE_PROPERTY = DOMProperty.injection.MUST_USE_PROPERTY;
var HAS_BOOLEAN_VALUE = DOMProperty.injection.HAS_BOOLEAN_VALUE;
var HAS_SIDE_EFFECTS = DOMProperty.injection.HAS_SIDE_EFFECTS;
var HAS_NUMERIC_VALUE = DOMProperty.injection.HAS_NUMERIC_VALUE;
var HAS_POSITIVE_NUMERIC_VALUE =
  DOMProperty.injection.HAS_POSITIVE_NUMERIC_VALUE;
var HAS_OVERLOADED_BOOLEAN_VALUE =
  DOMProperty.injection.HAS_OVERLOADED_BOOLEAN_VALUE;

var hasSVG;
if (ExecutionEnvironment.canUseDOM) {
  var implementation = document.implementation;
  hasSVG = (
    implementation &&
    implementation.hasFeature &&
    implementation.hasFeature(
      'http://www.w3.org/TR/SVG11/feature#BasicStructure',
      '1.1'
    )
  );
}


var HTMLDOMPropertyConfig = {
  isCustomAttribute: RegExp.prototype.test.bind(
    /^(data|aria)-[a-z_][a-z\d_.\-]*$/
  ),
  Properties: {
    /**
     * Standard Properties
     */
    accept: null,
    acceptCharset: null,
    accessKey: null,
    action: null,
    allowFullScreen: MUST_USE_ATTRIBUTE | HAS_BOOLEAN_VALUE,
    allowTransparency: MUST_USE_ATTRIBUTE,
    alt: null,
    async: HAS_BOOLEAN_VALUE,
    autoComplete: null,
    // autoFocus is polyfilled/normalized by AutoFocusMixin
    // autoFocus: HAS_BOOLEAN_VALUE,
    autoPlay: HAS_BOOLEAN_VALUE,
    cellPadding: null,
    cellSpacing: null,
    charSet: MUST_USE_ATTRIBUTE,
    checked: MUST_USE_PROPERTY | HAS_BOOLEAN_VALUE,
    classID: MUST_USE_ATTRIBUTE,
    // To set className on SVG elements, it's necessary to use .setAttribute;
    // this works on HTML elements too in all browsers except IE8. Conveniently,
    // IE8 doesn't support SVG and so we can simply use the attribute in
    // browsers that support SVG and the property in browsers that don't,
    // regardless of whether the element is HTML or SVG.
    className: hasSVG ? MUST_USE_ATTRIBUTE : MUST_USE_PROPERTY,
    cols: MUST_USE_ATTRIBUTE | HAS_POSITIVE_NUMERIC_VALUE,
    colSpan: null,
    content: null,
    contentEditable: null,
    contextMenu: MUST_USE_ATTRIBUTE,
    controls: MUST_USE_PROPERTY | HAS_BOOLEAN_VALUE,
    coords: null,
    crossOrigin: null,
    data: null, // For `<object />` acts as `src`.
    dateTime: MUST_USE_ATTRIBUTE,
    defer: HAS_BOOLEAN_VALUE,
    dir: null,
    disabled: MUST_USE_ATTRIBUTE | HAS_BOOLEAN_VALUE,
    download: HAS_OVERLOADED_BOOLEAN_VALUE,
    draggable: null,
    encType: null,
    form: MUST_USE_ATTRIBUTE,
    formAction: MUST_USE_ATTRIBUTE,
    formEncType: MUST_USE_ATTRIBUTE,
    formMethod: MUST_USE_ATTRIBUTE,
    formNoValidate: HAS_BOOLEAN_VALUE,
    formTarget: MUST_USE_ATTRIBUTE,
    frameBorder: MUST_USE_ATTRIBUTE,
    headers: null,
    height: MUST_USE_ATTRIBUTE,
    hidden: MUST_USE_ATTRIBUTE | HAS_BOOLEAN_VALUE,
    high: null,
    href: null,
    hrefLang: null,
    htmlFor: null,
    httpEquiv: null,
    icon: null,
    id: MUST_USE_PROPERTY,
    label: null,
    lang: null,
    list: MUST_USE_ATTRIBUTE,
    loop: MUST_USE_PROPERTY | HAS_BOOLEAN_VALUE,
    low: null,
    manifest: MUST_USE_ATTRIBUTE,
    marginHeight: null,
    marginWidth: null,
    max: null,
    maxLength: MUST_USE_ATTRIBUTE,
    media: MUST_USE_ATTRIBUTE,
    mediaGroup: null,
    method: null,
    min: null,
    multiple: MUST_USE_PROPERTY | HAS_BOOLEAN_VALUE,
    muted: MUST_USE_PROPERTY | HAS_BOOLEAN_VALUE,
    name: null,
    noValidate: HAS_BOOLEAN_VALUE,
    open: HAS_BOOLEAN_VALUE,
    optimum: null,
    pattern: null,
    placeholder: null,
    poster: null,
    preload: null,
    radioGroup: null,
    readOnly: MUST_USE_PROPERTY | HAS_BOOLEAN_VALUE,
    rel: null,
    required: HAS_BOOLEAN_VALUE,
    role: MUST_USE_ATTRIBUTE,
    rows: MUST_USE_ATTRIBUTE | HAS_POSITIVE_NUMERIC_VALUE,
    rowSpan: null,
    sandbox: null,
    scope: null,
    scoped: HAS_BOOLEAN_VALUE,
    scrolling: null,
    seamless: MUST_USE_ATTRIBUTE | HAS_BOOLEAN_VALUE,
    selected: MUST_USE_PROPERTY | HAS_BOOLEAN_VALUE,
    shape: null,
    size: MUST_USE_ATTRIBUTE | HAS_POSITIVE_NUMERIC_VALUE,
    sizes: MUST_USE_ATTRIBUTE,
    span: HAS_POSITIVE_NUMERIC_VALUE,
    spellCheck: null,
    src: null,
    srcDoc: MUST_USE_PROPERTY,
    srcSet: MUST_USE_ATTRIBUTE,
    start: HAS_NUMERIC_VALUE,
    step: null,
    style: null,
    tabIndex: null,
    target: null,
    title: null,
    type: null,
    useMap: null,
    value: MUST_USE_PROPERTY | HAS_SIDE_EFFECTS,
    width: MUST_USE_ATTRIBUTE,
    wmode: MUST_USE_ATTRIBUTE,

    /**
     * Non-standard Properties
     */
    // autoCapitalize and autoCorrect are supported in Mobile Safari for
    // keyboard hints.
    autoCapitalize: null,
    autoCorrect: null,
    // itemProp, itemScope, itemType are for
    // Microdata support. See http://schema.org/docs/gs.html
    itemProp: MUST_USE_ATTRIBUTE,
    itemScope: MUST_USE_ATTRIBUTE | HAS_BOOLEAN_VALUE,
    itemType: MUST_USE_ATTRIBUTE,
    // itemID and itemRef are for Microdata support as well but
    // only specified in the the WHATWG spec document. See
    // https://html.spec.whatwg.org/multipage/microdata.html#microdata-dom-api
    itemID: MUST_USE_ATTRIBUTE,
    itemRef: MUST_USE_ATTRIBUTE,
    // property is supported for OpenGraph in meta tags.
    property: null,
    // IE-only attribute that controls focus behavior
    unselectable: MUST_USE_ATTRIBUTE
  },
  DOMAttributeNames: {
    acceptCharset: 'accept-charset',
    className: 'class',
    htmlFor: 'for',
    httpEquiv: 'http-equiv'
  },
  DOMPropertyNames: {
    autoCapitalize: 'autocapitalize',
    autoComplete: 'autocomplete',
    autoCorrect: 'autocorrect',
    autoFocus: 'autofocus',
    autoPlay: 'autoplay',
    // `encoding` is equivalent to `enctype`, IE8 lacks an `enctype` setter.
    // http://www.w3.org/TR/html5/forms.html#dom-fs-encoding
    encType: 'encoding',
    hrefLang: 'hreflang',
    radioGroup: 'radiogroup',
    spellCheck: 'spellcheck',
    srcDoc: 'srcdoc',
    srcSet: 'srcset'
  }
};

module.exports = HTMLDOMPropertyConfig;

},{"./DOMProperty":16,"./ExecutionEnvironment":27}],30:[function(require,module,exports){
(function (process){
/**
 * Copyright 2013-2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule LinkedValueUtils
 * @typechecks static-only
 */

'use strict';

var ReactPropTypes = require("./ReactPropTypes");

var invariant = require("./invariant");

var hasReadOnlyValue = {
  'button': true,
  'checkbox': true,
  'image': true,
  'hidden': true,
  'radio': true,
  'reset': true,
  'submit': true
};

function _assertSingleLink(input) {
  ("production" !== process.env.NODE_ENV ? invariant(
    input.props.checkedLink == null || input.props.valueLink == null,
    'Cannot provide a checkedLink and a valueLink. If you want to use ' +
    'checkedLink, you probably don\'t want to use valueLink and vice versa.'
  ) : invariant(input.props.checkedLink == null || input.props.valueLink == null));
}
function _assertValueLink(input) {
  _assertSingleLink(input);
  ("production" !== process.env.NODE_ENV ? invariant(
    input.props.value == null && input.props.onChange == null,
    'Cannot provide a valueLink and a value or onChange event. If you want ' +
    'to use value or onChange, you probably don\'t want to use valueLink.'
  ) : invariant(input.props.value == null && input.props.onChange == null));
}

function _assertCheckedLink(input) {
  _assertSingleLink(input);
  ("production" !== process.env.NODE_ENV ? invariant(
    input.props.checked == null && input.props.onChange == null,
    'Cannot provide a checkedLink and a checked property or onChange event. ' +
    'If you want to use checked or onChange, you probably don\'t want to ' +
    'use checkedLink'
  ) : invariant(input.props.checked == null && input.props.onChange == null));
}

/**
 * @param {SyntheticEvent} e change event to handle
 */
function _handleLinkedValueChange(e) {
  /*jshint validthis:true */
  this.props.valueLink.requestChange(e.target.value);
}

/**
  * @param {SyntheticEvent} e change event to handle
  */
function _handleLinkedCheckChange(e) {
  /*jshint validthis:true */
  this.props.checkedLink.requestChange(e.target.checked);
}

/**
 * Provide a linked `value` attribute for controlled forms. You should not use
 * this outside of the ReactDOM controlled form components.
 */
var LinkedValueUtils = {
  Mixin: {
    propTypes: {
      value: function(props, propName, componentName) {
        if (!props[propName] ||
            hasReadOnlyValue[props.type] ||
            props.onChange ||
            props.readOnly ||
            props.disabled) {
          return null;
        }
        return new Error(
          'You provided a `value` prop to a form field without an ' +
          '`onChange` handler. This will render a read-only field. If ' +
          'the field should be mutable use `defaultValue`. Otherwise, ' +
          'set either `onChange` or `readOnly`.'
        );
      },
      checked: function(props, propName, componentName) {
        if (!props[propName] ||
            props.onChange ||
            props.readOnly ||
            props.disabled) {
          return null;
        }
        return new Error(
          'You provided a `checked` prop to a form field without an ' +
          '`onChange` handler. This will render a read-only field. If ' +
          'the field should be mutable use `defaultChecked`. Otherwise, ' +
          'set either `onChange` or `readOnly`.'
        );
      },
      onChange: ReactPropTypes.func
    }
  },

  /**
   * @param {ReactComponent} input Form component
   * @return {*} current value of the input either from value prop or link.
   */
  getValue: function(input) {
    if (input.props.valueLink) {
      _assertValueLink(input);
      return input.props.valueLink.value;
    }
    return input.props.value;
  },

  /**
   * @param {ReactComponent} input Form component
   * @return {*} current checked status of the input either from checked prop
   *             or link.
   */
  getChecked: function(input) {
    if (input.props.checkedLink) {
      _assertCheckedLink(input);
      return input.props.checkedLink.value;
    }
    return input.props.checked;
  },

  /**
   * @param {ReactComponent} input Form component
   * @return {function} change callback either from onChange prop or link.
   */
  getOnChange: function(input) {
    if (input.props.valueLink) {
      _assertValueLink(input);
      return _handleLinkedValueChange;
    } else if (input.props.checkedLink) {
      _assertCheckedLink(input);
      return _handleLinkedCheckChange;
    }
    return input.props.onChange;
  }
};

module.exports = LinkedValueUtils;

}).call(this,require('_process'))
},{"./ReactPropTypes":85,"./invariant":142,"_process":6}],31:[function(require,module,exports){
(function (process){
/**
 * Copyright 2014-2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule LocalEventTrapMixin
 */

'use strict';

var ReactBrowserEventEmitter = require("./ReactBrowserEventEmitter");

var accumulateInto = require("./accumulateInto");
var forEachAccumulated = require("./forEachAccumulated");
var invariant = require("./invariant");

function remove(event) {
  event.remove();
}

var LocalEventTrapMixin = {
  trapBubbledEvent:function(topLevelType, handlerBaseName) {
    ("production" !== process.env.NODE_ENV ? invariant(this.isMounted(), 'Must be mounted to trap events') : invariant(this.isMounted()));
    // If a component renders to null or if another component fatals and causes
    // the state of the tree to be corrupted, `node` here can be null.
    var node = this.getDOMNode();
    ("production" !== process.env.NODE_ENV ? invariant(
      node,
      'LocalEventTrapMixin.trapBubbledEvent(...): Requires node to be rendered.'
    ) : invariant(node));
    var listener = ReactBrowserEventEmitter.trapBubbledEvent(
      topLevelType,
      handlerBaseName,
      node
    );
    this._localEventListeners =
      accumulateInto(this._localEventListeners, listener);
  },

  // trapCapturedEvent would look nearly identical. We don't implement that
  // method because it isn't currently needed.

  componentWillUnmount:function() {
    if (this._localEventListeners) {
      forEachAccumulated(this._localEventListeners, remove);
    }
  }
};

module.exports = LocalEventTrapMixin;

}).call(this,require('_process'))
},{"./ReactBrowserEventEmitter":37,"./accumulateInto":112,"./forEachAccumulated":127,"./invariant":142,"_process":6}],32:[function(require,module,exports){
/**
 * Copyright 2013-2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule MobileSafariClickEventPlugin
 * @typechecks static-only
 */

'use strict';

var EventConstants = require("./EventConstants");

var emptyFunction = require("./emptyFunction");

var topLevelTypes = EventConstants.topLevelTypes;

/**
 * Mobile Safari does not fire properly bubble click events on non-interactive
 * elements, which means delegated click listeners do not fire. The workaround
 * for this bug involves attaching an empty click listener on the target node.
 *
 * This particular plugin works around the bug by attaching an empty click
 * listener on `touchstart` (which does fire on every element).
 */
var MobileSafariClickEventPlugin = {

  eventTypes: null,

  /**
   * @param {string} topLevelType Record from `EventConstants`.
   * @param {DOMEventTarget} topLevelTarget The listening component root node.
   * @param {string} topLevelTargetID ID of `topLevelTarget`.
   * @param {object} nativeEvent Native browser event.
   * @return {*} An accumulation of synthetic events.
   * @see {EventPluginHub.extractEvents}
   */
  extractEvents: function(
      topLevelType,
      topLevelTarget,
      topLevelTargetID,
      nativeEvent) {
    if (topLevelType === topLevelTypes.topTouchStart) {
      var target = nativeEvent.target;
      if (target && !target.onclick) {
        target.onclick = emptyFunction;
      }
    }
  }

};

module.exports = MobileSafariClickEventPlugin;

},{"./EventConstants":21,"./emptyFunction":121}],33:[function(require,module,exports){
/**
 * Copyright 2014-2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule Object.assign
 */

// https://people.mozilla.org/~jorendorff/es6-draft.html#sec-object.assign

'use strict';

function assign(target, sources) {
  if (target == null) {
    throw new TypeError('Object.assign target cannot be null or undefined');
  }

  var to = Object(target);
  var hasOwnProperty = Object.prototype.hasOwnProperty;

  for (var nextIndex = 1; nextIndex < arguments.length; nextIndex++) {
    var nextSource = arguments[nextIndex];
    if (nextSource == null) {
      continue;
    }

    var from = Object(nextSource);

    // We don't currently support accessors nor proxies. Therefore this
    // copy cannot throw. If we ever supported this then we must handle
    // exceptions and side-effects. We don't support symbols so they won't
    // be transferred.

    for (var key in from) {
      if (hasOwnProperty.call(from, key)) {
        to[key] = from[key];
      }
    }
  }

  return to;
}

module.exports = assign;

},{}],34:[function(require,module,exports){
(function (process){
/**
 * Copyright 2013-2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule PooledClass
 */

'use strict';

var invariant = require("./invariant");

/**
 * Static poolers. Several custom versions for each potential number of
 * arguments. A completely generic pooler is easy to implement, but would
 * require accessing the `arguments` object. In each of these, `this` refers to
 * the Class itself, not an instance. If any others are needed, simply add them
 * here, or in their own files.
 */
var oneArgumentPooler = function(copyFieldsFrom) {
  var Klass = this;
  if (Klass.instancePool.length) {
    var instance = Klass.instancePool.pop();
    Klass.call(instance, copyFieldsFrom);
    return instance;
  } else {
    return new Klass(copyFieldsFrom);
  }
};

var twoArgumentPooler = function(a1, a2) {
  var Klass = this;
  if (Klass.instancePool.length) {
    var instance = Klass.instancePool.pop();
    Klass.call(instance, a1, a2);
    return instance;
  } else {
    return new Klass(a1, a2);
  }
};

var threeArgumentPooler = function(a1, a2, a3) {
  var Klass = this;
  if (Klass.instancePool.length) {
    var instance = Klass.instancePool.pop();
    Klass.call(instance, a1, a2, a3);
    return instance;
  } else {
    return new Klass(a1, a2, a3);
  }
};

var fiveArgumentPooler = function(a1, a2, a3, a4, a5) {
  var Klass = this;
  if (Klass.instancePool.length) {
    var instance = Klass.instancePool.pop();
    Klass.call(instance, a1, a2, a3, a4, a5);
    return instance;
  } else {
    return new Klass(a1, a2, a3, a4, a5);
  }
};

var standardReleaser = function(instance) {
  var Klass = this;
  ("production" !== process.env.NODE_ENV ? invariant(
    instance instanceof Klass,
    'Trying to release an instance into a pool of a different type.'
  ) : invariant(instance instanceof Klass));
  if (instance.destructor) {
    instance.destructor();
  }
  if (Klass.instancePool.length < Klass.poolSize) {
    Klass.instancePool.push(instance);
  }
};

var DEFAULT_POOL_SIZE = 10;
var DEFAULT_POOLER = oneArgumentPooler;

/**
 * Augments `CopyConstructor` to be a poolable class, augmenting only the class
 * itself (statically) not adding any prototypical fields. Any CopyConstructor
 * you give this may have a `poolSize` property, and will look for a
 * prototypical `destructor` on instances (optional).
 *
 * @param {Function} CopyConstructor Constructor that can be used to reset.
 * @param {Function} pooler Customizable pooler.
 */
var addPoolingTo = function(CopyConstructor, pooler) {
  var NewKlass = CopyConstructor;
  NewKlass.instancePool = [];
  NewKlass.getPooled = pooler || DEFAULT_POOLER;
  if (!NewKlass.poolSize) {
    NewKlass.poolSize = DEFAULT_POOL_SIZE;
  }
  NewKlass.release = standardReleaser;
  return NewKlass;
};

var PooledClass = {
  addPoolingTo: addPoolingTo,
  oneArgumentPooler: oneArgumentPooler,
  twoArgumentPooler: twoArgumentPooler,
  threeArgumentPooler: threeArgumentPooler,
  fiveArgumentPooler: fiveArgumentPooler
};

module.exports = PooledClass;

}).call(this,require('_process'))
},{"./invariant":142,"_process":6}],35:[function(require,module,exports){
(function (process){
/**
 * Copyright 2013-2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule React
 */

/* globals __REACT_DEVTOOLS_GLOBAL_HOOK__*/

'use strict';

var EventPluginUtils = require("./EventPluginUtils");
var ReactChildren = require("./ReactChildren");
var ReactComponent = require("./ReactComponent");
var ReactClass = require("./ReactClass");
var ReactContext = require("./ReactContext");
var ReactCurrentOwner = require("./ReactCurrentOwner");
var ReactElement = require("./ReactElement");
var ReactElementValidator = require("./ReactElementValidator");
var ReactDOM = require("./ReactDOM");
var ReactDOMTextComponent = require("./ReactDOMTextComponent");
var ReactDefaultInjection = require("./ReactDefaultInjection");
var ReactInstanceHandles = require("./ReactInstanceHandles");
var ReactMount = require("./ReactMount");
var ReactPerf = require("./ReactPerf");
var ReactPropTypes = require("./ReactPropTypes");
var ReactReconciler = require("./ReactReconciler");
var ReactServerRendering = require("./ReactServerRendering");

var assign = require("./Object.assign");
var findDOMNode = require("./findDOMNode");
var onlyChild = require("./onlyChild");

ReactDefaultInjection.inject();

var createElement = ReactElement.createElement;
var createFactory = ReactElement.createFactory;
var cloneElement = ReactElement.cloneElement;

if ("production" !== process.env.NODE_ENV) {
  createElement = ReactElementValidator.createElement;
  createFactory = ReactElementValidator.createFactory;
  cloneElement = ReactElementValidator.cloneElement;
}

var render = ReactPerf.measure('React', 'render', ReactMount.render);

var React = {
  Children: {
    map: ReactChildren.map,
    forEach: ReactChildren.forEach,
    count: ReactChildren.count,
    only: onlyChild
  },
  Component: ReactComponent,
  DOM: ReactDOM,
  PropTypes: ReactPropTypes,
  initializeTouchEvents: function(shouldUseTouch) {
    EventPluginUtils.useTouchEvents = shouldUseTouch;
  },
  createClass: ReactClass.createClass,
  createElement: createElement,
  cloneElement: cloneElement,
  createFactory: createFactory,
  createMixin: function(mixin) {
    // Currently a noop. Will be used to validate and trace mixins.
    return mixin;
  },
  constructAndRenderComponent: ReactMount.constructAndRenderComponent,
  constructAndRenderComponentByID: ReactMount.constructAndRenderComponentByID,
  findDOMNode: findDOMNode,
  render: render,
  renderToString: ReactServerRendering.renderToString,
  renderToStaticMarkup: ReactServerRendering.renderToStaticMarkup,
  unmountComponentAtNode: ReactMount.unmountComponentAtNode,
  isValidElement: ReactElement.isValidElement,
  withContext: ReactContext.withContext,

  // Hook for JSX spread, don't use this for anything else.
  __spread: assign
};

// Inject the runtime into a devtools global hook regardless of browser.
// Allows for debugging when the hook is injected on the page.
if (
  typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ !== 'undefined' &&
  typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.inject === 'function') {
  __REACT_DEVTOOLS_GLOBAL_HOOK__.inject({
    CurrentOwner: ReactCurrentOwner,
    InstanceHandles: ReactInstanceHandles,
    Mount: ReactMount,
    Reconciler: ReactReconciler,
    TextComponent: ReactDOMTextComponent
  });
}

if ("production" !== process.env.NODE_ENV) {
  var ExecutionEnvironment = require("./ExecutionEnvironment");
  if (ExecutionEnvironment.canUseDOM && window.top === window.self) {

    // If we're in Chrome, look for the devtools marker and provide a download
    // link if not installed.
    if (navigator.userAgent.indexOf('Chrome') > -1) {
      if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ === 'undefined') {
        console.debug(
          'Download the React DevTools for a better development experience: ' +
          'https://fb.me/react-devtools'
        );
      }
    }

    var expectedFeatures = [
      // shims
      Array.isArray,
      Array.prototype.every,
      Array.prototype.forEach,
      Array.prototype.indexOf,
      Array.prototype.map,
      Date.now,
      Function.prototype.bind,
      Object.keys,
      String.prototype.split,
      String.prototype.trim,

      // shams
      Object.create,
      Object.freeze
    ];

    for (var i = 0; i < expectedFeatures.length; i++) {
      if (!expectedFeatures[i]) {
        console.error(
          'One or more ES5 shim/shams expected by React are not available: ' +
          'https://fb.me/react-warning-polyfills'
        );
        break;
      }
    }
  }
}

React.version = '0.13.3';

module.exports = React;

}).call(this,require('_process'))
},{"./EventPluginUtils":25,"./ExecutionEnvironment":27,"./Object.assign":33,"./ReactChildren":39,"./ReactClass":40,"./ReactComponent":41,"./ReactContext":45,"./ReactCurrentOwner":46,"./ReactDOM":47,"./ReactDOMTextComponent":58,"./ReactDefaultInjection":61,"./ReactElement":64,"./ReactElementValidator":65,"./ReactInstanceHandles":73,"./ReactMount":77,"./ReactPerf":82,"./ReactPropTypes":85,"./ReactReconciler":88,"./ReactServerRendering":91,"./findDOMNode":124,"./onlyChild":151,"_process":6}],36:[function(require,module,exports){
/**
 * Copyright 2013-2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule ReactBrowserComponentMixin
 */

'use strict';

var findDOMNode = require("./findDOMNode");

var ReactBrowserComponentMixin = {
  /**
   * Returns the DOM node rendered by this component.
   *
   * @return {DOMElement} The root node of this component.
   * @final
   * @protected
   */
  getDOMNode: function() {
    return findDOMNode(this);
  }
};

module.exports = ReactBrowserComponentMixin;

},{"./findDOMNode":124}],37:[function(require,module,exports){
/**
 * Copyright 2013-2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule ReactBrowserEventEmitter
 * @typechecks static-only
 */

'use strict';

var EventConstants = require("./EventConstants");
var EventPluginHub = require("./EventPluginHub");
var EventPluginRegistry = require("./EventPluginRegistry");
var ReactEventEmitterMixin = require("./ReactEventEmitterMixin");
var ViewportMetrics = require("./ViewportMetrics");

var assign = require("./Object.assign");
var isEventSupported = require("./isEventSupported");

/**
 * Summary of `ReactBrowserEventEmitter` event handling:
 *
 *  - Top-level delegation is used to trap most native browser events. This
 *    may only occur in the main thread and is the responsibility of
 *    ReactEventListener, which is injected and can therefore support pluggable
 *    event sources. This is the only work that occurs in the main thread.
 *
 *  - We normalize and de-duplicate events to account for browser quirks. This
 *    may be done in the worker thread.
 *
 *  - Forward these native events (with the associated top-level type used to
 *    trap it) to `EventPluginHub`, which in turn will ask plugins if they want
 *    to extract any synthetic events.
 *
 *  - The `EventPluginHub` will then process each event by annotating them with
 *    "dispatches", a sequence of listeners and IDs that care about that event.
 *
 *  - The `EventPluginHub` then dispatches the events.
 *
 * Overview of React and the event system:
 *
 * +------------+    .
 * |    DOM     |    .
 * +------------+    .
 *       |           .
 *       v           .
 * +------------+    .
 * | ReactEvent |    .
 * |  Listener  |    .
 * +------------+    .                         +-----------+
 *       |           .               +--------+|SimpleEvent|
 *       |           .               |         |Plugin     |
 * +-----|------+    .               v         +-----------+
 * |     |      |    .    +--------------+                    +------------+
 * |     +-----------.--->|EventPluginHub|                    |    Event   |
 * |            |    .    |              |     +-----------+  | Propagators|
 * | ReactEvent |    .    |              |     |TapEvent   |  |------------|
 * |  Emitter   |    .    |              |<---+|Plugin     |  |other plugin|
 * |            |    .    |              |     +-----------+  |  utilities |
 * |     +-----------.--->|              |                    +------------+
 * |     |      |    .    +--------------+
 * +-----|------+    .                ^        +-----------+
 *       |           .                |        |Enter/Leave|
 *       +           .                +-------+|Plugin     |
 * +-------------+   .                         +-----------+
 * | application |   .
 * |-------------|   .
 * |             |   .
 * |             |   .
 * +-------------+   .
 *                   .
 *    React Core     .  General Purpose Event Plugin System
 */

var alreadyListeningTo = {};
var isMonitoringScrollValue = false;
var reactTopListenersCounter = 0;

// For events like 'submit' which don't consistently bubble (which we trap at a
// lower node than `document`), binding at `document` would cause duplicate
// events so we don't include them here
var topEventMapping = {
  topBlur: 'blur',
  topChange: 'change',
  topClick: 'click',
  topCompositionEnd: 'compositionend',
  topCompositionStart: 'compositionstart',
  topCompositionUpdate: 'compositionupdate',
  topContextMenu: 'contextmenu',
  topCopy: 'copy',
  topCut: 'cut',
  topDoubleClick: 'dblclick',
  topDrag: 'drag',
  topDragEnd: 'dragend',
  topDragEnter: 'dragenter',
  topDragExit: 'dragexit',
  topDragLeave: 'dragleave',
  topDragOver: 'dragover',
  topDragStart: 'dragstart',
  topDrop: 'drop',
  topFocus: 'focus',
  topInput: 'input',
  topKeyDown: 'keydown',
  topKeyPress: 'keypress',
  topKeyUp: 'keyup',
  topMouseDown: 'mousedown',
  topMouseMove: 'mousemove',
  topMouseOut: 'mouseout',
  topMouseOver: 'mouseover',
  topMouseUp: 'mouseup',
  topPaste: 'paste',
  topScroll: 'scroll',
  topSelectionChange: 'selectionchange',
  topTextInput: 'textInput',
  topTouchCancel: 'touchcancel',
  topTouchEnd: 'touchend',
  topTouchMove: 'touchmove',
  topTouchStart: 'touchstart',
  topWheel: 'wheel'
};

/**
 * To ensure no conflicts with other potential React instances on the page
 */
var topListenersIDKey = '_reactListenersID' + String(Math.random()).slice(2);

function getListeningForDocument(mountAt) {
  // In IE8, `mountAt` is a host object and doesn't have `hasOwnProperty`
  // directly.
  if (!Object.prototype.hasOwnProperty.call(mountAt, topListenersIDKey)) {
    mountAt[topListenersIDKey] = reactTopListenersCounter++;
    alreadyListeningTo[mountAt[topListenersIDKey]] = {};
  }
  return alreadyListeningTo[mountAt[topListenersIDKey]];
}

/**
 * `ReactBrowserEventEmitter` is used to attach top-level event listeners. For
 * example:
 *
 *   ReactBrowserEventEmitter.putListener('myID', 'onClick', myFunction);
 *
 * This would allocate a "registration" of `('onClick', myFunction)` on 'myID'.
 *
 * @internal
 */
var ReactBrowserEventEmitter = assign({}, ReactEventEmitterMixin, {

  /**
   * Injectable event backend
   */
  ReactEventListener: null,

  injection: {
    /**
     * @param {object} ReactEventListener
     */
    injectReactEventListener: function(ReactEventListener) {
      ReactEventListener.setHandleTopLevel(
        ReactBrowserEventEmitter.handleTopLevel
      );
      ReactBrowserEventEmitter.ReactEventListener = ReactEventListener;
    }
  },

  /**
   * Sets whether or not any created callbacks should be enabled.
   *
   * @param {boolean} enabled True if callbacks should be enabled.
   */
  setEnabled: function(enabled) {
    if (ReactBrowserEventEmitter.ReactEventListener) {
      ReactBrowserEventEmitter.ReactEventListener.setEnabled(enabled);
    }
  },

  /**
   * @return {boolean} True if callbacks are enabled.
   */
  isEnabled: function() {
    return !!(
      (ReactBrowserEventEmitter.ReactEventListener && ReactBrowserEventEmitter.ReactEventListener.isEnabled())
    );
  },

  /**
   * We listen for bubbled touch events on the document object.
   *
   * Firefox v8.01 (and possibly others) exhibited strange behavior when
   * mounting `onmousemove` events at some node that was not the document
   * element. The symptoms were that if your mouse is not moving over something
   * contained within that mount point (for example on the background) the
   * top-level listeners for `onmousemove` won't be called. However, if you
   * register the `mousemove` on the document object, then it will of course
   * catch all `mousemove`s. This along with iOS quirks, justifies restricting
   * top-level listeners to the document object only, at least for these
   * movement types of events and possibly all events.
   *
   * @see http://www.quirksmode.org/blog/archives/2010/09/click_event_del.html
   *
   * Also, `keyup`/`keypress`/`keydown` do not bubble to the window on IE, but
   * they bubble to document.
   *
   * @param {string} registrationName Name of listener (e.g. `onClick`).
   * @param {object} contentDocumentHandle Document which owns the container
   */
  listenTo: function(registrationName, contentDocumentHandle) {
    var mountAt = contentDocumentHandle;
    var isListening = getListeningForDocument(mountAt);
    var dependencies = EventPluginRegistry.
      registrationNameDependencies[registrationName];

    var topLevelTypes = EventConstants.topLevelTypes;
    for (var i = 0, l = dependencies.length; i < l; i++) {
      var dependency = dependencies[i];
      if (!(
            (isListening.hasOwnProperty(dependency) && isListening[dependency])
          )) {
        if (dependency === topLevelTypes.topWheel) {
          if (isEventSupported('wheel')) {
            ReactBrowserEventEmitter.ReactEventListener.trapBubbledEvent(
              topLevelTypes.topWheel,
              'wheel',
              mountAt
            );
          } else if (isEventSupported('mousewheel')) {
            ReactBrowserEventEmitter.ReactEventListener.trapBubbledEvent(
              topLevelTypes.topWheel,
              'mousewheel',
              mountAt
            );
          } else {
            // Firefox needs to capture a different mouse scroll event.
            // @see http://www.quirksmode.org/dom/events/tests/scroll.html
            ReactBrowserEventEmitter.ReactEventListener.trapBubbledEvent(
              topLevelTypes.topWheel,
              'DOMMouseScroll',
              mountAt
            );
          }
        } else if (dependency === topLevelTypes.topScroll) {

          if (isEventSupported('scroll', true)) {
            ReactBrowserEventEmitter.ReactEventListener.trapCapturedEvent(
              topLevelTypes.topScroll,
              'scroll',
              mountAt
            );
          } else {
            ReactBrowserEventEmitter.ReactEventListener.trapBubbledEvent(
              topLevelTypes.topScroll,
              'scroll',
              ReactBrowserEventEmitter.ReactEventListener.WINDOW_HANDLE
            );
          }
        } else if (dependency === topLevelTypes.topFocus ||
            dependency === topLevelTypes.topBlur) {

          if (isEventSupported('focus', true)) {
            ReactBrowserEventEmitter.ReactEventListener.trapCapturedEvent(
              topLevelTypes.topFocus,
              'focus',
              mountAt
            );
            ReactBrowserEventEmitter.ReactEventListener.trapCapturedEvent(
              topLevelTypes.topBlur,
              'blur',
              mountAt
            );
          } else if (isEventSupported('focusin')) {
            // IE has `focusin` and `focusout` events which bubble.
            // @see http://www.quirksmode.org/blog/archives/2008/04/delegating_the.html
            ReactBrowserEventEmitter.ReactEventListener.trapBubbledEvent(
              topLevelTypes.topFocus,
              'focusin',
              mountAt
            );
            ReactBrowserEventEmitter.ReactEventListener.trapBubbledEvent(
              topLevelTypes.topBlur,
              'focusout',
              mountAt
            );
          }

          // to make sure blur and focus event listeners are only attached once
          isListening[topLevelTypes.topBlur] = true;
          isListening[topLevelTypes.topFocus] = true;
        } else if (topEventMapping.hasOwnProperty(dependency)) {
          ReactBrowserEventEmitter.ReactEventListener.trapBubbledEvent(
            dependency,
            topEventMapping[dependency],
            mountAt
          );
        }

        isListening[dependency] = true;
      }
    }
  },

  trapBubbledEvent: function(topLevelType, handlerBaseName, handle) {
    return ReactBrowserEventEmitter.ReactEventListener.trapBubbledEvent(
      topLevelType,
      handlerBaseName,
      handle
    );
  },

  trapCapturedEvent: function(topLevelType, handlerBaseName, handle) {
    return ReactBrowserEventEmitter.ReactEventListener.trapCapturedEvent(
      topLevelType,
      handlerBaseName,
      handle
    );
  },

  /**
   * Listens to window scroll and resize events. We cache scroll values so that
   * application code can access them without triggering reflows.
   *
   * NOTE: Scroll events do not bubble.
   *
   * @see http://www.quirksmode.org/dom/events/scroll.html
   */
  ensureScrollValueMonitoring: function() {
    if (!isMonitoringScrollValue) {
      var refresh = ViewportMetrics.refreshScrollValues;
      ReactBrowserEventEmitter.ReactEventListener.monitorScrollValue(refresh);
      isMonitoringScrollValue = true;
    }
  },

  eventNameDispatchConfigs: EventPluginHub.eventNameDispatchConfigs,

  registrationNameModules: EventPluginHub.registrationNameModules,

  putListener: EventPluginHub.putListener,

  getListener: EventPluginHub.getListener,

  deleteListener: EventPluginHub.deleteListener,

  deleteAllListeners: EventPluginHub.deleteAllListeners

});

module.exports = ReactBrowserEventEmitter;

},{"./EventConstants":21,"./EventPluginHub":23,"./EventPluginRegistry":24,"./Object.assign":33,"./ReactEventEmitterMixin":68,"./ViewportMetrics":111,"./isEventSupported":143}],38:[function(require,module,exports){
/**
 * Copyright 2014-2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule ReactChildReconciler
 * @typechecks static-only
 */

'use strict';

var ReactReconciler = require("./ReactReconciler");

var flattenChildren = require("./flattenChildren");
var instantiateReactComponent = require("./instantiateReactComponent");
var shouldUpdateReactComponent = require("./shouldUpdateReactComponent");

/**
 * ReactChildReconciler provides helpers for initializing or updating a set of
 * children. Its output is suitable for passing it onto ReactMultiChild which
 * does diffed reordering and insertion.
 */
var ReactChildReconciler = {

  /**
   * Generates a "mount image" for each of the supplied children. In the case
   * of `ReactDOMComponent`, a mount image is a string of markup.
   *
   * @param {?object} nestedChildNodes Nested child maps.
   * @return {?object} A set of child instances.
   * @internal
   */
  instantiateChildren: function(nestedChildNodes, transaction, context) {
    var children = flattenChildren(nestedChildNodes);
    for (var name in children) {
      if (children.hasOwnProperty(name)) {
        var child = children[name];
        // The rendered children must be turned into instances as they're
        // mounted.
        var childInstance = instantiateReactComponent(child, null);
        children[name] = childInstance;
      }
    }
    return children;
  },

  /**
   * Updates the rendered children and returns a new set of children.
   *
   * @param {?object} prevChildren Previously initialized set of children.
   * @param {?object} nextNestedChildNodes Nested child maps.
   * @param {ReactReconcileTransaction} transaction
   * @param {object} context
   * @return {?object} A new set of child instances.
   * @internal
   */
  updateChildren: function(
    prevChildren,
    nextNestedChildNodes,
    transaction,
    context) {
    // We currently don't have a way to track moves here but if we use iterators
    // instead of for..in we can zip the iterators and check if an item has
    // moved.
    // TODO: If nothing has changed, return the prevChildren object so that we
    // can quickly bailout if nothing has changed.
    var nextChildren = flattenChildren(nextNestedChildNodes);
    if (!nextChildren && !prevChildren) {
      return null;
    }
    var name;
    for (name in nextChildren) {
      if (!nextChildren.hasOwnProperty(name)) {
        continue;
      }
      var prevChild = prevChildren && prevChildren[name];
      var prevElement = prevChild && prevChild._currentElement;
      var nextElement = nextChildren[name];
      if (shouldUpdateReactComponent(prevElement, nextElement)) {
        ReactReconciler.receiveComponent(
          prevChild, nextElement, transaction, context
        );
        nextChildren[name] = prevChild;
      } else {
        if (prevChild) {
          ReactReconciler.unmountComponent(prevChild, name);
        }
        // The child must be instantiated before it's mounted.
        var nextChildInstance = instantiateReactComponent(
          nextElement,
          null
        );
        nextChildren[name] = nextChildInstance;
      }
    }
    // Unmount children that are no longer present.
    for (name in prevChildren) {
      if (prevChildren.hasOwnProperty(name) &&
          !(nextChildren && nextChildren.hasOwnProperty(name))) {
        ReactReconciler.unmountComponent(prevChildren[name]);
      }
    }
    return nextChildren;
  },

  /**
   * Unmounts all rendered children. This should be used to clean up children
   * when this component is unmounted.
   *
   * @param {?object} renderedChildren Previously initialized set of children.
   * @internal
   */
  unmountChildren: function(renderedChildren) {
    for (var name in renderedChildren) {
      var renderedChild = renderedChildren[name];
      ReactReconciler.unmountComponent(renderedChild);
    }
  }

};

module.exports = ReactChildReconciler;

},{"./ReactReconciler":88,"./flattenChildren":125,"./instantiateReactComponent":141,"./shouldUpdateReactComponent":158}],39:[function(require,module,exports){
(function (process){
/**
 * Copyright 2013-2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule ReactChildren
 */

'use strict';

var PooledClass = require("./PooledClass");
var ReactFragment = require("./ReactFragment");

var traverseAllChildren = require("./traverseAllChildren");
var warning = require("./warning");

var twoArgumentPooler = PooledClass.twoArgumentPooler;
var threeArgumentPooler = PooledClass.threeArgumentPooler;

/**
 * PooledClass representing the bookkeeping associated with performing a child
 * traversal. Allows avoiding binding callbacks.
 *
 * @constructor ForEachBookKeeping
 * @param {!function} forEachFunction Function to perform traversal with.
 * @param {?*} forEachContext Context to perform context with.
 */
function ForEachBookKeeping(forEachFunction, forEachContext) {
  this.forEachFunction = forEachFunction;
  this.forEachContext = forEachContext;
}
PooledClass.addPoolingTo(ForEachBookKeeping, twoArgumentPooler);

function forEachSingleChild(traverseContext, child, name, i) {
  var forEachBookKeeping = traverseContext;
  forEachBookKeeping.forEachFunction.call(
    forEachBookKeeping.forEachContext, child, i);
}

/**
 * Iterates through children that are typically specified as `props.children`.
 *
 * The provided forEachFunc(child, index) will be called for each
 * leaf child.
 *
 * @param {?*} children Children tree container.
 * @param {function(*, int)} forEachFunc.
 * @param {*} forEachContext Context for forEachContext.
 */
function forEachChildren(children, forEachFunc, forEachContext) {
  if (children == null) {
    return children;
  }

  var traverseContext =
    ForEachBookKeeping.getPooled(forEachFunc, forEachContext);
  traverseAllChildren(children, forEachSingleChild, traverseContext);
  ForEachBookKeeping.release(traverseContext);
}

/**
 * PooledClass representing the bookkeeping associated with performing a child
 * mapping. Allows avoiding binding callbacks.
 *
 * @constructor MapBookKeeping
 * @param {!*} mapResult Object containing the ordered map of results.
 * @param {!function} mapFunction Function to perform mapping with.
 * @param {?*} mapContext Context to perform mapping with.
 */
function MapBookKeeping(mapResult, mapFunction, mapContext) {
  this.mapResult = mapResult;
  this.mapFunction = mapFunction;
  this.mapContext = mapContext;
}
PooledClass.addPoolingTo(MapBookKeeping, threeArgumentPooler);

function mapSingleChildIntoContext(traverseContext, child, name, i) {
  var mapBookKeeping = traverseContext;
  var mapResult = mapBookKeeping.mapResult;

  var keyUnique = !mapResult.hasOwnProperty(name);
  if ("production" !== process.env.NODE_ENV) {
    ("production" !== process.env.NODE_ENV ? warning(
      keyUnique,
      'ReactChildren.map(...): Encountered two children with the same key, ' +
      '`%s`. Child keys must be unique; when two children share a key, only ' +
      'the first child will be used.',
      name
    ) : null);
  }

  if (keyUnique) {
    var mappedChild =
      mapBookKeeping.mapFunction.call(mapBookKeeping.mapContext, child, i);
    mapResult[name] = mappedChild;
  }
}

/**
 * Maps children that are typically specified as `props.children`.
 *
 * The provided mapFunction(child, key, index) will be called for each
 * leaf child.
 *
 * TODO: This may likely break any calls to `ReactChildren.map` that were
 * previously relying on the fact that we guarded against null children.
 *
 * @param {?*} children Children tree container.
 * @param {function(*, int)} mapFunction.
 * @param {*} mapContext Context for mapFunction.
 * @return {object} Object containing the ordered map of results.
 */
function mapChildren(children, func, context) {
  if (children == null) {
    return children;
  }

  var mapResult = {};
  var traverseContext = MapBookKeeping.getPooled(mapResult, func, context);
  traverseAllChildren(children, mapSingleChildIntoContext, traverseContext);
  MapBookKeeping.release(traverseContext);
  return ReactFragment.create(mapResult);
}

function forEachSingleChildDummy(traverseContext, child, name, i) {
  return null;
}

/**
 * Count the number of children that are typically specified as
 * `props.children`.
 *
 * @param {?*} children Children tree container.
 * @return {number} The number of children.
 */
function countChildren(children, context) {
  return traverseAllChildren(children, forEachSingleChildDummy, null);
}

var ReactChildren = {
  forEach: forEachChildren,
  map: mapChildren,
  count: countChildren
};

module.exports = ReactChildren;

}).call(this,require('_process'))
},{"./PooledClass":34,"./ReactFragment":70,"./traverseAllChildren":160,"./warning":161,"_process":6}],40:[function(require,module,exports){
(function (process){
/**
 * Copyright 2013-2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule ReactClass
 */

'use strict';

var ReactComponent = require("./ReactComponent");
var ReactCurrentOwner = require("./ReactCurrentOwner");
var ReactElement = require("./ReactElement");
var ReactErrorUtils = require("./ReactErrorUtils");
var ReactInstanceMap = require("./ReactInstanceMap");
var ReactLifeCycle = require("./ReactLifeCycle");
var ReactPropTypeLocations = require("./ReactPropTypeLocations");
var ReactPropTypeLocationNames = require("./ReactPropTypeLocationNames");
var ReactUpdateQueue = require("./ReactUpdateQueue");

var assign = require("./Object.assign");
var invariant = require("./invariant");
var keyMirror = require("./keyMirror");
var keyOf = require("./keyOf");
var warning = require("./warning");

var MIXINS_KEY = keyOf({mixins: null});

/**
 * Policies that describe methods in `ReactClassInterface`.
 */
var SpecPolicy = keyMirror({
  /**
   * These methods may be defined only once by the class specification or mixin.
   */
  DEFINE_ONCE: null,
  /**
   * These methods may be defined by both the class specification and mixins.
   * Subsequent definitions will be chained. These methods must return void.
   */
  DEFINE_MANY: null,
  /**
   * These methods are overriding the base class.
   */
  OVERRIDE_BASE: null,
  /**
   * These methods are similar to DEFINE_MANY, except we assume they return
   * objects. We try to merge the keys of the return values of all the mixed in
   * functions. If there is a key conflict we throw.
   */
  DEFINE_MANY_MERGED: null
});


var injectedMixins = [];

/**
 * Composite components are higher-level components that compose other composite
 * or native components.
 *
 * To create a new type of `ReactClass`, pass a specification of
 * your new class to `React.createClass`. The only requirement of your class
 * specification is that you implement a `render` method.
 *
 *   var MyComponent = React.createClass({
 *     render: function() {
 *       return <div>Hello World</div>;
 *     }
 *   });
 *
 * The class specification supports a specific protocol of methods that have
 * special meaning (e.g. `render`). See `ReactClassInterface` for
 * more the comprehensive protocol. Any other properties and methods in the
 * class specification will available on the prototype.
 *
 * @interface ReactClassInterface
 * @internal
 */
var ReactClassInterface = {

  /**
   * An array of Mixin objects to include when defining your component.
   *
   * @type {array}
   * @optional
   */
  mixins: SpecPolicy.DEFINE_MANY,

  /**
   * An object containing properties and methods that should be defined on
   * the component's constructor instead of its prototype (static methods).
   *
   * @type {object}
   * @optional
   */
  statics: SpecPolicy.DEFINE_MANY,

  /**
   * Definition of prop types for this component.
   *
   * @type {object}
   * @optional
   */
  propTypes: SpecPolicy.DEFINE_MANY,

  /**
   * Definition of context types for this component.
   *
   * @type {object}
   * @optional
   */
  contextTypes: SpecPolicy.DEFINE_MANY,

  /**
   * Definition of context types this component sets for its children.
   *
   * @type {object}
   * @optional
   */
  childContextTypes: SpecPolicy.DEFINE_MANY,

  // ==== Definition methods ====

  /**
   * Invoked when the component is mounted. Values in the mapping will be set on
   * `this.props` if that prop is not specified (i.e. using an `in` check).
   *
   * This method is invoked before `getInitialState` and therefore cannot rely
   * on `this.state` or use `this.setState`.
   *
   * @return {object}
   * @optional
   */
  getDefaultProps: SpecPolicy.DEFINE_MANY_MERGED,

  /**
   * Invoked once before the component is mounted. The return value will be used
   * as the initial value of `this.state`.
   *
   *   getInitialState: function() {
   *     return {
   *       isOn: false,
   *       fooBaz: new BazFoo()
   *     }
   *   }
   *
   * @return {object}
   * @optional
   */
  getInitialState: SpecPolicy.DEFINE_MANY_MERGED,

  /**
   * @return {object}
   * @optional
   */
  getChildContext: SpecPolicy.DEFINE_MANY_MERGED,

  /**
   * Uses props from `this.props` and state from `this.state` to render the
   * structure of the component.
   *
   * No guarantees are made about when or how often this method is invoked, so
   * it must not have side effects.
   *
   *   render: function() {
   *     var name = this.props.name;
   *     return <div>Hello, {name}!</div>;
   *   }
   *
   * @return {ReactComponent}
   * @nosideeffects
   * @required
   */
  render: SpecPolicy.DEFINE_ONCE,



  // ==== Delegate methods ====

  /**
   * Invoked when the component is initially created and about to be mounted.
   * This may have side effects, but any external subscriptions or data created
   * by this method must be cleaned up in `componentWillUnmount`.
   *
   * @optional
   */
  componentWillMount: SpecPolicy.DEFINE_MANY,

  /**
   * Invoked when the component has been mounted and has a DOM representation.
   * However, there is no guarantee that the DOM node is in the document.
   *
   * Use this as an opportunity to operate on the DOM when the component has
   * been mounted (initialized and rendered) for the first time.
   *
   * @param {DOMElement} rootNode DOM element representing the component.
   * @optional
   */
  componentDidMount: SpecPolicy.DEFINE_MANY,

  /**
   * Invoked before the component receives new props.
   *
   * Use this as an opportunity to react to a prop transition by updating the
   * state using `this.setState`. Current props are accessed via `this.props`.
   *
   *   componentWillReceiveProps: function(nextProps, nextContext) {
   *     this.setState({
   *       likesIncreasing: nextProps.likeCount > this.props.likeCount
   *     });
   *   }
   *
   * NOTE: There is no equivalent `componentWillReceiveState`. An incoming prop
   * transition may cause a state change, but the opposite is not true. If you
   * need it, you are probably looking for `componentWillUpdate`.
   *
   * @param {object} nextProps
   * @optional
   */
  componentWillReceiveProps: SpecPolicy.DEFINE_MANY,

  /**
   * Invoked while deciding if the component should be updated as a result of
   * receiving new props, state and/or context.
   *
   * Use this as an opportunity to `return false` when you're certain that the
   * transition to the new props/state/context will not require a component
   * update.
   *
   *   shouldComponentUpdate: function(nextProps, nextState, nextContext) {
   *     return !equal(nextProps, this.props) ||
   *       !equal(nextState, this.state) ||
   *       !equal(nextContext, this.context);
   *   }
   *
   * @param {object} nextProps
   * @param {?object} nextState
   * @param {?object} nextContext
   * @return {boolean} True if the component should update.
   * @optional
   */
  shouldComponentUpdate: SpecPolicy.DEFINE_ONCE,

  /**
   * Invoked when the component is about to update due to a transition from
   * `this.props`, `this.state` and `this.context` to `nextProps`, `nextState`
   * and `nextContext`.
   *
   * Use this as an opportunity to perform preparation before an update occurs.
   *
   * NOTE: You **cannot** use `this.setState()` in this method.
   *
   * @param {object} nextProps
   * @param {?object} nextState
   * @param {?object} nextContext
   * @param {ReactReconcileTransaction} transaction
   * @optional
   */
  componentWillUpdate: SpecPolicy.DEFINE_MANY,

  /**
   * Invoked when the component's DOM representation has been updated.
   *
   * Use this as an opportunity to operate on the DOM when the component has
   * been updated.
   *
   * @param {object} prevProps
   * @param {?object} prevState
   * @param {?object} prevContext
   * @param {DOMElement} rootNode DOM element representing the component.
   * @optional
   */
  componentDidUpdate: SpecPolicy.DEFINE_MANY,

  /**
   * Invoked when the component is about to be removed from its parent and have
   * its DOM representation destroyed.
   *
   * Use this as an opportunity to deallocate any external resources.
   *
   * NOTE: There is no `componentDidUnmount` since your component will have been
   * destroyed by that point.
   *
   * @optional
   */
  componentWillUnmount: SpecPolicy.DEFINE_MANY,



  // ==== Advanced methods ====

  /**
   * Updates the component's currently mounted DOM representation.
   *
   * By default, this implements React's rendering and reconciliation algorithm.
   * Sophisticated clients may wish to override this.
   *
   * @param {ReactReconcileTransaction} transaction
   * @internal
   * @overridable
   */
  updateComponent: SpecPolicy.OVERRIDE_BASE

};

/**
 * Mapping from class specification keys to special processing functions.
 *
 * Although these are declared like instance properties in the specification
 * when defining classes using `React.createClass`, they are actually static
 * and are accessible on the constructor instead of the prototype. Despite
 * being static, they must be defined outside of the "statics" key under
 * which all other static methods are defined.
 */
var RESERVED_SPEC_KEYS = {
  displayName: function(Constructor, displayName) {
    Constructor.displayName = displayName;
  },
  mixins: function(Constructor, mixins) {
    if (mixins) {
      for (var i = 0; i < mixins.length; i++) {
        mixSpecIntoComponent(Constructor, mixins[i]);
      }
    }
  },
  childContextTypes: function(Constructor, childContextTypes) {
    if ("production" !== process.env.NODE_ENV) {
      validateTypeDef(
        Constructor,
        childContextTypes,
        ReactPropTypeLocations.childContext
      );
    }
    Constructor.childContextTypes = assign(
      {},
      Constructor.childContextTypes,
      childContextTypes
    );
  },
  contextTypes: function(Constructor, contextTypes) {
    if ("production" !== process.env.NODE_ENV) {
      validateTypeDef(
        Constructor,
        contextTypes,
        ReactPropTypeLocations.context
      );
    }
    Constructor.contextTypes = assign(
      {},
      Constructor.contextTypes,
      contextTypes
    );
  },
  /**
   * Special case getDefaultProps which should move into statics but requires
   * automatic merging.
   */
  getDefaultProps: function(Constructor, getDefaultProps) {
    if (Constructor.getDefaultProps) {
      Constructor.getDefaultProps = createMergedResultFunction(
        Constructor.getDefaultProps,
        getDefaultProps
      );
    } else {
      Constructor.getDefaultProps = getDefaultProps;
    }
  },
  propTypes: function(Constructor, propTypes) {
    if ("production" !== process.env.NODE_ENV) {
      validateTypeDef(
        Constructor,
        propTypes,
        ReactPropTypeLocations.prop
      );
    }
    Constructor.propTypes = assign(
      {},
      Constructor.propTypes,
      propTypes
    );
  },
  statics: function(Constructor, statics) {
    mixStaticSpecIntoComponent(Constructor, statics);
  }
};

function validateTypeDef(Constructor, typeDef, location) {
  for (var propName in typeDef) {
    if (typeDef.hasOwnProperty(propName)) {
      // use a warning instead of an invariant so components
      // don't show up in prod but not in __DEV__
      ("production" !== process.env.NODE_ENV ? warning(
        typeof typeDef[propName] === 'function',
        '%s: %s type `%s` is invalid; it must be a function, usually from ' +
        'React.PropTypes.',
        Constructor.displayName || 'ReactClass',
        ReactPropTypeLocationNames[location],
        propName
      ) : null);
    }
  }
}

function validateMethodOverride(proto, name) {
  var specPolicy = ReactClassInterface.hasOwnProperty(name) ?
    ReactClassInterface[name] :
    null;

  // Disallow overriding of base class methods unless explicitly allowed.
  if (ReactClassMixin.hasOwnProperty(name)) {
    ("production" !== process.env.NODE_ENV ? invariant(
      specPolicy === SpecPolicy.OVERRIDE_BASE,
      'ReactClassInterface: You are attempting to override ' +
      '`%s` from your class specification. Ensure that your method names ' +
      'do not overlap with React methods.',
      name
    ) : invariant(specPolicy === SpecPolicy.OVERRIDE_BASE));
  }

  // Disallow defining methods more than once unless explicitly allowed.
  if (proto.hasOwnProperty(name)) {
    ("production" !== process.env.NODE_ENV ? invariant(
      specPolicy === SpecPolicy.DEFINE_MANY ||
      specPolicy === SpecPolicy.DEFINE_MANY_MERGED,
      'ReactClassInterface: You are attempting to define ' +
      '`%s` on your component more than once. This conflict may be due ' +
      'to a mixin.',
      name
    ) : invariant(specPolicy === SpecPolicy.DEFINE_MANY ||
    specPolicy === SpecPolicy.DEFINE_MANY_MERGED));
  }
}

/**
 * Mixin helper which handles policy validation and reserved
 * specification keys when building React classses.
 */
function mixSpecIntoComponent(Constructor, spec) {
  if (!spec) {
    return;
  }

  ("production" !== process.env.NODE_ENV ? invariant(
    typeof spec !== 'function',
    'ReactClass: You\'re attempting to ' +
    'use a component class as a mixin. Instead, just use a regular object.'
  ) : invariant(typeof spec !== 'function'));
  ("production" !== process.env.NODE_ENV ? invariant(
    !ReactElement.isValidElement(spec),
    'ReactClass: You\'re attempting to ' +
    'use a component as a mixin. Instead, just use a regular object.'
  ) : invariant(!ReactElement.isValidElement(spec)));

  var proto = Constructor.prototype;

  // By handling mixins before any other properties, we ensure the same
  // chaining order is applied to methods with DEFINE_MANY policy, whether
  // mixins are listed before or after these methods in the spec.
  if (spec.hasOwnProperty(MIXINS_KEY)) {
    RESERVED_SPEC_KEYS.mixins(Constructor, spec.mixins);
  }

  for (var name in spec) {
    if (!spec.hasOwnProperty(name)) {
      continue;
    }

    if (name === MIXINS_KEY) {
      // We have already handled mixins in a special case above
      continue;
    }

    var property = spec[name];
    validateMethodOverride(proto, name);

    if (RESERVED_SPEC_KEYS.hasOwnProperty(name)) {
      RESERVED_SPEC_KEYS[name](Constructor, property);
    } else {
      // Setup methods on prototype:
      // The following member methods should not be automatically bound:
      // 1. Expected ReactClass methods (in the "interface").
      // 2. Overridden methods (that were mixed in).
      var isReactClassMethod =
        ReactClassInterface.hasOwnProperty(name);
      var isAlreadyDefined = proto.hasOwnProperty(name);
      var markedDontBind = property && property.__reactDontBind;
      var isFunction = typeof property === 'function';
      var shouldAutoBind =
        isFunction &&
        !isReactClassMethod &&
        !isAlreadyDefined &&
        !markedDontBind;

      if (shouldAutoBind) {
        if (!proto.__reactAutoBindMap) {
          proto.__reactAutoBindMap = {};
        }
        proto.__reactAutoBindMap[name] = property;
        proto[name] = property;
      } else {
        if (isAlreadyDefined) {
          var specPolicy = ReactClassInterface[name];

          // These cases should already be caught by validateMethodOverride
          ("production" !== process.env.NODE_ENV ? invariant(
            isReactClassMethod && (
              (specPolicy === SpecPolicy.DEFINE_MANY_MERGED || specPolicy === SpecPolicy.DEFINE_MANY)
            ),
            'ReactClass: Unexpected spec policy %s for key %s ' +
            'when mixing in component specs.',
            specPolicy,
            name
          ) : invariant(isReactClassMethod && (
            (specPolicy === SpecPolicy.DEFINE_MANY_MERGED || specPolicy === SpecPolicy.DEFINE_MANY)
          )));

          // For methods which are defined more than once, call the existing
          // methods before calling the new property, merging if appropriate.
          if (specPolicy === SpecPolicy.DEFINE_MANY_MERGED) {
            proto[name] = createMergedResultFunction(proto[name], property);
          } else if (specPolicy === SpecPolicy.DEFINE_MANY) {
            proto[name] = createChainedFunction(proto[name], property);
          }
        } else {
          proto[name] = property;
          if ("production" !== process.env.NODE_ENV) {
            // Add verbose displayName to the function, which helps when looking
            // at profiling tools.
            if (typeof property === 'function' && spec.displayName) {
              proto[name].displayName = spec.displayName + '_' + name;
            }
          }
        }
      }
    }
  }
}

function mixStaticSpecIntoComponent(Constructor, statics) {
  if (!statics) {
    return;
  }
  for (var name in statics) {
    var property = statics[name];
    if (!statics.hasOwnProperty(name)) {
      continue;
    }

    var isReserved = name in RESERVED_SPEC_KEYS;
    ("production" !== process.env.NODE_ENV ? invariant(
      !isReserved,
      'ReactClass: You are attempting to define a reserved ' +
      'property, `%s`, that shouldn\'t be on the "statics" key. Define it ' +
      'as an instance property instead; it will still be accessible on the ' +
      'constructor.',
      name
    ) : invariant(!isReserved));

    var isInherited = name in Constructor;
    ("production" !== process.env.NODE_ENV ? invariant(
      !isInherited,
      'ReactClass: You are attempting to define ' +
      '`%s` on your component more than once. This conflict may be ' +
      'due to a mixin.',
      name
    ) : invariant(!isInherited));
    Constructor[name] = property;
  }
}

/**
 * Merge two objects, but throw if both contain the same key.
 *
 * @param {object} one The first object, which is mutated.
 * @param {object} two The second object
 * @return {object} one after it has been mutated to contain everything in two.
 */
function mergeIntoWithNoDuplicateKeys(one, two) {
  ("production" !== process.env.NODE_ENV ? invariant(
    one && two && typeof one === 'object' && typeof two === 'object',
    'mergeIntoWithNoDuplicateKeys(): Cannot merge non-objects.'
  ) : invariant(one && two && typeof one === 'object' && typeof two === 'object'));

  for (var key in two) {
    if (two.hasOwnProperty(key)) {
      ("production" !== process.env.NODE_ENV ? invariant(
        one[key] === undefined,
        'mergeIntoWithNoDuplicateKeys(): ' +
        'Tried to merge two objects with the same key: `%s`. This conflict ' +
        'may be due to a mixin; in particular, this may be caused by two ' +
        'getInitialState() or getDefaultProps() methods returning objects ' +
        'with clashing keys.',
        key
      ) : invariant(one[key] === undefined));
      one[key] = two[key];
    }
  }
  return one;
}

/**
 * Creates a function that invokes two functions and merges their return values.
 *
 * @param {function} one Function to invoke first.
 * @param {function} two Function to invoke second.
 * @return {function} Function that invokes the two argument functions.
 * @private
 */
function createMergedResultFunction(one, two) {
  return function mergedResult() {
    var a = one.apply(this, arguments);
    var b = two.apply(this, arguments);
    if (a == null) {
      return b;
    } else if (b == null) {
      return a;
    }
    var c = {};
    mergeIntoWithNoDuplicateKeys(c, a);
    mergeIntoWithNoDuplicateKeys(c, b);
    return c;
  };
}

/**
 * Creates a function that invokes two functions and ignores their return vales.
 *
 * @param {function} one Function to invoke first.
 * @param {function} two Function to invoke second.
 * @return {function} Function that invokes the two argument functions.
 * @private
 */
function createChainedFunction(one, two) {
  return function chainedFunction() {
    one.apply(this, arguments);
    two.apply(this, arguments);
  };
}

/**
 * Binds a method to the component.
 *
 * @param {object} component Component whose method is going to be bound.
 * @param {function} method Method to be bound.
 * @return {function} The bound method.
 */
function bindAutoBindMethod(component, method) {
  var boundMethod = method.bind(component);
  if ("production" !== process.env.NODE_ENV) {
    boundMethod.__reactBoundContext = component;
    boundMethod.__reactBoundMethod = method;
    boundMethod.__reactBoundArguments = null;
    var componentName = component.constructor.displayName;
    var _bind = boundMethod.bind;
    /* eslint-disable block-scoped-var, no-undef */
    boundMethod.bind = function(newThis ) {for (var args=[],$__0=1,$__1=arguments.length;$__0<$__1;$__0++) args.push(arguments[$__0]);
      // User is trying to bind() an autobound method; we effectively will
      // ignore the value of "this" that the user is trying to use, so
      // let's warn.
      if (newThis !== component && newThis !== null) {
        ("production" !== process.env.NODE_ENV ? warning(
          false,
          'bind(): React component methods may only be bound to the ' +
          'component instance. See %s',
          componentName
        ) : null);
      } else if (!args.length) {
        ("production" !== process.env.NODE_ENV ? warning(
          false,
          'bind(): You are binding a component method to the component. ' +
          'React does this for you automatically in a high-performance ' +
          'way, so you can safely remove this call. See %s',
          componentName
        ) : null);
        return boundMethod;
      }
      var reboundMethod = _bind.apply(boundMethod, arguments);
      reboundMethod.__reactBoundContext = component;
      reboundMethod.__reactBoundMethod = method;
      reboundMethod.__reactBoundArguments = args;
      return reboundMethod;
      /* eslint-enable */
    };
  }
  return boundMethod;
}

/**
 * Binds all auto-bound methods in a component.
 *
 * @param {object} component Component whose method is going to be bound.
 */
function bindAutoBindMethods(component) {
  for (var autoBindKey in component.__reactAutoBindMap) {
    if (component.__reactAutoBindMap.hasOwnProperty(autoBindKey)) {
      var method = component.__reactAutoBindMap[autoBindKey];
      component[autoBindKey] = bindAutoBindMethod(
        component,
        ReactErrorUtils.guard(
          method,
          component.constructor.displayName + '.' + autoBindKey
        )
      );
    }
  }
}

var typeDeprecationDescriptor = {
  enumerable: false,
  get: function() {
    var displayName = this.displayName || this.name || 'Component';
    ("production" !== process.env.NODE_ENV ? warning(
      false,
      '%s.type is deprecated. Use %s directly to access the class.',
      displayName,
      displayName
    ) : null);
    Object.defineProperty(this, 'type', {
      value: this
    });
    return this;
  }
};

/**
 * Add more to the ReactClass base class. These are all legacy features and
 * therefore not already part of the modern ReactComponent.
 */
var ReactClassMixin = {

  /**
   * TODO: This will be deprecated because state should always keep a consistent
   * type signature and the only use case for this, is to avoid that.
   */
  replaceState: function(newState, callback) {
    ReactUpdateQueue.enqueueReplaceState(this, newState);
    if (callback) {
      ReactUpdateQueue.enqueueCallback(this, callback);
    }
  },

  /**
   * Checks whether or not this composite component is mounted.
   * @return {boolean} True if mounted, false otherwise.
   * @protected
   * @final
   */
  isMounted: function() {
    if ("production" !== process.env.NODE_ENV) {
      var owner = ReactCurrentOwner.current;
      if (owner !== null) {
        ("production" !== process.env.NODE_ENV ? warning(
          owner._warnedAboutRefsInRender,
          '%s is accessing isMounted inside its render() function. ' +
          'render() should be a pure function of props and state. It should ' +
          'never access something that requires stale data from the previous ' +
          'render, such as refs. Move this logic to componentDidMount and ' +
          'componentDidUpdate instead.',
          owner.getName() || 'A component'
        ) : null);
        owner._warnedAboutRefsInRender = true;
      }
    }
    var internalInstance = ReactInstanceMap.get(this);
    return (
      internalInstance &&
      internalInstance !== ReactLifeCycle.currentlyMountingInstance
    );
  },

  /**
   * Sets a subset of the props.
   *
   * @param {object} partialProps Subset of the next props.
   * @param {?function} callback Called after props are updated.
   * @final
   * @public
   * @deprecated
   */
  setProps: function(partialProps, callback) {
    ReactUpdateQueue.enqueueSetProps(this, partialProps);
    if (callback) {
      ReactUpdateQueue.enqueueCallback(this, callback);
    }
  },

  /**
   * Replace all the props.
   *
   * @param {object} newProps Subset of the next props.
   * @param {?function} callback Called after props are updated.
   * @final
   * @public
   * @deprecated
   */
  replaceProps: function(newProps, callback) {
    ReactUpdateQueue.enqueueReplaceProps(this, newProps);
    if (callback) {
      ReactUpdateQueue.enqueueCallback(this, callback);
    }
  }
};

var ReactClassComponent = function() {};
assign(
  ReactClassComponent.prototype,
  ReactComponent.prototype,
  ReactClassMixin
);

/**
 * Module for creating composite components.
 *
 * @class ReactClass
 */
var ReactClass = {

  /**
   * Creates a composite component class given a class specification.
   *
   * @param {object} spec Class specification (which must define `render`).
   * @return {function} Component constructor function.
   * @public
   */
  createClass: function(spec) {
    var Constructor = function(props, context) {
      // This constructor is overridden by mocks. The argument is used
      // by mocks to assert on what gets mounted.

      if ("production" !== process.env.NODE_ENV) {
        ("production" !== process.env.NODE_ENV ? warning(
          this instanceof Constructor,
          'Something is calling a React component directly. Use a factory or ' +
          'JSX instead. See: https://fb.me/react-legacyfactory'
        ) : null);
      }

      // Wire up auto-binding
      if (this.__reactAutoBindMap) {
        bindAutoBindMethods(this);
      }

      this.props = props;
      this.context = context;
      this.state = null;

      // ReactClasses doesn't have constructors. Instead, they use the
      // getInitialState and componentWillMount methods for initialization.

      var initialState = this.getInitialState ? this.getInitialState() : null;
      if ("production" !== process.env.NODE_ENV) {
        // We allow auto-mocks to proceed as if they're returning null.
        if (typeof initialState === 'undefined' &&
            this.getInitialState._isMockFunction) {
          // This is probably bad practice. Consider warning here and
          // deprecating this convenience.
          initialState = null;
        }
      }
      ("production" !== process.env.NODE_ENV ? invariant(
        typeof initialState === 'object' && !Array.isArray(initialState),
        '%s.getInitialState(): must return an object or null',
        Constructor.displayName || 'ReactCompositeComponent'
      ) : invariant(typeof initialState === 'object' && !Array.isArray(initialState)));

      this.state = initialState;
    };
    Constructor.prototype = new ReactClassComponent();
    Constructor.prototype.constructor = Constructor;

    injectedMixins.forEach(
      mixSpecIntoComponent.bind(null, Constructor)
    );

    mixSpecIntoComponent(Constructor, spec);

    // Initialize the defaultProps property after all mixins have been merged
    if (Constructor.getDefaultProps) {
      Constructor.defaultProps = Constructor.getDefaultProps();
    }

    if ("production" !== process.env.NODE_ENV) {
      // This is a tag to indicate that the use of these method names is ok,
      // since it's used with createClass. If it's not, then it's likely a
      // mistake so we'll warn you to use the static property, property
      // initializer or constructor respectively.
      if (Constructor.getDefaultProps) {
        Constructor.getDefaultProps.isReactClassApproved = {};
      }
      if (Constructor.prototype.getInitialState) {
        Constructor.prototype.getInitialState.isReactClassApproved = {};
      }
    }

    ("production" !== process.env.NODE_ENV ? invariant(
      Constructor.prototype.render,
      'createClass(...): Class specification must implement a `render` method.'
    ) : invariant(Constructor.prototype.render));

    if ("production" !== process.env.NODE_ENV) {
      ("production" !== process.env.NODE_ENV ? warning(
        !Constructor.prototype.componentShouldUpdate,
        '%s has a method called ' +
        'componentShouldUpdate(). Did you mean shouldComponentUpdate()? ' +
        'The name is phrased as a question because the function is ' +
        'expected to return a value.',
        spec.displayName || 'A component'
      ) : null);
    }

    // Reduce time spent doing lookups by setting these on the prototype.
    for (var methodName in ReactClassInterface) {
      if (!Constructor.prototype[methodName]) {
        Constructor.prototype[methodName] = null;
      }
    }

    // Legacy hook
    Constructor.type = Constructor;
    if ("production" !== process.env.NODE_ENV) {
      try {
        Object.defineProperty(Constructor, 'type', typeDeprecationDescriptor);
      } catch (x) {
        // IE will fail on defineProperty (es5-shim/sham too)
      }
    }

    return Constructor;
  },

  injection: {
    injectMixin: function(mixin) {
      injectedMixins.push(mixin);
    }
  }

};

module.exports = ReactClass;

}).call(this,require('_process'))
},{"./Object.assign":33,"./ReactComponent":41,"./ReactCurrentOwner":46,"./ReactElement":64,"./ReactErrorUtils":67,"./ReactInstanceMap":74,"./ReactLifeCycle":75,"./ReactPropTypeLocationNames":83,"./ReactPropTypeLocations":84,"./ReactUpdateQueue":93,"./invariant":142,"./keyMirror":147,"./keyOf":148,"./warning":161,"_process":6}],41:[function(require,module,exports){
(function (process){
/**
 * Copyright 2013-2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule ReactComponent
 */

'use strict';

var ReactUpdateQueue = require("./ReactUpdateQueue");

var invariant = require("./invariant");
var warning = require("./warning");

/**
 * Base class helpers for the updating state of a component.
 */
function ReactComponent(props, context) {
  this.props = props;
  this.context = context;
}

/**
 * Sets a subset of the state. Always use this to mutate
 * state. You should treat `this.state` as immutable.
 *
 * There is no guarantee that `this.state` will be immediately updated, so
 * accessing `this.state` after calling this method may return the old value.
 *
 * There is no guarantee that calls to `setState` will run synchronously,
 * as they may eventually be batched together.  You can provide an optional
 * callback that will be executed when the call to setState is actually
 * completed.
 *
 * When a function is provided to setState, it will be called at some point in
 * the future (not synchronously). It will be called with the up to date
 * component arguments (state, props, context). These values can be different
 * from this.* because your function may be called after receiveProps but before
 * shouldComponentUpdate, and this new state, props, and context will not yet be
 * assigned to this.
 *
 * @param {object|function} partialState Next partial state or function to
 *        produce next partial state to be merged with current state.
 * @param {?function} callback Called after state is updated.
 * @final
 * @protected
 */
ReactComponent.prototype.setState = function(partialState, callback) {
  ("production" !== process.env.NODE_ENV ? invariant(
    typeof partialState === 'object' ||
    typeof partialState === 'function' ||
    partialState == null,
    'setState(...): takes an object of state variables to update or a ' +
    'function which returns an object of state variables.'
  ) : invariant(typeof partialState === 'object' ||
  typeof partialState === 'function' ||
  partialState == null));
  if ("production" !== process.env.NODE_ENV) {
    ("production" !== process.env.NODE_ENV ? warning(
      partialState != null,
      'setState(...): You passed an undefined or null state object; ' +
      'instead, use forceUpdate().'
    ) : null);
  }
  ReactUpdateQueue.enqueueSetState(this, partialState);
  if (callback) {
    ReactUpdateQueue.enqueueCallback(this, callback);
  }
};

/**
 * Forces an update. This should only be invoked when it is known with
 * certainty that we are **not** in a DOM transaction.
 *
 * You may want to call this when you know that some deeper aspect of the
 * component's state has changed but `setState` was not called.
 *
 * This will not invoke `shouldComponentUpdate`, but it will invoke
 * `componentWillUpdate` and `componentDidUpdate`.
 *
 * @param {?function} callback Called after update is complete.
 * @final
 * @protected
 */
ReactComponent.prototype.forceUpdate = function(callback) {
  ReactUpdateQueue.enqueueForceUpdate(this);
  if (callback) {
    ReactUpdateQueue.enqueueCallback(this, callback);
  }
};

/**
 * Deprecated APIs. These APIs used to exist on classic React classes but since
 * we would like to deprecate them, we're not going to move them over to this
 * modern base class. Instead, we define a getter that warns if it's accessed.
 */
if ("production" !== process.env.NODE_ENV) {
  var deprecatedAPIs = {
    getDOMNode: [
      'getDOMNode',
      'Use React.findDOMNode(component) instead.'
    ],
    isMounted: [
      'isMounted',
      'Instead, make sure to clean up subscriptions and pending requests in ' +
      'componentWillUnmount to prevent memory leaks.'
    ],
    replaceProps: [
      'replaceProps',
      'Instead, call React.render again at the top level.'
    ],
    replaceState: [
      'replaceState',
      'Refactor your code to use setState instead (see ' +
      'https://github.com/facebook/react/issues/3236).'
    ],
    setProps: [
      'setProps',
      'Instead, call React.render again at the top level.'
    ]
  };
  var defineDeprecationWarning = function(methodName, info) {
    try {
      Object.defineProperty(ReactComponent.prototype, methodName, {
        get: function() {
          ("production" !== process.env.NODE_ENV ? warning(
            false,
            '%s(...) is deprecated in plain JavaScript React classes. %s',
            info[0],
            info[1]
          ) : null);
          return undefined;
        }
      });
    } catch (x) {
      // IE will fail on defineProperty (es5-shim/sham too)
    }
  };
  for (var fnName in deprecatedAPIs) {
    if (deprecatedAPIs.hasOwnProperty(fnName)) {
      defineDeprecationWarning(fnName, deprecatedAPIs[fnName]);
    }
  }
}

module.exports = ReactComponent;

}).call(this,require('_process'))
},{"./ReactUpdateQueue":93,"./invariant":142,"./warning":161,"_process":6}],42:[function(require,module,exports){
/**
 * Copyright 2013-2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule ReactComponentBrowserEnvironment
 */

/*jslint evil: true */

'use strict';

var ReactDOMIDOperations = require("./ReactDOMIDOperations");
var ReactMount = require("./ReactMount");

/**
 * Abstracts away all functionality of the reconciler that requires knowledge of
 * the browser context. TODO: These callers should be refactored to avoid the
 * need for this injection.
 */
var ReactComponentBrowserEnvironment = {

  processChildrenUpdates:
    ReactDOMIDOperations.dangerouslyProcessChildrenUpdates,

  replaceNodeWithMarkupByID:
    ReactDOMIDOperations.dangerouslyReplaceNodeWithMarkupByID,

  /**
   * If a particular environment requires that some resources be cleaned up,
   * specify this in the injected Mixin. In the DOM, we would likely want to
   * purge any cached node ID lookups.
   *
   * @private
   */
  unmountIDFromEnvironment: function(rootNodeID) {
    ReactMount.purgeID(rootNodeID);
  }

};

module.exports = ReactComponentBrowserEnvironment;

},{"./ReactDOMIDOperations":51,"./ReactMount":77}],43:[function(require,module,exports){
(function (process){
/**
 * Copyright 2014-2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule ReactComponentEnvironment
 */

'use strict';

var invariant = require("./invariant");

var injected = false;

var ReactComponentEnvironment = {

  /**
   * Optionally injectable environment dependent cleanup hook. (server vs.
   * browser etc). Example: A browser system caches DOM nodes based on component
   * ID and must remove that cache entry when this instance is unmounted.
   */
  unmountIDFromEnvironment: null,

  /**
   * Optionally injectable hook for swapping out mount images in the middle of
   * the tree.
   */
  replaceNodeWithMarkupByID: null,

  /**
   * Optionally injectable hook for processing a queue of child updates. Will
   * later move into MultiChildComponents.
   */
  processChildrenUpdates: null,

  injection: {
    injectEnvironment: function(environment) {
      ("production" !== process.env.NODE_ENV ? invariant(
        !injected,
        'ReactCompositeComponent: injectEnvironment() can only be called once.'
      ) : invariant(!injected));
      ReactComponentEnvironment.unmountIDFromEnvironment =
        environment.unmountIDFromEnvironment;
      ReactComponentEnvironment.replaceNodeWithMarkupByID =
        environment.replaceNodeWithMarkupByID;
      ReactComponentEnvironment.processChildrenUpdates =
        environment.processChildrenUpdates;
      injected = true;
    }
  }

};

module.exports = ReactComponentEnvironment;

}).call(this,require('_process'))
},{"./invariant":142,"_process":6}],44:[function(require,module,exports){
(function (process){
/**
 * Copyright 2013-2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule ReactCompositeComponent
 */

'use strict';

var ReactComponentEnvironment = require("./ReactComponentEnvironment");
var ReactContext = require("./ReactContext");
var ReactCurrentOwner = require("./ReactCurrentOwner");
var ReactElement = require("./ReactElement");
var ReactElementValidator = require("./ReactElementValidator");
var ReactInstanceMap = require("./ReactInstanceMap");
var ReactLifeCycle = require("./ReactLifeCycle");
var ReactNativeComponent = require("./ReactNativeComponent");
var ReactPerf = require("./ReactPerf");
var ReactPropTypeLocations = require("./ReactPropTypeLocations");
var ReactPropTypeLocationNames = require("./ReactPropTypeLocationNames");
var ReactReconciler = require("./ReactReconciler");
var ReactUpdates = require("./ReactUpdates");

var assign = require("./Object.assign");
var emptyObject = require("./emptyObject");
var invariant = require("./invariant");
var shouldUpdateReactComponent = require("./shouldUpdateReactComponent");
var warning = require("./warning");

function getDeclarationErrorAddendum(component) {
  var owner = component._currentElement._owner || null;
  if (owner) {
    var name = owner.getName();
    if (name) {
      return ' Check the render method of `' + name + '`.';
    }
  }
  return '';
}

/**
 * ------------------ The Life-Cycle of a Composite Component ------------------
 *
 * - constructor: Initialization of state. The instance is now retained.
 *   - componentWillMount
 *   - render
 *   - [children's constructors]
 *     - [children's componentWillMount and render]
 *     - [children's componentDidMount]
 *     - componentDidMount
 *
 *       Update Phases:
 *       - componentWillReceiveProps (only called if parent updated)
 *       - shouldComponentUpdate
 *         - componentWillUpdate
 *           - render
 *           - [children's constructors or receive props phases]
 *         - componentDidUpdate
 *
 *     - componentWillUnmount
 *     - [children's componentWillUnmount]
 *   - [children destroyed]
 * - (destroyed): The instance is now blank, released by React and ready for GC.
 *
 * -----------------------------------------------------------------------------
 */

/**
 * An incrementing ID assigned to each component when it is mounted. This is
 * used to enforce the order in which `ReactUpdates` updates dirty components.
 *
 * @private
 */
var nextMountID = 1;

/**
 * @lends {ReactCompositeComponent.prototype}
 */
var ReactCompositeComponentMixin = {

  /**
   * Base constructor for all composite component.
   *
   * @param {ReactElement} element
   * @final
   * @internal
   */
  construct: function(element) {
    this._currentElement = element;
    this._rootNodeID = null;
    this._instance = null;

    // See ReactUpdateQueue
    this._pendingElement = null;
    this._pendingStateQueue = null;
    this._pendingReplaceState = false;
    this._pendingForceUpdate = false;

    this._renderedComponent = null;

    this._context = null;
    this._mountOrder = 0;
    this._isTopLevel = false;

    // See ReactUpdates and ReactUpdateQueue.
    this._pendingCallbacks = null;
  },

  /**
   * Initializes the component, renders markup, and registers event listeners.
   *
   * @param {string} rootID DOM ID of the root node.
   * @param {ReactReconcileTransaction|ReactServerRenderingTransaction} transaction
   * @return {?string} Rendered markup to be inserted into the DOM.
   * @final
   * @internal
   */
  mountComponent: function(rootID, transaction, context) {
    this._context = context;
    this._mountOrder = nextMountID++;
    this._rootNodeID = rootID;

    var publicProps = this._processProps(this._currentElement.props);
    var publicContext = this._processContext(this._currentElement._context);

    var Component = ReactNativeComponent.getComponentClassForElement(
      this._currentElement
    );

    // Initialize the public class
    var inst = new Component(publicProps, publicContext);

    if ("production" !== process.env.NODE_ENV) {
      // This will throw later in _renderValidatedComponent, but add an early
      // warning now to help debugging
      ("production" !== process.env.NODE_ENV ? warning(
        inst.render != null,
        '%s(...): No `render` method found on the returned component ' +
        'instance: you may have forgotten to define `render` in your ' +
        'component or you may have accidentally tried to render an element ' +
        'whose type is a function that isn\'t a React component.',
        Component.displayName || Component.name || 'Component'
      ) : null);
    }

    // These should be set up in the constructor, but as a convenience for
    // simpler class abstractions, we set them up after the fact.
    inst.props = publicProps;
    inst.context = publicContext;
    inst.refs = emptyObject;

    this._instance = inst;

    // Store a reference from the instance back to the internal representation
    ReactInstanceMap.set(inst, this);

    if ("production" !== process.env.NODE_ENV) {
      this._warnIfContextsDiffer(this._currentElement._context, context);
    }

    if ("production" !== process.env.NODE_ENV) {
      // Since plain JS classes are defined without any special initialization
      // logic, we can not catch common errors early. Therefore, we have to
      // catch them here, at initialization time, instead.
      ("production" !== process.env.NODE_ENV ? warning(
        !inst.getInitialState ||
        inst.getInitialState.isReactClassApproved,
        'getInitialState was defined on %s, a plain JavaScript class. ' +
        'This is only supported for classes created using React.createClass. ' +
        'Did you mean to define a state property instead?',
        this.getName() || 'a component'
      ) : null);
      ("production" !== process.env.NODE_ENV ? warning(
        !inst.getDefaultProps ||
        inst.getDefaultProps.isReactClassApproved,
        'getDefaultProps was defined on %s, a plain JavaScript class. ' +
        'This is only supported for classes created using React.createClass. ' +
        'Use a static property to define defaultProps instead.',
        this.getName() || 'a component'
      ) : null);
      ("production" !== process.env.NODE_ENV ? warning(
        !inst.propTypes,
        'propTypes was defined as an instance property on %s. Use a static ' +
        'property to define propTypes instead.',
        this.getName() || 'a component'
      ) : null);
      ("production" !== process.env.NODE_ENV ? warning(
        !inst.contextTypes,
        'contextTypes was defined as an instance property on %s. Use a ' +
        'static property to define contextTypes instead.',
        this.getName() || 'a component'
      ) : null);
      ("production" !== process.env.NODE_ENV ? warning(
        typeof inst.componentShouldUpdate !== 'function',
        '%s has a method called ' +
        'componentShouldUpdate(). Did you mean shouldComponentUpdate()? ' +
        'The name is phrased as a question because the function is ' +
        'expected to return a value.',
        (this.getName() || 'A component')
      ) : null);
    }

    var initialState = inst.state;
    if (initialState === undefined) {
      inst.state = initialState = null;
    }
    ("production" !== process.env.NODE_ENV ? invariant(
      typeof initialState === 'object' && !Array.isArray(initialState),
      '%s.state: must be set to an object or null',
      this.getName() || 'ReactCompositeComponent'
    ) : invariant(typeof initialState === 'object' && !Array.isArray(initialState)));

    this._pendingStateQueue = null;
    this._pendingReplaceState = false;
    this._pendingForceUpdate = false;

    var childContext;
    var renderedElement;

    var previouslyMounting = ReactLifeCycle.currentlyMountingInstance;
    ReactLifeCycle.currentlyMountingInstance = this;
    try {
      if (inst.componentWillMount) {
        inst.componentWillMount();
        // When mounting, calls to `setState` by `componentWillMount` will set
        // `this._pendingStateQueue` without triggering a re-render.
        if (this._pendingStateQueue) {
          inst.state = this._processPendingState(inst.props, inst.context);
        }
      }

      childContext = this._getValidatedChildContext(context);
      renderedElement = this._renderValidatedComponent(childContext);
    } finally {
      ReactLifeCycle.currentlyMountingInstance = previouslyMounting;
    }

    this._renderedComponent = this._instantiateReactComponent(
      renderedElement,
      this._currentElement.type // The wrapping type
    );

    var markup = ReactReconciler.mountComponent(
      this._renderedComponent,
      rootID,
      transaction,
      this._mergeChildContext(context, childContext)
    );
    if (inst.componentDidMount) {
      transaction.getReactMountReady().enqueue(inst.componentDidMount, inst);
    }

    return markup;
  },

  /**
   * Releases any resources allocated by `mountComponent`.
   *
   * @final
   * @internal
   */
  unmountComponent: function() {
    var inst = this._instance;

    if (inst.componentWillUnmount) {
      var previouslyUnmounting = ReactLifeCycle.currentlyUnmountingInstance;
      ReactLifeCycle.currentlyUnmountingInstance = this;
      try {
        inst.componentWillUnmount();
      } finally {
        ReactLifeCycle.currentlyUnmountingInstance = previouslyUnmounting;
      }
    }

    ReactReconciler.unmountComponent(this._renderedComponent);
    this._renderedComponent = null;

    // Reset pending fields
    this._pendingStateQueue = null;
    this._pendingReplaceState = false;
    this._pendingForceUpdate = false;
    this._pendingCallbacks = null;
    this._pendingElement = null;

    // These fields do not really need to be reset since this object is no
    // longer accessible.
    this._context = null;
    this._rootNodeID = null;

    // Delete the reference from the instance to this internal representation
    // which allow the internals to be properly cleaned up even if the user
    // leaks a reference to the public instance.
    ReactInstanceMap.remove(inst);

    // Some existing components rely on inst.props even after they've been
    // destroyed (in event handlers).
    // TODO: inst.props = null;
    // TODO: inst.state = null;
    // TODO: inst.context = null;
  },

  /**
   * Schedule a partial update to the props. Only used for internal testing.
   *
   * @param {object} partialProps Subset of the next props.
   * @param {?function} callback Called after props are updated.
   * @final
   * @internal
   */
  _setPropsInternal: function(partialProps, callback) {
    // This is a deoptimized path. We optimize for always having an element.
    // This creates an extra internal element.
    var element = this._pendingElement || this._currentElement;
    this._pendingElement = ReactElement.cloneAndReplaceProps(
      element,
      assign({}, element.props, partialProps)
    );
    ReactUpdates.enqueueUpdate(this, callback);
  },

  /**
   * Filters the context object to only contain keys specified in
   * `contextTypes`
   *
   * @param {object} context
   * @return {?object}
   * @private
   */
  _maskContext: function(context) {
    var maskedContext = null;
    // This really should be getting the component class for the element,
    // but we know that we're not going to need it for built-ins.
    if (typeof this._currentElement.type === 'string') {
      return emptyObject;
    }
    var contextTypes = this._currentElement.type.contextTypes;
    if (!contextTypes) {
      return emptyObject;
    }
    maskedContext = {};
    for (var contextName in contextTypes) {
      maskedContext[contextName] = context[contextName];
    }
    return maskedContext;
  },

  /**
   * Filters the context object to only contain keys specified in
   * `contextTypes`, and asserts that they are valid.
   *
   * @param {object} context
   * @return {?object}
   * @private
   */
  _processContext: function(context) {
    var maskedContext = this._maskContext(context);
    if ("production" !== process.env.NODE_ENV) {
      var Component = ReactNativeComponent.getComponentClassForElement(
        this._currentElement
      );
      if (Component.contextTypes) {
        this._checkPropTypes(
          Component.contextTypes,
          maskedContext,
          ReactPropTypeLocations.context
        );
      }
    }
    return maskedContext;
  },

  /**
   * @param {object} currentContext
   * @return {object}
   * @private
   */
  _getValidatedChildContext: function(currentContext) {
    var inst = this._instance;
    var childContext = inst.getChildContext && inst.getChildContext();
    if (childContext) {
      ("production" !== process.env.NODE_ENV ? invariant(
        typeof inst.constructor.childContextTypes === 'object',
        '%s.getChildContext(): childContextTypes must be defined in order to ' +
        'use getChildContext().',
        this.getName() || 'ReactCompositeComponent'
      ) : invariant(typeof inst.constructor.childContextTypes === 'object'));
      if ("production" !== process.env.NODE_ENV) {
        this._checkPropTypes(
          inst.constructor.childContextTypes,
          childContext,
          ReactPropTypeLocations.childContext
        );
      }
      for (var name in childContext) {
        ("production" !== process.env.NODE_ENV ? invariant(
          name in inst.constructor.childContextTypes,
          '%s.getChildContext(): key "%s" is not defined in childContextTypes.',
          this.getName() || 'ReactCompositeComponent',
          name
        ) : invariant(name in inst.constructor.childContextTypes));
      }
      return childContext;
    }
    return null;
  },

  _mergeChildContext: function(currentContext, childContext) {
    if (childContext) {
      return assign({}, currentContext, childContext);
    }
    return currentContext;
  },

  /**
   * Processes props by setting default values for unspecified props and
   * asserting that the props are valid. Does not mutate its argument; returns
   * a new props object with defaults merged in.
   *
   * @param {object} newProps
   * @return {object}
   * @private
   */
  _processProps: function(newProps) {
    if ("production" !== process.env.NODE_ENV) {
      var Component = ReactNativeComponent.getComponentClassForElement(
        this._currentElement
      );
      if (Component.propTypes) {
        this._checkPropTypes(
          Component.propTypes,
          newProps,
          ReactPropTypeLocations.prop
        );
      }
    }
    return newProps;
  },

  /**
   * Assert that the props are valid
   *
   * @param {object} propTypes Map of prop name to a ReactPropType
   * @param {object} props
   * @param {string} location e.g. "prop", "context", "child context"
   * @private
   */
  _checkPropTypes: function(propTypes, props, location) {
    // TODO: Stop validating prop types here and only use the element
    // validation.
    var componentName = this.getName();
    for (var propName in propTypes) {
      if (propTypes.hasOwnProperty(propName)) {
        var error;
        try {
          // This is intentionally an invariant that gets caught. It's the same
          // behavior as without this statement except with a better message.
          ("production" !== process.env.NODE_ENV ? invariant(
            typeof propTypes[propName] === 'function',
            '%s: %s type `%s` is invalid; it must be a function, usually ' +
            'from React.PropTypes.',
            componentName || 'React class',
            ReactPropTypeLocationNames[location],
            propName
          ) : invariant(typeof propTypes[propName] === 'function'));
          error = propTypes[propName](props, propName, componentName, location);
        } catch (ex) {
          error = ex;
        }
        if (error instanceof Error) {
          // We may want to extend this logic for similar errors in
          // React.render calls, so I'm abstracting it away into
          // a function to minimize refactoring in the future
          var addendum = getDeclarationErrorAddendum(this);

          if (location === ReactPropTypeLocations.prop) {
            // Preface gives us something to blacklist in warning module
            ("production" !== process.env.NODE_ENV ? warning(
              false,
              'Failed Composite propType: %s%s',
              error.message,
              addendum
            ) : null);
          } else {
            ("production" !== process.env.NODE_ENV ? warning(
              false,
              'Failed Context Types: %s%s',
              error.message,
              addendum
            ) : null);
          }
        }
      }
    }
  },

  receiveComponent: function(nextElement, transaction, nextContext) {
    var prevElement = this._currentElement;
    var prevContext = this._context;

    this._pendingElement = null;

    this.updateComponent(
      transaction,
      prevElement,
      nextElement,
      prevContext,
      nextContext
    );
  },

  /**
   * If any of `_pendingElement`, `_pendingStateQueue`, or `_pendingForceUpdate`
   * is set, update the component.
   *
   * @param {ReactReconcileTransaction} transaction
   * @internal
   */
  performUpdateIfNecessary: function(transaction) {
    if (this._pendingElement != null) {
      ReactReconciler.receiveComponent(
        this,
        this._pendingElement || this._currentElement,
        transaction,
        this._context
      );
    }

    if (this._pendingStateQueue !== null || this._pendingForceUpdate) {
      if ("production" !== process.env.NODE_ENV) {
        ReactElementValidator.checkAndWarnForMutatedProps(
          this._currentElement
        );
      }

      this.updateComponent(
        transaction,
        this._currentElement,
        this._currentElement,
        this._context,
        this._context
      );
    }
  },

  /**
   * Compare two contexts, warning if they are different
   * TODO: Remove this check when owner-context is removed
   */
   _warnIfContextsDiffer: function(ownerBasedContext, parentBasedContext) {
    ownerBasedContext = this._maskContext(ownerBasedContext);
    parentBasedContext = this._maskContext(parentBasedContext);
    var parentKeys = Object.keys(parentBasedContext).sort();
    var displayName = this.getName() || 'ReactCompositeComponent';
    for (var i = 0; i < parentKeys.length; i++) {
      var key = parentKeys[i];
      ("production" !== process.env.NODE_ENV ? warning(
        ownerBasedContext[key] === parentBasedContext[key],
        'owner-based and parent-based contexts differ '  +
        '(values: `%s` vs `%s`) for key (%s) while mounting %s ' +
        '(see: http://fb.me/react-context-by-parent)',
        ownerBasedContext[key],
        parentBasedContext[key],
        key,
        displayName
      ) : null);
    }
  },

  /**
   * Perform an update to a mounted component. The componentWillReceiveProps and
   * shouldComponentUpdate methods are called, then (assuming the update isn't
   * skipped) the remaining update lifecycle methods are called and the DOM
   * representation is updated.
   *
   * By default, this implements React's rendering and reconciliation algorithm.
   * Sophisticated clients may wish to override this.
   *
   * @param {ReactReconcileTransaction} transaction
   * @param {ReactElement} prevParentElement
   * @param {ReactElement} nextParentElement
   * @internal
   * @overridable
   */
  updateComponent: function(
    transaction,
    prevParentElement,
    nextParentElement,
    prevUnmaskedContext,
    nextUnmaskedContext
  ) {
    var inst = this._instance;

    var nextContext = inst.context;
    var nextProps = inst.props;

    // Distinguish between a props update versus a simple state update
    if (prevParentElement !== nextParentElement) {
      nextContext = this._processContext(nextParentElement._context);
      nextProps = this._processProps(nextParentElement.props);

      if ("production" !== process.env.NODE_ENV) {
        if (nextUnmaskedContext != null) {
          this._warnIfContextsDiffer(
            nextParentElement._context,
            nextUnmaskedContext
          );
        }
      }

      // An update here will schedule an update but immediately set
      // _pendingStateQueue which will ensure that any state updates gets
      // immediately reconciled instead of waiting for the next batch.

      if (inst.componentWillReceiveProps) {
        inst.componentWillReceiveProps(nextProps, nextContext);
      }
    }

    var nextState = this._processPendingState(nextProps, nextContext);

    var shouldUpdate =
      this._pendingForceUpdate ||
      !inst.shouldComponentUpdate ||
      inst.shouldComponentUpdate(nextProps, nextState, nextContext);

    if ("production" !== process.env.NODE_ENV) {
      ("production" !== process.env.NODE_ENV ? warning(
        typeof shouldUpdate !== 'undefined',
        '%s.shouldComponentUpdate(): Returned undefined instead of a ' +
        'boolean value. Make sure to return true or false.',
        this.getName() || 'ReactCompositeComponent'
      ) : null);
    }

    if (shouldUpdate) {
      this._pendingForceUpdate = false;
      // Will set `this.props`, `this.state` and `this.context`.
      this._performComponentUpdate(
        nextParentElement,
        nextProps,
        nextState,
        nextContext,
        transaction,
        nextUnmaskedContext
      );
    } else {
      // If it's determined that a component should not update, we still want
      // to set props and state but we shortcut the rest of the update.
      this._currentElement = nextParentElement;
      this._context = nextUnmaskedContext;
      inst.props = nextProps;
      inst.state = nextState;
      inst.context = nextContext;
    }
  },

  _processPendingState: function(props, context) {
    var inst = this._instance;
    var queue = this._pendingStateQueue;
    var replace = this._pendingReplaceState;
    this._pendingReplaceState = false;
    this._pendingStateQueue = null;

    if (!queue) {
      return inst.state;
    }

    if (replace && queue.length === 1) {
      return queue[0];
    }

    var nextState = assign({}, replace ? queue[0] : inst.state);
    for (var i = replace ? 1 : 0; i < queue.length; i++) {
      var partial = queue[i];
      assign(
        nextState,
        typeof partial === 'function' ?
          partial.call(inst, nextState, props, context) :
          partial
      );
    }

    return nextState;
  },

  /**
   * Merges new props and state, notifies delegate methods of update and
   * performs update.
   *
   * @param {ReactElement} nextElement Next element
   * @param {object} nextProps Next public object to set as properties.
   * @param {?object} nextState Next object to set as state.
   * @param {?object} nextContext Next public object to set as context.
   * @param {ReactReconcileTransaction} transaction
   * @param {?object} unmaskedContext
   * @private
   */
  _performComponentUpdate: function(
    nextElement,
    nextProps,
    nextState,
    nextContext,
    transaction,
    unmaskedContext
  ) {
    var inst = this._instance;

    var prevProps = inst.props;
    var prevState = inst.state;
    var prevContext = inst.context;

    if (inst.componentWillUpdate) {
      inst.componentWillUpdate(nextProps, nextState, nextContext);
    }

    this._currentElement = nextElement;
    this._context = unmaskedContext;
    inst.props = nextProps;
    inst.state = nextState;
    inst.context = nextContext;

    this._updateRenderedComponent(transaction, unmaskedContext);

    if (inst.componentDidUpdate) {
      transaction.getReactMountReady().enqueue(
        inst.componentDidUpdate.bind(inst, prevProps, prevState, prevContext),
        inst
      );
    }
  },

  /**
   * Call the component's `render` method and update the DOM accordingly.
   *
   * @param {ReactReconcileTransaction} transaction
   * @internal
   */
  _updateRenderedComponent: function(transaction, context) {
    var prevComponentInstance = this._renderedComponent;
    var prevRenderedElement = prevComponentInstance._currentElement;
    var childContext = this._getValidatedChildContext();
    var nextRenderedElement = this._renderValidatedComponent(childContext);
    if (shouldUpdateReactComponent(prevRenderedElement, nextRenderedElement)) {
      ReactReconciler.receiveComponent(
        prevComponentInstance,
        nextRenderedElement,
        transaction,
        this._mergeChildContext(context, childContext)
      );
    } else {
      // These two IDs are actually the same! But nothing should rely on that.
      var thisID = this._rootNodeID;
      var prevComponentID = prevComponentInstance._rootNodeID;
      ReactReconciler.unmountComponent(prevComponentInstance);

      this._renderedComponent = this._instantiateReactComponent(
        nextRenderedElement,
        this._currentElement.type
      );
      var nextMarkup = ReactReconciler.mountComponent(
        this._renderedComponent,
        thisID,
        transaction,
        this._mergeChildContext(context, childContext)
      );
      this._replaceNodeWithMarkupByID(prevComponentID, nextMarkup);
    }
  },

  /**
   * @protected
   */
  _replaceNodeWithMarkupByID: function(prevComponentID, nextMarkup) {
    ReactComponentEnvironment.replaceNodeWithMarkupByID(
      prevComponentID,
      nextMarkup
    );
  },

  /**
   * @protected
   */
  _renderValidatedComponentWithoutOwnerOrContext: function() {
    var inst = this._instance;
    var renderedComponent = inst.render();
    if ("production" !== process.env.NODE_ENV) {
      // We allow auto-mocks to proceed as if they're returning null.
      if (typeof renderedComponent === 'undefined' &&
          inst.render._isMockFunction) {
        // This is probably bad practice. Consider warning here and
        // deprecating this convenience.
        renderedComponent = null;
      }
    }

    return renderedComponent;
  },

  /**
   * @private
   */
  _renderValidatedComponent: function(childContext) {
    var renderedComponent;
    var previousContext = ReactContext.current;
    ReactContext.current = this._mergeChildContext(
      this._currentElement._context,
      childContext
    );
    ReactCurrentOwner.current = this;
    try {
      renderedComponent =
        this._renderValidatedComponentWithoutOwnerOrContext();
    } finally {
      ReactContext.current = previousContext;
      ReactCurrentOwner.current = null;
    }
    ("production" !== process.env.NODE_ENV ? invariant(
      // TODO: An `isValidNode` function would probably be more appropriate
      renderedComponent === null || renderedComponent === false ||
      ReactElement.isValidElement(renderedComponent),
      '%s.render(): A valid ReactComponent must be returned. You may have ' +
        'returned undefined, an array or some other invalid object.',
      this.getName() || 'ReactCompositeComponent'
    ) : invariant(// TODO: An `isValidNode` function would probably be more appropriate
    renderedComponent === null || renderedComponent === false ||
    ReactElement.isValidElement(renderedComponent)));
    return renderedComponent;
  },

  /**
   * Lazily allocates the refs object and stores `component` as `ref`.
   *
   * @param {string} ref Reference name.
   * @param {component} component Component to store as `ref`.
   * @final
   * @private
   */
  attachRef: function(ref, component) {
    var inst = this.getPublicInstance();
    var refs = inst.refs === emptyObject ? (inst.refs = {}) : inst.refs;
    refs[ref] = component.getPublicInstance();
  },

  /**
   * Detaches a reference name.
   *
   * @param {string} ref Name to dereference.
   * @final
   * @private
   */
  detachRef: function(ref) {
    var refs = this.getPublicInstance().refs;
    delete refs[ref];
  },

  /**
   * Get a text description of the component that can be used to identify it
   * in error messages.
   * @return {string} The name or null.
   * @internal
   */
  getName: function() {
    var type = this._currentElement.type;
    var constructor = this._instance && this._instance.constructor;
    return (
      type.displayName || (constructor && constructor.displayName) ||
      type.name || (constructor && constructor.name) ||
      null
    );
  },

  /**
   * Get the publicly accessible representation of this component - i.e. what
   * is exposed by refs and returned by React.render. Can be null for stateless
   * components.
   *
   * @return {ReactComponent} the public component instance.
   * @internal
   */
  getPublicInstance: function() {
    return this._instance;
  },

  // Stub
  _instantiateReactComponent: null

};

ReactPerf.measureMethods(
  ReactCompositeComponentMixin,
  'ReactCompositeComponent',
  {
    mountComponent: 'mountComponent',
    updateComponent: 'updateComponent',
    _renderValidatedComponent: '_renderValidatedComponent'
  }
);

var ReactCompositeComponent = {

  Mixin: ReactCompositeComponentMixin

};

module.exports = ReactCompositeComponent;

}).call(this,require('_process'))
},{"./Object.assign":33,"./ReactComponentEnvironment":43,"./ReactContext":45,"./ReactCurrentOwner":46,"./ReactElement":64,"./ReactElementValidator":65,"./ReactInstanceMap":74,"./ReactLifeCycle":75,"./ReactNativeComponent":80,"./ReactPerf":82,"./ReactPropTypeLocationNames":83,"./ReactPropTypeLocations":84,"./ReactReconciler":88,"./ReactUpdates":94,"./emptyObject":122,"./invariant":142,"./shouldUpdateReactComponent":158,"./warning":161,"_process":6}],45:[function(require,module,exports){
(function (process){
/**
 * Copyright 2013-2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule ReactContext
 */

'use strict';

var assign = require("./Object.assign");
var emptyObject = require("./emptyObject");
var warning = require("./warning");

var didWarn = false;

/**
 * Keeps track of the current context.
 *
 * The context is automatically passed down the component ownership hierarchy
 * and is accessible via `this.context` on ReactCompositeComponents.
 */
var ReactContext = {

  /**
   * @internal
   * @type {object}
   */
  current: emptyObject,

  /**
   * Temporarily extends the current context while executing scopedCallback.
   *
   * A typical use case might look like
   *
   *  render: function() {
   *    var children = ReactContext.withContext({foo: 'foo'}, () => (
   *
   *    ));
   *    return <div>{children}</div>;
   *  }
   *
   * @param {object} newContext New context to merge into the existing context
   * @param {function} scopedCallback Callback to run with the new context
   * @return {ReactComponent|array<ReactComponent>}
   */
  withContext: function(newContext, scopedCallback) {
    if ("production" !== process.env.NODE_ENV) {
      ("production" !== process.env.NODE_ENV ? warning(
        didWarn,
        'withContext is deprecated and will be removed in a future version. ' +
        'Use a wrapper component with getChildContext instead.'
      ) : null);

      didWarn = true;
    }

    var result;
    var previousContext = ReactContext.current;
    ReactContext.current = assign({}, previousContext, newContext);
    try {
      result = scopedCallback();
    } finally {
      ReactContext.current = previousContext;
    }
    return result;
  }

};

module.exports = ReactContext;

}).call(this,require('_process'))
},{"./Object.assign":33,"./emptyObject":122,"./warning":161,"_process":6}],46:[function(require,module,exports){
/**
 * Copyright 2013-2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule ReactCurrentOwner
 */

'use strict';

/**
 * Keeps track of the current owner.
 *
 * The current owner is the component who should own any components that are
 * currently being constructed.
 *
 * The depth indicate how many composite components are above this render level.
 */
var ReactCurrentOwner = {

  /**
   * @internal
   * @type {ReactComponent}
   */
  current: null

};

module.exports = ReactCurrentOwner;

},{}],47:[function(require,module,exports){
(function (process){
/**
 * Copyright 2013-2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule ReactDOM
 * @typechecks static-only
 */

'use strict';

var ReactElement = require("./ReactElement");
var ReactElementValidator = require("./ReactElementValidator");

var mapObject = require("./mapObject");

/**
 * Create a factory that creates HTML tag elements.
 *
 * @param {string} tag Tag name (e.g. `div`).
 * @private
 */
function createDOMFactory(tag) {
  if ("production" !== process.env.NODE_ENV) {
    return ReactElementValidator.createFactory(tag);
  }
  return ReactElement.createFactory(tag);
}

/**
 * Creates a mapping from supported HTML tags to `ReactDOMComponent` classes.
 * This is also accessible via `React.DOM`.
 *
 * @public
 */
var ReactDOM = mapObject({
  a: 'a',
  abbr: 'abbr',
  address: 'address',
  area: 'area',
  article: 'article',
  aside: 'aside',
  audio: 'audio',
  b: 'b',
  base: 'base',
  bdi: 'bdi',
  bdo: 'bdo',
  big: 'big',
  blockquote: 'blockquote',
  body: 'body',
  br: 'br',
  button: 'button',
  canvas: 'canvas',
  caption: 'caption',
  cite: 'cite',
  code: 'code',
  col: 'col',
  colgroup: 'colgroup',
  data: 'data',
  datalist: 'datalist',
  dd: 'dd',
  del: 'del',
  details: 'details',
  dfn: 'dfn',
  dialog: 'dialog',
  div: 'div',
  dl: 'dl',
  dt: 'dt',
  em: 'em',
  embed: 'embed',
  fieldset: 'fieldset',
  figcaption: 'figcaption',
  figure: 'figure',
  footer: 'footer',
  form: 'form',
  h1: 'h1',
  h2: 'h2',
  h3: 'h3',
  h4: 'h4',
  h5: 'h5',
  h6: 'h6',
  head: 'head',
  header: 'header',
  hr: 'hr',
  html: 'html',
  i: 'i',
  iframe: 'iframe',
  img: 'img',
  input: 'input',
  ins: 'ins',
  kbd: 'kbd',
  keygen: 'keygen',
  label: 'label',
  legend: 'legend',
  li: 'li',
  link: 'link',
  main: 'main',
  map: 'map',
  mark: 'mark',
  menu: 'menu',
  menuitem: 'menuitem',
  meta: 'meta',
  meter: 'meter',
  nav: 'nav',
  noscript: 'noscript',
  object: 'object',
  ol: 'ol',
  optgroup: 'optgroup',
  option: 'option',
  output: 'output',
  p: 'p',
  param: 'param',
  picture: 'picture',
  pre: 'pre',
  progress: 'progress',
  q: 'q',
  rp: 'rp',
  rt: 'rt',
  ruby: 'ruby',
  s: 's',
  samp: 'samp',
  script: 'script',
  section: 'section',
  select: 'select',
  small: 'small',
  source: 'source',
  span: 'span',
  strong: 'strong',
  style: 'style',
  sub: 'sub',
  summary: 'summary',
  sup: 'sup',
  table: 'table',
  tbody: 'tbody',
  td: 'td',
  textarea: 'textarea',
  tfoot: 'tfoot',
  th: 'th',
  thead: 'thead',
  time: 'time',
  title: 'title',
  tr: 'tr',
  track: 'track',
  u: 'u',
  ul: 'ul',
  'var': 'var',
  video: 'video',
  wbr: 'wbr',

  // SVG
  circle: 'circle',
  clipPath: 'clipPath',
  defs: 'defs',
  ellipse: 'ellipse',
  g: 'g',
  line: 'line',
  linearGradient: 'linearGradient',
  mask: 'mask',
  path: 'path',
  pattern: 'pattern',
  polygon: 'polygon',
  polyline: 'polyline',
  radialGradient: 'radialGradient',
  rect: 'rect',
  stop: 'stop',
  svg: 'svg',
  text: 'text',
  tspan: 'tspan'

}, createDOMFactory);

module.exports = ReactDOM;

}).call(this,require('_process'))
},{"./ReactElement":64,"./ReactElementValidator":65,"./mapObject":149,"_process":6}],48:[function(require,module,exports){
/**
 * Copyright 2013-2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule ReactDOMButton
 */

'use strict';

var AutoFocusMixin = require("./AutoFocusMixin");
var ReactBrowserComponentMixin = require("./ReactBrowserComponentMixin");
var ReactClass = require("./ReactClass");
var ReactElement = require("./ReactElement");

var keyMirror = require("./keyMirror");

var button = ReactElement.createFactory('button');

var mouseListenerNames = keyMirror({
  onClick: true,
  onDoubleClick: true,
  onMouseDown: true,
  onMouseMove: true,
  onMouseUp: true,
  onClickCapture: true,
  onDoubleClickCapture: true,
  onMouseDownCapture: true,
  onMouseMoveCapture: true,
  onMouseUpCapture: true
});

/**
 * Implements a <button> native component that does not receive mouse events
 * when `disabled` is set.
 */
var ReactDOMButton = ReactClass.createClass({
  displayName: 'ReactDOMButton',
  tagName: 'BUTTON',

  mixins: [AutoFocusMixin, ReactBrowserComponentMixin],

  render: function() {
    var props = {};

    // Copy the props; except the mouse listeners if we're disabled
    for (var key in this.props) {
      if (this.props.hasOwnProperty(key) &&
          (!this.props.disabled || !mouseListenerNames[key])) {
        props[key] = this.props[key];
      }
    }

    return button(props, this.props.children);
  }

});

module.exports = ReactDOMButton;

},{"./AutoFocusMixin":8,"./ReactBrowserComponentMixin":36,"./ReactClass":40,"./ReactElement":64,"./keyMirror":147}],49:[function(require,module,exports){
(function (process){
/**
 * Copyright 2013-2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule ReactDOMComponent
 * @typechecks static-only
 */

/* global hasOwnProperty:true */

'use strict';

var CSSPropertyOperations = require("./CSSPropertyOperations");
var DOMProperty = require("./DOMProperty");
var DOMPropertyOperations = require("./DOMPropertyOperations");
var ReactBrowserEventEmitter = require("./ReactBrowserEventEmitter");
var ReactComponentBrowserEnvironment =
  require("./ReactComponentBrowserEnvironment");
var ReactMount = require("./ReactMount");
var ReactMultiChild = require("./ReactMultiChild");
var ReactPerf = require("./ReactPerf");

var assign = require("./Object.assign");
var escapeTextContentForBrowser = require("./escapeTextContentForBrowser");
var invariant = require("./invariant");
var isEventSupported = require("./isEventSupported");
var keyOf = require("./keyOf");
var warning = require("./warning");

var deleteListener = ReactBrowserEventEmitter.deleteListener;
var listenTo = ReactBrowserEventEmitter.listenTo;
var registrationNameModules = ReactBrowserEventEmitter.registrationNameModules;

// For quickly matching children type, to test if can be treated as content.
var CONTENT_TYPES = {'string': true, 'number': true};

var STYLE = keyOf({style: null});

var ELEMENT_NODE_TYPE = 1;

/**
 * Optionally injectable operations for mutating the DOM
 */
var BackendIDOperations = null;

/**
 * @param {?object} props
 */
function assertValidProps(props) {
  if (!props) {
    return;
  }
  // Note the use of `==` which checks for null or undefined.
  if (props.dangerouslySetInnerHTML != null) {
    ("production" !== process.env.NODE_ENV ? invariant(
      props.children == null,
      'Can only set one of `children` or `props.dangerouslySetInnerHTML`.'
    ) : invariant(props.children == null));
    ("production" !== process.env.NODE_ENV ? invariant(
      typeof props.dangerouslySetInnerHTML === 'object' &&
      '__html' in props.dangerouslySetInnerHTML,
      '`props.dangerouslySetInnerHTML` must be in the form `{__html: ...}`. ' +
      'Please visit https://fb.me/react-invariant-dangerously-set-inner-html ' +
      'for more information.'
    ) : invariant(typeof props.dangerouslySetInnerHTML === 'object' &&
    '__html' in props.dangerouslySetInnerHTML));
  }
  if ("production" !== process.env.NODE_ENV) {
    ("production" !== process.env.NODE_ENV ? warning(
      props.innerHTML == null,
      'Directly setting property `innerHTML` is not permitted. ' +
      'For more information, lookup documentation on `dangerouslySetInnerHTML`.'
    ) : null);
    ("production" !== process.env.NODE_ENV ? warning(
      !props.contentEditable || props.children == null,
      'A component is `contentEditable` and contains `children` managed by ' +
      'React. It is now your responsibility to guarantee that none of ' +
      'those nodes are unexpectedly modified or duplicated. This is ' +
      'probably not intentional.'
    ) : null);
  }
  ("production" !== process.env.NODE_ENV ? invariant(
    props.style == null || typeof props.style === 'object',
    'The `style` prop expects a mapping from style properties to values, ' +
    'not a string. For example, style={{marginRight: spacing + \'em\'}} when ' +
    'using JSX.'
  ) : invariant(props.style == null || typeof props.style === 'object'));
}

function putListener(id, registrationName, listener, transaction) {
  if ("production" !== process.env.NODE_ENV) {
    // IE8 has no API for event capturing and the `onScroll` event doesn't
    // bubble.
    ("production" !== process.env.NODE_ENV ? warning(
      registrationName !== 'onScroll' || isEventSupported('scroll', true),
      'This browser doesn\'t support the `onScroll` event'
    ) : null);
  }
  var container = ReactMount.findReactContainerForID(id);
  if (container) {
    var doc = container.nodeType === ELEMENT_NODE_TYPE ?
      container.ownerDocument :
      container;
    listenTo(registrationName, doc);
  }
  transaction.getPutListenerQueue().enqueuePutListener(
    id,
    registrationName,
    listener
  );
}

// For HTML, certain tags should omit their close tag. We keep a whitelist for
// those special cased tags.

var omittedCloseTags = {
  'area': true,
  'base': true,
  'br': true,
  'col': true,
  'embed': true,
  'hr': true,
  'img': true,
  'input': true,
  'keygen': true,
  'link': true,
  'meta': true,
  'param': true,
  'source': true,
  'track': true,
  'wbr': true
  // NOTE: menuitem's close tag should be omitted, but that causes problems.
};

// We accept any tag to be rendered but since this gets injected into abitrary
// HTML, we want to make sure that it's a safe tag.
// http://www.w3.org/TR/REC-xml/#NT-Name

var VALID_TAG_REGEX = /^[a-zA-Z][a-zA-Z:_\.\-\d]*$/; // Simplified subset
var validatedTagCache = {};
var hasOwnProperty = {}.hasOwnProperty;

function validateDangerousTag(tag) {
  if (!hasOwnProperty.call(validatedTagCache, tag)) {
    ("production" !== process.env.NODE_ENV ? invariant(VALID_TAG_REGEX.test(tag), 'Invalid tag: %s', tag) : invariant(VALID_TAG_REGEX.test(tag)));
    validatedTagCache[tag] = true;
  }
}

/**
 * Creates a new React class that is idempotent and capable of containing other
 * React components. It accepts event listeners and DOM properties that are
 * valid according to `DOMProperty`.
 *
 *  - Event listeners: `onClick`, `onMouseDown`, etc.
 *  - DOM properties: `className`, `name`, `title`, etc.
 *
 * The `style` property functions differently from the DOM API. It accepts an
 * object mapping of style properties to values.
 *
 * @constructor ReactDOMComponent
 * @extends ReactMultiChild
 */
function ReactDOMComponent(tag) {
  validateDangerousTag(tag);
  this._tag = tag;
  this._renderedChildren = null;
  this._previousStyleCopy = null;
  this._rootNodeID = null;
}

ReactDOMComponent.displayName = 'ReactDOMComponent';

ReactDOMComponent.Mixin = {

  construct: function(element) {
    this._currentElement = element;
  },

  /**
   * Generates root tag markup then recurses. This method has side effects and
   * is not idempotent.
   *
   * @internal
   * @param {string} rootID The root DOM ID for this node.
   * @param {ReactReconcileTransaction|ReactServerRenderingTransaction} transaction
   * @return {string} The computed markup.
   */
  mountComponent: function(rootID, transaction, context) {
    this._rootNodeID = rootID;
    assertValidProps(this._currentElement.props);
    var closeTag = omittedCloseTags[this._tag] ? '' : '</' + this._tag + '>';
    return (
      this._createOpenTagMarkupAndPutListeners(transaction) +
      this._createContentMarkup(transaction, context) +
      closeTag
    );
  },

  /**
   * Creates markup for the open tag and all attributes.
   *
   * This method has side effects because events get registered.
   *
   * Iterating over object properties is faster than iterating over arrays.
   * @see http://jsperf.com/obj-vs-arr-iteration
   *
   * @private
   * @param {ReactReconcileTransaction|ReactServerRenderingTransaction} transaction
   * @return {string} Markup of opening tag.
   */
  _createOpenTagMarkupAndPutListeners: function(transaction) {
    var props = this._currentElement.props;
    var ret = '<' + this._tag;

    for (var propKey in props) {
      if (!props.hasOwnProperty(propKey)) {
        continue;
      }
      var propValue = props[propKey];
      if (propValue == null) {
        continue;
      }
      if (registrationNameModules.hasOwnProperty(propKey)) {
        putListener(this._rootNodeID, propKey, propValue, transaction);
      } else {
        if (propKey === STYLE) {
          if (propValue) {
            propValue = this._previousStyleCopy = assign({}, props.style);
          }
          propValue = CSSPropertyOperations.createMarkupForStyles(propValue);
        }
        var markup =
          DOMPropertyOperations.createMarkupForProperty(propKey, propValue);
        if (markup) {
          ret += ' ' + markup;
        }
      }
    }

    // For static pages, no need to put React ID and checksum. Saves lots of
    // bytes.
    if (transaction.renderToStaticMarkup) {
      return ret + '>';
    }

    var markupForID = DOMPropertyOperations.createMarkupForID(this._rootNodeID);
    return ret + ' ' + markupForID + '>';
  },

  /**
   * Creates markup for the content between the tags.
   *
   * @private
   * @param {ReactReconcileTransaction|ReactServerRenderingTransaction} transaction
   * @param {object} context
   * @return {string} Content markup.
   */
  _createContentMarkup: function(transaction, context) {
    var prefix = '';
    if (this._tag === 'listing' ||
        this._tag === 'pre' ||
        this._tag === 'textarea') {
      // Add an initial newline because browsers ignore the first newline in
      // a <listing>, <pre>, or <textarea> as an "authoring convenience" -- see
      // https://html.spec.whatwg.org/multipage/syntax.html#parsing-main-inbody.
      prefix = '\n';
    }

    var props = this._currentElement.props;

    // Intentional use of != to avoid catching zero/false.
    var innerHTML = props.dangerouslySetInnerHTML;
    if (innerHTML != null) {
      if (innerHTML.__html != null) {
        return prefix + innerHTML.__html;
      }
    } else {
      var contentToUse =
        CONTENT_TYPES[typeof props.children] ? props.children : null;
      var childrenToUse = contentToUse != null ? null : props.children;
      if (contentToUse != null) {
        return prefix + escapeTextContentForBrowser(contentToUse);
      } else if (childrenToUse != null) {
        var mountImages = this.mountChildren(
          childrenToUse,
          transaction,
          context
        );
        return prefix + mountImages.join('');
      }
    }
    return prefix;
  },

  receiveComponent: function(nextElement, transaction, context) {
    var prevElement = this._currentElement;
    this._currentElement = nextElement;
    this.updateComponent(transaction, prevElement, nextElement, context);
  },

  /**
   * Updates a native DOM component after it has already been allocated and
   * attached to the DOM. Reconciles the root DOM node, then recurses.
   *
   * @param {ReactReconcileTransaction} transaction
   * @param {ReactElement} prevElement
   * @param {ReactElement} nextElement
   * @internal
   * @overridable
   */
  updateComponent: function(transaction, prevElement, nextElement, context) {
    assertValidProps(this._currentElement.props);
    this._updateDOMProperties(prevElement.props, transaction);
    this._updateDOMChildren(prevElement.props, transaction, context);
  },

  /**
   * Reconciles the properties by detecting differences in property values and
   * updating the DOM as necessary. This function is probably the single most
   * critical path for performance optimization.
   *
   * TODO: Benchmark whether checking for changed values in memory actually
   *       improves performance (especially statically positioned elements).
   * TODO: Benchmark the effects of putting this at the top since 99% of props
   *       do not change for a given reconciliation.
   * TODO: Benchmark areas that can be improved with caching.
   *
   * @private
   * @param {object} lastProps
   * @param {ReactReconcileTransaction} transaction
   */
  _updateDOMProperties: function(lastProps, transaction) {
    var nextProps = this._currentElement.props;
    var propKey;
    var styleName;
    var styleUpdates;
    for (propKey in lastProps) {
      if (nextProps.hasOwnProperty(propKey) ||
         !lastProps.hasOwnProperty(propKey)) {
        continue;
      }
      if (propKey === STYLE) {
        var lastStyle = this._previousStyleCopy;
        for (styleName in lastStyle) {
          if (lastStyle.hasOwnProperty(styleName)) {
            styleUpdates = styleUpdates || {};
            styleUpdates[styleName] = '';
          }
        }
        this._previousStyleCopy = null;
      } else if (registrationNameModules.hasOwnProperty(propKey)) {
        deleteListener(this._rootNodeID, propKey);
      } else if (
          DOMProperty.isStandardName[propKey] ||
          DOMProperty.isCustomAttribute(propKey)) {
        BackendIDOperations.deletePropertyByID(
          this._rootNodeID,
          propKey
        );
      }
    }
    for (propKey in nextProps) {
      var nextProp = nextProps[propKey];
      var lastProp = propKey === STYLE ?
        this._previousStyleCopy :
        lastProps[propKey];
      if (!nextProps.hasOwnProperty(propKey) || nextProp === lastProp) {
        continue;
      }
      if (propKey === STYLE) {
        if (nextProp) {
          nextProp = this._previousStyleCopy = assign({}, nextProp);
        } else {
          this._previousStyleCopy = null;
        }
        if (lastProp) {
          // Unset styles on `lastProp` but not on `nextProp`.
          for (styleName in lastProp) {
            if (lastProp.hasOwnProperty(styleName) &&
                (!nextProp || !nextProp.hasOwnProperty(styleName))) {
              styleUpdates = styleUpdates || {};
              styleUpdates[styleName] = '';
            }
          }
          // Update styles that changed since `lastProp`.
          for (styleName in nextProp) {
            if (nextProp.hasOwnProperty(styleName) &&
                lastProp[styleName] !== nextProp[styleName]) {
              styleUpdates = styleUpdates || {};
              styleUpdates[styleName] = nextProp[styleName];
            }
          }
        } else {
          // Relies on `updateStylesByID` not mutating `styleUpdates`.
          styleUpdates = nextProp;
        }
      } else if (registrationNameModules.hasOwnProperty(propKey)) {
        putListener(this._rootNodeID, propKey, nextProp, transaction);
      } else if (
          DOMProperty.isStandardName[propKey] ||
          DOMProperty.isCustomAttribute(propKey)) {
        BackendIDOperations.updatePropertyByID(
          this._rootNodeID,
          propKey,
          nextProp
        );
      }
    }
    if (styleUpdates) {
      BackendIDOperations.updateStylesByID(
        this._rootNodeID,
        styleUpdates
      );
    }
  },

  /**
   * Reconciles the children with the various properties that affect the
   * children content.
   *
   * @param {object} lastProps
   * @param {ReactReconcileTransaction} transaction
   */
  _updateDOMChildren: function(lastProps, transaction, context) {
    var nextProps = this._currentElement.props;

    var lastContent =
      CONTENT_TYPES[typeof lastProps.children] ? lastProps.children : null;
    var nextContent =
      CONTENT_TYPES[typeof nextProps.children] ? nextProps.children : null;

    var lastHtml =
      lastProps.dangerouslySetInnerHTML &&
      lastProps.dangerouslySetInnerHTML.__html;
    var nextHtml =
      nextProps.dangerouslySetInnerHTML &&
      nextProps.dangerouslySetInnerHTML.__html;

    // Note the use of `!=` which checks for null or undefined.
    var lastChildren = lastContent != null ? null : lastProps.children;
    var nextChildren = nextContent != null ? null : nextProps.children;

    // If we're switching from children to content/html or vice versa, remove
    // the old content
    var lastHasContentOrHtml = lastContent != null || lastHtml != null;
    var nextHasContentOrHtml = nextContent != null || nextHtml != null;
    if (lastChildren != null && nextChildren == null) {
      this.updateChildren(null, transaction, context);
    } else if (lastHasContentOrHtml && !nextHasContentOrHtml) {
      this.updateTextContent('');
    }

    if (nextContent != null) {
      if (lastContent !== nextContent) {
        this.updateTextContent('' + nextContent);
      }
    } else if (nextHtml != null) {
      if (lastHtml !== nextHtml) {
        BackendIDOperations.updateInnerHTMLByID(
          this._rootNodeID,
          nextHtml
        );
      }
    } else if (nextChildren != null) {
      this.updateChildren(nextChildren, transaction, context);
    }
  },

  /**
   * Destroys all event registrations for this instance. Does not remove from
   * the DOM. That must be done by the parent.
   *
   * @internal
   */
  unmountComponent: function() {
    this.unmountChildren();
    ReactBrowserEventEmitter.deleteAllListeners(this._rootNodeID);
    ReactComponentBrowserEnvironment.unmountIDFromEnvironment(this._rootNodeID);
    this._rootNodeID = null;
  }

};

ReactPerf.measureMethods(ReactDOMComponent, 'ReactDOMComponent', {
  mountComponent: 'mountComponent',
  updateComponent: 'updateComponent'
});

assign(
  ReactDOMComponent.prototype,
  ReactDOMComponent.Mixin,
  ReactMultiChild.Mixin
);

ReactDOMComponent.injection = {
  injectIDOperations: function(IDOperations) {
    ReactDOMComponent.BackendIDOperations = BackendIDOperations = IDOperations;
  }
};

module.exports = ReactDOMComponent;

}).call(this,require('_process'))
},{"./CSSPropertyOperations":11,"./DOMProperty":16,"./DOMPropertyOperations":17,"./Object.assign":33,"./ReactBrowserEventEmitter":37,"./ReactComponentBrowserEnvironment":42,"./ReactMount":77,"./ReactMultiChild":78,"./ReactPerf":82,"./escapeTextContentForBrowser":123,"./invariant":142,"./isEventSupported":143,"./keyOf":148,"./warning":161,"_process":6}],50:[function(require,module,exports){
/**
 * Copyright 2013-2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule ReactDOMForm
 */

'use strict';

var EventConstants = require("./EventConstants");
var LocalEventTrapMixin = require("./LocalEventTrapMixin");
var ReactBrowserComponentMixin = require("./ReactBrowserComponentMixin");
var ReactClass = require("./ReactClass");
var ReactElement = require("./ReactElement");

var form = ReactElement.createFactory('form');

/**
 * Since onSubmit doesn't bubble OR capture on the top level in IE8, we need
 * to capture it on the <form> element itself. There are lots of hacks we could
 * do to accomplish this, but the most reliable is to make <form> a
 * composite component and use `componentDidMount` to attach the event handlers.
 */
var ReactDOMForm = ReactClass.createClass({
  displayName: 'ReactDOMForm',
  tagName: 'FORM',

  mixins: [ReactBrowserComponentMixin, LocalEventTrapMixin],

  render: function() {
    // TODO: Instead of using `ReactDOM` directly, we should use JSX. However,
    // `jshint` fails to parse JSX so in order for linting to work in the open
    // source repo, we need to just use `ReactDOM.form`.
    return form(this.props);
  },

  componentDidMount: function() {
    this.trapBubbledEvent(EventConstants.topLevelTypes.topReset, 'reset');
    this.trapBubbledEvent(EventConstants.topLevelTypes.topSubmit, 'submit');
  }
});

module.exports = ReactDOMForm;

},{"./EventConstants":21,"./LocalEventTrapMixin":31,"./ReactBrowserComponentMixin":36,"./ReactClass":40,"./ReactElement":64}],51:[function(require,module,exports){
(function (process){
/**
 * Copyright 2013-2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule ReactDOMIDOperations
 * @typechecks static-only
 */

/*jslint evil: true */

'use strict';

var CSSPropertyOperations = require("./CSSPropertyOperations");
var DOMChildrenOperations = require("./DOMChildrenOperations");
var DOMPropertyOperations = require("./DOMPropertyOperations");
var ReactMount = require("./ReactMount");
var ReactPerf = require("./ReactPerf");

var invariant = require("./invariant");
var setInnerHTML = require("./setInnerHTML");

/**
 * Errors for properties that should not be updated with `updatePropertyById()`.
 *
 * @type {object}
 * @private
 */
var INVALID_PROPERTY_ERRORS = {
  dangerouslySetInnerHTML:
    '`dangerouslySetInnerHTML` must be set using `updateInnerHTMLByID()`.',
  style: '`style` must be set using `updateStylesByID()`.'
};

/**
 * Operations used to process updates to DOM nodes. This is made injectable via
 * `ReactDOMComponent.BackendIDOperations`.
 */
var ReactDOMIDOperations = {

  /**
   * Updates a DOM node with new property values. This should only be used to
   * update DOM properties in `DOMProperty`.
   *
   * @param {string} id ID of the node to update.
   * @param {string} name A valid property name, see `DOMProperty`.
   * @param {*} value New value of the property.
   * @internal
   */
  updatePropertyByID: function(id, name, value) {
    var node = ReactMount.getNode(id);
    ("production" !== process.env.NODE_ENV ? invariant(
      !INVALID_PROPERTY_ERRORS.hasOwnProperty(name),
      'updatePropertyByID(...): %s',
      INVALID_PROPERTY_ERRORS[name]
    ) : invariant(!INVALID_PROPERTY_ERRORS.hasOwnProperty(name)));

    // If we're updating to null or undefined, we should remove the property
    // from the DOM node instead of inadvertantly setting to a string. This
    // brings us in line with the same behavior we have on initial render.
    if (value != null) {
      DOMPropertyOperations.setValueForProperty(node, name, value);
    } else {
      DOMPropertyOperations.deleteValueForProperty(node, name);
    }
  },

  /**
   * Updates a DOM node to remove a property. This should only be used to remove
   * DOM properties in `DOMProperty`.
   *
   * @param {string} id ID of the node to update.
   * @param {string} name A property name to remove, see `DOMProperty`.
   * @internal
   */
  deletePropertyByID: function(id, name, value) {
    var node = ReactMount.getNode(id);
    ("production" !== process.env.NODE_ENV ? invariant(
      !INVALID_PROPERTY_ERRORS.hasOwnProperty(name),
      'updatePropertyByID(...): %s',
      INVALID_PROPERTY_ERRORS[name]
    ) : invariant(!INVALID_PROPERTY_ERRORS.hasOwnProperty(name)));
    DOMPropertyOperations.deleteValueForProperty(node, name, value);
  },

  /**
   * Updates a DOM node with new style values. If a value is specified as '',
   * the corresponding style property will be unset.
   *
   * @param {string} id ID of the node to update.
   * @param {object} styles Mapping from styles to values.
   * @internal
   */
  updateStylesByID: function(id, styles) {
    var node = ReactMount.getNode(id);
    CSSPropertyOperations.setValueForStyles(node, styles);
  },

  /**
   * Updates a DOM node's innerHTML.
   *
   * @param {string} id ID of the node to update.
   * @param {string} html An HTML string.
   * @internal
   */
  updateInnerHTMLByID: function(id, html) {
    var node = ReactMount.getNode(id);
    setInnerHTML(node, html);
  },

  /**
   * Updates a DOM node's text content set by `props.content`.
   *
   * @param {string} id ID of the node to update.
   * @param {string} content Text content.
   * @internal
   */
  updateTextContentByID: function(id, content) {
    var node = ReactMount.getNode(id);
    DOMChildrenOperations.updateTextContent(node, content);
  },

  /**
   * Replaces a DOM node that exists in the document with markup.
   *
   * @param {string} id ID of child to be replaced.
   * @param {string} markup Dangerous markup to inject in place of child.
   * @internal
   * @see {Danger.dangerouslyReplaceNodeWithMarkup}
   */
  dangerouslyReplaceNodeWithMarkupByID: function(id, markup) {
    var node = ReactMount.getNode(id);
    DOMChildrenOperations.dangerouslyReplaceNodeWithMarkup(node, markup);
  },

  /**
   * Updates a component's children by processing a series of updates.
   *
   * @param {array<object>} updates List of update configurations.
   * @param {array<string>} markup List of markup strings.
   * @internal
   */
  dangerouslyProcessChildrenUpdates: function(updates, markup) {
    for (var i = 0; i < updates.length; i++) {
      updates[i].parentNode = ReactMount.getNode(updates[i].parentID);
    }
    DOMChildrenOperations.processUpdates(updates, markup);
  }
};

ReactPerf.measureMethods(ReactDOMIDOperations, 'ReactDOMIDOperations', {
  updatePropertyByID: 'updatePropertyByID',
  deletePropertyByID: 'deletePropertyByID',
  updateStylesByID: 'updateStylesByID',
  updateInnerHTMLByID: 'updateInnerHTMLByID',
  updateTextContentByID: 'updateTextContentByID',
  dangerouslyReplaceNodeWithMarkupByID: 'dangerouslyReplaceNodeWithMarkupByID',
  dangerouslyProcessChildrenUpdates: 'dangerouslyProcessChildrenUpdates'
});

module.exports = ReactDOMIDOperations;

}).call(this,require('_process'))
},{"./CSSPropertyOperations":11,"./DOMChildrenOperations":15,"./DOMPropertyOperations":17,"./ReactMount":77,"./ReactPerf":82,"./invariant":142,"./setInnerHTML":155,"_process":6}],52:[function(require,module,exports){
/**
 * Copyright 2013-2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule ReactDOMIframe
 */

'use strict';

var EventConstants = require("./EventConstants");
var LocalEventTrapMixin = require("./LocalEventTrapMixin");
var ReactBrowserComponentMixin = require("./ReactBrowserComponentMixin");
var ReactClass = require("./ReactClass");
var ReactElement = require("./ReactElement");

var iframe = ReactElement.createFactory('iframe');

/**
 * Since onLoad doesn't bubble OR capture on the top level in IE8, we need to
 * capture it on the <iframe> element itself. There are lots of hacks we could
 * do to accomplish this, but the most reliable is to make <iframe> a composite
 * component and use `componentDidMount` to attach the event handlers.
 */
var ReactDOMIframe = ReactClass.createClass({
  displayName: 'ReactDOMIframe',
  tagName: 'IFRAME',

  mixins: [ReactBrowserComponentMixin, LocalEventTrapMixin],

  render: function() {
    return iframe(this.props);
  },

  componentDidMount: function() {
    this.trapBubbledEvent(EventConstants.topLevelTypes.topLoad, 'load');
  }
});

module.exports = ReactDOMIframe;

},{"./EventConstants":21,"./LocalEventTrapMixin":31,"./ReactBrowserComponentMixin":36,"./ReactClass":40,"./ReactElement":64}],53:[function(require,module,exports){
/**
 * Copyright 2013-2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule ReactDOMImg
 */

'use strict';

var EventConstants = require("./EventConstants");
var LocalEventTrapMixin = require("./LocalEventTrapMixin");
var ReactBrowserComponentMixin = require("./ReactBrowserComponentMixin");
var ReactClass = require("./ReactClass");
var ReactElement = require("./ReactElement");

var img = ReactElement.createFactory('img');

/**
 * Since onLoad doesn't bubble OR capture on the top level in IE8, we need to
 * capture it on the <img> element itself. There are lots of hacks we could do
 * to accomplish this, but the most reliable is to make <img> a composite
 * component and use `componentDidMount` to attach the event handlers.
 */
var ReactDOMImg = ReactClass.createClass({
  displayName: 'ReactDOMImg',
  tagName: 'IMG',

  mixins: [ReactBrowserComponentMixin, LocalEventTrapMixin],

  render: function() {
    return img(this.props);
  },

  componentDidMount: function() {
    this.trapBubbledEvent(EventConstants.topLevelTypes.topLoad, 'load');
    this.trapBubbledEvent(EventConstants.topLevelTypes.topError, 'error');
  }
});

module.exports = ReactDOMImg;

},{"./EventConstants":21,"./LocalEventTrapMixin":31,"./ReactBrowserComponentMixin":36,"./ReactClass":40,"./ReactElement":64}],54:[function(require,module,exports){
(function (process){
/**
 * Copyright 2013-2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule ReactDOMInput
 */

'use strict';

var AutoFocusMixin = require("./AutoFocusMixin");
var DOMPropertyOperations = require("./DOMPropertyOperations");
var LinkedValueUtils = require("./LinkedValueUtils");
var ReactBrowserComponentMixin = require("./ReactBrowserComponentMixin");
var ReactClass = require("./ReactClass");
var ReactElement = require("./ReactElement");
var ReactMount = require("./ReactMount");
var ReactUpdates = require("./ReactUpdates");

var assign = require("./Object.assign");
var invariant = require("./invariant");

var input = ReactElement.createFactory('input');

var instancesByReactID = {};

function forceUpdateIfMounted() {
  /*jshint validthis:true */
  if (this.isMounted()) {
    this.forceUpdate();
  }
}

/**
 * Implements an <input> native component that allows setting these optional
 * props: `checked`, `value`, `defaultChecked`, and `defaultValue`.
 *
 * If `checked` or `value` are not supplied (or null/undefined), user actions
 * that affect the checked state or value will trigger updates to the element.
 *
 * If they are supplied (and not null/undefined), the rendered element will not
 * trigger updates to the element. Instead, the props must change in order for
 * the rendered element to be updated.
 *
 * The rendered element will be initialized as unchecked (or `defaultChecked`)
 * with an empty value (or `defaultValue`).
 *
 * @see http://www.w3.org/TR/2012/WD-html5-20121025/the-input-element.html
 */
var ReactDOMInput = ReactClass.createClass({
  displayName: 'ReactDOMInput',
  tagName: 'INPUT',

  mixins: [AutoFocusMixin, LinkedValueUtils.Mixin, ReactBrowserComponentMixin],

  getInitialState: function() {
    var defaultValue = this.props.defaultValue;
    return {
      initialChecked: this.props.defaultChecked || false,
      initialValue: defaultValue != null ? defaultValue : null
    };
  },

  render: function() {
    // Clone `this.props` so we don't mutate the input.
    var props = assign({}, this.props);

    props.defaultChecked = null;
    props.defaultValue = null;

    var value = LinkedValueUtils.getValue(this);
    props.value = value != null ? value : this.state.initialValue;

    var checked = LinkedValueUtils.getChecked(this);
    props.checked = checked != null ? checked : this.state.initialChecked;

    props.onChange = this._handleChange;

    return input(props, this.props.children);
  },

  componentDidMount: function() {
    var id = ReactMount.getID(this.getDOMNode());
    instancesByReactID[id] = this;
  },

  componentWillUnmount: function() {
    var rootNode = this.getDOMNode();
    var id = ReactMount.getID(rootNode);
    delete instancesByReactID[id];
  },

  componentDidUpdate: function(prevProps, prevState, prevContext) {
    var rootNode = this.getDOMNode();
    if (this.props.checked != null) {
      DOMPropertyOperations.setValueForProperty(
        rootNode,
        'checked',
        this.props.checked || false
      );
    }

    var value = LinkedValueUtils.getValue(this);
    if (value != null) {
      // Cast `value` to a string to ensure the value is set correctly. While
      // browsers typically do this as necessary, jsdom doesn't.
      DOMPropertyOperations.setValueForProperty(rootNode, 'value', '' + value);
    }
  },

  _handleChange: function(event) {
    var returnValue;
    var onChange = LinkedValueUtils.getOnChange(this);
    if (onChange) {
      returnValue = onChange.call(this, event);
    }
    // Here we use asap to wait until all updates have propagated, which
    // is important when using controlled components within layers:
    // https://github.com/facebook/react/issues/1698
    ReactUpdates.asap(forceUpdateIfMounted, this);

    var name = this.props.name;
    if (this.props.type === 'radio' && name != null) {
      var rootNode = this.getDOMNode();
      var queryRoot = rootNode;

      while (queryRoot.parentNode) {
        queryRoot = queryRoot.parentNode;
      }

      // If `rootNode.form` was non-null, then we could try `form.elements`,
      // but that sometimes behaves strangely in IE8. We could also try using
      // `form.getElementsByName`, but that will only return direct children
      // and won't include inputs that use the HTML5 `form=` attribute. Since
      // the input might not even be in a form, let's just use the global
      // `querySelectorAll` to ensure we don't miss anything.
      var group = queryRoot.querySelectorAll(
        'input[name=' + JSON.stringify('' + name) + '][type="radio"]');

      for (var i = 0, groupLen = group.length; i < groupLen; i++) {
        var otherNode = group[i];
        if (otherNode === rootNode ||
            otherNode.form !== rootNode.form) {
          continue;
        }
        var otherID = ReactMount.getID(otherNode);
        ("production" !== process.env.NODE_ENV ? invariant(
          otherID,
          'ReactDOMInput: Mixing React and non-React radio inputs with the ' +
          'same `name` is not supported.'
        ) : invariant(otherID));
        var otherInstance = instancesByReactID[otherID];
        ("production" !== process.env.NODE_ENV ? invariant(
          otherInstance,
          'ReactDOMInput: Unknown radio button ID %s.',
          otherID
        ) : invariant(otherInstance));
        // If this is a controlled radio button group, forcing the input that
        // was previously checked to update will cause it to be come re-checked
        // as appropriate.
        ReactUpdates.asap(forceUpdateIfMounted, otherInstance);
      }
    }

    return returnValue;
  }

});

module.exports = ReactDOMInput;

}).call(this,require('_process'))
},{"./AutoFocusMixin":8,"./DOMPropertyOperations":17,"./LinkedValueUtils":30,"./Object.assign":33,"./ReactBrowserComponentMixin":36,"./ReactClass":40,"./ReactElement":64,"./ReactMount":77,"./ReactUpdates":94,"./invariant":142,"_process":6}],55:[function(require,module,exports){
(function (process){
/**
 * Copyright 2013-2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule ReactDOMOption
 */

'use strict';

var ReactBrowserComponentMixin = require("./ReactBrowserComponentMixin");
var ReactClass = require("./ReactClass");
var ReactElement = require("./ReactElement");

var warning = require("./warning");

var option = ReactElement.createFactory('option');

/**
 * Implements an <option> native component that warns when `selected` is set.
 */
var ReactDOMOption = ReactClass.createClass({
  displayName: 'ReactDOMOption',
  tagName: 'OPTION',

  mixins: [ReactBrowserComponentMixin],

  componentWillMount: function() {
    // TODO (yungsters): Remove support for `selected` in <option>.
    if ("production" !== process.env.NODE_ENV) {
      ("production" !== process.env.NODE_ENV ? warning(
        this.props.selected == null,
        'Use the `defaultValue` or `value` props on <select> instead of ' +
        'setting `selected` on <option>.'
      ) : null);
    }
  },

  render: function() {
    return option(this.props, this.props.children);
  }

});

module.exports = ReactDOMOption;

}).call(this,require('_process'))
},{"./ReactBrowserComponentMixin":36,"./ReactClass":40,"./ReactElement":64,"./warning":161,"_process":6}],56:[function(require,module,exports){
/**
 * Copyright 2013-2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule ReactDOMSelect
 */

'use strict';

var AutoFocusMixin = require("./AutoFocusMixin");
var LinkedValueUtils = require("./LinkedValueUtils");
var ReactBrowserComponentMixin = require("./ReactBrowserComponentMixin");
var ReactClass = require("./ReactClass");
var ReactElement = require("./ReactElement");
var ReactUpdates = require("./ReactUpdates");

var assign = require("./Object.assign");

var select = ReactElement.createFactory('select');

function updateOptionsIfPendingUpdateAndMounted() {
  /*jshint validthis:true */
  if (this._pendingUpdate) {
    this._pendingUpdate = false;
    var value = LinkedValueUtils.getValue(this);
    if (value != null && this.isMounted()) {
      updateOptions(this, value);
    }
  }
}

/**
 * Validation function for `value` and `defaultValue`.
 * @private
 */
function selectValueType(props, propName, componentName) {
  if (props[propName] == null) {
    return null;
  }
  if (props.multiple) {
    if (!Array.isArray(props[propName])) {
      return new Error(
        ("The `" + propName + "` prop supplied to <select> must be an array if ") +
        ("`multiple` is true.")
      );
    }
  } else {
    if (Array.isArray(props[propName])) {
      return new Error(
        ("The `" + propName + "` prop supplied to <select> must be a scalar ") +
        ("value if `multiple` is false.")
      );
    }
  }
}

/**
 * @param {ReactComponent} component Instance of ReactDOMSelect
 * @param {*} propValue A stringable (with `multiple`, a list of stringables).
 * @private
 */
function updateOptions(component, propValue) {
  var selectedValue, i, l;
  var options = component.getDOMNode().options;

  if (component.props.multiple) {
    selectedValue = {};
    for (i = 0, l = propValue.length; i < l; i++) {
      selectedValue['' + propValue[i]] = true;
    }
    for (i = 0, l = options.length; i < l; i++) {
      var selected = selectedValue.hasOwnProperty(options[i].value);
      if (options[i].selected !== selected) {
        options[i].selected = selected;
      }
    }
  } else {
    // Do not set `select.value` as exact behavior isn't consistent across all
    // browsers for all cases.
    selectedValue = '' + propValue;
    for (i = 0, l = options.length; i < l; i++) {
      if (options[i].value === selectedValue) {
        options[i].selected = true;
        return;
      }
    }
    if (options.length) {
      options[0].selected = true;
    }
  }
}

/**
 * Implements a <select> native component that allows optionally setting the
 * props `value` and `defaultValue`. If `multiple` is false, the prop must be a
 * stringable. If `multiple` is true, the prop must be an array of stringables.
 *
 * If `value` is not supplied (or null/undefined), user actions that change the
 * selected option will trigger updates to the rendered options.
 *
 * If it is supplied (and not null/undefined), the rendered options will not
 * update in response to user actions. Instead, the `value` prop must change in
 * order for the rendered options to update.
 *
 * If `defaultValue` is provided, any options with the supplied values will be
 * selected.
 */
var ReactDOMSelect = ReactClass.createClass({
  displayName: 'ReactDOMSelect',
  tagName: 'SELECT',

  mixins: [AutoFocusMixin, LinkedValueUtils.Mixin, ReactBrowserComponentMixin],

  propTypes: {
    defaultValue: selectValueType,
    value: selectValueType
  },

  render: function() {
    // Clone `this.props` so we don't mutate the input.
    var props = assign({}, this.props);

    props.onChange = this._handleChange;
    props.value = null;

    return select(props, this.props.children);
  },

  componentWillMount: function() {
    this._pendingUpdate = false;
  },

  componentDidMount: function() {
    var value = LinkedValueUtils.getValue(this);
    if (value != null) {
      updateOptions(this, value);
    } else if (this.props.defaultValue != null) {
      updateOptions(this, this.props.defaultValue);
    }
  },

  componentDidUpdate: function(prevProps) {
    var value = LinkedValueUtils.getValue(this);
    if (value != null) {
      this._pendingUpdate = false;
      updateOptions(this, value);
    } else if (!prevProps.multiple !== !this.props.multiple) {
      // For simplicity, reapply `defaultValue` if `multiple` is toggled.
      if (this.props.defaultValue != null) {
        updateOptions(this, this.props.defaultValue);
      } else {
        // Revert the select back to its default unselected state.
        updateOptions(this, this.props.multiple ? [] : '');
      }
    }
  },

  _handleChange: function(event) {
    var returnValue;
    var onChange = LinkedValueUtils.getOnChange(this);
    if (onChange) {
      returnValue = onChange.call(this, event);
    }

    this._pendingUpdate = true;
    ReactUpdates.asap(updateOptionsIfPendingUpdateAndMounted, this);
    return returnValue;
  }

});

module.exports = ReactDOMSelect;

},{"./AutoFocusMixin":8,"./LinkedValueUtils":30,"./Object.assign":33,"./ReactBrowserComponentMixin":36,"./ReactClass":40,"./ReactElement":64,"./ReactUpdates":94}],57:[function(require,module,exports){
/**
 * Copyright 2013-2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule ReactDOMSelection
 */

'use strict';

var ExecutionEnvironment = require("./ExecutionEnvironment");

var getNodeForCharacterOffset = require("./getNodeForCharacterOffset");
var getTextContentAccessor = require("./getTextContentAccessor");

/**
 * While `isCollapsed` is available on the Selection object and `collapsed`
 * is available on the Range object, IE11 sometimes gets them wrong.
 * If the anchor/focus nodes and offsets are the same, the range is collapsed.
 */
function isCollapsed(anchorNode, anchorOffset, focusNode, focusOffset) {
  return anchorNode === focusNode && anchorOffset === focusOffset;
}

/**
 * Get the appropriate anchor and focus node/offset pairs for IE.
 *
 * The catch here is that IE's selection API doesn't provide information
 * about whether the selection is forward or backward, so we have to
 * behave as though it's always forward.
 *
 * IE text differs from modern selection in that it behaves as though
 * block elements end with a new line. This means character offsets will
 * differ between the two APIs.
 *
 * @param {DOMElement} node
 * @return {object}
 */
function getIEOffsets(node) {
  var selection = document.selection;
  var selectedRange = selection.createRange();
  var selectedLength = selectedRange.text.length;

  // Duplicate selection so we can move range without breaking user selection.
  var fromStart = selectedRange.duplicate();
  fromStart.moveToElementText(node);
  fromStart.setEndPoint('EndToStart', selectedRange);

  var startOffset = fromStart.text.length;
  var endOffset = startOffset + selectedLength;

  return {
    start: startOffset,
    end: endOffset
  };
}

/**
 * @param {DOMElement} node
 * @return {?object}
 */
function getModernOffsets(node) {
  var selection = window.getSelection && window.getSelection();

  if (!selection || selection.rangeCount === 0) {
    return null;
  }

  var anchorNode = selection.anchorNode;
  var anchorOffset = selection.anchorOffset;
  var focusNode = selection.focusNode;
  var focusOffset = selection.focusOffset;

  var currentRange = selection.getRangeAt(0);

  // If the node and offset values are the same, the selection is collapsed.
  // `Selection.isCollapsed` is available natively, but IE sometimes gets
  // this value wrong.
  var isSelectionCollapsed = isCollapsed(
    selection.anchorNode,
    selection.anchorOffset,
    selection.focusNode,
    selection.focusOffset
  );

  var rangeLength = isSelectionCollapsed ? 0 : currentRange.toString().length;

  var tempRange = currentRange.cloneRange();
  tempRange.selectNodeContents(node);
  tempRange.setEnd(currentRange.startContainer, currentRange.startOffset);

  var isTempRangeCollapsed = isCollapsed(
    tempRange.startContainer,
    tempRange.startOffset,
    tempRange.endContainer,
    tempRange.endOffset
  );

  var start = isTempRangeCollapsed ? 0 : tempRange.toString().length;
  var end = start + rangeLength;

  // Detect whether the selection is backward.
  var detectionRange = document.createRange();
  detectionRange.setStart(anchorNode, anchorOffset);
  detectionRange.setEnd(focusNode, focusOffset);
  var isBackward = detectionRange.collapsed;

  return {
    start: isBackward ? end : start,
    end: isBackward ? start : end
  };
}

/**
 * @param {DOMElement|DOMTextNode} node
 * @param {object} offsets
 */
function setIEOffsets(node, offsets) {
  var range = document.selection.createRange().duplicate();
  var start, end;

  if (typeof offsets.end === 'undefined') {
    start = offsets.start;
    end = start;
  } else if (offsets.start > offsets.end) {
    start = offsets.end;
    end = offsets.start;
  } else {
    start = offsets.start;
    end = offsets.end;
  }

  range.moveToElementText(node);
  range.moveStart('character', start);
  range.setEndPoint('EndToStart', range);
  range.moveEnd('character', end - start);
  range.select();
}

/**
 * In modern non-IE browsers, we can support both forward and backward
 * selections.
 *
 * Note: IE10+ supports the Selection object, but it does not support
 * the `extend` method, which means that even in modern IE, it's not possible
 * to programatically create a backward selection. Thus, for all IE
 * versions, we use the old IE API to create our selections.
 *
 * @param {DOMElement|DOMTextNode} node
 * @param {object} offsets
 */
function setModernOffsets(node, offsets) {
  if (!window.getSelection) {
    return;
  }

  var selection = window.getSelection();
  var length = node[getTextContentAccessor()].length;
  var start = Math.min(offsets.start, length);
  var end = typeof offsets.end === 'undefined' ?
            start : Math.min(offsets.end, length);

  // IE 11 uses modern selection, but doesn't support the extend method.
  // Flip backward selections, so we can set with a single range.
  if (!selection.extend && start > end) {
    var temp = end;
    end = start;
    start = temp;
  }

  var startMarker = getNodeForCharacterOffset(node, start);
  var endMarker = getNodeForCharacterOffset(node, end);

  if (startMarker && endMarker) {
    var range = document.createRange();
    range.setStart(startMarker.node, startMarker.offset);
    selection.removeAllRanges();

    if (start > end) {
      selection.addRange(range);
      selection.extend(endMarker.node, endMarker.offset);
    } else {
      range.setEnd(endMarker.node, endMarker.offset);
      selection.addRange(range);
    }
  }
}

var useIEOffsets = (
  ExecutionEnvironment.canUseDOM &&
  'selection' in document &&
  !('getSelection' in window)
);

var ReactDOMSelection = {
  /**
   * @param {DOMElement} node
   */
  getOffsets: useIEOffsets ? getIEOffsets : getModernOffsets,

  /**
   * @param {DOMElement|DOMTextNode} node
   * @param {object} offsets
   */
  setOffsets: useIEOffsets ? setIEOffsets : setModernOffsets
};

module.exports = ReactDOMSelection;

},{"./ExecutionEnvironment":27,"./getNodeForCharacterOffset":135,"./getTextContentAccessor":137}],58:[function(require,module,exports){
/**
 * Copyright 2013-2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule ReactDOMTextComponent
 * @typechecks static-only
 */

'use strict';

var DOMPropertyOperations = require("./DOMPropertyOperations");
var ReactComponentBrowserEnvironment =
  require("./ReactComponentBrowserEnvironment");
var ReactDOMComponent = require("./ReactDOMComponent");

var assign = require("./Object.assign");
var escapeTextContentForBrowser = require("./escapeTextContentForBrowser");

/**
 * Text nodes violate a couple assumptions that React makes about components:
 *
 *  - When mounting text into the DOM, adjacent text nodes are merged.
 *  - Text nodes cannot be assigned a React root ID.
 *
 * This component is used to wrap strings in elements so that they can undergo
 * the same reconciliation that is applied to elements.
 *
 * TODO: Investigate representing React components in the DOM with text nodes.
 *
 * @class ReactDOMTextComponent
 * @extends ReactComponent
 * @internal
 */
var ReactDOMTextComponent = function(props) {
  // This constructor and its argument is currently used by mocks.
};

assign(ReactDOMTextComponent.prototype, {

  /**
   * @param {ReactText} text
   * @internal
   */
  construct: function(text) {
    // TODO: This is really a ReactText (ReactNode), not a ReactElement
    this._currentElement = text;
    this._stringText = '' + text;

    // Properties
    this._rootNodeID = null;
    this._mountIndex = 0;
  },

  /**
   * Creates the markup for this text node. This node is not intended to have
   * any features besides containing text content.
   *
   * @param {string} rootID DOM ID of the root node.
   * @param {ReactReconcileTransaction|ReactServerRenderingTransaction} transaction
   * @return {string} Markup for this text node.
   * @internal
   */
  mountComponent: function(rootID, transaction, context) {
    this._rootNodeID = rootID;
    var escapedText = escapeTextContentForBrowser(this._stringText);

    if (transaction.renderToStaticMarkup) {
      // Normally we'd wrap this in a `span` for the reasons stated above, but
      // since this is a situation where React won't take over (static pages),
      // we can simply return the text as it is.
      return escapedText;
    }

    return (
      '<span ' + DOMPropertyOperations.createMarkupForID(rootID) + '>' +
        escapedText +
      '</span>'
    );
  },

  /**
   * Updates this component by updating the text content.
   *
   * @param {ReactText} nextText The next text content
   * @param {ReactReconcileTransaction} transaction
   * @internal
   */
  receiveComponent: function(nextText, transaction) {
    if (nextText !== this._currentElement) {
      this._currentElement = nextText;
      var nextStringText = '' + nextText;
      if (nextStringText !== this._stringText) {
        // TODO: Save this as pending props and use performUpdateIfNecessary
        // and/or updateComponent to do the actual update for consistency with
        // other component types?
        this._stringText = nextStringText;
        ReactDOMComponent.BackendIDOperations.updateTextContentByID(
          this._rootNodeID,
          nextStringText
        );
      }
    }
  },

  unmountComponent: function() {
    ReactComponentBrowserEnvironment.unmountIDFromEnvironment(this._rootNodeID);
  }

});

module.exports = ReactDOMTextComponent;

},{"./DOMPropertyOperations":17,"./Object.assign":33,"./ReactComponentBrowserEnvironment":42,"./ReactDOMComponent":49,"./escapeTextContentForBrowser":123}],59:[function(require,module,exports){
(function (process){
/**
 * Copyright 2013-2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule ReactDOMTextarea
 */

'use strict';

var AutoFocusMixin = require("./AutoFocusMixin");
var DOMPropertyOperations = require("./DOMPropertyOperations");
var LinkedValueUtils = require("./LinkedValueUtils");
var ReactBrowserComponentMixin = require("./ReactBrowserComponentMixin");
var ReactClass = require("./ReactClass");
var ReactElement = require("./ReactElement");
var ReactUpdates = require("./ReactUpdates");

var assign = require("./Object.assign");
var invariant = require("./invariant");

var warning = require("./warning");

var textarea = ReactElement.createFactory('textarea');

function forceUpdateIfMounted() {
  /*jshint validthis:true */
  if (this.isMounted()) {
    this.forceUpdate();
  }
}

/**
 * Implements a <textarea> native component that allows setting `value`, and
 * `defaultValue`. This differs from the traditional DOM API because value is
 * usually set as PCDATA children.
 *
 * If `value` is not supplied (or null/undefined), user actions that affect the
 * value will trigger updates to the element.
 *
 * If `value` is supplied (and not null/undefined), the rendered element will
 * not trigger updates to the element. Instead, the `value` prop must change in
 * order for the rendered element to be updated.
 *
 * The rendered element will be initialized with an empty value, the prop
 * `defaultValue` if specified, or the children content (deprecated).
 */
var ReactDOMTextarea = ReactClass.createClass({
  displayName: 'ReactDOMTextarea',
  tagName: 'TEXTAREA',

  mixins: [AutoFocusMixin, LinkedValueUtils.Mixin, ReactBrowserComponentMixin],

  getInitialState: function() {
    var defaultValue = this.props.defaultValue;
    // TODO (yungsters): Remove support for children content in <textarea>.
    var children = this.props.children;
    if (children != null) {
      if ("production" !== process.env.NODE_ENV) {
        ("production" !== process.env.NODE_ENV ? warning(
          false,
          'Use the `defaultValue` or `value` props instead of setting ' +
          'children on <textarea>.'
        ) : null);
      }
      ("production" !== process.env.NODE_ENV ? invariant(
        defaultValue == null,
        'If you supply `defaultValue` on a <textarea>, do not pass children.'
      ) : invariant(defaultValue == null));
      if (Array.isArray(children)) {
        ("production" !== process.env.NODE_ENV ? invariant(
          children.length <= 1,
          '<textarea> can only have at most one child.'
        ) : invariant(children.length <= 1));
        children = children[0];
      }

      defaultValue = '' + children;
    }
    if (defaultValue == null) {
      defaultValue = '';
    }
    var value = LinkedValueUtils.getValue(this);
    return {
      // We save the initial value so that `ReactDOMComponent` doesn't update
      // `textContent` (unnecessary since we update value).
      // The initial value can be a boolean or object so that's why it's
      // forced to be a string.
      initialValue: '' + (value != null ? value : defaultValue)
    };
  },

  render: function() {
    // Clone `this.props` so we don't mutate the input.
    var props = assign({}, this.props);

    ("production" !== process.env.NODE_ENV ? invariant(
      props.dangerouslySetInnerHTML == null,
      '`dangerouslySetInnerHTML` does not make sense on <textarea>.'
    ) : invariant(props.dangerouslySetInnerHTML == null));

    props.defaultValue = null;
    props.value = null;
    props.onChange = this._handleChange;

    // Always set children to the same thing. In IE9, the selection range will
    // get reset if `textContent` is mutated.
    return textarea(props, this.state.initialValue);
  },

  componentDidUpdate: function(prevProps, prevState, prevContext) {
    var value = LinkedValueUtils.getValue(this);
    if (value != null) {
      var rootNode = this.getDOMNode();
      // Cast `value` to a string to ensure the value is set correctly. While
      // browsers typically do this as necessary, jsdom doesn't.
      DOMPropertyOperations.setValueForProperty(rootNode, 'value', '' + value);
    }
  },

  _handleChange: function(event) {
    var returnValue;
    var onChange = LinkedValueUtils.getOnChange(this);
    if (onChange) {
      returnValue = onChange.call(this, event);
    }
    ReactUpdates.asap(forceUpdateIfMounted, this);
    return returnValue;
  }

});

module.exports = ReactDOMTextarea;

}).call(this,require('_process'))
},{"./AutoFocusMixin":8,"./DOMPropertyOperations":17,"./LinkedValueUtils":30,"./Object.assign":33,"./ReactBrowserComponentMixin":36,"./ReactClass":40,"./ReactElement":64,"./ReactUpdates":94,"./invariant":142,"./warning":161,"_process":6}],60:[function(require,module,exports){
/**
 * Copyright 2013-2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule ReactDefaultBatchingStrategy
 */

'use strict';

var ReactUpdates = require("./ReactUpdates");
var Transaction = require("./Transaction");

var assign = require("./Object.assign");
var emptyFunction = require("./emptyFunction");

var RESET_BATCHED_UPDATES = {
  initialize: emptyFunction,
  close: function() {
    ReactDefaultBatchingStrategy.isBatchingUpdates = false;
  }
};

var FLUSH_BATCHED_UPDATES = {
  initialize: emptyFunction,
  close: ReactUpdates.flushBatchedUpdates.bind(ReactUpdates)
};

var TRANSACTION_WRAPPERS = [FLUSH_BATCHED_UPDATES, RESET_BATCHED_UPDATES];

function ReactDefaultBatchingStrategyTransaction() {
  this.reinitializeTransaction();
}

assign(
  ReactDefaultBatchingStrategyTransaction.prototype,
  Transaction.Mixin,
  {
    getTransactionWrappers: function() {
      return TRANSACTION_WRAPPERS;
    }
  }
);

var transaction = new ReactDefaultBatchingStrategyTransaction();

var ReactDefaultBatchingStrategy = {
  isBatchingUpdates: false,

  /**
   * Call the provided function in a context within which calls to `setState`
   * and friends are batched such that components aren't updated unnecessarily.
   */
  batchedUpdates: function(callback, a, b, c, d) {
    var alreadyBatchingUpdates = ReactDefaultBatchingStrategy.isBatchingUpdates;

    ReactDefaultBatchingStrategy.isBatchingUpdates = true;

    // The code is written this way to avoid extra allocations
    if (alreadyBatchingUpdates) {
      callback(a, b, c, d);
    } else {
      transaction.perform(callback, null, a, b, c, d);
    }
  }
};

module.exports = ReactDefaultBatchingStrategy;

},{"./Object.assign":33,"./ReactUpdates":94,"./Transaction":110,"./emptyFunction":121}],61:[function(require,module,exports){
(function (process){
/**
 * Copyright 2013-2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule ReactDefaultInjection
 */

'use strict';

var BeforeInputEventPlugin = require("./BeforeInputEventPlugin");
var ChangeEventPlugin = require("./ChangeEventPlugin");
var ClientReactRootIndex = require("./ClientReactRootIndex");
var DefaultEventPluginOrder = require("./DefaultEventPluginOrder");
var EnterLeaveEventPlugin = require("./EnterLeaveEventPlugin");
var ExecutionEnvironment = require("./ExecutionEnvironment");
var HTMLDOMPropertyConfig = require("./HTMLDOMPropertyConfig");
var MobileSafariClickEventPlugin = require("./MobileSafariClickEventPlugin");
var ReactBrowserComponentMixin = require("./ReactBrowserComponentMixin");
var ReactClass = require("./ReactClass");
var ReactComponentBrowserEnvironment =
  require("./ReactComponentBrowserEnvironment");
var ReactDefaultBatchingStrategy = require("./ReactDefaultBatchingStrategy");
var ReactDOMComponent = require("./ReactDOMComponent");
var ReactDOMButton = require("./ReactDOMButton");
var ReactDOMForm = require("./ReactDOMForm");
var ReactDOMImg = require("./ReactDOMImg");
var ReactDOMIDOperations = require("./ReactDOMIDOperations");
var ReactDOMIframe = require("./ReactDOMIframe");
var ReactDOMInput = require("./ReactDOMInput");
var ReactDOMOption = require("./ReactDOMOption");
var ReactDOMSelect = require("./ReactDOMSelect");
var ReactDOMTextarea = require("./ReactDOMTextarea");
var ReactDOMTextComponent = require("./ReactDOMTextComponent");
var ReactElement = require("./ReactElement");
var ReactEventListener = require("./ReactEventListener");
var ReactInjection = require("./ReactInjection");
var ReactInstanceHandles = require("./ReactInstanceHandles");
var ReactMount = require("./ReactMount");
var ReactReconcileTransaction = require("./ReactReconcileTransaction");
var SelectEventPlugin = require("./SelectEventPlugin");
var ServerReactRootIndex = require("./ServerReactRootIndex");
var SimpleEventPlugin = require("./SimpleEventPlugin");
var SVGDOMPropertyConfig = require("./SVGDOMPropertyConfig");

var createFullPageComponent = require("./createFullPageComponent");

function autoGenerateWrapperClass(type) {
  return ReactClass.createClass({
    tagName: type.toUpperCase(),
    render: function() {
      return new ReactElement(
        type,
        null,
        null,
        null,
        null,
        this.props
      );
    }
  });
}

function inject() {
  ReactInjection.EventEmitter.injectReactEventListener(
    ReactEventListener
  );

  /**
   * Inject modules for resolving DOM hierarchy and plugin ordering.
   */
  ReactInjection.EventPluginHub.injectEventPluginOrder(DefaultEventPluginOrder);
  ReactInjection.EventPluginHub.injectInstanceHandle(ReactInstanceHandles);
  ReactInjection.EventPluginHub.injectMount(ReactMount);

  /**
   * Some important event plugins included by default (without having to require
   * them).
   */
  ReactInjection.EventPluginHub.injectEventPluginsByName({
    SimpleEventPlugin: SimpleEventPlugin,
    EnterLeaveEventPlugin: EnterLeaveEventPlugin,
    ChangeEventPlugin: ChangeEventPlugin,
    MobileSafariClickEventPlugin: MobileSafariClickEventPlugin,
    SelectEventPlugin: SelectEventPlugin,
    BeforeInputEventPlugin: BeforeInputEventPlugin
  });

  ReactInjection.NativeComponent.injectGenericComponentClass(
    ReactDOMComponent
  );

  ReactInjection.NativeComponent.injectTextComponentClass(
    ReactDOMTextComponent
  );

  ReactInjection.NativeComponent.injectAutoWrapper(
    autoGenerateWrapperClass
  );

  // This needs to happen before createFullPageComponent() otherwise the mixin
  // won't be included.
  ReactInjection.Class.injectMixin(ReactBrowserComponentMixin);

  ReactInjection.NativeComponent.injectComponentClasses({
    'button': ReactDOMButton,
    'form': ReactDOMForm,
    'iframe': ReactDOMIframe,
    'img': ReactDOMImg,
    'input': ReactDOMInput,
    'option': ReactDOMOption,
    'select': ReactDOMSelect,
    'textarea': ReactDOMTextarea,

    'html': createFullPageComponent('html'),
    'head': createFullPageComponent('head'),
    'body': createFullPageComponent('body')
  });

  ReactInjection.DOMProperty.injectDOMPropertyConfig(HTMLDOMPropertyConfig);
  ReactInjection.DOMProperty.injectDOMPropertyConfig(SVGDOMPropertyConfig);

  ReactInjection.EmptyComponent.injectEmptyComponent('noscript');

  ReactInjection.Updates.injectReconcileTransaction(
    ReactReconcileTransaction
  );
  ReactInjection.Updates.injectBatchingStrategy(
    ReactDefaultBatchingStrategy
  );

  ReactInjection.RootIndex.injectCreateReactRootIndex(
    ExecutionEnvironment.canUseDOM ?
      ClientReactRootIndex.createReactRootIndex :
      ServerReactRootIndex.createReactRootIndex
  );

  ReactInjection.Component.injectEnvironment(ReactComponentBrowserEnvironment);
  ReactInjection.DOMComponent.injectIDOperations(ReactDOMIDOperations);

  if ("production" !== process.env.NODE_ENV) {
    var url = (ExecutionEnvironment.canUseDOM && window.location.href) || '';
    if ((/[?&]react_perf\b/).test(url)) {
      var ReactDefaultPerf = require("./ReactDefaultPerf");
      ReactDefaultPerf.start();
    }
  }
}

module.exports = {
  inject: inject
};

}).call(this,require('_process'))
},{"./BeforeInputEventPlugin":9,"./ChangeEventPlugin":13,"./ClientReactRootIndex":14,"./DefaultEventPluginOrder":19,"./EnterLeaveEventPlugin":20,"./ExecutionEnvironment":27,"./HTMLDOMPropertyConfig":29,"./MobileSafariClickEventPlugin":32,"./ReactBrowserComponentMixin":36,"./ReactClass":40,"./ReactComponentBrowserEnvironment":42,"./ReactDOMButton":48,"./ReactDOMComponent":49,"./ReactDOMForm":50,"./ReactDOMIDOperations":51,"./ReactDOMIframe":52,"./ReactDOMImg":53,"./ReactDOMInput":54,"./ReactDOMOption":55,"./ReactDOMSelect":56,"./ReactDOMTextComponent":58,"./ReactDOMTextarea":59,"./ReactDefaultBatchingStrategy":60,"./ReactDefaultPerf":62,"./ReactElement":64,"./ReactEventListener":69,"./ReactInjection":71,"./ReactInstanceHandles":73,"./ReactMount":77,"./ReactReconcileTransaction":87,"./SVGDOMPropertyConfig":95,"./SelectEventPlugin":96,"./ServerReactRootIndex":97,"./SimpleEventPlugin":98,"./createFullPageComponent":118,"_process":6}],62:[function(require,module,exports){
/**
 * Copyright 2013-2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule ReactDefaultPerf
 * @typechecks static-only
 */

'use strict';

var DOMProperty = require("./DOMProperty");
var ReactDefaultPerfAnalysis = require("./ReactDefaultPerfAnalysis");
var ReactMount = require("./ReactMount");
var ReactPerf = require("./ReactPerf");

var performanceNow = require("./performanceNow");

function roundFloat(val) {
  return Math.floor(val * 100) / 100;
}

function addValue(obj, key, val) {
  obj[key] = (obj[key] || 0) + val;
}

var ReactDefaultPerf = {
  _allMeasurements: [], // last item in the list is the current one
  _mountStack: [0],
  _injected: false,

  start: function() {
    if (!ReactDefaultPerf._injected) {
      ReactPerf.injection.injectMeasure(ReactDefaultPerf.measure);
    }

    ReactDefaultPerf._allMeasurements.length = 0;
    ReactPerf.enableMeasure = true;
  },

  stop: function() {
    ReactPerf.enableMeasure = false;
  },

  getLastMeasurements: function() {
    return ReactDefaultPerf._allMeasurements;
  },

  printExclusive: function(measurements) {
    measurements = measurements || ReactDefaultPerf._allMeasurements;
    var summary = ReactDefaultPerfAnalysis.getExclusiveSummary(measurements);
    console.table(summary.map(function(item) {
      return {
        'Component class name': item.componentName,
        'Total inclusive time (ms)': roundFloat(item.inclusive),
        'Exclusive mount time (ms)': roundFloat(item.exclusive),
        'Exclusive render time (ms)': roundFloat(item.render),
        'Mount time per instance (ms)': roundFloat(item.exclusive / item.count),
        'Render time per instance (ms)': roundFloat(item.render / item.count),
        'Instances': item.count
      };
    }));
    // TODO: ReactDefaultPerfAnalysis.getTotalTime() does not return the correct
    // number.
  },

  printInclusive: function(measurements) {
    measurements = measurements || ReactDefaultPerf._allMeasurements;
    var summary = ReactDefaultPerfAnalysis.getInclusiveSummary(measurements);
    console.table(summary.map(function(item) {
      return {
        'Owner > component': item.componentName,
        'Inclusive time (ms)': roundFloat(item.time),
        'Instances': item.count
      };
    }));
    console.log(
      'Total time:',
      ReactDefaultPerfAnalysis.getTotalTime(measurements).toFixed(2) + ' ms'
    );
  },

  getMeasurementsSummaryMap: function(measurements) {
    var summary = ReactDefaultPerfAnalysis.getInclusiveSummary(
      measurements,
      true
    );
    return summary.map(function(item) {
      return {
        'Owner > component': item.componentName,
        'Wasted time (ms)': item.time,
        'Instances': item.count
      };
    });
  },

  printWasted: function(measurements) {
    measurements = measurements || ReactDefaultPerf._allMeasurements;
    console.table(ReactDefaultPerf.getMeasurementsSummaryMap(measurements));
    console.log(
      'Total time:',
      ReactDefaultPerfAnalysis.getTotalTime(measurements).toFixed(2) + ' ms'
    );
  },

  printDOM: function(measurements) {
    measurements = measurements || ReactDefaultPerf._allMeasurements;
    var summary = ReactDefaultPerfAnalysis.getDOMSummary(measurements);
    console.table(summary.map(function(item) {
      var result = {};
      result[DOMProperty.ID_ATTRIBUTE_NAME] = item.id;
      result['type'] = item.type;
      result['args'] = JSON.stringify(item.args);
      return result;
    }));
    console.log(
      'Total time:',
      ReactDefaultPerfAnalysis.getTotalTime(measurements).toFixed(2) + ' ms'
    );
  },

  _recordWrite: function(id, fnName, totalTime, args) {
    // TODO: totalTime isn't that useful since it doesn't count paints/reflows
    var writes =
      ReactDefaultPerf
        ._allMeasurements[ReactDefaultPerf._allMeasurements.length - 1]
        .writes;
    writes[id] = writes[id] || [];
    writes[id].push({
      type: fnName,
      time: totalTime,
      args: args
    });
  },

  measure: function(moduleName, fnName, func) {
    return function() {for (var args=[],$__0=0,$__1=arguments.length;$__0<$__1;$__0++) args.push(arguments[$__0]);
      var totalTime;
      var rv;
      var start;

      if (fnName === '_renderNewRootComponent' ||
          fnName === 'flushBatchedUpdates') {
        // A "measurement" is a set of metrics recorded for each flush. We want
        // to group the metrics for a given flush together so we can look at the
        // components that rendered and the DOM operations that actually
        // happened to determine the amount of "wasted work" performed.
        ReactDefaultPerf._allMeasurements.push({
          exclusive: {},
          inclusive: {},
          render: {},
          counts: {},
          writes: {},
          displayNames: {},
          totalTime: 0
        });
        start = performanceNow();
        rv = func.apply(this, args);
        ReactDefaultPerf._allMeasurements[
          ReactDefaultPerf._allMeasurements.length - 1
        ].totalTime = performanceNow() - start;
        return rv;
      } else if (fnName === '_mountImageIntoNode' ||
          moduleName === 'ReactDOMIDOperations') {
        start = performanceNow();
        rv = func.apply(this, args);
        totalTime = performanceNow() - start;

        if (fnName === '_mountImageIntoNode') {
          var mountID = ReactMount.getID(args[1]);
          ReactDefaultPerf._recordWrite(mountID, fnName, totalTime, args[0]);
        } else if (fnName === 'dangerouslyProcessChildrenUpdates') {
          // special format
          args[0].forEach(function(update) {
            var writeArgs = {};
            if (update.fromIndex !== null) {
              writeArgs.fromIndex = update.fromIndex;
            }
            if (update.toIndex !== null) {
              writeArgs.toIndex = update.toIndex;
            }
            if (update.textContent !== null) {
              writeArgs.textContent = update.textContent;
            }
            if (update.markupIndex !== null) {
              writeArgs.markup = args[1][update.markupIndex];
            }
            ReactDefaultPerf._recordWrite(
              update.parentID,
              update.type,
              totalTime,
              writeArgs
            );
          });
        } else {
          // basic format
          ReactDefaultPerf._recordWrite(
            args[0],
            fnName,
            totalTime,
            Array.prototype.slice.call(args, 1)
          );
        }
        return rv;
      } else if (moduleName === 'ReactCompositeComponent' && (
        (// TODO: receiveComponent()?
        (fnName === 'mountComponent' ||
        fnName === 'updateComponent' || fnName === '_renderValidatedComponent')))) {

        if (typeof this._currentElement.type === 'string') {
          return func.apply(this, args);
        }

        var rootNodeID = fnName === 'mountComponent' ?
          args[0] :
          this._rootNodeID;
        var isRender = fnName === '_renderValidatedComponent';
        var isMount = fnName === 'mountComponent';

        var mountStack = ReactDefaultPerf._mountStack;
        var entry = ReactDefaultPerf._allMeasurements[
          ReactDefaultPerf._allMeasurements.length - 1
        ];

        if (isRender) {
          addValue(entry.counts, rootNodeID, 1);
        } else if (isMount) {
          mountStack.push(0);
        }

        start = performanceNow();
        rv = func.apply(this, args);
        totalTime = performanceNow() - start;

        if (isRender) {
          addValue(entry.render, rootNodeID, totalTime);
        } else if (isMount) {
          var subMountTime = mountStack.pop();
          mountStack[mountStack.length - 1] += totalTime;
          addValue(entry.exclusive, rootNodeID, totalTime - subMountTime);
          addValue(entry.inclusive, rootNodeID, totalTime);
        } else {
          addValue(entry.inclusive, rootNodeID, totalTime);
        }

        entry.displayNames[rootNodeID] = {
          current: this.getName(),
          owner: this._currentElement._owner ?
            this._currentElement._owner.getName() :
            '<root>'
        };

        return rv;
      } else {
        return func.apply(this, args);
      }
    };
  }
};

module.exports = ReactDefaultPerf;

},{"./DOMProperty":16,"./ReactDefaultPerfAnalysis":63,"./ReactMount":77,"./ReactPerf":82,"./performanceNow":153}],63:[function(require,module,exports){
/**
 * Copyright 2013-2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule ReactDefaultPerfAnalysis
 */

var assign = require("./Object.assign");

// Don't try to save users less than 1.2ms (a number I made up)
var DONT_CARE_THRESHOLD = 1.2;
var DOM_OPERATION_TYPES = {
  '_mountImageIntoNode': 'set innerHTML',
  INSERT_MARKUP: 'set innerHTML',
  MOVE_EXISTING: 'move',
  REMOVE_NODE: 'remove',
  TEXT_CONTENT: 'set textContent',
  'updatePropertyByID': 'update attribute',
  'deletePropertyByID': 'delete attribute',
  'updateStylesByID': 'update styles',
  'updateInnerHTMLByID': 'set innerHTML',
  'dangerouslyReplaceNodeWithMarkupByID': 'replace'
};

function getTotalTime(measurements) {
  // TODO: return number of DOM ops? could be misleading.
  // TODO: measure dropped frames after reconcile?
  // TODO: log total time of each reconcile and the top-level component
  // class that triggered it.
  var totalTime = 0;
  for (var i = 0; i < measurements.length; i++) {
    var measurement = measurements[i];
    totalTime += measurement.totalTime;
  }
  return totalTime;
}

function getDOMSummary(measurements) {
  var items = [];
  for (var i = 0; i < measurements.length; i++) {
    var measurement = measurements[i];
    var id;

    for (id in measurement.writes) {
      measurement.writes[id].forEach(function(write) {
        items.push({
          id: id,
          type: DOM_OPERATION_TYPES[write.type] || write.type,
          args: write.args
        });
      });
    }
  }
  return items;
}

function getExclusiveSummary(measurements) {
  var candidates = {};
  var displayName;

  for (var i = 0; i < measurements.length; i++) {
    var measurement = measurements[i];
    var allIDs = assign(
      {},
      measurement.exclusive,
      measurement.inclusive
    );

    for (var id in allIDs) {
      displayName = measurement.displayNames[id].current;

      candidates[displayName] = candidates[displayName] || {
        componentName: displayName,
        inclusive: 0,
        exclusive: 0,
        render: 0,
        count: 0
      };
      if (measurement.render[id]) {
        candidates[displayName].render += measurement.render[id];
      }
      if (measurement.exclusive[id]) {
        candidates[displayName].exclusive += measurement.exclusive[id];
      }
      if (measurement.inclusive[id]) {
        candidates[displayName].inclusive += measurement.inclusive[id];
      }
      if (measurement.counts[id]) {
        candidates[displayName].count += measurement.counts[id];
      }
    }
  }

  // Now make a sorted array with the results.
  var arr = [];
  for (displayName in candidates) {
    if (candidates[displayName].exclusive >= DONT_CARE_THRESHOLD) {
      arr.push(candidates[displayName]);
    }
  }

  arr.sort(function(a, b) {
    return b.exclusive - a.exclusive;
  });

  return arr;
}

function getInclusiveSummary(measurements, onlyClean) {
  var candidates = {};
  var inclusiveKey;

  for (var i = 0; i < measurements.length; i++) {
    var measurement = measurements[i];
    var allIDs = assign(
      {},
      measurement.exclusive,
      measurement.inclusive
    );
    var cleanComponents;

    if (onlyClean) {
      cleanComponents = getUnchangedComponents(measurement);
    }

    for (var id in allIDs) {
      if (onlyClean && !cleanComponents[id]) {
        continue;
      }

      var displayName = measurement.displayNames[id];

      // Inclusive time is not useful for many components without knowing where
      // they are instantiated. So we aggregate inclusive time with both the
      // owner and current displayName as the key.
      inclusiveKey = displayName.owner + ' > ' + displayName.current;

      candidates[inclusiveKey] = candidates[inclusiveKey] || {
        componentName: inclusiveKey,
        time: 0,
        count: 0
      };

      if (measurement.inclusive[id]) {
        candidates[inclusiveKey].time += measurement.inclusive[id];
      }
      if (measurement.counts[id]) {
        candidates[inclusiveKey].count += measurement.counts[id];
      }
    }
  }

  // Now make a sorted array with the results.
  var arr = [];
  for (inclusiveKey in candidates) {
    if (candidates[inclusiveKey].time >= DONT_CARE_THRESHOLD) {
      arr.push(candidates[inclusiveKey]);
    }
  }

  arr.sort(function(a, b) {
    return b.time - a.time;
  });

  return arr;
}

function getUnchangedComponents(measurement) {
  // For a given reconcile, look at which components did not actually
  // render anything to the DOM and return a mapping of their ID to
  // the amount of time it took to render the entire subtree.
  var cleanComponents = {};
  var dirtyLeafIDs = Object.keys(measurement.writes);
  var allIDs = assign({}, measurement.exclusive, measurement.inclusive);

  for (var id in allIDs) {
    var isDirty = false;
    // For each component that rendered, see if a component that triggered
    // a DOM op is in its subtree.
    for (var i = 0; i < dirtyLeafIDs.length; i++) {
      if (dirtyLeafIDs[i].indexOf(id) === 0) {
        isDirty = true;
        break;
      }
    }
    if (!isDirty && measurement.counts[id] > 0) {
      cleanComponents[id] = true;
    }
  }
  return cleanComponents;
}

var ReactDefaultPerfAnalysis = {
  getExclusiveSummary: getExclusiveSummary,
  getInclusiveSummary: getInclusiveSummary,
  getDOMSummary: getDOMSummary,
  getTotalTime: getTotalTime
};

module.exports = ReactDefaultPerfAnalysis;

},{"./Object.assign":33}],64:[function(require,module,exports){
(function (process){
/**
 * Copyright 2014-2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule ReactElement
 */

'use strict';

var ReactContext = require("./ReactContext");
var ReactCurrentOwner = require("./ReactCurrentOwner");

var assign = require("./Object.assign");
var warning = require("./warning");

var RESERVED_PROPS = {
  key: true,
  ref: true
};

/**
 * Warn for mutations.
 *
 * @internal
 * @param {object} object
 * @param {string} key
 */
function defineWarningProperty(object, key) {
  Object.defineProperty(object, key, {

    configurable: false,
    enumerable: true,

    get: function() {
      if (!this._store) {
        return null;
      }
      return this._store[key];
    },

    set: function(value) {
      ("production" !== process.env.NODE_ENV ? warning(
        false,
        'Don\'t set the %s property of the React element. Instead, ' +
        'specify the correct value when initially creating the element.',
        key
      ) : null);
      this._store[key] = value;
    }

  });
}

/**
 * This is updated to true if the membrane is successfully created.
 */
var useMutationMembrane = false;

/**
 * Warn for mutations.
 *
 * @internal
 * @param {object} element
 */
function defineMutationMembrane(prototype) {
  try {
    var pseudoFrozenProperties = {
      props: true
    };
    for (var key in pseudoFrozenProperties) {
      defineWarningProperty(prototype, key);
    }
    useMutationMembrane = true;
  } catch (x) {
    // IE will fail on defineProperty
  }
}

/**
 * Base constructor for all React elements. This is only used to make this
 * work with a dynamic instanceof check. Nothing should live on this prototype.
 *
 * @param {*} type
 * @param {string|object} ref
 * @param {*} key
 * @param {*} props
 * @internal
 */
var ReactElement = function(type, key, ref, owner, context, props) {
  // Built-in properties that belong on the element
  this.type = type;
  this.key = key;
  this.ref = ref;

  // Record the component responsible for creating this element.
  this._owner = owner;

  // TODO: Deprecate withContext, and then the context becomes accessible
  // through the owner.
  this._context = context;

  if ("production" !== process.env.NODE_ENV) {
    // The validation flag and props are currently mutative. We put them on
    // an external backing store so that we can freeze the whole object.
    // This can be replaced with a WeakMap once they are implemented in
    // commonly used development environments.
    this._store = {props: props, originalProps: assign({}, props)};

    // To make comparing ReactElements easier for testing purposes, we make
    // the validation flag non-enumerable (where possible, which should
    // include every environment we run tests in), so the test framework
    // ignores it.
    try {
      Object.defineProperty(this._store, 'validated', {
        configurable: false,
        enumerable: false,
        writable: true
      });
    } catch (x) {
    }
    this._store.validated = false;

    // We're not allowed to set props directly on the object so we early
    // return and rely on the prototype membrane to forward to the backing
    // store.
    if (useMutationMembrane) {
      Object.freeze(this);
      return;
    }
  }

  this.props = props;
};

// We intentionally don't expose the function on the constructor property.
// ReactElement should be indistinguishable from a plain object.
ReactElement.prototype = {
  _isReactElement: true
};

if ("production" !== process.env.NODE_ENV) {
  defineMutationMembrane(ReactElement.prototype);
}

ReactElement.createElement = function(type, config, children) {
  var propName;

  // Reserved names are extracted
  var props = {};

  var key = null;
  var ref = null;

  if (config != null) {
    ref = config.ref === undefined ? null : config.ref;
    key = config.key === undefined ? null : '' + config.key;
    // Remaining properties are added to a new props object
    for (propName in config) {
      if (config.hasOwnProperty(propName) &&
          !RESERVED_PROPS.hasOwnProperty(propName)) {
        props[propName] = config[propName];
      }
    }
  }

  // Children can be more than one argument, and those are transferred onto
  // the newly allocated props object.
  var childrenLength = arguments.length - 2;
  if (childrenLength === 1) {
    props.children = children;
  } else if (childrenLength > 1) {
    var childArray = Array(childrenLength);
    for (var i = 0; i < childrenLength; i++) {
      childArray[i] = arguments[i + 2];
    }
    props.children = childArray;
  }

  // Resolve default props
  if (type && type.defaultProps) {
    var defaultProps = type.defaultProps;
    for (propName in defaultProps) {
      if (typeof props[propName] === 'undefined') {
        props[propName] = defaultProps[propName];
      }
    }
  }

  return new ReactElement(
    type,
    key,
    ref,
    ReactCurrentOwner.current,
    ReactContext.current,
    props
  );
};

ReactElement.createFactory = function(type) {
  var factory = ReactElement.createElement.bind(null, type);
  // Expose the type on the factory and the prototype so that it can be
  // easily accessed on elements. E.g. <Foo />.type === Foo.type.
  // This should not be named `constructor` since this may not be the function
  // that created the element, and it may not even be a constructor.
  // Legacy hook TODO: Warn if this is accessed
  factory.type = type;
  return factory;
};

ReactElement.cloneAndReplaceProps = function(oldElement, newProps) {
  var newElement = new ReactElement(
    oldElement.type,
    oldElement.key,
    oldElement.ref,
    oldElement._owner,
    oldElement._context,
    newProps
  );

  if ("production" !== process.env.NODE_ENV) {
    // If the key on the original is valid, then the clone is valid
    newElement._store.validated = oldElement._store.validated;
  }
  return newElement;
};

ReactElement.cloneElement = function(element, config, children) {
  var propName;

  // Original props are copied
  var props = assign({}, element.props);

  // Reserved names are extracted
  var key = element.key;
  var ref = element.ref;

  // Owner will be preserved, unless ref is overridden
  var owner = element._owner;

  if (config != null) {
    if (config.ref !== undefined) {
      // Silently steal the ref from the parent.
      ref = config.ref;
      owner = ReactCurrentOwner.current;
    }
    if (config.key !== undefined) {
      key = '' + config.key;
    }
    // Remaining properties override existing props
    for (propName in config) {
      if (config.hasOwnProperty(propName) &&
          !RESERVED_PROPS.hasOwnProperty(propName)) {
        props[propName] = config[propName];
      }
    }
  }

  // Children can be more than one argument, and those are transferred onto
  // the newly allocated props object.
  var childrenLength = arguments.length - 2;
  if (childrenLength === 1) {
    props.children = children;
  } else if (childrenLength > 1) {
    var childArray = Array(childrenLength);
    for (var i = 0; i < childrenLength; i++) {
      childArray[i] = arguments[i + 2];
    }
    props.children = childArray;
  }

  return new ReactElement(
    element.type,
    key,
    ref,
    owner,
    element._context,
    props
  );
};

/**
 * @param {?object} object
 * @return {boolean} True if `object` is a valid component.
 * @final
 */
ReactElement.isValidElement = function(object) {
  // ReactTestUtils is often used outside of beforeEach where as React is
  // within it. This leads to two different instances of React on the same
  // page. To identify a element from a different React instance we use
  // a flag instead of an instanceof check.
  var isElement = !!(object && object._isReactElement);
  // if (isElement && !(object instanceof ReactElement)) {
  // This is an indicator that you're using multiple versions of React at the
  // same time. This will screw with ownership and stuff. Fix it, please.
  // TODO: We could possibly warn here.
  // }
  return isElement;
};

module.exports = ReactElement;

}).call(this,require('_process'))
},{"./Object.assign":33,"./ReactContext":45,"./ReactCurrentOwner":46,"./warning":161,"_process":6}],65:[function(require,module,exports){
(function (process){
/**
 * Copyright 2014-2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule ReactElementValidator
 */

/**
 * ReactElementValidator provides a wrapper around a element factory
 * which validates the props passed to the element. This is intended to be
 * used only in DEV and could be replaced by a static type checker for languages
 * that support it.
 */

'use strict';

var ReactElement = require("./ReactElement");
var ReactFragment = require("./ReactFragment");
var ReactPropTypeLocations = require("./ReactPropTypeLocations");
var ReactPropTypeLocationNames = require("./ReactPropTypeLocationNames");
var ReactCurrentOwner = require("./ReactCurrentOwner");
var ReactNativeComponent = require("./ReactNativeComponent");

var getIteratorFn = require("./getIteratorFn");
var invariant = require("./invariant");
var warning = require("./warning");

function getDeclarationErrorAddendum() {
  if (ReactCurrentOwner.current) {
    var name = ReactCurrentOwner.current.getName();
    if (name) {
      return ' Check the render method of `' + name + '`.';
    }
  }
  return '';
}

/**
 * Warn if there's no key explicitly set on dynamic arrays of children or
 * object keys are not valid. This allows us to keep track of children between
 * updates.
 */
var ownerHasKeyUseWarning = {};

var loggedTypeFailures = {};

var NUMERIC_PROPERTY_REGEX = /^\d+$/;

/**
 * Gets the instance's name for use in warnings.
 *
 * @internal
 * @return {?string} Display name or undefined
 */
function getName(instance) {
  var publicInstance = instance && instance.getPublicInstance();
  if (!publicInstance) {
    return undefined;
  }
  var constructor = publicInstance.constructor;
  if (!constructor) {
    return undefined;
  }
  return constructor.displayName || constructor.name || undefined;
}

/**
 * Gets the current owner's displayName for use in warnings.
 *
 * @internal
 * @return {?string} Display name or undefined
 */
function getCurrentOwnerDisplayName() {
  var current = ReactCurrentOwner.current;
  return (
    current && getName(current) || undefined
  );
}

/**
 * Warn if the element doesn't have an explicit key assigned to it.
 * This element is in an array. The array could grow and shrink or be
 * reordered. All children that haven't already been validated are required to
 * have a "key" property assigned to it.
 *
 * @internal
 * @param {ReactElement} element Element that requires a key.
 * @param {*} parentType element's parent's type.
 */
function validateExplicitKey(element, parentType) {
  if (element._store.validated || element.key != null) {
    return;
  }
  element._store.validated = true;

  warnAndMonitorForKeyUse(
    'Each child in an array or iterator should have a unique "key" prop.',
    element,
    parentType
  );
}

/**
 * Warn if the key is being defined as an object property but has an incorrect
 * value.
 *
 * @internal
 * @param {string} name Property name of the key.
 * @param {ReactElement} element Component that requires a key.
 * @param {*} parentType element's parent's type.
 */
function validatePropertyKey(name, element, parentType) {
  if (!NUMERIC_PROPERTY_REGEX.test(name)) {
    return;
  }
  warnAndMonitorForKeyUse(
    'Child objects should have non-numeric keys so ordering is preserved.',
    element,
    parentType
  );
}

/**
 * Shared warning and monitoring code for the key warnings.
 *
 * @internal
 * @param {string} message The base warning that gets output.
 * @param {ReactElement} element Component that requires a key.
 * @param {*} parentType element's parent's type.
 */
function warnAndMonitorForKeyUse(message, element, parentType) {
  var ownerName = getCurrentOwnerDisplayName();
  var parentName = typeof parentType === 'string' ?
    parentType : parentType.displayName || parentType.name;

  var useName = ownerName || parentName;
  var memoizer = ownerHasKeyUseWarning[message] || (
    (ownerHasKeyUseWarning[message] = {})
  );
  if (memoizer.hasOwnProperty(useName)) {
    return;
  }
  memoizer[useName] = true;

  var parentOrOwnerAddendum =
    ownerName ? (" Check the render method of " + ownerName + ".") :
    parentName ? (" Check the React.render call using <" + parentName + ">.") :
    '';

  // Usually the current owner is the offender, but if it accepts children as a
  // property, it may be the creator of the child that's responsible for
  // assigning it a key.
  var childOwnerAddendum = '';
  if (element &&
      element._owner &&
      element._owner !== ReactCurrentOwner.current) {
    // Name of the component that originally created this child.
    var childOwnerName = getName(element._owner);

    childOwnerAddendum = (" It was passed a child from " + childOwnerName + ".");
  }

  ("production" !== process.env.NODE_ENV ? warning(
    false,
    message + '%s%s See https://fb.me/react-warning-keys for more information.',
    parentOrOwnerAddendum,
    childOwnerAddendum
  ) : null);
}

/**
 * Ensure that every element either is passed in a static location, in an
 * array with an explicit keys property defined, or in an object literal
 * with valid key property.
 *
 * @internal
 * @param {ReactNode} node Statically passed child of any type.
 * @param {*} parentType node's parent's type.
 */
function validateChildKeys(node, parentType) {
  if (Array.isArray(node)) {
    for (var i = 0; i < node.length; i++) {
      var child = node[i];
      if (ReactElement.isValidElement(child)) {
        validateExplicitKey(child, parentType);
      }
    }
  } else if (ReactElement.isValidElement(node)) {
    // This element was passed in a valid location.
    node._store.validated = true;
  } else if (node) {
    var iteratorFn = getIteratorFn(node);
    // Entry iterators provide implicit keys.
    if (iteratorFn) {
      if (iteratorFn !== node.entries) {
        var iterator = iteratorFn.call(node);
        var step;
        while (!(step = iterator.next()).done) {
          if (ReactElement.isValidElement(step.value)) {
            validateExplicitKey(step.value, parentType);
          }
        }
      }
    } else if (typeof node === 'object') {
      var fragment = ReactFragment.extractIfFragment(node);
      for (var key in fragment) {
        if (fragment.hasOwnProperty(key)) {
          validatePropertyKey(key, fragment[key], parentType);
        }
      }
    }
  }
}

/**
 * Assert that the props are valid
 *
 * @param {string} componentName Name of the component for error messages.
 * @param {object} propTypes Map of prop name to a ReactPropType
 * @param {object} props
 * @param {string} location e.g. "prop", "context", "child context"
 * @private
 */
function checkPropTypes(componentName, propTypes, props, location) {
  for (var propName in propTypes) {
    if (propTypes.hasOwnProperty(propName)) {
      var error;
      // Prop type validation may throw. In case they do, we don't want to
      // fail the render phase where it didn't fail before. So we log it.
      // After these have been cleaned up, we'll let them throw.
      try {
        // This is intentionally an invariant that gets caught. It's the same
        // behavior as without this statement except with a better message.
        ("production" !== process.env.NODE_ENV ? invariant(
          typeof propTypes[propName] === 'function',
          '%s: %s type `%s` is invalid; it must be a function, usually from ' +
          'React.PropTypes.',
          componentName || 'React class',
          ReactPropTypeLocationNames[location],
          propName
        ) : invariant(typeof propTypes[propName] === 'function'));
        error = propTypes[propName](props, propName, componentName, location);
      } catch (ex) {
        error = ex;
      }
      if (error instanceof Error && !(error.message in loggedTypeFailures)) {
        // Only monitor this failure once because there tends to be a lot of the
        // same error.
        loggedTypeFailures[error.message] = true;

        var addendum = getDeclarationErrorAddendum(this);
        ("production" !== process.env.NODE_ENV ? warning(false, 'Failed propType: %s%s', error.message, addendum) : null);
      }
    }
  }
}

var warnedPropsMutations = {};

/**
 * Warn about mutating props when setting `propName` on `element`.
 *
 * @param {string} propName The string key within props that was set
 * @param {ReactElement} element
 */
function warnForPropsMutation(propName, element) {
  var type = element.type;
  var elementName = typeof type === 'string' ? type : type.displayName;
  var ownerName = element._owner ?
    element._owner.getPublicInstance().constructor.displayName : null;

  var warningKey = propName + '|' + elementName + '|' + ownerName;
  if (warnedPropsMutations.hasOwnProperty(warningKey)) {
    return;
  }
  warnedPropsMutations[warningKey] = true;

  var elementInfo = '';
  if (elementName) {
    elementInfo = ' <' + elementName + ' />';
  }
  var ownerInfo = '';
  if (ownerName) {
    ownerInfo = ' The element was created by ' + ownerName + '.';
  }

  ("production" !== process.env.NODE_ENV ? warning(
    false,
    'Don\'t set .props.%s of the React component%s. Instead, specify the ' +
    'correct value when initially creating the element or use ' +
    'React.cloneElement to make a new element with updated props.%s',
    propName,
    elementInfo,
    ownerInfo
  ) : null);
}

// Inline Object.is polyfill
function is(a, b) {
  if (a !== a) {
    // NaN
    return b !== b;
  }
  if (a === 0 && b === 0) {
    // +-0
    return 1 / a === 1 / b;
  }
  return a === b;
}

/**
 * Given an element, check if its props have been mutated since element
 * creation (or the last call to this function). In particular, check if any
 * new props have been added, which we can't directly catch by defining warning
 * properties on the props object.
 *
 * @param {ReactElement} element
 */
function checkAndWarnForMutatedProps(element) {
  if (!element._store) {
    // Element was created using `new ReactElement` directly or with
    // `ReactElement.createElement`; skip mutation checking
    return;
  }

  var originalProps = element._store.originalProps;
  var props = element.props;

  for (var propName in props) {
    if (props.hasOwnProperty(propName)) {
      if (!originalProps.hasOwnProperty(propName) ||
          !is(originalProps[propName], props[propName])) {
        warnForPropsMutation(propName, element);

        // Copy over the new value so that the two props objects match again
        originalProps[propName] = props[propName];
      }
    }
  }
}

/**
 * Given an element, validate that its props follow the propTypes definition,
 * provided by the type.
 *
 * @param {ReactElement} element
 */
function validatePropTypes(element) {
  if (element.type == null) {
    // This has already warned. Don't throw.
    return;
  }
  // Extract the component class from the element. Converts string types
  // to a composite class which may have propTypes.
  // TODO: Validating a string's propTypes is not decoupled from the
  // rendering target which is problematic.
  var componentClass = ReactNativeComponent.getComponentClassForElement(
    element
  );
  var name = componentClass.displayName || componentClass.name;
  if (componentClass.propTypes) {
    checkPropTypes(
      name,
      componentClass.propTypes,
      element.props,
      ReactPropTypeLocations.prop
    );
  }
  if (typeof componentClass.getDefaultProps === 'function') {
    ("production" !== process.env.NODE_ENV ? warning(
      componentClass.getDefaultProps.isReactClassApproved,
      'getDefaultProps is only used on classic React.createClass ' +
      'definitions. Use a static property named `defaultProps` instead.'
    ) : null);
  }
}

var ReactElementValidator = {

  checkAndWarnForMutatedProps: checkAndWarnForMutatedProps,

  createElement: function(type, props, children) {
    // We warn in this case but don't throw. We expect the element creation to
    // succeed and there will likely be errors in render.
    ("production" !== process.env.NODE_ENV ? warning(
      type != null,
      'React.createElement: type should not be null or undefined. It should ' +
        'be a string (for DOM elements) or a ReactClass (for composite ' +
        'components).'
    ) : null);

    var element = ReactElement.createElement.apply(this, arguments);

    // The result can be nullish if a mock or a custom function is used.
    // TODO: Drop this when these are no longer allowed as the type argument.
    if (element == null) {
      return element;
    }

    for (var i = 2; i < arguments.length; i++) {
      validateChildKeys(arguments[i], type);
    }

    validatePropTypes(element);

    return element;
  },

  createFactory: function(type) {
    var validatedFactory = ReactElementValidator.createElement.bind(
      null,
      type
    );
    // Legacy hook TODO: Warn if this is accessed
    validatedFactory.type = type;

    if ("production" !== process.env.NODE_ENV) {
      try {
        Object.defineProperty(
          validatedFactory,
          'type',
          {
            enumerable: false,
            get: function() {
              ("production" !== process.env.NODE_ENV ? warning(
                false,
                'Factory.type is deprecated. Access the class directly ' +
                'before passing it to createFactory.'
              ) : null);
              Object.defineProperty(this, 'type', {
                value: type
              });
              return type;
            }
          }
        );
      } catch (x) {
        // IE will fail on defineProperty (es5-shim/sham too)
      }
    }


    return validatedFactory;
  },

  cloneElement: function(element, props, children) {
    var newElement = ReactElement.cloneElement.apply(this, arguments);
    for (var i = 2; i < arguments.length; i++) {
      validateChildKeys(arguments[i], newElement.type);
    }
    validatePropTypes(newElement);
    return newElement;
  }

};

module.exports = ReactElementValidator;

}).call(this,require('_process'))
},{"./ReactCurrentOwner":46,"./ReactElement":64,"./ReactFragment":70,"./ReactNativeComponent":80,"./ReactPropTypeLocationNames":83,"./ReactPropTypeLocations":84,"./getIteratorFn":133,"./invariant":142,"./warning":161,"_process":6}],66:[function(require,module,exports){
(function (process){
/**
 * Copyright 2014-2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule ReactEmptyComponent
 */

'use strict';

var ReactElement = require("./ReactElement");
var ReactInstanceMap = require("./ReactInstanceMap");

var invariant = require("./invariant");

var component;
// This registry keeps track of the React IDs of the components that rendered to
// `null` (in reality a placeholder such as `noscript`)
var nullComponentIDsRegistry = {};

var ReactEmptyComponentInjection = {
  injectEmptyComponent: function(emptyComponent) {
    component = ReactElement.createFactory(emptyComponent);
  }
};

var ReactEmptyComponentType = function() {};
ReactEmptyComponentType.prototype.componentDidMount = function() {
  var internalInstance = ReactInstanceMap.get(this);
  // TODO: Make sure we run these methods in the correct order, we shouldn't
  // need this check. We're going to assume if we're here it means we ran
  // componentWillUnmount already so there is no internal instance (it gets
  // removed as part of the unmounting process).
  if (!internalInstance) {
    return;
  }
  registerNullComponentID(internalInstance._rootNodeID);
};
ReactEmptyComponentType.prototype.componentWillUnmount = function() {
  var internalInstance = ReactInstanceMap.get(this);
  // TODO: Get rid of this check. See TODO in componentDidMount.
  if (!internalInstance) {
    return;
  }
  deregisterNullComponentID(internalInstance._rootNodeID);
};
ReactEmptyComponentType.prototype.render = function() {
  ("production" !== process.env.NODE_ENV ? invariant(
    component,
    'Trying to return null from a render, but no null placeholder component ' +
    'was injected.'
  ) : invariant(component));
  return component();
};

var emptyElement = ReactElement.createElement(ReactEmptyComponentType);

/**
 * Mark the component as having rendered to null.
 * @param {string} id Component's `_rootNodeID`.
 */
function registerNullComponentID(id) {
  nullComponentIDsRegistry[id] = true;
}

/**
 * Unmark the component as having rendered to null: it renders to something now.
 * @param {string} id Component's `_rootNodeID`.
 */
function deregisterNullComponentID(id) {
  delete nullComponentIDsRegistry[id];
}

/**
 * @param {string} id Component's `_rootNodeID`.
 * @return {boolean} True if the component is rendered to null.
 */
function isNullComponentID(id) {
  return !!nullComponentIDsRegistry[id];
}

var ReactEmptyComponent = {
  emptyElement: emptyElement,
  injection: ReactEmptyComponentInjection,
  isNullComponentID: isNullComponentID
};

module.exports = ReactEmptyComponent;

}).call(this,require('_process'))
},{"./ReactElement":64,"./ReactInstanceMap":74,"./invariant":142,"_process":6}],67:[function(require,module,exports){
/**
 * Copyright 2013-2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule ReactErrorUtils
 * @typechecks
 */

"use strict";

var ReactErrorUtils = {
  /**
   * Creates a guarded version of a function. This is supposed to make debugging
   * of event handlers easier. To aid debugging with the browser's debugger,
   * this currently simply returns the original function.
   *
   * @param {function} func Function to be executed
   * @param {string} name The name of the guard
   * @return {function}
   */
  guard: function(func, name) {
    return func;
  }
};

module.exports = ReactErrorUtils;

},{}],68:[function(require,module,exports){
/**
 * Copyright 2013-2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule ReactEventEmitterMixin
 */

'use strict';

var EventPluginHub = require("./EventPluginHub");

function runEventQueueInBatch(events) {
  EventPluginHub.enqueueEvents(events);
  EventPluginHub.processEventQueue();
}

var ReactEventEmitterMixin = {

  /**
   * Streams a fired top-level event to `EventPluginHub` where plugins have the
   * opportunity to create `ReactEvent`s to be dispatched.
   *
   * @param {string} topLevelType Record from `EventConstants`.
   * @param {object} topLevelTarget The listening component root node.
   * @param {string} topLevelTargetID ID of `topLevelTarget`.
   * @param {object} nativeEvent Native environment event.
   */
  handleTopLevel: function(
      topLevelType,
      topLevelTarget,
      topLevelTargetID,
      nativeEvent) {
    var events = EventPluginHub.extractEvents(
      topLevelType,
      topLevelTarget,
      topLevelTargetID,
      nativeEvent
    );

    runEventQueueInBatch(events);
  }
};

module.exports = ReactEventEmitterMixin;

},{"./EventPluginHub":23}],69:[function(require,module,exports){
/**
 * Copyright 2013-2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule ReactEventListener
 * @typechecks static-only
 */

'use strict';

var EventListener = require("./EventListener");
var ExecutionEnvironment = require("./ExecutionEnvironment");
var PooledClass = require("./PooledClass");
var ReactInstanceHandles = require("./ReactInstanceHandles");
var ReactMount = require("./ReactMount");
var ReactUpdates = require("./ReactUpdates");

var assign = require("./Object.assign");
var getEventTarget = require("./getEventTarget");
var getUnboundedScrollPosition = require("./getUnboundedScrollPosition");

/**
 * Finds the parent React component of `node`.
 *
 * @param {*} node
 * @return {?DOMEventTarget} Parent container, or `null` if the specified node
 *                           is not nested.
 */
function findParent(node) {
  // TODO: It may be a good idea to cache this to prevent unnecessary DOM
  // traversal, but caching is difficult to do correctly without using a
  // mutation observer to listen for all DOM changes.
  var nodeID = ReactMount.getID(node);
  var rootID = ReactInstanceHandles.getReactRootIDFromNodeID(nodeID);
  var container = ReactMount.findReactContainerForID(rootID);
  var parent = ReactMount.getFirstReactDOM(container);
  return parent;
}

// Used to store ancestor hierarchy in top level callback
function TopLevelCallbackBookKeeping(topLevelType, nativeEvent) {
  this.topLevelType = topLevelType;
  this.nativeEvent = nativeEvent;
  this.ancestors = [];
}
assign(TopLevelCallbackBookKeeping.prototype, {
  destructor: function() {
    this.topLevelType = null;
    this.nativeEvent = null;
    this.ancestors.length = 0;
  }
});
PooledClass.addPoolingTo(
  TopLevelCallbackBookKeeping,
  PooledClass.twoArgumentPooler
);

function handleTopLevelImpl(bookKeeping) {
  var topLevelTarget = ReactMount.getFirstReactDOM(
    getEventTarget(bookKeeping.nativeEvent)
  ) || window;

  // Loop through the hierarchy, in case there's any nested components.
  // It's important that we build the array of ancestors before calling any
  // event handlers, because event handlers can modify the DOM, leading to
  // inconsistencies with ReactMount's node cache. See #1105.
  var ancestor = topLevelTarget;
  while (ancestor) {
    bookKeeping.ancestors.push(ancestor);
    ancestor = findParent(ancestor);
  }

  for (var i = 0, l = bookKeeping.ancestors.length; i < l; i++) {
    topLevelTarget = bookKeeping.ancestors[i];
    var topLevelTargetID = ReactMount.getID(topLevelTarget) || '';
    ReactEventListener._handleTopLevel(
      bookKeeping.topLevelType,
      topLevelTarget,
      topLevelTargetID,
      bookKeeping.nativeEvent
    );
  }
}

function scrollValueMonitor(cb) {
  var scrollPosition = getUnboundedScrollPosition(window);
  cb(scrollPosition);
}

var ReactEventListener = {
  _enabled: true,
  _handleTopLevel: null,

  WINDOW_HANDLE: ExecutionEnvironment.canUseDOM ? window : null,

  setHandleTopLevel: function(handleTopLevel) {
    ReactEventListener._handleTopLevel = handleTopLevel;
  },

  setEnabled: function(enabled) {
    ReactEventListener._enabled = !!enabled;
  },

  isEnabled: function() {
    return ReactEventListener._enabled;
  },


  /**
   * Traps top-level events by using event bubbling.
   *
   * @param {string} topLevelType Record from `EventConstants`.
   * @param {string} handlerBaseName Event name (e.g. "click").
   * @param {object} handle Element on which to attach listener.
   * @return {object} An object with a remove function which will forcefully
   *                  remove the listener.
   * @internal
   */
  trapBubbledEvent: function(topLevelType, handlerBaseName, handle) {
    var element = handle;
    if (!element) {
      return null;
    }
    return EventListener.listen(
      element,
      handlerBaseName,
      ReactEventListener.dispatchEvent.bind(null, topLevelType)
    );
  },

  /**
   * Traps a top-level event by using event capturing.
   *
   * @param {string} topLevelType Record from `EventConstants`.
   * @param {string} handlerBaseName Event name (e.g. "click").
   * @param {object} handle Element on which to attach listener.
   * @return {object} An object with a remove function which will forcefully
   *                  remove the listener.
   * @internal
   */
  trapCapturedEvent: function(topLevelType, handlerBaseName, handle) {
    var element = handle;
    if (!element) {
      return null;
    }
    return EventListener.capture(
      element,
      handlerBaseName,
      ReactEventListener.dispatchEvent.bind(null, topLevelType)
    );
  },

  monitorScrollValue: function(refresh) {
    var callback = scrollValueMonitor.bind(null, refresh);
    EventListener.listen(window, 'scroll', callback);
  },

  dispatchEvent: function(topLevelType, nativeEvent) {
    if (!ReactEventListener._enabled) {
      return;
    }

    var bookKeeping = TopLevelCallbackBookKeeping.getPooled(
      topLevelType,
      nativeEvent
    );
    try {
      // Event queue being processed in the same cycle allows
      // `preventDefault`.
      ReactUpdates.batchedUpdates(handleTopLevelImpl, bookKeeping);
    } finally {
      TopLevelCallbackBookKeeping.release(bookKeeping);
    }
  }
};

module.exports = ReactEventListener;

},{"./EventListener":22,"./ExecutionEnvironment":27,"./Object.assign":33,"./PooledClass":34,"./ReactInstanceHandles":73,"./ReactMount":77,"./ReactUpdates":94,"./getEventTarget":132,"./getUnboundedScrollPosition":138}],70:[function(require,module,exports){
(function (process){
/**
 * Copyright 2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
* @providesModule ReactFragment
*/

'use strict';

var ReactElement = require("./ReactElement");

var warning = require("./warning");

/**
 * We used to allow keyed objects to serve as a collection of ReactElements,
 * or nested sets. This allowed us a way to explicitly key a set a fragment of
 * components. This is now being replaced with an opaque data structure.
 * The upgrade path is to call React.addons.createFragment({ key: value }) to
 * create a keyed fragment. The resulting data structure is opaque, for now.
 */

if ("production" !== process.env.NODE_ENV) {
  var fragmentKey = '_reactFragment';
  var didWarnKey = '_reactDidWarn';
  var canWarnForReactFragment = false;

  try {
    // Feature test. Don't even try to issue this warning if we can't use
    // enumerable: false.

    var dummy = function() {
      return 1;
    };

    Object.defineProperty(
      {},
      fragmentKey,
      {enumerable: false, value: true}
    );

    Object.defineProperty(
      {},
      'key',
      {enumerable: true, get: dummy}
    );

    canWarnForReactFragment = true;
  } catch (x) { }

  var proxyPropertyAccessWithWarning = function(obj, key) {
    Object.defineProperty(obj, key, {
      enumerable: true,
      get: function() {
        ("production" !== process.env.NODE_ENV ? warning(
          this[didWarnKey],
          'A ReactFragment is an opaque type. Accessing any of its ' +
          'properties is deprecated. Pass it to one of the React.Children ' +
          'helpers.'
        ) : null);
        this[didWarnKey] = true;
        return this[fragmentKey][key];
      },
      set: function(value) {
        ("production" !== process.env.NODE_ENV ? warning(
          this[didWarnKey],
          'A ReactFragment is an immutable opaque type. Mutating its ' +
          'properties is deprecated.'
        ) : null);
        this[didWarnKey] = true;
        this[fragmentKey][key] = value;
      }
    });
  };

  var issuedWarnings = {};

  var didWarnForFragment = function(fragment) {
    // We use the keys and the type of the value as a heuristic to dedupe the
    // warning to avoid spamming too much.
    var fragmentCacheKey = '';
    for (var key in fragment) {
      fragmentCacheKey += key + ':' + (typeof fragment[key]) + ',';
    }
    var alreadyWarnedOnce = !!issuedWarnings[fragmentCacheKey];
    issuedWarnings[fragmentCacheKey] = true;
    return alreadyWarnedOnce;
  };
}

var ReactFragment = {
  // Wrap a keyed object in an opaque proxy that warns you if you access any
  // of its properties.
  create: function(object) {
    if ("production" !== process.env.NODE_ENV) {
      if (typeof object !== 'object' || !object || Array.isArray(object)) {
        ("production" !== process.env.NODE_ENV ? warning(
          false,
          'React.addons.createFragment only accepts a single object.',
          object
        ) : null);
        return object;
      }
      if (ReactElement.isValidElement(object)) {
        ("production" !== process.env.NODE_ENV ? warning(
          false,
          'React.addons.createFragment does not accept a ReactElement ' +
          'without a wrapper object.'
        ) : null);
        return object;
      }
      if (canWarnForReactFragment) {
        var proxy = {};
        Object.defineProperty(proxy, fragmentKey, {
          enumerable: false,
          value: object
        });
        Object.defineProperty(proxy, didWarnKey, {
          writable: true,
          enumerable: false,
          value: false
        });
        for (var key in object) {
          proxyPropertyAccessWithWarning(proxy, key);
        }
        Object.preventExtensions(proxy);
        return proxy;
      }
    }
    return object;
  },
  // Extract the original keyed object from the fragment opaque type. Warn if
  // a plain object is passed here.
  extract: function(fragment) {
    if ("production" !== process.env.NODE_ENV) {
      if (canWarnForReactFragment) {
        if (!fragment[fragmentKey]) {
          ("production" !== process.env.NODE_ENV ? warning(
            didWarnForFragment(fragment),
            'Any use of a keyed object should be wrapped in ' +
            'React.addons.createFragment(object) before being passed as a ' +
            'child.'
          ) : null);
          return fragment;
        }
        return fragment[fragmentKey];
      }
    }
    return fragment;
  },
  // Check if this is a fragment and if so, extract the keyed object. If it
  // is a fragment-like object, warn that it should be wrapped. Ignore if we
  // can't determine what kind of object this is.
  extractIfFragment: function(fragment) {
    if ("production" !== process.env.NODE_ENV) {
      if (canWarnForReactFragment) {
        // If it is the opaque type, return the keyed object.
        if (fragment[fragmentKey]) {
          return fragment[fragmentKey];
        }
        // Otherwise, check each property if it has an element, if it does
        // it is probably meant as a fragment, so we can warn early. Defer,
        // the warning to extract.
        for (var key in fragment) {
          if (fragment.hasOwnProperty(key) &&
              ReactElement.isValidElement(fragment[key])) {
            // This looks like a fragment object, we should provide an
            // early warning.
            return ReactFragment.extract(fragment);
          }
        }
      }
    }
    return fragment;
  }
};

module.exports = ReactFragment;

}).call(this,require('_process'))
},{"./ReactElement":64,"./warning":161,"_process":6}],71:[function(require,module,exports){
/**
 * Copyright 2013-2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule ReactInjection
 */

'use strict';

var DOMProperty = require("./DOMProperty");
var EventPluginHub = require("./EventPluginHub");
var ReactComponentEnvironment = require("./ReactComponentEnvironment");
var ReactClass = require("./ReactClass");
var ReactEmptyComponent = require("./ReactEmptyComponent");
var ReactBrowserEventEmitter = require("./ReactBrowserEventEmitter");
var ReactNativeComponent = require("./ReactNativeComponent");
var ReactDOMComponent = require("./ReactDOMComponent");
var ReactPerf = require("./ReactPerf");
var ReactRootIndex = require("./ReactRootIndex");
var ReactUpdates = require("./ReactUpdates");

var ReactInjection = {
  Component: ReactComponentEnvironment.injection,
  Class: ReactClass.injection,
  DOMComponent: ReactDOMComponent.injection,
  DOMProperty: DOMProperty.injection,
  EmptyComponent: ReactEmptyComponent.injection,
  EventPluginHub: EventPluginHub.injection,
  EventEmitter: ReactBrowserEventEmitter.injection,
  NativeComponent: ReactNativeComponent.injection,
  Perf: ReactPerf.injection,
  RootIndex: ReactRootIndex.injection,
  Updates: ReactUpdates.injection
};

module.exports = ReactInjection;

},{"./DOMProperty":16,"./EventPluginHub":23,"./ReactBrowserEventEmitter":37,"./ReactClass":40,"./ReactComponentEnvironment":43,"./ReactDOMComponent":49,"./ReactEmptyComponent":66,"./ReactNativeComponent":80,"./ReactPerf":82,"./ReactRootIndex":90,"./ReactUpdates":94}],72:[function(require,module,exports){
/**
 * Copyright 2013-2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule ReactInputSelection
 */

'use strict';

var ReactDOMSelection = require("./ReactDOMSelection");

var containsNode = require("./containsNode");
var focusNode = require("./focusNode");
var getActiveElement = require("./getActiveElement");

function isInDocument(node) {
  return containsNode(document.documentElement, node);
}

/**
 * @ReactInputSelection: React input selection module. Based on Selection.js,
 * but modified to be suitable for react and has a couple of bug fixes (doesn't
 * assume buttons have range selections allowed).
 * Input selection module for React.
 */
var ReactInputSelection = {

  hasSelectionCapabilities: function(elem) {
    return elem && (
      ((elem.nodeName === 'INPUT' && elem.type === 'text') ||
      elem.nodeName === 'TEXTAREA' || elem.contentEditable === 'true')
    );
  },

  getSelectionInformation: function() {
    var focusedElem = getActiveElement();
    return {
      focusedElem: focusedElem,
      selectionRange:
          ReactInputSelection.hasSelectionCapabilities(focusedElem) ?
          ReactInputSelection.getSelection(focusedElem) :
          null
    };
  },

  /**
   * @restoreSelection: If any selection information was potentially lost,
   * restore it. This is useful when performing operations that could remove dom
   * nodes and place them back in, resulting in focus being lost.
   */
  restoreSelection: function(priorSelectionInformation) {
    var curFocusedElem = getActiveElement();
    var priorFocusedElem = priorSelectionInformation.focusedElem;
    var priorSelectionRange = priorSelectionInformation.selectionRange;
    if (curFocusedElem !== priorFocusedElem &&
        isInDocument(priorFocusedElem)) {
      if (ReactInputSelection.hasSelectionCapabilities(priorFocusedElem)) {
        ReactInputSelection.setSelection(
          priorFocusedElem,
          priorSelectionRange
        );
      }
      focusNode(priorFocusedElem);
    }
  },

  /**
   * @getSelection: Gets the selection bounds of a focused textarea, input or
   * contentEditable node.
   * -@input: Look up selection bounds of this input
   * -@return {start: selectionStart, end: selectionEnd}
   */
  getSelection: function(input) {
    var selection;

    if ('selectionStart' in input) {
      // Modern browser with input or textarea.
      selection = {
        start: input.selectionStart,
        end: input.selectionEnd
      };
    } else if (document.selection && input.nodeName === 'INPUT') {
      // IE8 input.
      var range = document.selection.createRange();
      // There can only be one selection per document in IE, so it must
      // be in our element.
      if (range.parentElement() === input) {
        selection = {
          start: -range.moveStart('character', -input.value.length),
          end: -range.moveEnd('character', -input.value.length)
        };
      }
    } else {
      // Content editable or old IE textarea.
      selection = ReactDOMSelection.getOffsets(input);
    }

    return selection || {start: 0, end: 0};
  },

  /**
   * @setSelection: Sets the selection bounds of a textarea or input and focuses
   * the input.
   * -@input     Set selection bounds of this input or textarea
   * -@offsets   Object of same form that is returned from get*
   */
  setSelection: function(input, offsets) {
    var start = offsets.start;
    var end = offsets.end;
    if (typeof end === 'undefined') {
      end = start;
    }

    if ('selectionStart' in input) {
      input.selectionStart = start;
      input.selectionEnd = Math.min(end, input.value.length);
    } else if (document.selection && input.nodeName === 'INPUT') {
      var range = input.createTextRange();
      range.collapse(true);
      range.moveStart('character', start);
      range.moveEnd('character', end - start);
      range.select();
    } else {
      ReactDOMSelection.setOffsets(input, offsets);
    }
  }
};

module.exports = ReactInputSelection;

},{"./ReactDOMSelection":57,"./containsNode":116,"./focusNode":126,"./getActiveElement":128}],73:[function(require,module,exports){
(function (process){
/**
 * Copyright 2013-2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule ReactInstanceHandles
 * @typechecks static-only
 */

'use strict';

var ReactRootIndex = require("./ReactRootIndex");

var invariant = require("./invariant");

var SEPARATOR = '.';
var SEPARATOR_LENGTH = SEPARATOR.length;

/**
 * Maximum depth of traversals before we consider the possibility of a bad ID.
 */
var MAX_TREE_DEPTH = 100;

/**
 * Creates a DOM ID prefix to use when mounting React components.
 *
 * @param {number} index A unique integer
 * @return {string} React root ID.
 * @internal
 */
function getReactRootIDString(index) {
  return SEPARATOR + index.toString(36);
}

/**
 * Checks if a character in the supplied ID is a separator or the end.
 *
 * @param {string} id A React DOM ID.
 * @param {number} index Index of the character to check.
 * @return {boolean} True if the character is a separator or end of the ID.
 * @private
 */
function isBoundary(id, index) {
  return id.charAt(index) === SEPARATOR || index === id.length;
}

/**
 * Checks if the supplied string is a valid React DOM ID.
 *
 * @param {string} id A React DOM ID, maybe.
 * @return {boolean} True if the string is a valid React DOM ID.
 * @private
 */
function isValidID(id) {
  return id === '' || (
    id.charAt(0) === SEPARATOR && id.charAt(id.length - 1) !== SEPARATOR
  );
}

/**
 * Checks if the first ID is an ancestor of or equal to the second ID.
 *
 * @param {string} ancestorID
 * @param {string} descendantID
 * @return {boolean} True if `ancestorID` is an ancestor of `descendantID`.
 * @internal
 */
function isAncestorIDOf(ancestorID, descendantID) {
  return (
    descendantID.indexOf(ancestorID) === 0 &&
    isBoundary(descendantID, ancestorID.length)
  );
}

/**
 * Gets the parent ID of the supplied React DOM ID, `id`.
 *
 * @param {string} id ID of a component.
 * @return {string} ID of the parent, or an empty string.
 * @private
 */
function getParentID(id) {
  return id ? id.substr(0, id.lastIndexOf(SEPARATOR)) : '';
}

/**
 * Gets the next DOM ID on the tree path from the supplied `ancestorID` to the
 * supplied `destinationID`. If they are equal, the ID is returned.
 *
 * @param {string} ancestorID ID of an ancestor node of `destinationID`.
 * @param {string} destinationID ID of the destination node.
 * @return {string} Next ID on the path from `ancestorID` to `destinationID`.
 * @private
 */
function getNextDescendantID(ancestorID, destinationID) {
  ("production" !== process.env.NODE_ENV ? invariant(
    isValidID(ancestorID) && isValidID(destinationID),
    'getNextDescendantID(%s, %s): Received an invalid React DOM ID.',
    ancestorID,
    destinationID
  ) : invariant(isValidID(ancestorID) && isValidID(destinationID)));
  ("production" !== process.env.NODE_ENV ? invariant(
    isAncestorIDOf(ancestorID, destinationID),
    'getNextDescendantID(...): React has made an invalid assumption about ' +
    'the DOM hierarchy. Expected `%s` to be an ancestor of `%s`.',
    ancestorID,
    destinationID
  ) : invariant(isAncestorIDOf(ancestorID, destinationID)));
  if (ancestorID === destinationID) {
    return ancestorID;
  }
  // Skip over the ancestor and the immediate separator. Traverse until we hit
  // another separator or we reach the end of `destinationID`.
  var start = ancestorID.length + SEPARATOR_LENGTH;
  var i;
  for (i = start; i < destinationID.length; i++) {
    if (isBoundary(destinationID, i)) {
      break;
    }
  }
  return destinationID.substr(0, i);
}

/**
 * Gets the nearest common ancestor ID of two IDs.
 *
 * Using this ID scheme, the nearest common ancestor ID is the longest common
 * prefix of the two IDs that immediately preceded a "marker" in both strings.
 *
 * @param {string} oneID
 * @param {string} twoID
 * @return {string} Nearest common ancestor ID, or the empty string if none.
 * @private
 */
function getFirstCommonAncestorID(oneID, twoID) {
  var minLength = Math.min(oneID.length, twoID.length);
  if (minLength === 0) {
    return '';
  }
  var lastCommonMarkerIndex = 0;
  // Use `<=` to traverse until the "EOL" of the shorter string.
  for (var i = 0; i <= minLength; i++) {
    if (isBoundary(oneID, i) && isBoundary(twoID, i)) {
      lastCommonMarkerIndex = i;
    } else if (oneID.charAt(i) !== twoID.charAt(i)) {
      break;
    }
  }
  var longestCommonID = oneID.substr(0, lastCommonMarkerIndex);
  ("production" !== process.env.NODE_ENV ? invariant(
    isValidID(longestCommonID),
    'getFirstCommonAncestorID(%s, %s): Expected a valid React DOM ID: %s',
    oneID,
    twoID,
    longestCommonID
  ) : invariant(isValidID(longestCommonID)));
  return longestCommonID;
}

/**
 * Traverses the parent path between two IDs (either up or down). The IDs must
 * not be the same, and there must exist a parent path between them. If the
 * callback returns `false`, traversal is stopped.
 *
 * @param {?string} start ID at which to start traversal.
 * @param {?string} stop ID at which to end traversal.
 * @param {function} cb Callback to invoke each ID with.
 * @param {?boolean} skipFirst Whether or not to skip the first node.
 * @param {?boolean} skipLast Whether or not to skip the last node.
 * @private
 */
function traverseParentPath(start, stop, cb, arg, skipFirst, skipLast) {
  start = start || '';
  stop = stop || '';
  ("production" !== process.env.NODE_ENV ? invariant(
    start !== stop,
    'traverseParentPath(...): Cannot traverse from and to the same ID, `%s`.',
    start
  ) : invariant(start !== stop));
  var traverseUp = isAncestorIDOf(stop, start);
  ("production" !== process.env.NODE_ENV ? invariant(
    traverseUp || isAncestorIDOf(start, stop),
    'traverseParentPath(%s, %s, ...): Cannot traverse from two IDs that do ' +
    'not have a parent path.',
    start,
    stop
  ) : invariant(traverseUp || isAncestorIDOf(start, stop)));
  // Traverse from `start` to `stop` one depth at a time.
  var depth = 0;
  var traverse = traverseUp ? getParentID : getNextDescendantID;
  for (var id = start; /* until break */; id = traverse(id, stop)) {
    var ret;
    if ((!skipFirst || id !== start) && (!skipLast || id !== stop)) {
      ret = cb(id, traverseUp, arg);
    }
    if (ret === false || id === stop) {
      // Only break //after// visiting `stop`.
      break;
    }
    ("production" !== process.env.NODE_ENV ? invariant(
      depth++ < MAX_TREE_DEPTH,
      'traverseParentPath(%s, %s, ...): Detected an infinite loop while ' +
      'traversing the React DOM ID tree. This may be due to malformed IDs: %s',
      start, stop
    ) : invariant(depth++ < MAX_TREE_DEPTH));
  }
}

/**
 * Manages the IDs assigned to DOM representations of React components. This
 * uses a specific scheme in order to traverse the DOM efficiently (e.g. in
 * order to simulate events).
 *
 * @internal
 */
var ReactInstanceHandles = {

  /**
   * Constructs a React root ID
   * @return {string} A React root ID.
   */
  createReactRootID: function() {
    return getReactRootIDString(ReactRootIndex.createReactRootIndex());
  },

  /**
   * Constructs a React ID by joining a root ID with a name.
   *
   * @param {string} rootID Root ID of a parent component.
   * @param {string} name A component's name (as flattened children).
   * @return {string} A React ID.
   * @internal
   */
  createReactID: function(rootID, name) {
    return rootID + name;
  },

  /**
   * Gets the DOM ID of the React component that is the root of the tree that
   * contains the React component with the supplied DOM ID.
   *
   * @param {string} id DOM ID of a React component.
   * @return {?string} DOM ID of the React component that is the root.
   * @internal
   */
  getReactRootIDFromNodeID: function(id) {
    if (id && id.charAt(0) === SEPARATOR && id.length > 1) {
      var index = id.indexOf(SEPARATOR, 1);
      return index > -1 ? id.substr(0, index) : id;
    }
    return null;
  },

  /**
   * Traverses the ID hierarchy and invokes the supplied `cb` on any IDs that
   * should would receive a `mouseEnter` or `mouseLeave` event.
   *
   * NOTE: Does not invoke the callback on the nearest common ancestor because
   * nothing "entered" or "left" that element.
   *
   * @param {string} leaveID ID being left.
   * @param {string} enterID ID being entered.
   * @param {function} cb Callback to invoke on each entered/left ID.
   * @param {*} upArg Argument to invoke the callback with on left IDs.
   * @param {*} downArg Argument to invoke the callback with on entered IDs.
   * @internal
   */
  traverseEnterLeave: function(leaveID, enterID, cb, upArg, downArg) {
    var ancestorID = getFirstCommonAncestorID(leaveID, enterID);
    if (ancestorID !== leaveID) {
      traverseParentPath(leaveID, ancestorID, cb, upArg, false, true);
    }
    if (ancestorID !== enterID) {
      traverseParentPath(ancestorID, enterID, cb, downArg, true, false);
    }
  },

  /**
   * Simulates the traversal of a two-phase, capture/bubble event dispatch.
   *
   * NOTE: This traversal happens on IDs without touching the DOM.
   *
   * @param {string} targetID ID of the target node.
   * @param {function} cb Callback to invoke.
   * @param {*} arg Argument to invoke the callback with.
   * @internal
   */
  traverseTwoPhase: function(targetID, cb, arg) {
    if (targetID) {
      traverseParentPath('', targetID, cb, arg, true, false);
      traverseParentPath(targetID, '', cb, arg, false, true);
    }
  },

  /**
   * Traverse a node ID, calling the supplied `cb` for each ancestor ID. For
   * example, passing `.0.$row-0.1` would result in `cb` getting called
   * with `.0`, `.0.$row-0`, and `.0.$row-0.1`.
   *
   * NOTE: This traversal happens on IDs without touching the DOM.
   *
   * @param {string} targetID ID of the target node.
   * @param {function} cb Callback to invoke.
   * @param {*} arg Argument to invoke the callback with.
   * @internal
   */
  traverseAncestors: function(targetID, cb, arg) {
    traverseParentPath('', targetID, cb, arg, true, false);
  },

  /**
   * Exposed for unit testing.
   * @private
   */
  _getFirstCommonAncestorID: getFirstCommonAncestorID,

  /**
   * Exposed for unit testing.
   * @private
   */
  _getNextDescendantID: getNextDescendantID,

  isAncestorIDOf: isAncestorIDOf,

  SEPARATOR: SEPARATOR

};

module.exports = ReactInstanceHandles;

}).call(this,require('_process'))
},{"./ReactRootIndex":90,"./invariant":142,"_process":6}],74:[function(require,module,exports){
/**
 * Copyright 2013-2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule ReactInstanceMap
 */

'use strict';

/**
 * `ReactInstanceMap` maintains a mapping from a public facing stateful
 * instance (key) and the internal representation (value). This allows public
 * methods to accept the user facing instance as an argument and map them back
 * to internal methods.
 */

// TODO: Replace this with ES6: var ReactInstanceMap = new Map();
var ReactInstanceMap = {

  /**
   * This API should be called `delete` but we'd have to make sure to always
   * transform these to strings for IE support. When this transform is fully
   * supported we can rename it.
   */
  remove: function(key) {
    key._reactInternalInstance = undefined;
  },

  get: function(key) {
    return key._reactInternalInstance;
  },

  has: function(key) {
    return key._reactInternalInstance !== undefined;
  },

  set: function(key, value) {
    key._reactInternalInstance = value;
  }

};

module.exports = ReactInstanceMap;

},{}],75:[function(require,module,exports){
/**
 * Copyright 2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule ReactLifeCycle
 */

'use strict';

/**
 * This module manages the bookkeeping when a component is in the process
 * of being mounted or being unmounted. This is used as a way to enforce
 * invariants (or warnings) when it is not recommended to call
 * setState/forceUpdate.
 *
 * currentlyMountingInstance: During the construction phase, it is not possible
 * to trigger an update since the instance is not fully mounted yet. However, we
 * currently allow this as a convenience for mutating the initial state.
 *
 * currentlyUnmountingInstance: During the unmounting phase, the instance is
 * still mounted and can therefore schedule an update. However, this is not
 * recommended and probably an error since it's about to be unmounted.
 * Therefore we still want to trigger in an error for that case.
 */

var ReactLifeCycle = {
  currentlyMountingInstance: null,
  currentlyUnmountingInstance: null
};

module.exports = ReactLifeCycle;

},{}],76:[function(require,module,exports){
/**
 * Copyright 2013-2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule ReactMarkupChecksum
 */

'use strict';

var adler32 = require("./adler32");

var ReactMarkupChecksum = {
  CHECKSUM_ATTR_NAME: 'data-react-checksum',

  /**
   * @param {string} markup Markup string
   * @return {string} Markup string with checksum attribute attached
   */
  addChecksumToMarkup: function(markup) {
    var checksum = adler32(markup);
    return markup.replace(
      '>',
      ' ' + ReactMarkupChecksum.CHECKSUM_ATTR_NAME + '="' + checksum + '">'
    );
  },

  /**
   * @param {string} markup to use
   * @param {DOMElement} element root React element
   * @returns {boolean} whether or not the markup is the same
   */
  canReuseMarkup: function(markup, element) {
    var existingChecksum = element.getAttribute(
      ReactMarkupChecksum.CHECKSUM_ATTR_NAME
    );
    existingChecksum = existingChecksum && parseInt(existingChecksum, 10);
    var markupChecksum = adler32(markup);
    return markupChecksum === existingChecksum;
  }
};

module.exports = ReactMarkupChecksum;

},{"./adler32":113}],77:[function(require,module,exports){
(function (process){
/**
 * Copyright 2013-2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule ReactMount
 */

'use strict';

var DOMProperty = require("./DOMProperty");
var ReactBrowserEventEmitter = require("./ReactBrowserEventEmitter");
var ReactCurrentOwner = require("./ReactCurrentOwner");
var ReactElement = require("./ReactElement");
var ReactElementValidator = require("./ReactElementValidator");
var ReactEmptyComponent = require("./ReactEmptyComponent");
var ReactInstanceHandles = require("./ReactInstanceHandles");
var ReactInstanceMap = require("./ReactInstanceMap");
var ReactMarkupChecksum = require("./ReactMarkupChecksum");
var ReactPerf = require("./ReactPerf");
var ReactReconciler = require("./ReactReconciler");
var ReactUpdateQueue = require("./ReactUpdateQueue");
var ReactUpdates = require("./ReactUpdates");

var emptyObject = require("./emptyObject");
var containsNode = require("./containsNode");
var getReactRootElementInContainer = require("./getReactRootElementInContainer");
var instantiateReactComponent = require("./instantiateReactComponent");
var invariant = require("./invariant");
var setInnerHTML = require("./setInnerHTML");
var shouldUpdateReactComponent = require("./shouldUpdateReactComponent");
var warning = require("./warning");

var SEPARATOR = ReactInstanceHandles.SEPARATOR;

var ATTR_NAME = DOMProperty.ID_ATTRIBUTE_NAME;
var nodeCache = {};

var ELEMENT_NODE_TYPE = 1;
var DOC_NODE_TYPE = 9;

/** Mapping from reactRootID to React component instance. */
var instancesByReactRootID = {};

/** Mapping from reactRootID to `container` nodes. */
var containersByReactRootID = {};

if ("production" !== process.env.NODE_ENV) {
  /** __DEV__-only mapping from reactRootID to root elements. */
  var rootElementsByReactRootID = {};
}

// Used to store breadth-first search state in findComponentRoot.
var findComponentRootReusableArray = [];

/**
 * Finds the index of the first character
 * that's not common between the two given strings.
 *
 * @return {number} the index of the character where the strings diverge
 */
function firstDifferenceIndex(string1, string2) {
  var minLen = Math.min(string1.length, string2.length);
  for (var i = 0; i < minLen; i++) {
    if (string1.charAt(i) !== string2.charAt(i)) {
      return i;
    }
  }
  return string1.length === string2.length ? -1 : minLen;
}

/**
 * @param {DOMElement} container DOM element that may contain a React component.
 * @return {?string} A "reactRoot" ID, if a React component is rendered.
 */
function getReactRootID(container) {
  var rootElement = getReactRootElementInContainer(container);
  return rootElement && ReactMount.getID(rootElement);
}

/**
 * Accessing node[ATTR_NAME] or calling getAttribute(ATTR_NAME) on a form
 * element can return its control whose name or ID equals ATTR_NAME. All
 * DOM nodes support `getAttributeNode` but this can also get called on
 * other objects so just return '' if we're given something other than a
 * DOM node (such as window).
 *
 * @param {?DOMElement|DOMWindow|DOMDocument|DOMTextNode} node DOM node.
 * @return {string} ID of the supplied `domNode`.
 */
function getID(node) {
  var id = internalGetID(node);
  if (id) {
    if (nodeCache.hasOwnProperty(id)) {
      var cached = nodeCache[id];
      if (cached !== node) {
        ("production" !== process.env.NODE_ENV ? invariant(
          !isValid(cached, id),
          'ReactMount: Two valid but unequal nodes with the same `%s`: %s',
          ATTR_NAME, id
        ) : invariant(!isValid(cached, id)));

        nodeCache[id] = node;
      }
    } else {
      nodeCache[id] = node;
    }
  }

  return id;
}

function internalGetID(node) {
  // If node is something like a window, document, or text node, none of
  // which support attributes or a .getAttribute method, gracefully return
  // the empty string, as if the attribute were missing.
  return node && node.getAttribute && node.getAttribute(ATTR_NAME) || '';
}

/**
 * Sets the React-specific ID of the given node.
 *
 * @param {DOMElement} node The DOM node whose ID will be set.
 * @param {string} id The value of the ID attribute.
 */
function setID(node, id) {
  var oldID = internalGetID(node);
  if (oldID !== id) {
    delete nodeCache[oldID];
  }
  node.setAttribute(ATTR_NAME, id);
  nodeCache[id] = node;
}

/**
 * Finds the node with the supplied React-generated DOM ID.
 *
 * @param {string} id A React-generated DOM ID.
 * @return {DOMElement} DOM node with the suppled `id`.
 * @internal
 */
function getNode(id) {
  if (!nodeCache.hasOwnProperty(id) || !isValid(nodeCache[id], id)) {
    nodeCache[id] = ReactMount.findReactNodeByID(id);
  }
  return nodeCache[id];
}

/**
 * Finds the node with the supplied public React instance.
 *
 * @param {*} instance A public React instance.
 * @return {?DOMElement} DOM node with the suppled `id`.
 * @internal
 */
function getNodeFromInstance(instance) {
  var id = ReactInstanceMap.get(instance)._rootNodeID;
  if (ReactEmptyComponent.isNullComponentID(id)) {
    return null;
  }
  if (!nodeCache.hasOwnProperty(id) || !isValid(nodeCache[id], id)) {
    nodeCache[id] = ReactMount.findReactNodeByID(id);
  }
  return nodeCache[id];
}

/**
 * A node is "valid" if it is contained by a currently mounted container.
 *
 * This means that the node does not have to be contained by a document in
 * order to be considered valid.
 *
 * @param {?DOMElement} node The candidate DOM node.
 * @param {string} id The expected ID of the node.
 * @return {boolean} Whether the node is contained by a mounted container.
 */
function isValid(node, id) {
  if (node) {
    ("production" !== process.env.NODE_ENV ? invariant(
      internalGetID(node) === id,
      'ReactMount: Unexpected modification of `%s`',
      ATTR_NAME
    ) : invariant(internalGetID(node) === id));

    var container = ReactMount.findReactContainerForID(id);
    if (container && containsNode(container, node)) {
      return true;
    }
  }

  return false;
}

/**
 * Causes the cache to forget about one React-specific ID.
 *
 * @param {string} id The ID to forget.
 */
function purgeID(id) {
  delete nodeCache[id];
}

var deepestNodeSoFar = null;
function findDeepestCachedAncestorImpl(ancestorID) {
  var ancestor = nodeCache[ancestorID];
  if (ancestor && isValid(ancestor, ancestorID)) {
    deepestNodeSoFar = ancestor;
  } else {
    // This node isn't populated in the cache, so presumably none of its
    // descendants are. Break out of the loop.
    return false;
  }
}

/**
 * Return the deepest cached node whose ID is a prefix of `targetID`.
 */
function findDeepestCachedAncestor(targetID) {
  deepestNodeSoFar = null;
  ReactInstanceHandles.traverseAncestors(
    targetID,
    findDeepestCachedAncestorImpl
  );

  var foundNode = deepestNodeSoFar;
  deepestNodeSoFar = null;
  return foundNode;
}

/**
 * Mounts this component and inserts it into the DOM.
 *
 * @param {ReactComponent} componentInstance The instance to mount.
 * @param {string} rootID DOM ID of the root node.
 * @param {DOMElement} container DOM element to mount into.
 * @param {ReactReconcileTransaction} transaction
 * @param {boolean} shouldReuseMarkup If true, do not insert markup
 */
function mountComponentIntoNode(
    componentInstance,
    rootID,
    container,
    transaction,
    shouldReuseMarkup) {
  var markup = ReactReconciler.mountComponent(
    componentInstance, rootID, transaction, emptyObject
  );
  componentInstance._isTopLevel = true;
  ReactMount._mountImageIntoNode(markup, container, shouldReuseMarkup);
}

/**
 * Batched mount.
 *
 * @param {ReactComponent} componentInstance The instance to mount.
 * @param {string} rootID DOM ID of the root node.
 * @param {DOMElement} container DOM element to mount into.
 * @param {boolean} shouldReuseMarkup If true, do not insert markup
 */
function batchedMountComponentIntoNode(
    componentInstance,
    rootID,
    container,
    shouldReuseMarkup) {
  var transaction = ReactUpdates.ReactReconcileTransaction.getPooled();
  transaction.perform(
    mountComponentIntoNode,
    null,
    componentInstance,
    rootID,
    container,
    transaction,
    shouldReuseMarkup
  );
  ReactUpdates.ReactReconcileTransaction.release(transaction);
}

/**
 * Mounting is the process of initializing a React component by creating its
 * representative DOM elements and inserting them into a supplied `container`.
 * Any prior content inside `container` is destroyed in the process.
 *
 *   ReactMount.render(
 *     component,
 *     document.getElementById('container')
 *   );
 *
 *   <div id="container">                   <-- Supplied `container`.
 *     <div data-reactid=".3">              <-- Rendered reactRoot of React
 *       // ...                                 component.
 *     </div>
 *   </div>
 *
 * Inside of `container`, the first element rendered is the "reactRoot".
 */
var ReactMount = {
  /** Exposed for debugging purposes **/
  _instancesByReactRootID: instancesByReactRootID,

  /**
   * This is a hook provided to support rendering React components while
   * ensuring that the apparent scroll position of its `container` does not
   * change.
   *
   * @param {DOMElement} container The `container` being rendered into.
   * @param {function} renderCallback This must be called once to do the render.
   */
  scrollMonitor: function(container, renderCallback) {
    renderCallback();
  },

  /**
   * Take a component that's already mounted into the DOM and replace its props
   * @param {ReactComponent} prevComponent component instance already in the DOM
   * @param {ReactElement} nextElement component instance to render
   * @param {DOMElement} container container to render into
   * @param {?function} callback function triggered on completion
   */
  _updateRootComponent: function(
      prevComponent,
      nextElement,
      container,
      callback) {
    if ("production" !== process.env.NODE_ENV) {
      ReactElementValidator.checkAndWarnForMutatedProps(nextElement);
    }

    ReactMount.scrollMonitor(container, function() {
      ReactUpdateQueue.enqueueElementInternal(prevComponent, nextElement);
      if (callback) {
        ReactUpdateQueue.enqueueCallbackInternal(prevComponent, callback);
      }
    });

    if ("production" !== process.env.NODE_ENV) {
      // Record the root element in case it later gets transplanted.
      rootElementsByReactRootID[getReactRootID(container)] =
        getReactRootElementInContainer(container);
    }

    return prevComponent;
  },

  /**
   * Register a component into the instance map and starts scroll value
   * monitoring
   * @param {ReactComponent} nextComponent component instance to render
   * @param {DOMElement} container container to render into
   * @return {string} reactRoot ID prefix
   */
  _registerComponent: function(nextComponent, container) {
    ("production" !== process.env.NODE_ENV ? invariant(
      container && (
        (container.nodeType === ELEMENT_NODE_TYPE || container.nodeType === DOC_NODE_TYPE)
      ),
      '_registerComponent(...): Target container is not a DOM element.'
    ) : invariant(container && (
      (container.nodeType === ELEMENT_NODE_TYPE || container.nodeType === DOC_NODE_TYPE)
    )));

    ReactBrowserEventEmitter.ensureScrollValueMonitoring();

    var reactRootID = ReactMount.registerContainer(container);
    instancesByReactRootID[reactRootID] = nextComponent;
    return reactRootID;
  },

  /**
   * Render a new component into the DOM.
   * @param {ReactElement} nextElement element to render
   * @param {DOMElement} container container to render into
   * @param {boolean} shouldReuseMarkup if we should skip the markup insertion
   * @return {ReactComponent} nextComponent
   */
  _renderNewRootComponent: function(
    nextElement,
    container,
    shouldReuseMarkup
  ) {
    // Various parts of our code (such as ReactCompositeComponent's
    // _renderValidatedComponent) assume that calls to render aren't nested;
    // verify that that's the case.
    ("production" !== process.env.NODE_ENV ? warning(
      ReactCurrentOwner.current == null,
      '_renderNewRootComponent(): Render methods should be a pure function ' +
      'of props and state; triggering nested component updates from ' +
      'render is not allowed. If necessary, trigger nested updates in ' +
      'componentDidUpdate.'
    ) : null);

    var componentInstance = instantiateReactComponent(nextElement, null);
    var reactRootID = ReactMount._registerComponent(
      componentInstance,
      container
    );

    // The initial render is synchronous but any updates that happen during
    // rendering, in componentWillMount or componentDidMount, will be batched
    // according to the current batching strategy.

    ReactUpdates.batchedUpdates(
      batchedMountComponentIntoNode,
      componentInstance,
      reactRootID,
      container,
      shouldReuseMarkup
    );

    if ("production" !== process.env.NODE_ENV) {
      // Record the root element in case it later gets transplanted.
      rootElementsByReactRootID[reactRootID] =
        getReactRootElementInContainer(container);
    }

    return componentInstance;
  },

  /**
   * Renders a React component into the DOM in the supplied `container`.
   *
   * If the React component was previously rendered into `container`, this will
   * perform an update on it and only mutate the DOM as necessary to reflect the
   * latest React component.
   *
   * @param {ReactElement} nextElement Component element to render.
   * @param {DOMElement} container DOM element to render into.
   * @param {?function} callback function triggered on completion
   * @return {ReactComponent} Component instance rendered in `container`.
   */
  render: function(nextElement, container, callback) {
    ("production" !== process.env.NODE_ENV ? invariant(
      ReactElement.isValidElement(nextElement),
      'React.render(): Invalid component element.%s',
      (
        typeof nextElement === 'string' ?
          ' Instead of passing an element string, make sure to instantiate ' +
          'it by passing it to React.createElement.' :
        typeof nextElement === 'function' ?
          ' Instead of passing a component class, make sure to instantiate ' +
          'it by passing it to React.createElement.' :
        // Check if it quacks like an element
        nextElement != null && nextElement.props !== undefined ?
          ' This may be caused by unintentionally loading two independent ' +
          'copies of React.' :
          ''
      )
    ) : invariant(ReactElement.isValidElement(nextElement)));

    var prevComponent = instancesByReactRootID[getReactRootID(container)];

    if (prevComponent) {
      var prevElement = prevComponent._currentElement;
      if (shouldUpdateReactComponent(prevElement, nextElement)) {
        return ReactMount._updateRootComponent(
          prevComponent,
          nextElement,
          container,
          callback
        ).getPublicInstance();
      } else {
        ReactMount.unmountComponentAtNode(container);
      }
    }

    var reactRootElement = getReactRootElementInContainer(container);
    var containerHasReactMarkup =
      reactRootElement && ReactMount.isRenderedByReact(reactRootElement);

    if ("production" !== process.env.NODE_ENV) {
      if (!containerHasReactMarkup || reactRootElement.nextSibling) {
        var rootElementSibling = reactRootElement;
        while (rootElementSibling) {
          if (ReactMount.isRenderedByReact(rootElementSibling)) {
            ("production" !== process.env.NODE_ENV ? warning(
              false,
              'render(): Target node has markup rendered by React, but there ' +
              'are unrelated nodes as well. This is most commonly caused by ' +
              'white-space inserted around server-rendered markup.'
            ) : null);
            break;
          }

          rootElementSibling = rootElementSibling.nextSibling;
        }
      }
    }

    var shouldReuseMarkup = containerHasReactMarkup && !prevComponent;

    var component = ReactMount._renderNewRootComponent(
      nextElement,
      container,
      shouldReuseMarkup
    ).getPublicInstance();
    if (callback) {
      callback.call(component);
    }
    return component;
  },

  /**
   * Constructs a component instance of `constructor` with `initialProps` and
   * renders it into the supplied `container`.
   *
   * @param {function} constructor React component constructor.
   * @param {?object} props Initial props of the component instance.
   * @param {DOMElement} container DOM element to render into.
   * @return {ReactComponent} Component instance rendered in `container`.
   */
  constructAndRenderComponent: function(constructor, props, container) {
    var element = ReactElement.createElement(constructor, props);
    return ReactMount.render(element, container);
  },

  /**
   * Constructs a component instance of `constructor` with `initialProps` and
   * renders it into a container node identified by supplied `id`.
   *
   * @param {function} componentConstructor React component constructor
   * @param {?object} props Initial props of the component instance.
   * @param {string} id ID of the DOM element to render into.
   * @return {ReactComponent} Component instance rendered in the container node.
   */
  constructAndRenderComponentByID: function(constructor, props, id) {
    var domNode = document.getElementById(id);
    ("production" !== process.env.NODE_ENV ? invariant(
      domNode,
      'Tried to get element with id of "%s" but it is not present on the page.',
      id
    ) : invariant(domNode));
    return ReactMount.constructAndRenderComponent(constructor, props, domNode);
  },

  /**
   * Registers a container node into which React components will be rendered.
   * This also creates the "reactRoot" ID that will be assigned to the element
   * rendered within.
   *
   * @param {DOMElement} container DOM element to register as a container.
   * @return {string} The "reactRoot" ID of elements rendered within.
   */
  registerContainer: function(container) {
    var reactRootID = getReactRootID(container);
    if (reactRootID) {
      // If one exists, make sure it is a valid "reactRoot" ID.
      reactRootID = ReactInstanceHandles.getReactRootIDFromNodeID(reactRootID);
    }
    if (!reactRootID) {
      // No valid "reactRoot" ID found, create one.
      reactRootID = ReactInstanceHandles.createReactRootID();
    }
    containersByReactRootID[reactRootID] = container;
    return reactRootID;
  },

  /**
   * Unmounts and destroys the React component rendered in the `container`.
   *
   * @param {DOMElement} container DOM element containing a React component.
   * @return {boolean} True if a component was found in and unmounted from
   *                   `container`
   */
  unmountComponentAtNode: function(container) {
    // Various parts of our code (such as ReactCompositeComponent's
    // _renderValidatedComponent) assume that calls to render aren't nested;
    // verify that that's the case. (Strictly speaking, unmounting won't cause a
    // render but we still don't expect to be in a render call here.)
    ("production" !== process.env.NODE_ENV ? warning(
      ReactCurrentOwner.current == null,
      'unmountComponentAtNode(): Render methods should be a pure function of ' +
      'props and state; triggering nested component updates from render is ' +
      'not allowed. If necessary, trigger nested updates in ' +
      'componentDidUpdate.'
    ) : null);

    ("production" !== process.env.NODE_ENV ? invariant(
      container && (
        (container.nodeType === ELEMENT_NODE_TYPE || container.nodeType === DOC_NODE_TYPE)
      ),
      'unmountComponentAtNode(...): Target container is not a DOM element.'
    ) : invariant(container && (
      (container.nodeType === ELEMENT_NODE_TYPE || container.nodeType === DOC_NODE_TYPE)
    )));

    var reactRootID = getReactRootID(container);
    var component = instancesByReactRootID[reactRootID];
    if (!component) {
      return false;
    }
    ReactMount.unmountComponentFromNode(component, container);
    delete instancesByReactRootID[reactRootID];
    delete containersByReactRootID[reactRootID];
    if ("production" !== process.env.NODE_ENV) {
      delete rootElementsByReactRootID[reactRootID];
    }
    return true;
  },

  /**
   * Unmounts a component and removes it from the DOM.
   *
   * @param {ReactComponent} instance React component instance.
   * @param {DOMElement} container DOM element to unmount from.
   * @final
   * @internal
   * @see {ReactMount.unmountComponentAtNode}
   */
  unmountComponentFromNode: function(instance, container) {
    ReactReconciler.unmountComponent(instance);

    if (container.nodeType === DOC_NODE_TYPE) {
      container = container.documentElement;
    }

    // http://jsperf.com/emptying-a-node
    while (container.lastChild) {
      container.removeChild(container.lastChild);
    }
  },

  /**
   * Finds the container DOM element that contains React component to which the
   * supplied DOM `id` belongs.
   *
   * @param {string} id The ID of an element rendered by a React component.
   * @return {?DOMElement} DOM element that contains the `id`.
   */
  findReactContainerForID: function(id) {
    var reactRootID = ReactInstanceHandles.getReactRootIDFromNodeID(id);
    var container = containersByReactRootID[reactRootID];

    if ("production" !== process.env.NODE_ENV) {
      var rootElement = rootElementsByReactRootID[reactRootID];
      if (rootElement && rootElement.parentNode !== container) {
        ("production" !== process.env.NODE_ENV ? invariant(
          // Call internalGetID here because getID calls isValid which calls
          // findReactContainerForID (this function).
          internalGetID(rootElement) === reactRootID,
          'ReactMount: Root element ID differed from reactRootID.'
        ) : invariant(// Call internalGetID here because getID calls isValid which calls
        // findReactContainerForID (this function).
        internalGetID(rootElement) === reactRootID));

        var containerChild = container.firstChild;
        if (containerChild &&
            reactRootID === internalGetID(containerChild)) {
          // If the container has a new child with the same ID as the old
          // root element, then rootElementsByReactRootID[reactRootID] is
          // just stale and needs to be updated. The case that deserves a
          // warning is when the container is empty.
          rootElementsByReactRootID[reactRootID] = containerChild;
        } else {
          ("production" !== process.env.NODE_ENV ? warning(
            false,
            'ReactMount: Root element has been removed from its original ' +
            'container. New container:', rootElement.parentNode
          ) : null);
        }
      }
    }

    return container;
  },

  /**
   * Finds an element rendered by React with the supplied ID.
   *
   * @param {string} id ID of a DOM node in the React component.
   * @return {DOMElement} Root DOM node of the React component.
   */
  findReactNodeByID: function(id) {
    var reactRoot = ReactMount.findReactContainerForID(id);
    return ReactMount.findComponentRoot(reactRoot, id);
  },

  /**
   * True if the supplied `node` is rendered by React.
   *
   * @param {*} node DOM Element to check.
   * @return {boolean} True if the DOM Element appears to be rendered by React.
   * @internal
   */
  isRenderedByReact: function(node) {
    if (node.nodeType !== 1) {
      // Not a DOMElement, therefore not a React component
      return false;
    }
    var id = ReactMount.getID(node);
    return id ? id.charAt(0) === SEPARATOR : false;
  },

  /**
   * Traverses up the ancestors of the supplied node to find a node that is a
   * DOM representation of a React component.
   *
   * @param {*} node
   * @return {?DOMEventTarget}
   * @internal
   */
  getFirstReactDOM: function(node) {
    var current = node;
    while (current && current.parentNode !== current) {
      if (ReactMount.isRenderedByReact(current)) {
        return current;
      }
      current = current.parentNode;
    }
    return null;
  },

  /**
   * Finds a node with the supplied `targetID` inside of the supplied
   * `ancestorNode`.  Exploits the ID naming scheme to perform the search
   * quickly.
   *
   * @param {DOMEventTarget} ancestorNode Search from this root.
   * @pararm {string} targetID ID of the DOM representation of the component.
   * @return {DOMEventTarget} DOM node with the supplied `targetID`.
   * @internal
   */
  findComponentRoot: function(ancestorNode, targetID) {
    var firstChildren = findComponentRootReusableArray;
    var childIndex = 0;

    var deepestAncestor = findDeepestCachedAncestor(targetID) || ancestorNode;

    firstChildren[0] = deepestAncestor.firstChild;
    firstChildren.length = 1;

    while (childIndex < firstChildren.length) {
      var child = firstChildren[childIndex++];
      var targetChild;

      while (child) {
        var childID = ReactMount.getID(child);
        if (childID) {
          // Even if we find the node we're looking for, we finish looping
          // through its siblings to ensure they're cached so that we don't have
          // to revisit this node again. Otherwise, we make n^2 calls to getID
          // when visiting the many children of a single node in order.

          if (targetID === childID) {
            targetChild = child;
          } else if (ReactInstanceHandles.isAncestorIDOf(childID, targetID)) {
            // If we find a child whose ID is an ancestor of the given ID,
            // then we can be sure that we only want to search the subtree
            // rooted at this child, so we can throw out the rest of the
            // search state.
            firstChildren.length = childIndex = 0;
            firstChildren.push(child.firstChild);
          }

        } else {
          // If this child had no ID, then there's a chance that it was
          // injected automatically by the browser, as when a `<table>`
          // element sprouts an extra `<tbody>` child as a side effect of
          // `.innerHTML` parsing. Optimistically continue down this
          // branch, but not before examining the other siblings.
          firstChildren.push(child.firstChild);
        }

        child = child.nextSibling;
      }

      if (targetChild) {
        // Emptying firstChildren/findComponentRootReusableArray is
        // not necessary for correctness, but it helps the GC reclaim
        // any nodes that were left at the end of the search.
        firstChildren.length = 0;

        return targetChild;
      }
    }

    firstChildren.length = 0;

    ("production" !== process.env.NODE_ENV ? invariant(
      false,
      'findComponentRoot(..., %s): Unable to find element. This probably ' +
      'means the DOM was unexpectedly mutated (e.g., by the browser), ' +
      'usually due to forgetting a <tbody> when using tables, nesting tags ' +
      'like <form>, <p>, or <a>, or using non-SVG elements in an <svg> ' +
      'parent. ' +
      'Try inspecting the child nodes of the element with React ID `%s`.',
      targetID,
      ReactMount.getID(ancestorNode)
    ) : invariant(false));
  },

  _mountImageIntoNode: function(markup, container, shouldReuseMarkup) {
    ("production" !== process.env.NODE_ENV ? invariant(
      container && (
        (container.nodeType === ELEMENT_NODE_TYPE || container.nodeType === DOC_NODE_TYPE)
      ),
      'mountComponentIntoNode(...): Target container is not valid.'
    ) : invariant(container && (
      (container.nodeType === ELEMENT_NODE_TYPE || container.nodeType === DOC_NODE_TYPE)
    )));

    if (shouldReuseMarkup) {
      var rootElement = getReactRootElementInContainer(container);
      if (ReactMarkupChecksum.canReuseMarkup(markup, rootElement)) {
        return;
      } else {
        var checksum = rootElement.getAttribute(
          ReactMarkupChecksum.CHECKSUM_ATTR_NAME
        );
        rootElement.removeAttribute(ReactMarkupChecksum.CHECKSUM_ATTR_NAME);

        var rootMarkup = rootElement.outerHTML;
        rootElement.setAttribute(
          ReactMarkupChecksum.CHECKSUM_ATTR_NAME,
          checksum
        );

        var diffIndex = firstDifferenceIndex(markup, rootMarkup);
        var difference = ' (client) ' +
          markup.substring(diffIndex - 20, diffIndex + 20) +
          '\n (server) ' + rootMarkup.substring(diffIndex - 20, diffIndex + 20);

        ("production" !== process.env.NODE_ENV ? invariant(
          container.nodeType !== DOC_NODE_TYPE,
          'You\'re trying to render a component to the document using ' +
          'server rendering but the checksum was invalid. This usually ' +
          'means you rendered a different component type or props on ' +
          'the client from the one on the server, or your render() ' +
          'methods are impure. React cannot handle this case due to ' +
          'cross-browser quirks by rendering at the document root. You ' +
          'should look for environment dependent code in your components ' +
          'and ensure the props are the same client and server side:\n%s',
          difference
        ) : invariant(container.nodeType !== DOC_NODE_TYPE));

        if ("production" !== process.env.NODE_ENV) {
          ("production" !== process.env.NODE_ENV ? warning(
            false,
            'React attempted to reuse markup in a container but the ' +
            'checksum was invalid. This generally means that you are ' +
            'using server rendering and the markup generated on the ' +
            'server was not what the client was expecting. React injected ' +
            'new markup to compensate which works but you have lost many ' +
            'of the benefits of server rendering. Instead, figure out ' +
            'why the markup being generated is different on the client ' +
            'or server:\n%s',
            difference
          ) : null);
        }
      }
    }

    ("production" !== process.env.NODE_ENV ? invariant(
      container.nodeType !== DOC_NODE_TYPE,
      'You\'re trying to render a component to the document but ' +
        'you didn\'t use server rendering. We can\'t do this ' +
        'without using server rendering due to cross-browser quirks. ' +
        'See React.renderToString() for server rendering.'
    ) : invariant(container.nodeType !== DOC_NODE_TYPE));

    setInnerHTML(container, markup);
  },

  /**
   * React ID utilities.
   */

  getReactRootID: getReactRootID,

  getID: getID,

  setID: setID,

  getNode: getNode,

  getNodeFromInstance: getNodeFromInstance,

  purgeID: purgeID
};

ReactPerf.measureMethods(ReactMount, 'ReactMount', {
  _renderNewRootComponent: '_renderNewRootComponent',
  _mountImageIntoNode: '_mountImageIntoNode'
});

module.exports = ReactMount;

}).call(this,require('_process'))
},{"./DOMProperty":16,"./ReactBrowserEventEmitter":37,"./ReactCurrentOwner":46,"./ReactElement":64,"./ReactElementValidator":65,"./ReactEmptyComponent":66,"./ReactInstanceHandles":73,"./ReactInstanceMap":74,"./ReactMarkupChecksum":76,"./ReactPerf":82,"./ReactReconciler":88,"./ReactUpdateQueue":93,"./ReactUpdates":94,"./containsNode":116,"./emptyObject":122,"./getReactRootElementInContainer":136,"./instantiateReactComponent":141,"./invariant":142,"./setInnerHTML":155,"./shouldUpdateReactComponent":158,"./warning":161,"_process":6}],78:[function(require,module,exports){
/**
 * Copyright 2013-2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule ReactMultiChild
 * @typechecks static-only
 */

'use strict';

var ReactComponentEnvironment = require("./ReactComponentEnvironment");
var ReactMultiChildUpdateTypes = require("./ReactMultiChildUpdateTypes");

var ReactReconciler = require("./ReactReconciler");
var ReactChildReconciler = require("./ReactChildReconciler");

/**
 * Updating children of a component may trigger recursive updates. The depth is
 * used to batch recursive updates to render markup more efficiently.
 *
 * @type {number}
 * @private
 */
var updateDepth = 0;

/**
 * Queue of update configuration objects.
 *
 * Each object has a `type` property that is in `ReactMultiChildUpdateTypes`.
 *
 * @type {array<object>}
 * @private
 */
var updateQueue = [];

/**
 * Queue of markup to be rendered.
 *
 * @type {array<string>}
 * @private
 */
var markupQueue = [];

/**
 * Enqueues markup to be rendered and inserted at a supplied index.
 *
 * @param {string} parentID ID of the parent component.
 * @param {string} markup Markup that renders into an element.
 * @param {number} toIndex Destination index.
 * @private
 */
function enqueueMarkup(parentID, markup, toIndex) {
  // NOTE: Null values reduce hidden classes.
  updateQueue.push({
    parentID: parentID,
    parentNode: null,
    type: ReactMultiChildUpdateTypes.INSERT_MARKUP,
    markupIndex: markupQueue.push(markup) - 1,
    textContent: null,
    fromIndex: null,
    toIndex: toIndex
  });
}

/**
 * Enqueues moving an existing element to another index.
 *
 * @param {string} parentID ID of the parent component.
 * @param {number} fromIndex Source index of the existing element.
 * @param {number} toIndex Destination index of the element.
 * @private
 */
function enqueueMove(parentID, fromIndex, toIndex) {
  // NOTE: Null values reduce hidden classes.
  updateQueue.push({
    parentID: parentID,
    parentNode: null,
    type: ReactMultiChildUpdateTypes.MOVE_EXISTING,
    markupIndex: null,
    textContent: null,
    fromIndex: fromIndex,
    toIndex: toIndex
  });
}

/**
 * Enqueues removing an element at an index.
 *
 * @param {string} parentID ID of the parent component.
 * @param {number} fromIndex Index of the element to remove.
 * @private
 */
function enqueueRemove(parentID, fromIndex) {
  // NOTE: Null values reduce hidden classes.
  updateQueue.push({
    parentID: parentID,
    parentNode: null,
    type: ReactMultiChildUpdateTypes.REMOVE_NODE,
    markupIndex: null,
    textContent: null,
    fromIndex: fromIndex,
    toIndex: null
  });
}

/**
 * Enqueues setting the text content.
 *
 * @param {string} parentID ID of the parent component.
 * @param {string} textContent Text content to set.
 * @private
 */
function enqueueTextContent(parentID, textContent) {
  // NOTE: Null values reduce hidden classes.
  updateQueue.push({
    parentID: parentID,
    parentNode: null,
    type: ReactMultiChildUpdateTypes.TEXT_CONTENT,
    markupIndex: null,
    textContent: textContent,
    fromIndex: null,
    toIndex: null
  });
}

/**
 * Processes any enqueued updates.
 *
 * @private
 */
function processQueue() {
  if (updateQueue.length) {
    ReactComponentEnvironment.processChildrenUpdates(
      updateQueue,
      markupQueue
    );
    clearQueue();
  }
}

/**
 * Clears any enqueued updates.
 *
 * @private
 */
function clearQueue() {
  updateQueue.length = 0;
  markupQueue.length = 0;
}

/**
 * ReactMultiChild are capable of reconciling multiple children.
 *
 * @class ReactMultiChild
 * @internal
 */
var ReactMultiChild = {

  /**
   * Provides common functionality for components that must reconcile multiple
   * children. This is used by `ReactDOMComponent` to mount, update, and
   * unmount child components.
   *
   * @lends {ReactMultiChild.prototype}
   */
  Mixin: {

    /**
     * Generates a "mount image" for each of the supplied children. In the case
     * of `ReactDOMComponent`, a mount image is a string of markup.
     *
     * @param {?object} nestedChildren Nested child maps.
     * @return {array} An array of mounted representations.
     * @internal
     */
    mountChildren: function(nestedChildren, transaction, context) {
      var children = ReactChildReconciler.instantiateChildren(
        nestedChildren, transaction, context
      );
      this._renderedChildren = children;
      var mountImages = [];
      var index = 0;
      for (var name in children) {
        if (children.hasOwnProperty(name)) {
          var child = children[name];
          // Inlined for performance, see `ReactInstanceHandles.createReactID`.
          var rootID = this._rootNodeID + name;
          var mountImage = ReactReconciler.mountComponent(
            child,
            rootID,
            transaction,
            context
          );
          child._mountIndex = index;
          mountImages.push(mountImage);
          index++;
        }
      }
      return mountImages;
    },

    /**
     * Replaces any rendered children with a text content string.
     *
     * @param {string} nextContent String of content.
     * @internal
     */
    updateTextContent: function(nextContent) {
      updateDepth++;
      var errorThrown = true;
      try {
        var prevChildren = this._renderedChildren;
        // Remove any rendered children.
        ReactChildReconciler.unmountChildren(prevChildren);
        // TODO: The setTextContent operation should be enough
        for (var name in prevChildren) {
          if (prevChildren.hasOwnProperty(name)) {
            this._unmountChildByName(prevChildren[name], name);
          }
        }
        // Set new text content.
        this.setTextContent(nextContent);
        errorThrown = false;
      } finally {
        updateDepth--;
        if (!updateDepth) {
          if (errorThrown) {
            clearQueue();
          } else {
            processQueue();
          }
        }
      }
    },

    /**
     * Updates the rendered children with new children.
     *
     * @param {?object} nextNestedChildren Nested child maps.
     * @param {ReactReconcileTransaction} transaction
     * @internal
     */
    updateChildren: function(nextNestedChildren, transaction, context) {
      updateDepth++;
      var errorThrown = true;
      try {
        this._updateChildren(nextNestedChildren, transaction, context);
        errorThrown = false;
      } finally {
        updateDepth--;
        if (!updateDepth) {
          if (errorThrown) {
            clearQueue();
          } else {
            processQueue();
          }
        }

      }
    },

    /**
     * Improve performance by isolating this hot code path from the try/catch
     * block in `updateChildren`.
     *
     * @param {?object} nextNestedChildren Nested child maps.
     * @param {ReactReconcileTransaction} transaction
     * @final
     * @protected
     */
    _updateChildren: function(nextNestedChildren, transaction, context) {
      var prevChildren = this._renderedChildren;
      var nextChildren = ReactChildReconciler.updateChildren(
        prevChildren, nextNestedChildren, transaction, context
      );
      this._renderedChildren = nextChildren;
      if (!nextChildren && !prevChildren) {
        return;
      }
      var name;
      // `nextIndex` will increment for each child in `nextChildren`, but
      // `lastIndex` will be the last index visited in `prevChildren`.
      var lastIndex = 0;
      var nextIndex = 0;
      for (name in nextChildren) {
        if (!nextChildren.hasOwnProperty(name)) {
          continue;
        }
        var prevChild = prevChildren && prevChildren[name];
        var nextChild = nextChildren[name];
        if (prevChild === nextChild) {
          this.moveChild(prevChild, nextIndex, lastIndex);
          lastIndex = Math.max(prevChild._mountIndex, lastIndex);
          prevChild._mountIndex = nextIndex;
        } else {
          if (prevChild) {
            // Update `lastIndex` before `_mountIndex` gets unset by unmounting.
            lastIndex = Math.max(prevChild._mountIndex, lastIndex);
            this._unmountChildByName(prevChild, name);
          }
          // The child must be instantiated before it's mounted.
          this._mountChildByNameAtIndex(
            nextChild, name, nextIndex, transaction, context
          );
        }
        nextIndex++;
      }
      // Remove children that are no longer present.
      for (name in prevChildren) {
        if (prevChildren.hasOwnProperty(name) &&
            !(nextChildren && nextChildren.hasOwnProperty(name))) {
          this._unmountChildByName(prevChildren[name], name);
        }
      }
    },

    /**
     * Unmounts all rendered children. This should be used to clean up children
     * when this component is unmounted.
     *
     * @internal
     */
    unmountChildren: function() {
      var renderedChildren = this._renderedChildren;
      ReactChildReconciler.unmountChildren(renderedChildren);
      this._renderedChildren = null;
    },

    /**
     * Moves a child component to the supplied index.
     *
     * @param {ReactComponent} child Component to move.
     * @param {number} toIndex Destination index of the element.
     * @param {number} lastIndex Last index visited of the siblings of `child`.
     * @protected
     */
    moveChild: function(child, toIndex, lastIndex) {
      // If the index of `child` is less than `lastIndex`, then it needs to
      // be moved. Otherwise, we do not need to move it because a child will be
      // inserted or moved before `child`.
      if (child._mountIndex < lastIndex) {
        enqueueMove(this._rootNodeID, child._mountIndex, toIndex);
      }
    },

    /**
     * Creates a child component.
     *
     * @param {ReactComponent} child Component to create.
     * @param {string} mountImage Markup to insert.
     * @protected
     */
    createChild: function(child, mountImage) {
      enqueueMarkup(this._rootNodeID, mountImage, child._mountIndex);
    },

    /**
     * Removes a child component.
     *
     * @param {ReactComponent} child Child to remove.
     * @protected
     */
    removeChild: function(child) {
      enqueueRemove(this._rootNodeID, child._mountIndex);
    },

    /**
     * Sets this text content string.
     *
     * @param {string} textContent Text content to set.
     * @protected
     */
    setTextContent: function(textContent) {
      enqueueTextContent(this._rootNodeID, textContent);
    },

    /**
     * Mounts a child with the supplied name.
     *
     * NOTE: This is part of `updateChildren` and is here for readability.
     *
     * @param {ReactComponent} child Component to mount.
     * @param {string} name Name of the child.
     * @param {number} index Index at which to insert the child.
     * @param {ReactReconcileTransaction} transaction
     * @private
     */
    _mountChildByNameAtIndex: function(
      child,
      name,
      index,
      transaction,
      context) {
      // Inlined for performance, see `ReactInstanceHandles.createReactID`.
      var rootID = this._rootNodeID + name;
      var mountImage = ReactReconciler.mountComponent(
        child,
        rootID,
        transaction,
        context
      );
      child._mountIndex = index;
      this.createChild(child, mountImage);
    },

    /**
     * Unmounts a rendered child by name.
     *
     * NOTE: This is part of `updateChildren` and is here for readability.
     *
     * @param {ReactComponent} child Component to unmount.
     * @param {string} name Name of the child in `this._renderedChildren`.
     * @private
     */
    _unmountChildByName: function(child, name) {
      this.removeChild(child);
      child._mountIndex = null;
    }

  }

};

module.exports = ReactMultiChild;

},{"./ReactChildReconciler":38,"./ReactComponentEnvironment":43,"./ReactMultiChildUpdateTypes":79,"./ReactReconciler":88}],79:[function(require,module,exports){
/**
 * Copyright 2013-2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule ReactMultiChildUpdateTypes
 */

'use strict';

var keyMirror = require("./keyMirror");

/**
 * When a component's children are updated, a series of update configuration
 * objects are created in order to batch and serialize the required changes.
 *
 * Enumerates all the possible types of update configurations.
 *
 * @internal
 */
var ReactMultiChildUpdateTypes = keyMirror({
  INSERT_MARKUP: null,
  MOVE_EXISTING: null,
  REMOVE_NODE: null,
  TEXT_CONTENT: null
});

module.exports = ReactMultiChildUpdateTypes;

},{"./keyMirror":147}],80:[function(require,module,exports){
(function (process){
/**
 * Copyright 2014-2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule ReactNativeComponent
 */

'use strict';

var assign = require("./Object.assign");
var invariant = require("./invariant");

var autoGenerateWrapperClass = null;
var genericComponentClass = null;
// This registry keeps track of wrapper classes around native tags
var tagToComponentClass = {};
var textComponentClass = null;

var ReactNativeComponentInjection = {
  // This accepts a class that receives the tag string. This is a catch all
  // that can render any kind of tag.
  injectGenericComponentClass: function(componentClass) {
    genericComponentClass = componentClass;
  },
  // This accepts a text component class that takes the text string to be
  // rendered as props.
  injectTextComponentClass: function(componentClass) {
    textComponentClass = componentClass;
  },
  // This accepts a keyed object with classes as values. Each key represents a
  // tag. That particular tag will use this class instead of the generic one.
  injectComponentClasses: function(componentClasses) {
    assign(tagToComponentClass, componentClasses);
  },
  // Temporary hack since we expect DOM refs to behave like composites,
  // for this release.
  injectAutoWrapper: function(wrapperFactory) {
    autoGenerateWrapperClass = wrapperFactory;
  }
};

/**
 * Get a composite component wrapper class for a specific tag.
 *
 * @param {ReactElement} element The tag for which to get the class.
 * @return {function} The React class constructor function.
 */
function getComponentClassForElement(element) {
  if (typeof element.type === 'function') {
    return element.type;
  }
  var tag = element.type;
  var componentClass = tagToComponentClass[tag];
  if (componentClass == null) {
    tagToComponentClass[tag] = componentClass = autoGenerateWrapperClass(tag);
  }
  return componentClass;
}

/**
 * Get a native internal component class for a specific tag.
 *
 * @param {ReactElement} element The element to create.
 * @return {function} The internal class constructor function.
 */
function createInternalComponent(element) {
  ("production" !== process.env.NODE_ENV ? invariant(
    genericComponentClass,
    'There is no registered component for the tag %s',
    element.type
  ) : invariant(genericComponentClass));
  return new genericComponentClass(element.type, element.props);
}

/**
 * @param {ReactText} text
 * @return {ReactComponent}
 */
function createInstanceForText(text) {
  return new textComponentClass(text);
}

/**
 * @param {ReactComponent} component
 * @return {boolean}
 */
function isTextComponent(component) {
  return component instanceof textComponentClass;
}

var ReactNativeComponent = {
  getComponentClassForElement: getComponentClassForElement,
  createInternalComponent: createInternalComponent,
  createInstanceForText: createInstanceForText,
  isTextComponent: isTextComponent,
  injection: ReactNativeComponentInjection
};

module.exports = ReactNativeComponent;

}).call(this,require('_process'))
},{"./Object.assign":33,"./invariant":142,"_process":6}],81:[function(require,module,exports){
(function (process){
/**
 * Copyright 2013-2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule ReactOwner
 */

'use strict';

var invariant = require("./invariant");

/**
 * ReactOwners are capable of storing references to owned components.
 *
 * All components are capable of //being// referenced by owner components, but
 * only ReactOwner components are capable of //referencing// owned components.
 * The named reference is known as a "ref".
 *
 * Refs are available when mounted and updated during reconciliation.
 *
 *   var MyComponent = React.createClass({
 *     render: function() {
 *       return (
 *         <div onClick={this.handleClick}>
 *           <CustomComponent ref="custom" />
 *         </div>
 *       );
 *     },
 *     handleClick: function() {
 *       this.refs.custom.handleClick();
 *     },
 *     componentDidMount: function() {
 *       this.refs.custom.initialize();
 *     }
 *   });
 *
 * Refs should rarely be used. When refs are used, they should only be done to
 * control data that is not handled by React's data flow.
 *
 * @class ReactOwner
 */
var ReactOwner = {

  /**
   * @param {?object} object
   * @return {boolean} True if `object` is a valid owner.
   * @final
   */
  isValidOwner: function(object) {
    return !!(
      (object &&
      typeof object.attachRef === 'function' && typeof object.detachRef === 'function')
    );
  },

  /**
   * Adds a component by ref to an owner component.
   *
   * @param {ReactComponent} component Component to reference.
   * @param {string} ref Name by which to refer to the component.
   * @param {ReactOwner} owner Component on which to record the ref.
   * @final
   * @internal
   */
  addComponentAsRefTo: function(component, ref, owner) {
    ("production" !== process.env.NODE_ENV ? invariant(
      ReactOwner.isValidOwner(owner),
      'addComponentAsRefTo(...): Only a ReactOwner can have refs. This ' +
      'usually means that you\'re trying to add a ref to a component that ' +
      'doesn\'t have an owner (that is, was not created inside of another ' +
      'component\'s `render` method). Try rendering this component inside of ' +
      'a new top-level component which will hold the ref.'
    ) : invariant(ReactOwner.isValidOwner(owner)));
    owner.attachRef(ref, component);
  },

  /**
   * Removes a component by ref from an owner component.
   *
   * @param {ReactComponent} component Component to dereference.
   * @param {string} ref Name of the ref to remove.
   * @param {ReactOwner} owner Component on which the ref is recorded.
   * @final
   * @internal
   */
  removeComponentAsRefFrom: function(component, ref, owner) {
    ("production" !== process.env.NODE_ENV ? invariant(
      ReactOwner.isValidOwner(owner),
      'removeComponentAsRefFrom(...): Only a ReactOwner can have refs. This ' +
      'usually means that you\'re trying to remove a ref to a component that ' +
      'doesn\'t have an owner (that is, was not created inside of another ' +
      'component\'s `render` method). Try rendering this component inside of ' +
      'a new top-level component which will hold the ref.'
    ) : invariant(ReactOwner.isValidOwner(owner)));
    // Check that `component` is still the current ref because we do not want to
    // detach the ref if another component stole it.
    if (owner.getPublicInstance().refs[ref] === component.getPublicInstance()) {
      owner.detachRef(ref);
    }
  }

};

module.exports = ReactOwner;

}).call(this,require('_process'))
},{"./invariant":142,"_process":6}],82:[function(require,module,exports){
(function (process){
/**
 * Copyright 2013-2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule ReactPerf
 * @typechecks static-only
 */

'use strict';

/**
 * ReactPerf is a general AOP system designed to measure performance. This
 * module only has the hooks: see ReactDefaultPerf for the analysis tool.
 */
var ReactPerf = {
  /**
   * Boolean to enable/disable measurement. Set to false by default to prevent
   * accidental logging and perf loss.
   */
  enableMeasure: false,

  /**
   * Holds onto the measure function in use. By default, don't measure
   * anything, but we'll override this if we inject a measure function.
   */
  storedMeasure: _noMeasure,

  /**
   * @param {object} object
   * @param {string} objectName
   * @param {object<string>} methodNames
   */
  measureMethods: function(object, objectName, methodNames) {
    if ("production" !== process.env.NODE_ENV) {
      for (var key in methodNames) {
        if (!methodNames.hasOwnProperty(key)) {
          continue;
        }
        object[key] = ReactPerf.measure(
          objectName,
          methodNames[key],
          object[key]
        );
      }
    }
  },

  /**
   * Use this to wrap methods you want to measure. Zero overhead in production.
   *
   * @param {string} objName
   * @param {string} fnName
   * @param {function} func
   * @return {function}
   */
  measure: function(objName, fnName, func) {
    if ("production" !== process.env.NODE_ENV) {
      var measuredFunc = null;
      var wrapper = function() {
        if (ReactPerf.enableMeasure) {
          if (!measuredFunc) {
            measuredFunc = ReactPerf.storedMeasure(objName, fnName, func);
          }
          return measuredFunc.apply(this, arguments);
        }
        return func.apply(this, arguments);
      };
      wrapper.displayName = objName + '_' + fnName;
      return wrapper;
    }
    return func;
  },

  injection: {
    /**
     * @param {function} measure
     */
    injectMeasure: function(measure) {
      ReactPerf.storedMeasure = measure;
    }
  }
};

/**
 * Simply passes through the measured function, without measuring it.
 *
 * @param {string} objName
 * @param {string} fnName
 * @param {function} func
 * @return {function}
 */
function _noMeasure(objName, fnName, func) {
  return func;
}

module.exports = ReactPerf;

}).call(this,require('_process'))
},{"_process":6}],83:[function(require,module,exports){
(function (process){
/**
 * Copyright 2013-2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule ReactPropTypeLocationNames
 */

'use strict';

var ReactPropTypeLocationNames = {};

if ("production" !== process.env.NODE_ENV) {
  ReactPropTypeLocationNames = {
    prop: 'prop',
    context: 'context',
    childContext: 'child context'
  };
}

module.exports = ReactPropTypeLocationNames;

}).call(this,require('_process'))
},{"_process":6}],84:[function(require,module,exports){
/**
 * Copyright 2013-2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule ReactPropTypeLocations
 */

'use strict';

var keyMirror = require("./keyMirror");

var ReactPropTypeLocations = keyMirror({
  prop: null,
  context: null,
  childContext: null
});

module.exports = ReactPropTypeLocations;

},{"./keyMirror":147}],85:[function(require,module,exports){
/**
 * Copyright 2013-2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule ReactPropTypes
 */

'use strict';

var ReactElement = require("./ReactElement");
var ReactFragment = require("./ReactFragment");
var ReactPropTypeLocationNames = require("./ReactPropTypeLocationNames");

var emptyFunction = require("./emptyFunction");

/**
 * Collection of methods that allow declaration and validation of props that are
 * supplied to React components. Example usage:
 *
 *   var Props = require('ReactPropTypes');
 *   var MyArticle = React.createClass({
 *     propTypes: {
 *       // An optional string prop named "description".
 *       description: Props.string,
 *
 *       // A required enum prop named "category".
 *       category: Props.oneOf(['News','Photos']).isRequired,
 *
 *       // A prop named "dialog" that requires an instance of Dialog.
 *       dialog: Props.instanceOf(Dialog).isRequired
 *     },
 *     render: function() { ... }
 *   });
 *
 * A more formal specification of how these methods are used:
 *
 *   type := array|bool|func|object|number|string|oneOf([...])|instanceOf(...)
 *   decl := ReactPropTypes.{type}(.isRequired)?
 *
 * Each and every declaration produces a function with the same signature. This
 * allows the creation of custom validation functions. For example:
 *
 *  var MyLink = React.createClass({
 *    propTypes: {
 *      // An optional string or URI prop named "href".
 *      href: function(props, propName, componentName) {
 *        var propValue = props[propName];
 *        if (propValue != null && typeof propValue !== 'string' &&
 *            !(propValue instanceof URI)) {
 *          return new Error(
 *            'Expected a string or an URI for ' + propName + ' in ' +
 *            componentName
 *          );
 *        }
 *      }
 *    },
 *    render: function() {...}
 *  });
 *
 * @internal
 */

var ANONYMOUS = '<<anonymous>>';

var elementTypeChecker = createElementTypeChecker();
var nodeTypeChecker = createNodeChecker();

var ReactPropTypes = {
  array: createPrimitiveTypeChecker('array'),
  bool: createPrimitiveTypeChecker('boolean'),
  func: createPrimitiveTypeChecker('function'),
  number: createPrimitiveTypeChecker('number'),
  object: createPrimitiveTypeChecker('object'),
  string: createPrimitiveTypeChecker('string'),

  any: createAnyTypeChecker(),
  arrayOf: createArrayOfTypeChecker,
  element: elementTypeChecker,
  instanceOf: createInstanceTypeChecker,
  node: nodeTypeChecker,
  objectOf: createObjectOfTypeChecker,
  oneOf: createEnumTypeChecker,
  oneOfType: createUnionTypeChecker,
  shape: createShapeTypeChecker
};

function createChainableTypeChecker(validate) {
  function checkType(isRequired, props, propName, componentName, location) {
    componentName = componentName || ANONYMOUS;
    if (props[propName] == null) {
      var locationName = ReactPropTypeLocationNames[location];
      if (isRequired) {
        return new Error(
          ("Required " + locationName + " `" + propName + "` was not specified in ") +
          ("`" + componentName + "`.")
        );
      }
      return null;
    } else {
      return validate(props, propName, componentName, location);
    }
  }

  var chainedCheckType = checkType.bind(null, false);
  chainedCheckType.isRequired = checkType.bind(null, true);

  return chainedCheckType;
}

function createPrimitiveTypeChecker(expectedType) {
  function validate(props, propName, componentName, location) {
    var propValue = props[propName];
    var propType = getPropType(propValue);
    if (propType !== expectedType) {
      var locationName = ReactPropTypeLocationNames[location];
      // `propValue` being instance of, say, date/regexp, pass the 'object'
      // check, but we can offer a more precise error message here rather than
      // 'of type `object`'.
      var preciseType = getPreciseType(propValue);

      return new Error(
        ("Invalid " + locationName + " `" + propName + "` of type `" + preciseType + "` ") +
        ("supplied to `" + componentName + "`, expected `" + expectedType + "`.")
      );
    }
    return null;
  }
  return createChainableTypeChecker(validate);
}

function createAnyTypeChecker() {
  return createChainableTypeChecker(emptyFunction.thatReturns(null));
}

function createArrayOfTypeChecker(typeChecker) {
  function validate(props, propName, componentName, location) {
    var propValue = props[propName];
    if (!Array.isArray(propValue)) {
      var locationName = ReactPropTypeLocationNames[location];
      var propType = getPropType(propValue);
      return new Error(
        ("Invalid " + locationName + " `" + propName + "` of type ") +
        ("`" + propType + "` supplied to `" + componentName + "`, expected an array.")
      );
    }
    for (var i = 0; i < propValue.length; i++) {
      var error = typeChecker(propValue, i, componentName, location);
      if (error instanceof Error) {
        return error;
      }
    }
    return null;
  }
  return createChainableTypeChecker(validate);
}

function createElementTypeChecker() {
  function validate(props, propName, componentName, location) {
    if (!ReactElement.isValidElement(props[propName])) {
      var locationName = ReactPropTypeLocationNames[location];
      return new Error(
        ("Invalid " + locationName + " `" + propName + "` supplied to ") +
        ("`" + componentName + "`, expected a ReactElement.")
      );
    }
    return null;
  }
  return createChainableTypeChecker(validate);
}

function createInstanceTypeChecker(expectedClass) {
  function validate(props, propName, componentName, location) {
    if (!(props[propName] instanceof expectedClass)) {
      var locationName = ReactPropTypeLocationNames[location];
      var expectedClassName = expectedClass.name || ANONYMOUS;
      return new Error(
        ("Invalid " + locationName + " `" + propName + "` supplied to ") +
        ("`" + componentName + "`, expected instance of `" + expectedClassName + "`.")
      );
    }
    return null;
  }
  return createChainableTypeChecker(validate);
}

function createEnumTypeChecker(expectedValues) {
  function validate(props, propName, componentName, location) {
    var propValue = props[propName];
    for (var i = 0; i < expectedValues.length; i++) {
      if (propValue === expectedValues[i]) {
        return null;
      }
    }

    var locationName = ReactPropTypeLocationNames[location];
    var valuesString = JSON.stringify(expectedValues);
    return new Error(
      ("Invalid " + locationName + " `" + propName + "` of value `" + propValue + "` ") +
      ("supplied to `" + componentName + "`, expected one of " + valuesString + ".")
    );
  }
  return createChainableTypeChecker(validate);
}

function createObjectOfTypeChecker(typeChecker) {
  function validate(props, propName, componentName, location) {
    var propValue = props[propName];
    var propType = getPropType(propValue);
    if (propType !== 'object') {
      var locationName = ReactPropTypeLocationNames[location];
      return new Error(
        ("Invalid " + locationName + " `" + propName + "` of type ") +
        ("`" + propType + "` supplied to `" + componentName + "`, expected an object.")
      );
    }
    for (var key in propValue) {
      if (propValue.hasOwnProperty(key)) {
        var error = typeChecker(propValue, key, componentName, location);
        if (error instanceof Error) {
          return error;
        }
      }
    }
    return null;
  }
  return createChainableTypeChecker(validate);
}

function createUnionTypeChecker(arrayOfTypeCheckers) {
  function validate(props, propName, componentName, location) {
    for (var i = 0; i < arrayOfTypeCheckers.length; i++) {
      var checker = arrayOfTypeCheckers[i];
      if (checker(props, propName, componentName, location) == null) {
        return null;
      }
    }

    var locationName = ReactPropTypeLocationNames[location];
    return new Error(
      ("Invalid " + locationName + " `" + propName + "` supplied to ") +
      ("`" + componentName + "`.")
    );
  }
  return createChainableTypeChecker(validate);
}

function createNodeChecker() {
  function validate(props, propName, componentName, location) {
    if (!isNode(props[propName])) {
      var locationName = ReactPropTypeLocationNames[location];
      return new Error(
        ("Invalid " + locationName + " `" + propName + "` supplied to ") +
        ("`" + componentName + "`, expected a ReactNode.")
      );
    }
    return null;
  }
  return createChainableTypeChecker(validate);
}

function createShapeTypeChecker(shapeTypes) {
  function validate(props, propName, componentName, location) {
    var propValue = props[propName];
    var propType = getPropType(propValue);
    if (propType !== 'object') {
      var locationName = ReactPropTypeLocationNames[location];
      return new Error(
        ("Invalid " + locationName + " `" + propName + "` of type `" + propType + "` ") +
        ("supplied to `" + componentName + "`, expected `object`.")
      );
    }
    for (var key in shapeTypes) {
      var checker = shapeTypes[key];
      if (!checker) {
        continue;
      }
      var error = checker(propValue, key, componentName, location);
      if (error) {
        return error;
      }
    }
    return null;
  }
  return createChainableTypeChecker(validate);
}

function isNode(propValue) {
  switch (typeof propValue) {
    case 'number':
    case 'string':
    case 'undefined':
      return true;
    case 'boolean':
      return !propValue;
    case 'object':
      if (Array.isArray(propValue)) {
        return propValue.every(isNode);
      }
      if (propValue === null || ReactElement.isValidElement(propValue)) {
        return true;
      }
      propValue = ReactFragment.extractIfFragment(propValue);
      for (var k in propValue) {
        if (!isNode(propValue[k])) {
          return false;
        }
      }
      return true;
    default:
      return false;
  }
}

// Equivalent of `typeof` but with special handling for array and regexp.
function getPropType(propValue) {
  var propType = typeof propValue;
  if (Array.isArray(propValue)) {
    return 'array';
  }
  if (propValue instanceof RegExp) {
    // Old webkits (at least until Android 4.0) return 'function' rather than
    // 'object' for typeof a RegExp. We'll normalize this here so that /bla/
    // passes PropTypes.object.
    return 'object';
  }
  return propType;
}

// This handles more types than `getPropType`. Only used for error messages.
// See `createPrimitiveTypeChecker`.
function getPreciseType(propValue) {
  var propType = getPropType(propValue);
  if (propType === 'object') {
    if (propValue instanceof Date) {
      return 'date';
    } else if (propValue instanceof RegExp) {
      return 'regexp';
    }
  }
  return propType;
}

module.exports = ReactPropTypes;

},{"./ReactElement":64,"./ReactFragment":70,"./ReactPropTypeLocationNames":83,"./emptyFunction":121}],86:[function(require,module,exports){
/**
 * Copyright 2013-2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule ReactPutListenerQueue
 */

'use strict';

var PooledClass = require("./PooledClass");
var ReactBrowserEventEmitter = require("./ReactBrowserEventEmitter");

var assign = require("./Object.assign");

function ReactPutListenerQueue() {
  this.listenersToPut = [];
}

assign(ReactPutListenerQueue.prototype, {
  enqueuePutListener: function(rootNodeID, propKey, propValue) {
    this.listenersToPut.push({
      rootNodeID: rootNodeID,
      propKey: propKey,
      propValue: propValue
    });
  },

  putListeners: function() {
    for (var i = 0; i < this.listenersToPut.length; i++) {
      var listenerToPut = this.listenersToPut[i];
      ReactBrowserEventEmitter.putListener(
        listenerToPut.rootNodeID,
        listenerToPut.propKey,
        listenerToPut.propValue
      );
    }
  },

  reset: function() {
    this.listenersToPut.length = 0;
  },

  destructor: function() {
    this.reset();
  }
});

PooledClass.addPoolingTo(ReactPutListenerQueue);

module.exports = ReactPutListenerQueue;

},{"./Object.assign":33,"./PooledClass":34,"./ReactBrowserEventEmitter":37}],87:[function(require,module,exports){
/**
 * Copyright 2013-2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule ReactReconcileTransaction
 * @typechecks static-only
 */

'use strict';

var CallbackQueue = require("./CallbackQueue");
var PooledClass = require("./PooledClass");
var ReactBrowserEventEmitter = require("./ReactBrowserEventEmitter");
var ReactInputSelection = require("./ReactInputSelection");
var ReactPutListenerQueue = require("./ReactPutListenerQueue");
var Transaction = require("./Transaction");

var assign = require("./Object.assign");

/**
 * Ensures that, when possible, the selection range (currently selected text
 * input) is not disturbed by performing the transaction.
 */
var SELECTION_RESTORATION = {
  /**
   * @return {Selection} Selection information.
   */
  initialize: ReactInputSelection.getSelectionInformation,
  /**
   * @param {Selection} sel Selection information returned from `initialize`.
   */
  close: ReactInputSelection.restoreSelection
};

/**
 * Suppresses events (blur/focus) that could be inadvertently dispatched due to
 * high level DOM manipulations (like temporarily removing a text input from the
 * DOM).
 */
var EVENT_SUPPRESSION = {
  /**
   * @return {boolean} The enabled status of `ReactBrowserEventEmitter` before
   * the reconciliation.
   */
  initialize: function() {
    var currentlyEnabled = ReactBrowserEventEmitter.isEnabled();
    ReactBrowserEventEmitter.setEnabled(false);
    return currentlyEnabled;
  },

  /**
   * @param {boolean} previouslyEnabled Enabled status of
   *   `ReactBrowserEventEmitter` before the reconciliation occured. `close`
   *   restores the previous value.
   */
  close: function(previouslyEnabled) {
    ReactBrowserEventEmitter.setEnabled(previouslyEnabled);
  }
};

/**
 * Provides a queue for collecting `componentDidMount` and
 * `componentDidUpdate` callbacks during the the transaction.
 */
var ON_DOM_READY_QUEUEING = {
  /**
   * Initializes the internal `onDOMReady` queue.
   */
  initialize: function() {
    this.reactMountReady.reset();
  },

  /**
   * After DOM is flushed, invoke all registered `onDOMReady` callbacks.
   */
  close: function() {
    this.reactMountReady.notifyAll();
  }
};

var PUT_LISTENER_QUEUEING = {
  initialize: function() {
    this.putListenerQueue.reset();
  },

  close: function() {
    this.putListenerQueue.putListeners();
  }
};

/**
 * Executed within the scope of the `Transaction` instance. Consider these as
 * being member methods, but with an implied ordering while being isolated from
 * each other.
 */
var TRANSACTION_WRAPPERS = [
  PUT_LISTENER_QUEUEING,
  SELECTION_RESTORATION,
  EVENT_SUPPRESSION,
  ON_DOM_READY_QUEUEING
];

/**
 * Currently:
 * - The order that these are listed in the transaction is critical:
 * - Suppresses events.
 * - Restores selection range.
 *
 * Future:
 * - Restore document/overflow scroll positions that were unintentionally
 *   modified via DOM insertions above the top viewport boundary.
 * - Implement/integrate with customized constraint based layout system and keep
 *   track of which dimensions must be remeasured.
 *
 * @class ReactReconcileTransaction
 */
function ReactReconcileTransaction() {
  this.reinitializeTransaction();
  // Only server-side rendering really needs this option (see
  // `ReactServerRendering`), but server-side uses
  // `ReactServerRenderingTransaction` instead. This option is here so that it's
  // accessible and defaults to false when `ReactDOMComponent` and
  // `ReactTextComponent` checks it in `mountComponent`.`
  this.renderToStaticMarkup = false;
  this.reactMountReady = CallbackQueue.getPooled(null);
  this.putListenerQueue = ReactPutListenerQueue.getPooled();
}

var Mixin = {
  /**
   * @see Transaction
   * @abstract
   * @final
   * @return {array<object>} List of operation wrap proceedures.
   *   TODO: convert to array<TransactionWrapper>
   */
  getTransactionWrappers: function() {
    return TRANSACTION_WRAPPERS;
  },

  /**
   * @return {object} The queue to collect `onDOMReady` callbacks with.
   */
  getReactMountReady: function() {
    return this.reactMountReady;
  },

  getPutListenerQueue: function() {
    return this.putListenerQueue;
  },

  /**
   * `PooledClass` looks for this, and will invoke this before allowing this
   * instance to be resused.
   */
  destructor: function() {
    CallbackQueue.release(this.reactMountReady);
    this.reactMountReady = null;

    ReactPutListenerQueue.release(this.putListenerQueue);
    this.putListenerQueue = null;
  }
};


assign(ReactReconcileTransaction.prototype, Transaction.Mixin, Mixin);

PooledClass.addPoolingTo(ReactReconcileTransaction);

module.exports = ReactReconcileTransaction;

},{"./CallbackQueue":12,"./Object.assign":33,"./PooledClass":34,"./ReactBrowserEventEmitter":37,"./ReactInputSelection":72,"./ReactPutListenerQueue":86,"./Transaction":110}],88:[function(require,module,exports){
(function (process){
/**
 * Copyright 2013-2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule ReactReconciler
 */

'use strict';

var ReactRef = require("./ReactRef");
var ReactElementValidator = require("./ReactElementValidator");

/**
 * Helper to call ReactRef.attachRefs with this composite component, split out
 * to avoid allocations in the transaction mount-ready queue.
 */
function attachRefs() {
  ReactRef.attachRefs(this, this._currentElement);
}

var ReactReconciler = {

  /**
   * Initializes the component, renders markup, and registers event listeners.
   *
   * @param {ReactComponent} internalInstance
   * @param {string} rootID DOM ID of the root node.
   * @param {ReactReconcileTransaction|ReactServerRenderingTransaction} transaction
   * @return {?string} Rendered markup to be inserted into the DOM.
   * @final
   * @internal
   */
  mountComponent: function(internalInstance, rootID, transaction, context) {
    var markup = internalInstance.mountComponent(rootID, transaction, context);
    if ("production" !== process.env.NODE_ENV) {
      ReactElementValidator.checkAndWarnForMutatedProps(
        internalInstance._currentElement
      );
    }
    transaction.getReactMountReady().enqueue(attachRefs, internalInstance);
    return markup;
  },

  /**
   * Releases any resources allocated by `mountComponent`.
   *
   * @final
   * @internal
   */
  unmountComponent: function(internalInstance) {
    ReactRef.detachRefs(internalInstance, internalInstance._currentElement);
    internalInstance.unmountComponent();
  },

  /**
   * Update a component using a new element.
   *
   * @param {ReactComponent} internalInstance
   * @param {ReactElement} nextElement
   * @param {ReactReconcileTransaction} transaction
   * @param {object} context
   * @internal
   */
  receiveComponent: function(
    internalInstance, nextElement, transaction, context
  ) {
    var prevElement = internalInstance._currentElement;

    if (nextElement === prevElement && nextElement._owner != null) {
      // Since elements are immutable after the owner is rendered,
      // we can do a cheap identity compare here to determine if this is a
      // superfluous reconcile. It's possible for state to be mutable but such
      // change should trigger an update of the owner which would recreate
      // the element. We explicitly check for the existence of an owner since
      // it's possible for an element created outside a composite to be
      // deeply mutated and reused.
      return;
    }

    if ("production" !== process.env.NODE_ENV) {
      ReactElementValidator.checkAndWarnForMutatedProps(nextElement);
    }

    var refsChanged = ReactRef.shouldUpdateRefs(
      prevElement,
      nextElement
    );

    if (refsChanged) {
      ReactRef.detachRefs(internalInstance, prevElement);
    }

    internalInstance.receiveComponent(nextElement, transaction, context);

    if (refsChanged) {
      transaction.getReactMountReady().enqueue(attachRefs, internalInstance);
    }
  },

  /**
   * Flush any dirty changes in a component.
   *
   * @param {ReactComponent} internalInstance
   * @param {ReactReconcileTransaction} transaction
   * @internal
   */
  performUpdateIfNecessary: function(
    internalInstance,
    transaction
  ) {
    internalInstance.performUpdateIfNecessary(transaction);
  }

};

module.exports = ReactReconciler;

}).call(this,require('_process'))
},{"./ReactElementValidator":65,"./ReactRef":89,"_process":6}],89:[function(require,module,exports){
/**
 * Copyright 2013-2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule ReactRef
 */

'use strict';

var ReactOwner = require("./ReactOwner");

var ReactRef = {};

function attachRef(ref, component, owner) {
  if (typeof ref === 'function') {
    ref(component.getPublicInstance());
  } else {
    // Legacy ref
    ReactOwner.addComponentAsRefTo(component, ref, owner);
  }
}

function detachRef(ref, component, owner) {
  if (typeof ref === 'function') {
    ref(null);
  } else {
    // Legacy ref
    ReactOwner.removeComponentAsRefFrom(component, ref, owner);
  }
}

ReactRef.attachRefs = function(instance, element) {
  var ref = element.ref;
  if (ref != null) {
    attachRef(ref, instance, element._owner);
  }
};

ReactRef.shouldUpdateRefs = function(prevElement, nextElement) {
  // If either the owner or a `ref` has changed, make sure the newest owner
  // has stored a reference to `this`, and the previous owner (if different)
  // has forgotten the reference to `this`. We use the element instead
  // of the public this.props because the post processing cannot determine
  // a ref. The ref conceptually lives on the element.

  // TODO: Should this even be possible? The owner cannot change because
  // it's forbidden by shouldUpdateReactComponent. The ref can change
  // if you swap the keys of but not the refs. Reconsider where this check
  // is made. It probably belongs where the key checking and
  // instantiateReactComponent is done.

  return (
    nextElement._owner !== prevElement._owner ||
    nextElement.ref !== prevElement.ref
  );
};

ReactRef.detachRefs = function(instance, element) {
  var ref = element.ref;
  if (ref != null) {
    detachRef(ref, instance, element._owner);
  }
};

module.exports = ReactRef;

},{"./ReactOwner":81}],90:[function(require,module,exports){
/**
 * Copyright 2013-2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule ReactRootIndex
 * @typechecks
 */

'use strict';

var ReactRootIndexInjection = {
  /**
   * @param {function} _createReactRootIndex
   */
  injectCreateReactRootIndex: function(_createReactRootIndex) {
    ReactRootIndex.createReactRootIndex = _createReactRootIndex;
  }
};

var ReactRootIndex = {
  createReactRootIndex: null,
  injection: ReactRootIndexInjection
};

module.exports = ReactRootIndex;

},{}],91:[function(require,module,exports){
(function (process){
/**
 * Copyright 2013-2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @typechecks static-only
 * @providesModule ReactServerRendering
 */
'use strict';

var ReactElement = require("./ReactElement");
var ReactInstanceHandles = require("./ReactInstanceHandles");
var ReactMarkupChecksum = require("./ReactMarkupChecksum");
var ReactServerRenderingTransaction =
  require("./ReactServerRenderingTransaction");

var emptyObject = require("./emptyObject");
var instantiateReactComponent = require("./instantiateReactComponent");
var invariant = require("./invariant");

/**
 * @param {ReactElement} element
 * @return {string} the HTML markup
 */
function renderToString(element) {
  ("production" !== process.env.NODE_ENV ? invariant(
    ReactElement.isValidElement(element),
    'renderToString(): You must pass a valid ReactElement.'
  ) : invariant(ReactElement.isValidElement(element)));

  var transaction;
  try {
    var id = ReactInstanceHandles.createReactRootID();
    transaction = ReactServerRenderingTransaction.getPooled(false);

    return transaction.perform(function() {
      var componentInstance = instantiateReactComponent(element, null);
      var markup =
        componentInstance.mountComponent(id, transaction, emptyObject);
      return ReactMarkupChecksum.addChecksumToMarkup(markup);
    }, null);
  } finally {
    ReactServerRenderingTransaction.release(transaction);
  }
}

/**
 * @param {ReactElement} element
 * @return {string} the HTML markup, without the extra React ID and checksum
 * (for generating static pages)
 */
function renderToStaticMarkup(element) {
  ("production" !== process.env.NODE_ENV ? invariant(
    ReactElement.isValidElement(element),
    'renderToStaticMarkup(): You must pass a valid ReactElement.'
  ) : invariant(ReactElement.isValidElement(element)));

  var transaction;
  try {
    var id = ReactInstanceHandles.createReactRootID();
    transaction = ReactServerRenderingTransaction.getPooled(true);

    return transaction.perform(function() {
      var componentInstance = instantiateReactComponent(element, null);
      return componentInstance.mountComponent(id, transaction, emptyObject);
    }, null);
  } finally {
    ReactServerRenderingTransaction.release(transaction);
  }
}

module.exports = {
  renderToString: renderToString,
  renderToStaticMarkup: renderToStaticMarkup
};

}).call(this,require('_process'))
},{"./ReactElement":64,"./ReactInstanceHandles":73,"./ReactMarkupChecksum":76,"./ReactServerRenderingTransaction":92,"./emptyObject":122,"./instantiateReactComponent":141,"./invariant":142,"_process":6}],92:[function(require,module,exports){
/**
 * Copyright 2014-2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule ReactServerRenderingTransaction
 * @typechecks
 */

'use strict';

var PooledClass = require("./PooledClass");
var CallbackQueue = require("./CallbackQueue");
var ReactPutListenerQueue = require("./ReactPutListenerQueue");
var Transaction = require("./Transaction");

var assign = require("./Object.assign");
var emptyFunction = require("./emptyFunction");

/**
 * Provides a `CallbackQueue` queue for collecting `onDOMReady` callbacks
 * during the performing of the transaction.
 */
var ON_DOM_READY_QUEUEING = {
  /**
   * Initializes the internal `onDOMReady` queue.
   */
  initialize: function() {
    this.reactMountReady.reset();
  },

  close: emptyFunction
};

var PUT_LISTENER_QUEUEING = {
  initialize: function() {
    this.putListenerQueue.reset();
  },

  close: emptyFunction
};

/**
 * Executed within the scope of the `Transaction` instance. Consider these as
 * being member methods, but with an implied ordering while being isolated from
 * each other.
 */
var TRANSACTION_WRAPPERS = [
  PUT_LISTENER_QUEUEING,
  ON_DOM_READY_QUEUEING
];

/**
 * @class ReactServerRenderingTransaction
 * @param {boolean} renderToStaticMarkup
 */
function ReactServerRenderingTransaction(renderToStaticMarkup) {
  this.reinitializeTransaction();
  this.renderToStaticMarkup = renderToStaticMarkup;
  this.reactMountReady = CallbackQueue.getPooled(null);
  this.putListenerQueue = ReactPutListenerQueue.getPooled();
}

var Mixin = {
  /**
   * @see Transaction
   * @abstract
   * @final
   * @return {array} Empty list of operation wrap proceedures.
   */
  getTransactionWrappers: function() {
    return TRANSACTION_WRAPPERS;
  },

  /**
   * @return {object} The queue to collect `onDOMReady` callbacks with.
   */
  getReactMountReady: function() {
    return this.reactMountReady;
  },

  getPutListenerQueue: function() {
    return this.putListenerQueue;
  },

  /**
   * `PooledClass` looks for this, and will invoke this before allowing this
   * instance to be resused.
   */
  destructor: function() {
    CallbackQueue.release(this.reactMountReady);
    this.reactMountReady = null;

    ReactPutListenerQueue.release(this.putListenerQueue);
    this.putListenerQueue = null;
  }
};


assign(
  ReactServerRenderingTransaction.prototype,
  Transaction.Mixin,
  Mixin
);

PooledClass.addPoolingTo(ReactServerRenderingTransaction);

module.exports = ReactServerRenderingTransaction;

},{"./CallbackQueue":12,"./Object.assign":33,"./PooledClass":34,"./ReactPutListenerQueue":86,"./Transaction":110,"./emptyFunction":121}],93:[function(require,module,exports){
(function (process){
/**
 * Copyright 2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule ReactUpdateQueue
 */

'use strict';

var ReactLifeCycle = require("./ReactLifeCycle");
var ReactCurrentOwner = require("./ReactCurrentOwner");
var ReactElement = require("./ReactElement");
var ReactInstanceMap = require("./ReactInstanceMap");
var ReactUpdates = require("./ReactUpdates");

var assign = require("./Object.assign");
var invariant = require("./invariant");
var warning = require("./warning");

function enqueueUpdate(internalInstance) {
  if (internalInstance !== ReactLifeCycle.currentlyMountingInstance) {
    // If we're in a componentWillMount handler, don't enqueue a rerender
    // because ReactUpdates assumes we're in a browser context (which is
    // wrong for server rendering) and we're about to do a render anyway.
    // See bug in #1740.
    ReactUpdates.enqueueUpdate(internalInstance);
  }
}

function getInternalInstanceReadyForUpdate(publicInstance, callerName) {
  ("production" !== process.env.NODE_ENV ? invariant(
    ReactCurrentOwner.current == null,
    '%s(...): Cannot update during an existing state transition ' +
    '(such as within `render`). Render methods should be a pure function ' +
    'of props and state.',
    callerName
  ) : invariant(ReactCurrentOwner.current == null));

  var internalInstance = ReactInstanceMap.get(publicInstance);
  if (!internalInstance) {
    if ("production" !== process.env.NODE_ENV) {
      // Only warn when we have a callerName. Otherwise we should be silent.
      // We're probably calling from enqueueCallback. We don't want to warn
      // there because we already warned for the corresponding lifecycle method.
      ("production" !== process.env.NODE_ENV ? warning(
        !callerName,
        '%s(...): Can only update a mounted or mounting component. ' +
        'This usually means you called %s() on an unmounted ' +
        'component. This is a no-op.',
        callerName,
        callerName
      ) : null);
    }
    return null;
  }

  if (internalInstance === ReactLifeCycle.currentlyUnmountingInstance) {
    return null;
  }

  return internalInstance;
}

/**
 * ReactUpdateQueue allows for state updates to be scheduled into a later
 * reconciliation step.
 */
var ReactUpdateQueue = {

  /**
   * Enqueue a callback that will be executed after all the pending updates
   * have processed.
   *
   * @param {ReactClass} publicInstance The instance to use as `this` context.
   * @param {?function} callback Called after state is updated.
   * @internal
   */
  enqueueCallback: function(publicInstance, callback) {
    ("production" !== process.env.NODE_ENV ? invariant(
      typeof callback === 'function',
      'enqueueCallback(...): You called `setProps`, `replaceProps`, ' +
      '`setState`, `replaceState`, or `forceUpdate` with a callback that ' +
      'isn\'t callable.'
    ) : invariant(typeof callback === 'function'));
    var internalInstance = getInternalInstanceReadyForUpdate(publicInstance);

    // Previously we would throw an error if we didn't have an internal
    // instance. Since we want to make it a no-op instead, we mirror the same
    // behavior we have in other enqueue* methods.
    // We also need to ignore callbacks in componentWillMount. See
    // enqueueUpdates.
    if (!internalInstance ||
        internalInstance === ReactLifeCycle.currentlyMountingInstance) {
      return null;
    }

    if (internalInstance._pendingCallbacks) {
      internalInstance._pendingCallbacks.push(callback);
    } else {
      internalInstance._pendingCallbacks = [callback];
    }
    // TODO: The callback here is ignored when setState is called from
    // componentWillMount. Either fix it or disallow doing so completely in
    // favor of getInitialState. Alternatively, we can disallow
    // componentWillMount during server-side rendering.
    enqueueUpdate(internalInstance);
  },

  enqueueCallbackInternal: function(internalInstance, callback) {
    ("production" !== process.env.NODE_ENV ? invariant(
      typeof callback === 'function',
      'enqueueCallback(...): You called `setProps`, `replaceProps`, ' +
      '`setState`, `replaceState`, or `forceUpdate` with a callback that ' +
      'isn\'t callable.'
    ) : invariant(typeof callback === 'function'));
    if (internalInstance._pendingCallbacks) {
      internalInstance._pendingCallbacks.push(callback);
    } else {
      internalInstance._pendingCallbacks = [callback];
    }
    enqueueUpdate(internalInstance);
  },

  /**
   * Forces an update. This should only be invoked when it is known with
   * certainty that we are **not** in a DOM transaction.
   *
   * You may want to call this when you know that some deeper aspect of the
   * component's state has changed but `setState` was not called.
   *
   * This will not invoke `shouldUpdateComponent`, but it will invoke
   * `componentWillUpdate` and `componentDidUpdate`.
   *
   * @param {ReactClass} publicInstance The instance that should rerender.
   * @internal
   */
  enqueueForceUpdate: function(publicInstance) {
    var internalInstance = getInternalInstanceReadyForUpdate(
      publicInstance,
      'forceUpdate'
    );

    if (!internalInstance) {
      return;
    }

    internalInstance._pendingForceUpdate = true;

    enqueueUpdate(internalInstance);
  },

  /**
   * Replaces all of the state. Always use this or `setState` to mutate state.
   * You should treat `this.state` as immutable.
   *
   * There is no guarantee that `this.state` will be immediately updated, so
   * accessing `this.state` after calling this method may return the old value.
   *
   * @param {ReactClass} publicInstance The instance that should rerender.
   * @param {object} completeState Next state.
   * @internal
   */
  enqueueReplaceState: function(publicInstance, completeState) {
    var internalInstance = getInternalInstanceReadyForUpdate(
      publicInstance,
      'replaceState'
    );

    if (!internalInstance) {
      return;
    }

    internalInstance._pendingStateQueue = [completeState];
    internalInstance._pendingReplaceState = true;

    enqueueUpdate(internalInstance);
  },

  /**
   * Sets a subset of the state. This only exists because _pendingState is
   * internal. This provides a merging strategy that is not available to deep
   * properties which is confusing. TODO: Expose pendingState or don't use it
   * during the merge.
   *
   * @param {ReactClass} publicInstance The instance that should rerender.
   * @param {object} partialState Next partial state to be merged with state.
   * @internal
   */
  enqueueSetState: function(publicInstance, partialState) {
    var internalInstance = getInternalInstanceReadyForUpdate(
      publicInstance,
      'setState'
    );

    if (!internalInstance) {
      return;
    }

    var queue =
      internalInstance._pendingStateQueue ||
      (internalInstance._pendingStateQueue = []);
    queue.push(partialState);

    enqueueUpdate(internalInstance);
  },

  /**
   * Sets a subset of the props.
   *
   * @param {ReactClass} publicInstance The instance that should rerender.
   * @param {object} partialProps Subset of the next props.
   * @internal
   */
  enqueueSetProps: function(publicInstance, partialProps) {
    var internalInstance = getInternalInstanceReadyForUpdate(
      publicInstance,
      'setProps'
    );

    if (!internalInstance) {
      return;
    }

    ("production" !== process.env.NODE_ENV ? invariant(
      internalInstance._isTopLevel,
      'setProps(...): You called `setProps` on a ' +
      'component with a parent. This is an anti-pattern since props will ' +
      'get reactively updated when rendered. Instead, change the owner\'s ' +
      '`render` method to pass the correct value as props to the component ' +
      'where it is created.'
    ) : invariant(internalInstance._isTopLevel));

    // Merge with the pending element if it exists, otherwise with existing
    // element props.
    var element = internalInstance._pendingElement ||
                  internalInstance._currentElement;
    var props = assign({}, element.props, partialProps);
    internalInstance._pendingElement = ReactElement.cloneAndReplaceProps(
      element,
      props
    );

    enqueueUpdate(internalInstance);
  },

  /**
   * Replaces all of the props.
   *
   * @param {ReactClass} publicInstance The instance that should rerender.
   * @param {object} props New props.
   * @internal
   */
  enqueueReplaceProps: function(publicInstance, props) {
    var internalInstance = getInternalInstanceReadyForUpdate(
      publicInstance,
      'replaceProps'
    );

    if (!internalInstance) {
      return;
    }

    ("production" !== process.env.NODE_ENV ? invariant(
      internalInstance._isTopLevel,
      'replaceProps(...): You called `replaceProps` on a ' +
      'component with a parent. This is an anti-pattern since props will ' +
      'get reactively updated when rendered. Instead, change the owner\'s ' +
      '`render` method to pass the correct value as props to the component ' +
      'where it is created.'
    ) : invariant(internalInstance._isTopLevel));

    // Merge with the pending element if it exists, otherwise with existing
    // element props.
    var element = internalInstance._pendingElement ||
                  internalInstance._currentElement;
    internalInstance._pendingElement = ReactElement.cloneAndReplaceProps(
      element,
      props
    );

    enqueueUpdate(internalInstance);
  },

  enqueueElementInternal: function(internalInstance, newElement) {
    internalInstance._pendingElement = newElement;
    enqueueUpdate(internalInstance);
  }

};

module.exports = ReactUpdateQueue;

}).call(this,require('_process'))
},{"./Object.assign":33,"./ReactCurrentOwner":46,"./ReactElement":64,"./ReactInstanceMap":74,"./ReactLifeCycle":75,"./ReactUpdates":94,"./invariant":142,"./warning":161,"_process":6}],94:[function(require,module,exports){
(function (process){
/**
 * Copyright 2013-2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule ReactUpdates
 */

'use strict';

var CallbackQueue = require("./CallbackQueue");
var PooledClass = require("./PooledClass");
var ReactCurrentOwner = require("./ReactCurrentOwner");
var ReactPerf = require("./ReactPerf");
var ReactReconciler = require("./ReactReconciler");
var Transaction = require("./Transaction");

var assign = require("./Object.assign");
var invariant = require("./invariant");
var warning = require("./warning");

var dirtyComponents = [];
var asapCallbackQueue = CallbackQueue.getPooled();
var asapEnqueued = false;

var batchingStrategy = null;

function ensureInjected() {
  ("production" !== process.env.NODE_ENV ? invariant(
    ReactUpdates.ReactReconcileTransaction && batchingStrategy,
    'ReactUpdates: must inject a reconcile transaction class and batching ' +
    'strategy'
  ) : invariant(ReactUpdates.ReactReconcileTransaction && batchingStrategy));
}

var NESTED_UPDATES = {
  initialize: function() {
    this.dirtyComponentsLength = dirtyComponents.length;
  },
  close: function() {
    if (this.dirtyComponentsLength !== dirtyComponents.length) {
      // Additional updates were enqueued by componentDidUpdate handlers or
      // similar; before our own UPDATE_QUEUEING wrapper closes, we want to run
      // these new updates so that if A's componentDidUpdate calls setState on
      // B, B will update before the callback A's updater provided when calling
      // setState.
      dirtyComponents.splice(0, this.dirtyComponentsLength);
      flushBatchedUpdates();
    } else {
      dirtyComponents.length = 0;
    }
  }
};

var UPDATE_QUEUEING = {
  initialize: function() {
    this.callbackQueue.reset();
  },
  close: function() {
    this.callbackQueue.notifyAll();
  }
};

var TRANSACTION_WRAPPERS = [NESTED_UPDATES, UPDATE_QUEUEING];

function ReactUpdatesFlushTransaction() {
  this.reinitializeTransaction();
  this.dirtyComponentsLength = null;
  this.callbackQueue = CallbackQueue.getPooled();
  this.reconcileTransaction =
    ReactUpdates.ReactReconcileTransaction.getPooled();
}

assign(
  ReactUpdatesFlushTransaction.prototype,
  Transaction.Mixin, {
  getTransactionWrappers: function() {
    return TRANSACTION_WRAPPERS;
  },

  destructor: function() {
    this.dirtyComponentsLength = null;
    CallbackQueue.release(this.callbackQueue);
    this.callbackQueue = null;
    ReactUpdates.ReactReconcileTransaction.release(this.reconcileTransaction);
    this.reconcileTransaction = null;
  },

  perform: function(method, scope, a) {
    // Essentially calls `this.reconcileTransaction.perform(method, scope, a)`
    // with this transaction's wrappers around it.
    return Transaction.Mixin.perform.call(
      this,
      this.reconcileTransaction.perform,
      this.reconcileTransaction,
      method,
      scope,
      a
    );
  }
});

PooledClass.addPoolingTo(ReactUpdatesFlushTransaction);

function batchedUpdates(callback, a, b, c, d) {
  ensureInjected();
  batchingStrategy.batchedUpdates(callback, a, b, c, d);
}

/**
 * Array comparator for ReactComponents by mount ordering.
 *
 * @param {ReactComponent} c1 first component you're comparing
 * @param {ReactComponent} c2 second component you're comparing
 * @return {number} Return value usable by Array.prototype.sort().
 */
function mountOrderComparator(c1, c2) {
  return c1._mountOrder - c2._mountOrder;
}

function runBatchedUpdates(transaction) {
  var len = transaction.dirtyComponentsLength;
  ("production" !== process.env.NODE_ENV ? invariant(
    len === dirtyComponents.length,
    'Expected flush transaction\'s stored dirty-components length (%s) to ' +
    'match dirty-components array length (%s).',
    len,
    dirtyComponents.length
  ) : invariant(len === dirtyComponents.length));

  // Since reconciling a component higher in the owner hierarchy usually (not
  // always -- see shouldComponentUpdate()) will reconcile children, reconcile
  // them before their children by sorting the array.
  dirtyComponents.sort(mountOrderComparator);

  for (var i = 0; i < len; i++) {
    // If a component is unmounted before pending changes apply, it will still
    // be here, but we assume that it has cleared its _pendingCallbacks and
    // that performUpdateIfNecessary is a noop.
    var component = dirtyComponents[i];

    // If performUpdateIfNecessary happens to enqueue any new updates, we
    // shouldn't execute the callbacks until the next render happens, so
    // stash the callbacks first
    var callbacks = component._pendingCallbacks;
    component._pendingCallbacks = null;

    ReactReconciler.performUpdateIfNecessary(
      component,
      transaction.reconcileTransaction
    );

    if (callbacks) {
      for (var j = 0; j < callbacks.length; j++) {
        transaction.callbackQueue.enqueue(
          callbacks[j],
          component.getPublicInstance()
        );
      }
    }
  }
}

var flushBatchedUpdates = function() {
  // ReactUpdatesFlushTransaction's wrappers will clear the dirtyComponents
  // array and perform any updates enqueued by mount-ready handlers (i.e.,
  // componentDidUpdate) but we need to check here too in order to catch
  // updates enqueued by setState callbacks and asap calls.
  while (dirtyComponents.length || asapEnqueued) {
    if (dirtyComponents.length) {
      var transaction = ReactUpdatesFlushTransaction.getPooled();
      transaction.perform(runBatchedUpdates, null, transaction);
      ReactUpdatesFlushTransaction.release(transaction);
    }

    if (asapEnqueued) {
      asapEnqueued = false;
      var queue = asapCallbackQueue;
      asapCallbackQueue = CallbackQueue.getPooled();
      queue.notifyAll();
      CallbackQueue.release(queue);
    }
  }
};
flushBatchedUpdates = ReactPerf.measure(
  'ReactUpdates',
  'flushBatchedUpdates',
  flushBatchedUpdates
);

/**
 * Mark a component as needing a rerender, adding an optional callback to a
 * list of functions which will be executed once the rerender occurs.
 */
function enqueueUpdate(component) {
  ensureInjected();

  // Various parts of our code (such as ReactCompositeComponent's
  // _renderValidatedComponent) assume that calls to render aren't nested;
  // verify that that's the case. (This is called by each top-level update
  // function, like setProps, setState, forceUpdate, etc.; creation and
  // destruction of top-level components is guarded in ReactMount.)
  ("production" !== process.env.NODE_ENV ? warning(
    ReactCurrentOwner.current == null,
    'enqueueUpdate(): Render methods should be a pure function of props ' +
    'and state; triggering nested component updates from render is not ' +
    'allowed. If necessary, trigger nested updates in ' +
    'componentDidUpdate.'
  ) : null);

  if (!batchingStrategy.isBatchingUpdates) {
    batchingStrategy.batchedUpdates(enqueueUpdate, component);
    return;
  }

  dirtyComponents.push(component);
}

/**
 * Enqueue a callback to be run at the end of the current batching cycle. Throws
 * if no updates are currently being performed.
 */
function asap(callback, context) {
  ("production" !== process.env.NODE_ENV ? invariant(
    batchingStrategy.isBatchingUpdates,
    'ReactUpdates.asap: Can\'t enqueue an asap callback in a context where' +
    'updates are not being batched.'
  ) : invariant(batchingStrategy.isBatchingUpdates));
  asapCallbackQueue.enqueue(callback, context);
  asapEnqueued = true;
}

var ReactUpdatesInjection = {
  injectReconcileTransaction: function(ReconcileTransaction) {
    ("production" !== process.env.NODE_ENV ? invariant(
      ReconcileTransaction,
      'ReactUpdates: must provide a reconcile transaction class'
    ) : invariant(ReconcileTransaction));
    ReactUpdates.ReactReconcileTransaction = ReconcileTransaction;
  },

  injectBatchingStrategy: function(_batchingStrategy) {
    ("production" !== process.env.NODE_ENV ? invariant(
      _batchingStrategy,
      'ReactUpdates: must provide a batching strategy'
    ) : invariant(_batchingStrategy));
    ("production" !== process.env.NODE_ENV ? invariant(
      typeof _batchingStrategy.batchedUpdates === 'function',
      'ReactUpdates: must provide a batchedUpdates() function'
    ) : invariant(typeof _batchingStrategy.batchedUpdates === 'function'));
    ("production" !== process.env.NODE_ENV ? invariant(
      typeof _batchingStrategy.isBatchingUpdates === 'boolean',
      'ReactUpdates: must provide an isBatchingUpdates boolean attribute'
    ) : invariant(typeof _batchingStrategy.isBatchingUpdates === 'boolean'));
    batchingStrategy = _batchingStrategy;
  }
};

var ReactUpdates = {
  /**
   * React references `ReactReconcileTransaction` using this property in order
   * to allow dependency injection.
   *
   * @internal
   */
  ReactReconcileTransaction: null,

  batchedUpdates: batchedUpdates,
  enqueueUpdate: enqueueUpdate,
  flushBatchedUpdates: flushBatchedUpdates,
  injection: ReactUpdatesInjection,
  asap: asap
};

module.exports = ReactUpdates;

}).call(this,require('_process'))
},{"./CallbackQueue":12,"./Object.assign":33,"./PooledClass":34,"./ReactCurrentOwner":46,"./ReactPerf":82,"./ReactReconciler":88,"./Transaction":110,"./invariant":142,"./warning":161,"_process":6}],95:[function(require,module,exports){
/**
 * Copyright 2013-2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule SVGDOMPropertyConfig
 */

/*jslint bitwise: true*/

'use strict';

var DOMProperty = require("./DOMProperty");

var MUST_USE_ATTRIBUTE = DOMProperty.injection.MUST_USE_ATTRIBUTE;

var SVGDOMPropertyConfig = {
  Properties: {
    clipPath: MUST_USE_ATTRIBUTE,
    cx: MUST_USE_ATTRIBUTE,
    cy: MUST_USE_ATTRIBUTE,
    d: MUST_USE_ATTRIBUTE,
    dx: MUST_USE_ATTRIBUTE,
    dy: MUST_USE_ATTRIBUTE,
    fill: MUST_USE_ATTRIBUTE,
    fillOpacity: MUST_USE_ATTRIBUTE,
    fontFamily: MUST_USE_ATTRIBUTE,
    fontSize: MUST_USE_ATTRIBUTE,
    fx: MUST_USE_ATTRIBUTE,
    fy: MUST_USE_ATTRIBUTE,
    gradientTransform: MUST_USE_ATTRIBUTE,
    gradientUnits: MUST_USE_ATTRIBUTE,
    markerEnd: MUST_USE_ATTRIBUTE,
    markerMid: MUST_USE_ATTRIBUTE,
    markerStart: MUST_USE_ATTRIBUTE,
    offset: MUST_USE_ATTRIBUTE,
    opacity: MUST_USE_ATTRIBUTE,
    patternContentUnits: MUST_USE_ATTRIBUTE,
    patternUnits: MUST_USE_ATTRIBUTE,
    points: MUST_USE_ATTRIBUTE,
    preserveAspectRatio: MUST_USE_ATTRIBUTE,
    r: MUST_USE_ATTRIBUTE,
    rx: MUST_USE_ATTRIBUTE,
    ry: MUST_USE_ATTRIBUTE,
    spreadMethod: MUST_USE_ATTRIBUTE,
    stopColor: MUST_USE_ATTRIBUTE,
    stopOpacity: MUST_USE_ATTRIBUTE,
    stroke: MUST_USE_ATTRIBUTE,
    strokeDasharray: MUST_USE_ATTRIBUTE,
    strokeLinecap: MUST_USE_ATTRIBUTE,
    strokeOpacity: MUST_USE_ATTRIBUTE,
    strokeWidth: MUST_USE_ATTRIBUTE,
    textAnchor: MUST_USE_ATTRIBUTE,
    transform: MUST_USE_ATTRIBUTE,
    version: MUST_USE_ATTRIBUTE,
    viewBox: MUST_USE_ATTRIBUTE,
    x1: MUST_USE_ATTRIBUTE,
    x2: MUST_USE_ATTRIBUTE,
    x: MUST_USE_ATTRIBUTE,
    y1: MUST_USE_ATTRIBUTE,
    y2: MUST_USE_ATTRIBUTE,
    y: MUST_USE_ATTRIBUTE
  },
  DOMAttributeNames: {
    clipPath: 'clip-path',
    fillOpacity: 'fill-opacity',
    fontFamily: 'font-family',
    fontSize: 'font-size',
    gradientTransform: 'gradientTransform',
    gradientUnits: 'gradientUnits',
    markerEnd: 'marker-end',
    markerMid: 'marker-mid',
    markerStart: 'marker-start',
    patternContentUnits: 'patternContentUnits',
    patternUnits: 'patternUnits',
    preserveAspectRatio: 'preserveAspectRatio',
    spreadMethod: 'spreadMethod',
    stopColor: 'stop-color',
    stopOpacity: 'stop-opacity',
    strokeDasharray: 'stroke-dasharray',
    strokeLinecap: 'stroke-linecap',
    strokeOpacity: 'stroke-opacity',
    strokeWidth: 'stroke-width',
    textAnchor: 'text-anchor',
    viewBox: 'viewBox'
  }
};

module.exports = SVGDOMPropertyConfig;

},{"./DOMProperty":16}],96:[function(require,module,exports){
/**
 * Copyright 2013-2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule SelectEventPlugin
 */

'use strict';

var EventConstants = require("./EventConstants");
var EventPropagators = require("./EventPropagators");
var ReactInputSelection = require("./ReactInputSelection");
var SyntheticEvent = require("./SyntheticEvent");

var getActiveElement = require("./getActiveElement");
var isTextInputElement = require("./isTextInputElement");
var keyOf = require("./keyOf");
var shallowEqual = require("./shallowEqual");

var topLevelTypes = EventConstants.topLevelTypes;

var eventTypes = {
  select: {
    phasedRegistrationNames: {
      bubbled: keyOf({onSelect: null}),
      captured: keyOf({onSelectCapture: null})
    },
    dependencies: [
      topLevelTypes.topBlur,
      topLevelTypes.topContextMenu,
      topLevelTypes.topFocus,
      topLevelTypes.topKeyDown,
      topLevelTypes.topMouseDown,
      topLevelTypes.topMouseUp,
      topLevelTypes.topSelectionChange
    ]
  }
};

var activeElement = null;
var activeElementID = null;
var lastSelection = null;
var mouseDown = false;

/**
 * Get an object which is a unique representation of the current selection.
 *
 * The return value will not be consistent across nodes or browsers, but
 * two identical selections on the same node will return identical objects.
 *
 * @param {DOMElement} node
 * @param {object}
 */
function getSelection(node) {
  if ('selectionStart' in node &&
      ReactInputSelection.hasSelectionCapabilities(node)) {
    return {
      start: node.selectionStart,
      end: node.selectionEnd
    };
  } else if (window.getSelection) {
    var selection = window.getSelection();
    return {
      anchorNode: selection.anchorNode,
      anchorOffset: selection.anchorOffset,
      focusNode: selection.focusNode,
      focusOffset: selection.focusOffset
    };
  } else if (document.selection) {
    var range = document.selection.createRange();
    return {
      parentElement: range.parentElement(),
      text: range.text,
      top: range.boundingTop,
      left: range.boundingLeft
    };
  }
}

/**
 * Poll selection to see whether it's changed.
 *
 * @param {object} nativeEvent
 * @return {?SyntheticEvent}
 */
function constructSelectEvent(nativeEvent) {
  // Ensure we have the right element, and that the user is not dragging a
  // selection (this matches native `select` event behavior). In HTML5, select
  // fires only on input and textarea thus if there's no focused element we
  // won't dispatch.
  if (mouseDown ||
      activeElement == null ||
      activeElement !== getActiveElement()) {
    return null;
  }

  // Only fire when selection has actually changed.
  var currentSelection = getSelection(activeElement);
  if (!lastSelection || !shallowEqual(lastSelection, currentSelection)) {
    lastSelection = currentSelection;

    var syntheticEvent = SyntheticEvent.getPooled(
      eventTypes.select,
      activeElementID,
      nativeEvent
    );

    syntheticEvent.type = 'select';
    syntheticEvent.target = activeElement;

    EventPropagators.accumulateTwoPhaseDispatches(syntheticEvent);

    return syntheticEvent;
  }
}

/**
 * This plugin creates an `onSelect` event that normalizes select events
 * across form elements.
 *
 * Supported elements are:
 * - input (see `isTextInputElement`)
 * - textarea
 * - contentEditable
 *
 * This differs from native browser implementations in the following ways:
 * - Fires on contentEditable fields as well as inputs.
 * - Fires for collapsed selection.
 * - Fires after user input.
 */
var SelectEventPlugin = {

  eventTypes: eventTypes,

  /**
   * @param {string} topLevelType Record from `EventConstants`.
   * @param {DOMEventTarget} topLevelTarget The listening component root node.
   * @param {string} topLevelTargetID ID of `topLevelTarget`.
   * @param {object} nativeEvent Native browser event.
   * @return {*} An accumulation of synthetic events.
   * @see {EventPluginHub.extractEvents}
   */
  extractEvents: function(
      topLevelType,
      topLevelTarget,
      topLevelTargetID,
      nativeEvent) {

    switch (topLevelType) {
      // Track the input node that has focus.
      case topLevelTypes.topFocus:
        if (isTextInputElement(topLevelTarget) ||
            topLevelTarget.contentEditable === 'true') {
          activeElement = topLevelTarget;
          activeElementID = topLevelTargetID;
          lastSelection = null;
        }
        break;
      case topLevelTypes.topBlur:
        activeElement = null;
        activeElementID = null;
        lastSelection = null;
        break;

      // Don't fire the event while the user is dragging. This matches the
      // semantics of the native select event.
      case topLevelTypes.topMouseDown:
        mouseDown = true;
        break;
      case topLevelTypes.topContextMenu:
      case topLevelTypes.topMouseUp:
        mouseDown = false;
        return constructSelectEvent(nativeEvent);

      // Chrome and IE fire non-standard event when selection is changed (and
      // sometimes when it hasn't).
      // Firefox doesn't support selectionchange, so check selection status
      // after each key entry. The selection changes after keydown and before
      // keyup, but we check on keydown as well in the case of holding down a
      // key, when multiple keydown events are fired but only one keyup is.
      case topLevelTypes.topSelectionChange:
      case topLevelTypes.topKeyDown:
      case topLevelTypes.topKeyUp:
        return constructSelectEvent(nativeEvent);
    }
  }
};

module.exports = SelectEventPlugin;

},{"./EventConstants":21,"./EventPropagators":26,"./ReactInputSelection":72,"./SyntheticEvent":102,"./getActiveElement":128,"./isTextInputElement":145,"./keyOf":148,"./shallowEqual":157}],97:[function(require,module,exports){
/**
 * Copyright 2013-2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule ServerReactRootIndex
 * @typechecks
 */

'use strict';

/**
 * Size of the reactRoot ID space. We generate random numbers for React root
 * IDs and if there's a collision the events and DOM update system will
 * get confused. In the future we need a way to generate GUIDs but for
 * now this will work on a smaller scale.
 */
var GLOBAL_MOUNT_POINT_MAX = Math.pow(2, 53);

var ServerReactRootIndex = {
  createReactRootIndex: function() {
    return Math.ceil(Math.random() * GLOBAL_MOUNT_POINT_MAX);
  }
};

module.exports = ServerReactRootIndex;

},{}],98:[function(require,module,exports){
(function (process){
/**
 * Copyright 2013-2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule SimpleEventPlugin
 */

'use strict';

var EventConstants = require("./EventConstants");
var EventPluginUtils = require("./EventPluginUtils");
var EventPropagators = require("./EventPropagators");
var SyntheticClipboardEvent = require("./SyntheticClipboardEvent");
var SyntheticEvent = require("./SyntheticEvent");
var SyntheticFocusEvent = require("./SyntheticFocusEvent");
var SyntheticKeyboardEvent = require("./SyntheticKeyboardEvent");
var SyntheticMouseEvent = require("./SyntheticMouseEvent");
var SyntheticDragEvent = require("./SyntheticDragEvent");
var SyntheticTouchEvent = require("./SyntheticTouchEvent");
var SyntheticUIEvent = require("./SyntheticUIEvent");
var SyntheticWheelEvent = require("./SyntheticWheelEvent");

var getEventCharCode = require("./getEventCharCode");

var invariant = require("./invariant");
var keyOf = require("./keyOf");
var warning = require("./warning");

var topLevelTypes = EventConstants.topLevelTypes;

var eventTypes = {
  blur: {
    phasedRegistrationNames: {
      bubbled: keyOf({onBlur: true}),
      captured: keyOf({onBlurCapture: true})
    }
  },
  click: {
    phasedRegistrationNames: {
      bubbled: keyOf({onClick: true}),
      captured: keyOf({onClickCapture: true})
    }
  },
  contextMenu: {
    phasedRegistrationNames: {
      bubbled: keyOf({onContextMenu: true}),
      captured: keyOf({onContextMenuCapture: true})
    }
  },
  copy: {
    phasedRegistrationNames: {
      bubbled: keyOf({onCopy: true}),
      captured: keyOf({onCopyCapture: true})
    }
  },
  cut: {
    phasedRegistrationNames: {
      bubbled: keyOf({onCut: true}),
      captured: keyOf({onCutCapture: true})
    }
  },
  doubleClick: {
    phasedRegistrationNames: {
      bubbled: keyOf({onDoubleClick: true}),
      captured: keyOf({onDoubleClickCapture: true})
    }
  },
  drag: {
    phasedRegistrationNames: {
      bubbled: keyOf({onDrag: true}),
      captured: keyOf({onDragCapture: true})
    }
  },
  dragEnd: {
    phasedRegistrationNames: {
      bubbled: keyOf({onDragEnd: true}),
      captured: keyOf({onDragEndCapture: true})
    }
  },
  dragEnter: {
    phasedRegistrationNames: {
      bubbled: keyOf({onDragEnter: true}),
      captured: keyOf({onDragEnterCapture: true})
    }
  },
  dragExit: {
    phasedRegistrationNames: {
      bubbled: keyOf({onDragExit: true}),
      captured: keyOf({onDragExitCapture: true})
    }
  },
  dragLeave: {
    phasedRegistrationNames: {
      bubbled: keyOf({onDragLeave: true}),
      captured: keyOf({onDragLeaveCapture: true})
    }
  },
  dragOver: {
    phasedRegistrationNames: {
      bubbled: keyOf({onDragOver: true}),
      captured: keyOf({onDragOverCapture: true})
    }
  },
  dragStart: {
    phasedRegistrationNames: {
      bubbled: keyOf({onDragStart: true}),
      captured: keyOf({onDragStartCapture: true})
    }
  },
  drop: {
    phasedRegistrationNames: {
      bubbled: keyOf({onDrop: true}),
      captured: keyOf({onDropCapture: true})
    }
  },
  focus: {
    phasedRegistrationNames: {
      bubbled: keyOf({onFocus: true}),
      captured: keyOf({onFocusCapture: true})
    }
  },
  input: {
    phasedRegistrationNames: {
      bubbled: keyOf({onInput: true}),
      captured: keyOf({onInputCapture: true})
    }
  },
  keyDown: {
    phasedRegistrationNames: {
      bubbled: keyOf({onKeyDown: true}),
      captured: keyOf({onKeyDownCapture: true})
    }
  },
  keyPress: {
    phasedRegistrationNames: {
      bubbled: keyOf({onKeyPress: true}),
      captured: keyOf({onKeyPressCapture: true})
    }
  },
  keyUp: {
    phasedRegistrationNames: {
      bubbled: keyOf({onKeyUp: true}),
      captured: keyOf({onKeyUpCapture: true})
    }
  },
  load: {
    phasedRegistrationNames: {
      bubbled: keyOf({onLoad: true}),
      captured: keyOf({onLoadCapture: true})
    }
  },
  error: {
    phasedRegistrationNames: {
      bubbled: keyOf({onError: true}),
      captured: keyOf({onErrorCapture: true})
    }
  },
  // Note: We do not allow listening to mouseOver events. Instead, use the
  // onMouseEnter/onMouseLeave created by `EnterLeaveEventPlugin`.
  mouseDown: {
    phasedRegistrationNames: {
      bubbled: keyOf({onMouseDown: true}),
      captured: keyOf({onMouseDownCapture: true})
    }
  },
  mouseMove: {
    phasedRegistrationNames: {
      bubbled: keyOf({onMouseMove: true}),
      captured: keyOf({onMouseMoveCapture: true})
    }
  },
  mouseOut: {
    phasedRegistrationNames: {
      bubbled: keyOf({onMouseOut: true}),
      captured: keyOf({onMouseOutCapture: true})
    }
  },
  mouseOver: {
    phasedRegistrationNames: {
      bubbled: keyOf({onMouseOver: true}),
      captured: keyOf({onMouseOverCapture: true})
    }
  },
  mouseUp: {
    phasedRegistrationNames: {
      bubbled: keyOf({onMouseUp: true}),
      captured: keyOf({onMouseUpCapture: true})
    }
  },
  paste: {
    phasedRegistrationNames: {
      bubbled: keyOf({onPaste: true}),
      captured: keyOf({onPasteCapture: true})
    }
  },
  reset: {
    phasedRegistrationNames: {
      bubbled: keyOf({onReset: true}),
      captured: keyOf({onResetCapture: true})
    }
  },
  scroll: {
    phasedRegistrationNames: {
      bubbled: keyOf({onScroll: true}),
      captured: keyOf({onScrollCapture: true})
    }
  },
  submit: {
    phasedRegistrationNames: {
      bubbled: keyOf({onSubmit: true}),
      captured: keyOf({onSubmitCapture: true})
    }
  },
  touchCancel: {
    phasedRegistrationNames: {
      bubbled: keyOf({onTouchCancel: true}),
      captured: keyOf({onTouchCancelCapture: true})
    }
  },
  touchEnd: {
    phasedRegistrationNames: {
      bubbled: keyOf({onTouchEnd: true}),
      captured: keyOf({onTouchEndCapture: true})
    }
  },
  touchMove: {
    phasedRegistrationNames: {
      bubbled: keyOf({onTouchMove: true}),
      captured: keyOf({onTouchMoveCapture: true})
    }
  },
  touchStart: {
    phasedRegistrationNames: {
      bubbled: keyOf({onTouchStart: true}),
      captured: keyOf({onTouchStartCapture: true})
    }
  },
  wheel: {
    phasedRegistrationNames: {
      bubbled: keyOf({onWheel: true}),
      captured: keyOf({onWheelCapture: true})
    }
  }
};

var topLevelEventsToDispatchConfig = {
  topBlur:        eventTypes.blur,
  topClick:       eventTypes.click,
  topContextMenu: eventTypes.contextMenu,
  topCopy:        eventTypes.copy,
  topCut:         eventTypes.cut,
  topDoubleClick: eventTypes.doubleClick,
  topDrag:        eventTypes.drag,
  topDragEnd:     eventTypes.dragEnd,
  topDragEnter:   eventTypes.dragEnter,
  topDragExit:    eventTypes.dragExit,
  topDragLeave:   eventTypes.dragLeave,
  topDragOver:    eventTypes.dragOver,
  topDragStart:   eventTypes.dragStart,
  topDrop:        eventTypes.drop,
  topError:       eventTypes.error,
  topFocus:       eventTypes.focus,
  topInput:       eventTypes.input,
  topKeyDown:     eventTypes.keyDown,
  topKeyPress:    eventTypes.keyPress,
  topKeyUp:       eventTypes.keyUp,
  topLoad:        eventTypes.load,
  topMouseDown:   eventTypes.mouseDown,
  topMouseMove:   eventTypes.mouseMove,
  topMouseOut:    eventTypes.mouseOut,
  topMouseOver:   eventTypes.mouseOver,
  topMouseUp:     eventTypes.mouseUp,
  topPaste:       eventTypes.paste,
  topReset:       eventTypes.reset,
  topScroll:      eventTypes.scroll,
  topSubmit:      eventTypes.submit,
  topTouchCancel: eventTypes.touchCancel,
  topTouchEnd:    eventTypes.touchEnd,
  topTouchMove:   eventTypes.touchMove,
  topTouchStart:  eventTypes.touchStart,
  topWheel:       eventTypes.wheel
};

for (var type in topLevelEventsToDispatchConfig) {
  topLevelEventsToDispatchConfig[type].dependencies = [type];
}

var SimpleEventPlugin = {

  eventTypes: eventTypes,

  /**
   * Same as the default implementation, except cancels the event when return
   * value is false. This behavior will be disabled in a future release.
   *
   * @param {object} Event to be dispatched.
   * @param {function} Application-level callback.
   * @param {string} domID DOM ID to pass to the callback.
   */
  executeDispatch: function(event, listener, domID) {
    var returnValue = EventPluginUtils.executeDispatch(event, listener, domID);

    ("production" !== process.env.NODE_ENV ? warning(
      typeof returnValue !== 'boolean',
      'Returning `false` from an event handler is deprecated and will be ' +
      'ignored in a future release. Instead, manually call ' +
      'e.stopPropagation() or e.preventDefault(), as appropriate.'
    ) : null);

    if (returnValue === false) {
      event.stopPropagation();
      event.preventDefault();
    }
  },

  /**
   * @param {string} topLevelType Record from `EventConstants`.
   * @param {DOMEventTarget} topLevelTarget The listening component root node.
   * @param {string} topLevelTargetID ID of `topLevelTarget`.
   * @param {object} nativeEvent Native browser event.
   * @return {*} An accumulation of synthetic events.
   * @see {EventPluginHub.extractEvents}
   */
  extractEvents: function(
      topLevelType,
      topLevelTarget,
      topLevelTargetID,
      nativeEvent) {
    var dispatchConfig = topLevelEventsToDispatchConfig[topLevelType];
    if (!dispatchConfig) {
      return null;
    }
    var EventConstructor;
    switch (topLevelType) {
      case topLevelTypes.topInput:
      case topLevelTypes.topLoad:
      case topLevelTypes.topError:
      case topLevelTypes.topReset:
      case topLevelTypes.topSubmit:
        // HTML Events
        // @see http://www.w3.org/TR/html5/index.html#events-0
        EventConstructor = SyntheticEvent;
        break;
      case topLevelTypes.topKeyPress:
        // FireFox creates a keypress event for function keys too. This removes
        // the unwanted keypress events. Enter is however both printable and
        // non-printable. One would expect Tab to be as well (but it isn't).
        if (getEventCharCode(nativeEvent) === 0) {
          return null;
        }
        /* falls through */
      case topLevelTypes.topKeyDown:
      case topLevelTypes.topKeyUp:
        EventConstructor = SyntheticKeyboardEvent;
        break;
      case topLevelTypes.topBlur:
      case topLevelTypes.topFocus:
        EventConstructor = SyntheticFocusEvent;
        break;
      case topLevelTypes.topClick:
        // Firefox creates a click event on right mouse clicks. This removes the
        // unwanted click events.
        if (nativeEvent.button === 2) {
          return null;
        }
        /* falls through */
      case topLevelTypes.topContextMenu:
      case topLevelTypes.topDoubleClick:
      case topLevelTypes.topMouseDown:
      case topLevelTypes.topMouseMove:
      case topLevelTypes.topMouseOut:
      case topLevelTypes.topMouseOver:
      case topLevelTypes.topMouseUp:
        EventConstructor = SyntheticMouseEvent;
        break;
      case topLevelTypes.topDrag:
      case topLevelTypes.topDragEnd:
      case topLevelTypes.topDragEnter:
      case topLevelTypes.topDragExit:
      case topLevelTypes.topDragLeave:
      case topLevelTypes.topDragOver:
      case topLevelTypes.topDragStart:
      case topLevelTypes.topDrop:
        EventConstructor = SyntheticDragEvent;
        break;
      case topLevelTypes.topTouchCancel:
      case topLevelTypes.topTouchEnd:
      case topLevelTypes.topTouchMove:
      case topLevelTypes.topTouchStart:
        EventConstructor = SyntheticTouchEvent;
        break;
      case topLevelTypes.topScroll:
        EventConstructor = SyntheticUIEvent;
        break;
      case topLevelTypes.topWheel:
        EventConstructor = SyntheticWheelEvent;
        break;
      case topLevelTypes.topCopy:
      case topLevelTypes.topCut:
      case topLevelTypes.topPaste:
        EventConstructor = SyntheticClipboardEvent;
        break;
    }
    ("production" !== process.env.NODE_ENV ? invariant(
      EventConstructor,
      'SimpleEventPlugin: Unhandled event type, `%s`.',
      topLevelType
    ) : invariant(EventConstructor));
    var event = EventConstructor.getPooled(
      dispatchConfig,
      topLevelTargetID,
      nativeEvent
    );
    EventPropagators.accumulateTwoPhaseDispatches(event);
    return event;
  }

};

module.exports = SimpleEventPlugin;

}).call(this,require('_process'))
},{"./EventConstants":21,"./EventPluginUtils":25,"./EventPropagators":26,"./SyntheticClipboardEvent":99,"./SyntheticDragEvent":101,"./SyntheticEvent":102,"./SyntheticFocusEvent":103,"./SyntheticKeyboardEvent":105,"./SyntheticMouseEvent":106,"./SyntheticTouchEvent":107,"./SyntheticUIEvent":108,"./SyntheticWheelEvent":109,"./getEventCharCode":129,"./invariant":142,"./keyOf":148,"./warning":161,"_process":6}],99:[function(require,module,exports){
/**
 * Copyright 2013-2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule SyntheticClipboardEvent
 * @typechecks static-only
 */

'use strict';

var SyntheticEvent = require("./SyntheticEvent");

/**
 * @interface Event
 * @see http://www.w3.org/TR/clipboard-apis/
 */
var ClipboardEventInterface = {
  clipboardData: function(event) {
    return (
      'clipboardData' in event ?
        event.clipboardData :
        window.clipboardData
    );
  }
};

/**
 * @param {object} dispatchConfig Configuration used to dispatch this event.
 * @param {string} dispatchMarker Marker identifying the event target.
 * @param {object} nativeEvent Native browser event.
 * @extends {SyntheticUIEvent}
 */
function SyntheticClipboardEvent(dispatchConfig, dispatchMarker, nativeEvent) {
  SyntheticEvent.call(this, dispatchConfig, dispatchMarker, nativeEvent);
}

SyntheticEvent.augmentClass(SyntheticClipboardEvent, ClipboardEventInterface);

module.exports = SyntheticClipboardEvent;

},{"./SyntheticEvent":102}],100:[function(require,module,exports){
/**
 * Copyright 2013-2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule SyntheticCompositionEvent
 * @typechecks static-only
 */

'use strict';

var SyntheticEvent = require("./SyntheticEvent");

/**
 * @interface Event
 * @see http://www.w3.org/TR/DOM-Level-3-Events/#events-compositionevents
 */
var CompositionEventInterface = {
  data: null
};

/**
 * @param {object} dispatchConfig Configuration used to dispatch this event.
 * @param {string} dispatchMarker Marker identifying the event target.
 * @param {object} nativeEvent Native browser event.
 * @extends {SyntheticUIEvent}
 */
function SyntheticCompositionEvent(
  dispatchConfig,
  dispatchMarker,
  nativeEvent) {
  SyntheticEvent.call(this, dispatchConfig, dispatchMarker, nativeEvent);
}

SyntheticEvent.augmentClass(
  SyntheticCompositionEvent,
  CompositionEventInterface
);

module.exports = SyntheticCompositionEvent;

},{"./SyntheticEvent":102}],101:[function(require,module,exports){
/**
 * Copyright 2013-2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule SyntheticDragEvent
 * @typechecks static-only
 */

'use strict';

var SyntheticMouseEvent = require("./SyntheticMouseEvent");

/**
 * @interface DragEvent
 * @see http://www.w3.org/TR/DOM-Level-3-Events/
 */
var DragEventInterface = {
  dataTransfer: null
};

/**
 * @param {object} dispatchConfig Configuration used to dispatch this event.
 * @param {string} dispatchMarker Marker identifying the event target.
 * @param {object} nativeEvent Native browser event.
 * @extends {SyntheticUIEvent}
 */
function SyntheticDragEvent(dispatchConfig, dispatchMarker, nativeEvent) {
  SyntheticMouseEvent.call(this, dispatchConfig, dispatchMarker, nativeEvent);
}

SyntheticMouseEvent.augmentClass(SyntheticDragEvent, DragEventInterface);

module.exports = SyntheticDragEvent;

},{"./SyntheticMouseEvent":106}],102:[function(require,module,exports){
/**
 * Copyright 2013-2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule SyntheticEvent
 * @typechecks static-only
 */

'use strict';

var PooledClass = require("./PooledClass");

var assign = require("./Object.assign");
var emptyFunction = require("./emptyFunction");
var getEventTarget = require("./getEventTarget");

/**
 * @interface Event
 * @see http://www.w3.org/TR/DOM-Level-3-Events/
 */
var EventInterface = {
  type: null,
  target: getEventTarget,
  // currentTarget is set when dispatching; no use in copying it here
  currentTarget: emptyFunction.thatReturnsNull,
  eventPhase: null,
  bubbles: null,
  cancelable: null,
  timeStamp: function(event) {
    return event.timeStamp || Date.now();
  },
  defaultPrevented: null,
  isTrusted: null
};

/**
 * Synthetic events are dispatched by event plugins, typically in response to a
 * top-level event delegation handler.
 *
 * These systems should generally use pooling to reduce the frequency of garbage
 * collection. The system should check `isPersistent` to determine whether the
 * event should be released into the pool after being dispatched. Users that
 * need a persisted event should invoke `persist`.
 *
 * Synthetic events (and subclasses) implement the DOM Level 3 Events API by
 * normalizing browser quirks. Subclasses do not necessarily have to implement a
 * DOM interface; custom application-specific events can also subclass this.
 *
 * @param {object} dispatchConfig Configuration used to dispatch this event.
 * @param {string} dispatchMarker Marker identifying the event target.
 * @param {object} nativeEvent Native browser event.
 */
function SyntheticEvent(dispatchConfig, dispatchMarker, nativeEvent) {
  this.dispatchConfig = dispatchConfig;
  this.dispatchMarker = dispatchMarker;
  this.nativeEvent = nativeEvent;

  var Interface = this.constructor.Interface;
  for (var propName in Interface) {
    if (!Interface.hasOwnProperty(propName)) {
      continue;
    }
    var normalize = Interface[propName];
    if (normalize) {
      this[propName] = normalize(nativeEvent);
    } else {
      this[propName] = nativeEvent[propName];
    }
  }

  var defaultPrevented = nativeEvent.defaultPrevented != null ?
    nativeEvent.defaultPrevented :
    nativeEvent.returnValue === false;
  if (defaultPrevented) {
    this.isDefaultPrevented = emptyFunction.thatReturnsTrue;
  } else {
    this.isDefaultPrevented = emptyFunction.thatReturnsFalse;
  }
  this.isPropagationStopped = emptyFunction.thatReturnsFalse;
}

assign(SyntheticEvent.prototype, {

  preventDefault: function() {
    this.defaultPrevented = true;
    var event = this.nativeEvent;
    if (event.preventDefault) {
      event.preventDefault();
    } else {
      event.returnValue = false;
    }
    this.isDefaultPrevented = emptyFunction.thatReturnsTrue;
  },

  stopPropagation: function() {
    var event = this.nativeEvent;
    if (event.stopPropagation) {
      event.stopPropagation();
    } else {
      event.cancelBubble = true;
    }
    this.isPropagationStopped = emptyFunction.thatReturnsTrue;
  },

  /**
   * We release all dispatched `SyntheticEvent`s after each event loop, adding
   * them back into the pool. This allows a way to hold onto a reference that
   * won't be added back into the pool.
   */
  persist: function() {
    this.isPersistent = emptyFunction.thatReturnsTrue;
  },

  /**
   * Checks if this event should be released back into the pool.
   *
   * @return {boolean} True if this should not be released, false otherwise.
   */
  isPersistent: emptyFunction.thatReturnsFalse,

  /**
   * `PooledClass` looks for `destructor` on each instance it releases.
   */
  destructor: function() {
    var Interface = this.constructor.Interface;
    for (var propName in Interface) {
      this[propName] = null;
    }
    this.dispatchConfig = null;
    this.dispatchMarker = null;
    this.nativeEvent = null;
  }

});

SyntheticEvent.Interface = EventInterface;

/**
 * Helper to reduce boilerplate when creating subclasses.
 *
 * @param {function} Class
 * @param {?object} Interface
 */
SyntheticEvent.augmentClass = function(Class, Interface) {
  var Super = this;

  var prototype = Object.create(Super.prototype);
  assign(prototype, Class.prototype);
  Class.prototype = prototype;
  Class.prototype.constructor = Class;

  Class.Interface = assign({}, Super.Interface, Interface);
  Class.augmentClass = Super.augmentClass;

  PooledClass.addPoolingTo(Class, PooledClass.threeArgumentPooler);
};

PooledClass.addPoolingTo(SyntheticEvent, PooledClass.threeArgumentPooler);

module.exports = SyntheticEvent;

},{"./Object.assign":33,"./PooledClass":34,"./emptyFunction":121,"./getEventTarget":132}],103:[function(require,module,exports){
/**
 * Copyright 2013-2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule SyntheticFocusEvent
 * @typechecks static-only
 */

'use strict';

var SyntheticUIEvent = require("./SyntheticUIEvent");

/**
 * @interface FocusEvent
 * @see http://www.w3.org/TR/DOM-Level-3-Events/
 */
var FocusEventInterface = {
  relatedTarget: null
};

/**
 * @param {object} dispatchConfig Configuration used to dispatch this event.
 * @param {string} dispatchMarker Marker identifying the event target.
 * @param {object} nativeEvent Native browser event.
 * @extends {SyntheticUIEvent}
 */
function SyntheticFocusEvent(dispatchConfig, dispatchMarker, nativeEvent) {
  SyntheticUIEvent.call(this, dispatchConfig, dispatchMarker, nativeEvent);
}

SyntheticUIEvent.augmentClass(SyntheticFocusEvent, FocusEventInterface);

module.exports = SyntheticFocusEvent;

},{"./SyntheticUIEvent":108}],104:[function(require,module,exports){
/**
 * Copyright 2013-2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule SyntheticInputEvent
 * @typechecks static-only
 */

'use strict';

var SyntheticEvent = require("./SyntheticEvent");

/**
 * @interface Event
 * @see http://www.w3.org/TR/2013/WD-DOM-Level-3-Events-20131105
 *      /#events-inputevents
 */
var InputEventInterface = {
  data: null
};

/**
 * @param {object} dispatchConfig Configuration used to dispatch this event.
 * @param {string} dispatchMarker Marker identifying the event target.
 * @param {object} nativeEvent Native browser event.
 * @extends {SyntheticUIEvent}
 */
function SyntheticInputEvent(
  dispatchConfig,
  dispatchMarker,
  nativeEvent) {
  SyntheticEvent.call(this, dispatchConfig, dispatchMarker, nativeEvent);
}

SyntheticEvent.augmentClass(
  SyntheticInputEvent,
  InputEventInterface
);

module.exports = SyntheticInputEvent;

},{"./SyntheticEvent":102}],105:[function(require,module,exports){
/**
 * Copyright 2013-2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule SyntheticKeyboardEvent
 * @typechecks static-only
 */

'use strict';

var SyntheticUIEvent = require("./SyntheticUIEvent");

var getEventCharCode = require("./getEventCharCode");
var getEventKey = require("./getEventKey");
var getEventModifierState = require("./getEventModifierState");

/**
 * @interface KeyboardEvent
 * @see http://www.w3.org/TR/DOM-Level-3-Events/
 */
var KeyboardEventInterface = {
  key: getEventKey,
  location: null,
  ctrlKey: null,
  shiftKey: null,
  altKey: null,
  metaKey: null,
  repeat: null,
  locale: null,
  getModifierState: getEventModifierState,
  // Legacy Interface
  charCode: function(event) {
    // `charCode` is the result of a KeyPress event and represents the value of
    // the actual printable character.

    // KeyPress is deprecated, but its replacement is not yet final and not
    // implemented in any major browser. Only KeyPress has charCode.
    if (event.type === 'keypress') {
      return getEventCharCode(event);
    }
    return 0;
  },
  keyCode: function(event) {
    // `keyCode` is the result of a KeyDown/Up event and represents the value of
    // physical keyboard key.

    // The actual meaning of the value depends on the users' keyboard layout
    // which cannot be detected. Assuming that it is a US keyboard layout
    // provides a surprisingly accurate mapping for US and European users.
    // Due to this, it is left to the user to implement at this time.
    if (event.type === 'keydown' || event.type === 'keyup') {
      return event.keyCode;
    }
    return 0;
  },
  which: function(event) {
    // `which` is an alias for either `keyCode` or `charCode` depending on the
    // type of the event.
    if (event.type === 'keypress') {
      return getEventCharCode(event);
    }
    if (event.type === 'keydown' || event.type === 'keyup') {
      return event.keyCode;
    }
    return 0;
  }
};

/**
 * @param {object} dispatchConfig Configuration used to dispatch this event.
 * @param {string} dispatchMarker Marker identifying the event target.
 * @param {object} nativeEvent Native browser event.
 * @extends {SyntheticUIEvent}
 */
function SyntheticKeyboardEvent(dispatchConfig, dispatchMarker, nativeEvent) {
  SyntheticUIEvent.call(this, dispatchConfig, dispatchMarker, nativeEvent);
}

SyntheticUIEvent.augmentClass(SyntheticKeyboardEvent, KeyboardEventInterface);

module.exports = SyntheticKeyboardEvent;

},{"./SyntheticUIEvent":108,"./getEventCharCode":129,"./getEventKey":130,"./getEventModifierState":131}],106:[function(require,module,exports){
/**
 * Copyright 2013-2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule SyntheticMouseEvent
 * @typechecks static-only
 */

'use strict';

var SyntheticUIEvent = require("./SyntheticUIEvent");
var ViewportMetrics = require("./ViewportMetrics");

var getEventModifierState = require("./getEventModifierState");

/**
 * @interface MouseEvent
 * @see http://www.w3.org/TR/DOM-Level-3-Events/
 */
var MouseEventInterface = {
  screenX: null,
  screenY: null,
  clientX: null,
  clientY: null,
  ctrlKey: null,
  shiftKey: null,
  altKey: null,
  metaKey: null,
  getModifierState: getEventModifierState,
  button: function(event) {
    // Webkit, Firefox, IE9+
    // which:  1 2 3
    // button: 0 1 2 (standard)
    var button = event.button;
    if ('which' in event) {
      return button;
    }
    // IE<9
    // which:  undefined
    // button: 0 0 0
    // button: 1 4 2 (onmouseup)
    return button === 2 ? 2 : button === 4 ? 1 : 0;
  },
  buttons: null,
  relatedTarget: function(event) {
    return event.relatedTarget || (
      ((event.fromElement === event.srcElement ? event.toElement : event.fromElement))
    );
  },
  // "Proprietary" Interface.
  pageX: function(event) {
    return 'pageX' in event ?
      event.pageX :
      event.clientX + ViewportMetrics.currentScrollLeft;
  },
  pageY: function(event) {
    return 'pageY' in event ?
      event.pageY :
      event.clientY + ViewportMetrics.currentScrollTop;
  }
};

/**
 * @param {object} dispatchConfig Configuration used to dispatch this event.
 * @param {string} dispatchMarker Marker identifying the event target.
 * @param {object} nativeEvent Native browser event.
 * @extends {SyntheticUIEvent}
 */
function SyntheticMouseEvent(dispatchConfig, dispatchMarker, nativeEvent) {
  SyntheticUIEvent.call(this, dispatchConfig, dispatchMarker, nativeEvent);
}

SyntheticUIEvent.augmentClass(SyntheticMouseEvent, MouseEventInterface);

module.exports = SyntheticMouseEvent;

},{"./SyntheticUIEvent":108,"./ViewportMetrics":111,"./getEventModifierState":131}],107:[function(require,module,exports){
/**
 * Copyright 2013-2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule SyntheticTouchEvent
 * @typechecks static-only
 */

'use strict';

var SyntheticUIEvent = require("./SyntheticUIEvent");

var getEventModifierState = require("./getEventModifierState");

/**
 * @interface TouchEvent
 * @see http://www.w3.org/TR/touch-events/
 */
var TouchEventInterface = {
  touches: null,
  targetTouches: null,
  changedTouches: null,
  altKey: null,
  metaKey: null,
  ctrlKey: null,
  shiftKey: null,
  getModifierState: getEventModifierState
};

/**
 * @param {object} dispatchConfig Configuration used to dispatch this event.
 * @param {string} dispatchMarker Marker identifying the event target.
 * @param {object} nativeEvent Native browser event.
 * @extends {SyntheticUIEvent}
 */
function SyntheticTouchEvent(dispatchConfig, dispatchMarker, nativeEvent) {
  SyntheticUIEvent.call(this, dispatchConfig, dispatchMarker, nativeEvent);
}

SyntheticUIEvent.augmentClass(SyntheticTouchEvent, TouchEventInterface);

module.exports = SyntheticTouchEvent;

},{"./SyntheticUIEvent":108,"./getEventModifierState":131}],108:[function(require,module,exports){
/**
 * Copyright 2013-2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule SyntheticUIEvent
 * @typechecks static-only
 */

'use strict';

var SyntheticEvent = require("./SyntheticEvent");

var getEventTarget = require("./getEventTarget");

/**
 * @interface UIEvent
 * @see http://www.w3.org/TR/DOM-Level-3-Events/
 */
var UIEventInterface = {
  view: function(event) {
    if (event.view) {
      return event.view;
    }

    var target = getEventTarget(event);
    if (target != null && target.window === target) {
      // target is a window object
      return target;
    }

    var doc = target.ownerDocument;
    // TODO: Figure out why `ownerDocument` is sometimes undefined in IE8.
    if (doc) {
      return doc.defaultView || doc.parentWindow;
    } else {
      return window;
    }
  },
  detail: function(event) {
    return event.detail || 0;
  }
};

/**
 * @param {object} dispatchConfig Configuration used to dispatch this event.
 * @param {string} dispatchMarker Marker identifying the event target.
 * @param {object} nativeEvent Native browser event.
 * @extends {SyntheticEvent}
 */
function SyntheticUIEvent(dispatchConfig, dispatchMarker, nativeEvent) {
  SyntheticEvent.call(this, dispatchConfig, dispatchMarker, nativeEvent);
}

SyntheticEvent.augmentClass(SyntheticUIEvent, UIEventInterface);

module.exports = SyntheticUIEvent;

},{"./SyntheticEvent":102,"./getEventTarget":132}],109:[function(require,module,exports){
/**
 * Copyright 2013-2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule SyntheticWheelEvent
 * @typechecks static-only
 */

'use strict';

var SyntheticMouseEvent = require("./SyntheticMouseEvent");

/**
 * @interface WheelEvent
 * @see http://www.w3.org/TR/DOM-Level-3-Events/
 */
var WheelEventInterface = {
  deltaX: function(event) {
    return (
      'deltaX' in event ? event.deltaX :
      // Fallback to `wheelDeltaX` for Webkit and normalize (right is positive).
      'wheelDeltaX' in event ? -event.wheelDeltaX : 0
    );
  },
  deltaY: function(event) {
    return (
      'deltaY' in event ? event.deltaY :
      // Fallback to `wheelDeltaY` for Webkit and normalize (down is positive).
      'wheelDeltaY' in event ? -event.wheelDeltaY :
      // Fallback to `wheelDelta` for IE<9 and normalize (down is positive).
      'wheelDelta' in event ? -event.wheelDelta : 0
    );
  },
  deltaZ: null,

  // Browsers without "deltaMode" is reporting in raw wheel delta where one
  // notch on the scroll is always +/- 120, roughly equivalent to pixels.
  // A good approximation of DOM_DELTA_LINE (1) is 5% of viewport size or
  // ~40 pixels, for DOM_DELTA_SCREEN (2) it is 87.5% of viewport size.
  deltaMode: null
};

/**
 * @param {object} dispatchConfig Configuration used to dispatch this event.
 * @param {string} dispatchMarker Marker identifying the event target.
 * @param {object} nativeEvent Native browser event.
 * @extends {SyntheticMouseEvent}
 */
function SyntheticWheelEvent(dispatchConfig, dispatchMarker, nativeEvent) {
  SyntheticMouseEvent.call(this, dispatchConfig, dispatchMarker, nativeEvent);
}

SyntheticMouseEvent.augmentClass(SyntheticWheelEvent, WheelEventInterface);

module.exports = SyntheticWheelEvent;

},{"./SyntheticMouseEvent":106}],110:[function(require,module,exports){
(function (process){
/**
 * Copyright 2013-2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule Transaction
 */

'use strict';

var invariant = require("./invariant");

/**
 * `Transaction` creates a black box that is able to wrap any method such that
 * certain invariants are maintained before and after the method is invoked
 * (Even if an exception is thrown while invoking the wrapped method). Whoever
 * instantiates a transaction can provide enforcers of the invariants at
 * creation time. The `Transaction` class itself will supply one additional
 * automatic invariant for you - the invariant that any transaction instance
 * should not be run while it is already being run. You would typically create a
 * single instance of a `Transaction` for reuse multiple times, that potentially
 * is used to wrap several different methods. Wrappers are extremely simple -
 * they only require implementing two methods.
 *
 * <pre>
 *                       wrappers (injected at creation time)
 *                                      +        +
 *                                      |        |
 *                    +-----------------|--------|--------------+
 *                    |                 v        |              |
 *                    |      +---------------+   |              |
 *                    |   +--|    wrapper1   |---|----+         |
 *                    |   |  +---------------+   v    |         |
 *                    |   |          +-------------+  |         |
 *                    |   |     +----|   wrapper2  |--------+   |
 *                    |   |     |    +-------------+  |     |   |
 *                    |   |     |                     |     |   |
 *                    |   v     v                     v     v   | wrapper
 *                    | +---+ +---+   +---------+   +---+ +---+ | invariants
 * perform(anyMethod) | |   | |   |   |         |   |   | |   | | maintained
 * +----------------->|-|---|-|---|-->|anyMethod|---|---|-|---|-|-------->
 *                    | |   | |   |   |         |   |   | |   | |
 *                    | |   | |   |   |         |   |   | |   | |
 *                    | |   | |   |   |         |   |   | |   | |
 *                    | +---+ +---+   +---------+   +---+ +---+ |
 *                    |  initialize                    close    |
 *                    +-----------------------------------------+
 * </pre>
 *
 * Use cases:
 * - Preserving the input selection ranges before/after reconciliation.
 *   Restoring selection even in the event of an unexpected error.
 * - Deactivating events while rearranging the DOM, preventing blurs/focuses,
 *   while guaranteeing that afterwards, the event system is reactivated.
 * - Flushing a queue of collected DOM mutations to the main UI thread after a
 *   reconciliation takes place in a worker thread.
 * - Invoking any collected `componentDidUpdate` callbacks after rendering new
 *   content.
 * - (Future use case): Wrapping particular flushes of the `ReactWorker` queue
 *   to preserve the `scrollTop` (an automatic scroll aware DOM).
 * - (Future use case): Layout calculations before and after DOM updates.
 *
 * Transactional plugin API:
 * - A module that has an `initialize` method that returns any precomputation.
 * - and a `close` method that accepts the precomputation. `close` is invoked
 *   when the wrapped process is completed, or has failed.
 *
 * @param {Array<TransactionalWrapper>} transactionWrapper Wrapper modules
 * that implement `initialize` and `close`.
 * @return {Transaction} Single transaction for reuse in thread.
 *
 * @class Transaction
 */
var Mixin = {
  /**
   * Sets up this instance so that it is prepared for collecting metrics. Does
   * so such that this setup method may be used on an instance that is already
   * initialized, in a way that does not consume additional memory upon reuse.
   * That can be useful if you decide to make your subclass of this mixin a
   * "PooledClass".
   */
  reinitializeTransaction: function() {
    this.transactionWrappers = this.getTransactionWrappers();
    if (!this.wrapperInitData) {
      this.wrapperInitData = [];
    } else {
      this.wrapperInitData.length = 0;
    }
    this._isInTransaction = false;
  },

  _isInTransaction: false,

  /**
   * @abstract
   * @return {Array<TransactionWrapper>} Array of transaction wrappers.
   */
  getTransactionWrappers: null,

  isInTransaction: function() {
    return !!this._isInTransaction;
  },

  /**
   * Executes the function within a safety window. Use this for the top level
   * methods that result in large amounts of computation/mutations that would
   * need to be safety checked.
   *
   * @param {function} method Member of scope to call.
   * @param {Object} scope Scope to invoke from.
   * @param {Object?=} args... Arguments to pass to the method (optional).
   *                           Helps prevent need to bind in many cases.
   * @return Return value from `method`.
   */
  perform: function(method, scope, a, b, c, d, e, f) {
    ("production" !== process.env.NODE_ENV ? invariant(
      !this.isInTransaction(),
      'Transaction.perform(...): Cannot initialize a transaction when there ' +
      'is already an outstanding transaction.'
    ) : invariant(!this.isInTransaction()));
    var errorThrown;
    var ret;
    try {
      this._isInTransaction = true;
      // Catching errors makes debugging more difficult, so we start with
      // errorThrown set to true before setting it to false after calling
      // close -- if it's still set to true in the finally block, it means
      // one of these calls threw.
      errorThrown = true;
      this.initializeAll(0);
      ret = method.call(scope, a, b, c, d, e, f);
      errorThrown = false;
    } finally {
      try {
        if (errorThrown) {
          // If `method` throws, prefer to show that stack trace over any thrown
          // by invoking `closeAll`.
          try {
            this.closeAll(0);
          } catch (err) {
          }
        } else {
          // Since `method` didn't throw, we don't want to silence the exception
          // here.
          this.closeAll(0);
        }
      } finally {
        this._isInTransaction = false;
      }
    }
    return ret;
  },

  initializeAll: function(startIndex) {
    var transactionWrappers = this.transactionWrappers;
    for (var i = startIndex; i < transactionWrappers.length; i++) {
      var wrapper = transactionWrappers[i];
      try {
        // Catching errors makes debugging more difficult, so we start with the
        // OBSERVED_ERROR state before overwriting it with the real return value
        // of initialize -- if it's still set to OBSERVED_ERROR in the finally
        // block, it means wrapper.initialize threw.
        this.wrapperInitData[i] = Transaction.OBSERVED_ERROR;
        this.wrapperInitData[i] = wrapper.initialize ?
          wrapper.initialize.call(this) :
          null;
      } finally {
        if (this.wrapperInitData[i] === Transaction.OBSERVED_ERROR) {
          // The initializer for wrapper i threw an error; initialize the
          // remaining wrappers but silence any exceptions from them to ensure
          // that the first error is the one to bubble up.
          try {
            this.initializeAll(i + 1);
          } catch (err) {
          }
        }
      }
    }
  },

  /**
   * Invokes each of `this.transactionWrappers.close[i]` functions, passing into
   * them the respective return values of `this.transactionWrappers.init[i]`
   * (`close`rs that correspond to initializers that failed will not be
   * invoked).
   */
  closeAll: function(startIndex) {
    ("production" !== process.env.NODE_ENV ? invariant(
      this.isInTransaction(),
      'Transaction.closeAll(): Cannot close transaction when none are open.'
    ) : invariant(this.isInTransaction()));
    var transactionWrappers = this.transactionWrappers;
    for (var i = startIndex; i < transactionWrappers.length; i++) {
      var wrapper = transactionWrappers[i];
      var initData = this.wrapperInitData[i];
      var errorThrown;
      try {
        // Catching errors makes debugging more difficult, so we start with
        // errorThrown set to true before setting it to false after calling
        // close -- if it's still set to true in the finally block, it means
        // wrapper.close threw.
        errorThrown = true;
        if (initData !== Transaction.OBSERVED_ERROR && wrapper.close) {
          wrapper.close.call(this, initData);
        }
        errorThrown = false;
      } finally {
        if (errorThrown) {
          // The closer for wrapper i threw an error; close the remaining
          // wrappers but silence any exceptions from them to ensure that the
          // first error is the one to bubble up.
          try {
            this.closeAll(i + 1);
          } catch (e) {
          }
        }
      }
    }
    this.wrapperInitData.length = 0;
  }
};

var Transaction = {

  Mixin: Mixin,

  /**
   * Token to look for to determine if an error occured.
   */
  OBSERVED_ERROR: {}

};

module.exports = Transaction;

}).call(this,require('_process'))
},{"./invariant":142,"_process":6}],111:[function(require,module,exports){
/**
 * Copyright 2013-2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule ViewportMetrics
 */

'use strict';

var ViewportMetrics = {

  currentScrollLeft: 0,

  currentScrollTop: 0,

  refreshScrollValues: function(scrollPosition) {
    ViewportMetrics.currentScrollLeft = scrollPosition.x;
    ViewportMetrics.currentScrollTop = scrollPosition.y;
  }

};

module.exports = ViewportMetrics;

},{}],112:[function(require,module,exports){
(function (process){
/**
 * Copyright 2014-2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule accumulateInto
 */

'use strict';

var invariant = require("./invariant");

/**
 *
 * Accumulates items that must not be null or undefined into the first one. This
 * is used to conserve memory by avoiding array allocations, and thus sacrifices
 * API cleanness. Since `current` can be null before being passed in and not
 * null after this function, make sure to assign it back to `current`:
 *
 * `a = accumulateInto(a, b);`
 *
 * This API should be sparingly used. Try `accumulate` for something cleaner.
 *
 * @return {*|array<*>} An accumulation of items.
 */

function accumulateInto(current, next) {
  ("production" !== process.env.NODE_ENV ? invariant(
    next != null,
    'accumulateInto(...): Accumulated items must not be null or undefined.'
  ) : invariant(next != null));
  if (current == null) {
    return next;
  }

  // Both are not empty. Warning: Never call x.concat(y) when you are not
  // certain that x is an Array (x could be a string with concat method).
  var currentIsArray = Array.isArray(current);
  var nextIsArray = Array.isArray(next);

  if (currentIsArray && nextIsArray) {
    current.push.apply(current, next);
    return current;
  }

  if (currentIsArray) {
    current.push(next);
    return current;
  }

  if (nextIsArray) {
    // A bit too dangerous to mutate `next`.
    return [current].concat(next);
  }

  return [current, next];
}

module.exports = accumulateInto;

}).call(this,require('_process'))
},{"./invariant":142,"_process":6}],113:[function(require,module,exports){
/**
 * Copyright 2013-2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule adler32
 */

/* jslint bitwise:true */

'use strict';

var MOD = 65521;

// This is a clean-room implementation of adler32 designed for detecting
// if markup is not what we expect it to be. It does not need to be
// cryptographically strong, only reasonably good at detecting if markup
// generated on the server is different than that on the client.
function adler32(data) {
  var a = 1;
  var b = 0;
  for (var i = 0; i < data.length; i++) {
    a = (a + data.charCodeAt(i)) % MOD;
    b = (b + a) % MOD;
  }
  return a | (b << 16);
}

module.exports = adler32;

},{}],114:[function(require,module,exports){
/**
 * Copyright 2013-2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule camelize
 * @typechecks
 */

var _hyphenPattern = /-(.)/g;

/**
 * Camelcases a hyphenated string, for example:
 *
 *   > camelize('background-color')
 *   < "backgroundColor"
 *
 * @param {string} string
 * @return {string}
 */
function camelize(string) {
  return string.replace(_hyphenPattern, function(_, character) {
    return character.toUpperCase();
  });
}

module.exports = camelize;

},{}],115:[function(require,module,exports){
/**
 * Copyright 2014-2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule camelizeStyleName
 * @typechecks
 */

"use strict";

var camelize = require("./camelize");

var msPattern = /^-ms-/;

/**
 * Camelcases a hyphenated CSS property name, for example:
 *
 *   > camelizeStyleName('background-color')
 *   < "backgroundColor"
 *   > camelizeStyleName('-moz-transition')
 *   < "MozTransition"
 *   > camelizeStyleName('-ms-transition')
 *   < "msTransition"
 *
 * As Andi Smith suggests
 * (http://www.andismith.com/blog/2012/02/modernizr-prefixed/), an `-ms` prefix
 * is converted to lowercase `ms`.
 *
 * @param {string} string
 * @return {string}
 */
function camelizeStyleName(string) {
  return camelize(string.replace(msPattern, 'ms-'));
}

module.exports = camelizeStyleName;

},{"./camelize":114}],116:[function(require,module,exports){
/**
 * Copyright 2013-2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule containsNode
 * @typechecks
 */

var isTextNode = require("./isTextNode");

/*jslint bitwise:true */

/**
 * Checks if a given DOM node contains or is another DOM node.
 *
 * @param {?DOMNode} outerNode Outer DOM node.
 * @param {?DOMNode} innerNode Inner DOM node.
 * @return {boolean} True if `outerNode` contains or is `innerNode`.
 */
function containsNode(outerNode, innerNode) {
  if (!outerNode || !innerNode) {
    return false;
  } else if (outerNode === innerNode) {
    return true;
  } else if (isTextNode(outerNode)) {
    return false;
  } else if (isTextNode(innerNode)) {
    return containsNode(outerNode, innerNode.parentNode);
  } else if (outerNode.contains) {
    return outerNode.contains(innerNode);
  } else if (outerNode.compareDocumentPosition) {
    return !!(outerNode.compareDocumentPosition(innerNode) & 16);
  } else {
    return false;
  }
}

module.exports = containsNode;

},{"./isTextNode":146}],117:[function(require,module,exports){
/**
 * Copyright 2013-2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule createArrayFromMixed
 * @typechecks
 */

var toArray = require("./toArray");

/**
 * Perform a heuristic test to determine if an object is "array-like".
 *
 *   A monk asked Joshu, a Zen master, "Has a dog Buddha nature?"
 *   Joshu replied: "Mu."
 *
 * This function determines if its argument has "array nature": it returns
 * true if the argument is an actual array, an `arguments' object, or an
 * HTMLCollection (e.g. node.childNodes or node.getElementsByTagName()).
 *
 * It will return false for other array-like objects like Filelist.
 *
 * @param {*} obj
 * @return {boolean}
 */
function hasArrayNature(obj) {
  return (
    // not null/false
    !!obj &&
    // arrays are objects, NodeLists are functions in Safari
    (typeof obj == 'object' || typeof obj == 'function') &&
    // quacks like an array
    ('length' in obj) &&
    // not window
    !('setInterval' in obj) &&
    // no DOM node should be considered an array-like
    // a 'select' element has 'length' and 'item' properties on IE8
    (typeof obj.nodeType != 'number') &&
    (
      // a real array
      (// HTMLCollection/NodeList
      (Array.isArray(obj) ||
      // arguments
      ('callee' in obj) || 'item' in obj))
    )
  );
}

/**
 * Ensure that the argument is an array by wrapping it in an array if it is not.
 * Creates a copy of the argument if it is already an array.
 *
 * This is mostly useful idiomatically:
 *
 *   var createArrayFromMixed = require('createArrayFromMixed');
 *
 *   function takesOneOrMoreThings(things) {
 *     things = createArrayFromMixed(things);
 *     ...
 *   }
 *
 * This allows you to treat `things' as an array, but accept scalars in the API.
 *
 * If you need to convert an array-like object, like `arguments`, into an array
 * use toArray instead.
 *
 * @param {*} obj
 * @return {array}
 */
function createArrayFromMixed(obj) {
  if (!hasArrayNature(obj)) {
    return [obj];
  } else if (Array.isArray(obj)) {
    return obj.slice();
  } else {
    return toArray(obj);
  }
}

module.exports = createArrayFromMixed;

},{"./toArray":159}],118:[function(require,module,exports){
(function (process){
/**
 * Copyright 2013-2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule createFullPageComponent
 * @typechecks
 */

'use strict';

// Defeat circular references by requiring this directly.
var ReactClass = require("./ReactClass");
var ReactElement = require("./ReactElement");

var invariant = require("./invariant");

/**
 * Create a component that will throw an exception when unmounted.
 *
 * Components like <html> <head> and <body> can't be removed or added
 * easily in a cross-browser way, however it's valuable to be able to
 * take advantage of React's reconciliation for styling and <title>
 * management. So we just document it and throw in dangerous cases.
 *
 * @param {string} tag The tag to wrap
 * @return {function} convenience constructor of new component
 */
function createFullPageComponent(tag) {
  var elementFactory = ReactElement.createFactory(tag);

  var FullPageComponent = ReactClass.createClass({
    tagName: tag.toUpperCase(),
    displayName: 'ReactFullPageComponent' + tag,

    componentWillUnmount: function() {
      ("production" !== process.env.NODE_ENV ? invariant(
        false,
        '%s tried to unmount. Because of cross-browser quirks it is ' +
        'impossible to unmount some top-level components (eg <html>, <head>, ' +
        'and <body>) reliably and efficiently. To fix this, have a single ' +
        'top-level component that never unmounts render these elements.',
        this.constructor.displayName
      ) : invariant(false));
    },

    render: function() {
      return elementFactory(this.props);
    }
  });

  return FullPageComponent;
}

module.exports = createFullPageComponent;

}).call(this,require('_process'))
},{"./ReactClass":40,"./ReactElement":64,"./invariant":142,"_process":6}],119:[function(require,module,exports){
(function (process){
/**
 * Copyright 2013-2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule createNodesFromMarkup
 * @typechecks
 */

/*jslint evil: true, sub: true */

var ExecutionEnvironment = require("./ExecutionEnvironment");

var createArrayFromMixed = require("./createArrayFromMixed");
var getMarkupWrap = require("./getMarkupWrap");
var invariant = require("./invariant");

/**
 * Dummy container used to render all markup.
 */
var dummyNode =
  ExecutionEnvironment.canUseDOM ? document.createElement('div') : null;

/**
 * Pattern used by `getNodeName`.
 */
var nodeNamePattern = /^\s*<(\w+)/;

/**
 * Extracts the `nodeName` of the first element in a string of markup.
 *
 * @param {string} markup String of markup.
 * @return {?string} Node name of the supplied markup.
 */
function getNodeName(markup) {
  var nodeNameMatch = markup.match(nodeNamePattern);
  return nodeNameMatch && nodeNameMatch[1].toLowerCase();
}

/**
 * Creates an array containing the nodes rendered from the supplied markup. The
 * optionally supplied `handleScript` function will be invoked once for each
 * <script> element that is rendered. If no `handleScript` function is supplied,
 * an exception is thrown if any <script> elements are rendered.
 *
 * @param {string} markup A string of valid HTML markup.
 * @param {?function} handleScript Invoked once for each rendered <script>.
 * @return {array<DOMElement|DOMTextNode>} An array of rendered nodes.
 */
function createNodesFromMarkup(markup, handleScript) {
  var node = dummyNode;
  ("production" !== process.env.NODE_ENV ? invariant(!!dummyNode, 'createNodesFromMarkup dummy not initialized') : invariant(!!dummyNode));
  var nodeName = getNodeName(markup);

  var wrap = nodeName && getMarkupWrap(nodeName);
  if (wrap) {
    node.innerHTML = wrap[1] + markup + wrap[2];

    var wrapDepth = wrap[0];
    while (wrapDepth--) {
      node = node.lastChild;
    }
  } else {
    node.innerHTML = markup;
  }

  var scripts = node.getElementsByTagName('script');
  if (scripts.length) {
    ("production" !== process.env.NODE_ENV ? invariant(
      handleScript,
      'createNodesFromMarkup(...): Unexpected <script> element rendered.'
    ) : invariant(handleScript));
    createArrayFromMixed(scripts).forEach(handleScript);
  }

  var nodes = createArrayFromMixed(node.childNodes);
  while (node.lastChild) {
    node.removeChild(node.lastChild);
  }
  return nodes;
}

module.exports = createNodesFromMarkup;

}).call(this,require('_process'))
},{"./ExecutionEnvironment":27,"./createArrayFromMixed":117,"./getMarkupWrap":134,"./invariant":142,"_process":6}],120:[function(require,module,exports){
/**
 * Copyright 2013-2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule dangerousStyleValue
 * @typechecks static-only
 */

'use strict';

var CSSProperty = require("./CSSProperty");

var isUnitlessNumber = CSSProperty.isUnitlessNumber;

/**
 * Convert a value into the proper css writable value. The style name `name`
 * should be logical (no hyphens), as specified
 * in `CSSProperty.isUnitlessNumber`.
 *
 * @param {string} name CSS property name such as `topMargin`.
 * @param {*} value CSS property value such as `10px`.
 * @return {string} Normalized style value with dimensions applied.
 */
function dangerousStyleValue(name, value) {
  // Note that we've removed escapeTextForBrowser() calls here since the
  // whole string will be escaped when the attribute is injected into
  // the markup. If you provide unsafe user data here they can inject
  // arbitrary CSS which may be problematic (I couldn't repro this):
  // https://www.owasp.org/index.php/XSS_Filter_Evasion_Cheat_Sheet
  // http://www.thespanner.co.uk/2007/11/26/ultimate-xss-css-injection/
  // This is not an XSS hole but instead a potential CSS injection issue
  // which has lead to a greater discussion about how we're going to
  // trust URLs moving forward. See #2115901

  var isEmpty = value == null || typeof value === 'boolean' || value === '';
  if (isEmpty) {
    return '';
  }

  var isNonNumeric = isNaN(value);
  if (isNonNumeric || value === 0 ||
      isUnitlessNumber.hasOwnProperty(name) && isUnitlessNumber[name]) {
    return '' + value; // cast to string
  }

  if (typeof value === 'string') {
    value = value.trim();
  }
  return value + 'px';
}

module.exports = dangerousStyleValue;

},{"./CSSProperty":10}],121:[function(require,module,exports){
/**
 * Copyright 2013-2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule emptyFunction
 */

function makeEmptyFunction(arg) {
  return function() {
    return arg;
  };
}

/**
 * This function accepts and discards inputs; it has no side effects. This is
 * primarily useful idiomatically for overridable function endpoints which
 * always need to be callable, since JS lacks a null-call idiom ala Cocoa.
 */
function emptyFunction() {}

emptyFunction.thatReturns = makeEmptyFunction;
emptyFunction.thatReturnsFalse = makeEmptyFunction(false);
emptyFunction.thatReturnsTrue = makeEmptyFunction(true);
emptyFunction.thatReturnsNull = makeEmptyFunction(null);
emptyFunction.thatReturnsThis = function() { return this; };
emptyFunction.thatReturnsArgument = function(arg) { return arg; };

module.exports = emptyFunction;

},{}],122:[function(require,module,exports){
(function (process){
/**
 * Copyright 2013-2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule emptyObject
 */

"use strict";

var emptyObject = {};

if ("production" !== process.env.NODE_ENV) {
  Object.freeze(emptyObject);
}

module.exports = emptyObject;

}).call(this,require('_process'))
},{"_process":6}],123:[function(require,module,exports){
/**
 * Copyright 2013-2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule escapeTextContentForBrowser
 */

'use strict';

var ESCAPE_LOOKUP = {
  '&': '&amp;',
  '>': '&gt;',
  '<': '&lt;',
  '"': '&quot;',
  '\'': '&#x27;'
};

var ESCAPE_REGEX = /[&><"']/g;

function escaper(match) {
  return ESCAPE_LOOKUP[match];
}

/**
 * Escapes text to prevent scripting attacks.
 *
 * @param {*} text Text value to escape.
 * @return {string} An escaped string.
 */
function escapeTextContentForBrowser(text) {
  return ('' + text).replace(ESCAPE_REGEX, escaper);
}

module.exports = escapeTextContentForBrowser;

},{}],124:[function(require,module,exports){
(function (process){
/**
 * Copyright 2013-2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule findDOMNode
 * @typechecks static-only
 */

'use strict';

var ReactCurrentOwner = require("./ReactCurrentOwner");
var ReactInstanceMap = require("./ReactInstanceMap");
var ReactMount = require("./ReactMount");

var invariant = require("./invariant");
var isNode = require("./isNode");
var warning = require("./warning");

/**
 * Returns the DOM node rendered by this element.
 *
 * @param {ReactComponent|DOMElement} componentOrElement
 * @return {DOMElement} The root node of this element.
 */
function findDOMNode(componentOrElement) {
  if ("production" !== process.env.NODE_ENV) {
    var owner = ReactCurrentOwner.current;
    if (owner !== null) {
      ("production" !== process.env.NODE_ENV ? warning(
        owner._warnedAboutRefsInRender,
        '%s is accessing getDOMNode or findDOMNode inside its render(). ' +
        'render() should be a pure function of props and state. It should ' +
        'never access something that requires stale data from the previous ' +
        'render, such as refs. Move this logic to componentDidMount and ' +
        'componentDidUpdate instead.',
        owner.getName() || 'A component'
      ) : null);
      owner._warnedAboutRefsInRender = true;
    }
  }
  if (componentOrElement == null) {
    return null;
  }
  if (isNode(componentOrElement)) {
    return componentOrElement;
  }
  if (ReactInstanceMap.has(componentOrElement)) {
    return ReactMount.getNodeFromInstance(componentOrElement);
  }
  ("production" !== process.env.NODE_ENV ? invariant(
    componentOrElement.render == null ||
    typeof componentOrElement.render !== 'function',
    'Component (with keys: %s) contains `render` method ' +
    'but is not mounted in the DOM',
    Object.keys(componentOrElement)
  ) : invariant(componentOrElement.render == null ||
  typeof componentOrElement.render !== 'function'));
  ("production" !== process.env.NODE_ENV ? invariant(
    false,
    'Element appears to be neither ReactComponent nor DOMNode (keys: %s)',
    Object.keys(componentOrElement)
  ) : invariant(false));
}

module.exports = findDOMNode;

}).call(this,require('_process'))
},{"./ReactCurrentOwner":46,"./ReactInstanceMap":74,"./ReactMount":77,"./invariant":142,"./isNode":144,"./warning":161,"_process":6}],125:[function(require,module,exports){
(function (process){
/**
 * Copyright 2013-2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule flattenChildren
 */

'use strict';

var traverseAllChildren = require("./traverseAllChildren");
var warning = require("./warning");

/**
 * @param {function} traverseContext Context passed through traversal.
 * @param {?ReactComponent} child React child component.
 * @param {!string} name String name of key path to child.
 */
function flattenSingleChildIntoContext(traverseContext, child, name) {
  // We found a component instance.
  var result = traverseContext;
  var keyUnique = !result.hasOwnProperty(name);
  if ("production" !== process.env.NODE_ENV) {
    ("production" !== process.env.NODE_ENV ? warning(
      keyUnique,
      'flattenChildren(...): Encountered two children with the same key, ' +
      '`%s`. Child keys must be unique; when two children share a key, only ' +
      'the first child will be used.',
      name
    ) : null);
  }
  if (keyUnique && child != null) {
    result[name] = child;
  }
}

/**
 * Flattens children that are typically specified as `props.children`. Any null
 * children will not be included in the resulting object.
 * @return {!object} flattened children keyed by name.
 */
function flattenChildren(children) {
  if (children == null) {
    return children;
  }
  var result = {};
  traverseAllChildren(children, flattenSingleChildIntoContext, result);
  return result;
}

module.exports = flattenChildren;

}).call(this,require('_process'))
},{"./traverseAllChildren":160,"./warning":161,"_process":6}],126:[function(require,module,exports){
/**
 * Copyright 2014-2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule focusNode
 */

"use strict";

/**
 * @param {DOMElement} node input/textarea to focus
 */
function focusNode(node) {
  // IE8 can throw "Can't move focus to the control because it is invisible,
  // not enabled, or of a type that does not accept the focus." for all kinds of
  // reasons that are too expensive and fragile to test.
  try {
    node.focus();
  } catch(e) {
  }
}

module.exports = focusNode;

},{}],127:[function(require,module,exports){
/**
 * Copyright 2013-2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule forEachAccumulated
 */

'use strict';

/**
 * @param {array} an "accumulation" of items which is either an Array or
 * a single item. Useful when paired with the `accumulate` module. This is a
 * simple utility that allows us to reason about a collection of items, but
 * handling the case when there is exactly one item (and we do not need to
 * allocate an array).
 */
var forEachAccumulated = function(arr, cb, scope) {
  if (Array.isArray(arr)) {
    arr.forEach(cb, scope);
  } else if (arr) {
    cb.call(scope, arr);
  }
};

module.exports = forEachAccumulated;

},{}],128:[function(require,module,exports){
/**
 * Copyright 2013-2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule getActiveElement
 * @typechecks
 */

/**
 * Same as document.activeElement but wraps in a try-catch block. In IE it is
 * not safe to call document.activeElement if there is nothing focused.
 *
 * The activeElement will be null only if the document body is not yet defined.
 */
function getActiveElement() /*?DOMElement*/ {
  try {
    return document.activeElement || document.body;
  } catch (e) {
    return document.body;
  }
}

module.exports = getActiveElement;

},{}],129:[function(require,module,exports){
/**
 * Copyright 2013-2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule getEventCharCode
 * @typechecks static-only
 */

'use strict';

/**
 * `charCode` represents the actual "character code" and is safe to use with
 * `String.fromCharCode`. As such, only keys that correspond to printable
 * characters produce a valid `charCode`, the only exception to this is Enter.
 * The Tab-key is considered non-printable and does not have a `charCode`,
 * presumably because it does not produce a tab-character in browsers.
 *
 * @param {object} nativeEvent Native browser event.
 * @return {string} Normalized `charCode` property.
 */
function getEventCharCode(nativeEvent) {
  var charCode;
  var keyCode = nativeEvent.keyCode;

  if ('charCode' in nativeEvent) {
    charCode = nativeEvent.charCode;

    // FF does not set `charCode` for the Enter-key, check against `keyCode`.
    if (charCode === 0 && keyCode === 13) {
      charCode = 13;
    }
  } else {
    // IE8 does not implement `charCode`, but `keyCode` has the correct value.
    charCode = keyCode;
  }

  // Some non-printable keys are reported in `charCode`/`keyCode`, discard them.
  // Must not discard the (non-)printable Enter-key.
  if (charCode >= 32 || charCode === 13) {
    return charCode;
  }

  return 0;
}

module.exports = getEventCharCode;

},{}],130:[function(require,module,exports){
/**
 * Copyright 2013-2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule getEventKey
 * @typechecks static-only
 */

'use strict';

var getEventCharCode = require("./getEventCharCode");

/**
 * Normalization of deprecated HTML5 `key` values
 * @see https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent#Key_names
 */
var normalizeKey = {
  'Esc': 'Escape',
  'Spacebar': ' ',
  'Left': 'ArrowLeft',
  'Up': 'ArrowUp',
  'Right': 'ArrowRight',
  'Down': 'ArrowDown',
  'Del': 'Delete',
  'Win': 'OS',
  'Menu': 'ContextMenu',
  'Apps': 'ContextMenu',
  'Scroll': 'ScrollLock',
  'MozPrintableKey': 'Unidentified'
};

/**
 * Translation from legacy `keyCode` to HTML5 `key`
 * Only special keys supported, all others depend on keyboard layout or browser
 * @see https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent#Key_names
 */
var translateToKey = {
  8: 'Backspace',
  9: 'Tab',
  12: 'Clear',
  13: 'Enter',
  16: 'Shift',
  17: 'Control',
  18: 'Alt',
  19: 'Pause',
  20: 'CapsLock',
  27: 'Escape',
  32: ' ',
  33: 'PageUp',
  34: 'PageDown',
  35: 'End',
  36: 'Home',
  37: 'ArrowLeft',
  38: 'ArrowUp',
  39: 'ArrowRight',
  40: 'ArrowDown',
  45: 'Insert',
  46: 'Delete',
  112: 'F1', 113: 'F2', 114: 'F3', 115: 'F4', 116: 'F5', 117: 'F6',
  118: 'F7', 119: 'F8', 120: 'F9', 121: 'F10', 122: 'F11', 123: 'F12',
  144: 'NumLock',
  145: 'ScrollLock',
  224: 'Meta'
};

/**
 * @param {object} nativeEvent Native browser event.
 * @return {string} Normalized `key` property.
 */
function getEventKey(nativeEvent) {
  if (nativeEvent.key) {
    // Normalize inconsistent values reported by browsers due to
    // implementations of a working draft specification.

    // FireFox implements `key` but returns `MozPrintableKey` for all
    // printable characters (normalized to `Unidentified`), ignore it.
    var key = normalizeKey[nativeEvent.key] || nativeEvent.key;
    if (key !== 'Unidentified') {
      return key;
    }
  }

  // Browser does not implement `key`, polyfill as much of it as we can.
  if (nativeEvent.type === 'keypress') {
    var charCode = getEventCharCode(nativeEvent);

    // The enter-key is technically both printable and non-printable and can
    // thus be captured by `keypress`, no other non-printable key should.
    return charCode === 13 ? 'Enter' : String.fromCharCode(charCode);
  }
  if (nativeEvent.type === 'keydown' || nativeEvent.type === 'keyup') {
    // While user keyboard layout determines the actual meaning of each
    // `keyCode` value, almost all function keys have a universal value.
    return translateToKey[nativeEvent.keyCode] || 'Unidentified';
  }
  return '';
}

module.exports = getEventKey;

},{"./getEventCharCode":129}],131:[function(require,module,exports){
/**
 * Copyright 2013-2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule getEventModifierState
 * @typechecks static-only
 */

'use strict';

/**
 * Translation from modifier key to the associated property in the event.
 * @see http://www.w3.org/TR/DOM-Level-3-Events/#keys-Modifiers
 */

var modifierKeyToProp = {
  'Alt': 'altKey',
  'Control': 'ctrlKey',
  'Meta': 'metaKey',
  'Shift': 'shiftKey'
};

// IE8 does not implement getModifierState so we simply map it to the only
// modifier keys exposed by the event itself, does not support Lock-keys.
// Currently, all major browsers except Chrome seems to support Lock-keys.
function modifierStateGetter(keyArg) {
  /*jshint validthis:true */
  var syntheticEvent = this;
  var nativeEvent = syntheticEvent.nativeEvent;
  if (nativeEvent.getModifierState) {
    return nativeEvent.getModifierState(keyArg);
  }
  var keyProp = modifierKeyToProp[keyArg];
  return keyProp ? !!nativeEvent[keyProp] : false;
}

function getEventModifierState(nativeEvent) {
  return modifierStateGetter;
}

module.exports = getEventModifierState;

},{}],132:[function(require,module,exports){
/**
 * Copyright 2013-2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule getEventTarget
 * @typechecks static-only
 */

'use strict';

/**
 * Gets the target node from a native browser event by accounting for
 * inconsistencies in browser DOM APIs.
 *
 * @param {object} nativeEvent Native browser event.
 * @return {DOMEventTarget} Target node.
 */
function getEventTarget(nativeEvent) {
  var target = nativeEvent.target || nativeEvent.srcElement || window;
  // Safari may fire events on text nodes (Node.TEXT_NODE is 3).
  // @see http://www.quirksmode.org/js/events_properties.html
  return target.nodeType === 3 ? target.parentNode : target;
}

module.exports = getEventTarget;

},{}],133:[function(require,module,exports){
/**
 * Copyright 2013-2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule getIteratorFn
 * @typechecks static-only
 */

'use strict';

/* global Symbol */
var ITERATOR_SYMBOL = typeof Symbol === 'function' && Symbol.iterator;
var FAUX_ITERATOR_SYMBOL = '@@iterator'; // Before Symbol spec.

/**
 * Returns the iterator method function contained on the iterable object.
 *
 * Be sure to invoke the function with the iterable as context:
 *
 *     var iteratorFn = getIteratorFn(myIterable);
 *     if (iteratorFn) {
 *       var iterator = iteratorFn.call(myIterable);
 *       ...
 *     }
 *
 * @param {?object} maybeIterable
 * @return {?function}
 */
function getIteratorFn(maybeIterable) {
  var iteratorFn = maybeIterable && (
    (ITERATOR_SYMBOL && maybeIterable[ITERATOR_SYMBOL] || maybeIterable[FAUX_ITERATOR_SYMBOL])
  );
  if (typeof iteratorFn === 'function') {
    return iteratorFn;
  }
}

module.exports = getIteratorFn;

},{}],134:[function(require,module,exports){
(function (process){
/**
 * Copyright 2013-2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule getMarkupWrap
 */

var ExecutionEnvironment = require("./ExecutionEnvironment");

var invariant = require("./invariant");

/**
 * Dummy container used to detect which wraps are necessary.
 */
var dummyNode =
  ExecutionEnvironment.canUseDOM ? document.createElement('div') : null;

/**
 * Some browsers cannot use `innerHTML` to render certain elements standalone,
 * so we wrap them, render the wrapped nodes, then extract the desired node.
 *
 * In IE8, certain elements cannot render alone, so wrap all elements ('*').
 */
var shouldWrap = {
  // Force wrapping for SVG elements because if they get created inside a <div>,
  // they will be initialized in the wrong namespace (and will not display).
  'circle': true,
  'clipPath': true,
  'defs': true,
  'ellipse': true,
  'g': true,
  'line': true,
  'linearGradient': true,
  'path': true,
  'polygon': true,
  'polyline': true,
  'radialGradient': true,
  'rect': true,
  'stop': true,
  'text': true
};

var selectWrap = [1, '<select multiple="true">', '</select>'];
var tableWrap = [1, '<table>', '</table>'];
var trWrap = [3, '<table><tbody><tr>', '</tr></tbody></table>'];

var svgWrap = [1, '<svg>', '</svg>'];

var markupWrap = {
  '*': [1, '?<div>', '</div>'],

  'area': [1, '<map>', '</map>'],
  'col': [2, '<table><tbody></tbody><colgroup>', '</colgroup></table>'],
  'legend': [1, '<fieldset>', '</fieldset>'],
  'param': [1, '<object>', '</object>'],
  'tr': [2, '<table><tbody>', '</tbody></table>'],

  'optgroup': selectWrap,
  'option': selectWrap,

  'caption': tableWrap,
  'colgroup': tableWrap,
  'tbody': tableWrap,
  'tfoot': tableWrap,
  'thead': tableWrap,

  'td': trWrap,
  'th': trWrap,

  'circle': svgWrap,
  'clipPath': svgWrap,
  'defs': svgWrap,
  'ellipse': svgWrap,
  'g': svgWrap,
  'line': svgWrap,
  'linearGradient': svgWrap,
  'path': svgWrap,
  'polygon': svgWrap,
  'polyline': svgWrap,
  'radialGradient': svgWrap,
  'rect': svgWrap,
  'stop': svgWrap,
  'text': svgWrap
};

/**
 * Gets the markup wrap configuration for the supplied `nodeName`.
 *
 * NOTE: This lazily detects which wraps are necessary for the current browser.
 *
 * @param {string} nodeName Lowercase `nodeName`.
 * @return {?array} Markup wrap configuration, if applicable.
 */
function getMarkupWrap(nodeName) {
  ("production" !== process.env.NODE_ENV ? invariant(!!dummyNode, 'Markup wrapping node not initialized') : invariant(!!dummyNode));
  if (!markupWrap.hasOwnProperty(nodeName)) {
    nodeName = '*';
  }
  if (!shouldWrap.hasOwnProperty(nodeName)) {
    if (nodeName === '*') {
      dummyNode.innerHTML = '<link />';
    } else {
      dummyNode.innerHTML = '<' + nodeName + '></' + nodeName + '>';
    }
    shouldWrap[nodeName] = !dummyNode.firstChild;
  }
  return shouldWrap[nodeName] ? markupWrap[nodeName] : null;
}


module.exports = getMarkupWrap;

}).call(this,require('_process'))
},{"./ExecutionEnvironment":27,"./invariant":142,"_process":6}],135:[function(require,module,exports){
/**
 * Copyright 2013-2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule getNodeForCharacterOffset
 */

'use strict';

/**
 * Given any node return the first leaf node without children.
 *
 * @param {DOMElement|DOMTextNode} node
 * @return {DOMElement|DOMTextNode}
 */
function getLeafNode(node) {
  while (node && node.firstChild) {
    node = node.firstChild;
  }
  return node;
}

/**
 * Get the next sibling within a container. This will walk up the
 * DOM if a node's siblings have been exhausted.
 *
 * @param {DOMElement|DOMTextNode} node
 * @return {?DOMElement|DOMTextNode}
 */
function getSiblingNode(node) {
  while (node) {
    if (node.nextSibling) {
      return node.nextSibling;
    }
    node = node.parentNode;
  }
}

/**
 * Get object describing the nodes which contain characters at offset.
 *
 * @param {DOMElement|DOMTextNode} root
 * @param {number} offset
 * @return {?object}
 */
function getNodeForCharacterOffset(root, offset) {
  var node = getLeafNode(root);
  var nodeStart = 0;
  var nodeEnd = 0;

  while (node) {
    if (node.nodeType === 3) {
      nodeEnd = nodeStart + node.textContent.length;

      if (nodeStart <= offset && nodeEnd >= offset) {
        return {
          node: node,
          offset: offset - nodeStart
        };
      }

      nodeStart = nodeEnd;
    }

    node = getLeafNode(getSiblingNode(node));
  }
}

module.exports = getNodeForCharacterOffset;

},{}],136:[function(require,module,exports){
/**
 * Copyright 2013-2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule getReactRootElementInContainer
 */

'use strict';

var DOC_NODE_TYPE = 9;

/**
 * @param {DOMElement|DOMDocument} container DOM element that may contain
 *                                           a React component
 * @return {?*} DOM element that may have the reactRoot ID, or null.
 */
function getReactRootElementInContainer(container) {
  if (!container) {
    return null;
  }

  if (container.nodeType === DOC_NODE_TYPE) {
    return container.documentElement;
  } else {
    return container.firstChild;
  }
}

module.exports = getReactRootElementInContainer;

},{}],137:[function(require,module,exports){
/**
 * Copyright 2013-2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule getTextContentAccessor
 */

'use strict';

var ExecutionEnvironment = require("./ExecutionEnvironment");

var contentKey = null;

/**
 * Gets the key used to access text content on a DOM node.
 *
 * @return {?string} Key used to access text content.
 * @internal
 */
function getTextContentAccessor() {
  if (!contentKey && ExecutionEnvironment.canUseDOM) {
    // Prefer textContent to innerText because many browsers support both but
    // SVG <text> elements don't support innerText even when <div> does.
    contentKey = 'textContent' in document.documentElement ?
      'textContent' :
      'innerText';
  }
  return contentKey;
}

module.exports = getTextContentAccessor;

},{"./ExecutionEnvironment":27}],138:[function(require,module,exports){
/**
 * Copyright 2013-2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule getUnboundedScrollPosition
 * @typechecks
 */

"use strict";

/**
 * Gets the scroll position of the supplied element or window.
 *
 * The return values are unbounded, unlike `getScrollPosition`. This means they
 * may be negative or exceed the element boundaries (which is possible using
 * inertial scrolling).
 *
 * @param {DOMWindow|DOMElement} scrollable
 * @return {object} Map with `x` and `y` keys.
 */
function getUnboundedScrollPosition(scrollable) {
  if (scrollable === window) {
    return {
      x: window.pageXOffset || document.documentElement.scrollLeft,
      y: window.pageYOffset || document.documentElement.scrollTop
    };
  }
  return {
    x: scrollable.scrollLeft,
    y: scrollable.scrollTop
  };
}

module.exports = getUnboundedScrollPosition;

},{}],139:[function(require,module,exports){
/**
 * Copyright 2013-2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule hyphenate
 * @typechecks
 */

var _uppercasePattern = /([A-Z])/g;

/**
 * Hyphenates a camelcased string, for example:
 *
 *   > hyphenate('backgroundColor')
 *   < "background-color"
 *
 * For CSS style names, use `hyphenateStyleName` instead which works properly
 * with all vendor prefixes, including `ms`.
 *
 * @param {string} string
 * @return {string}
 */
function hyphenate(string) {
  return string.replace(_uppercasePattern, '-$1').toLowerCase();
}

module.exports = hyphenate;

},{}],140:[function(require,module,exports){
/**
 * Copyright 2013-2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule hyphenateStyleName
 * @typechecks
 */

"use strict";

var hyphenate = require("./hyphenate");

var msPattern = /^ms-/;

/**
 * Hyphenates a camelcased CSS property name, for example:
 *
 *   > hyphenateStyleName('backgroundColor')
 *   < "background-color"
 *   > hyphenateStyleName('MozTransition')
 *   < "-moz-transition"
 *   > hyphenateStyleName('msTransition')
 *   < "-ms-transition"
 *
 * As Modernizr suggests (http://modernizr.com/docs/#prefixed), an `ms` prefix
 * is converted to `-ms-`.
 *
 * @param {string} string
 * @return {string}
 */
function hyphenateStyleName(string) {
  return hyphenate(string).replace(msPattern, '-ms-');
}

module.exports = hyphenateStyleName;

},{"./hyphenate":139}],141:[function(require,module,exports){
(function (process){
/**
 * Copyright 2013-2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule instantiateReactComponent
 * @typechecks static-only
 */

'use strict';

var ReactCompositeComponent = require("./ReactCompositeComponent");
var ReactEmptyComponent = require("./ReactEmptyComponent");
var ReactNativeComponent = require("./ReactNativeComponent");

var assign = require("./Object.assign");
var invariant = require("./invariant");
var warning = require("./warning");

// To avoid a cyclic dependency, we create the final class in this module
var ReactCompositeComponentWrapper = function() { };
assign(
  ReactCompositeComponentWrapper.prototype,
  ReactCompositeComponent.Mixin,
  {
    _instantiateReactComponent: instantiateReactComponent
  }
);

/**
 * Check if the type reference is a known internal type. I.e. not a user
 * provided composite type.
 *
 * @param {function} type
 * @return {boolean} Returns true if this is a valid internal type.
 */
function isInternalComponentType(type) {
  return (
    typeof type === 'function' &&
    typeof type.prototype !== 'undefined' &&
    typeof type.prototype.mountComponent === 'function' &&
    typeof type.prototype.receiveComponent === 'function'
  );
}

/**
 * Given a ReactNode, create an instance that will actually be mounted.
 *
 * @param {ReactNode} node
 * @param {*} parentCompositeType The composite type that resolved this.
 * @return {object} A new instance of the element's constructor.
 * @protected
 */
function instantiateReactComponent(node, parentCompositeType) {
  var instance;

  if (node === null || node === false) {
    node = ReactEmptyComponent.emptyElement;
  }

  if (typeof node === 'object') {
    var element = node;
    if ("production" !== process.env.NODE_ENV) {
      ("production" !== process.env.NODE_ENV ? warning(
        element && (typeof element.type === 'function' ||
                    typeof element.type === 'string'),
        'Only functions or strings can be mounted as React components.'
      ) : null);
    }

    // Special case string values
    if (parentCompositeType === element.type &&
        typeof element.type === 'string') {
      // Avoid recursion if the wrapper renders itself.
      instance = ReactNativeComponent.createInternalComponent(element);
      // All native components are currently wrapped in a composite so we're
      // safe to assume that this is what we should instantiate.
    } else if (isInternalComponentType(element.type)) {
      // This is temporarily available for custom components that are not string
      // represenations. I.e. ART. Once those are updated to use the string
      // representation, we can drop this code path.
      instance = new element.type(element);
    } else {
      instance = new ReactCompositeComponentWrapper();
    }
  } else if (typeof node === 'string' || typeof node === 'number') {
    instance = ReactNativeComponent.createInstanceForText(node);
  } else {
    ("production" !== process.env.NODE_ENV ? invariant(
      false,
      'Encountered invalid React node of type %s',
      typeof node
    ) : invariant(false));
  }

  if ("production" !== process.env.NODE_ENV) {
    ("production" !== process.env.NODE_ENV ? warning(
      typeof instance.construct === 'function' &&
      typeof instance.mountComponent === 'function' &&
      typeof instance.receiveComponent === 'function' &&
      typeof instance.unmountComponent === 'function',
      'Only React Components can be mounted.'
    ) : null);
  }

  // Sets up the instance. This can probably just move into the constructor now.
  instance.construct(node);

  // These two fields are used by the DOM and ART diffing algorithms
  // respectively. Instead of using expandos on components, we should be
  // storing the state needed by the diffing algorithms elsewhere.
  instance._mountIndex = 0;
  instance._mountImage = null;

  if ("production" !== process.env.NODE_ENV) {
    instance._isOwnerNecessary = false;
    instance._warnedAboutRefsInRender = false;
  }

  // Internal instances should fully constructed at this point, so they should
  // not get any new fields added to them at this point.
  if ("production" !== process.env.NODE_ENV) {
    if (Object.preventExtensions) {
      Object.preventExtensions(instance);
    }
  }

  return instance;
}

module.exports = instantiateReactComponent;

}).call(this,require('_process'))
},{"./Object.assign":33,"./ReactCompositeComponent":44,"./ReactEmptyComponent":66,"./ReactNativeComponent":80,"./invariant":142,"./warning":161,"_process":6}],142:[function(require,module,exports){
(function (process){
/**
 * Copyright 2013-2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule invariant
 */

"use strict";

/**
 * Use invariant() to assert state which your program assumes to be true.
 *
 * Provide sprintf-style format (only %s is supported) and arguments
 * to provide information about what broke and what you were
 * expecting.
 *
 * The invariant message will be stripped in production, but the invariant
 * will remain to ensure logic does not differ in production.
 */

var invariant = function(condition, format, a, b, c, d, e, f) {
  if ("production" !== process.env.NODE_ENV) {
    if (format === undefined) {
      throw new Error('invariant requires an error message argument');
    }
  }

  if (!condition) {
    var error;
    if (format === undefined) {
      error = new Error(
        'Minified exception occurred; use the non-minified dev environment ' +
        'for the full error message and additional helpful warnings.'
      );
    } else {
      var args = [a, b, c, d, e, f];
      var argIndex = 0;
      error = new Error(
        'Invariant Violation: ' +
        format.replace(/%s/g, function() { return args[argIndex++]; })
      );
    }

    error.framesToPop = 1; // we don't care about invariant's own frame
    throw error;
  }
};

module.exports = invariant;

}).call(this,require('_process'))
},{"_process":6}],143:[function(require,module,exports){
/**
 * Copyright 2013-2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule isEventSupported
 */

'use strict';

var ExecutionEnvironment = require("./ExecutionEnvironment");

var useHasFeature;
if (ExecutionEnvironment.canUseDOM) {
  useHasFeature =
    document.implementation &&
    document.implementation.hasFeature &&
    // always returns true in newer browsers as per the standard.
    // @see http://dom.spec.whatwg.org/#dom-domimplementation-hasfeature
    document.implementation.hasFeature('', '') !== true;
}

/**
 * Checks if an event is supported in the current execution environment.
 *
 * NOTE: This will not work correctly for non-generic events such as `change`,
 * `reset`, `load`, `error`, and `select`.
 *
 * Borrows from Modernizr.
 *
 * @param {string} eventNameSuffix Event name, e.g. "click".
 * @param {?boolean} capture Check if the capture phase is supported.
 * @return {boolean} True if the event is supported.
 * @internal
 * @license Modernizr 3.0.0pre (Custom Build) | MIT
 */
function isEventSupported(eventNameSuffix, capture) {
  if (!ExecutionEnvironment.canUseDOM ||
      capture && !('addEventListener' in document)) {
    return false;
  }

  var eventName = 'on' + eventNameSuffix;
  var isSupported = eventName in document;

  if (!isSupported) {
    var element = document.createElement('div');
    element.setAttribute(eventName, 'return;');
    isSupported = typeof element[eventName] === 'function';
  }

  if (!isSupported && useHasFeature && eventNameSuffix === 'wheel') {
    // This is the only way to test support for the `wheel` event in IE9+.
    isSupported = document.implementation.hasFeature('Events.wheel', '3.0');
  }

  return isSupported;
}

module.exports = isEventSupported;

},{"./ExecutionEnvironment":27}],144:[function(require,module,exports){
/**
 * Copyright 2013-2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule isNode
 * @typechecks
 */

/**
 * @param {*} object The object to check.
 * @return {boolean} Whether or not the object is a DOM node.
 */
function isNode(object) {
  return !!(object && (
    ((typeof Node === 'function' ? object instanceof Node : typeof object === 'object' &&
    typeof object.nodeType === 'number' &&
    typeof object.nodeName === 'string'))
  ));
}

module.exports = isNode;

},{}],145:[function(require,module,exports){
/**
 * Copyright 2013-2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule isTextInputElement
 */

'use strict';

/**
 * @see http://www.whatwg.org/specs/web-apps/current-work/multipage/the-input-element.html#input-type-attr-summary
 */
var supportedInputTypes = {
  'color': true,
  'date': true,
  'datetime': true,
  'datetime-local': true,
  'email': true,
  'month': true,
  'number': true,
  'password': true,
  'range': true,
  'search': true,
  'tel': true,
  'text': true,
  'time': true,
  'url': true,
  'week': true
};

function isTextInputElement(elem) {
  return elem && (
    (elem.nodeName === 'INPUT' && supportedInputTypes[elem.type] || elem.nodeName === 'TEXTAREA')
  );
}

module.exports = isTextInputElement;

},{}],146:[function(require,module,exports){
/**
 * Copyright 2013-2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule isTextNode
 * @typechecks
 */

var isNode = require("./isNode");

/**
 * @param {*} object The object to check.
 * @return {boolean} Whether or not the object is a DOM text node.
 */
function isTextNode(object) {
  return isNode(object) && object.nodeType == 3;
}

module.exports = isTextNode;

},{"./isNode":144}],147:[function(require,module,exports){
(function (process){
/**
 * Copyright 2013-2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule keyMirror
 * @typechecks static-only
 */

'use strict';

var invariant = require("./invariant");

/**
 * Constructs an enumeration with keys equal to their value.
 *
 * For example:
 *
 *   var COLORS = keyMirror({blue: null, red: null});
 *   var myColor = COLORS.blue;
 *   var isColorValid = !!COLORS[myColor];
 *
 * The last line could not be performed if the values of the generated enum were
 * not equal to their keys.
 *
 *   Input:  {key1: val1, key2: val2}
 *   Output: {key1: key1, key2: key2}
 *
 * @param {object} obj
 * @return {object}
 */
var keyMirror = function(obj) {
  var ret = {};
  var key;
  ("production" !== process.env.NODE_ENV ? invariant(
    obj instanceof Object && !Array.isArray(obj),
    'keyMirror(...): Argument must be an object.'
  ) : invariant(obj instanceof Object && !Array.isArray(obj)));
  for (key in obj) {
    if (!obj.hasOwnProperty(key)) {
      continue;
    }
    ret[key] = key;
  }
  return ret;
};

module.exports = keyMirror;

}).call(this,require('_process'))
},{"./invariant":142,"_process":6}],148:[function(require,module,exports){
/**
 * Copyright 2013-2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule keyOf
 */

/**
 * Allows extraction of a minified key. Let's the build system minify keys
 * without loosing the ability to dynamically use key strings as values
 * themselves. Pass in an object with a single key/val pair and it will return
 * you the string key of that single record. Suppose you want to grab the
 * value for a key 'className' inside of an object. Key/val minification may
 * have aliased that key to be 'xa12'. keyOf({className: null}) will return
 * 'xa12' in that case. Resolve keys you want to use once at startup time, then
 * reuse those resolutions.
 */
var keyOf = function(oneKeyObj) {
  var key;
  for (key in oneKeyObj) {
    if (!oneKeyObj.hasOwnProperty(key)) {
      continue;
    }
    return key;
  }
  return null;
};


module.exports = keyOf;

},{}],149:[function(require,module,exports){
/**
 * Copyright 2013-2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule mapObject
 */

'use strict';

var hasOwnProperty = Object.prototype.hasOwnProperty;

/**
 * Executes the provided `callback` once for each enumerable own property in the
 * object and constructs a new object from the results. The `callback` is
 * invoked with three arguments:
 *
 *  - the property value
 *  - the property name
 *  - the object being traversed
 *
 * Properties that are added after the call to `mapObject` will not be visited
 * by `callback`. If the values of existing properties are changed, the value
 * passed to `callback` will be the value at the time `mapObject` visits them.
 * Properties that are deleted before being visited are not visited.
 *
 * @grep function objectMap()
 * @grep function objMap()
 *
 * @param {?object} object
 * @param {function} callback
 * @param {*} context
 * @return {?object}
 */
function mapObject(object, callback, context) {
  if (!object) {
    return null;
  }
  var result = {};
  for (var name in object) {
    if (hasOwnProperty.call(object, name)) {
      result[name] = callback.call(context, object[name], name, object);
    }
  }
  return result;
}

module.exports = mapObject;

},{}],150:[function(require,module,exports){
/**
 * Copyright 2013-2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule memoizeStringOnly
 * @typechecks static-only
 */

'use strict';

/**
 * Memoizes the return value of a function that accepts one string argument.
 *
 * @param {function} callback
 * @return {function}
 */
function memoizeStringOnly(callback) {
  var cache = {};
  return function(string) {
    if (!cache.hasOwnProperty(string)) {
      cache[string] = callback.call(this, string);
    }
    return cache[string];
  };
}

module.exports = memoizeStringOnly;

},{}],151:[function(require,module,exports){
(function (process){
/**
 * Copyright 2013-2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule onlyChild
 */
'use strict';

var ReactElement = require("./ReactElement");

var invariant = require("./invariant");

/**
 * Returns the first child in a collection of children and verifies that there
 * is only one child in the collection. The current implementation of this
 * function assumes that a single child gets passed without a wrapper, but the
 * purpose of this helper function is to abstract away the particular structure
 * of children.
 *
 * @param {?object} children Child collection structure.
 * @return {ReactComponent} The first and only `ReactComponent` contained in the
 * structure.
 */
function onlyChild(children) {
  ("production" !== process.env.NODE_ENV ? invariant(
    ReactElement.isValidElement(children),
    'onlyChild must be passed a children with exactly one child.'
  ) : invariant(ReactElement.isValidElement(children)));
  return children;
}

module.exports = onlyChild;

}).call(this,require('_process'))
},{"./ReactElement":64,"./invariant":142,"_process":6}],152:[function(require,module,exports){
/**
 * Copyright 2013-2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule performance
 * @typechecks
 */

"use strict";

var ExecutionEnvironment = require("./ExecutionEnvironment");

var performance;

if (ExecutionEnvironment.canUseDOM) {
  performance =
    window.performance ||
    window.msPerformance ||
    window.webkitPerformance;
}

module.exports = performance || {};

},{"./ExecutionEnvironment":27}],153:[function(require,module,exports){
/**
 * Copyright 2013-2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule performanceNow
 * @typechecks
 */

var performance = require("./performance");

/**
 * Detect if we can use `window.performance.now()` and gracefully fallback to
 * `Date.now()` if it doesn't exist. We need to support Firefox < 15 for now
 * because of Facebook's testing infrastructure.
 */
if (!performance || !performance.now) {
  performance = Date;
}

var performanceNow = performance.now.bind(performance);

module.exports = performanceNow;

},{"./performance":152}],154:[function(require,module,exports){
/**
 * Copyright 2013-2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule quoteAttributeValueForBrowser
 */

'use strict';

var escapeTextContentForBrowser = require("./escapeTextContentForBrowser");

/**
 * Escapes attribute value to prevent scripting attacks.
 *
 * @param {*} value Value to escape.
 * @return {string} An escaped string.
 */
function quoteAttributeValueForBrowser(value) {
  return '"' + escapeTextContentForBrowser(value) + '"';
}

module.exports = quoteAttributeValueForBrowser;

},{"./escapeTextContentForBrowser":123}],155:[function(require,module,exports){
/**
 * Copyright 2013-2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule setInnerHTML
 */

/* globals MSApp */

'use strict';

var ExecutionEnvironment = require("./ExecutionEnvironment");

var WHITESPACE_TEST = /^[ \r\n\t\f]/;
var NONVISIBLE_TEST = /<(!--|link|noscript|meta|script|style)[ \r\n\t\f\/>]/;

/**
 * Set the innerHTML property of a node, ensuring that whitespace is preserved
 * even in IE8.
 *
 * @param {DOMElement} node
 * @param {string} html
 * @internal
 */
var setInnerHTML = function(node, html) {
  node.innerHTML = html;
};

// Win8 apps: Allow all html to be inserted
if (typeof MSApp !== 'undefined' && MSApp.execUnsafeLocalFunction) {
  setInnerHTML = function(node, html) {
    MSApp.execUnsafeLocalFunction(function() {
      node.innerHTML = html;
    });
  };
}

if (ExecutionEnvironment.canUseDOM) {
  // IE8: When updating a just created node with innerHTML only leading
  // whitespace is removed. When updating an existing node with innerHTML
  // whitespace in root TextNodes is also collapsed.
  // @see quirksmode.org/bugreports/archives/2004/11/innerhtml_and_t.html

  // Feature detection; only IE8 is known to behave improperly like this.
  var testElement = document.createElement('div');
  testElement.innerHTML = ' ';
  if (testElement.innerHTML === '') {
    setInnerHTML = function(node, html) {
      // Magic theory: IE8 supposedly differentiates between added and updated
      // nodes when processing innerHTML, innerHTML on updated nodes suffers
      // from worse whitespace behavior. Re-adding a node like this triggers
      // the initial and more favorable whitespace behavior.
      // TODO: What to do on a detached node?
      if (node.parentNode) {
        node.parentNode.replaceChild(node, node);
      }

      // We also implement a workaround for non-visible tags disappearing into
      // thin air on IE8, this only happens if there is no visible text
      // in-front of the non-visible tags. Piggyback on the whitespace fix
      // and simply check if any non-visible tags appear in the source.
      if (WHITESPACE_TEST.test(html) ||
          html[0] === '<' && NONVISIBLE_TEST.test(html)) {
        // Recover leading whitespace by temporarily prepending any character.
        // \uFEFF has the potential advantage of being zero-width/invisible.
        node.innerHTML = '\uFEFF' + html;

        // deleteData leaves an empty `TextNode` which offsets the index of all
        // children. Definitely want to avoid this.
        var textNode = node.firstChild;
        if (textNode.data.length === 1) {
          node.removeChild(textNode);
        } else {
          textNode.deleteData(0, 1);
        }
      } else {
        node.innerHTML = html;
      }
    };
  }
}

module.exports = setInnerHTML;

},{"./ExecutionEnvironment":27}],156:[function(require,module,exports){
/**
 * Copyright 2013-2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule setTextContent
 */

'use strict';

var ExecutionEnvironment = require("./ExecutionEnvironment");
var escapeTextContentForBrowser = require("./escapeTextContentForBrowser");
var setInnerHTML = require("./setInnerHTML");

/**
 * Set the textContent property of a node, ensuring that whitespace is preserved
 * even in IE8. innerText is a poor substitute for textContent and, among many
 * issues, inserts <br> instead of the literal newline chars. innerHTML behaves
 * as it should.
 *
 * @param {DOMElement} node
 * @param {string} text
 * @internal
 */
var setTextContent = function(node, text) {
  node.textContent = text;
};

if (ExecutionEnvironment.canUseDOM) {
  if (!('textContent' in document.documentElement)) {
    setTextContent = function(node, text) {
      setInnerHTML(node, escapeTextContentForBrowser(text));
    };
  }
}

module.exports = setTextContent;

},{"./ExecutionEnvironment":27,"./escapeTextContentForBrowser":123,"./setInnerHTML":155}],157:[function(require,module,exports){
/**
 * Copyright 2013-2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule shallowEqual
 */

'use strict';

/**
 * Performs equality by iterating through keys on an object and returning
 * false when any key has values which are not strictly equal between
 * objA and objB. Returns true when the values of all keys are strictly equal.
 *
 * @return {boolean}
 */
function shallowEqual(objA, objB) {
  if (objA === objB) {
    return true;
  }
  var key;
  // Test for A's keys different from B.
  for (key in objA) {
    if (objA.hasOwnProperty(key) &&
        (!objB.hasOwnProperty(key) || objA[key] !== objB[key])) {
      return false;
    }
  }
  // Test for B's keys missing from A.
  for (key in objB) {
    if (objB.hasOwnProperty(key) && !objA.hasOwnProperty(key)) {
      return false;
    }
  }
  return true;
}

module.exports = shallowEqual;

},{}],158:[function(require,module,exports){
(function (process){
/**
 * Copyright 2013-2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule shouldUpdateReactComponent
 * @typechecks static-only
 */

'use strict';

var warning = require("./warning");

/**
 * Given a `prevElement` and `nextElement`, determines if the existing
 * instance should be updated as opposed to being destroyed or replaced by a new
 * instance. Both arguments are elements. This ensures that this logic can
 * operate on stateless trees without any backing instance.
 *
 * @param {?object} prevElement
 * @param {?object} nextElement
 * @return {boolean} True if the existing instance should be updated.
 * @protected
 */
function shouldUpdateReactComponent(prevElement, nextElement) {
  if (prevElement != null && nextElement != null) {
    var prevType = typeof prevElement;
    var nextType = typeof nextElement;
    if (prevType === 'string' || prevType === 'number') {
      return (nextType === 'string' || nextType === 'number');
    } else {
      if (nextType === 'object' &&
          prevElement.type === nextElement.type &&
          prevElement.key === nextElement.key) {
        var ownersMatch = prevElement._owner === nextElement._owner;
        var prevName = null;
        var nextName = null;
        var nextDisplayName = null;
        if ("production" !== process.env.NODE_ENV) {
          if (!ownersMatch) {
            if (prevElement._owner != null &&
                prevElement._owner.getPublicInstance() != null &&
                prevElement._owner.getPublicInstance().constructor != null) {
              prevName =
                prevElement._owner.getPublicInstance().constructor.displayName;
            }
            if (nextElement._owner != null &&
                nextElement._owner.getPublicInstance() != null &&
                nextElement._owner.getPublicInstance().constructor != null) {
              nextName =
                nextElement._owner.getPublicInstance().constructor.displayName;
            }
            if (nextElement.type != null &&
                nextElement.type.displayName != null) {
              nextDisplayName = nextElement.type.displayName;
            }
            if (nextElement.type != null && typeof nextElement.type === 'string') {
              nextDisplayName = nextElement.type;
            }
            if (typeof nextElement.type !== 'string' ||
                nextElement.type === 'input' ||
                nextElement.type === 'textarea') {
              if ((prevElement._owner != null &&
                  prevElement._owner._isOwnerNecessary === false) ||
                  (nextElement._owner != null &&
                  nextElement._owner._isOwnerNecessary === false)) {
                if (prevElement._owner != null) {
                  prevElement._owner._isOwnerNecessary = true;
                }
                if (nextElement._owner != null) {
                  nextElement._owner._isOwnerNecessary = true;
                }
                ("production" !== process.env.NODE_ENV ? warning(
                  false,
                  '<%s /> is being rendered by both %s and %s using the same ' +
                  'key (%s) in the same place. Currently, this means that ' +
                  'they don\'t preserve state. This behavior should be very ' +
                  'rare so we\'re considering deprecating it. Please contact ' +
                  'the React team and explain your use case so that we can ' +
                  'take that into consideration.',
                  nextDisplayName || 'Unknown Component',
                  prevName || '[Unknown]',
                  nextName || '[Unknown]',
                  prevElement.key
                ) : null);
              }
            }
          }
        }
        return ownersMatch;
      }
    }
  }
  return false;
}

module.exports = shouldUpdateReactComponent;

}).call(this,require('_process'))
},{"./warning":161,"_process":6}],159:[function(require,module,exports){
(function (process){
/**
 * Copyright 2014-2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule toArray
 * @typechecks
 */

var invariant = require("./invariant");

/**
 * Convert array-like objects to arrays.
 *
 * This API assumes the caller knows the contents of the data type. For less
 * well defined inputs use createArrayFromMixed.
 *
 * @param {object|function|filelist} obj
 * @return {array}
 */
function toArray(obj) {
  var length = obj.length;

  // Some browse builtin objects can report typeof 'function' (e.g. NodeList in
  // old versions of Safari).
  ("production" !== process.env.NODE_ENV ? invariant(
    !Array.isArray(obj) &&
    (typeof obj === 'object' || typeof obj === 'function'),
    'toArray: Array-like object expected'
  ) : invariant(!Array.isArray(obj) &&
  (typeof obj === 'object' || typeof obj === 'function')));

  ("production" !== process.env.NODE_ENV ? invariant(
    typeof length === 'number',
    'toArray: Object needs a length property'
  ) : invariant(typeof length === 'number'));

  ("production" !== process.env.NODE_ENV ? invariant(
    length === 0 ||
    (length - 1) in obj,
    'toArray: Object should have keys for indices'
  ) : invariant(length === 0 ||
  (length - 1) in obj));

  // Old IE doesn't give collections access to hasOwnProperty. Assume inputs
  // without method will throw during the slice call and skip straight to the
  // fallback.
  if (obj.hasOwnProperty) {
    try {
      return Array.prototype.slice.call(obj);
    } catch (e) {
      // IE < 9 does not support Array#slice on collections objects
    }
  }

  // Fall back to copying key by key. This assumes all keys have a value,
  // so will not preserve sparsely populated inputs.
  var ret = Array(length);
  for (var ii = 0; ii < length; ii++) {
    ret[ii] = obj[ii];
  }
  return ret;
}

module.exports = toArray;

}).call(this,require('_process'))
},{"./invariant":142,"_process":6}],160:[function(require,module,exports){
(function (process){
/**
 * Copyright 2013-2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule traverseAllChildren
 */

'use strict';

var ReactElement = require("./ReactElement");
var ReactFragment = require("./ReactFragment");
var ReactInstanceHandles = require("./ReactInstanceHandles");

var getIteratorFn = require("./getIteratorFn");
var invariant = require("./invariant");
var warning = require("./warning");

var SEPARATOR = ReactInstanceHandles.SEPARATOR;
var SUBSEPARATOR = ':';

/**
 * TODO: Test that a single child and an array with one item have the same key
 * pattern.
 */

var userProvidedKeyEscaperLookup = {
  '=': '=0',
  '.': '=1',
  ':': '=2'
};

var userProvidedKeyEscapeRegex = /[=.:]/g;

var didWarnAboutMaps = false;

function userProvidedKeyEscaper(match) {
  return userProvidedKeyEscaperLookup[match];
}

/**
 * Generate a key string that identifies a component within a set.
 *
 * @param {*} component A component that could contain a manual key.
 * @param {number} index Index that is used if a manual key is not provided.
 * @return {string}
 */
function getComponentKey(component, index) {
  if (component && component.key != null) {
    // Explicit key
    return wrapUserProvidedKey(component.key);
  }
  // Implicit key determined by the index in the set
  return index.toString(36);
}

/**
 * Escape a component key so that it is safe to use in a reactid.
 *
 * @param {*} key Component key to be escaped.
 * @return {string} An escaped string.
 */
function escapeUserProvidedKey(text) {
  return ('' + text).replace(
    userProvidedKeyEscapeRegex,
    userProvidedKeyEscaper
  );
}

/**
 * Wrap a `key` value explicitly provided by the user to distinguish it from
 * implicitly-generated keys generated by a component's index in its parent.
 *
 * @param {string} key Value of a user-provided `key` attribute
 * @return {string}
 */
function wrapUserProvidedKey(key) {
  return '$' + escapeUserProvidedKey(key);
}

/**
 * @param {?*} children Children tree container.
 * @param {!string} nameSoFar Name of the key path so far.
 * @param {!number} indexSoFar Number of children encountered until this point.
 * @param {!function} callback Callback to invoke with each child found.
 * @param {?*} traverseContext Used to pass information throughout the traversal
 * process.
 * @return {!number} The number of children in this subtree.
 */
function traverseAllChildrenImpl(
  children,
  nameSoFar,
  indexSoFar,
  callback,
  traverseContext
) {
  var type = typeof children;

  if (type === 'undefined' || type === 'boolean') {
    // All of the above are perceived as null.
    children = null;
  }

  if (children === null ||
      type === 'string' ||
      type === 'number' ||
      ReactElement.isValidElement(children)) {
    callback(
      traverseContext,
      children,
      // If it's the only child, treat the name as if it was wrapped in an array
      // so that it's consistent if the number of children grows.
      nameSoFar === '' ? SEPARATOR + getComponentKey(children, 0) : nameSoFar,
      indexSoFar
    );
    return 1;
  }

  var child, nextName, nextIndex;
  var subtreeCount = 0; // Count of children found in the current subtree.

  if (Array.isArray(children)) {
    for (var i = 0; i < children.length; i++) {
      child = children[i];
      nextName = (
        (nameSoFar !== '' ? nameSoFar + SUBSEPARATOR : SEPARATOR) +
        getComponentKey(child, i)
      );
      nextIndex = indexSoFar + subtreeCount;
      subtreeCount += traverseAllChildrenImpl(
        child,
        nextName,
        nextIndex,
        callback,
        traverseContext
      );
    }
  } else {
    var iteratorFn = getIteratorFn(children);
    if (iteratorFn) {
      var iterator = iteratorFn.call(children);
      var step;
      if (iteratorFn !== children.entries) {
        var ii = 0;
        while (!(step = iterator.next()).done) {
          child = step.value;
          nextName = (
            (nameSoFar !== '' ? nameSoFar + SUBSEPARATOR : SEPARATOR) +
            getComponentKey(child, ii++)
          );
          nextIndex = indexSoFar + subtreeCount;
          subtreeCount += traverseAllChildrenImpl(
            child,
            nextName,
            nextIndex,
            callback,
            traverseContext
          );
        }
      } else {
        if ("production" !== process.env.NODE_ENV) {
          ("production" !== process.env.NODE_ENV ? warning(
            didWarnAboutMaps,
            'Using Maps as children is not yet fully supported. It is an ' +
            'experimental feature that might be removed. Convert it to a ' +
            'sequence / iterable of keyed ReactElements instead.'
          ) : null);
          didWarnAboutMaps = true;
        }
        // Iterator will provide entry [k,v] tuples rather than values.
        while (!(step = iterator.next()).done) {
          var entry = step.value;
          if (entry) {
            child = entry[1];
            nextName = (
              (nameSoFar !== '' ? nameSoFar + SUBSEPARATOR : SEPARATOR) +
              wrapUserProvidedKey(entry[0]) + SUBSEPARATOR +
              getComponentKey(child, 0)
            );
            nextIndex = indexSoFar + subtreeCount;
            subtreeCount += traverseAllChildrenImpl(
              child,
              nextName,
              nextIndex,
              callback,
              traverseContext
            );
          }
        }
      }
    } else if (type === 'object') {
      ("production" !== process.env.NODE_ENV ? invariant(
        children.nodeType !== 1,
        'traverseAllChildren(...): Encountered an invalid child; DOM ' +
        'elements are not valid children of React components.'
      ) : invariant(children.nodeType !== 1));
      var fragment = ReactFragment.extract(children);
      for (var key in fragment) {
        if (fragment.hasOwnProperty(key)) {
          child = fragment[key];
          nextName = (
            (nameSoFar !== '' ? nameSoFar + SUBSEPARATOR : SEPARATOR) +
            wrapUserProvidedKey(key) + SUBSEPARATOR +
            getComponentKey(child, 0)
          );
          nextIndex = indexSoFar + subtreeCount;
          subtreeCount += traverseAllChildrenImpl(
            child,
            nextName,
            nextIndex,
            callback,
            traverseContext
          );
        }
      }
    }
  }

  return subtreeCount;
}

/**
 * Traverses children that are typically specified as `props.children`, but
 * might also be specified through attributes:
 *
 * - `traverseAllChildren(this.props.children, ...)`
 * - `traverseAllChildren(this.props.leftPanelChildren, ...)`
 *
 * The `traverseContext` is an optional argument that is passed through the
 * entire traversal. It can be used to store accumulations or anything else that
 * the callback might find relevant.
 *
 * @param {?*} children Children tree object.
 * @param {!function} callback To invoke upon traversing each child.
 * @param {?*} traverseContext Context for traversal.
 * @return {!number} The number of children in this subtree.
 */
function traverseAllChildren(children, callback, traverseContext) {
  if (children == null) {
    return 0;
  }

  return traverseAllChildrenImpl(children, '', 0, callback, traverseContext);
}

module.exports = traverseAllChildren;

}).call(this,require('_process'))
},{"./ReactElement":64,"./ReactFragment":70,"./ReactInstanceHandles":73,"./getIteratorFn":133,"./invariant":142,"./warning":161,"_process":6}],161:[function(require,module,exports){
(function (process){
/**
 * Copyright 2014-2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule warning
 */

"use strict";

var emptyFunction = require("./emptyFunction");

/**
 * Similar to invariant but only logs a warning if the condition is not met.
 * This can be used to log issues in development environments in critical
 * paths. Removing the logging code for production environments will keep the
 * same logic and follow the same code paths.
 */

var warning = emptyFunction;

if ("production" !== process.env.NODE_ENV) {
  warning = function(condition, format ) {for (var args=[],$__0=2,$__1=arguments.length;$__0<$__1;$__0++) args.push(arguments[$__0]);
    if (format === undefined) {
      throw new Error(
        '`warning(condition, format, ...args)` requires a warning ' +
        'message argument'
      );
    }

    if (format.length < 10 || /^[s\W]*$/.test(format)) {
      throw new Error(
        'The warning format should be able to uniquely identify this ' +
        'warning. Please, use a more descriptive format than: ' + format
      );
    }

    if (format.indexOf('Failed Composite propType: ') === 0) {
      return; // Ignore CompositeComponent proptype check.
    }

    if (!condition) {
      var argIndex = 0;
      var message = 'Warning: ' + format.replace(/%s/g, function()  {return args[argIndex++];});
      console.warn(message);
      try {
        // --- Welcome to debugging React ---
        // This error was thrown as a convenience so that you can use this stack
        // to find the callsite that caused this warning to fire.
        throw new Error(message);
      } catch(x) {}
    }
  };
}

module.exports = warning;

}).call(this,require('_process'))
},{"./emptyFunction":121,"_process":6}],162:[function(require,module,exports){
module.exports = require('./lib/React');

},{"./lib/React":35}]},{},[1]);
