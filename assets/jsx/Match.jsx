import React from "react";
import {freezer} from "./Freezer.jsx";
import SongDetails from "./SongDetails.jsx";


export default class Match extends React.Component{

    constructor(props) {
        super(props)
        this.state = {
            'match': null,
        }
    }

    componentDidMount() {
        freezer.on('match:changed', d => this.setState({'match': d}))
    }

    render() {
        const match = this.state.match
        console.info('[Match] render:', match)

        if (!match) {
            return null;
        }

        return (
            <div id="match">
                <h5><strong>Which song was the best?</strong></h5>
                <div className="btn-group btn-group-vertical">
                    {match.map(song => {
                        return (
                            <a key={song.id} onClick={() => freezer.emit('match:set', song)} className="btn btn-default" type="button">
                                <small><SongDetails song={song} /></small>
                            </a>
                        )
                    })}
                </div>
            </div>
        )
    }
}
