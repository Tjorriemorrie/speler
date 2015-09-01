var Library = React.createClass({
    getInitialState: function () {
        return {
            'isScanning': false,
            'grouping': 'files',
            'lib_files': [],
            'lib_artists': []
        };
    },
    componentDidMount: function () {
        console.info('[Library] initial request');
        setInterval(function () {
            this.loadLibrarySongs();
        }.bind(this), 5 * 60 * 1000);
        this.loadLibrarySongs();
    },
    setGrouping: function (grouping) {
        console.info('[Library] setGrouping', grouping);
        this.setState({'grouping': grouping}, this.loadLibrarySongs);
    },
    loadLibrarySongs: function () {
        $.getJSON('/find/' + this.state.grouping, function (data) {
            console.info('Library initial request success');
            if (this.isMounted()) {
                console.info('Library still mounted: setting data to state', data.length);
                var new_state = {};
                new_state['lib_' + this.state.grouping] = data;
                console.info('new state', new_state);
                this.setState(new_state);
            }
        }.bind(this));
    },
    scanDirectory: function () {
        console.info('Library scandir');
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
    render: function () {
        var display;
        if (this.state.grouping == 'files') {
            console.info('[Library] render: displaying files');
            display = <div>
                <h5>{this.state.lib_files.length} files in library</h5>
                <table className="table table-condensed">
                <thead>
                    <tr>
                        <th>Rating</th>
                        <th>Played</th>
                        <th>Path</th>
                    </tr>
                </thead>
                <tbody>
                    {this.state.lib_files.map(function (file) {
                        return (
                            <tr key={file.id}>
                                <td>
                                    {Math.round(file.rating * 100)}% <small className="text-muted">after {file.count_rated}</small>
                                </td>
                                <td className="text-center">{file.count_played}</td>
                                <td><small className="pull-right text-muted">{file.id}</small>{file.path_name}</td>
                            </tr>
                        );
                    })}
                </tbody>
                </table>
            </div>
        } else if (this.state.grouping == 'artists') {
            console.info('[Library] render: displaying artists');
            display = <div>
                <h5>{this.state.lib_artists.length} artists in library</h5>
                <table className="table table-condensed">
                <thead>
                    <tr>
                        <th>Name</th>
                    </tr>
                </thead>
                <tbody>
                    {this.state.lib_artists.map(function (artist) {
                        return (
                            <tr key={artist.id}>
                                <td>{artist.name}</td>
                            </tr>
                        );
                    })}
                </tbody>
                </table>
            </div>
        }
        return (
            <div className="row">
                <h3>
                    <button className="btn btn-default btn-sm pull-right" onClick={this.scanDirectory}>{this.state.isScanning ? 'Scanning...' : 'Refresh'}</button>
                    Library
                </h3>
                <div className="btn-group" data-toggle="buttons">
                    <label className="btn btn-default btn-sm active" onClick={this.setGrouping.bind(this, 'files')}>
                        <input type="radio" name="grouping" id="lib-files" autocomplete="off" /> Files
                    </label>
                    <label className="btn btn-default btn-sm" onClick={this.setGrouping.bind(this, 'artists')}>
                        <input type="radio" name="grouping" id="lib-artists" autocomplete="off" /> Artists
                    </label>
                </div>
                {display}
            </div>
        );
    }
});


React.render(
    <Library />,
    document.getElementById('lib-side')
);
