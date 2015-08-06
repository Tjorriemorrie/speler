var Player = React.createClass({
    audio_tag: null,
    getInitialState: function () {
        console.info('[Player] getInitialState...');
        return {
            'queue': [],
            'histories': [],
            'selections': [],
            'current': ""
        };
    },
    componentDidMount: function () {
        console.info('[Player] componentDidMount...');
        this.audio_tag = React.findDOMNode(this.refs.audio_tag);
        this.audio_tag.addEventListener('ended', this.onEnded);
        console.info('[Player] audio_tag event listener added for ended');
        this.audio_tag.volume = 0.50;
        console.info('[Player] audio_tag volume set to 50%');
        this.loadQueue();
    },
    notifyPing: function () {
        console.info('Notifying ping...');
        if (this.state.selections.length < 5) {
            console.info('Already started selection...');
            return false;
        }
        var audio_ping = new Audio('/static/sounds/ping.mp3');
        audio_ping.play();
    },
    loadQueue: function () {
        console.info('[Player] loadQueue...');
        return $.get('/load/queue')
            .success(function (data, status, headers, config) {
                console.info('[Player] loadQueue: ', data.length, data[0]);
                this.setState({'queue': data});
                this.playNext();
                this.getSelections();
                this.loadHistories();
            }.bind(this))
            .error(function (data, status, headers, config) {
                alert('Error retrieving files');
                console.error('[Player] loadQueue: error', data);
            }.bind(this));
    },
    loadHistories: function () {
        console.info('[Player] loadHistories...');
        return $.get('/load/histories')
            .success(function (data, status, headers, config) {
                console.info('[Player] loadHistories: ', data.length, data[0]);
                this.setState({'histories': data});
            }.bind(this))
            .error(function (data, status, headers, config) {
                alert('Error retrieving files');
                console.error('[Player] loadHistories: error', data);
            }.bind(this));
    },
    getSelections: function () {
        console.info('[Player] getSelection...');
        if (this.state.selections.length > 0) {
            console.info('[Player] getSelection: Already have selections');
            this.notifyPing();
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
        var selection = selections.shift();
        this.setState({"selections": selections});
        console.info('[Player] setSelection: removed from selections', this.state.selections.length);

        // update backend
        var losers = [];
        selection.forEach(function (loser) {
            losers.push(loser.id);
        });
        $.post('/add/queue', {'winner': song.id, 'losers': losers})
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
        document.title = this.state.queue.length + " " + queue_first.src;
    },
    onEnded: function () {
        console.info('[Player] onEnded...');
        this.setState({"current": ""});
        document.title = "speler";

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
                    <h5>Choose next song to add to playlist:</h5>
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
        var history;
        if (this.state.histories.length) {
            history = (
                <div>
                    <h5>Recently Played:</h5>
                    <ol>
                        {this.state.histories.map(function (history) {
                            return (
                                <li key={history.id}>
                                    <small className="text-muted">[{history.song.id}] </small>
                                    {history.song.path_name}
                                </li>
                            );
                        })}
                    </ol>
                </div>
            );
        }
        var title = 'Player';
        var next;
        if (this.state.queue.length) {
            title = this.state.queue[0].song.path_name;
            next = <a onClick={this.onEnded} href="#">next</a>
        }
        return (
            <div className="row">
                <h4>{title}</h4>
                <div>
                    <audio ref="audio_tag" src={this.state.current} controls/>
                    {next}
                </div>
                <div>
                    <h5>Playlist:</h5>
                    <ol>
                        {this.state.queue.map(function (queue) {
                            return (
                                <li key={queue.id}>
                                    <small className="text-muted">[{queue.song.id}] </small>
                                    {queue.song.path_name}
                                </li>
                            );
                        })}
                    </ol>
                </div>
                {selection}
                {history}
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
