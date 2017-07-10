import React from "react";
import {freezer} from "./Freezer.jsx";
import SongDetails from "./SongDetails.jsx";


export default class History extends React.Component{

    constructor(props) {
        super(props)
        this.state = {
            'histories': [],
        }
    }

    componentDidMount() {
        freezer.on('histories:changed', r => this.setState({'histories': r}))
        freezer.emit('histories:load')
    }

    render() {
        const histories = this.state.histories
        let d = <p>no songs played recently</p>
        if (histories.length > 0) {
            d = <ul>
                {histories.map((history) => {
                    const history_hash = history.id + history.song.rating
                    console.info('history_hash', history_hash)
                    return (
                        <li key={history_hash}>
                            <SongDetails song={history.song} />
                        </li>
                    )
                })}
            </ul>
        }
        return (
            <div id="histories">
                <h5><strong>Recently Played:</strong></h5>
                {d}
            </div>
        )
    }
}
