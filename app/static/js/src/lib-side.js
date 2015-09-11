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
        };
    },

    componentDidMount: function () {
        console.info('[Library] componentDidMount');
    },

    onTabSelect: function (grouping) {
        console.info('[Library] onTabSelect: ', grouping);
        this.setState({'grouping': grouping});
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

    render: function () {
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

                <Table grouping={this.state.grouping}/>
            </div>
        );
    }
});


var Table = React.createClass({

    getInitialState: function () {
        console.info('[Table] getInitialState');
        return {
            rows: [],
            cnt: 0
        };
    },

    componentWillReceiveProps: function (nextProps) {
        console.info('[Table] componentWillReceiveProps', nextProps);
        if (nextProps.grouping != this.props.grouping) {
            this.loadLibrarySongs(nextProps.grouping);
        }
    },

    loadLibrarySongs: function (offset, limit, sort_by, sort_dir) {
        console.info('[Table] loadLibrarySongs: grouping = ', this.props.grouping);
        var params = {
            'offset': offset,
            'limit': limit,
            'sort_by': sort_by,
            'sort_dir': sort_dir
        };
        console.info('[Table] loadLibrarySongs: params', params);
        $.getJSON('/find/' + this.props.grouping, params)
            .done(function (data) {
                console.info('[Table] loadLibrarySongs done');
                this.setState({
                    'rows': data.rows,
                    'cnt': data.cnt
                });
            }.bind(this));
    },

    render: function () {
        console.info('[Table] render');

        var display = <br/>;
        if (this.props.grouping == 'artists') {
            display = <div>
                <h4>Artists</h4>
                <TableArtists data={this.state.data}/>
            </div>
        }
        else if (this.props.grouping == 'albums') {
            display = <div>
                <h4>Albums</h4>
                <TableAlbums data={this.state.data}/>
            </div>
        }
        else if (this.props.grouping == 'songs') {
            display = <div>
                <h4>{this.state.cnt} Songs</h4>
                <TableSongs rows={this.state.rows} cnt={this.state.cnt} getData={this.loadLibrarySongs} />
            </div>
        }

        return (
            <div>
                {display}
            </div>
        );
    }
});


var TableArtists = React.createClass({
    render: function () {
        console.info('[TableArtists] render');
        return (
            <table className="table table-condensed">
                <thead>
                    <tr>
                        <th>Rating</th>
                        <th>Name</th>
                        <th>Albums</th>
                        <th>Songs</th>
                    </tr>
                </thead>
                <tbody>
                    {(this.props.data.map(function (v, i, a) {
                        return (
                            <tr key={v.id}>
                                <td>{v.rating}</td>
                                <td>{v.name}</td>
                                <td>{v.count_albums}</td>
                                <td>{v.count_songs}</td>
                            </tr>
                        );
                    }, this))}
                </tbody>
            </table>
        );

    }
});


var TableAlbums = React.createClass({
    render: function () {
        console.info('[TableAlbums] render');
        return (
            <table className="table table-condensed">
                <thead>
                    <tr>
                        <th>Rating</th>
                        <th>Name</th>
                        <th>Artist</th>
                        <th>Songs</th>
                    </tr>
                </thead>
                <tbody>
                    {(this.props.data.map(function (v, i, a) {
                        return (
                            <tr key={v.id}>
                                <td>{v.rating}</td>
                                <td>{v.name}</td>
                                <td>{v.artist.name}</td>
                                <td>{v.count_songs}</td>
                            </tr>
                        );
                    }, this))}
                </tbody>
            </table>
        );

    }
});


var TableSongs = React.createClass({
    getInitialState: function () {
        console.info('[TableSongs] getInitialState');
        return {
            edit_id: null,
            edit_prop: null,
            limit: 25,
            page: 1,
            total_pages: 1,
            sort_by: null,
            sort_dir: 'desc'
        };
    },

    componentDidMount: function () {
        console.info('[TableSongs] onComponentDidMount');
        this.loadData();
    },

    componentWillReceiveProps: function (nextProps) {

        // update total pages
        if (nextProps.cnt != this.props.cnt) {
            var total_pages = Math.ceil(nextProps.cnt / this.state.limit);
            if (this.state.total_pages != total_pages) {
                console.info('[TableSongs] componentWillReceiveProps: total_pages', total_pages);
                this.setState({total_pages: total_pages});
            }
        }
    },

    loadData: function () {
        console.info('[TableSongs] loadData');
        this.props.getData(
            (this.state.page - 1) * this.state.limit,
            this.state.limit,
            this.state.sort_by,
            this.state.sort_dir
        );
    },

    onKeyDown: function (e) {
        console.info('[TableSongs] onKeyDown');
        if (e.keyCode == 27) {
            console.info('[TableSongs] edit cancelled');
            this.setState({
                edit_id: null,
                edit_prop: null
            });
        }
    },

    editCell: function (id, prop) {
        console.info('[TableSongs] editCell', id, prop);
        this.setState({
            edit_id: id,
            edit_prop: prop
        });
    },

    setName: function (i, e) {
        console.info('[TableSongs] setName', i);
        e.preventDefault();
        var form = React.findDOMNode(this.refs.formEdit);
        console.info(form);
        this.sendUpdate(form, i);
    },

    setTrackNumber: function (i, e) {
        console.info('[TableSongs] setTrackNumber', i);
        e.preventDefault();
        var form = React.findDOMNode(this.refs.formEdit);
        console.info(form);
        this.sendUpdate(form, i);
    },

    sendUpdate: function (form, i) {
        console.info('[TableSongs] sendUpdate');
        // submit form
        $.post('/set/songs', $(form).serialize())
            .done(function (res) {
                console.info('[TableSongs] sendUpdate done', res);
                this.props.rows[i] = res;
            }.bind(this))
            .fail(function (data, status, headers, config) {
                console.error('[TableSongs] sendUpdate: error', data);
                alert('Error [TableSongs] sendUpdate');
            }.bind(this))
            .always(function () {
                console.info('[TableSongs] sendUpdate: always');
                this.setState({
                    edit_id: null,
                    edit_prop: null
                });
            }.bind(this));
    },

    getPages: function () {
        console.info('[TableSongs] getPages');
        var pages = [];
        for (var i=this.state.page-4; i<=this.state.page+4; i++) {
            if (i > 0 && i <= this.state.total_pages) {
                pages.push(i);
            }
        }
        console.info('[TableSongs] getPages: pages', pages);
        return pages;
    },

    setPage: function (page) {
        console.info('[TableSongs] setPage', page);
        this.setState({page: page}, this.loadData);
    },

    sortBy: function (col) {
        if (this.state.sort_by == col) {
            if (this.state.sort_dir == 'desc') {
                this.setState({sort_dir: 'asc'}, this.loadData);
            } else {
                this.setState({
                    sort_by: null,
                    sort_dir: 'desc'
                }, this.loadData);
            }
        } else {
            this.setState({
                sort_by: col,
                sort_dir: 'desc'
            }, this.loadData);
        }
        console.info('[TableSongs] sortBy', this.setState.sort_by, this.setState.sort_dir);
    },

    render: function () {
        console.info('[TableSongs] render');
        return (
            <section>
                {(this.props.cnt < 1)
                    ? <div className="alert alert-default">loading...</div>
                    : <div>
                        <a name="library_table"/><br/>
                        <table className="table table-condensed table-sort">
                            <thead>
                                <tr>
                                    <th onClick={this.sortBy.bind(this, 'rating')} className={(this.state.sort_by != 'rating') ? '' : 'sort-' + this.state.sort_dir}>Rating</th>
                                    <th onClick={this.sortBy.bind(this, 'name')} className={(this.state.sort_by != 'name') ? '' : 'sort-' + this.state.sort_dir}>Name</th>
                                    <th onClick={this.sortBy.bind(this, 'artist')} className={(this.state.sort_by != 'artist') ? '' : 'sort-' + this.state.sort_dir}>Artist</th>
                                    <th onClick={this.sortBy.bind(this, 'album')} className={(this.state.sort_by != 'album') ? '' : 'sort-' + this.state.sort_dir}>Album</th>
                                    <th onClick={this.sortBy.bind(this, 'track')} className={(this.state.sort_by != 'track') ? '' : 'sort-' + this.state.sort_dir}>Track</th>
                                </tr>
                            </thead>
                            <tbody>
                                {this.props.rows.map(function (v, i, a) {
                                    return (
                                        <tr key={v.id}>
                                            <td>{Math.round(v.rating * 100)}%</td>
                                            {((this.state.edit_id == v.id && this.state.edit_prop == 'name') == false)
                                                ? <td onClick={this.editCell.bind(this, v.id, 'name')} title={v.web_path}>{v.name}</td>
                                                : <td>
                                                    <form ref="formEdit" onSubmit={this.setName.bind(this, i)}>
                                                        <input type="hidden" name="song_id" value={v.id} />
                                                        <input type="text" name="name" onKeyDown={this.onKeyDown} defaultValue={v.name} autoFocus />
                                                    </form>
                                                </td>
                                            }
                                            <td>{(v.artist) ? v.artist.name : '[not specified]'}</td>
                                            <td>{(v.album) ? v.album.name : '[not specified]'}</td>
                                            {((this.state.edit_id == v.id && this.state.edit_prop == 'track_number') == false)
                                                ? <td onClick={this.editCell.bind(this, v.id, 'track_number')}>{v.track_number}</td>
                                                : <td>
                                                    <form ref="formEdit" onSubmit={this.setTrackNumber.bind(this, i)}>
                                                        <input type="hidden" name="song_id" value={v.id} />
                                                        <input type="text" name="track_number" onKeyDown={this.onKeyDown} defaultValue={v.track_number} autoFocus />
                                                    </form>
                                                </td>
                                            }
                                        </tr>
                                    );
                                }.bind(this))}
                            </tbody>
                        </table>

                        <ul className="pagination">
                            <li className={(this.state.page < 2) ? 'disabled' : ''}>
                                <a onClick={this.setPage.bind(this, this.state.page - 1)} href="#library_table" aria-label="Previous">
                                    <span aria-hidden="true">&laquo;</span>
                                </a>
                            </li>
                            {this.getPages().map(function (v, i, a) {
                                return (
                                    <li key={i} className={(this.state.page == v) ? 'active' : ''}>
                                        <a href="#library_table" onClick={this.setPage.bind(this, v)}>{v}</a>
                                    </li>
                                );
                            }.bind(this))}
                            <li className={(this.state.page >= this.state.total_pages) ? 'disabled' : ''}>
                                <a onClick={this.setPage.bind(this, this.state.page + 1)} href="#library_table" aria-label="Next">
                                    <span aria-hidden="true">&raquo;</span>
                                </a>
                            </li>
                        </ul>
                    </div>
                }
            </section>
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
                'is_albums_sized',
                'is_albums_complete',
                'is_logged_in'
            ],
            'is_parsed': false,
            'is_songs_named': false,
            'is_songs_tracked': false,
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

    submitSongName: function (e) {
        console.info('[Factoid] submitSongName');
        e.preventDefault();
        var form = React.findDOMNode(this.refs.formSongName);
        console.info('[Factoid] submitSongName form', form);
        this.sendFactoid(form);
    },

    submitSongTrack: function (e) {
        console.info('[Factoid] submitSongTrack');
        e.preventDefault();
        var form = React.findDOMNode(this.refs.formSongTrack);
        console.info('[Factoid] submitSongTrack form', form);
        this.sendFactoid(form);
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

        if (typeof(this.state.is_parsed) != 'boolean') {
            msg = 'You have ' + this.state.is_parsed.count + ' unparsed songs';
        }

        else if (typeof(this.state.is_songs_named) != 'boolean') {
            msg = <form ref="formSongName" className="form" onSubmit={this.submitSongName}>
                <input type="hidden" name="song_id" value={this.state.is_songs_named.id} />
                <dl>
                    <dt>What is the name of this song?</dt>
                    <dd><span>{this.state.is_songs_named.path_name}</span></dd>
                    <dd><small classNames="text-muted">{this.state.is_songs_named.web_path}</small></dd>
                </dl>
                <input type="text" className="form-control input-sm" id="song_name" name="song_name" required autoFocus autoComplete="off" />
                <button type="submit" className="btn btn-default btn-sm">Submit</button>
            </form>
        }

        else if (typeof(this.state.is_songs_tracked) != 'boolean') {
            msg = <form ref="formSongTrack" className="form" onSubmit={this.submitSongTrack}>
                <input type="hidden" name="song_id" value={this.state.is_songs_tracked.id} />
                <dl>
                    <dt>What is the track of this song?</dt>
                    <dd><span>{this.state.is_songs_tracked.path_name}</span></dd>
                    <dd><small classNames="text-muted">{this.state.is_songs_tracked.web_path}</small></dd>
                </dl>
                <input type="number" className="form-control input-sm" id="song_track_number" name="song_track_number" required autoFocus autoComplete="off" />
                <button type="submit" className="btn btn-default btn-sm">Submit</button>
            </form>
        }

        else if (typeof(this.state.is_albums_sized) != 'boolean') {
            msg = <form ref="formAlbumsSize" className="form" onSubmit={this.submitAlbumsSized}>
                <input type="hidden" name="album_id" value={this.state.is_albums_sized.id} />
                <dl>
                    <dt>How many tracks does this album have?</dt>
                    <dd><span>{this.state.is_albums_sized.name}</span></dd>
                    <dd>~ {this.state.is_albums_sized.artist.name}</dd>
                </dl>
                <input type="number" className="form-control input-sm" id="album_size" name="total_tracks" required autoFocus />
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
