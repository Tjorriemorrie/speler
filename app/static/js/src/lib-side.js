var Library = React.createClass({
    loadLibrarySongs: function () {
        $.getJSON(this.props.source, function (data) {
            console.info('Library initial request success');
            if (this.isMounted()) {
                console.info('Library still mounted: setting data to state', data.length);
                this.setState({lib_files: data});
            }
        }.bind(this));
    },
    getInitialState: function () {
        return {
            'isScanning': false,
            'lib_files': []
        };
    },
    componentDidMount: function () {
        console.info('Library initial request');
        setInterval(function () {
            this.loadLibrarySongs();
        }.bind(this), 60000);
        this.loadLibrarySongs();
    },
    scanDirectory: function () {
        console.info('Library scandir');
        if (this.state.isScanning) {
            alert('Scanning in progress');
        } else {
            this.setState({'isScanning': true});
            $.getJSON('/scan/dir', function (data) {
                this.setState({'isScanning': false});
                this.loadLibrarySongs();
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
                <h5>{this.state.lib_files.length} files in library</h5>
                <table className="table table-condensed">
                <thead>
                    <tr>
                        <th>Priority</th>
                        <th>Rating</th>
                        <th>Played</th>
                        <th>Path</th>
                    </tr>
                </thead>
                <tbody>
                    {this.state.lib_files.map(function (song) {
                        return (
                            <tr key={song.id}>
                                <td>{song.priority}</td>
                                <td>{song.rating} after {song.count_rated}</td>
                                <td>{song.count_played}</td>
                                <td><small className="pull-right text-muted">{song.id}</small>{song.path_name}</td>
                            </tr>
                        );
                    })}
                </tbody>
                </table>
            </div>
        );
    }
});


React.render(
    <Library source="/find/files" />,
    document.getElementById('lib-side')
);

//
//app.factory('libraryFcty', function ($http) {
//    var library = {};
//
//    library.files = [];
//    library.findFiles = function () {
//        console.info('Library_findfiles...');
//        $http.get('/find/files')
//            .success(function (data, status, headers, config) {
//                console.info('Library_findfiles: success', data.length);
//                library.files = data;
//            })
//            .error(function (data, status, headers, config) {
//                alert('Error retrieving files');
//                console.error('Library_findfiles: error', data);
//            });
//    };
//
//    library.scandir = function () {
//        console.info('Library_scandir...');
//        return $http.get('/scan/dir')
//            .success(function (data, status, headers, config) {
//                console.info('Library_scandir: success', data);
//                library.findFiles();
//            })
//            .error(function (data, status, headers, config) {
//                alert('Error scanning directory');
//                console.error('Library_scandir: error', data);
//            });
//    };
//
//    library.findFiles();
//
//    return library;
//});
//
//
//app.controller('libraryCtrl', function (libraryFcty) {
//    this.lib = libraryFcty;
//    this.refreshLibrary = function () {
//        libraryFcty.scandir();
//    };
//});
