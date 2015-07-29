var Player = React.createClass({
    audio_tag: null,
    getInitialState: function () {
        console.info('[Player] getInitialState...');
        return {
            'queue': [],
            'selections': [],
            'current': ""
        };
    },
    componentDidMount: function () {
        console.info('[Player] componentDidMount...');
        this.audio_tag = React.findDOMNode(this.refs.audio_tag);
        this.audio_tag.addEventListener('ended', this.onEnded);
        this.loadQueue();
    },
    loadQueue: function () {
        console.info('[Player] loadQueue...');
        return $.get('/load/queue')
            .success(function (data, status, headers, config) {
                console.info('[Player] loadQueue: ', data.length, data[0]);
                this.setState({'queue': data});
                this.playNext();
                this.getSelections();
            }.bind(this))
            .error(function (data, status, headers, config) {
                alert('Error retrieving files');
                console.error('[Player] loadQueue: error', data);
            }.bind(this));
    },
    getSelections: function () {
        console.info('[Player] getSelection...');
        if (this.state.selections.length > 0) {
            console.info('[Player] getSelection: Already have selections');
            return;
        }
        if (this.state.queue.length > 5) {
            console.info('[Player] getSelection: Already have enough songs in queue');
            return;
        }
        $.get('/selection')
            .success(function (data, status, headers, config) {
                console.info('[Player] getSelection: success', data.length, data[0]);
                this.setState({"selections": data});
            }.bind(this))
            .error(function (data, status, headers, config) {
                alert('Error retrieving selection files');
                console.error('[Player] getSelection: error', data);
            }.bind(this));
    },
    setSelection: function (song) {
        console.info('[Player] setSelection...');

        // remove from selection
        var selections = this.state.selections;
        selections.shift();
        this.setState({"selections": selections});
        console.info('[Player] setSelection: removed from selections', this.state.selections.length);

        // update backend
        $.post('/add/queue', {'id': song.id})
            .success(function (data, status, headers, config) {
                this.loadQueue();
            }.bind(this))
            .error(function (data, status, headers, config) {
                alert('Error updating selection');
                console.error('[Player] setSelection: error', data);
            }.bind(this));
    },
    playNext: function () {
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
        this.setState({"current": queue_first.src});
        this.audio_tag.play();
    },
    onEnded: function () {
        console.info('[Player] onEnded...');
        this.setState({"current": ""});

        // update backend
        $.post('/ended', {'id': this.state.queue[0].id})
            .success(function (data, status, headers, config) {
                this.loadQueue();
            }.bind(this))
            .error(function (data, status, headers, config) {
                alert('Error updating selection');
                console.error('[Player] setSelection: error', data);
            }.bind(this));
    },
    render: function () {
        console.info('[Player] render...');
        var selection;
        if (this.state.selections.length) {
            selection = (
                <div>
                    <h5>Selections ({this.state.selections.length})</h5>
                    <ul>
                        {this.state.selections[0].map(function (selection) {
                            return <li key={selection.id}>
                                <a href="#" onClick={this.setSelection.bind(this, selection)}>{selection.path_name}</a>
                            </li>;
                        }.bind(this))}
                    </ul>
                </div>
            );
        }
        return (
            <div className="row">
                <h3>Player</h3>
                <div>
                    <audio ref="audio_tag" src={this.state.current} controls/>
                </div>
                <div>
                    <h5>Playlist ({this.state.queue.length})</h5>
                    <ol>
                        {this.state.queue.map(function (queue) {
                            return <li key={queue.id}>{queue.song.path_name}</li>;
                        })}
                    </ol>
                </div>
                <div>
                    {selection}
                </div>
            </div>
        );
    }
});


React.render(
    <Player />,
    document.getElementById('play-side')
);


//
//
//app.controller('playerCtrl', function (playlistFcty) {
//    this.playlist = playlistFcty;
//    this.selectSong = function (song) {
//        console.info('selected song', song);
//        playlistFcty.setSelection(song);
//    };
