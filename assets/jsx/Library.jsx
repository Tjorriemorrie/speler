import React from 'react';
import SmallGrid from 'react-smallgrid';
import Scanner from './Scanner.jsx';


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

        return <div className="row">
            <h3>
                <Scanner />
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
        </div>;
    }

    getGrid() {
        console.info('[Library] getGrid', this.state.grouping);

        if (this.state.grouping == 'artists') {
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

    }

    loadLibrarySongs(grouping) {
        console.info('[Library] loadLibrarySongs: grouping = ', grouping);
        fetch('/find/' + grouping)
            .then(r => r.json())
            .then(data => {
                console.info('[Library] loadLibrarySongs done');
                this.setState({
                    'grouping': grouping,
                    'rows': data
                });
            });
    }


    formatPercentage(v) {
        return Math.round(v * 100) + '%';
    }

    updateRow(row, key, val) {
        console.info('[Library] updateRow', row, key, val);

        let fd = new FormData();
        fd.append('id', row.id);
        fd.append(key, val);

        fetch('/set/' + this.props.grouping, {
            method: 'POST',
            body: fd
        })
            .then(r => console.info('[Library] updateRow: done'))
            .catch(e => {
                console.error('[Library] updateRow: error', e);
                alert('Error [Library] updateRow');
            })
            .always(() => {
                console.info('[Library] updateRow: always');
                this.loadLibrarySongs(this.props.grouping);
            });
    }

}
