import React from 'react';
import SmallGrid from 'react-smallgrid';


export default class Library extends React.Component{

    constructor(props) {
        console.info('[Library] constructor');
        super(props);
        this.state = {
            'isScanning': false,
            'grouping': null,
            'rows': []
        };
    }

    render() {
        console.info('[Library] render');

        return (
            <div className="row">
                <h3>
                    <button className="btn btn-default btn-sm pull-right" onClick={() => this.scanDirectory()}>{this.state.isScanning ? 'Scanning...' : 'Refresh'}</button>
                    Library
                </h3>

                <div className="btn-group" data-toggle="buttons">
                    <label className="btn btn-default" onClick={() => this.loadLibrarySongs('artists')}>
                        <input type="radio" autoComplete="off" /> Artists
                    </label>
                    <label className="btn btn-default" onClick={() => this.loadLibrarySongs('albums')}>
                        <input type="radio" autoComplete="off" /> Albums
                    </label>
                    <label className="btn btn-default" onClick={() => this.loadLibrarySongs('songs')}>
                        <input type="radio" autoComplete="off" /> Songs
                    </label>
                </div>

                {this.getGrid()}
            </div>
        );
    }

    scanDirectory() {
        console.info('[Library] scandir');
        if (this.state.isScanning) {
            alert('Scanning in progress');
        } else {
            this.setState({'isScanning': true});
            $.getJSON('/scan/dir')
                .done(function () {
                    console.info('[Library] scanDirectory: done');
                    this.scanId3s();
                }.bind(this));
        }
    }

    scanId3s() {
        console.info('[Library] scanId3s');
        $.getJSON('/scan/id3')
            .done(function (data) {
                console.info('[Library] scanId3s: done');
                if (data['parsed'] >= 50) {
                    this.scanId3s();
                } else {
                    this.setState({'isScanning': false});
                }
            }.bind(this));
    }


    loadLibrarySongs(grouping) {
        console.info('[Library] loadLibrarySongs: grouping = ', grouping);
        $.getJSON('/find/' + grouping)
            .done(function (data) {
                console.info('[Library] loadLibrarySongs done');
                this.setState({
                    'grouping': grouping,
                    'rows': data
                });
            }.bind(this));
    }


    formatPercentage(v) {
        return Math.round(v * 100) + '%';
    }

    updateRow(row, key, val) {
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
    }

    getGrid() {
        return false;
        console.info('[Library] getGrid');

        if (this.state.grouping == 'artists') {
            console.info('[Library] getGrid: artists');
            return <div>
                <h4>Artists</h4>
                <SmallGrid
                    rows={this.state.rows}
                    cols={[
                        {'key': 'rating', 'name': 'Rating'},
                        {'key': 'name', 'name': 'Title'},
                        {'key': 'count_albums', 'name': 'Albums'},
                        {'key': 'count_songs', 'name': 'Songs'}
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

        else {
            return <div></div>;
        }
    }

}
