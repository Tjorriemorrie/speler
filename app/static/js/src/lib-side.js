//Custom Formatter component
var PercentageFormatter = React.createClass({
    render: function () {
        return (
            <span>{Math.round(this.props.value * 100) + '%'}</span>
        );
    }
});


var Library = React.createClass({

    getInitialState: function () {
        console.info('[Library] getInitialState');
        return {
            'isScanning': false,
            'grouping': null,
            'rows': []
        };
    },

    componentDidMount: function () {
        console.info('[Library] componentDidMount');
    },

    onTabSelect: function (grouping) {
        console.info('[Library] onTabSelect: ', grouping);
        this.loadLibrarySongs(grouping);
    },

    scanDirectory: function () {
        console.info('[Library] scandir');
        if (this.state.isScanning) {
            alert('Scanning in progress');
        } else {
            this.setState({'isScanning': true});
            $.getJSON('/scan/dir')
                .done(function () {
                    console.info('[Library] scanDirectory: done');
                }.bind(this))
                .always(function (data) {
                    this.setState({'isScanning': false});
                    if (data['parsed'] >= 50) {
                        this.scanDirectory();
                    }
                }.bind(this));
        }
    },

    loadLibrarySongs: function (grouping) {
        console.info('[Library] loadLibrarySongs: grouping = ', grouping);
        $.getJSON('/find/' + grouping)
            .done(function (data) {
                console.info('[Library] loadLibrarySongs done');
                this.setState({
                    'grouping': grouping,
                    'rows': data
                });
            }.bind(this));
    },

    formatPercentage: function (v) {
        return Math.round(v * 100) + '%';
    },

    updateRow: function (row, key, val) {
        console.info('[Library] updateRow', row, key, val);

        var params = {'id': row.id};
        params[key] = val;

        // submit form
        $.post('/set/' + this.props.grouping, params)
            .done(function (res) {
                console.info('[Library] updateRow: done', res);
            }.bind(this))
            .fail(function (data, status, headers, config) {
                console.error('[Library] updateRow: error', data);
                alert('Error [Library] updateRow');
            }.bind(this))
            .always(function () {
                console.info('[Library] updateRow: always');
                this.loadLibrarySongs(this.props.grouping);
            }.bind(this));
    },

    getGrid: function () {
        console.info('[Library] getGrid');

        if (this.state.grouping == 'artists') {
            return <div>
                <h4>Artists</h4>
                <SmallGrid
                    rows={this.state.rows}
                    cols={[
                        {'key': 'rating', 'name': 'Rating', 'format': this.formatPercentage},
                        {'key': 'name', 'name': 'Title', 'edit': this.updateRow},
                        {'key': 'count_albums', 'name': 'Albums'},
                        {'key': 'count_songs', 'name': 'Songs'},
                    ]}
                />
            </div>;
        }

        else if (this.state.grouping == 'albums') {
            return <div>
                <h4>Albums</h4>
                <SmallGrid
                    rows={this.state.rows}
                    cols={[
                        {'key': 'rating', 'name': 'Rating', 'format': this.formatPercentage},
                        {'key': 'name', 'name': 'Title', 'edit': this.updateRow},
                        {'key': 'artist.name', 'name': 'Artist'},
                        {'key': 'count_songs', 'name': 'Songs'},
                    ]}
                />
            </div>;
        }

        else if (this.state.grouping == 'songs') {
            return <div>
                <h4>Songs</h4>
                <SmallGrid
                    rows={this.state.rows}
                    cols={[
                        {'key': 'rating', 'name': 'Rating', 'format': this.formatPercentage},
                        {'key': 'name', 'name': 'Title', 'edit': this.updateRow},
                        {'key': 'artist.name', 'name': 'Artist', 'edit': this.updateRow},
                        {'key': 'album.name', 'name': 'Album', 'edit': this.updateRow},
                        {'key': 'track_number', 'name': 'Track', 'edit': this.updateRow},
                    ]}
                />
            </div>;
        }
    },

    render: function () {
        console.info('[Library] render');

        var smallGrid = this.getGrid();

        return (
            <div className="row">
                <h3>
                    <button className="btn btn-default btn-sm pull-right" onClick={this.scanDirectory}>{this.state.isScanning ? 'Scanning...' : 'Refresh'}</button>
                    Library
                </h3>

                <div className="btn-group" data-toggle="buttons">
                    <label className="btn btn-default">
                        <input type="radio" autoComplete="off" onClick={this.onTabSelect.bind(this, 'artists')} /> Artists
                    </label>
                    <label className="btn btn-default">
                        <input type="radio" autoComplete="off" onClick={this.onTabSelect.bind(this, 'albums')} /> Albums
                    </label>
                    <label className="btn btn-default">
                        <input type="radio" autoComplete="off" onClick={this.onTabSelect.bind(this, 'songs')} /> Songs
                    </label>
                </div>

                {smallGrid}
            </div>
        );
    }
});


var Factoid = React.createClass({

    getInitialState: function () {
        return {
            'ordering': [
                'is_parsed',
                'is_songs_named',
                'is_songs_tracked',
                'is_songs_artist',
                'is_songs_album',
                'is_albums_sized',
//                'is_albums_complete',
//                'is_logged_in',
            ],
            'is_parsed': false,
            'is_songs_named': false,
            'is_songs_tracked': false,
            'is_songs_artist': false,
            'is_songs_album': false,
            'is_albums_sized': false,
            'is_albums_complete': false,
            'is_logged_in': false,
        };
    },

    componentDidMount: function () {
        console.info('[Factoid] componentDidMount');
//        React.findDOMNode(this.refs.focusOnMe).focus();
        this.loadFactoid();
    },

//    componentDidUpdate: function (prevProps, prevState) {
//        console.info('[Factoid] componentDidUpdate');
//    },

    loadFactoid: function () {
        console.info('[Factoid] loadFactoid');

        if (this.state.ordering.length > 0) {
            $.getJSON('/factoid/' + this.state.ordering[0])
                .done(function (data) {
                    var new_state = {};
                    if (data === true) {
                        new_state[this.state.ordering[0]] = true;
                        new_state['ordering'] = this.state.ordering;
                        new_state['ordering'].shift();
                        setTimeout(function () {
                            this.loadFactoid();
                        }.bind(this), 1000);
                    } else {
                        new_state[this.state.ordering[0]] = data;
                    }
                    this.setState(new_state);
                }.bind(this))
                .fail(function (data, status, headers, config) {
                    alert('Error loading factoid');
                    console.error('[Factoid] loadFactoid: error', data);
                }.bind(this));
        }
    },

    submitSong: function (e) {
        console.info('[Factoid] submitSong');
        e.preventDefault();
        var form = React.findDOMNode(this.refs.formSong);
        console.info('[Factoid] submitSong form', form);
        this.sendFactoid(form, '/set/songs');
    },

    submitAlbum: function (e) {
        console.info('[Factoid] submitAlbum');
        e.preventDefault();
        var form = React.findDOMNode(this.refs.formAlbum);
        console.info('[Factoid] submitAlbum form', form);
        this.sendFactoid(form, '/set/albums');
    },

    sendFactoid: function (form, url) {
        console.info('[Factoid] sendFactoid');

        // remove factoid during submit
        var new_state = {};
        new_state[this.state.ordering[0]] = false;
        this.setState(new_state);

        // submit form
        $.post(url, $(form).serialize())
            .done(function (res) {
                console.info('[Factoid] sendFactoid res', res);
            }.bind(this))
            .fail(function (data, status, headers, config) {
                console.error('[Factoid] loadFactoid: error', data);
                alert('Error sendFactoid');
            }.bind(this))
            .always(function () {
                console.info('[Factoid] sendFactoid: always');
                this.loadFactoid();
            }.bind(this));
    },

    render: function () {
        console.info('[Factoid] render');
        var msg = null;

        if (typeof(this.state.is_parsed) != 'boolean') {
            msg = 'You have ' + this.state.is_parsed.count + ' unparsed songs';
        }

        else if (typeof(this.state.is_songs_named) != 'boolean') {
            msg = <form ref="formSong" className="form" onSubmit={this.submitSong}>
                <dl>
                    <dt>What is the name of this song?</dt>
                    <dd><span>{this.state.is_songs_named.path_name}</span></dd>
                    <dd><small classNames="text-muted">{this.state.is_songs_named.web_path}</small></dd>
                </dl>
                <input type="hidden" name="song" value={this.state.is_songs_named.id} />
                <input type="text" name="name" className="form-control input-sm" required autoFocus autoComplete="off" />
                <button type="submit" className="btn btn-default btn-sm">Submit</button>
            </form>
        }

        else if (typeof(this.state.is_songs_tracked) != 'boolean') {
            msg = <form ref="formSong" className="form" onSubmit={this.submitSong}>
                <dl>
                    <dt>What is the track of this song?</dt>
                    <dd><span>{this.state.is_songs_tracked.path_name}</span></dd>
                    <dd><small classNames="text-muted">{this.state.is_songs_tracked.web_path}</small></dd>
                </dl>
                <input type="hidden" name="id" value={this.state.is_songs_tracked.id} />
                <input type="number" name="song_track_number" className="form-control input-sm" required autoFocus autoComplete="off" />
                <button type="submit" className="btn btn-default btn-sm">Submit</button>
            </form>
        }

        else if (typeof(this.state.is_songs_artist) != 'boolean') {
            msg = <form ref="formSong" className="form" onSubmit={this.submitSong}>
                <dl>
                    <dt>Who is the artist of this song?</dt>
                    <dd>{this.state.is_songs_artist.name}</dd>
                    <dd><small className="text-muted">{this.state.is_songs_artist.web_path}</small></dd>
                </dl>
                <input type="hidden" name="id" value={this.state.is_songs_artist.id} />
                <input type="text" className="form-control input-sm" name="artist.name" required autoFocus autoComplete="off" />
                <button type="submit" className="btn btn-default btn-sm">Submit</button>
            </form>
        }

        else if (typeof(this.state.is_songs_album) != 'boolean') {
            msg = <form ref="formSong" className="form" onSubmit={this.submitSong}>
                <dl>
                    <dt>What is the album of this song?</dt>
                    <dd>{this.state.is_songs_album.name}</dd>
                    <dd><small className="text-muted">{this.state.is_songs_album.web_path}</small></dd>
                </dl>
                <input type="hidden" name="id" value={this.state.is_songs_album.id} />
                <input type="text" className="form-control input-sm" name="album.name" required autoFocus autoComplete="off" />
                <button type="submit" className="btn btn-default btn-sm">Submit</button>
            </form>
        }

        else if (typeof(this.state.is_albums_sized) != 'boolean') {
            msg = <form ref="formAlbum" className="form" onSubmit={this.submitAlbum}>
                <dl>
                    <dt>How many tracks does this album have?</dt>
                    <dd><span>{this.state.is_albums_sized.name}</span></dd>
                    <dd>~ {this.state.is_albums_sized.artist.name}</dd>
                </dl>
                <input type="hidden" name="id" value={this.state.is_albums_sized.id} />
                <input type="number" name="total_tracks" className="form-control input-sm" required autoFocus autoComplete="off" />
                <button type="submit" className="btn btn-default btn-sm">Submit</button>
            </form>
        }

        else if (typeof(this.state.is_albums_complete) != 'boolean') {
            msg = <form ref="formAlbumsSize" className="form" onSubmit={this.submitAlbumsSized}>
                <input type="hidden" name="album_id" value={this.state.is_albums_complete.album.id} />
                <h4>This album has missing tracks!</h4>
                <dl>
                    <dt>Tracks set on the album currently is <strong>{this.state.is_albums_complete.album.total_tracks}</strong></dt>
                    <dd><span>{this.state.is_albums_complete.album.name}</span></dd>
                    <dd>~ {this.state.is_albums_complete.album.artist.name}</dd>
                </dl>
                <input type="number" className="form-control input-sm" id="album_size" name="total_tracks" required autoFocus />
                <button type="submit" className="btn btn-default btn-sm">Submit</button>
                <hr/>
                <dl>
                    <dt>{this.state.is_albums_complete.songs.length} songs that belong to the album:</dt>
                    {this.state.is_albums_complete.songs.map(function (song) {
                        return <dd>{song.track_number} {song.name}</dd>;
                    })}
                </dl>
            </form>
        }

        else if (typeof(this.state.is_logged_in) != 'boolean') {
            msg = 'You are not logged into Last.fm';
        }

        if (msg) {
            return (
                <div className="alert alert-default">{msg}</div>
            );
        } else {
            return <span/>;
        }
    }
});


React.render(
    <section>
        <Factoid />
        <Library />
    </section>,
    document.getElementById('lib-side')
);
