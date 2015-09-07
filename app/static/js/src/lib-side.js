var Tabs = ReactBootstrap.Tabs;
var Tab = ReactBootstrap.Tab;
var Alert = ReactBootstrap.Alert;


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
        return {
            'isScanning': false,
            'grouping': 'artists',
            'lib_artists': [],
            'lib_albums': [],
            'lib_songs': []
        };
    },

    componentDidMount: function () {
        console.info('[Library] initial request');
    },

    onTabSelect: function (grouping) {
        console.info('[Library] onTabSelect: ', grouping);

        if (this.state.status) {
            console.warn('[Library] onTabSelect: status is already ', this.state.status);
            return false;
        }

        this.setState({
            'status': 'Loading...',
            'grouping': grouping
        }, this.loadLibrarySongs);
    },

    loadLibrarySongs: function () {
        $.getJSON('/find/' + this.state.grouping, function (data) {
            console.info('[Library] initial request success');
            if (this.isMounted()) {
                console.info('Library still mounted: setting data to state', data.length);
                var new_state = {};
                new_state['lib_' + this.state.grouping] = data;
                console.info('new state', new_state);
                this.setState(new_state);
            }
        }.bind(this))
            .always(function () {
                console.info('[Library] loadLibrarySongs: always');
                this.setState({'status': null});
            }.bind(this));
    },

    scanDirectory: function () {
        console.info('[Library] scandir');
        if (this.state.isScanning) {
            alert('Scanning in progress');
        } else {
            this.setState({'isScanning': true});
            $.getJSON('/scan/dir')
                .done(function () {
                    this.loadLibrarySongs();
                }.bind(this))
                .always(function (data) {
                    this.setState({'isScanning': false});
                    if (data['parsed'] >= 100) {
                        this.scanDirectory();
                    }
                }.bind(this));
        }
    },

    rowGetter: function (rowIdx) {
        if (this.state.grouping == 'artists') {
            return this.state.lib_artists[rowIdx];
        } else if (this.state.grouping == 'albums') {
            return this.state.lib_albums[rowIdx];
        } else if (this.state.grouping == 'songs') {
            return this.state.lib_songs[rowIdx];
        }
    },

    onRowUpdated: function (e) {
        console.info('[Library] onRowUpdated: rowIdx', e.rowIdx);
        console.info('[Library] onRowUpdated: value', e.updated);

        if (this.state.grouping == 'artists') {
            console.info('[Library] onRowUpdated: artists');

            var rows = this.state.lib_artists;
            Object.assign(rows[e.rowIdx], e.updated);

            console.info('[Library] onRowUpdated: form', rows[e.rowIdx]);

            // update backend
            $.post('/set/artists', rows[e.rowIdx])
                .done(function (data, status, headers, config) {
                    this.setState({lib_artists: rows});
                }.bind(this))
                .fail(function (data, status, headers, config) {
                    alert('Error updating row');
                    console.error('[Library] onRowUpdated: error', data);
                }.bind(this));

        } else if (this.state.grouping == 'albums') {
            console.info('[Library] onRowUpdated: albums');

            var rows = this.state.lib_albums;
            Object.assign(rows[e.rowIdx], e.updated);

            console.info('[Library] onRowUpdated: form', rows[e.rowIdx]);

            // update backend
            $.post('/set/albums', rows[e.rowIdx])
                .done(function (data, status, headers, config) {
                    this.setState({lib_albums: rows});
                }.bind(this))
                .fail(function (data, status, headers, config) {
                    alert('Error updating row');
                    console.error('[Library] onRowUpdated: error', data);
                }.bind(this));

        } else if (this.state.grouping == 'songs') {
            console.info('[Library] onRowUpdated: songs');

            var rows = this.state.lib_songs;
            Object.assign(rows[e.rowIdx], e.updated);

            console.info('[Library] onRowUpdated: form', rows[e.rowIdx]);

            // update backend
            $.post('/set/songs', rows[e.rowIdx])
                .done(function (data, status, headers, config) {
                    this.setState({lib_songs: rows});
                }.bind(this))
                .fail(function (data, status, headers, config) {
                    alert('Error updating row');
                    console.error('[Library] onRowUpdated: error', data);
                }.bind(this));

        } else {
            alert('[Library] onRowUpdated: unknown grouping of ' + this.state.grouping);
        }
    },

    render: function () {
        return (
            <div className="row">
                <h3>
                    <button className="btn btn-default btn-sm pull-right" onClick={this.scanDirectory}>{this.state.isScanning ? 'Scanning...' : 'Refresh'}</button>
                    Library
                </h3>

                {(this.state.status) ? <Alert bsStyle="info">{this.state.status}</Alert> : <br/>}

                <Tabs defaultActiveKey={'none'} onSelect={this.onTabSelect}>
                    <Tab eventKey={'artists'} title="Artists">
                        <ReactDataGrid
                            columns={[
                                {'key': 'rating', 'name': 'Rating', 'formatter': PercentageFormatter},
                                {'key': 'name', 'name': 'Name', 'editable': true, 'width': 400},
                                {'key': 'count_albums', 'name': '# Albums', 'width': 100},
                                {'key': 'count_songs', 'name': '# Songs', 'width': 100}
                            ]}
                            rowGetter={this.rowGetter}
                            rowsCount={this.state.lib_artists.length}
                            enableCellSelect={true}
                            onRowUpdated={this.onRowUpdated}
                            minHeight={500}/>
                    </Tab>

                    <Tab eventKey={'albums'} title="Albums">
                        <ReactDataGrid
                            columns={[
                                {'key': 'rating', 'name': 'Rating', 'formatter': PercentageFormatter},
                                {'key': 'name', 'name': 'Name', 'editable': true, 'width': 400},
                                {'key': 'count_songs', 'name': '# Songs', 'width': 100}
                            ]}
                            rowGetter={this.rowGetter}
                            rowsCount={this.state.lib_albums.length}
                            enableCellSelect={true}
                            onRowUpdated={this.onRowUpdated}
                            minHeight={500}/>
                    </Tab>

                    <Tab eventKey={'songs'} title="Songs">
                        <ReactDataGrid
                            columns={[
                                {'key': 'rating', 'name': 'Rating', 'formatter': PercentageFormatter},
                                {'key': 'name', 'name': 'Name', 'editable': true, 'width': 400},
                                {'key': 'played_at', 'name': 'Last Played', 'width': 100}
                            ]}
                            rowGetter={this.rowGetter}
                            rowsCount={this.state.lib_songs.length}
                            enableCellSelect={true}
                            onRowUpdated={this.onRowUpdated} />
                    </Tab>

                </Tabs>
            </div>
        );
    }
});


var Factoid = React.createClass({

    getInitialState: function () {
        return {
            'ordering': [
                'is_logged_in',
                'is_parsed',
                'is_albums_sized',
                'is_albums_complete',
            ],
            'is_logged_in': false,
            'is_parsed': false,
            'is_albums_sized': false,
            'is_albums_complete': false
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

        if (this.state.ordering.length < 1) {
            console.info('[Factoid] no more stuff to check');
        }

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
    },

    submitAlbumsSized: function (e) {
        console.info('[Factoid] submitAlbumsSized');
        e.preventDefault();
        var form = React.findDOMNode(this.refs.formAlbumsSize);
        console.info('[Factoid] submitAlbumsSized form', form);
        this.sendFactoid(form);
    },

    sendFactoid: function (form) {
        console.info('[Factoid] sendFactoid');

        // remove factoid during submit
        var new_state = {};
        new_state[this.state.ordering[0]] = false;
        this.setState(new_state);

        // submit form
        $.post('/factoid/' + this.state.ordering[0], $(form).serialize())
            .done(function (res) {
                console.info('[Factoid] sendFactoid res', res);
            }.bind(this))
            .fail(function (data, status, headers, config) {
                console.error('[Factoid] loadFactoid: error', data);
                alert('Error submitAlbumsSized sized');
            }.bind(this))
            .always(function () {
                console.info('[Factoid] loadFactoid: always');
                this.loadFactoid();
            }.bind(this));
    },

    render: function () {
        console.info('[Factoid] render');
        var msg = 'Enjoy your music library';

        if (typeof(this.state.is_logged_in) != 'boolean') {
            msg = 'You are not logged into Last.fm';
        }

        else if (typeof(this.state.is_parsed) != 'boolean') {
            msg = 'You have ' + this.state.is_parsed.count + ' unparsed songs';
        }

        else if (typeof(this.state.is_albums_sized) != 'boolean') {
            msg = <form ref="formAlbumsSize" className="form" onSubmit={this.submitAlbumsSized}>
                <input type="hidden" name="album_id" value={this.state.is_albums_sized.id} />
                <dl>
                    <dt>How many tracks does this album have?</dt>
                    <dd><span>{this.state.is_albums_sized.name}</span></dd>
                    <dd>~ {this.state.is_albums_sized.artist.name}</dd>
                </dl>
                <input type="number" ref="focusOnMe" className="form-control input-sm" id="album_size" name="total_tracks" required />
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
                <input type="number" ref="focusOnMe" className="form-control input-sm" id="album_size" name="total_tracks" required />
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

        return (
            <div className="alert alert-default">{msg}</div>
        );
    }
});


//        <Factoid />
React.render(
    <section>
        <Library />
    </section>,
    document.getElementById('lib-side')
);
