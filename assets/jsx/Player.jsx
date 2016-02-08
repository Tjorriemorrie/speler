import React from 'react';
import ReactDOM from 'react-dom';
import SongDetails from './SongDetails.jsx';


export default class Player extends React.Component{

    constructor(props) {
        console.info('[Player] constructor...');
        super(props);
        this.audio_tag = null;
        this.state = {
            'queue': [],
            'histories': [],
            'selections': [],
            'current': ""
        };
    }

    componentDidMount() {
        console.info('[Player] componentDidMount...');
        this.audio_tag = this.refs.audio_tag;
        this.audio_tag.addEventListener('ended', () => this.onEnded());
        console.info('[Player] audio_tag event listener added for ended');
        this.audio_tag.volume = 0.50;
        console.info('[Player] audio_tag volume set to 50%');
        this.loadQueue();
    }

    render() {
        console.info('[Player] render...');
        return (
            <div className="row">
                <div className="col-sm-11">
                    <div>
                        <audio ref="audio_tag" src={this.state.current} controls/>
                        {(this.state.queue.length)
                            ? <a onClick={() => this.onEnded()} href="#" className="audio_next">&#10940;</a>
                            : ''
                        }
                    </div>

                    {(!this.state.selections.length)
                        ? ''
                        : (
                            <div>
                                <h5>Choose next song to add to playlist:</h5>
                                <div className="btn-group btn-group-vertical">
                                    {this.state.selections[0].map((selection) => {
                                        return (
                                            <a key={selection.id} onClick={() => this.setSelection(selection)} className="btn btn-default" type="button">
                                                <small><SongDetails song={selection}/></small>
                                            </a>
                                        );
                                    })}
                                </div>
                            </div>
                        )
                    }

                    <div>
                        <h5>Playlist:</h5>
                        <ol>
                            {this.state.queue.map((queue, index) => {
                                return (
                                    <li key={queue.id} className={(index < 1) ? 'current_song' : ''}><SongDetails song={queue.song}/></li>
                                );
                            })}
                        </ol>
                    </div>

                    <div>
                        <h5>Recently Played:</h5>
                        {(!this.state.histories.length)
                            ? <p>no songs played recently</p>
                            : (
                                <ol>
                                    {this.state.histories.map((history) => {
                                        return (
                                            <li key={history.id}>
                                                <SongDetails song={history.song}/>
                                            </li>
                                        );
                                    })}
                                </ol>
                            )
                        }
                    </div>
                </div>
            </div>
        );
    }

    loadQueue() {
        console.info('[Player] loadQueue...');
        fetch('/load/queue')
            .then(r => r.json())
            .then(data => {
                console.info('[Player] loadQueue: ', data.length, data[0]);
                this.setState({'queue': data});
                this.playNext();
                this.getSelections();
                this.loadHistories();
            })
            .catch((e) => {
                alert('Error loading queue');
                console.error('[Player] loadQueue: error', e);
            });
    }

    loadHistories() {
        console.info('[Player] loadHistories...');
        fetch('/load/histories')
            .then(r => r.json())
            .then(data => {
                console.info('[Player] loadHistories: ', data.length);
                this.setState({'histories': data});
            })
            .catch((e) => {
                alert('Error retrieving files');
                console.error('[Player] loadHistories: error', e);
            });
    }

    getSelections() {
        console.info('[Player] getSelection...');
        if (this.state.selections.length > 0) {
            console.info('[Player] getSelection: Already have selections');
            return;
        }
        if (this.state.queue.length > 4) {
            console.info('[Player] getSelection: Already have enough songs in queue');
            return;
        }
        fetch('/selection')
            .then(r => r.json())
            .then(data => {
                console.info('[Player] getSelection: success', data.length);
                this.setState({"selections": data});
            })
            .catch(e => {
                alert('Error retrieving selection files');
                console.error('[Player] getSelection: error', e);
            });
    }

    setSelection(song) {
        console.info('[Player] setSelection...');

        // remove from selection
        var selections = this.state.selections;
        var selection = selections.shift();
        this.setState({"selections": selections});
        console.info('[Player] setSelection: removed from selections', this.state.selections.length);

        let fd = new FormData();
        fd.append('winner', song.id);
        selection.forEach(function (loser) {
            fd.append('losers[]', loser.id);
        });

        fetch('/add/queue', {
            method: 'POST',
            body: fd
        })
            .then(() => this.loadQueue())
            .catch(e => {
                alert('Error updating selection');
                console.error('[Player] setSelection: error', e);
            });
    }

    playNext() {
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
        document.title = queue_first.song.name + ' ~' + queue_first.song.artist.name;
        this.notifyPing();
    }

    onEnded() {
        console.info('[Player] onEnded...');
        this.setState({"current": ""});
        document.title = "speler";

        // update backend
        let fd = new FormData();
        fd.append('id', this.state.queue[0].id);
        fetch('/ended', {
            method: 'POST',
            body: fd
        })
            .then(() => this.loadQueue())
            .catch(e => {
                alert('Error updating selection');
                console.error('[Player] setSelection: error', e);
            });
    }

    notifyPing() {
        console.info('[Player] Notifying ping...');
        if (this.state.selections.length < 1) {
            return false;
        }
        if (this.state.queue.length >= 4) {
            return false;
        }
        var audio_ping = new Audio('/static/sounds/ping.mp3');
        audio_ping.play();
    }

}
